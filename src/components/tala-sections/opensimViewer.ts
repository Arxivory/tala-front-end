import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

import { BODY_MOTION_INSIGHTS, getRangeColorRatio } from "@/data/body-map-insights";

const VTP_ROOT = "/data/opensim-models/vtp/";
const MODEL_URL = "/data/opensim-models/scaled_model.osim";
const MOTION_URL = "/data/opensim-models/opensim_motion.mot";
const BASE_BODY_COLOR = "#c5bfce";
const LOW_MOTION_COLOR = new THREE.Color("#f6bfd7");
const HIGH_MOTION_COLOR = new THREE.Color("#ffb17a");
const ASSUMED_BODY_COLOR = "#d8d3dd";
const SELECTED_BODIES = new Set([
  "pelvis",
  "torso",
  "femur_r",
  "femur_l",
  "tibia_r",
  "tibia_l",
  "patella_r",
  "patella_l",
  "talus_r",
  "talus_l",
  "calcn_r",
  "calcn_l",
  "toes_r",
  "toes_l",
  "humerus_r",
  "humerus_l",
  "ulna_r",
  "ulna_l",
  "radius_r",
  "radius_l",
]);

export type OpenSimViewerStatus =
  | { state: "loading" }
  | { state: "ready"; durationSeconds: number }
  | { state: "error"; message: string };

export interface OpenSimCoordinateRange {
  minimum: number;
  maximum: number;
}

export interface OpenSimViewerFrame {
  timeSeconds: number;
  frameIndex: number;
  coordinates: Map<string, number>;
  coordinateRanges: Map<string, OpenSimCoordinateRange>;
  inDegrees: boolean;
  angularCoordinates: Set<string>;
}

export interface OpenSimViewerCallbacks {
  onStatus: (status: OpenSimViewerStatus) => void;
  onBodySelect: (bodyName: string | null) => void;
  onFrame: (frame: OpenSimViewerFrame) => void;
}

export interface OpenSimViewerHandle {
  setHeatmapEnabled: (enabled: boolean) => void;
  setSelectedBody: (bodyName: string | null) => void;
  dispose: () => void;
}

type Vector3Tuple = [number, number, number];

type OpenSimFunction =
  | { kind: "linear"; coefficients: number[] }
  | { kind: "polynomial"; coefficients: number[] }
  | { kind: "spline"; x: number[]; y: number[] }
  | { kind: "constant"; value: number }
  | { kind: "multiplier"; scale: number; function: OpenSimFunction };

interface OpenSimGeometryDefinition {
  file: string;
  scale: Vector3Tuple;
  translation: Vector3Tuple;
  orientation: Vector3Tuple;
}

interface OpenSimBodyDefinition {
  name: string;
  geometries: OpenSimGeometryDefinition[];
}

interface OpenSimTransformAxis {
  kind: "rotation" | "translation";
  axis: Vector3Tuple;
  coordinates: string[];
  function: OpenSimFunction;
}

export interface OpenSimJointDefinition {
  name: string;
  type: string;
  parentBody: string;
  childBody: string;
  parentFrame: THREE.Matrix4;
  childFrame: THREE.Matrix4;
  axes: OpenSimTransformAxis[];
  coordinateName?: string;
}

export interface OpenSimModelDefinition {
  bodies: Map<string, OpenSimBodyDefinition>;
  joints: OpenSimJointDefinition[];
  angularCoordinates: Set<string>;
}

interface JointRig {
  definition: OpenSimJointDefinition;
  transformGroup: THREE.Group;
}

interface ArticulatedRig {
  joints: JointRig[];
  model: OpenSimModelDefinition;
  rootHorizontalPositionAnchor: HorizontalPositionAnchor;
  materialsByBody: Map<string, THREE.MeshStandardMaterial>;
  coordinateRanges: Map<string, OpenSimCoordinateRange>;
}

interface HorizontalPositionAnchor {
  x: number;
  z: number;
}

