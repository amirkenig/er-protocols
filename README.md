# er-protocols

Hebrew (RTL), offline-capable bedside reference for adult emergency department protocols, with a
fully tested dose and infusion calculator engine.

> **Clinical decision support only.** This app does not replace clinical judgement, physician
> orders or local hospital protocols. It covers **adults only**. Content marked "לא מאומת"
> (unverified) has not been reviewed by a clinician. See `docs/unverified.md`.

## Commands
```bash
npm install
npm run dev          # local dev server
npm test             # unit tests (Vitest)
npm run coverage     # engine coverage (100% required)
npm run e2e          # Playwright smoke tests (builds and serves the app)
npm run report:unverified   # regenerate docs/unverified.md and docs/sources.md
```

## Layout
- `src/engine/` — pure calculation engine (no UI imports). All dose math lives here.
- `src/content/` — clinical content as Zod-validated data, source registry, calculator metadata.
- `src/ui/`, `src/state/` — React UI. Patient inputs live in memory only and are never stored.
- `docs/decisions.md` — clinical decisions by the clinical owner; `docs/sources.md` — sources with read level.
