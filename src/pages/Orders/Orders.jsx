import { useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";
import Button from "../../components/common/Button";
import { formatPrice } from "../../utils/format";
import { useOrders, getOrderProgress } from "../../context/OrdersContext";
import "./Orders.css";

function formatDate(isoString) {
  return new Date(isoString).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function Orders() {
  const { orders, cancelOrder } = useOrders();
  const [expandedOrder, setExpandedOrder] = useState(null);

  function handleCancel(orderNumber) {
    const confirmed = window.confirm(`¿Cancelar el pedido #${orderNumber}?`);
    if (!confirmed) return;
    cancelOrder(orderNumber);
  }

  function toggleReceipt(orderNumber) {
    setExpandedOrder((current) => (current === orderNumber ? null : orderNumber));
  }

  return (
    <div className="page">
      <div className="container">
        <PageHeader
          eyebrow="Historial"
          title="Mis compras"
          description="Pedidos realizados y su estado."
        />

        {orders.length === 0 ? (
          <div className="page__placeholder">
            <p style={{ marginBottom: "1.25rem" }}>Todavía no realizaste ningún pedido.</p>
            <Button to="/categories" variant="primary">
              Ir al catálogo
            </Button>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => {
              const isExpanded = expandedOrder === order.orderNumber;
              const progress = getOrderProgress(order);

              return (
                <div className="order-card" key={order.orderNumber}>
                  <div className="order-card__header">
                    <div>
                      <span className="order-card__number">Pedido #{order.orderNumber}</span>
                      <span className="order-card__date">{formatDate(order.date)}</span>
                    </div>
                    <span
                      className={`order-card__status order-card__status--${progress.status.toLowerCase()}`}
                    >
                      {progress.status}
                    </span>
                  </div>

                  <div className="order-card__items">
                    {order.items.map((item) => (
                      <div className="order-card__item" key={item.id}>
                        <Link to={`/product/${item.id}`}>
                          {item.name} × {item.quantity}
                        </Link>
                        <span>{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>

                  {isExpanded && (
                    <div className="order-card__receipt">
                      <div className="order-card__receipt-row">
                        <span>Cliente</span>
                        <span>{order.customerName || "—"}</span>
                      </div>
                      {order.email && (
                        <div className="order-card__receipt-row">
                          <span>Email</span>
                          <span>{order.email}</span>
                        </div>
                      )}
                      <div className="order-card__receipt-row">
                        <span>Subtotal</span>
                        <span>{formatPrice(order.subtotal)}</span>
                      </div>
                      <div className="order-card__receipt-row">
                        <span>Envío</span>
                        <span>{order.shipping === 0 ? "Gratis" : formatPrice(order.shipping)}</span>
                      </div>
                      <div className="order-card__receipt-row">
                        <span>Método de pago</span>
                        <span>
                          {order.paymentMethod === "card" ? "Tarjeta" : "Transferencia bancaria"}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="order-card__footer">
                    <button
                      type="button"
                      className="order-card__receipt-toggle"
                      onClick={() => toggleReceipt(order.orderNumber)}
                    >
                      {isExpanded ? "Ocultar comprobante" : "Ver comprobante"}
                    </button>
                    <div className="order-card__total">Total: {formatPrice(order.total)}</div>
                  </div>

                  {order.status === "confirmado" && (
                    <button
                      type="button"
                      className="order-card__cancel"
                      onClick={() => handleCancel(order.orderNumber)}
                    >
                      Cancelar pedido
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Orders;
