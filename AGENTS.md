<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

# TALA project rules

## Architecture
- Front-end-only prototype: all data comes from typed mock modules in `src/data`; persistence uses localStorage only. Do not add a backend unless the user asks.
- Mock generators (sessions, telemetry) must be deterministic — seeded PRNG, never `Math.random` at module scope — so SSR and client render identically on workerd.
- The spec says "React Router"; this stack uses TanStack Router with file-based routes under `src/routes` (`app.*` under the `/app` shell). Never install react-router-dom.
- Reusable TALA components live in `src/components/tala`; shadcn primitives in `src/components/ui`. Status is always color + icon + text label, never color alone.
- The spec document `docs/tala-spec.md` is the source of truth; update it when labels, thresholds or sections change in the app.

## Content
- Never show or imply bone density, bone loss, BV/TV or diagnosis. Use "Mechanical Loading Index" (never "Skeletal Integrity Index"). Footnote where relevant: "Shows mechanical loading, not bone status."
- Every model-derived number shows unit + status pill + confidence badge; every guidance message shows a citation chip; anything mocked carries a dashed "Demo placeholder" tag.
- Tone: professional, calm, mission-log style. No exclamation marks, no confetti, no all-caps eyebrow labels. Placeholder thresholds/citations are labeled "example, needs clinical review".
