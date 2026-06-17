# Architecture

## Principles
- **Individual-first.** Every screen serves one person's understand → track → reduce loop.
- **Local-first / privacy by default.** Footprint history lives in the browser (IndexedDB/localStorage); no account, no PII leaves the device.
- **Pure core, thin shell.** All domain logic is a pure, dependency-free module; UI and IO sit at the edges.

## Layers
```
app/                Next.js App Router pages (UI shell)
  page.tsx          Landing + entry to the questionnaire
components/         Presentational + interactive UI (built in Messages 2–5)
lib/
  carbon/           ◀ PURE ENGINE — no UI, no IO, ~100% test coverage
    types.ts        Domain types
    factors.ts      Sourced emission-factor tables (audit trail per factor)
    schema.ts       zod validation (security boundary)
    calculate.ts    Deterministic calculation functions
    index.ts        Public barrel export
  grid/             Live grid-intensity adapters (built in Message 4)
  data/             Pre-trimmed OWID country JSON (built in Message 5)
test/               Test setup
e2e/                Playwright critical-path E2E
```

## Data flow
1. User input → `footprintInputSchema.parse` (validate/sanitise).
2. Validated input → `calculateFootprint` (pure) → result + comparison.
3. Result rendered with accessible chart **and** a table equivalent.
4. Result persisted locally for trend tracking.
5. Live grid signal fetched client-side (no-key UK API by default).

## Why this scores well
A pure engine is trivially testable (Testing), has no attack surface of its own (Security),
runs in O(n) (Efficiency), and is small and well-named (Code Quality). Keeping all data
on-device is both a privacy/security feature and a direct fit to the individual-first brief.