export function createOpenSimViewer(
  container: HTMLElement,
  callbacks: OpenSimViewerCallbacks,
  getPlaybackTime: () => number,
): OpenSimViewerHandle {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#f7f4fa");

  const camera = new THREE.PerspectiveCamera(45, 1, 0.01, 50);
  camera.position.set(1.6, 1.3, -1.8);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.domElement.style.display = "block";
  container.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 0.8, 0);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.minDistance = 1;
  controls.maxDistance = 5;
  controls.maxPolarAngle = Math.PI / 2;

  scene.add(new THREE.HemisphereLight("#ffffff", "#d9d3e2", 2.2));

  const keyLight = new THREE.DirectionalLight("#ffffff", 2.4);
  keyLight.position.set(2, 3, 2);
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight("#d9c9f1", 1.1);
  fillLight.position.set(-2, 1.5, -2);
  scene.add(fillLight);

  const grid = new THREE.GridHelper(3, 30, "#a89ab8", "#ded8e5");
  grid.position.y = 0;
  scene.add(grid);

  const model = new THREE.Group();
  model.position.set(-0.3, -0.2, -0.5);
  scene.add(model);

  const abortController = new AbortController();
  let disposed = false;
  let animationFrame = 0;
  let motion: OpenSimMot | undefined;
  let rig: ArticulatedRig | undefined;
  let heatmapEnabled = false;
  let selectedBodyName: string | null = null;
  let lastReportedFrameIndex = -1;
  let selectableMeshes: THREE.Mesh[] = [];
  let bodyMaterials = new Map<string, THREE.MeshStandardMaterial>();
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  let pointerStart: { x: number; y: number; pointerId: number } | undefined;

  const resizeObserver = new ResizeObserver(() => {
    const width = container.clientWidth;
    const height = container.clientHeight;
    if (!width || !height) return;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  });
  resizeObserver.observe(container);

  const render = () => {
    if (disposed) return;
    animationFrame = window.requestAnimationFrame(render);
    controls.update();
    if (motion && rig) {
      const timeSeconds = motion.startTime + getPlaybackTime();
      const coordinates = applyMotionFrame(
        rig,
        motion,
        timeSeconds,
        heatmapEnabled,
        selectedBodyName,
      );
      const frameIndex = findNearestMotionFrameIndex(motion, timeSeconds);
      if (frameIndex !== lastReportedFrameIndex) {
        lastReportedFrameIndex = frameIndex;
        callbacks.onFrame({
          timeSeconds,
          frameIndex,
          coordinates,
          coordinateRanges: rig.coordinateRanges,
          inDegrees: motion.inDegrees,
          angularCoordinates: rig.model.angularCoordinates,
        });
      }
    }
    renderer.render(scene, camera);
  };
  render();

  void loadModel(abortController.signal)
    .then(({ meshesByBody, materialsByBody, parsedMotion, parsedModel }) => {
      if (disposed) {
        disposeMeshes(meshesByBody);
        materialsByBody.forEach((material) => material.dispose());
        return;
      }
      motion = parsedMotion;
      bodyMaterials = materialsByBody;
      selectableMeshes = Array.from(meshesByBody.values()).flat();
      rig = buildArticulatedRig(model, parsedModel, meshesByBody, parsedMotion, materialsByBody);
      callbacks.onStatus({
        state: "ready",
        durationSeconds: parsedMotion.endTime - parsedMotion.startTime,
      });
    })
    .catch((error: unknown) => {
      if (disposed || abortController.signal.aborted) return;
      callbacks.onStatus({
        state: "error",
        message:
          error instanceof Error
            ? error.message
            : "Unable to initialize the OpenSim motion mirror.",
      });
    });

  const selectBody = (bodyName: string | null) => {
    if (bodyName !== null && !rig?.model.bodies.has(bodyName)) {
      throw new Error(`OpenSim body ${bodyName} is not available in the viewer.`);
    }
    selectedBodyName = bodyName;
    callbacks.onBodySelect(bodyName);
  };

  const handlePointerDown = (event: PointerEvent) => {
    if (event.button !== 0) return;
    pointerStart = { x: event.clientX, y: event.clientY, pointerId: event.pointerId };
  };

  const handlePointerUp = (event: PointerEvent) => {
    const start = pointerStart;
    pointerStart = undefined;
    if (
      !start ||
      start.pointerId !== event.pointerId ||
      event.button !== 0 ||
      Math.hypot(event.clientX - start.x, event.clientY - start.y) > 6
    ) {
      return;
    }
    const bounds = renderer.domElement.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return;
    pointer.set(
      ((event.clientX - bounds.left) / bounds.width) * 2 - 1,
      -((event.clientY - bounds.top) / bounds.height) * 2 + 1,
    );
    model.updateMatrixWorld(true);
    raycaster.setFromCamera(pointer, camera);
    const hit = raycaster.intersectObjects(selectableMeshes, false)[0];
    const bodyName = hit?.object.userData["openSimBodyName"];
    selectBody(typeof bodyName === "string" ? bodyName : null);
  };

  renderer.domElement.addEventListener("pointerdown", handlePointerDown);
  renderer.domElement.addEventListener("pointerup", handlePointerUp);

  return {
    setHeatmapEnabled(enabled: boolean) {
      heatmapEnabled = enabled;
    },
    setSelectedBody: selectBody,
    dispose() {
      disposed = true;
      abortController.abort();
      window.cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      controls.dispose();
      renderer.domElement.removeEventListener("pointerdown", handlePointerDown);
      renderer.domElement.removeEventListener("pointerup", handlePointerUp);
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) object.geometry.dispose();
        if (object instanceof THREE.LineSegments) {
          object.geometry.dispose();
          const materials = Array.isArray(object.material) ? object.material : [object.material];
          materials.forEach((lineMaterial) => lineMaterial.dispose());
        }
      });
      bodyMaterials.forEach((material) => material.dispose());
      renderer.dispose();
      renderer.domElement.remove();
    },
  };

  async function loadModel(signal: AbortSignal) {
    const [modelResponse, motionResponse] = await Promise.all([
      fetch(MODEL_URL, { signal }),
      fetch(MOTION_URL, { signal }),
    ]);
    if (!modelResponse.ok) {
      throw new Error(`Failed to load the scaled OpenSim model (${modelResponse.status}).`);
    }
    if (!motionResponse.ok) {
      throw new Error(`Failed to load OpenSim motion data (${motionResponse.status}).`);
    }
    const [modelText, motionText] = await Promise.all([
      modelResponse.text(),
      motionResponse.text(),
    ]);
    const parsedModel = parseOpenSimModel(modelText);
    const parsedMotion = parseOpenSimMot(motionText);
    validateMotionCoordinates(parsedMotion, parsedModel);

    const bodyEntries = await Promise.all(
      Array.from(parsedModel.bodies.values()).map(async (body) => {
        const material = new THREE.MeshStandardMaterial({
          color: BASE_BODY_COLOR,
          roughness: 0.78,
          metalness: 0,
          side: THREE.DoubleSide,
        });
        const meshes = await Promise.all(
          body.geometries.map(async (geometryDefinition) => {
            const response = await fetch(`${VTP_ROOT}${geometryDefinition.file}`, { signal });
            if (!response.ok) {
              throw new Error(`Failed to load ${geometryDefinition.file} (${response.status}).`);
            }
            const geometry = parseVtpPolyData(await response.text(), geometryDefinition.file);
            geometry.applyMatrix4(geometryTransform(geometryDefinition));
            geometry.computeVertexNormals();
            const mesh = new THREE.Mesh(geometry, material);
            mesh.name = geometryDefinition.file;
            mesh.userData["openSimBodyName"] = body.name;
            return mesh;
          }),
        );
        return [body.name, { meshes, material }] as const;
      }),
    );
    const meshesByBody = new Map(
      bodyEntries.map(([bodyName, entry]) => [bodyName, entry.meshes] as const),
    );
    const materialsByBody = new Map(
      bodyEntries.map(([bodyName, entry]) => [bodyName, entry.material] as const),
    );
    return {
      meshesByBody,
      materialsByBody,
      parsedMotion,
      parsedModel,
    };
  }
}

