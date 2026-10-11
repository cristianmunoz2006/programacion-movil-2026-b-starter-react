# Local Entity — Product

- **Store:** In-memory array (server/app.js)
- **Table/collection:** `products` (array loaded from the seed `server/data/products.json`)
- **Schema version introduced:** N/A (in-memory storage)

The data lives in the server's memory and is reset every time the server restarts: the array goes back to a copy of the seed. The app has no local storage; it always reads from the API.

---

## Fields

| Column | Type | Null | Notes |
|--------|------|------|-------|
| `id` | integer | No | Assigned by the server. `nextId` starts at the highest seed id + 1 and grows on every `POST`. An id is never reused, even after a `DELETE` (`length + 1` is NOT used). Cannot be changed by `PUT`. |
| `name` | string | No | Required. Validated with `trim()`; maximum 60 characters (`NAME_MAX_LENGTH`); saved trimmed. |
| `price` | number | No | `typeof number`, finite and greater than 0. The text `"100"` is invalid. Shown in the app with `formatCOP`. |
| `category` | string | No | One of `Bebidas`, `Snacks`, `Aseo`, `Hogar` (`CATEGORIES`). |
| `stock` | integer | No | `Number.isInteger` and greater than or equal to 0. Stock label: `Agotado` if 0, `Pocas unidades` if less than 5 (`LOW_STOCK_THRESHOLD`), `Disponible` otherwise. |

No `created_at` / `updated_at`: the exam defines the shape as `{ id, name, price, category, stock }`.

Validation messages (identical in the API and in `validateProduct`):
- `name es obligatorio`
- `name debe tener máximo 60 caracteres`
- `price debe ser un número mayor que 0`
- `category debe ser una de: Bebidas, Snacks, Aseo, Hogar`
- `stock debe ser un entero mayor o igual que 0`

---

## Indexes

N/A (in-memory storage)

---

## Relationships

N/A (in-memory storage)

---

## Sync

N/A (in-memory storage)

---

## Migration notes

N/A (in-memory storage)