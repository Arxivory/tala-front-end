# TALA Crew Operations Portal: Lovable Prompt Pack

**How to use this file**

Lovable works best when you give it one strong foundation prompt, then build the app in small stages. Paste **Prompt 0** first and wait for it to finish. Then paste Prompts 1 to 8 one at a time, checking the preview after each. Do not paste everything at once, because large single prompts tend to produce shallow screens.

Everything here is **front end only**, with mock data. No backend, no real camera, no real AI. The goal is a polished, clickable prototype that shows the full experience.

---

## Prompt 0: Foundation (paste first)

```
Build a front-end-only prototype web app called "TALA: Twin-based Astronaut Life Analytics". It is a Crew Operations Portal for astronauts and the Crew Medical Officer (CMO) on long-duration space missions (LEO, Lunar surface at 0.16g, Mars at 0.38g). It turns exercise sessions into a biomechanical "digital twin" that shows joint loads and bone-relevant mechanical loading, and it includes an offline clinical assistant that answers from NASA documents.

This is for a NASA Space Apps 2026 challenge: "Create Health Monitoring Software for Astronauts on Space Missions". The app must be a visual tool where astronauts can assess their own health, see clickable body parts with status, and get guidance.

TECH
- React + TypeScript + Tailwind + shadcn/ui, React Router, Recharts for charts, @react-three/fiber + drei for the 3D skeleton, Framer Motion only for small purposeful transitions, lucide-react icons.
- No backend. All data comes from typed mock data files in /src/data. Persist user choices (theme, gravity regime, check-in) with localStorage.
- Responsive: desktop and tablet landscape first, tablet portrait and phone supported.

HARD CONTENT RULES (very important)
- TALA estimates joint loads and mechanical strain, and compares sessions to the astronaut's own 1g reference session. It must NEVER show or imply bone density, bone loss, BV/TV, or a diagnosis. Where relevant, add the footnote: "Shows mechanical loading, not bone status."
- Use the name "Mechanical Loading Index" (never "Skeletal Integrity Index").
- Every model-derived number shows its unit, a status pill, and a confidence badge.
- Every guidance message shows a citation chip, for example "NASA-STD-3001, 6.4". Label guidance "Decision support, not diagnosis".
- Anything that is mocked (sync, compression, encryption, mission control) carries a dashed "Demo placeholder" tag.
- Tone: strictly professional, calm, mission-log style. No exclamation marks, no confetti, no childish language.

DESIGN DIRECTION
Soft, comforting, warm and clean, but never childish. Light mode is the DEFAULT. A full Night mode is required (toggle in the top bar, also "Auto"). Night mode must not glare: no pure black, no pure white.

Color tokens (define as CSS variables, with light and dark values):
- bg-base: #FFFBFC light / #14111C night
- bg-surface: #FFFFFF / #1D1929
- bg-raised: #FAF3F7 / #272236
- primary-100 #FDEBF2 / #3A2536; primary-300 #F7C6D9 / #B9708F; primary-500 #E58FB0 / #E8A3BF; primary-700 #B35A82 / #F2C0D3
- lilac-100 #F1EAFB / #2B2340; lilac-300 #D3C2F0 / #7E69B5; lilac-500 #A38BDB / #B8A5E8
- sky-100 #E8F2FC / #1F2B3E; sky-300 #BBD7F3 / #5E8DBF; sky-500 #7FB0E3 / #8FBDE9
- text-strong #3B2A4A / #F4EEFA; text-body #5A4A6A / #D8CFE4; text-muted #8A7C99 / #9E93B0
- status-optimal #8FD3B0 (soft green), status-caution #F2C879 (amber), status-anomaly #EE9A8F (desaturated coral), status-neutral #CFC6DA. Never use bright red.
Pastel pink is the primary brand color. Lilac is secondary. Sky blue is for data and sync. Primary buttons use pink fill with dark text (text-strong), not white text.

Typography: a rounded geometric sans for headings and big numerals (Nunito or Quicksand), a clean humanist sans for body (Inter or Source Sans 3). Use tabular numerals for all data. Sentence case everywhere. Do NOT use all-caps eyebrow labels above headings, and do not add decorative labels.

Shape and motion: cards with 20px radius, fully rounded pills and buttons, inputs 14px radius. Very soft, large-blur shadows, 1px primary-100 borders for separation. Transitions 200 to 300 ms ease-out. Numbers count up gently, rings fill softly. No bouncing, no looping attention-grabbing animation. Respect prefers-reduced-motion and include a "Reduce motion" setting.

Never rely on color alone: every status has color + icon + text label.

Logo and avatar: create an inline SVG logo mark of a four-point guiding star inside a softly rounded helmet-visor shape, with a tiny heart-shaped negative space at the star's center (pink to lilac gradient in light mode, single-color outline in night mode). Wordmark "TALA" in the rounded heading font with caption "Twin-based Astronaut Life Analytics". Also create a small companion avatar "Tala": a calm glowing star-orb with no strong facial expression, used in the assistant, onboarding and empty states.

GLOBAL APP SHELL (portal pages)
- Left navigation rail: collapsed 72px icon rail that expands to a 240px labeled sidebar on hover/tap. Items: Home, Session, Body Map, Trends, Check-in, Assistant, Sync, Crew (CMO only), Settings. On tablet portrait and phone, switch to a bottom tab bar (Home, Session, Body, Trends, Assistant) with a "More" sheet for the rest.
- Top bar: mission chip ("Artemis Gateway, Day 42"), gravity regime segmented control (0g, 0.16g Lunar, 0.38g Mars, 1g Ref), connectivity pill ("Offline, 3 bundles queued"), theme toggle (sun/moon), notifications bell with badge, profile menu (avatar, name, role badge, Switch crew member, Sign out).
- Changing gravity regime shows a confirmation toast and updates mock values everywhere.
- A role switch in the profile menu toggles Astronaut and CMO views (CMO sees the Crew item and threshold editing).

REUSABLE COMPONENTS (build these first, in /src/components/tala)
StatusPill (Optimal, Caution, Anomaly, No data, each with icon), ConfidenceBadge (three dots, tooltip), MetricCard (title, big value + unit, delta vs 1g reference, status pill, mini sparkline), ReferenceDeltaChip ("82% of your 1g reference"), CitationChip (lilac chip; click opens a side sheet with document ID, section, page and highlighted excerpt; shows "Unverified" variant), DemoTag, InfoTooltip, Banner (amber/coral/sky with icon), EmptyState (avatar + one line + one button), SkeletonCard, PipTimeline, LoadingRing, SparklineWithBand, ViewAsTableToggle (every chart gets one).

ROUTES
/ (landing), /signin, /onboarding, /app (Home), /app/session, /app/session/live, /app/session/summary/:id, /app/body, /app/trends, /app/checkin, /app/assistant, /app/sync, /app/crew, /app/settings

MOCK DATA (create now, reuse everywhere)
- Crew: 4 members (Alex Rivera as the default user, Astronaut; Dr. Mei Tanaka, CMO; two others).
- 45 days of sessions for Alex: squat and heel raise, mixed gravity regimes, each with per-rep status, peak hip/knee/ankle/lumbar values, femoral strain as % of 1g reference, safety margin, form stability, confidence.
- Thresholds table with citations (placeholder values clearly labeled "example, needs clinical review").
- A recorded 60-second telemetry stream (joint angles + loads at 10 Hz) for the Live HUD to replay, including one lumbar anomaly at about second 38.
- A small library of NASA document excerpts (NASA-STD-3001, HRP-47052) for the assistant to quote, with 6 to 8 scripted Q&A pairs.
- 5 sync bundles in different states.

Start by building: design tokens, theme provider with light/night/auto, the logo and avatar SVGs, the app shell, the reusable components, the routing, and the mock data. Show a simple placeholder page for each route. Do not build the full pages yet.
```