interface OpenSimMot {
  columns: string[];
  columnIndices: Map<string, number>;
  frames: number[][];
  inDegrees: boolean;
  startTime: number;
  endTime: number;
}

export function parseOpenSimMot(contents: string): OpenSimMot {
  const lines = contents.replace(/^\uFEFF/, "").split(/\r?\n/);
  const headerEndIndex = lines.findIndex((line) => line.trim().toLowerCase() === "endheader");
  if (headerEndIndex < 0) {
    throw new Error("OpenSim motion file is missing its endheader marker.");
  }

  const header = lines.slice(0, headerEndIndex);
  const degreesLine = header.find((line) => /^\s*inDegrees\s*=/i.test(line));
  const degreesMatch = degreesLine?.match(/^\s*inDegrees\s*=\s*(yes|no)\s*$/i);
  if (degreesLine && !degreesMatch) {
    throw new Error("OpenSim motion file has an invalid inDegrees value.");
  }

  const dataLines = lines
    .slice(headerEndIndex + 1)
    .filter((line) => line.trim() && !line.trim().startsWith("#"));
  const columns = dataLines[0]?.trim().split(/\s+/);
  if (!columns?.length || columns[0]?.toLowerCase() !== "time") {
    throw new Error("OpenSim motion file must begin with a time column.");
  }
  if (new Set(columns).size !== columns.length) {
    throw new Error("OpenSim motion file contains duplicate column names.");
  }

  const declaredColumnCount = readHeaderCount(header, "nColumns");
  if (declaredColumnCount !== undefined && declaredColumnCount !== columns.length) {
    throw new Error("OpenSim motion file column count does not match its header.");
  }

  const frames = dataLines.slice(1).map((line, rowIndex) => {
    const values = line.trim().split(/\s+/).map(Number);
    if (values.length !== columns.length || values.some((value) => !Number.isFinite(value))) {
      throw new Error(`OpenSim motion file contains an invalid data row (${rowIndex + 1}).`);
    }
    return values;
  });

  const declaredRowCount = readHeaderCount(header, "nRows");
  if (!frames.length || (declaredRowCount !== undefined && declaredRowCount !== frames.length)) {
    throw new Error("OpenSim motion file row count does not match its header.");
  }

  let previousTime = Number.NEGATIVE_INFINITY;
  for (const frame of frames) {
    const time = frame[0];
    if (time === undefined || time <= previousTime) {
      throw new Error("OpenSim motion times must be strictly increasing.");
    }
    previousTime = time;
  }
  const firstFrame = frames[0];
  const lastFrame = frames[frames.length - 1];
  const startTime = firstFrame?.[0];
  const endTime = lastFrame?.[0];
  if (startTime === undefined || endTime === undefined) {
    throw new Error("OpenSim motion file does not contain valid time samples.");
  }

  return {
    columns,
    columnIndices: new Map(columns.map((column, index) => [column, index])),
    frames,
    inDegrees: degreesMatch?.[1]?.toLowerCase() === "yes",
    startTime,
    endTime,
  };
}

export function sampleOpenSimMot(motion: OpenSimMot, time: number) {
  if (!Number.isFinite(time)) {
    throw new Error("OpenSim motion sample time must be finite.");
  }
  const clampedTime = THREE.MathUtils.clamp(time, motion.startTime, motion.endTime);
  let low = 0;
  let high = motion.frames.length - 1;
  while (low < high - 1) {
    const middle = Math.floor((low + high) / 2);
    const middleTime = motion.frames[middle]?.[0];
    if (middleTime === undefined) {
      throw new Error("OpenSim motion file contains an invalid time sample.");
    }
    if (middleTime <= clampedTime) low = middle;
    else high = middle;
  }

  const firstFrame = motion.frames[low];
  const secondFrame = motion.frames[high];
  if (!firstFrame || !secondFrame) {
    throw new Error("OpenSim motion file does not contain enough samples.");
  }
  const firstTime = firstFrame[0];
  const secondTime = secondFrame[0];
  if (firstTime === undefined || secondTime === undefined) {
    throw new Error("OpenSim motion file contains an invalid time sample.");
  }
  const fraction =
    firstTime === secondTime ? 0 : (clampedTime - firstTime) / (secondTime - firstTime);
  const sampled = new Map<string, number>();

  for (const [column, index] of motion.columnIndices) {
    const firstValue = firstFrame[index];
    const secondValue = secondFrame[index];
    if (firstValue === undefined || secondValue === undefined) {
      throw new Error(`OpenSim motion file is missing a value for ${column}.`);
    }
    sampled.set(column, THREE.MathUtils.lerp(firstValue, secondValue, fraction));
  }

  return sampled;
}

function readHeaderCount(header: string[], name: string) {
  const line = header.find((entry) => new RegExp(`^\\s*${name}\\s*=`, "i").test(entry));
  if (!line) return undefined;
  const value = Number(line.split("=")[1]?.trim());
  if (!Number.isInteger(value) || value < 0) {
    throw new Error(`OpenSim motion file has an invalid ${name} value.`);
  }
  return value;
}

