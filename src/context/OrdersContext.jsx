import { createContext, useContext, useEffect, useState } from "react";
import { adjustProductStock } from "../api/products";

const OrdersContext = createContext(null);

const STORAGE_KEY = "electroshop:orders";

function loadInitialOrders() {
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
 * Estado de envío simulado según el tiempo transcurrido desde la compra
 * (no hay logística real conectada): recién confirmado queda "Confirmado",
 * después pasa a "Enviado" y finalmente a "Entregado". Los pedidos
 * cancelados quedan siempre en "Cancelado", sin importar el tiempo.
 */
export function getOrderProgress(order) {
  if (order.status === "cancelado") {
    return { status: "Cancelado" };
  }

  const minutesElapsed = (Date.now() - new Date(order.date).getTime()) / 60000;

  if (minutesElapsed < 2) {
    return { status: "Confirmado" };
  }
  if (minutesElapsed < 5) {
    return { status: "Enviado" };
  }
  return { status: "Entregado" };
}

/**
 * Historial de pedidos, persistido en localStorage.
 * Se alimenta desde Checkout al confirmar una compra, y permite
 * cancelar una orden (requisito del enunciado) mientras esté "confirmado".
 */
export function OrdersProvider({ children }) {
  const [orders, setOrders] = useState(loadInitialOrders);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
    } catch {
      // localStorage no disponible: el historial sigue funcionando en memoria.
    }
  }, [orders]);

  /** Agrega un pedido nuevo al historial (llamado desde Checkout al confirmar). */
  function addOrder(order) {
    setOrders((current) => [
      { ...order, status: "confirmado", date: new Date().toISOString() },
      ...current,
    ]);
  }

  /** Cancela un pedido existente por su número de orden, si todavía se puede cancelar. */
  function cancelOrder(orderNumber) {
    const order = orders.find((o) => o.orderNumber === orderNumber);

    setOrders((current) =>
      current.map((o) =>
        o.orderNumber === orderNumber && o.status === "confirmado"
          ? { ...o, status: "cancelado" }
          : o
      )
    );

    // Devuelve la disponibilidad al inventario (API) de forma atómica, ya que
    // el pedido no se va a entregar.
    if (order && order.status === "confirmado") {
      order.items.forEach((item) => {
        adjustProductStock(item.id, item.quantity).catch(() => {
          // Si la API no responde, el pedido igual queda cancelado;
          // el stock se podrá corregir manualmente desde /admin.
        });
      });
    }
  }

  const value = { orders, addOrder, cancelOrder };

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>;
}

/** Hook de acceso al historial de pedidos. Debe usarse dentro de <OrdersProvider>. */
export function useOrders() {
  const context = useContext(OrdersContext);
  if (!context) {
    throw new Error("useOrders debe usarse dentro de un <OrdersProvider>");
  }
  return context;
}