---

## Prompt 1: Landing page and sign-in

```
Build the public landing page at "/" and the sign-in screen at "/signin" for TALA, using the existing design tokens and components. Light mode default, night mode must also work.

Landing page sections, in order:
1. Sticky translucent header: logo, links (How it works, Features, Safety, Demo), theme toggle, primary pink button "Open demo".
2. Hero: headline "See the strain behind every rep." Subline: "TALA turns cabin camera video into a real-time biomechanical twin, so astronauts can check their exercise loading on their own, even with no link to Earth." Two buttons: "Open demo" (primary, goes to /app in Demo Mode) and "Watch the 60-second tour" (secondary, opens a modal with a placeholder tour). On the right, an interactive 3D skeleton twin (react-three-fiber, a stylized low-poly skeleton built from primitives is fine) slowly rotating, with joints softly tinted green, amber and coral. Make the twin the memorable element of the page; keep everything else quiet.
3. Problem section: three cards (Sensor blind spot, Loading translation gap, Communication latency) each with an icon, one plain sentence, and for latency the stat "3 seconds to 20+ minutes one-way".
4. How it works: a four-step horizontal flow, Capture, Compute, Check, Guide, with a connecting line. Each step expands on click to two sentences.
5. Feature showcase: tabs (Live HUD, Body Map, Trends, Offline assistant), each with a stylized UI mock and three short benefits.
6. Mission scenarios: three cards for LEO 0g, Lunar 0.16g, Mars 0.38g with a gravity slider that updates an example bar chart of hip load for a standard squat.
7. Safety and claims: two columns. "What TALA does": estimates joint loads and mechanical strain, flags sessions outside cited ranges, cites its sources. "What TALA does not do": predict bone loss, diagnose, replace flight surgeons.
8. Offline-first: a small diagram (astronaut tablet, spacecraft edge, delayed ground link) with a Demo placeholder tag.
9. Final call to action with "Open demo" and "Sign in".
10. Footer: Space Apps 2026 credit, data and model attribution, "Not endorsed by NASA".

Do not use fade-and-slide animations on every section. Use motion only for the hero twin and one gentle reveal of the How it works line.

Sign-in screen: centered card with the logo, Crew ID and PIN fields, "Sign in" (primary), "Open demo mode" (secondary), "Switch crew member" (tertiary), and the note "Data stays on this device until a ground link is available." Demo mode logs in as Alex Rivera with all mock data.
```

