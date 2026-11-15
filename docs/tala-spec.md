# TALA Crew Operations Portal: Lovable Prompt Pack

**How to use this file**

Lovable works best when you give it one strong foundation prompt, then build the app in small stages. Paste **Prompt 0** first and wait for it to finish. Then paste Prompts 1 to 8 one at a time, checking the preview after each. Do not paste everything at once, because large single prompts tend to produce shallow screens.

Everything here is **front end only**, with mock data. No backend, no real camera, no real AI. The goal is a polished, clickable prototype that shows the full experience.

---

## Prompt 0: Foundation (paste first)

```
Build a front-end-only prototype web app called "TALA: Twin-based Astronaut Life Analytics". It is a Crew Operations Portal for astronauts and the Crew Medical Officer (CMO) on long-duration space missions (LEO, Lunar surface at 0.16g, Mars at 0.38g). It reviews recorded exercise video using computer-vision pose estimates and OpenSim reconstruction, presents precomputed movement and gravity-context research outputs, and includes an evidence-grounded assistant.

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
- A recorded squat video, its CV pose-estimation render, and precomputed backend research results for the record-to-insights demo.
- A small library of NASA document excerpts (NASA-STD-3001, HRP-47052) for the assistant to quote, with 6 to 8 scripted Q&A pairs.
- 5 sync bundles in different states.

Start by building: design tokens, theme provider with light/night/auto, the logo and avatar SVGs, the app shell, the reusable components, the routing, and the mock data. Show a simple placeholder page for each route. Do not build the full pages yet.
```

---

## Prompt 1: Landing page and sign-in

```
Build the public landing page at "/" and the sign-in screen at "/signin" for TALA, using the existing design tokens and components. Light mode default, night mode must also work.

Keep the current landing page's visual structure intact: retain all ten sections in their existing order, all five image assets and placements, layouts, grids, cards, spacing, colors, typography, and responsive behavior. Make a content-accuracy pass; do not redesign, remove, or rearrange sections.

Use the positioning "Twin-based Astronaut Life Analytics": an exploratory research prototype combining computer-vision movement analysis, OpenSim-based biomechanical research, gravity scenarios, and NASA-literature-grounded AI.

Retain the existing ten-section narrative:
1. Hero: introduce TALA as an exploratory movement and wellness intelligence prototype. Keep the two-column layout, astronaut photo, and three CTAs. Label research and illustrative data honestly.
2. Problem: four cards about movement-video context, modeling assumptions, distributed evidence, and clearly labeled demo data.
3. Why it matters: explain why transparent movement research can support future exploration; use only counts tied to the sample/prototype, not unsupported health statistics.
4. Solution: retain the horizontal flow for movement video, computer vision, OpenSim analysis, and NASA-literature AI.
5. Differentiators: describe an integrated research workflow without unsupported claims about competitors, real-time feedback, or operational performance.
6. Capabilities: cover pose estimation, OpenSim reconstruction, biomechanical analysis, gravity-scenario research, evidence-grounded AI assistance, and movement/wellness trends. Distinguish implemented research, precomputed frontend results, and illustrative data.
7. Audience: retain three persona cards for crew/exercise participants, mission-support/research teams, and research/clinical reviewers. Buttons must link to existing application routes.
8. Impact: show only verifiable sample or prototype facts; do not claim measured bandwidth savings, response times, or health outcomes.
9. Trust: state research grounding, precomputed/illustrative data boundaries, and that this is not live monitoring or a validated astronaut health system.
10. Footer CTA: invite exploration of the working prototype and explain demo-request limitations.

Remove claims of real-time digital-twin monitoring, live telemetry, rep-by-rep strain feedback, clinical guidance, bone status or bone-loss monitoring, injury detection, prescriptions, and unmeasured performance thresholds. Update image alt text to describe the actual image. Keep the existing visual layout while pointing CTAs and navigation to valid app routes.

Do not use fade-and-slide animations on every section. Use motion sparingly.

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
Build /app as the astronaut's daily movement-monitoring entry point. Keep the existing pastel visual identity, but use the current precomputed research output and do not imply live capture, telemetry, calibrated astronaut baselines, or health monitoring.

Use the signed-in profile name but mark the profile as a sample account. The current research sample is one public-video squat recording, has 2 detected repetitions, lasts 9.4 seconds, has incomplete endpoints, and reports limited kinematic reconstruction quality. Its capture date is not available. Personal baseline comparison is unavailable.

Home hierarchy:
- Greeting: "TALA movement monitoring", "Good morning, Alex", and a short note that this is a prototype using precomputed research output and separately labeled illustrative history. Do not show a mission day, gravity location, exercise prescription, or readiness status.
- Primary action: "Explore latest analysis" linking to /app/body. Secondary action: "Quick check-in" linking to /app/checkin. Do not call this "Start session" or imply the browser is recording live.
- Four concise snapshot cards: movement analysis availability, kinematic reconstruction quality, personal baseline availability, and today's check-in state. The check-in state reflects device-local app state. Model-derived values show a unit, status, and confidence.
- Latest Movement Observation panel: squat, detected repetitions, source video duration, reconstruction-quality status/confidence, and unavailable baseline comparison. Link to the movement mirror. Identify the record as research output, not astronaut history.
- Baseline readiness panel: show insufficient compatible history for this research sample. State that a personal movement reference is not a healthy reference standard. Keep illustrative history separate.
- Progressive "Explore movement insights" disclosure: show the latest research session's right/left hip, knee, and ankle coordinate excursions, with units, status, confidence, and the note that these are not clinical range-of-motion assessments. Link to historical illustrative comparisons in Trends.
- Footer claim boundary: the research sample is precomputed public-video output, not live monitoring or an astronaut health record. Any illustrative history is labeled separately.

Remove the Mechanical Loading Index, femoral strain, lumbar safety, form-stability score, "All Parameters Nominal", streaks, NASA-STD-3001 bounds, and rep-by-rep quality pips unless supported by a validated data source. Do not put an astronaut location or gravity scenario selector in the Home hero.
```

