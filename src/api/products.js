import { API_BASE_URL } from "./config";

async function handleResponse(response) {
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || `Error ${response.status} al consultar la API.`);
  }
  return response.json();
}

/** Trae el catálogo completo de productos desde la API. */
export async function fetchProducts() {
  const response = await fetch(`${API_BASE_URL}/api/products`);
  return handleResponse(response);
}

/** Trae un producto puntual por id. */
export async function fetchProductById(id) {
  const response = await fetch(`${API_BASE_URL}/api/products/${id}`);
  return handleResponse(response);
}

/** Crea un producto nuevo. */
export async function createProduct(data) {
  const response = await fetch(`${API_BASE_URL}/api/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse(response);
}

/** Edita un producto existente. */
export async function updateProduct(id, data) {
  const response = await fetch(`${API_BASE_URL}/api/products/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse(response);
}

/**
 * Ajusta el stock de un producto sumando/restando un delta, de forma
 * atómica en el servidor (evita condiciones de carrera entre compras
 * simultáneas). Usar delta negativo al confirmar una compra, positivo
 * al cancelar un pedido.
 */
export async function adjustProductStock(id, delta) {
  const response = await fetch(`${API_BASE_URL}/api/products/${id}/stock`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ delta }),
  });
  return handleResponse(response);
}

/** Borra un producto. */
export async function deleteProduct(id) {
  const response = await fetch(`${API_BASE_URL}/api/products/${id}`, { method: "DELETE" });
  if (!response.ok && response.status !== 204) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || `Error ${response.status} al borrar el producto.`);
  }
}

/** Sube (o reemplaza) la foto de un producto. */
export async function uploadProductPhoto(id, file) {
  const formData = new FormData();
  formData.append("photo", file);
  const response = await fetch(`${API_BASE_URL}/api/products/${id}/photo`, {
    method: "POST",
    body: formData,
  });
  return handleResponse(response);
}
