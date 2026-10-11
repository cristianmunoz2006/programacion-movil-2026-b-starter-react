# Screen — Product list

- **Route:** `/productos`
- **Feature:** [Product catalog](../features/productos.md)
- **Design reference:** N/A (no mockup; layout defined by the regions below)

---

## Purpose

Show every product from the API, let the user search by name and filter by category (both applied in memory with `filterProducts`), open a product's detail, and go to the create form.

---

## UI regions

| Region | Component | Notes |
|--------|-----------|-------|
| Header | `IonHeader` + `IonToolbar` + `IonTitle` | Title: «Productos». |
| Search | `IonInput` | Placeholder «Buscar por nombre». Filters by name, case-insensitive. |
| Category filter | 5 `IonButton` | «Todas», «Bebidas», «Snacks», «Aseo», «Hogar». The selected one uses `fill="solid"`, the others `fill="outline"`. Default: «Todas». |
| Body | `ProductCard` list, `IonSpinner`, `EmptyState` | One `ProductCard` per product after filtering. Shows name, category, price (`priceLabel`) and stock badge (`stockLabel`). |
| CTA | `IonButton` | «Nuevo producto» → `/productos/nuevo`. |

Stock badge (`IonBadge`): «Agotado» if stock is 0 (color danger), «Pocas unidades» if stock is below 5 (color warning), «Disponible» otherwise (color success).

---

## States

| State | Trigger | UI |
|-------|---------|-----|
| Loading | `getProducts()` in flight | `IonSpinner` + text «Cargando productos…». |
| Loaded | Request succeeded and at least one product matches the filters | `ProductCard` list. |
| Empty | Request succeeded and the API returned no products | `EmptyState`: title «No hay productos», message «Aún no hay productos en el catálogo.», plus the «Nuevo producto» button. |
| No results | Products exist but search/category match none | `EmptyState`: title «Sin resultados», message «Ningún producto coincide con la búsqueda o la categoría.» Search and category controls stay visible. |
| Error | Request failed (network, 4xx, 5xx) | Title «No se pudo cargar», message from `getErrorMessage(error)`, button «Reintentar». |
| Offline | N/A | No offline mode: a network failure is an Error state (`ApiError.isNetworkError`). |

---

## Actions

| User action | Result | Function / event |
|-------------|--------|------------------|
| Open the screen, or come back to it | Loads all products and shows Loading, then Loaded / Empty / Error | `getProducts()` in `useEffect` and `useIonViewWillEnter` |
| Type in the search box | List narrows by name | `filterProducts(products, { search, category })` |
| Tap a category button | List narrows by category; combines with the search | `filterProducts(products, { search, category })` |
| Tap a `ProductCard` | Navigates to `/productos/:id` | `history.push` |
| Tap «Nuevo producto» | Navigates to `/productos/nuevo` | `history.push` |
| Tap «Reintentar» | Shows Loading and requests the list again | `getProducts()` |

---

## Accessibility

- [x] All interactive elements have accessible labels (buttons have visible text; the search input has an `aria-label`).
- [x] Stock status is conveyed by text («Agotado», «Pocas unidades», «Disponible»), not by color alone.
- [ ] Touch targets ≥ 44×44 pt / 48×48 dp. Not verified yet.
- [ ] Text scales with OS font-size setting. Not verified yet.
- [ ] Contrast meets WCAG AA. Not verified yet.