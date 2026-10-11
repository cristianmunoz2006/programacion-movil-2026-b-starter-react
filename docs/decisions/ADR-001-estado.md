# ADR-001 — State management inside each page

- **ID:** ADR-001
- **Date:** 2026-10-10
- **Status:** Accepted
- **Authors:** Juan Camilo Bernal Gordillo

---

## Context

The product catalog app has three screens: list, detail and form (the form covers create and edit). Each screen needs only its own local state:

- **List:** products array, loading flag, error, search text and selected category.
- **Detail:** product, loading flag, error and `confirmingDelete` (boolean for the on-screen delete confirmation).
- **Form:** field values, validation errors, saving flag and the error returned by the server.

No data has to be shared live between screens. When the person comes back to the list after creating, editing or deleting a product, the list must show fresh data. This decision is needed now because every page is written from it.

**Known constraints:**
- Course scope (weeks 6–9): React 18 with `useState` and `useEffect`; no new dependencies, no Context API, no custom hooks.
- Individual exam with a deadline of Monday 12 October 2026, so the simplest option that meets the PDF wins.
- Ionic keeps previous pages mounted in the navigation stack, so `useEffect` alone does not re-run when returning to the list.

---

## Decision

**We decided:** each page keeps its own state with `useState` and loads data with `useEffect`; the list also reloads with `useIonViewWillEnter` when it becomes visible again. There is no global store.

**Justification:**
The state of each screen is small and independent, and the PDF asks for this pattern ("the state lives in each page with `useState` and `useEffect`"). `useIonViewWillEnter` solves the stale-list problem without extra structure. The tiebreaker was simplicity: fewer files, fewer concepts to explain, and the code stays easy to read.

---

## Evaluated alternatives

| Alternative | Pros | Cons | Reason for discarding |
|-------------|------|------|-----------------------|
| `useState` + `useEffect` in each page (+ `useIonViewWillEnter`) — chosen | Simplest; no extra files; matches what was taught and what the PDF asks | Some repeated loading/error code across pages | — (chosen) |
| MVVM state holder (framework example) | Clear separation between view and logic; easy to test the logic alone | Extra classes and files; not seen in the course; too heavy for 3 small screens | Over-engineering for the scope of the exam |
| Global store (Redux / Context API) | One shared source of truth; no repeated fetches | Redux needs a new dependency; Context is out of scope; no data is actually shared between screens | Solves a problem this app does not have |
| Custom hook (e.g. `useProducts`) | Removes repeated loading/error code | Not requested; adds an abstraction the course did not cover | Not needed at this size; can be extracted later |

---

## Consequences

**Positive:**
- Few moving parts: each page can be understood by reading only that file.
- No new dependencies and nothing outside the course material.
- The list always shows fresh data after create, edit or delete.

**Negative / Trade-offs:**
- Loading and error handling is repeated in the list, detail and form pages.
- The list is fetched again every time it becomes visible, even if nothing changed.
- No shared cache: the detail page fetches its product again instead of reusing the list data.

**What would change if the app grew:**
- If more screens repeated the same loading/error logic, extract a custom hook such as `useProducts`.
- If several screens had to share or cache the same data, move to a store (Context or a state library).

**Impact on the system:**
- Affected features/screens: product list, product detail, product form.
- Documents to update: `docs/screens/lista-productos.md`, `docs/screens/detalle-producto.md`, `docs/screens/formulario-producto.md` (only if the state they describe changes); the "State management decision" section of the README is based on this ADR.

---

## References

- Exam statement (Parte 3): state lives in each page with `useState` and `useEffect`.
- Mobile Governance Framework: MVVM state holder example (discarded).
- Related to: ADR-002 (API consumption).