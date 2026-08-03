import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);

const STORAGE_KEY = "electroshop:cart";
const FREE_SHIPPING_THRESHOLD = 500000;
const SHIPPING_COST = 9999;

function loadInitialItems() {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Provee el estado del carrito a toda la app y lo persiste en localStorage
 * para que sobreviva a recargas de página.
 */
export function CartProvider({ children }) {
  const [items, setItems] = useState(loadInitialItems);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // localStorage no disponible (ej. modo privado): el carrito sigue
      // funcionando en memoria durante la sesión actual.
    }
  }, [items]);

  /** Agrega un producto del catálogo al carrito, respetando el stock disponible. */
  function addItem(product, quantity = 1) {
    setItems((current) => {
      const maxStock = product.stock ?? Infinity;
      const existing = current.find((item) => item.id === product.id);

      if (existing) {
        const nextQuantity = Math.min(existing.quantity + quantity, maxStock);
        return current.map((item) =>
          item.id === product.id ? { ...item, quantity: nextQuantity } : item
        );
      }

      const initialQuantity = Math.min(Math.max(quantity, 1), Math.max(maxStock, 1));
      return [
        ...current,
        {
          id: product.id,
          name: product.name,
          category: product.category,
          price: product.price,
          icon: product.icon,
          photoUrl: product.photoUrl,
          stock: maxStock,
          quantity: initialQuantity,
        },
      ];
    });
  }

  /** Elimina por completo un producto del carrito. */
  function removeItem(id) {
    setItems((current) => current.filter((item) => item.id !== id));
  }

  /** Cambia la cantidad de un producto ya presente en el carrito (mínimo 1, máximo el stock). */
  function updateQuantity(id, quantity) {
    setItems((current) =>
      current.map((item) => {
        if (item.id !== id) return item;
        const maxStock = item.stock ?? Infinity;
        const clamped = Math.min(Math.max(quantity, 1), Math.max(maxStock, 1));
        return { ...item, quantity: clamped };
      })
    );
  }

  /** Vacía el carrito por completo (usado al cancelar o al confirmar una compra). */
  function clearCart() {
    setItems([]);
  }

  /** Cantidad ya presente en el carrito para un producto dado (para deshabilitar "Agregar" al llegar al stock). */
  function getQuantityInCart(id) {
    return items.find((item) => item.id === id)?.quantity ?? 0;
  }

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );

  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = subtotal + shipping;

  const value = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getQuantityInCart,
    subtotal,
    shipping,
    total,
    itemCount,
    freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

/** Hook de acceso al carrito. Debe usarse dentro de <CartProvider>. */
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart debe usarse dentro de un <CartProvider>");
  }
  return context;
}