---

## Prompt 2: Onboarding wizard

```
Build the onboarding wizard at /onboarding with four steps, progress dots at the top, and Back / Next (primary) / "Skip for now" (tertiary, with a warning that comparisons to the 1g reference will be unavailable).

Step 1, Crew profile: name, role (Astronaut or CMO), height, mass, sex, age, dominant side. Each field has an InfoTooltip explaining why it is needed ("Used to estimate segment mass and inertia").
Step 2, Camera setup: a mock camera preview area with a framing guide overlay (body outline silhouette). Checklist card: Lighting, Full body in frame, Distance, Cameras detected, each with a green check or amber warning plus fix hint. Button "Run calibration" that shows a short animated progress and a success state.
Step 3, 1g reference session: explain that a pre-flight 1g session is the personal baseline. Three option cards: "Record reference now", "Import reference file", "Use demo reference". Selecting one shows a confirmation.
Step 4, Baseline check-in: reuse the daily check-in form component (create it as a reusable component now).

Use the companion avatar "Tala" in a small calm intro on step 1. Finish with a summary card and a primary "Go to Home" button.
```

---

## Prompt 3: Home dashboard

```
Build the Home dashboard at /app. Goal: in five seconds the user knows today's status, what to do next, and whether anything needs attention. One primary action only: "Start session".

Use a 12-column grid:
- Row 1 left: greeting card "Good morning, Alex. Day 42 on the Gateway." with the avatar and today's plan "Squat, 3 x 8 at 0.16g". Row 1 right: action card with large primary button "Start session" and secondary "Do check-in first" (only if no check-in today).
- Row 2: three MetricCards. (1) Mechanical Loading Index today as a soft circular ring (percent of today's target relative to the astronaut's 1g reference) with tooltip "Measures mechanical stimulus delivered, not bone status." (2) Peak femoral strain vs 1g reference. (3) Form stability from the last session. Hover reveals "View trend".
- Row 3 left (8 cols): 30-day trend panel with a toggle (Femoral strain, Lumbar moment, Session count), a shaded target band, and session markers. Row 3 right (4 cols): consistency ring for the week and the next milestone.
- Row 4 left: last session summary with date, exercise, PipTimeline, status pill and "Open summary". Row 4 right: "Needs attention" list with up to 3 items (unresolved anomaly, low-confidence session, reminder), each deep-linking. Empty state text: "Nothing needs attention."

Also include a readiness chip near the greeting (Ready, Take it easy, Check with CMO) with a "How is this calculated?" link that opens a small sheet showing the transparent rules.

Empty state for a new user with no sessions: avatar, "Let's record your first session", button "Start session".
```

---

## Prompt 4: Session flow (pre-session, live HUD, post-session summary)

This is the most important prompt in the pack. If Lovable struggles, split it into 4a, 4b and 4c.

