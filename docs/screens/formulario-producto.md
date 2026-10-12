# Screen — Product form (create and edit)

- **Route:** `/productos/nuevo` (create) and `/productos/:id/editar` (edit)
- **Feature:** [Product catalog](../features/productos.md)
- **Design reference:** N/A (no mockup; layout defined by the regions below)

---

## Purpose

One screen to create a product or edit an existing one. The mode depends on the route: `/productos/nuevo` is create mode; `/productos/:id/editar` is edit mode, with the fields preloaded. Input is validated inline with `validateProduct`, and if the server rejects the data its messages are shown too.

---

## UI regions

| Region | Component | Notes |
|--------|-----------|-------|
| Header | `IonHeader` + `IonToolbar` + `IonButtons` + `IonBackButton` + `IonTitle` | Title: «Nuevo producto» in create mode, «Editar producto» in edit mode. The back button returns to `/productos`. |
| Name | `IonInput` | Label «Nombre». Message below the field. |
| Price | `IonInput` (`type="number"`) | Label «Precio». The text is converted with `Number(...)` before validating; an empty field becomes `NaN`. Message below the field. |
| Category | 4 `IonButton` | «Bebidas», «Snacks», «Aseo», «Hogar». The selected one uses `fill="solid"`, the others `fill="outline"`. None selected at the start in create mode. Message below the buttons. |
| Stock | `IonInput` (`type="number"`) | Label «Stock». Converted with `Number(...)`; an empty field becomes `NaN`. Message below the field. |
| Server error | `IonText` (color danger) | Shows the API `error` and each text of `details`. Only after a server rejection. |
| CTA | `IonButton` | «Guardar». Shows «Guardando…» and is disabled while the request is in flight. |

Field messages are `IonText` (color danger), shown only when that field has a problem.

---

## Validation messages

`validateProduct` returns one message per invalid field, accumulated. They are identical to the API messages.

| Field | Rule | Message |
|-------|------|---------|
| `name` | Required; empty or only spaces after `trim()` | `name es obligatorio` |
| `name` | More than 60 characters after `trim()` | `name debe tener máximo 60 caracteres` |
| `price` | Must be a finite number greater than 0 | `price debe ser un número mayor que 0` |
| `category` | Must be one of «Bebidas», «Snacks», «Aseo», «Hogar» (also when none is selected) | `category debe ser una de: Bebidas, Snacks, Aseo, Hogar` |
| `stock` | Must be an integer greater than or equal to 0 | `stock debe ser un entero mayor o igual que 0` |

Inline behavior: the messages appear under each field when the user taps «Guardar» (nothing is sent if there is any problem). After that first attempt they update while the user edits. The name is sent trimmed.

---

## States

| State | Trigger | UI |
|-------|---------|-----|
| Loading | Edit mode: `getProduct(id)` in flight | `IonSpinner` + text «Cargando producto…». Create mode never shows it. |
| Ready | Create mode on open, or edit mode after the product loads | Form with its fields (empty in create mode, preloaded in edit mode) and «Guardar». |
| Validation errors | User taps «Guardar» and `validateProduct` finds problems | The messages from the table above under each invalid field. No request is sent. |
| Saving | `createProduct` / `updateProduct` in flight | «Guardar» disabled and shown as «Guardando…». |
| Server rejection | API answers 400 (`ApiError` with `details`) | Server error region: the API `error` (e.g. «Datos inválidos») and each text of `details`. The form stays editable with the typed values. |
| Not found | Edit mode: API answers 404 on load | Title «No se pudo cargar», message from `getErrorMessage(error)` (the API text «Producto no encontrado»). No form. |
| Error | Any other failure (network, 500, invalid id on load) | Title «No se pudo cargar» when loading; when saving, the message from `getErrorMessage(error)` in the server error region. |
| Offline | N/A | No offline mode: a network failure is an Error state (`ApiError.isNetworkError`). |

---

## Actions

| User action | Result | Function / event |
|-------------|--------|------------------|
| Open `/productos/nuevo` | Empty form | N/A |
| Open `/productos/:id/editar` | Loads the product and fills the fields | `getProduct(id)` in `useEffect`; `id = Number(useParams().id)` |
| Type in a field or tap a category | Updates that field; after a first save attempt, the messages are recalculated | `setState` + `validateProduct` |
| Tap «Guardar» with problems | Shows the messages, sends nothing | `validateProduct(input)` |
| Tap «Guardar» in create mode, valid | Creates the product (API 201) and navigates to `/productos` | `createProduct(input)`, then `history.push('/productos')` |
| Tap «Guardar» in edit mode, valid | Replaces the product (API 200, same id) and navigates to `/productos` | `updateProduct(id, input)`, then `history.push('/productos')` |
| Server answers 400 on save | Shows its `error` and `details`; stays on the screen | `ApiError.details` |
| Tap the back button | Navigates to `/productos` without saving | `IonBackButton` |

---

## Accessibility

- [x] All interactive elements have accessible labels (inputs have a visible label; buttons have visible text).
- [x] Validation problems are conveyed by text under each field, not by color alone.
- [ ] Touch targets ≥ 44×44 pt / 48×48 dp. Not verified yet.
- [ ] Text scales with OS font-size setting. Not verified yet.
- [ ] Contrast meets WCAG AA. Not verified yet.