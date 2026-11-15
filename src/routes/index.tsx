import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import heroPhoto from "@/assets/astronaut-space-photo.jpg";
import missionControlPhoto from "@/assets/mission-control.jpg";
import cameraPhoto from "@/assets/astro-exercise.jpg";
import clinicPhoto from "@/assets/astronaut-exercise-photo.jpg";
import surgeonPhoto from "@/assets/astronaut-health.jpg";
import { Mascot, Wordmark } from "@/components/tala/newLogo";
import { Pill, SectionHeading } from "@/components/tala/ui-bits";
import {
  IconBone,
  IconCamera,
  IconChart,
  IconChat,
  IconGravity,
  IconPulse,
  IconShield,
  IconSync,
  IconTwin,
  IconUser,
} from "@/components/tala/icons";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TALA — Twin-based Astronaut Life Analytics" },
      {
        name: "description",
        content:
          "TALA is an exploratory prototype combining computer-vision movement analysis, OpenSim-based biomechanical research, gravity scenarios, and NASA-literature-grounded AI.",
      },
      { property: "og:title", content: "TALA — Twin-based Astronaut Life Analytics" },
      {
        property: "og:description",
        content:
          "Explore a record-to-insights research workflow with precomputed results, illustrative frontend data, and transparent limitations.",
      },
    ],
  }),
  component: Landing,
});

const problems = [
  {
    icon: <IconCamera size={22} />,
    title: "Video needs movement context",
    body: "An exercise clip alone does not explain how a person moved or what estimated coordinates mean.",
  },
  {
    icon: <IconGravity size={22} />,
    title: "Mission conditions shape analysis",
    body: "Gravity scenarios and modeling assumptions should be explicit when researchers compare reconstructed movement.",
  },
  {
    icon: <IconChat size={22} />,
    title: "Research evidence is distributed",
    body: "Movement estimates and mission-relevant literature can be difficult to interpret together.",
  },
  {
    icon: <IconChart size={22} />,
    title: "Demo data needs clear labels",
    body: "Precomputed results and illustrative trends should be distinguished from live astronaut records.",
  },
];

const flow = [
  { icon: <IconCamera size={20} />, label: "Movement video", note: "Research input" },
  { icon: <IconTwin size={20} />, label: "Computer vision", note: "Pose estimates" },
  {
    icon: <IconPulse size={20} />,
    label: "OpenSim analysis",
    note: "Reconstruction & biomechanics",
  },
  {
    icon: <IconChat size={20} />,
    label: "NASA literature AI",
    note: "Source-referenced explanations",
  },
];

const differentiators = [
  {
    them: "Movement video and biomechanical analysis reviewed separately",
    us: "TALA research explores computer-vision pose estimates alongside OpenSim reconstruction.",
  },
  {
    them: "Gravity assumptions separated from movement results",
    us: "Gravity-dependent research compares modeled scenarios with their assumptions made explicit.",
  },
  {
    them: "Movement results and evidence lookup kept in different tools",
    us: "A NASA-literature-grounded RAG prototype provides contextual explanations with references.",
  },
  {
    them: "Research outputs and illustrative frontend data easy to confuse",
    us: "The prototype labels precomputed research results separately from illustrative history.",
  },
];

const capabilities = [
  {
    icon: <IconCamera size={22} />,
    title: "Computer-vision pose estimation",
    body: "Pose estimates from research video; the browser does not capture or analyze live camera footage.",
  },
  {
    icon: <IconTwin size={22} />,
    title: "OpenSim-based reconstruction",
    body: "Research outputs and an approximate skeletal visualization make reconstructed movement easier to explore.",
  },
  {
    icon: <IconPulse size={22} />,
    title: "Biomechanical analysis",
    body: "Movement estimates from the research workflow, not clinical evaluations or validated health measurements.",
  },
  {
    icon: <IconGravity size={22} />,
    title: "Gravity-scenario research",
    body: "Explore modeled movement quantities under different gravity assumptions; these do not measure effort or adaptation.",
  },
  {
    icon: <IconChat size={22} />,
    title: "Evidence-grounded AI assistance",
    body: "A NASA-document RAG prototype offers contextual explanations with source references.",
  },
  {
    icon: <IconChart size={22} />,
    title: "Movement and wellness trends",
    body: "Frontend views combine precomputed research output with separately labeled illustrative history.",
  },
];

