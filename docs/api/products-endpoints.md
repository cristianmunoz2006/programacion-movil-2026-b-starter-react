# Endpoint Integration — Products

- **Feature:** Product catalog (see `docs/features/productos.md`)
- **Base URL:** `API_URL` (from `VITE_API_URL`) + `/api/products`
- **Auth required:** No

All errors use the same format. `details` has one message per problem, all accumulated:

```json
{ "error": "Datos inválidos", "details": ["..."] }
```

Client functions live in `src/features/products/data/products-api.ts` and go through `request<T>()`. The API JSON is used directly as the `Product` type (no DTOs, out of scope), so there is no DTO → domain mapping. Only `toProductView` transforms a product, and only for display (price with `formatCOP`, stock label).

---

## 1. List products

- **Method + path:** `GET /api/products`
- **Client function:** `getProducts()`

### Request

| Param | In | Type | Required | Notes |
|-------|----|------|----------|-------|
| `search` | query | string | No | Name contains the text, case-insensitive (`toLowerCase` + `includes`) |
| `category` | query | string | No | Exact match |

`search` and `category` can be combined. The app does not send them: it loads everything and filters in memory with `filterProducts`. They stay in the contract and are covered by the API.

**Body:** none.

### Response

**Success (200):**
```json
[
  { "id": 1, "name": "Agua 600 ml", "price": 2500, "category": "Bebidas", "stock": 40 }
]
```

### Errors

| Status | Meaning | App behavior |
|--------|---------|--------------|
| none | The API defines no error for this endpoint | — |
| 500 | Unexpected server error (central handler) | List shows the error state: «No se pudo cargar» + `getErrorMessage` + «Reintentar» |
| network (`status` null) | Server not reached | Same error state as above |

---

## 2. Get one product

- **Method + path:** `GET /api/products/:id`
- **Client function:** `getProduct(id)`

### Request

| Param | In | Type | Required | Notes |
|-------|----|------|----------|-------|
| `id` | path | integer | Yes | Positive integer; read with `Number(useParams<{ id: string }>().id)` |

**Body:** none.

### Response

**Success (200):**
```json
{ "id": 1, "name": "Agua 600 ml", "price": 2500, "category": "Bebidas", "stock": 40 }
```

### Errors

Order of checks: `parseId` first, then lookup.

| Status | Meaning | Response body | App behavior |
|--------|---------|---------------|--------------|
| 400 | `id` is not a positive integer | `{ "error": "Id inválido", "details": ["El id debe ser un número entero positivo"] }` | Detail/edit screen shows `getErrorMessage`; no «Reintentar» |
| 404 | No product with that id | `{ "error": "Producto no encontrado", "details": ["No existe un producto con id N"] }` | Same as above (not-found state) |
| network (`status` null) | Server not reached | — | Same as above |

---

## 3. Create product

- **Method + path:** `POST /api/products`
- **Client function:** `createProduct(input)`

### Request

**Body:**
```json
{ "name": "Jabón líquido", "price": 8900, "category": "Aseo", "stock": 12 }
```

| Field | Type | Rule | Message when invalid |
|-------|------|------|----------------------|
| `name` | string | Required; checked with `trim()`; max 60 characters; saved trimmed | `name es obligatorio` · `name debe tener máximo 60 caracteres` |
| `price` | number | `typeof number`, finite and > 0 (the text `"100"` is invalid) | `price debe ser un número mayor que 0` |
| `category` | string | One of `Bebidas`, `Snacks`, `Aseo`, `Hogar` | `category debe ser una de: Bebidas, Snacks, Aseo, Hogar` |
| `stock` | number | `Number.isInteger` and ≥ 0 | `stock debe ser un entero mayor o igual que 0` |

The new `id` is assigned by the server: `nextId` starts at the highest seed id + 1 and grows on every POST. An id is never reused.

### Response

**Success (201):** the created product, with its new `id`.
```json
{ "id": 9, "name": "Jabón líquido", "price": 8900, "category": "Aseo", "stock": 12 }
```

### Errors

| Status | Meaning | Response body | App behavior |
|--------|---------|---------------|--------------|
| 400 | Validation failed (all problems accumulated) | `{ "error": "Datos inválidos", "details": ["..."] }` | Form shows the server `error` and each `details` message in `IonText` (danger); stays on screen |
| 400 | Malformed JSON (central handler) | Central handler format | Form shows `getErrorMessage` |
| network (`status` null) | Server not reached | — | Form shows `getErrorMessage` |

On success the form goes back to `/productos`.

---

## 4. Update product

- **Method + path:** `PUT /api/products/:id`
- **Client function:** `updateProduct(id, input)`

### Request

| Param | In | Type | Required | Notes |
|-------|----|------|----------|-------|
| `id` | path | integer | Yes | Positive integer |

**Body:** same four fields and rules as `POST`. `PUT` replaces the whole product (it is validated like `POST`) and keeps the `id`.
```json
{ "name": "Jabón líquido 500 ml", "price": 9500, "category": "Aseo", "stock": 8 }
```

### Response

**Success (200):** the updated product.
```json
{ "id": 9, "name": "Jabón líquido 500 ml", "price": 9500, "category": "Aseo", "stock": 8 }
```

### Errors

Order of checks: `parseId` → lookup → validation.

| Status | Meaning | Response body | App behavior |
|--------|---------|---------------|--------------|
| 400 | `id` is not a positive integer | `{ "error": "Id inválido", "details": ["El id debe ser un número entero positivo"] }` | Form shows `getErrorMessage` |
| 404 | No product with that id | `{ "error": "Producto no encontrado", "details": ["No existe un producto con id N"] }` | Form shows `getErrorMessage` |
| 400 | Validation failed (all problems accumulated) | `{ "error": "Datos inválidos", "details": ["..."] }` | Form shows the server `error` and each `details` message in `IonText` (danger) |
| network (`status` null) | Server not reached | — | Form shows `getErrorMessage` |

On success the form goes back to `/productos`.

---

## 5. Delete product

- **Method + path:** `DELETE /api/products/:id`
- **Client function:** `deleteProduct(id)`

### Request

| Param | In | Type | Required | Notes |
|-------|----|------|----------|-------|
| `id` | path | integer | Yes | Positive integer |

**Body:** none.

### Response

**Success (204):** no body (`res.status(204).end()`).

### Errors

Order of checks: `parseId` first, then lookup.

| Status | Meaning | Response body | App behavior |
|--------|---------|---------------|--------------|
| 400 | `id` is not a positive integer | `{ "error": "Id inválido", "details": ["El id debe ser un número entero positivo"] }` | Detail screen shows `getErrorMessage` |
| 404 | No product with that id | `{ "error": "Producto no encontrado", "details": ["No existe un producto con id N"] }` | Detail screen shows `getErrorMessage` |
| network (`status` null) | Server not reached | — | Detail screen shows `getErrorMessage` |

The app asks for confirmation on screen first («¿Eliminar este producto?» + «Confirmar» / «Cancelar», state `confirmingDelete`). On success it goes back to `/productos`.

---

## Unknown routes

Any other route is answered by the handler given by the starter: `404`. It is not modified. It is covered by the test `unknownRoute_whenRequested_returns404FromGivenHandler`.

---

## Caching / offline

- **Strategy:** online-only (no cache, no offline mode).
- **Cached entity:** N/A (the server keeps products in memory; see `product-entity.md`).
- **TTL / invalidation:** N/A. The list is fetched again every time it becomes visible (`useIonViewWillEnter`, see ADR-001).