export function parseOpenSimModel(contents: string): OpenSimModelDefinition {
  const document = new DOMParser().parseFromString(contents, "application/xml");
  if (document.querySelector("parsererror")) {
    throw new Error("Could not parse the scaled OpenSim model.");
  }
  const modelElement =
    document.querySelector("OpenSimDocument > Model") ?? document.querySelector("Model");
  if (!modelElement) {
    throw new Error("OpenSim model file is missing its Model element.");
  }

  const bodySet = childElement(modelElement, "BodySet");
  const bodyObjects = bodySet && childElement(bodySet, "objects");
  if (!bodyObjects) {
    throw new Error("OpenSim model is missing its BodySet.");
  }

  const bodies = new Map<string, OpenSimBodyDefinition>();
  for (const bodyElement of childElements(bodyObjects, "Body")) {
    const name = bodyElement.getAttribute("name");
    if (!name || !SELECTED_BODIES.has(name)) continue;
    const geometryContainer = childElement(bodyElement, "attached_geometry");
    const geometries = geometryContainer
      ? childElements(geometryContainer, "Mesh").map((meshElement) => {
          const file = readElementText(meshElement, "mesh_file");
          const socketFrame = readElementText(meshElement, "socket_frame", false) || "..";
          if (socketFrame !== ".." && socketFrame !== name) {
            throw new Error(`OpenSim mesh ${file} uses unsupported socket frame ${socketFrame}.`);
          }
          return {
            file,
            scale: readVector(meshElement, "scale_factors", [1, 1, 1]),
            translation: readVector(meshElement, "translation", [0, 0, 0]),
            orientation: readVector(meshElement, "orientation", [0, 0, 0]),
          };
        })
      : [];
    if (!geometries.length) {
      throw new Error(`OpenSim body ${name} has no attached VTP geometry.`);
    }
    bodies.set(name, { name, geometries });
  }

  const missingBodies = Array.from(SELECTED_BODIES).filter((name) => !bodies.has(name));
  if (missingBodies.length) {
    throw new Error(`OpenSim model is missing selected bodies: ${missingBodies.join(", ")}.`);
  }

  const jointSet = childElement(modelElement, "JointSet");
  const jointObjects = jointSet && childElement(jointSet, "objects");
  if (!jointObjects) {
    throw new Error("OpenSim model is missing its JointSet.");
  }

  const joints: OpenSimJointDefinition[] = [];
  const angularCoordinates = new Set<string>();
  for (const jointElement of Array.from(jointObjects.children)) {
    const type = jointElement.tagName;
    const name = jointElement.getAttribute("name") ?? type;
    const parentSocket = readElementText(jointElement, "socket_parent_frame");
    const childSocket = readElementText(jointElement, "socket_child_frame");
    const parentFrame = resolveJointFrame(jointElement, parentSocket);
    const childFrame = resolveJointFrame(jointElement, childSocket);
    if (
      !bodies.has(childFrame.bodyName) ||
      (parentFrame.bodyName !== "ground" && !bodies.has(parentFrame.bodyName))
    ) {
      continue;
    }

    let axes: OpenSimTransformAxis[] = [];
    let coordinateName: string | undefined;
    if (type === "CustomJoint") {
      const spatialTransform = childElement(jointElement, "SpatialTransform");
      if (!spatialTransform) {
        throw new Error(`OpenSim custom joint ${name} is missing its SpatialTransform.`);
      }
      axes = childElements(spatialTransform, "TransformAxis").map((axisElement) => {
        const axisName = axisElement.getAttribute("name") ?? "";
        const kind = axisName.startsWith("rotation")
          ? "rotation"
          : axisName.startsWith("translation")
            ? "translation"
            : undefined;
        if (!kind) {
          throw new Error(`OpenSim joint ${name} contains an unrecognized transform axis.`);
        }
        const coordinates = parseCoordinateNames(
          readElementText(axisElement, "coordinates", false),
        );
        if (kind === "rotation") {
          coordinates.forEach((coordinate) => angularCoordinates.add(coordinate));
        }
        return {
          kind,
          axis: readVector(axisElement, "axis"),
          coordinates,
          function: parseOpenSimFunction(axisElement),
        };
      });
    } else if (type === "PinJoint") {
      const coordinateContainer = childElement(jointElement, "coordinates");
      const coordinate = coordinateContainer
        ? childElements(coordinateContainer, "Coordinate")[0]
        : undefined;
      coordinateName = coordinate?.getAttribute("name") ?? undefined;
      if (!coordinateName) {
        throw new Error(`OpenSim pin joint ${name} is missing its coordinate.`);
      }
      angularCoordinates.add(coordinateName);
    } else if (type !== "WeldJoint") {
      throw new Error(`OpenSim joint type ${type} is not supported for ${name}.`);
    }

    joints.push({
      name,
      type,
      parentBody: parentFrame.bodyName,
      childBody: childFrame.bodyName,
      parentFrame: parentFrame.transform,
      childFrame: childFrame.transform,
      axes,
      ...(coordinateName ? { coordinateName } : {}),
    });
  }

  return { bodies, joints, angularCoordinates };
}

function validateMotionCoordinates(motion: OpenSimMot, model: OpenSimModelDefinition) {
  const required = new Set<string>();
  for (const joint of model.joints) {
    if (joint.coordinateName) required.add(joint.coordinateName);
    joint.axes.forEach((axis) =>
      axis.coordinates.forEach((coordinate) => required.add(coordinate)),
    );
  }
  const missing = Array.from(required).filter(
    (coordinate) => !motion.columnIndices.has(coordinate),
  );
  if (missing.length) {
    throw new Error(`OpenSim motion file is missing required coordinates: ${missing.join(", ")}.`);
  }
}