```
Build the full session flow.

A) /app/session: a list page with the upcoming plan, recent sessions (table), and a primary button "Start new session".

B) Pre-session setup (a single screen that does not scroll on tablet):
- Exercise dropdown with icons (Squat, Deadlift, Heel raise, Bench press, Row, Custom).
- Equipment segmented control (ARED, Flywheel, Bodyweight).
- Machine load source row: "ARED log: connected" (green) or "Manual entry" (amber, shows a kg input).
- Gravity regime segmented control mirroring the top bar.
- Camera readiness checklist (Camera(s) detected, Full body in frame, Lighting adequate, Calibration valid) with green checks or amber warnings and fix hints.
- Target inputs: sets, reps, target load.
- Readiness chip from today's check-in with an "Edit check-in" link.
- Primary "Start session", disabled until the checklist is green, with a tertiary "Proceed anyway" that shows a low-confidence warning.
Then a calm 3-2-1 countdown with a pose silhouette ("Stand in the outline").

C) Live Workout and Inference HUD at /app/session/live. Hide all navigation. Designed to be read from 1 to 2 meters away: large type, no scrolling, touch targets at least 56px. Use at most six primary elements.
- Left half: a mock "live cabin video" panel (use a dim cabin-like gradient placeholder with an animated 2D skeleton overlay drawn on top; "Overlay" toggle on/off). Corner badges: pose confidence (High/Medium/Low) and FPS.
- Right half: an interactive react-three-fiber 3D skeleton twin driven by the recorded mock telemetry stream. Joints and bones tint green, amber or coral based on current load vs threshold. Optional ghost outline of target form (toggle).
- Overlay elements: rep counter top center ("Set 2, Rep 5 / 8"); a semicircle load gauge bottom left with a selector for Hip, Knee, Lumbar; a femoral strain bar bottom center with a shaded lilac target zone and a marker (percent of 1g reference); a form stability ring bottom right; pause and "End session" icon buttons top right (End requires a confirm tap).
- Guidance card slides in from the right only on events, max two lines plus a CitationChip, auto-hides after 8 seconds unless pinned. Buttons: "Got it" and "Pin guidance".
- Anomaly behavior (confidence-gated): at the scripted second 38 the lumbar joint turns coral, a soft coral banner appears "Lumbar moment high. Check spine position." with an icon, the guidance card appears citing "NASA-STD-3001, 6.4", and the event is logged. No sound by default (settings toggle for a single soft chime).
- Low-confidence state: add a hidden debug control (keyboard key "L") that simulates low pose confidence. The HUD shows an amber banner "Tracking unclear, loads paused", greys the affected joints with dashed outlines, and suppresses flags.
- HUD modes: Standard, Minimal (twin and rep counter only), Low glare (night variant). A small mode switcher in a settings popover.

D) Post-session summary at /app/session/summary/:id with three levels of disclosure.
- Level 1: headline card (exercise, date, duration, gravity regime, overall status pill); three MetricCards (Loading adequacy as % of 1g reference femoral strain, Peak safety margin, Form stability); a PipTimeline with one pip per rep grouped by set, hover tooltip, click jumps the replay to that rep.
- Level 2 (collapsed accordions): Replay (video placeholder + 3D twin synced to a scrubber, speed 0.25x to 2x, event markers); Joint load profiles line chart for hip, knee, ankle, lumbar moment with translucent threshold bands, rep boundary guides and an uncertainty ribbon; Femoral strain per rep bar chart with an effective-range band and error bars; Events log table (time, joint, value, threshold, confidence, citation chip, guidance shown); Check-in context.
- Level 3: a "Method details" side drawer with raw values table, pose confidence trace, camera views, model and surrogate versions, uncertainty ranges, thresholds with citations, a joint-angle plot (mean with standard deviation band vs the 1g reference), and an uncertainty distribution histogram with the threshold line.
- Actions: "Save and queue for sync" (primary), "Add note", "Export report" (opens a print-friendly view), "Discard session" (destructive outline, requires confirmation).
Every chart has a "View as table" toggle and units on axes.
```

---

## Prompt 5: Body Map

