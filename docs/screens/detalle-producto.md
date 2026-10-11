# Screen — Product detail

- **Route:** `/productos/:id`
- **Feature:** [Product catalog](../features/productos.md)
- **Design reference:** N/A (no mockup; layout defined by the regions below)

---

## Purpose

Show every field of one product, and let the user go to the edit form or delete the product after an on-screen confirmation.

---

## UI regions

| Region | Component | Notes |
|--------|-----------|-------|
| Header | `IonHeader` + `IonToolbar` + `IonButtons` + `IonBackButton` + `IonTitle` | Title: «Detalle del producto». The back button returns to `/productos`. |
| Body | `IonList` + `IonItem` + `IonLabel`, `IonBadge`, `IonSpinner` | Fields shown (from `toProductView`): Id, Nombre, Categoría, Precio (`priceLabel`, e.g. `$ 1.250.000`), Stock (the number) and Disponibilidad (`stockLabel` in an `IonBadge`). |
| CTA | `IonButton` | «Editar» → `/productos/:id/editar`. «Eliminar» starts the confirmation. |
| Delete confirmation | `IonText` + 2 `IonButton` | Shown in place of the «Eliminar» button when the boolean `confirmingDelete` is true: «¿Eliminar este producto?» with «Confirmar» and «Cancelar». No `IonAlert`, `IonModal` or `window.confirm`. |

Stock badge color: «Agotado» danger, «Pocas unidades» warning, «Disponible» success (same rule as the list).

---

## States

| State | Trigger | UI |
|-------|---------|-----|
| Loading | `getProduct(id)` in flight | `IonSpinner` + text «Cargando producto…». |
| Loaded | Request succeeded | Fields, «Editar» and «Eliminar». |
| Confirming delete | User taps «Eliminar» | Fields stay visible; the question «¿Eliminar este producto?» with «Confirmar» and «Cancelar» replaces the «Eliminar» button. «Editar» stays. |
| Not found | API answers 404 (id does not exist) | Title «No se pudo cargar», message from `getErrorMessage(error)` (the API text «Producto no encontrado»). No fields, no «Editar» or «Eliminar». The header back button is the way out. |
| Error | Any other failure while loading or deleting (network, 400 for a non-numeric id, 500) | Title «No se pudo cargar», message from `getErrorMessage(error)`. A failed delete also lands here. No «Reintentar» on this screen; the user goes back with the header button. |
| Offline | N/A | No offline mode: a network failure is an Error state (`ApiError.isNetworkError`). |

---

## Actions

| User action | Result | Function / event |
|-------------|--------|------------------|
| Open the screen | Reads `:id` from the route, shows Loading, then Loaded / Not found / Error | `getProduct(id)` in `useEffect`; `id = Number(useParams().id)` |
| Tap «Editar» | Navigates to `/productos/:id/editar` | `history.push` |
| Tap «Eliminar» | Shows the confirmation | `setConfirmingDelete(true)` |
| Tap «Cancelar» | Hides the confirmation; the product stays | `setConfirmingDelete(false)` |
| Tap «Confirmar» | Deletes the product and navigates to `/productos` | `deleteProduct(id)` (API answers 204), then `history.push` |
| Tap the back button | Navigates to `/productos` | `IonBackButton` |

---

## Accessibility

- [x] All interactive elements have accessible labels (buttons have visible text).
- [x] Stock status is conveyed by text («Agotado», «Pocas unidades», «Disponible»), not by color alone.
- [x] Deleting needs two taps (confirmation), so it cannot happen by accident.
- [ ] Touch targets ≥ 44×44 pt / 48×48 dp. Not verified yet.
- [ ] Text scales with OS font-size setting. Not verified yet.
- [ ] Contrast meets WCAG AA. Not verified yet.