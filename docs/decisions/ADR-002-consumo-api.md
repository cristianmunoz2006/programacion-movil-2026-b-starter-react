# ADR-002 — API consumption through a single fetch client

- **ID:** ADR-002
- **Date:** 2026-10-10
- **Status:** Accepted
- **Authors:** Juan Camilo Bernal Gordillo

---

## Context

The app consumes its own Express API (`/api/products`) for the five CRUD operations. All pages need the same things: build the URL, send and parse JSON, and tell a network failure apart from a response the server rejected. If each page did this on its own, the logic would be duplicated and the error messages would be inconsistent.

The starter already provides the base pieces: `API_URL`, `ApiError`, `getErrorMessage` and `request<T>()`. This ADR records how they are used and why, including the server-side handlers that were given.

**Known constraints:**
- Course scope (weeks 6–9): `fetch` and TypeScript only; no new dependencies.
- Individual exam with a deadline of Monday 12 October 2026.
- The framework suggests repositories and use cases, but the exam statement asks the pages to use the `data/` layer directly.

---

## Decision

**We decided:** all HTTP calls go through one function, `request<T>()` in `data/products-api.ts`, built on `fetch`. The pages call the functions of the `data/` layer directly, with no use cases or repositories.

**Justification:**
A single client keeps URL building, JSON handling and error translation in one place. Calling the data layer directly from the pages is a conscious deviation from the framework: with five small operations, extra layers would add files without adding value. This is the simplest option that meets the exam statement.

**Client side:**
- `API_URL` comes from `VITE_API_URL` through `data/config.ts` (set in `.env`; `.env.example` has no secrets).
- `getProducts`, `getProduct`, `createProduct`, `updateProduct` and `deleteProduct` are the only functions the pages use.
- `ApiError` separates two cases: a **network error** (the server was not reached: `status` is `null` and `isNetworkError` is true) and a **non-successful response** (it carries the HTTP `status` and the server's `details`).
- `getErrorMessage` turns any error into Spanish text for the person using the app.
- No retries and no timeouts: out of scope.

**Server side (`server/app.js`, given by the starter):**
- `express.json()` parses JSON request bodies.
- `cors` allows the browser app (another origin) to call the API.
- `parseId` converts the `:id` parameter to a positive integer, or `null` if it is not valid (the route then answers 400).
- A handler for unknown routes answers 404.
- A central error handler answers 400 for malformed JSON and 500 for any other unexpected error.

---

## Evaluated alternatives

| Alternative | Pros | Cons | Reason for discarding |
|-------------|------|------|-----------------------|
| One `request<T>()` with `fetch` in `data/` — chosen | Native, no dependency; one place for errors; given by the starter | Written by hand (headers, JSON parsing) | — (chosen) |
| `axios` | Less boilerplate; built-in interceptors | New dependency (not allowed); not seen in the course | Forbidden by the exam scope |
| Loose `fetch` in each page | Fewest files | Duplicated code; inconsistent error handling; hard to test | Repeats logic five times and hides the error contract |
| Repository + use cases (framework) | Clean separation; easy to swap the data source | Extra layers and files for five simple calls | Over-engineering; the exam asks for direct calls to `data/` |

---

## Consequences

**Positive:**
- One place to change the base URL, headers or error handling.
- Pages stay short: they call a function and handle `ApiError`.
- The person always gets a readable Spanish message, and network failures are distinguished from server rejections.

**Negative / Trade-offs:**
- Pages depend directly on the `data/` layer, so swapping the data source would touch the pages.
- No retries or timeouts: a slow or lost request fails once and the person must press «Reintentar» (list) or go back.
- The deviation from the framework (no use cases or repositories) must be explained and is limited to this project size.

**Impact on the system:**
- Affected features/screens: product list, product detail, product form.
- Documents to update: `docs/api/products-endpoints.md` (error behavior in the app); the "API error handling" section of the README is based on this ADR.

---

## References

- Exam statement: "Ya resuelto en el starter" (`API_URL`, `ApiError`, `getProducts`, handlers) and Parte 7 (API error handling).
- Mobile Governance Framework: repository and use-case layers (discarded).
- Related to: ADR-001 (state management).