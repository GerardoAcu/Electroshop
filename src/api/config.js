export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

/** Arma la URL completa de una foto de producto a partir de su photoUrl relativo. */
export function resolvePhotoUrl(photoUrl) {
  if (!photoUrl) return null;
  return `${API_BASE_URL}${photoUrl}`;
}
