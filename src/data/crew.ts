import type { CrewMember } from "./types";

export const crew: CrewMember[] = [
  {
    id: "alex",
    name: "Alex Rivera",
    role: "astronaut",
    title: "Mission Specialist",
    heightCm: 176,
    massKg: 72,
    sex: "male",
    age: 38,
    dominantSide: "right",
  },
  {
    id: "mei",
    name: "Dr. Mei Tanaka",
    role: "cmo",
    title: "Crew Medical Officer",
    heightCm: 163,
    massKg: 57,
    sex: "female",
    age: 44,
    dominantSide: "right",
  },
  {
    id: "jordan",
    name: "Jordan Okafor",
    role: "astronaut",
    title: "Flight Engineer",
    heightCm: 181,
    massKg: 79,
    sex: "male",
    age: 41,
    dominantSide: "left",
  },
  {
    id: "priya",
    name: "Priya Sharma",
    role: "astronaut",
    title: "Mission Specialist",
    heightCm: 168,
    massKg: 61,
    sex: "female",
    age: 35,
    dominantSide: "right",
  },
];

export function crewMemberById(id: string): CrewMember | undefined {
  return crew.find((c) => c.id === id);
}
