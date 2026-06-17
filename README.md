# Carbon Companion 🌍

**A personal carbon companion that helps one individual understand, track, and reduce their carbon footprint through simple actions and personalised insights.**

> Problem statement: _"Design a solution that helps individuals understand, track, and reduce their carbon footprint through simple actions and personalized insights."_

This project is **individual-first by design**. A person answers a short questionnaire, sees an honest, sourced breakdown of their annual footprint, learns what drives it most, gets a **ranked personalised action plan** with the real kg CO₂e each action saves, commits to actions and watches their number drop, tracks progress over time, and sees a **live grid-intensity signal** telling them the best time to run power-hungry appliances. Country/world data appears only as motivating context — never as the centrepiece.

**Live demo:** _<add Vercel URL here>_

---

## Why this is built the way it is (mapped to the judging criteria)

| Criterion | How it's addressed |
|---|---|
| **Code Quality** | Strict TypeScript (no `any`), a pure `/lib/carbon` engine with zero UI/IO deps, JSDoc on public functions, ESLint + Prettier, clear folder structure, `ARCHITECTURE.md` + `METHODOLOGY.md`. |
| **Security** | All inputs validated/sanitised with `zod` at every boundary; secrets only via env (`.env.example`, never committed); CSP + security headers in `next.config.mjs`; **local-first — no PII leaves the device**; pinned dependencies. |
| **Efficiency** | O(n) deterministic engine over a handful of inputs; memoised derived values; lazy-loaded charts and planet-context data; lean bundle. |
| **Testing** | Vitest + React Testing Library; **the calc engine has ~100% coverage**; component tests for the questionnaire/results; one Playwright E2E for the critical path; all run in CI on every push. |
| **Accessibility** | Targets **WCAG 2.2 AA**: semantic HTML, landmarks, labelled controls, visible focus, full keyboard operability, `aria-live` results, contrast-checked palette, `prefers-reduced-motion`, and **text/table equivalents for every chart**. |
| **Problem Statement Alignment** | Individual-first; the full **understand → track → reduce** loop is visibly present; "simple actions" = the ranked plan; "personalised insights" = comparisons + live grid timing + scenario sim. |

---

## Quick start

```bash
npm install
npm run dev          # http://localhost:3000
```

| Command | What it does |
|---|---|
| `npm run test` | Run the unit + component test suite |
| `npm run test:coverage` | Run tests with a coverage report |
| `npm run test:e2e` | Run the Playwright critical-path E2E |
| `npm run typecheck` | Strict TypeScript check (no emit) |
| `npm run lint` | ESLint |
| `npm run build` | Production build |

No API keys are required — the app works fully offline using bundled, sourced emission factors and the **no-key UK Carbon Intensity API**. Optional keys (Electricity Maps, Climatiq) unlock live grid and richer factors; see `.env.example`.

---

## Data sources & methodology

Every emission factor traces to a cited public source with a `source` + `year` field — nothing is invented. Primary sources: **UK DESNZ/DEFRA** GHG conversion factors, **US EPA**, **IEA** grid intensities, **Poore & Nemecek (2018)** for diet, and **Our World in Data** for country comparisons. CO₂e uses **IPCC AR6 GWP100**. See [`METHODOLOGY.md`](./METHODOLOGY.md) for the full breakdown and assumptions, and [`ARCHITECTURE.md`](./ARCHITECTURE.md) for the system design.

## Repository size

The repo is kept **under 10 MB**: `node_modules`, build output and large raw datasets are git-ignored; only a tiny curated emission-factor table and a pre-trimmed country JSON are committed.

## License & attribution

Data used under their respective licenses (DEFRA OGL, OWID CC BY). See `METHODOLOGY.md` for attributions.