const personas = [
  {
    photo: cameraPhoto,
    alt: "Astronaut exercising on a resistance device aboard the International Space Station",
    title: "Crew and exercise participants",
    where: "Crew-facing exploration",
    body: "Review a precomputed movement analysis and self-reported check-in; the prototype does not provide live monitoring.",
  },
  {
    photo: surgeonPhoto,
    alt: "Research participant performing a barbell squat in a biomechanics laboratory",
    title: "Mission-support and research teams",
    where: "Research review",
    body: "Explore movement outputs, modeling context, and illustrative trends while keeping the data sources distinct.",
  },
  {
    photo: clinicPhoto,
    alt: "Research participant supported by a harness during movement testing in a laboratory",
    title: "Research and clinical reviewers",
    where: "Evidence exploration",
    body: "Review NASA-literature-grounded explanations and example outputs; TALA is not a diagnosis or clinical decision tool.",
  },
];

const stats = [
  { value: "1", label: "Precomputed squat research sample represented in this frontend" },
  { value: "2", label: "Repetitions detected in the sample clip, which has incomplete endpoints" },
  { value: "3", label: "Bilateral joint-coordinate families shown: hip, knee, and ankle" },
  {
    value: "4",
    label:
      "Research areas explored: computer vision, OpenSim, gravity analysis, and NASA-document RAG",
  },
];

