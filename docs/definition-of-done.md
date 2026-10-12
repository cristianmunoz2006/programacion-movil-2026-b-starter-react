# Definition of Done (DoD)

Adapted to the Product Catalog exam project (Programación Móvil, CORHUILA, 2026-B). The work is **done only when all of these are true**:

## Exam criteria

- [ ] All criteria of the exam statement are met (the seven parts: docs, API, app, Kotlin, quality, Git, English).
- [ ] The seven documents in `docs/` are filled from their templates, with no instruction blocks left, and describe everything that was programmed.
- [ ] The documentation commits come before the first code commit.

## Quality

- [ ] At least 4 new tests pass with `npm test`: 2 or more unit tests (`validateProduct`, `toProductView` or `filterProducts`) and 2 or more API tests using `startTestServer()`.
- [ ] One test provokes a 404 from the given handler (`unknownRoute_whenRequested_returns404FromGivenHandler`) and the README explains it in English.
- [ ] `npm run lint` finishes without errors.
- [ ] `npm run build` finishes without errors.
- [ ] No new type warnings introduced.

## Behavior

- [ ] The app works in the browser against the API (`npm run server` and `npm run dev`), with the full CRUD.
- [ ] The product list handles the four states: loading, empty, no results and error with «Reintentar».
- [ ] Detail and form screens handle loading and error (including «no encontrado»).
- [ ] The form validates inline with `validateProduct`, and shows the server `details` if the API rejects the data.
- [ ] `kotlin/Product.kt` compiles and runs in the Kotlin Playground.

## Delivery

- [ ] Work is on a `feature/…` branch, with at least 6 commits following Conventional Commits.
- [ ] Pull Request opened to `main` of the **own fork**, with a description and this checklist marked. The PR is **not merged or squashed**: the commits are the evidence of authorship.
- [ ] README explains how to run the project (`npm run server`, `npm run dev`) and includes the two English sections: "State management decision" and "API error handling".
- [ ] Documentation is up to date (feature, screens, ADR-001, ADR-002, API docs).
- [ ] No secrets: `.env` is ignored by Git, `.env.example` is present, and `node_modules` is not committed.

## Not applicable

- N/A — Runs on both native platforms: the project is a browser app (Ionic React); no Android or iOS project is requested.
- N/A — Strings localized: the interface text is in Spanish only, as the exam statement and the starter define it.
- N/A — Analytics / crash reporting: out of the exam scope.
- N/A — Offline state: the app is online-only (see `docs/api/products-endpoints.md`).
- N/A — Code merged to `main` via a reviewed PR: the exam asks to open the PR, not to merge it.

> Work that does not meet the full DoD is **not done** — it stays open.