function buildArticulatedRig(
  root: THREE.Group,
  model: OpenSimModelDefinition,
  meshesByBody: Map<string, THREE.Mesh[]>,
  motion: OpenSimMot,
  materialsByBody: Map<string, THREE.MeshStandardMaterial>,
): ArticulatedRig {
  const bodyGroups = new Map<string, THREE.Group>();
  for (const body of model.bodies.values()) {
    const bodyGroup = new THREE.Group();
    bodyGroup.name = body.name;
    const meshes = meshesByBody.get(body.name);
    if (!meshes?.length) {
      throw new Error(`OpenSim geometry for body ${body.name} is missing.`);
    }
    meshes.forEach((mesh) => bodyGroup.add(mesh));
    bodyGroups.set(body.name, bodyGroup);
  }

  const attachedBodies = new Set<string>();
  const pendingJoints = [...model.joints];
  const joints: JointRig[] = [];
  while (pendingJoints.length) {
    let attachedInPass = false;
    for (let index = pendingJoints.length - 1; index >= 0; index--) {
      const definition = pendingJoints[index];
      if (!definition) continue;
      if (attachedBodies.has(definition.childBody)) {
        throw new Error(`OpenSim body ${definition.childBody} has multiple parent joints.`);
      }
      const parentGroup =
        definition.parentBody === "ground" ? root : bodyGroups.get(definition.parentBody);
      if (
        !parentGroup ||
        (definition.parentBody !== "ground" && !attachedBodies.has(definition.parentBody))
      ) {
        continue;
      }
      const childGroup = bodyGroups.get(definition.childBody);
      if (!childGroup) {
        throw new Error(`OpenSim body ${definition.childBody} is missing from the viewer.`);
      }
      const transformGroup = new THREE.Group();
      transformGroup.name = definition.name;
      transformGroup.matrixAutoUpdate = false;
      parentGroup.add(transformGroup);
      transformGroup.add(childGroup);
      attachedBodies.add(definition.childBody);
      joints.push({ definition, transformGroup });
      pendingJoints.splice(index, 1);
      attachedInPass = true;
    }
    if (!attachedInPass) {
      const unattached = pendingJoints.map((joint) => joint.childBody);
      throw new Error(`OpenSim body hierarchy could not be resolved: ${unattached.join(", ")}.`);
    }
  }

  if (attachedBodies.size !== model.bodies.size) {
    const unattached = Array.from(model.bodies.keys()).filter((name) => !attachedBodies.has(name));
    throw new Error(`OpenSim bodies are not connected to ground: ${unattached.join(", ")}.`);
  }
  return {
    joints,
    model,
    rootHorizontalPositionAnchor: createRootHorizontalPositionAnchor(model, motion),
    materialsByBody,
    coordinateRanges: buildCoordinateRanges(motion),
  };
}

function buildCoordinateRanges(motion: OpenSimMot) {
  const ranges = new Map<string, OpenSimCoordinateRange>();
  for (const [coordinate, columnIndex] of motion.columnIndices) {
    if (coordinate === "time") continue;
    let minimum = Number.POSITIVE_INFINITY;
    let maximum = Number.NEGATIVE_INFINITY;
    for (const frame of motion.frames) {
      const value = frame[columnIndex];
      if (value === undefined || !Number.isFinite(value)) {
        throw new Error(`OpenSim motion file has an invalid value for ${coordinate}.`);
      }
      minimum = Math.min(minimum, value);
      maximum = Math.max(maximum, value);
    }
    ranges.set(coordinate, { minimum, maximum });
  }
  return ranges;
}

export function createRootHorizontalPositionAnchor(
  model: OpenSimModelDefinition,
  motion: OpenSimMot,
): HorizontalPositionAnchor {
  const rootJoint = model.joints.find(
    (joint) => joint.parentBody === "ground" && joint.childBody === "pelvis",
  );
  if (!rootJoint) {
    throw new Error("OpenSim model is missing its ground-to-pelvis joint.");
  }
  if (!rootJoint.axes.some((axis) => axis.kind === "translation")) {
    throw new Error("OpenSim ground-to-pelvis joint has no translation coordinates to anchor.");
  }
  const initialFrame = sampleOpenSimMot(motion, motion.startTime);
  const initialTransform = evaluateOpenSimJointTransform(
    rootJoint,
    initialFrame,
    motion.inDegrees,
    model.angularCoordinates,
  );
  return {
    x: initialTransform.elements[12]!,
    z: initialTransform.elements[14]!,
  };
}

export function anchorRootHorizontalPosition(
  transform: THREE.Matrix4,
  anchor: HorizontalPositionAnchor,
) {
  const verticalPosition = transform.elements[13];
  if (verticalPosition === undefined) {
    throw new Error("OpenSim ground-to-pelvis transform is missing its vertical position.");
  }
  transform.setPosition(anchor.x, verticalPosition, anchor.z);
  return transform;
}

export function evaluateOpenSimJointTransform(
  joint: OpenSimJointDefinition,
  frame: Map<string, number>,
  inDegrees: boolean,
  angularCoordinates: Set<string>,
) {
  const motionTransform = new THREE.Matrix4();
  if (joint.type === "CustomJoint") {
    for (const axis of joint.axes) {
      const argument = axis.coordinates.map((name) =>
        readCoordinate(frame, name, inDegrees, angularCoordinates),
      );
      if (argument.length > 1) {
        throw new Error(
          `OpenSim transform ${joint.name} uses unsupported multi-dimensional functions.`,
        );
      }
      const value = evaluateOpenSimFunction(axis.function, argument[0] ?? 0);
      if (!Number.isFinite(value)) {
        throw new Error(`OpenSim transform ${joint.name} produced a non-finite value.`);
      }
      const direction = new THREE.Vector3(...axis.axis);
      const axisTransform = new THREE.Matrix4();
      if (axis.kind === "rotation") {
        if (direction.lengthSq() === 0) {
          throw new Error(`OpenSim transform ${joint.name} contains a zero rotation axis.`);
        }
        axisTransform.makeRotationAxis(direction.normalize(), value);
      } else {
        axisTransform.makeTranslation(
          direction.x * value,
          direction.y * value,
          direction.z * value,
        );
      }
      motionTransform.multiply(axisTransform);
    }
  } else if (joint.type === "PinJoint") {
    if (!joint.coordinateName) {
      throw new Error(`OpenSim pin joint ${joint.name} has no coordinate.`);
    }
    const angle = readCoordinate(frame, joint.coordinateName, inDegrees, angularCoordinates);
    motionTransform.makeRotationZ(angle);
  }

  return joint.parentFrame
    .clone()
    .multiply(motionTransform)
    .multiply(joint.childFrame.clone().invert());
}