---

## Prompt 4: Record, compute and review

```
Build /app/session as a transparent record-to-insights demo, not a real-time workout HUD.

- Retain the pre-session configuration screen: exercise, resistance equipment, gravity regime, sets, reps per set and load.
- Label these settings as demo context only. The supplied research clip is fixed and changing configuration values does not change its precomputed outputs.
- Keep the calm 3-2-1 countdown after configuration, then play the prerecorded squat sample as the demo recording.
- Use the supplied squat recording at /data/videos/squat_segment.mp4 as the demo recording. Let the user review and play the clip before continuing.
- Label the clip and outputs as precomputed research data. Do not imply that the browser records from a live camera or runs CV/OpenSim processing.
- Provide a "Compute biomechanics" action and a clear processing transition that explains it is opening precomputed backend research results.
- Present the available movement analysis: two repetitions detected, incomplete recording endpoints, estimated hip/knee/ankle coordinate excursions in degrees, movement phase counts, and limited reconstruction quality.
- Include the precomputed gravity-context comparison of modeled gravitational potential-energy differences, clearly stating that one reconstructed trajectory is held fixed across environments and that the values do not measure muscle work, effort, joint loading, or adaptation.
- Every model-derived number must show units, a status pill, and a confidence badge. Explain that confidence is conservative because reconstruction quality is reported as limited.
- State prominently that this research output does not calculate joint loads, inverse dynamics, exercise safety, a readiness score, or a clinical finding. Coordinate excursions are not clinical range-of-motion assessments.
- Do not show the old live HUD, fabricated load gauges, strain estimates, anomalies, or simulated exercise guidance.
- End with a primary action to open /app/body and review the source video beside the supplied CV pose-estimation render at /data/videos/visualizations/pose_overlay.mp4.
- Keep any future live capture and backend integration separate from this precomputed research flow.
```

---

## Prompt 5: Body Map

```
Build /app/body as a movement mirror for the selected research recording.

- Show the supplied original squat video and provide a toggle to the CV pose-estimation render at /data/videos/visualizations/pose_overlay.mp4.
- Render selected supplied OpenSim VTP geometry in a separate Three.js module, with OrbitControls and a simple grid floor. Use geometry scales and joint-frame definitions from `scaled_model.osim`, drive the transforms from `opensim_motion.mot`, anchor the pelvis's initial horizontal position while preserving its vertical squat motion, and synchronize scrubbing/playback with the selected video.
- Add an optional relative-motion heatmap toggle: neutral geometry when off; pastel pink-to-orange when on, normalized separately to each segment's estimated coordinate range in this recording. The colors describe relative estimated angle only, never severity, injury risk, or safety.
- Allow users to select a modeled body part by clicking its geometry or using an accessible selector. Show current-frame coordinate estimates, the per-recording range, the available squat phase, and any missing/assumed-data limitation in plain language.
- Label the mirror as approximate, not a validated biomechanical simulation. Keep the browser rendering distinct from authoritative OpenSim simulation results.
- Present precomputed hip, knee and ankle coordinate excursion estimates in degrees, with status and confidence labels and a visible note that these are not clinical range-of-motion measurements.
- Include the recording completeness and reconstruction-quality limitations. Do not fabricate joint-load values, safety thresholds, diagnoses, or physiological conclusions.
```

---

## Prompt 6: Trends and baselines

