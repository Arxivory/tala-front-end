# Roadmap — TALA Crew Operations Portal

Source of truth: `docs/tala-spec.md` (uploaded prompt pack). Build stages one at a time.

## Done
- [x] Prompt 0 — Foundation: design tokens (light/night), theme provider (light/night/auto), logo + Tala avatar SVGs, app shell (nav rail, bottom tabs, top bar), reusable components in `src/components/tala`, all routes scaffolded with placeholders, mock data in `src/data` (crew, 45 sessions, thresholds, 60 s telemetry with anomaly at ~38 s, NASA excerpts + scripted Q&A, 5 sync bundles).

## Pending (paste/execute one prompt at a time)
- [ ] Prompt 1 — Landing page (`/`) and sign-in screen
- [ ] Prompt 2 — Onboarding wizard (4 steps)
- [ ] Prompt 3 — Home dashboard (`/app`)
- [ ] Prompt 4 — Session flow: list, pre-session setup, Live HUD (`/app/session/live`), summary (`/app/session/summary/:id`) — may split 4a/4b/4c
- [ ] Prompt 5 — Body Map (`/app/body`)
- [ ] Prompt 6 — Trends + Mechanical Loading Index (`/app/trends`)
- [ ] Prompt 7 — Check-in, Assistant, Sync, Crew, Settings
- [ ] Prompt 8 — Alerts system, professional gamification, edge-case states, accessibility polish, demo-mode hooks, final spec-compliance review