function applyMotionFrame(
  rig: ArticulatedRig,
  motion: OpenSimMot,
  time: number,
  heatmapEnabled: boolean,
  selectedBodyName: string | null,
) {
  const frame = sampleOpenSimMot(motion, time);
  for (const joint of rig.joints) {
    const transform = evaluateOpenSimJointTransform(
      joint.definition,
      frame,
      motion.inDegrees,
      rig.model.angularCoordinates,
    );
    if (joint.definition.parentBody === "ground" && joint.definition.childBody === "pelvis") {
      anchorRootHorizontalPosition(transform, rig.rootHorizontalPositionAnchor);
    }
    joint.transformGroup.matrix.copy(transform);
    joint.transformGroup.matrixWorldNeedsUpdate = true;
  }
  updateBodyMaterials(rig, frame, heatmapEnabled, selectedBodyName);
  return frame;
}

function updateBodyMaterials(
  rig: ArticulatedRig,
  frame: Map<string, number>,
  heatmapEnabled: boolean,
  selectedBodyName: string | null,
) {
  for (const [bodyName, material] of rig.materialsByBody) {
    const insight = BODY_MOTION_INSIGHTS.find((entry) => entry.bodyName === bodyName);
    const coordinate = insight?.heatmapCoordinate;
    const value = coordinate ? frame.get(coordinate) : undefined;
    const range = coordinate ? rig.coordinateRanges.get(coordinate) : undefined;
    const colorRatio =
      heatmapEnabled && !insight?.unavailableNote && value !== undefined && range
        ? getRangeColorRatio(value, range.minimum, range.maximum)
        : undefined;

    if (colorRatio === undefined) {
      material.color.set(
        heatmapEnabled && insight?.unavailableNote ? ASSUMED_BODY_COLOR : BASE_BODY_COLOR,
      );
    } else {
      material.color.copy(LOW_MOTION_COLOR).lerp(HIGH_MOTION_COLOR, colorRatio);
    }
    material.emissive.set(bodyName === selectedBodyName ? "#8f315b" : "#000000");
    material.emissiveIntensity = bodyName === selectedBodyName ? 0.18 : 0;
  }
}

function findNearestMotionFrameIndex(motion: OpenSimMot, time: number) {
  const clampedTime = THREE.MathUtils.clamp(time, motion.startTime, motion.endTime);
  let low = 0;
  let high = motion.frames.length - 1;
  while (low < high - 1) {
    const middle = Math.floor((low + high) / 2);
    const middleTime = motion.frames[middle]?.[0];
    if (middleTime === undefined) {
      throw new Error("OpenSim motion file contains an invalid time sample.");
    }
    if (middleTime <= clampedTime) low = middle;
    else high = middle;
  }
  const lowTime = motion.frames[low]?.[0];
  const highTime = motion.frames[high]?.[0];
  if (lowTime === undefined || highTime === undefined) {
    throw new Error("OpenSim motion file does not contain valid time samples.");
  }
  return clampedTime - lowTime <= highTime - clampedTime ? low : high;
}

function resolveJointFrame(joint: Element, socketName: string) {
  const frames = childElement(joint, "frames");
  const frameElement = frames
    ? Array.from(frames.children).find((frame) => frame.getAttribute("name") === socketName)
    : undefined;
  if (!frameElement) {
    return {
      bodyName: bodyNameFromPath(socketName),
      transform: new THREE.Matrix4(),
    };
  }
  const bodyPath = readElementText(frameElement, "socket_parent");
  return {
    bodyName: bodyNameFromPath(bodyPath),
    transform: frameTransform(frameElement),
  };
}

function bodyNameFromPath(path: string) {
  if (path === "/ground" || path === "ground") return "ground";
  const bodysetMarker = "/bodyset/";
  const bodysetIndex = path.lastIndexOf(bodysetMarker);
  if (bodysetIndex >= 0) return path.slice(bodysetIndex + bodysetMarker.length).split("/")[0] ?? "";
  throw new Error(`OpenSim socket refers to an unsupported body path: ${path}.`);
}

function frameTransform(frame: Element) {
  const position = new THREE.Vector3(...readVector(frame, "translation", [0, 0, 0]));
  const orientation = readVector(frame, "orientation", [0, 0, 0]);
  const quaternion = new THREE.Quaternion().setFromEuler(new THREE.Euler(...orientation, "XYZ"));
  return new THREE.Matrix4().compose(position, quaternion, new THREE.Vector3(1, 1, 1));
}

function geometryTransform(geometry: OpenSimGeometryDefinition) {
  const position = new THREE.Vector3(...geometry.translation);
  const quaternion = new THREE.Quaternion().setFromEuler(
    new THREE.Euler(...geometry.orientation, "XYZ"),
  );
  const scale = new THREE.Vector3(...geometry.scale);
  return new THREE.Matrix4().compose(position, quaternion, scale);
}

function readCoordinate(
  frame: Map<string, number>,
  name: string,
  inDegrees: boolean,
  angularCoordinates: Set<string>,
) {
  const value = frame.get(name);
  if (value === undefined) {
    throw new Error(`OpenSim motion data is missing coordinate ${name}.`);
  }
  return inDegrees && angularCoordinates.has(name) ? THREE.MathUtils.degToRad(value) : value;
}

function evaluateOpenSimFunction(fn: OpenSimFunction, value: number): number {
  switch (fn.kind) {
    case "linear":
      return (fn.coefficients[0] ?? 0) * value + (fn.coefficients[1] ?? 0);
    case "polynomial":
      return fn.coefficients.reduceRight((result, coefficient) => result * value + coefficient, 0);
    case "spline":
      return evaluateSpline(fn.x, fn.y, value);
    case "constant":
      return fn.value;
    case "multiplier":
      return fn.scale * evaluateOpenSimFunction(fn.function, value);
  }
}

