import { describe, expect, it } from "vitest";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import * as THREE from "three";

import {
  anchorRootHorizontalPosition,
  createRootHorizontalPositionAnchor,
  evaluateOpenSimJointTransform,
  parseOpenSimModel,
  parseOpenSimMot,
  parseVtpPolyData,
  sampleOpenSimMot,
} from "@/components/tala-sections/opensimViewer";

describe("OpenSim model parser", () => {
  it("uses the supplied body geometry and joint frames", async () => {
    const modelText = await readFile(
      resolve(process.cwd(), "public", "data", "opensim-models", "scaled_model.osim"),
      "utf8",
    );
    const model = parseOpenSimModel(modelText);
    const rightFemur = model.bodies.get("femur_r");
    const rightHip = model.joints.find((joint) => joint.name === "hip_r");

    expect(rightFemur?.geometries[0]?.file).toBe("r_femur.vtp");
    expect(rightFemur?.geometries[0]?.scale[1]).toBeCloseTo(0.9365836604);
    expect(rightHip?.parentBody).toBe("pelvis");
    expect(rightHip?.childBody).toBe("femur_r");
  });

  it("evaluates model-defined nonlinear knee transforms from MOT coordinates", async () => {
    const modelText = await readFile(
      resolve(process.cwd(), "public", "data", "opensim-models", "scaled_model.osim"),
      "utf8",
    );
    const model = parseOpenSimModel(modelText);
    const knee = model.joints.find((joint) => joint.name === "walker_knee_r");
    if (!knee) throw new Error("The supplied model is missing its right knee joint.");

    const neutral = evaluateOpenSimJointTransform(
      knee,
      new Map([["knee_angle_r", 0]]),
      true,
      model.angularCoordinates,
    );
    const flexed = evaluateOpenSimJointTransform(
      knee,
      new Map([["knee_angle_r", 60]]),
      true,
      model.angularCoordinates,
    );

    expect(
      flexed.elements.some((value, index) => Math.abs(value - neutral.elements[index]!) > 1e-5),
    ).toBe(true);
    expect(flexed.elements.every(Number.isFinite)).toBe(true);

    const patella = model.joints.find((joint) => joint.name === "patellofemoral_r");
    if (!patella) throw new Error("The supplied model is missing its right patella joint.");
    const patellaTransform = evaluateOpenSimJointTransform(
      patella,
      new Map([["knee_angle_r_beta", 10]]),
      true,
      model.angularCoordinates,
    );
    expect(Math.atan2(patellaTransform.elements[1]!, patellaTransform.elements[0]!)).toBeCloseTo(
      -0.00629212,
      6,
    );
  });

  it("evaluates every selected model joint at a supplied motion sample", async () => {
    const [modelText, motionText] = await Promise.all([
      readFile(
        resolve(process.cwd(), "public", "data", "opensim-models", "scaled_model.osim"),
        "utf8",
      ),
      readFile(
        resolve(process.cwd(), "public", "data", "opensim-models", "opensim_motion.mot"),
        "utf8",
      ),
    ]);
    const model = parseOpenSimModel(modelText);
    const motion = parseOpenSimMot(motionText);
    const frame = sampleOpenSimMot(motion, motion.startTime);

    for (const joint of model.joints) {
      const transform = evaluateOpenSimJointTransform(
        joint,
        frame,
        motion.inDegrees,
        model.angularCoordinates,
      );
      expect(transform.elements.every(Number.isFinite)).toBe(true);
    }
  });

  it("anchors pelvis horizontal drift while preserving MOT-driven vertical movement", async () => {
    const [modelText, motionText] = await Promise.all([
      readFile(
        resolve(process.cwd(), "public", "data", "opensim-models", "scaled_model.osim"),
        "utf8",
      ),
      readFile(
        resolve(process.cwd(), "public", "data", "opensim-models", "opensim_motion.mot"),
        "utf8",
      ),
    ]);
    const model = parseOpenSimModel(modelText);
    const motion = parseOpenSimMot(motionText);
    const rootJoint = model.joints.find(
      (joint) => joint.parentBody === "ground" && joint.childBody === "pelvis",
    );
    if (!rootJoint) throw new Error("The supplied model is missing its ground-to-pelvis joint.");
    const positionAnchor = createRootHorizontalPositionAnchor(model, motion);
    const firstFrame = sampleOpenSimMot(motion, motion.startTime);
    const lastFrame = sampleOpenSimMot(motion, motion.endTime);

    const firstTransform = evaluateOpenSimJointTransform(
      rootJoint,
      firstFrame,
      motion.inDegrees,
      model.angularCoordinates,
    );
    const lastTransform = evaluateOpenSimJointTransform(
      rootJoint,
      lastFrame,
      motion.inDegrees,
      model.angularCoordinates,
    );
    const firstVerticalPosition = firstTransform.elements[13]!;
    const lastVerticalPosition = lastTransform.elements[13]!;
    anchorRootHorizontalPosition(firstTransform, positionAnchor);
    anchorRootHorizontalPosition(lastTransform, positionAnchor);

    expect(firstTransform.elements[12]).toBe(positionAnchor.x);
    expect(lastTransform.elements[12]).toBe(positionAnchor.x);
    expect(firstTransform.elements[14]).toBe(positionAnchor.z);
    expect(lastTransform.elements[14]).toBe(positionAnchor.z);
    expect(firstTransform.elements[13]).toBe(firstVerticalPosition);
    expect(lastTransform.elements[13]).toBe(lastVerticalPosition);
    expect(Math.abs(firstVerticalPosition - lastVerticalPosition)).toBeGreaterThan(1e-5);
    expect(
      firstTransform.elements
        .slice(0, 12)
        .some((value, index) => Math.abs(value - lastTransform.elements[index]!) > 1e-5),
    ).toBe(true);

    const exampleTransform = new THREE.Matrix4().makeTranslation(3, 4, 5);
    anchorRootHorizontalPosition(exampleTransform, positionAnchor);
    expect(exampleTransform.elements.slice(12, 15)).toEqual([
      positionAnchor.x,
      4,
      positionAnchor.z,
    ]);
  });
});

