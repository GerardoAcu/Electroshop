/**
 * Selección de productos destacados para la Home.
 * Se derivan del catálogo completo (src/data/products.js) para no
 * duplicar datos ni tener ids inconsistentes con el Detalle de producto.
 */
import products from "./products";

const FEATURED_IDS = [1, 2, 3, 4, 5, 6];

const featuredProducts = FEATURED_IDS.map((id) =>
  products.find((product) => product.id === id)
).filter(Boolean);

export default featuredProducts;