function evaluateSpline(xValues: number[], yValues: number[], value: number) {
  if (xValues.length !== yValues.length || xValues.length < 2) {
    throw new Error("OpenSim spline function has invalid control points.");
  }
  const count = xValues.length;
  const diagonal = Array<number>(count).fill(0);
  const secondDerivatives = Array<number>(count).fill(0);
  const intervalWidths = Array<number>(count).fill(0);

  const firstX = xValues[0]!;
  const lastX = xValues[count - 1]!;
  const firstY = yValues[0]!;
  const lastY = yValues[count - 1]!;

  if (count === 2) {
    const width = xValues[1]! - firstX;
    const slope = (yValues[1]! - firstY) / width;
    if (value < firstX) return firstY + (value - firstX) * slope;
    if (value > lastX) return lastY + (value - lastX) * slope;
    return firstY + (value - firstX) * slope;
  }

  intervalWidths[0] = xValues[1]! - firstX;
  secondDerivatives[1] = (yValues[1]! - firstY) / intervalWidths[0]!;
  for (let index = 1; index < count - 1; index++) {
    intervalWidths[index] = xValues[index + 1]! - xValues[index]!;
    diagonal[index] = 2 * (intervalWidths[index - 1]! + intervalWidths[index]!);
    secondDerivatives[index + 1] = (yValues[index + 1]! - yValues[index]!) / intervalWidths[index]!;
    secondDerivatives[index] = secondDerivatives[index]! - secondDerivatives[index + 1]!;
  }
  diagonal[0] = -intervalWidths[0]!;
  diagonal[count - 1] = -intervalWidths[count - 2]!;

  if (count > 3) {
    const previousSpan = xValues[3]! - xValues[1]!;
    const firstSpan = xValues[2]! - xValues[0]!;
    const lastSpan = xValues[count - 1]! - xValues[count - 3]!;
    const penultimateSpan = xValues[count - 2]! - xValues[count - 4]!;
    const firstFullSpan = xValues[3]! - xValues[0]!;
    const lastFullSpan = xValues[count - 1]! - xValues[count - 4]!;
    secondDerivatives[0] =
      (secondDerivatives[2]! / previousSpan - secondDerivatives[1]! / firstSpan) *
      (intervalWidths[0]! ** 2 / firstFullSpan);
    secondDerivatives[count - 1] =
      -(
        secondDerivatives[count - 2]! / lastSpan -
        secondDerivatives[count - 3]! / penultimateSpan
      ) *
      (intervalWidths[count - 2]! ** 2 / lastFullSpan);
  }

  for (let index = 1; index < count; index++) {
    const factor = intervalWidths[index - 1]! / diagonal[index - 1]!;
    diagonal[index] = diagonal[index]! - factor * intervalWidths[index - 1]!;
    secondDerivatives[index] = secondDerivatives[index]! - factor * secondDerivatives[index - 1]!;
  }
  secondDerivatives[count - 1] = secondDerivatives[count - 1]! / diagonal[count - 1]!;
  for (let index = count - 2; index >= 0; index--) {
    secondDerivatives[index] =
      (secondDerivatives[index]! - intervalWidths[index]! * secondDerivatives[index + 1]!) /
      diagonal[index]!;
  }

  const slopes = Array<number>(count).fill(0);
  const cubicTerms = Array<number>(count).fill(0);
  slopes[count - 1] =
    (lastY - yValues[count - 2]!) / intervalWidths[count - 2]! +
    intervalWidths[count - 2]! *
      (secondDerivatives[count - 2]! + 2 * secondDerivatives[count - 1]!);
  for (let index = 0; index < count - 1; index++) {
    slopes[index] =
      (yValues[index + 1]! - yValues[index]!) / intervalWidths[index]! -
      intervalWidths[index]! * (secondDerivatives[index + 1]! + 2 * secondDerivatives[index]!);
    cubicTerms[index] =
      (secondDerivatives[index + 1]! - secondDerivatives[index]!) / intervalWidths[index]!;
    secondDerivatives[index] = secondDerivatives[index]! * 3;
  }
  secondDerivatives[count - 1] = secondDerivatives[count - 1]! * 3;
  cubicTerms[count - 1] = cubicTerms[count - 2]!;

  if (value < firstX) return firstY + (value - firstX) * slopes[0]!;
  if (value > lastX) return lastY + (value - lastX) * slopes[count - 1]!;
  if (value === firstX) return firstY;
  if (value === lastX) return lastY;

  let interval = 0;
  while (value > xValues[interval + 1]!) interval++;
  const dx = value - xValues[interval]!;
  return (
    yValues[interval]! +
    dx * (slopes[interval]! + dx * (secondDerivatives[interval]! + dx * cubicTerms[interval]!))
  );
}

function parseOpenSimFunction(axis: Element): OpenSimFunction {
  const functionElement = Array.from(axis.children).find((element) =>
    [
      "LinearFunction",
      "PolynomialFunction",
      "SimmSpline",
      "Constant",
      "MultiplierFunction",
    ].includes(element.tagName),
  );
  if (!functionElement) {
    throw new Error("OpenSim transform axis is missing its function.");
  }
  if (functionElement.tagName === "MultiplierFunction") {
    const functionContainer = childElement(functionElement, "function");
    const innerFunction = functionContainer && Array.from(functionContainer.children)[0];
    if (!innerFunction) {
      throw new Error("OpenSim multiplier function is missing its nested function.");
    }
    const scale = Number(readElementText(functionElement, "scale"));
    if (!Number.isFinite(scale)) {
      throw new Error("OpenSim multiplier function has an invalid scale.");
    }
    return {
      kind: "multiplier",
      scale,
      function: parseFunctionElement(innerFunction),
    };
  }
  return parseFunctionElement(functionElement);
}

