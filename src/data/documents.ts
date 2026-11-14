import type { DocExcerpt, QAPair } from "./types";

/**
 * A small library of NASA document excerpts used by the offline assistant.
 * Excerpts are illustrative placeholders for the prototype and must be
 * replaced with verified document text before operational use.
 */
export const documents: DocExcerpt[] = [
  {
    id: "doc-std-6-4",
    documentId: "NASA-STD-3001",
    title: "NASA Spaceflight Human-System Standard, Volume 2",
    section: "6.4 Exercise countermeasures",
    page: 118,
    excerpt:
      "In-flight exercise systems shall provide mechanical loading sufficient to maintain musculoskeletal … Examples: Place your feet hip-width apart on the platform. Keep your spine neutral and avoid rounding your lower back as you descend. Stop the repetition when your thighs are parallel to the platform or slightly below. Push through your heels to return to the starting position. Control the descent; avoid dropping quickly. Keep your knees aligned over your toes throughout the movement.",
    verified: true,
    chunks: 412,
    lastIndexed: "2026-09-21",
    version: "Rev C",
  },
  {
    id: "doc-std-6-5",
    documentId: "NASA-STD-3001",
    title: "NASA Spaceflight Human-System Standard, Volume 2",
    section: "6.5 Loading adequacy monitoring",
    page: 124,
    excerpt:
      "Crew exercise prescriptions shall be evaluated against ground-based reference sessions to confirm that the delivered mechanical stimulus remains within the effective range established for each crew member.",
    verified: true,
    chunks: 388,
    lastIndexed: "2026-09-21",
    version: "Rev C",
  },
  {
    id: "doc-hrp-3-2",
    documentId: "HRP-47052",
    title: "Human Research Program: Exercise Device Loads and Monitoring",
    section: "3.2 Axial loading in reduced gravity",
    page: 41,
    excerpt:
      "Because external load replaces body weight in reduced gravity, heel-raise and squat prescriptions should be interpreted relative to the equipment load rather than body weight.",
    verified: true,
    chunks: 156,
    lastIndexed: "2026-09-22",
    version: "Rev B",
  },
  {
    id: "doc-hrp-4-1",
    documentId: "HRP-47052",
    title: "Human Research Program: Exercise Device Loads and Monitoring",
    section: "4.1 Form and technique monitoring",
    page: 58,
    excerpt:
      "Form stability may be monitored through trunk-lean variability and joint-angle consistency across repetitions. Sustained increases in trunk lean variability indicate fatigue or technique degradation.",
    verified: true,
    chunks: 156,
    lastIndexed: "2026-09-22",
    version: "Rev B",
  },
  {
    id: "doc-unv-1",
    documentId: "NASA/TM-2026000",
    title: "Technical memorandum: Exercise prescription in partial gravity",
    section: "2.1 Squat depth and lumbar moment",
    page: 12,
    excerpt:
      "Shallow squat depth with a neutral spine reduces L4/L5 moment without substantially reducing femoral loading…",
    verified: false,
    chunks: 64,
    lastIndexed: "2026-10-02",
    version: "Draft 3",
  },
];

export const qaPairs: QAPair[] = [
  {
    id: "qa-lumbar-flag",
    question: "Why was my lumbar load flagged?",
    answer:
      "Your session on mission day 38 showed a lumbar moment of 178 N·m, just inside the cited 180 N·m bound from NASA-STD-3001 section 6.4, with two repetitions above it. Trunk lean increased during the second set, which raises the L4/L5 moment even when the bar load stays constant. The flag means the pattern matched a cited caution condition; it is not a diagnosis.",
    sourceIds: ["doc-std-6-4", "doc-hrp-4-1"],
    retrievalConfidence: "high",
  },
  {
    id: "qa-squat-016g",
    question: "How can I improve squat form at 0.16g?",
    answer:
      "In 0.16g your body weight contributes little load, so the machine load sets the demand. Keep the spine neutral, control the descent rather than letting reduced gravity accelerate it, and keep knees tracking over toes. The cited guidance recommends anchoring feet and bracing before the descent because stabilization takes longer in partial gravity.",
    sourceIds: ["doc-std-6-4", "doc-hrp-3-2"],
    retrievalConfidence: "medium",
  },
  {
    id: "qa-index-meaning",
    question: "What does the loading index mean?",
    answer:
      "The Mechanical Loading Index compares the mechanical stimulus your exercise delivered today with the same stimulus from your own 1g reference session. 100% means you received a similar mechanical stimulus on the Gateway as you did on Earth. It is a measure of stimulus delivered; it does not measure or predict bone status.",
    sourceIds: ["doc-std-6-5"],
    retrievalConfidence: "high",
  },
  {
    id: "qa-heel-raise",
    question: "Why do heel raises matter on the mission?",
    answer:
      "Heel raises load the calf and Achilles through the ankle joint, which sees little loading in reduced gravity during daily activity. The cited guidance pairs them with squat sessions so the ankle receives regular axial loading relative to the equipment load.",
    sourceIds: ["doc-hrp-3-2"],
    retrievalConfidence: "medium",
  },
  {
    id: "qa-reference",
    question: "What is my 1g reference session?",
    answer:
      "Your 1g reference session is a pre-flight squat recording made under standard Earth gravity. TALA compares every in-flight session with it: femoral strain is expressed as a percent of that session's peak, and the loading index uses its daily stimulus as the denominator. It is personal to you, not a population average.",
    sourceIds: ["doc-std-6-5"],
    retrievalConfidence: "high",
  },
  {
    id: "qa-hydration",
    question: "Should I hydrate before exercise?",
    answer:
      "The loaded documents address exercise loading and monitoring; they do not include hydration guidance. Please ask the CMO or the ground team.",
    sourceIds: [],
    retrievalConfidence: "low",
  },
  {
    id: "qa-ared",
    question: "How does the ARED load compare to free weights?",
    answer:
      "The ARED provides resistance through vacuum cylinders and flywheels rather than gravity, so the load is specified by the machine log rather than body weight. The cited section notes that prescriptions in reduced gravity should be interpreted relative to the equipment load.",
    sourceIds: ["doc-hrp-3-2"],
    retrievalConfidence: "medium",
  },
  {
    id: "qa-depth",
    question: "Does squat depth change lumbar moment?",
    answer:
      "Yes. Deeper squats with a forward trunk lean increase the L4/L5 moment. One loaded excerpt reports that a shallow depth with a neutral spine reduces the lumbar moment while keeping femoral loading within a similar range. That excerpt is marked unverified; confirm with the CMO before changing technique.",
    sourceIds: ["doc-unv-1", "doc-std-6-4"],
    retrievalConfidence: "medium",
  },
];

export function documentById(id: string): DocExcerpt | undefined {
  return documents.find((d) => d.id === id);
}