describe("OpenSim MOT parser", () => {
  it("parses coordinate columns and interpolates by timestamp", () => {
    const motionText = `Coordinates
nRows=3
nColumns=3
inDegrees=yes
endheader
time hip_flexion_r pelvis_ty
0 10 1.0
0.5 30 1.2
1 50 1.4`;

    const motion = parseOpenSimMot(motionText);
    const frame = sampleOpenSimMot(motion, 0.25);

    expect(motion.inDegrees).toBe(true);
    expect(motion.endTime).toBe(1);
    expect(frame.get("hip_flexion_r")).toBe(20);
    expect(frame.get("pelvis_ty")).toBeCloseTo(1.1);
  });

  it("rejects non-increasing timestamps", () => {
    const motionText = `Coordinates
nRows=2
nColumns=2
inDegrees=no
endheader
time pelvis_ty
0 1.0
0 1.1`;

    expect(() => parseOpenSimMot(motionText)).toThrow("strictly increasing");
  });

  it("parses the supplied OpenSim motion recording", async () => {
    const motionText = await readFile(
      resolve(process.cwd(), "public", "data", "opensim-models", "opensim_motion.mot"),
      "utf8",
    );
    const motion = parseOpenSimMot(motionText);

    expect(motion.frames).toHaveLength(282);
    expect(motion.inDegrees).toBe(true);
    expect(sampleOpenSimMot(motion, motion.endTime).get("knee_angle_l")).toBeDefined();
  });
});

describe("OpenSim VTP parser", () => {
  it("triangulates polygon cells into Three.js geometry", () => {
    const vtp = `
      <VTKFile type="PolyData">
        <PolyData>
          <Piece NumberOfPoints="4" NumberOfPolys="1">
            <Points>
              <DataArray type="Float32" NumberOfComponents="3" format="ascii">
                0 0 0  1 0 0  1 1 0  0 1 0
              </DataArray>
            </Points>
            <Polys>
              <DataArray type="Int32" Name="connectivity" format="ascii">0 1 2 3</DataArray>
              <DataArray type="Int32" Name="offsets" format="ascii">4</DataArray>
            </Polys>
          </Piece>
        </PolyData>
      </VTKFile>`;

    const geometry = parseVtpPolyData(vtp, "square.vtp");

    expect(geometry.getAttribute("position").count).toBe(4);
    expect(Array.from(geometry.getIndex()!.array)).toEqual([0, 1, 2, 0, 2, 3]);
    geometry.dispose();
  });

  it("rejects polygon offsets that leave connectivity indices unreferenced", () => {
    const vtp = `
      <VTKFile type="PolyData">
        <PolyData>
          <Piece NumberOfPoints="4" NumberOfPolys="1">
            <Points>
              <DataArray type="Float32" NumberOfComponents="3" format="ascii">
                0 0 0  1 0 0  1 1 0  0 1 0
              </DataArray>
            </Points>
            <Polys>
              <DataArray type="Int32" Name="connectivity" format="ascii">0 1 2 3</DataArray>
              <DataArray type="Int32" Name="offsets" format="ascii">3</DataArray>
            </Polys>
          </Piece>
        </PolyData>
      </VTKFile>`;

    expect(() => parseVtpPolyData(vtp, "invalid.vtp")).toThrow(
      "contains unreferenced polygon indices",
    );
  });
});
