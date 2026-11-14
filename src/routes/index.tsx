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
      { title: "TALA — The astronaut's health co-pilot for deep space" },
      {
        name: "description",
        content:
          "TALA turns an ordinary cabin camera into a real-time 3D biomechanical digital twin, flags unsafe joint and bone strain, and gives offline clinical guidance when Earth is 20+ minutes away.",
      },
      { property: "og:title", content: "TALA — The astronaut's health co-pilot for deep space" },
      {
        property: "og:description",
        content:
          "A camera-based digital twin and offline clinical assistant for Artemis, Lunar Gateway and Mars transit crews.",
      },
    ],
  }),
  component: Landing,
});

const problems = [
  {
    icon: <IconCamera size={22} />,
    title: "Telemetry blind spot",
    body: "Miniaturised deep-space exercise devices ship without the instrumentation ARED had. Load data simply isn't captured.",
  },
  {
    icon: <IconSync size={22} />,
    title: "Up to 24-minute delay",
    body: "One-way Mars comms make real-time coaching from a flight surgeon physically impossible.",
  },
  {
    icon: <IconGravity size={22} />,
    title: "Earth-trained models fail",
    body: "Biomechanical models calibrated at 1 g misread motion in 0 g, 0.16 g and 0.38 g environments.",
  },
  {
    icon: <IconBone size={22} />,
    title: "Damage is invisible until return",
    body: "Bone loss is typically confirmed by post-flight DXA — long after the countermeasure window closed.",
  },
];

const flow = [
  { icon: <IconCamera size={20} />, label: "Cabin camera", note: "Existing hardware" },
  { icon: <IconTwin size={20} />, label: "Markerless tracking", note: "No wearables" },
  { icon: <IconPulse size={20} />, label: "3D twin + strain", note: "Real time, on device" },
  { icon: <IconChat size={20} />, label: "Offline clinical AI", note: "Works with no link" },
];

const differentiators = [
  {
    them: "Bulky wearable sensor suites — or no sensors at all",
    us: "Nothing to wear. A camera already in the module is the sensor.",
  },
  {
    them: "Video downlinked and reviewed days later on the ground",
    us: "Form and strain feedback inside the rep, on the crew's tablet.",
  },
  {
    them: "Earth-calibrated biomechanics applied to partial gravity",
    us: "Gravity-aware physics for 0 g, lunar 0.16 g and Mars 0.38 g.",
  },
  {
    them: "Static PDF manuals searched by a fatigued crew member",
    us: "An offline clinical assistant that answers in plain language in seconds.",
  },
];

const capabilities = [
  { icon: <IconTwin size={22} />, title: "Real-time 3D digital twin", body: "A joint-level skeletal model of the crew member, rendered as they move." },
  { icon: <IconCamera size={22} />, title: "Markerless motion tracking", body: "Pose and load estimated from ordinary cabin video — zero wearables." },
  { icon: <IconGravity size={22} />, title: "Gravity-aware physics", body: "Torque and strain solved for the actual gravity regime of the mission." },
  { icon: <IconChat size={22} />, title: "Offline clinical assistant", body: "Medical protocols answered on board, with no link to Earth required." },
  { icon: <IconSync size={22} />, title: "Mission Control sync", body: "Compressed biomechanical bundles instead of raw video downlink." },
  { icon: <IconChart size={22} />, title: "Baseline health dashboard", body: "Pre-flight DXA and mobility baselines tracked against mission trend." },
];

const personas = [
  {
    photo: cameraPhoto,
    title: "Astronauts & CMOs",
    where: "In-flight",
    body: "Glanceable form feedback mid-workout and an offline medical second opinion when the ground is hours away.",
  },
  {
    photo: surgeonPhoto,
    title: "Flight Surgeons & BMEs",
    where: "Mission Control",
    body: "Longitudinal bone strain analytics, anomaly replay and prescription control across the whole crew.",
  },
  {
    photo: clinicPhoto,
    title: "ASCRs & Earth clinicians",
    where: "Spinoff / dual-use",
    body: "The same twin, repurposed for webcam-guided physical therapy and remote recovery monitoring.",
  },
];