```
Build the Body Map at /app/body, the clickable anatomical model.

Layout: center = a rotatable, zoomable 3D human body model (react-three-fiber; stylized skeleton plus soft body silhouette is fine) with quick-view buttons Front, Back, Side and "Reset view". Left rail = filters. Right = detail panel.

Left rail controls:
- View metric: Joint load, Femoral strain, Lumbar moment, Form deviations
- Time window: Last session, 7 days, 30 days, Mission to date
- Compare to: None, 1g reference, Previous week
- Layers: Skeleton, Muscles (schematic), Joints

Heat mapping: segments tint along a soft gradient from lilac (low) through pink (target) to coral (high), with a legend showing units. Segments outside range also show a small status icon marker.

Clickable sites: proximal femur (L/R), hip, knee, ankle, lumbar spine (L4/L5), thoracic spine, shoulder. Hover highlights and shows a small name tooltip; click selects and opens the right detail panel (slide-in) with:
- header: site name, status pill, side
- "What it does": one or two plain-language sentences
- current values: peak load, strain vs reference, ConfidenceBadge
- 30-day SparklineWithBand
- last flagged event with a link to the session replay
- "Why it matters in space": two sentences with a CitationChip
- button "Ask the assistant about this site" (navigates to /app/assistant with the site as context)

Persistent footnote: "Shows mechanical loading, not bone density."
Provide a "List view" toggle that shows the same sites as an accessible table (name, status, values) for screen readers and low-bandwidth use.
```

---

## Prompt 6: Trends and Mechanical Loading Index

```
Build /app/trends with three tabs: Overview, Sites, Sessions.

Top controls: date range (7 d, 30 d, 90 d, Mission), exercise filter, gravity regime filter, "Compare to 1g reference" toggle, Export (CSV or PDF, mocked).

Overview tab panels:
- Mechanical Loading Index: daily bar chart (percent of target) with a weekly average line and a 100% target line. Visually cap at 120%; show an amber note beyond 110% ("Above reference. Review with CMO.").
- Femoral strain vs reference: line chart with a shaded effective-range band and session markers.
- Safety margin: dot plot of minimum margin to upper bounds per session.
- Form stability: weekly average with sparkline.
- Session calendar: month heat calendar colored by session status pill.
- Gravity comparison: grouped bar chart of hip reaction force and femoral strain for a standard squat at 0g, 0.16g, 0.38g and 1g.

Sites tab: small-multiple grid of mini charts (femur, knee, hip, lumbar, ankle), each with a threshold band; click expands to a full chart in a dialog.
Sessions tab: sortable, filterable table (date, exercise, regime, load, adequacy %, safety margin, form, status, flags). Row click opens the post-session summary.

Add an info drawer "About the Mechanical Loading Index" explaining: numerator is time-integrated mechanical stimulus delivered that day, denominator is the same astronaut's 1g reference daily stimulus, and the disclaimer "A measure of stimulus delivered. It does not measure or predict bone status."
Use direct labels instead of legends where possible, a maximum of four series per chart, tabular numerals, and a "View as table" toggle on every chart.
```

---

## Prompt 7: Check-in, Assistant, Sync, Crew, Settings

```
Build the remaining pages.

1) /app/checkin (finishable in under 60 seconds): sleep slider (0 to 12 h) with quality icons; fatigue 5-step segmented control (None, Mild, Moderate, High, Severe); muscle or joint soreness by tapping areas on a small body diagram then picking severity; optional mood and stress 5-step icon scale; optional hydration and nutrition toggles; optional note (280 characters). Buttons: "Save check-in" (primary), "Skip today" (tertiary). On save, show the updated readiness chip. Below the form, 14-day strip charts for each field.

2) /app/assistant, the Offline Clinical Assistant: chat panel in the center, collapsible source panel on the right, removable context chips on top (for example "Lumbar flag, Session 18 Mar"). Header with the Tala avatar, title "Offline Clinical Assistant", a sky-blue "Running offline" pill, and the label "Decision support, not diagnosis". Suggested prompt chips: "Why was my lumbar load flagged?", "How can I improve squat form at 0.16g?", "What does the loading index mean?". Input with Send and a microphone button (mock). Answers come from scripted Q&A in the mock data: short answer (max 120 words), a Sources row of CitationChips, and a retrieval confidence badge. Clicking a chip opens the source panel with document ID, section, page and the highlighted excerpt. Unknown questions show the no-answer state: "I could not find this in the loaded NASA documents. Please ask the CMO or the ground team." with a "Flag for CMO" button. If the question looks like an emergency (chest pain, injury), show a fixed calm banner pointing to the crew emergency procedure and give no free-form advice. Each answer has thumbs up/down and "Citation looks wrong". Add a "Library" tab listing indexed documents with version, chunk count, Verified/Unverified status, and last index date.

3) /app/sync, DTN monitor. Every element carries the Demo placeholder tag. Link status card (Offline or Link window open, mock countdown to next contact window, one-way delay like "1.3 s Lunar, 12 min Mars"); bundle queue list (ID, contents, size, priority, state: Queued, Sending, Delivered, Retrying) with anomaly bundles first and a pink priority tag; bundle detail drawer (contents, size before and after compression as a placeholder value, "Authenticated encryption (placeholder)"); a horizontal queue timeline; a simulator panel with "Open link window", "Simulate delay", "Drop link", and "Retry now" on failed bundles. Footnote: "Compression ratio and encryption scheme are placeholders. Measured values replace them in later versions."

4) /app/crew (visible only in CMO role): crew grid cards (avatar, name, readiness chip, last session status, 14-day loading index sparkline); review queue of sessions with unreviewed anomalies and a "Review" button opening the replay with "Mark reviewed", "Add CMO note", "Recommend change"; threshold configuration table (metric, value, unit, citation, last edited by/date) where "Edit" opens a form requiring a citation and a reason, and edits append to a visible audit log; banner "Thresholds are literature-based and need clinical review before operational use."; "Prepare ground report" button that adds a bundle to the sync queue. Show a privacy banner to astronauts: "Your CMO can view session summaries."

5) /app/settings with tabs Profile, Display, Session, Units, Data, About. Display: theme (Light default, Night, Auto), Low glare, Reduce motion, text size (S, M, L, XL), colorblind-safe palette. Session: default exercise, audio cues and volume, overlay defaults, countdown, default HUD mode. Units: SI or imperial. Data: storage used, export JSON, delete local data (double confirmation). About: version, attributions, glossary (joint reaction force, strain, mechanostat), claim boundaries statement, "Not endorsed by NASA".
```