```
Build /app/trends as a movement analytics page with four tabs: Overview, Movement Trends, Sessions, Gravity Analysis.

The page describes how compatible movement observations change across a recording history. It does not present bone or tissue loading, safety margins, health status, or a clinical baseline.

Keep actual research output separate from illustrative demo history. Never include a research recording in an illustrative baseline. Identify the source on every chart, session row, and detail panel. The current research sample is one public-video squat analysis, has an incomplete recording, and does not establish a personal baseline.

Global filters: date range (7 days, 30 days, 90 days, all sessions), exercise, and source (Illustrative history or Research output). Do not apply these historical filters to Gravity Analysis: it always shows the one precomputed research recording and its fixed trajectory across modeled environments.

Overview:
- Baseline status based only on compatible illustrative sessions; the prototype rule is fewer than 3 compatible sessions = insufficient, 3–5 = provisional, and 6 or more = established. This is a demo rule, not a clinical threshold. Calculate the illustrative reference from the first four designated compatible demo sessions, independent of the chart's selected date window.
- Summary cards for recorded sessions, detected repetitions, average repetition duration, and baseline status.
- Movement activity charts for repetitions per session and average repetition duration.
- A clickable, neutral session-activity calendar and a concise, rule-based movement observation.
- Keep the single research result in its own card with its actual repetition count, recording duration, incomplete status, and limited reconstruction quality.

Movement Trends:
- Provide hip, knee, and ankle coordinate-excursion trends in degrees, with a metric selector and raw/deviation mode.
- Compare only compatible exercise and measurement definitions. Calculate the illustrative reference and deviations from the same illustrative records shown in the page; show a reference range only when sufficient history exists.
- With the single research recording selected, show its left/right estimates and explain that there are not enough compatible recordings for a time series or personal baseline.
- State that coordinate excursions are not clinical range-of-motion assessments. A difference is an observation, not an automatic improvement, deterioration, or warning.

Sessions:
- Show an interactive calendar and a history table with session ID, date (or clearly labeled processing date when capture date is unavailable), exercise, repetitions, recording duration, reconstruction status, quality, and source.
- Selecting an illustrative row opens its clearly labeled demo details. Selecting the research row offers a link to the Body Map; do not imply that illustrative sessions have corresponding videos or 3D reconstructions.

Gravity Analysis:
- Compare the precomputed gravitational potential-energy difference from the lowest reconstructed center-of-mass height to its initial height across microgravity, lunar, Mars, and Earth-reference scenarios.
- State that the same reconstructed movement is held fixed across scenarios. Clearly label modeled OpenSim body mass, center-of-mass excursion, gravity acceleration, and energy units; use status and low-confidence badges because the source reconstruction is limited.
- Explain the method, vertical-axis assumption, estimated phase boundaries, and source limitations. These values are not muscle work, metabolic expenditure, effort, exercise resistance, adaptation, joint loading, or a clinical assessment.
- Keep the scenario selector in AppShell synchronized with scenario highlighting on this tab. Changing it only selects/highlights an existing precomputed scenario; it does not recalculate movement or baseline data.
- State that a single research reconstruction cannot establish a personal astronaut baseline. Do not mix its values with illustrative history.
- Link Body Map to this tab using a direct Gravity Analysis URL.

Use the TALA pastel identity, direct labels, tabular numerals, and a chart/table toggle for every time-series chart. Put units, session IDs, dates, source labels, and available model status/confidence in chart tooltips. Avoid health-colored status coding; status labels must include text and an icon.
```

---

## Prompt 7: Check-in, Assistant, Sync, Crew, Settings

```
Build the remaining pages.

1) /app/checkin (finishable in under 60 seconds): sleep slider (0 to 12 h) with quality icons; fatigue 5-step segmented control (None, Mild, Moderate, High, Severe); muscle or joint soreness by tapping areas on a small body diagram then picking severity; optional mood and stress 5-step icon scale; optional hydration and nutrition toggles; optional note (280 characters). Buttons: "Save check-in" (primary), "Skip today" (tertiary). On save, show the updated readiness chip. Below the form, 14-day strip charts for each field.

2) /app/assistant, the TALA Knowledge Assistant: preserve the chat, source drawer, knowledge library, and theme controls. Identify the page as a curated research demonstration, not live frontend inference. Show a persistent banner that the UI uses prepared examples based on six NASA knowledge sources and that free-form chat inference is not enabled. Provide four selectable questions covering exercise countermeasures, musculoskeletal fitness, movement and biomechanics, and sleep and performance. Each selected question displays its prepared answer and source chips; the source drawer identifies content as a prepared source summary, shows why it supports that example, and does not invent page, section, or excerpt details. Custom questions appear in chat and receive an explicit demonstration-mode notice directing visitors to the prepared questions. The Knowledge Sources (6) tab lists NASA-STD-3001 Volumes 1 and 2, OCHMO-HB-004, OCHMO-TB-031, and the two relevant HRP evidence reports. Do not imply live retrieval, clinical decision support, verified excerpts, retrieval confidence, or measured vector-index counts.

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

5) Demo Mode: add a small "Demo" ribbon in the top bar and a clear route from Home to the record-and-review workflow. Do not add a simulated real-time anomaly or imply live inference.

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