const stats = [
  { value: "95%+", label: "Bandwidth saved vs. raw video downlink" },
  { value: "< 3 s", label: "Offline clinical query response" },
  { value: "0", label: "Wearable sensors required" },
  { value: "3", label: "Gravity regimes modelled: 0 g, 0.16 g, 0.38 g" },
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
            <a href="#solution" className="transition-colors hover:text-foreground">Solution</a>
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
              The astronaut's health co-pilot for deep space.
            </h1>
            <p className="mt-3 font-display text-sm font-medium tracking-[0.12em] text-muted-foreground uppercase">
              Twin-based Astronaut Life Analytics
            </p>
            <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-muted-foreground">
              TALA turns an ordinary cabin camera into a real-time biomechanical digital twin —
              watching joint torque and bone strain rep by rep, and answering clinical questions on
              board when Earth is twenty minutes away.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" onClick={() => setDemoOpen(true)}>
                Open Demo
              </Button>
              <Button size="lg">
                See Source Code
              </Button>
              <Button asChild size="lg" variant="outline">
                <a>See Research</a>
              </Button>
            </div>
            <p className="mt-6 text-xs text-muted-foreground">
              All Images in this page are respectively credited to NASA, ESA, and the European Southern Observatory.
            </p>
          </div>

          <div className="relative">
            <img
              src={heroPhoto}
              alt="Astronaut exercising on a resistance device inside a spacecraft module"
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
          title="Deep space breaks the old playbook"
          support="Every assumption behind current crew-health monitoring — big instrumented hardware, a live link to Earth, 1 g biomechanics — stops holding past low Earth orbit."
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
              alt="Compact resistance training device used in orbit"
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
              title="A missed countermeasure becomes a mission risk"
              support="Crew health is mission hardware. When it degrades quietly, the mission degrades with it."
            />
            <p className="mt-6 text-[15px] leading-relaxed text-muted-foreground">
              Without effective loading, astronauts lose roughly 1–1.5% of hip and spine bone mineral
              density every month in microgravity, alongside measurable muscle atrophy. On a
              three-year Mars campaign that is the difference between walking out of the lander and
              being carried. An injury 200 million kilometres from a hospital has no evacuation plan.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="card-soft p-5">
                <p className="num-lg text-2xl">1–1.5%</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Bone density lost per month without adequate loading
                </p>
              </div>
              <div className="card-soft p-5">
                <p className="num-lg text-2xl">0</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Evacuation options during Mars transit
                </p>
              </div>
            </div>
          </div>
          <img
            src={surgeonPhoto}
            alt="Flight surgeon reviewing crew medical data"
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
          title="Meet TALA"
          support="A camera-based digital twin and an offline clinical assistant, running on the spacecraft itself."
          align="center"
        />
        <p className="mx-auto mt-6 max-w-3xl text-center text-[15px] leading-relaxed text-muted-foreground">
          TALA watches an astronaut exercise through a camera that is already in the module. It builds
          a joint-level skeletal twin in real time, solves torque and bone strain for the mission's
          actual gravity, and speaks up only when something needs correcting. Its clinical assistant
          answers medical questions on board — no link to Earth required — and only a compact,
          compressed summary travels back to Mission Control.
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
            title="Why TALA, and not the alternatives"
            support="The workarounds in use today all assume conditions deep space doesn't provide."
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
          support="Six core capabilities, all designed to work with the hardware and bandwidth a deep-space mission actually has."
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
            title="Three portals, one twin"
            support="The same biomechanical model serves the crew in flight, the ground team, and clinicians on Earth."
          />
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {personas.map((p) => (
              <div key={p.title} className="card-soft overflow-hidden">
                <img
                  src={p.photo}
                  alt={p.title}
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
              <Link to="/crew">Open Crew Operations</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link to="/control">Open Mission Control</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link to="/clinic">Open Terrestrial & Clinical</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 8. Impact */}
      <section className="mx-auto max-w-6xl px-5 py-24">
        <SectionHeading
          eyebrow="Impact"
          title="What the concept targets"
          support="Design goals for the prototype, measured against today's operational baseline."
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
      <section className="relative overflow-hidden border-y border-border-soft">
        <img
          src={missionControlPhoto}
          alt="Mission control operations room"
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
            Built for the operational gap, not the demo reel
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
            TALA is designed around a documented need: the loss of ARED-class instrumented exercise
            hardware on deep-space vehicles, and the communication delay that makes ground-side
            biomechanical review unworkable for Artemis and Mars-class missions. Clinical guidance
            stays traceable to the source protocol, and crew data leaves the vehicle as a compact,
            reviewable bundle.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Pill className="bg-background/85">
              <IconUser size={14} /> Crew-first interface standards
            </Pill>
            <Pill className="bg-background/85">
              <IconBone size={14} /> Traceable clinical sourcing
            </Pill>
            <Pill className="bg-background/85">
              <IconSync size={14} /> Delay-tolerant by design
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
              See the twin in motion
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-[15px] text-muted-foreground">
              Walk through all three portals with mocked mission data — no account needed.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button asChild size="lg">
                <Link to="/crew">Enter the prototype</Link>
              </Button>
              <Button size="lg" variant="outline" onClick={() => setDemoOpen(true)}>
                Request a demo
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
              A concept submission for the NASA Space Apps Challenge 2026. Prototype interface with
              mocked data — not a certified medical device.
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
              <Link to="/crew" className="block text-muted-foreground hover:text-foreground">Crew Operations</Link>
              <Link to="/control" className="block text-muted-foreground hover:text-foreground">Mission Control</Link>
              <Link to="/clinic" className="block text-muted-foreground hover:text-foreground">Terrestrial & Clinical</Link>
            </div>
            <div className="space-y-2.5">
              <p className="eyebrow">Access</p>
              <Link to="/login" className="block text-muted-foreground hover:text-foreground">Log in</Link>
              <Link to="/signup" className="block text-muted-foreground hover:text-foreground">Sign up</Link>
            </div>
          </div>
        </div>
        <div className="border-t border-border-soft px-5 py-5 text-center text-[11px] text-muted-foreground">
          © 2026 TALA — Twin-based Astronaut Life Analytics. Concept prototype.
        </div>
      </footer>

      <Dialog open={demoOpen} onOpenChange={setDemoOpen}>
        <DialogContent className="rounded-3xl sm:max-w-md">
          <DialogHeader>
            <Mascot size={44} />
            <DialogTitle className="text-display pt-2 text-xl">Demo requests are mocked</DialogTitle>
            <DialogDescription className="text-sm leading-relaxed">
              This is a concept prototype, so there's no sales team behind this button. You can walk
              the full experience yourself instead.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-wrap gap-2 pt-2">
            <Button asChild>
              <Link to="/app">Crew Operations</Link>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
