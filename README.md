# ElectroShop

Estructura base del proyecto React para **ElectroShop**, Trabajo Final de
Seminario Informático II (UNSTA). Esta etapa incluye únicamente la
**arquitectura y navegación** de la app: componentes base, páginas vacías
y rutas funcionando. Todavía no hay lógica de negocio (login real,
carrito con estado, pagos, etc.).

## Cómo correrlo

```bash
npm install
npm run dev
```

La app queda disponible en `http://localhost:5173`.

## Stack

- **React 18** + **Vite** (bundler moderno, hot reload instantáneo)
- **React Router v6** (`createBrowserRouter`) para el ruteo
- CSS plano organizado por componente, con variables de diseño centralizadas
- Tipografía: **Poppins** (títulos/marca) + **Inter** (texto), vía Google Fonts

## Paleta de colores

| Uso              | Variable            | Color     |
|-------------------|---------------------|-----------|
| Azul institucional | `--color-primary`   | `#1E3A8A` |
| Blanco             | `--color-white`     | `#FFFFFF` |
| Gris de fondo      | `--color-gray`       | `#F3F4F6` |

Definidas en `src/styles/variables.css` junto con tonos derivados
(hover/focus) y la escala tipográfica.

## Estructura de carpetas

```
electroshop/
├── public/
│   └── favicon.svg          # ícono derivado del logo
├── src/
│   ├── assets/               # imágenes/recursos estáticos
│   ├── components/
│   │   ├── layout/            # Navbar, Footer, BottomNav, Logo, Layout
│   │   └── common/            # Button, Card, PageHeader (componentes base)
│   ├── pages/                 # una carpeta por página
│   │   ├── Home/
│   │   ├── Login/
│   │   ├── Cart/
│   │   ├── Checkout/
│   │   ├── ProductDetail/
│   │   ├── Orders/
│   │   ├── Complaints/
│   │   ├── Subscribe/
│   │   ├── Categories/
│   │   ├── More/
│   │   └── NotFound/
│   ├── routes/
│   │   └── AppRouter.jsx      # definición centralizada de rutas
│   ├── styles/
│   │   ├── variables.css      # paleta y tipografía
│   │   └── global.css         # reset + estilos base
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── package.json
└── vite.config.js
```

## Rutas configuradas

| Ruta               | Página          |
|---------------------|-----------------|
| `/`                  | Home (catálogo) |
| `/login`             | Login           |
| `/cart`              | Carrito         |
| `/checkout`          | Métodos de pago |
| `/product/:id`       | Detalle de producto |
| `/orders`            | Mis compras (historial) |
| `/complaints`        | Reclamos        |
| `/subscribe`         | Suscripción al catálogo |
| `/categories`        | Categorías      |
| `/more`              | Más opciones (menú mobile) |
| `*`                  | 404 / No encontrado |

## Navegación

- **Navbar** (`src/components/layout/Navbar.jsx`): logo, buscador y accesos
  rápidos (notificaciones, cuenta, carrito), con una barra secundaria de
  enlaces visible desde tablet en adelante.
- **BottomNav** (`src/components/layout/BottomNav.jsx`): barra inferior fija,
  solo en mobile, con Categorías / Inicio / Carrito / Más — replicando el
  patrón de las referencias de diseño.
- **Footer**: enlaces de tienda, cuenta y ayuda.

Todas cuelgan de `Layout.jsx`, que envuelve las páginas vía `<Outlet />`.

## Próximos pasos (no incluidos todavía)

- Lógica de autenticación
- Estado global del carrito
- Conexión con datos de productos
- Validaciones de formularios (login, pago, reclamos)