function parseFunctionElement(element: Element): OpenSimFunction {
  if (element.tagName === "MultiplierFunction") {
    const functionContainer = childElement(element, "function");
    const innerFunction = functionContainer && Array.from(functionContainer.children)[0];
    if (!innerFunction) {
      throw new Error("OpenSim multiplier function is missing its nested function.");
    }
    return {
      kind: "multiplier",
      scale: Number(readElementText(element, "scale")),
      function: parseFunctionElement(innerFunction),
    };
  }
  if (element.tagName === "LinearFunction" || element.tagName === "PolynomialFunction") {
    const coefficients = parseNumbers(readElementText(element, "coefficients"));
    if (!coefficients.length || coefficients.some((coefficient) => !Number.isFinite(coefficient))) {
      throw new Error(`OpenSim ${element.tagName} has invalid coefficients.`);
    }
    return {
      kind: element.tagName === "LinearFunction" ? "linear" : "polynomial",
      coefficients,
    };
  }
  if (element.tagName === "SimmSpline") {
    const x = parseNumbers(readElementText(element, "x"));
    const y = parseNumbers(readElementText(element, "y"));
    if (
      x.length < 2 ||
      x.length !== y.length ||
      x.some(
        (value, index) =>
          !Number.isFinite(value) || (index > 0 && value <= (x[index - 1] ?? value)),
      ) ||
      y.some((value) => !Number.isFinite(value))
    ) {
      throw new Error("OpenSim spline function has invalid control points.");
    }
    return { kind: "spline", x, y };
  }
  if (element.tagName === "Constant") {
    const value = Number(readElementText(element, "value"));
    if (!Number.isFinite(value)) {
      throw new Error("OpenSim constant function has an invalid value.");
    }
    return { kind: "constant", value };
  }
  throw new Error(`OpenSim function type ${element.tagName} is not supported.`);
}

function parseCoordinateNames(value: string) {
  return value.trim().split(/\s+/).filter(Boolean);
}

function readVector(parent: Element, name: string, defaultValue?: Vector3Tuple): Vector3Tuple {
  const element = childElement(parent, name);
  if (!element && defaultValue) return defaultValue;
  if (!element) {
    throw new Error(`OpenSim model is missing its ${name} vector.`);
  }
  const values = parseNumbers(element.textContent ?? "");
  if (values.length !== 3 || values.some((value) => !Number.isFinite(value))) {
    throw new Error(`OpenSim model has an invalid ${name} vector.`);
  }
  return [values[0]!, values[1]!, values[2]!];
}

function childElement(parent: Element, name: string) {
  return Array.from(parent.children).find((element) => element.tagName === name);
}

function childElements(parent: Element, name: string) {
  return Array.from(parent.children).filter((element) => element.tagName === name);
}

function readElementText(parent: Element, name: string, required = true) {
  const element = childElement(parent, name);
  const value = element?.textContent?.trim() ?? "";
  if (required && !value) {
    throw new Error(`OpenSim model is missing its ${name} value.`);
  }
  return value;
}

function disposeMeshes(meshesByBody: Map<string, THREE.Mesh[]>) {
  for (const meshes of meshesByBody.values()) {
    meshes.forEach((mesh) => mesh.geometry.dispose());
  }
}

export function parseVtpPolyData(xmlText: string, fileName: string) {
  const document = new DOMParser().parseFromString(xmlText, "application/xml");
  if (document.querySelector("parsererror")) {
    throw new Error(`Could not parse VTP file ${fileName}.`);
  }

  const pointsElement = document.querySelector("Points DataArray");
  const connectivityElement = document.querySelector('Polys DataArray[Name="connectivity"]');
  const offsetsElement = document.querySelector('Polys DataArray[Name="offsets"]');
  if (!pointsElement || !connectivityElement || !offsetsElement) {
    throw new Error(`VTP file ${fileName} is missing point or polygon data.`);
  }
  if (
    [pointsElement, connectivityElement, offsetsElement].some(
      (element) => element.getAttribute("format") !== "ascii",
    )
  ) {
    throw new Error(`VTP file ${fileName} uses an unsupported non-ASCII data format.`);
  }

  const points = parseNumbers(pointsElement.textContent ?? "");
  const connectivity = parseNumbers(connectivityElement.textContent ?? "");
  const offsets = parseNumbers(offsetsElement.textContent ?? "");
  if (
    points.length % 3 !== 0 ||
    !points.length ||
    !connectivity.length ||
    !offsets.length ||
    points.some((coordinate) => !Number.isFinite(coordinate))
  ) {
    throw new Error(`VTP file ${fileName} contains invalid geometry arrays.`);
  }
  if (
    connectivity.some(
      (index) => !Number.isInteger(index) || index < 0 || index >= points.length / 3,
    )
  ) {
    throw new Error(`VTP file ${fileName} contains an invalid polygon index.`);
  }

  const triangles: number[] = [];
  let start = 0;
  for (const end of offsets) {
    if (!Number.isInteger(end) || end > connectivity.length || end - start < 3) {
      throw new Error(`VTP file ${fileName} contains invalid polygon offsets.`);
    }
    const firstIndex = connectivity[start];
    if (firstIndex === undefined) {
      throw new Error(`VTP file ${fileName} contains invalid polygon indices.`);
    }
    for (let index = start + 1; index < end - 1; index++) {
      const currentIndex = connectivity[index];
      const nextIndex = connectivity[index + 1];
      if (currentIndex === undefined || nextIndex === undefined) {
        throw new Error(`VTP file ${fileName} contains invalid polygon indices.`);
      }
      triangles.push(firstIndex, currentIndex, nextIndex);
    }
    start = end;
  }
  if (start !== connectivity.length) {
    throw new Error(`VTP file ${fileName} contains unreferenced polygon indices.`);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(points, 3));
  geometry.setIndex(triangles);
  geometry.computeVertexNormals();
  return geometry;
}

function parseNumbers(value: string) {
  return value.trim().split(/\s+/).filter(Boolean).map(Number);
}