---

## Prompt 8: Alerts, gamification, states, accessibility polish

```
Polish pass. Do not redesign anything; refine and complete.

1) Alerts system: one consistent pattern. Levels: Info (sky chip/toast, auto-dismiss), Reminder (lilac card on Home), Caution (amber banner with icon), Anomaly (coral banner + guidance card, needs "Got it" or "Pin guidance"), Emergency reference (fixed calm banner, never auto-hides). The bell drawer lists alerts with filters (All, Unread, Anomalies) and "Mark all read". No sound unless enabled, no flashing, no red.

2) Professional gamification (reward consistency and form, never higher load): a daily mission checklist ring (check-in, session, review summary) with no guilt language; a consistency streak that pauses (not resets) on rest days; form mastery levels per exercise (Foundation, Steady, Precise, Expert) based on form stability only; milestone badges ("First reference session", "7 sessions in range", "30-day trend steady", "Gravity explorer") with subtle pastel star-themed art; a thin orbit-line mission progress bar with star markers; a weekly recap card in neutral mission-log language such as "Session logged. Form stability up 6% this week." No crew leaderboards.

3) States and edge cases: no camera (block start, troubleshooting steps, "Manual entry mode"); missing ARED log (amber warning, "Manual load" label); missing 1g reference (absolute values only, "No reference" on deltas, banner to record one); surrogate outside validated range (tag "Outside validated range", no flag); gravity regime locked during a session; app restarted mid-session ("Resume" or "Save partial session"); low retrieval confidence in the assistant.

4) Accessibility: WCAG 2.2 AA contrast in both themes, visible pink focus rings, full keyboard navigation, aria labels on every chart with table alternatives, 44px minimum touch targets (56px on the HUD), reduced-motion support, and plain-language tooltips with glossary links for technical terms.

5) Demo Mode: add a small "Demo" ribbon in the top bar and a "Trigger simulated anomaly" button reachable in two clicks from Home, so evaluators can reach the Live HUD and see the anomaly flow in under three clicks.

Finally, review every screen against these rules and fix violations: no bone density or bone loss language anywhere, every model number has unit + status + confidence, every guidance card has a citation chip, every mock feature has a Demo tag, each page has one primary pink button, and light mode is the default.
```

---

## Tips for working in Lovable

- After Prompt 0, check that the theme toggle, nav shell and mock data exist before continuing. Fixing the foundation later is expensive.
- If a prompt produces too much at once, paste only one lettered part (for example 4A, then 4B).
- When something looks off, give targeted follow-ups such as "Make the HUD gauges larger and move the guidance card to the right edge" rather than rewriting the prompt.
- Use Lovable's Visual Edits for small copy, spacing and color tweaks to save credits.
- Keep the spec document as the source of truth. If you change a threshold, label or section name in the app, update the spec too.
- Replace the placeholder threshold values and citations only after you verify them against the real literature and NASA documents.