# Feature — Product catalog

- **Owner:** Cristian Andres Muñoz Montengro
- **Status:** In progress
- **Related stories:** N/A (individual midterm assignment, no user stories)

---

## Purpose

Let a user browse, search, filter, create, edit and delete the products of a small catalog. The data comes from our own Express API, and the app validates the same rules as the server.

---

## Screens

| Screen | Route | Purpose |
|--------|-------|---------|
| Product list | `/productos` | Load all products, search by name, filter by category, open a product or go to create one. See [`lista-productos.md`](../screens/lista-productos.md). |
| Product detail | `/productos/:id` | Show every field of one product; start editing or delete it. See [`detalle-producto.md`](../screens/detalle-producto.md). |
| Product form (create) | `/productos/nuevo` | Create a product with inline validation. See [`formulario-producto.md`](../screens/formulario-producto.md). |
| Product form (edit) | `/productos/:id/editar` | Same form screen as create, preloaded with the product. See [`formulario-producto.md`](../screens/formulario-producto.md). |

---

## State

- **Pattern:** `useState` + `useEffect` inside each page, with no global store (see ADR-001). The list page also reloads with `useIonViewWillEnter` when the user comes back to it.
- **State object(s):** each page owns its own local state: the data it loads, a loading flag and an error. The list page adds the search text and the selected category. The detail page adds a boolean for the delete confirmation. The form page adds the field values, one validation message per field and the server error.
- **Key transitions:**
  - Every page: `loading → ready | error`.
  - Error → «Reintentar» (list) → `loading` again.
  - List only: `ready → empty` (the API has no products) or `ready → no results` (the filters match nothing).
  - Detail: `ready → confirming delete → deleted` (navigate to `/productos`) or back to `ready` on «Cancelar».

---

## Data

- **Use cases:** N/A. Pages call `data/products-api.ts` directly (deliberate deviation from the framework, see ADR-002).
- **Repositories:** N/A (same reason).
- **Remote sources / endpoints:**

| Function | Endpoint |
|----------|----------|
| `getProducts` | `GET /api/products` |
| `getProduct` | `GET /api/products/:id` |
| `createProduct` | `POST /api/products` |
| `updateProduct` | `PUT /api/products/:id` |
| `deleteProduct` | `DELETE /api/products/:id` |

  Full contract in [`products-endpoints.md`](../api/products-endpoints.md) and [`product-entity.md`](../api/product-entity.md).
- **Local persistence:** N/A (in-memory API). Data on the server resets when the server restarts. The app stores nothing locally.

---

## Edge cases & states

- [x] Loading — spinner while the request is in flight (list, detail, and form in edit mode).
- [x] Empty — the API returns no products (list).
- [x] No results — products exist, but search and category match none (list).
- [x] Error / retry — network or server failure shown with its message; «Reintentar» on the list.
- [x] Not found — the id does not exist (API 404), shown in the detail and edit screens with the API message.
- [ ] Offline — N/A: no offline mode is built. A network failure is treated as an error state (`ApiError`, network error) with retry.
- [ ] Permission denied — N/A: the app has no authentication or permissions.

---

## Decisions

- [ADR-001 — State management](../decisions/ADR-001-estado.md)
- [ADR-002 — API consumption](../decisions/ADR-002-consumo-api.md)

---

## Tests

- **Unit** (`src/features/products/__tests__/product.test.ts`):
  - `validateProduct_whenFieldsInvalid_returnsOneErrorPerField`
  - `validateProduct_whenInputValid_returnsIsValid`
  - `toProductView_whenStockVaries_returnsLabelAndPrice`
  - `filterProducts_whenSearchAndCategory_returnsMatches`
- **API** (`src/features/products/__tests__/products-api.test.ts`, using `startTestServer()`):
  - `postProduct_whenInvalid_returns400WithDetails`
  - `getProduct_whenIdDoesNotExist_returns404`
  - `getProduct_whenIdNotNumeric_returns400`
  - `unknownRoute_whenRequested_returns404FromGivenHandler`
- **Widget/UI:** N/A (not required for this assignment).
- **Integration/E2E:** N/A (not required for this assignment).

---

## Related deliverable: Kotlin exercise

File `kotlin/Product.kt`, using only basic Kotlin (`val`/`var`, functions, classes, `Int?`, `?.`, `?:`, `if`/`when`, string templates):

- `class Product(val id: Int, val name: String, var price: Double, val category: String, var stock: Int?)`. `stock` may be `null`.
- `fun stockLabel(stock: Int?): String`: «Sin dato» if `null`; otherwise «Agotado», «Pocas unidades» or «Disponible», with the same rules as the app.
- `fun applyDiscount(price: Double, percent: Int): Double`.
- `main()`: creates 3 products (one with `stock` null and one out of stock) and prints each name, stock label and price with a 10 % discount.
- It must compile and run in the Kotlin Playground (play.kotlinlang.org). No Android project.