import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import heroPhoto from "@/assets/astronaut-space-photo.jpg";
import missionControlPhoto from "@/assets/astronaut-space-photo.jpg";
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
          "TALA connects astronaut exercise movement analysis, biomechanical modeling, gravity scenarios, longitudinal insights, and NASA-literature-grounded explanations.",
      },
      { property: "og:title", content: "TALA — Twin-based Astronaut Life Analytics" },
      {
        property: "og:description",
        content:
          "Explore a connected approach to astronaut movement and wellness intelligence, combining computer vision, biomechanics, gravity context, and mission-relevant research.",
      },
    ],
  }),
  component: Landing,
});

const problems = [
  {
    icon: <IconCamera size={22} />,
    title: "Exercise video needs movement context",
    body: "Video can capture a movement, but making its patterns easier to interpret requires structured analysis and relevant context.",
  },
  {
    icon: <IconGravity size={22} />,
    title: "Mission conditions shape movement",
    body: "Movement takes place in environments with different gravity conditions, which matter when researchers interpret exercise.",
  },
  {
    icon: <IconChat size={22} />,
    title: "Movement and evidence are disconnected",
    body: "Exercise observations and mission-relevant research often sit in separate tools, making it harder to see how they relate.",
  },
  {
    icon: <IconChart size={22} />,
    title: "Insights need a shared view",
    body: "Movement patterns, personal context, and supporting evidence are more useful when they can be explored together.",
  },
];

const flow = [
  { icon: <IconCamera size={20} />, label: "Exercise recording", note: "Movement input" },
  { icon: <IconTwin size={20} />, label: "Computer vision", note: "Movement landmarks" },
  {
    icon: <IconPulse size={20} />,
    label: "OpenSim analysis",
    note: "Reconstruction and biomechanics",
  },
  {
    icon: <IconChat size={20} />,
    label: "Research insights",
    note: "NASA source-referenced explanations",
  },
];

const differentiators = [
  {
    them: "Exercise video reviewed without structured movement analysis",
    us: "TALA brings computer-vision movement estimates into a biomechanical review workflow.",
  },
  {
    them: "Movement interpreted without mission gravity context",
    us: "Compare modeled movement across gravity environments with the assumptions made clear.",
  },
  {
    them: "Movement insights disconnected from supporting research",
    us: "Explore movement findings alongside NASA-literature-grounded explanations and references.",
  },
  {
    them: "Movement observations reviewed without longitudinal context",
    us: "Bring movement history and wellness check-ins into a shared review experience.",
  },
];

const capabilities = [
  {
    icon: <IconCamera size={22} />,
    title: "Video-based movement analysis",
    body: "Extracts pose estimates from exercise recordings to support review of movement patterns.",
  },
  {
    icon: <IconTwin size={22} />,
    title: "OpenSim-based reconstruction",
    body: "Maps movement into a skeletal and kinematic representation for interactive exploration.",
  },
  {
    icon: <IconPulse size={22} />,
    title: "Biomechanical analysis",
    body: "Summarizes model-derived movement measures to make motion patterns easier to interpret.",
  },
  {
    icon: <IconGravity size={22} />,
    title: "Gravity-scenario analysis",
    body: "Compare the same reconstructed movement under microgravity, lunar, Mars, and Earth conditions.",
  },
  {
    icon: <IconChat size={22} />,
    title: "Evidence-grounded AI assistance",
    body: "Connects questions with NASA standards, technical guidance, and research reports through source-referenced explanations.",
  },
  {
    icon: <IconChart size={22} />,
    title: "Movement and wellness trends",
    body: "Brings movement history and wellness check-ins together to support longitudinal review.",
  },
];

const personas = [
  {
    photo: cameraPhoto,
    alt: "Astronaut exercising on a resistance device aboard the International Space Station",
    title: "Crew and exercise participants",
    where: "Crew movement review",
    body: "Review recorded exercise sessions, movement summaries, and personal check-ins in one place.",
  },
  {
    photo: surgeonPhoto,
    alt: "Research participant performing a barbell squat in a biomechanics laboratory",
    title: "Mission-support and research teams",
    where: "Mission-support insights",
    body: "Explore movement patterns, gravity context, and longitudinal trends to support research review.",
  },
  {
    photo: clinicPhoto,
    alt: "Research participant supported by a harness during movement testing in a laboratory",
    title: "Research and human-performance teams",
    where: "Evidence-informed research",
    body: "Connect movement observations with NASA-literature-grounded explanations and the assumptions behind them.",
  },
];

