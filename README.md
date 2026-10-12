# Catálogo de productos · Ionic React + API Express + Kotlin

Parcial práctico del corte 2 · Programación Móvil · CORHUILA 2026-B (modalidad individual).

El proyecto tiene tres piezas, construidas siguiendo el [Mobile Governance Framework](https://github.com/jesusarielgb-works/mobile-governance-framework):

- **API Express** (`server/`): CRUD de productos con validación, filtros y manejo de errores.
- **App Ionic React** (`src/`): lista con búsqueda y filtro, detalle, y formulario de crear y editar, organizada por capas.
- **Ejercicio Kotlin** (`kotlin/Product.kt`): modelo y funciones básicas, con lo visto en la semana 7.

La **documentación** (`docs/`) se escribió antes del código, a partir de las plantillas del framework.

> El enunciado oficial es el PDF de la actividad en Moodle. Este README es un resumen; si algo difiere, manda el PDF.

## Cómo ejecutar

Requisito: Node.js 22.12 o superior (`node --version`).

```bash
npm install            # instala dependencias (una sola vez)
cp .env.example .env   # crea el archivo de entorno (una sola vez)
npm run server         # arranca la API en http://localhost:3000
npm run dev            # arranca la app en http://localhost:5173 (en otra terminal)
npm test               # corre las pruebas (Vitest)
npm run lint           # revisión de estilo del código
npm run build          # revisión de tipos y compilación para producción
```

En PowerShell, el segundo comando es `Copy-Item .env.example .env`.

La app y la API se ejecutan al mismo tiempo, cada una en su terminal. La app lee la dirección de la API de la variable `VITE_API_URL`: el valor por defecto está en `.env.example`, que se copia como `.env`. El archivo `.env` está ignorado por Git; nunca se versiona.

Rutas de la app: `/productos` (lista), `/productos/nuevo`, `/productos/:id` (detalle) y `/productos/:id/editar`.

La API implementa los cinco endpoints de `/api/products` y las pantallas los consumen con el CRUD completo.

## Ejercicio Kotlin

`kotlin/Product.kt` no necesita proyecto Android: se copia en [play.kotlinlang.org](https://play.kotlinlang.org) y se ejecuta. Incluye la clase `Product`, `stockLabel`, `applyDiscount` y un `main()` que imprime tres productos con su etiqueta y su precio con 10 % de descuento.

## Flujo de entrega

1. Haga un **fork** de este repositorio a su cuenta de GitHub y clónelo.
2. Cree una rama de funcionalidad: `git switch -c feature/catalogo-productos`.
3. Trabaje la lista de [TODO.md](./TODO.md), en orden, con commits pequeños en formato [Conventional Commits](https://www.conventionalcommits.org/): `type(scope): resumen` (por ejemplo, `docs(productos): describe la funcionalidad` o `feat(api): agrega el endpoint de lista`).
4. Los documentos de `docs/` van **antes** que el código: el primer commit de código debe ser posterior al commit de documentación.
5. Abra un **Pull Request hacia el `main` de su propio fork** (no hacia el repositorio original), con una descripción de lo hecho y el checklist de `docs/definition-of-done.md` marcado. El PR no se fusiona.
6. Pegue el **enlace del PR** en la actividad de Moodle (texto en línea) antes del cierre: lunes 12 de octubre de 2026, 11:59 p. m.

## Qué se evalúa (5,0)

| Parte | Puntos |
|---|---|
| 1. Documentar antes de codificar | 0,75 |
| 2. API Express | 1,0 |
| 3. App Ionic | 1,5 |
| 4. Kotlin | 0,5 |
| 5. Calidad | 0,5 |
| 6. Git y entrega | 0,25 |
| 7. Inglés | 0,5 |

El detalle de cada criterio está en [TODO.md](./TODO.md).

## Contrato de la API (resumen)

Recurso `/api/products` con `{ id: number, name: string, price: number, category: string, stock: integer }`. Los datos semilla están en `server/data/products.json` y se guardan en memoria (se reinician al reiniciar el servidor).

| Método y ruta | Éxito | Errores |
|---|---|---|
| `GET /api/products?search=&category=` | 200 + arreglo | — |
| `GET /api/products/:id` | 200 + objeto | 400 (id no numérico) · 404 |
| `POST /api/products` | 201 + objeto creado | 400 |
| `PUT /api/products/:id` | 200 + objeto actualizado | 400 · 404 |
| `DELETE /api/products/:id` | 204 sin cuerpo | 400 · 404 |

Validación: `name` obligatorio (máximo 60 caracteres), `price` número mayor que 0, `category` una de `Bebidas`, `Snacks`, `Aseo` o `Hogar`, y `stock` entero mayor o igual que 0. Todo error usa el formato `{ "error": "mensaje", "details": ["..."] }`; una ruta desconocida responde 404 con ese formato, y un error inesperado, 500.

## Estructura

```text
docs/                         documentación del proyecto (7 documentos) y plantillas originales
  features/ screens/ decisions/ api/ definition-of-done.md
kotlin/Product.kt             ejercicio Kotlin
server/
  app.js                      createApp(): rutas de la API + piezas ya dadas
  index.js                    arranque en el puerto 3000
  data/products.json          8 productos semilla
src/app/                      arranque, rutas y tema
src/features/products/        funcionalidad organizada por capas del framework
  data/                       config.ts (API_URL), api-error.ts (ApiError), products-api.ts (cliente fetch)
  domain/product.ts           tipos, formatCOP (dado), validateProduct, toProductView, filterProducts
  presentation/               ProductListPage, ProductDetailPage, ProductFormPage, ProductCard y EmptyState (dado)
  __tests__/                  test-server.ts (helper dado), product.test.ts y products-api.test.ts
```

Capas (framework, `01-architecture/layers-and-state`): `presentation` depende de `domain` y de `data`; `data` depende de `domain`; `domain` no depende de nada. El estado de cada pantalla vive en la misma página con `useState` y `useEffect`.

## Qué ya venía resuelto

Para concentrar el parcial en lo trabajado en clase, algunas piezas venían hechas en el starter, con comentarios en español. Se usan y se explican (ADR-002 y la sección «API error handling»):

- **Servidor:** `express.json()`, `cors()`, `parseId()`, el manejador 404 de rutas desconocidas y el manejador central de errores (500), en `server/app.js`.
- **Cliente:** `API_URL` (`data/config.ts`), la clase `ApiError` y `getErrorMessage` (`data/api-error.ts`), y `getProducts` como ejemplo (con la función `request`) en `data/products-api.ts`.
- **Dominio:** `formatCOP()`.
- **Presentación:** `EmptyState` como modelo de componente con props tipadas, y el esqueleto inicial de la lista.
- **Pruebas:** el helper `startTestServer()` y un ejemplo de prueba de la API.

## State management decision

Each page keeps its own state with `useState` and `useEffect`, so the app has no global store. We chose this because the app is small and every screen loads its own data, so nothing is shared between screens. The pages call the functions in `data/products-api.ts` directly, which keeps the code simple and easy to follow. If the app grew and several screens needed the same data, we would move that state to a shared store and add a layer between the pages and the API.

## API error handling

The API answers every error with the same JSON shape: `{ "error": "message", "details": ["..."] }`. An unknown route returns 404 from the given handler, and the central error handler returns 400 for malformed JSON and 500 for any other unexpected error. In the app, the `request` function throws an `ApiError`: `isNetworkError` is true when `fetch` fails and there is no response, and false when the server answers with a non-success status that carries `status` and `details`. The person using the app sees a clear Spanish message from `getErrorMessage`, and the form shows the server error and its details. The test `unknownRoute_whenRequested_returns404FromGivenHandler` shows that the 404 comes from the given handler.

## Test of the given 404 handler

The test `unknownRoute_whenRequested_returns404FromGivenHandler` in `products-api.test.ts` starts the server with `startTestServer()` and requests a route that does not exist. No product route matches it, so Express reaches the 404 handler that the starter provides and we did not modify. The test checks that the status is 404 and that the body follows the same `{ "error", "details" }` shape as every other error.

---

Las plantillas de `docs/` provienen del Mobile Governance Framework (licencia MIT; ver `docs/LICENSE-mobile-governance-framework.txt`).