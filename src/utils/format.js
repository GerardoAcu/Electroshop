/**
 * Formatea un número como precio en pesos argentinos.
 * Ej: formatPrice(1299999) -> "$1.299.999"
 */
export function formatPrice(value) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Formatea el código identificador de un producto a partir de su id.
 * El enunciado pide que la consulta de un producto particular muestre
 * código, descripción, precio y cantidad disponible.
 * Ej: formatProductCode(7) -> "EL-0007"
 */
export function formatProductCode(id) {
  return `EL-${String(id).padStart(4, "0")}`;
}

/** Normaliza texto para comparar sin importar mayúsculas ni acentos. */
export function normalizeText(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}