const stats = [
  { value: "1", label: "Connected workflow from exercise recording to movement insights" },
  { value: "3", label: "Movement regions explored: hip, knee, and ankle" },
  { value: "4", label: "Gravity environments compared: microgravity, Moon, Mars, and Earth" },
  {
    value: "6",
    label: "NASA knowledge sources spanning standards, technical guidance, and research",
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
            <a href="#problem" className="transition-colors hover:text-foreground">Why TALA</a>
            <a href="#solution" className="transition-colors hover:text-foreground">
              How it works
            </a>
            <a href="#capabilities" className="transition-colors hover:text-foreground">Capabilities</a>
            <a href="#audience" className="transition-colors hover:text-foreground">Who it's for</a>
          </nav>
          <div className="flex items-center gap-2">
            <Button size="sm" onClick={() => setDemoOpen(true)}>
              Explore TALA
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
              A clearer view of astronaut movement and wellness.
            </h1>
            <p className="mt-3 font-display text-sm font-medium tracking-[0.12em] text-muted-foreground uppercase">
              Twin-based Astronaut Life Analytics
            </p>
            <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-muted-foreground">
              TALA connects exercise movement analysis, biomechanical modeling, gravity scenarios,
              and NASA-literature-grounded insights to help make astronaut movement easier to
              understand.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" onClick={() => setDemoOpen(true)}>
                Explore TALA
              </Button>
              <Button asChild size="lg">
                <a
                  href="https://github.com/Arxivory/tala"
                  target="_blank"
                  rel="noreferrer"
                >
                  See Backend Research Project
                </a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href="/paper/tala_research_paper.pdf">Research Paper</a>
              </Button>
              <Button asChild size="lg">
                <a
                  href="https://github.com/Arxivory/tala-front-end"
                  target="_blank"
                  rel="noreferrer"
                >
                  See MVP Source Code
                </a>
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
          title="Astronaut movement is complex to interpret"
          support="Exercise observations, mission conditions, and relevant research all shape how movement should be understood."
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
              title="Make movement insights easier to use"
              support="A connected view can help teams explore exercise movement alongside biomechanical context and relevant evidence."
            />
            <p className="mt-6 text-[15px] leading-relaxed text-muted-foreground">
              TALA brings video-derived pose estimates, OpenSim-based reconstruction,
              gravity-scenario analysis, and source-referenced explanations into one movement
              review experience.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="card-soft p-5">
                <p className="num-lg text-2xl">1</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Connected movement-review workflow
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
          title="From exercise recording to movement insights"
          support="TALA connects movement analysis, biomechanical modeling, gravity context, and NASA-literature-grounded explanations."
          align="center"
        />
        <p className="mx-auto mt-6 max-w-3xl text-center text-[15px] leading-relaxed text-muted-foreground">
          Exercise recordings are translated into pose estimates and OpenSim-based movement
          reconstructions. Gravity scenarios add mission context, while NASA-literature-grounded
          explanations help connect movement observations with relevant research.
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
            title="One view across movement and mission context"
            support="Bring movement analysis, biomechanical modeling, gravity scenarios, and evidence together for a more complete review."
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
          title="A connected set of movement capabilities"
          support="Explore the tools that connect exercise recordings with movement analysis, mission context, and research insights."
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
            title="Designed for the people behind human spaceflight"
            support="TALA brings together crew, mission-support, and research perspectives on astronaut movement and wellness."
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
              <Link to="/app/assistant">Explore Research Assistant</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 8. Impact */}
      <section className="mx-auto max-w-6xl px-5 py-24">
        <SectionHeading
          eyebrow="Impact"
          title="A broader view of astronaut movement"
          support="Connect recorded exercise, biomechanical context, gravity environments, and research evidence."
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
            Built around movement science and spaceflight research
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
            TALA connects computer-vision movement analysis, OpenSim-based reconstruction,
            gravity-dependent research, and NASA-document-grounded explanations to support a more
            connected view of astronaut exercise and wellness.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Pill className="bg-background/85">
              <IconUser size={14} /> Crew-centered movement insights
            </Pill>
            <Pill className="bg-background/85">
              <IconBone size={14} /> Biomechanics-informed analysis
            </Pill>
            <Pill className="bg-background/85">
              <IconSync size={14} /> Connected research workflow
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
              Explore TALA's Prototype
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-[15px] text-muted-foreground">
              Explore TALA's connected movement and wellness workflow, from exercise recording and
              biomechanical analysis to gravity scenarios, trends, and evidence-grounded
              explanations. This experience uses precomputed research outputs and illustrative
              frontend data; it is not connected to a live backend, real-time camera analysis, or
              clinical monitoring.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button size="lg" variant="outline" onClick={() => setDemoOpen(true)}>
                Explore workspace
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
              A research-informed approach to astronaut movement, exercise, and wellness for future
              space exploration.
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
          © 2026 TALA — Twin-based Astronaut Life Analytics. Not endorsed by NASA.
        </div>
      </footer>

      <Dialog open={demoOpen} onOpenChange={setDemoOpen}>
        <DialogContent className="rounded-3xl sm:max-w-md">
          <DialogHeader>
            <Mascot size={44} />
            <DialogTitle className="text-display pt-2 text-xl">Explore TALA</DialogTitle>
            <DialogDescription className="text-sm leading-relaxed">
              Explore the connected workspace for movement review, gravity scenarios, wellness
              check-ins, trends, and research-grounded explanations.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-wrap gap-2 pt-2">
            <Button asChild>
              <Link to="/app">Open workspace</Link>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