function Landing() {
  const [demoOpen, setDemoOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-border-soft bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5">
          <Wordmark size={32} />
          <nav className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
            <a href="#problem" className="transition-colors hover:text-foreground">Problem</a>
            <a href="#solution" className="transition-colors hover:text-foreground">
              Approach
            </a>
            <a href="#capabilities" className="transition-colors hover:text-foreground">Capabilities</a>
            <a href="#audience" className="transition-colors hover:text-foreground">Who it's for</a>
          </nav>
          <div className="flex items-center gap-2">
            <Button size="sm" onClick={() => setDemoOpen(true)}>
              Open Demo
            </Button>
          </div>
        </div>
      </header>

      {/* 1. Hero */}
      <section className="relative overflow-hidden surface-wash">
        <div className="absolute inset-0 orbit-texture opacity-50" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 pb-20 pt-16 lg:grid-cols-[1.05fr_1fr] lg:pb-28 lg:pt-24">
          <div>
            <h1 className="text-display mt-6 text-[2.75rem] font-semibold sm:text-6xl">
              Astronaut movement and wellness intelligence.
            </h1>
            <p className="mt-3 font-display text-sm font-medium tracking-[0.12em] text-muted-foreground uppercase">
              Twin-based Astronaut Life Analytics
            </p>
            <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-muted-foreground">
              TALA is an exploratory prototype combining computer-vision movement analysis,
              biomechanical research, and NASA-literature-grounded AI to make astronaut exercise
              data easier to explore. Frontend results are precomputed or illustrative; this is not
              live camera analysis or clinical monitoring.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" onClick={() => setDemoOpen(true)}>
                Open Demo
              </Button>
              <Button asChild size="lg">
                <a
                  href="https://github.com/Arxivory/tala-front-end"
                  target="_blank"
                  rel="noreferrer"
                >
                  See Source Code
                </a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href="#trust">Research &amp; limitations</a>
              </Button>
            </div>
            <p className="mt-6 text-xs text-muted-foreground">
              All Images in this page are credited to NASA.
            </p>
          </div>

          <div className="relative">
            <img
              src={heroPhoto}
              alt="Astronaut conducting a spacewalk above Earth"
              width={1600}
              height={1104}
              className="photo-tint h-80 w-full rounded-3xl object-cover shadow-lift ring-1 ring-border-soft sm:h-[26rem]"
            />
          </div>
        </div>
      </section>

      {/* 2. Problem */}
      <section id="problem" className="mx-auto max-w-6xl px-5 py-24">
        <SectionHeading
          eyebrow="The problem"
          title="Movement data needs context"
          support="Future exploration research needs clear ways to review movement observations, modeling assumptions, and supporting evidence without confusing estimates with health conclusions."
        />
        <div className="mt-12 grid gap-6 lg:grid-cols-[1.35fr_1fr]">
          <div className="grid gap-4 sm:grid-cols-2">
            {problems.map((p) => (
              <div key={p.title} className="card-soft p-6">
                <span className="grid size-10 place-items-center rounded-xl bg-primary-soft text-primary-strong">
                  {p.icon}
                </span>
                <h3 className="mt-4 font-display text-base font-semibold">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
              </div>
            ))}
          </div>
          <div className="overflow-hidden rounded-3xl border border-border-soft">
            <img
              src={cameraPhoto}
              alt="Astronaut exercising on a resistance device aboard the International Space Station"
              loading="lazy"
              width={1280}
              height={960}
              className="photo-tint h-full min-h-72 w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* 3. Why it matters */}
      <section className="border-y border-border-soft bg-surface">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-24 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="Why it matters"
              title="Make movement research easier to interpret"
              support="Transparent tools can help researchers explore exercise movement, biomechanical estimates, and evidence while respecting the limits of each."
            />
            <p className="mt-6 text-[15px] leading-relaxed text-muted-foreground">
              TALA explores a workflow that connects video-derived pose estimates, OpenSim-based
              reconstruction, gravity-scenario research, and source-referenced explanations. The
              frontend uses one precomputed squat sample and separately labeled illustrative
              history. It does not evaluate bone status, injury, or readiness and is not a clinical
              system.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="card-soft p-5">
                <p className="num-lg text-2xl">1</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Precomputed squat research sample represented in this frontend
                </p>
              </div>
              <div className="card-soft p-5">
                <p className="num-lg text-2xl">3</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Joint-coordinate families shown: hip, knee, and ankle
                </p>
              </div>
            </div>
          </div>
          <img
            src={surgeonPhoto}
            alt="Research participant performing a barbell squat in a biomechanics laboratory"
            loading="lazy"
            width={1280}
            height={960}
            className="photo-tint h-full max-h-[30rem] w-full rounded-3xl object-cover shadow-soft"
          />
        </div>
      </section>

      {/* 4. Solution */}
      <section id="solution" className="mx-auto max-w-6xl px-5 py-24">
        <SectionHeading
          eyebrow="The solution"
          title="An exploratory record-to-insights workflow"
          support="TALA brings together computer vision, biomechanical modeling, gravity scenarios, and NASA-literature-grounded AI in a research prototype."
          align="center"
        />
        <p className="mx-auto mt-6 max-w-3xl text-center text-[15px] leading-relaxed text-muted-foreground">
          The research workflow explores pose estimation from video, OpenSim reconstruction and
          biomechanical analysis, modeled gravity scenarios, and retrieval-augmented explanations
          grounded in NASA documents. The frontend displays precomputed research results and
          illustrative data; it does not process a live camera feed or provide clinical guidance.
        </p>

        <div className="mt-14 overflow-x-auto px-6 py-6">
          <div className="flex min-w-[52rem] items-stretch gap-3">
            {flow.map((step, i) => (
              <div key={step.label} className="flex flex-1 items-center gap-3">
                <div className="card-soft flex-1 p-5 text-center">
                  <span className="mx-auto grid size-10 place-items-center rounded-xl bg-blush-soft text-primary-strong">
                    {step.icon}
                  </span>
                  <p className="mt-3 font-display text-sm font-semibold">{step.label}</p>
                  <p className="mt-1 text-[11px] text-muted-foreground">{step.note}</p>
                </div>
                {i < flow.length - 1 ? (
                  <span aria-hidden className="text-muted-foreground">
                    <svg width="22" height="10" viewBox="0 0 22 10" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
                      <path d="M1 5h18M15.5 1.5 19.5 5l-4 3.5" />
                    </svg>
                  </span>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. What makes it different */}
      <section className="border-y border-border-soft bg-surface">
        <div className="mx-auto max-w-6xl px-5 py-24">
          <SectionHeading
            eyebrow="What makes this different"
            title="A connected research workflow"
            support="TALA explores how movement analysis, biomechanical modeling, gravity assumptions, and evidence lookup can be reviewed together."
          />
          <div className="mt-12 space-y-3">
            {differentiators.map((d) => (
              <div
                key={d.us}
                className="card-soft grid gap-3 p-6 sm:grid-cols-2 sm:items-center sm:gap-8"
              >
                <p className="text-sm leading-relaxed text-muted-foreground line-through decoration-risk decoration-2">
                  {d.them}
                </p>
                <p className="flex items-start gap-3 text-sm font-medium leading-relaxed">
                  <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-safe text-safe-ink">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2.5 6.3 4.8 8.6 9.5 3.6" />
                    </svg>
                  </span>
                  {d.us}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Capabilities */}
      <section id="capabilities" className="mx-auto max-w-6xl px-5 py-24">
        <SectionHeading
          eyebrow="Key capabilities"
          title="What the platform does"
          support="Six research and prototype capabilities across movement analysis, interpretation, and review; some frontend content is precomputed or illustrative."
        />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {capabilities.map((c) => (
            <div key={c.title} className="card-soft p-6 transition-shadow hover:shadow-lift">
              <span className="grid size-10 place-items-center rounded-xl bg-primary-soft text-primary-strong">
                {c.icon}
              </span>
              <h3 className="mt-4 font-display text-base font-semibold">{c.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Who it's for */}
      <section id="audience" className="border-y border-border-soft bg-surface">
        <div className="mx-auto max-w-6xl px-5 py-24">
          <SectionHeading
            eyebrow="Who it's for"
            title="People who may use or review TALA"
            support="TALA is an exploratory prototype for crew-facing movement review, mission-support exploration, and research audiences—not operational medical software."
          />
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {personas.map((p) => (
              <div key={p.title} className="card-soft overflow-hidden">
                <img
                  src={p.photo}
                  alt={p.alt}
                  loading="lazy"
                  width={1280}
                  height={960}
                  className="photo-tint h-44 w-full object-cover"
                />
                <div className="p-6">
                  <p className="eyebrow">{p.where}</p>
                  <h3 className="mt-2 font-display text-lg font-semibold">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild variant="secondary">
              <Link to="/app">Explore Crew Workspace</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link to="/app/trends">Explore Movement Trends</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link to="/app/assistant">Explore Evidence Assistant</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 8. Impact */}
      <section className="mx-auto max-w-6xl px-5 py-24">
        <SectionHeading
          eyebrow="Impact"
          title="What the prototype currently shows"
          support="A small set of transparent sample outputs and research components, not operational performance claims."
          align="center"
        />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-2xl border border-border-soft bg-blush-soft p-6">
              <p className="num-lg text-4xl">{s.value}</p>
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 9. Trust */}
      <section id="trust" className="relative overflow-hidden border-y border-border-soft">
        <img
          src={missionControlPhoto}
          alt="Illustrative mission operations room with screens showing Earth and spacecraft"
          loading="lazy"
          width={1600}
          height={912}
          className="photo-tint absolute inset-0 h-full w-full object-cover opacity-25"
        />
        <div className="relative mx-auto max-w-4xl px-5 py-24 text-center">
          <span className="grid mx-auto size-11 place-items-center rounded-xl bg-background/80 text-primary-strong">
            <IconShield size={22} />
          </span>
          <h2 className="text-display mt-6 text-3xl font-semibold sm:text-4xl">
            Research-grounded and explicit about limits
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
            TALA is an exploratory prototype combining research in computer vision, OpenSim,
            gravity-dependent analysis, and NASA-document retrieval-augmented generation. This
            frontend displays precomputed research results alongside separately labeled illustrative
            data; it is not live monitoring or a validated astronaut health system. Estimates do not
            diagnose, assess injury, or indicate bone status.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Pill className="bg-background/85">
              <IconUser size={14} /> Exploratory research prototype
            </Pill>
            <Pill className="bg-background/85">
              <IconBone size={14} /> No bone-status or diagnosis claims
            </Pill>
            <Pill className="bg-background/85">
              <IconSync size={14} /> Precomputed and illustrative data labeled
            </Pill>
          </div>
        </div>
      </section>

      {/* 10. Footer CTA */}
      <section className="mx-auto max-w-6xl px-5 py-24">
        <div className="relative overflow-hidden rounded-3xl border border-border-soft surface-wash p-10 text-center sm:p-16">
          <div className="absolute inset-0 star-texture" />
          <div className="relative">
            <Mascot size={56} className="mx-auto" />
            <h2 className="text-display mt-5 text-3xl font-semibold sm:text-4xl">
              Explore TALA's prototype
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-[15px] text-muted-foreground">
              Explore the record-to-insights experience with precomputed analysis and separately
              labeled illustrative data. No live camera processing or clinical monitoring.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button size="lg" variant="outline" onClick={() => setDemoOpen(true)}>
                Enter demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-border-soft bg-surface">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 py-12 md:flex-row md:items-start md:justify-between">
          <div>
            <Wordmark withTagline size={34} />
            <p className="mt-4 max-w-xs text-xs leading-relaxed text-muted-foreground">
              A NASA Space Apps exploratory prototype. The frontend uses precomputed research
              results and illustrative data; it is not a live monitoring or clinical system.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-10 text-sm sm:grid-cols-3">
            <div className="space-y-2.5">
              <p className="eyebrow">Product</p>
              <a href="#capabilities" className="block text-muted-foreground hover:text-foreground">Capabilities</a>
              <a href="#solution" className="block text-muted-foreground hover:text-foreground">How it works</a>
              <a href="#audience" className="block text-muted-foreground hover:text-foreground">Who it's for</a>
            </div>
            <div className="space-y-2.5">
              <p className="eyebrow">Portals</p>
              <Link to="/app" className="block text-muted-foreground hover:text-foreground">
                Crew Workspace
              </Link>
              <Link to="/app/trends" className="block text-muted-foreground hover:text-foreground">
                Movement Trends
              </Link>
              <Link
                to="/app/assistant"
                className="block text-muted-foreground hover:text-foreground"
              >
                Evidence Assistant
              </Link>
            </div>
            <div className="space-y-2.5">
              <p className="eyebrow">Access</p>
              <Link to="/signin" className="block text-muted-foreground hover:text-foreground">
                Sign in
              </Link>
              <Link to="/onboarding" className="block text-muted-foreground hover:text-foreground">
                Get started
              </Link>
            </div>
          </div>
        </div>
        <div className="border-t border-border-soft px-5 py-5 text-center text-[11px] text-muted-foreground">
          © 2026 TALA — Twin-based Astronaut Life Analytics. Exploratory prototype; not endorsed by
          NASA.
        </div>
      </footer>

      <Dialog open={demoOpen} onOpenChange={setDemoOpen}>
        <DialogContent className="rounded-3xl sm:max-w-md">
          <DialogHeader>
            <Mascot size={44} />
            <DialogTitle className="text-display pt-2 text-xl">
              Explore the working prototype
            </DialogTitle>
            <DialogDescription className="text-sm leading-relaxed">
              This button does not submit a demo request. Open the prototype to explore its
              precomputed research output, movement mirror, check-in, and illustrative trends.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-wrap gap-2 pt-2">
            <Button asChild>
              <Link to="/app">Open the prototype</Link>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
