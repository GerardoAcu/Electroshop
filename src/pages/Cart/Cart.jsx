import { Link, useNavigate } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";
import Button from "../../components/common/Button";
import { formatPrice } from "../../utils/format";
import { resolvePhotoUrl } from "../../api/config";
import { useCart } from "../../context/CartContext";
import "./Cart.css";

function Cart() {
  const { items, updateQuantity, removeItem, clearCart, subtotal, shipping, total, freeShippingThreshold } =
    useCart();
  const navigate = useNavigate();

  const isEmpty = items.length === 0;
  const missingForFreeShipping = Math.max(freeShippingThreshold - subtotal, 0);

  function handleCancelPurchase() {
    if (isEmpty) return;
    const confirmed = window.confirm(
      "¿Seguro que querés cancelar la compra? Se vaciará el carrito."
    );
    if (!confirmed) return;
    clearCart();
    navigate("/");
  }

  function handleContinuePurchase() {
    navigate("/checkout");
  }

  return (
    <div className="page">
      <div className="container">
        <PageHeader
          eyebrow="Compras"
          title="Mi carrito"
          description="Revisá los productos agregados, ajustá cantidades y confirmá tu compra."
        />

        {isEmpty ? (
          <div className="page__placeholder cart-empty">
            <span className="cart-empty__icon" aria-hidden="true">🛒</span>
            <p>Todavía no agregaste productos a tu carrito.</p>
            <Button to="/categories" variant="primary">
              Ir al catálogo
            </Button>
          </div>
        ) : (
          <div className="cart">
            <div className="cart__items">
              <Link to="/categories" className="cart__continue-shopping">
                ← Seguir explorando el catálogo
              </Link>

              {items.map((item) => {
                const lineSubtotal = item.price * item.quantity;
                const atMaxStock = item.quantity >= item.stock;

                return (
                  <div className="cart-item" key={item.id}>
                    <Link to={`/product/${item.id}`} className="cart-item__image" aria-hidden="true">
                      {resolvePhotoUrl(item.photoUrl) ? (
                        <img src={resolvePhotoUrl(item.photoUrl)} alt="" loading="lazy" />
                      ) : (
                        <span>{item.icon || "📦"}</span>
                      )}
                    </Link>

                    <div className="cart-item__info">
                      <span className="cart-item__category">{item.category}</span>
                      <Link to={`/product/${item.id}`} className="cart-item__name">
                        {item.name}
                      </Link>
                      <span className="cart-item__unit-price">{formatPrice(item.price)} c/u</span>
                    </div>

                    <div className="cart-item__quantity">
                      <span className="cart-item__quantity-label">Cantidad</span>
                      <div className="cart-item__quantity-control">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          aria-label={`Restar cantidad de ${item.name}`}
                        >
                          −
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={atMaxStock}
                          aria-label={`Sumar cantidad de ${item.name}`}
                        >
                          +
                        </button>
                      </div>
                      {atMaxStock && (
                        <span className="cart-item__stock-note">Llegaste al stock disponible</span>
                      )}
                    </div>

                    <div className="cart-item__subtotal">{formatPrice(lineSubtotal)}</div>

                    <button
                      type="button"
                      className="cart-item__remove"
                      onClick={() => removeItem(item.id)}
                      aria-label={`Eliminar ${item.name} del carrito`}
                      title="Eliminar producto"
                    >
                      🗑
                    </button>
                  </div>
                );
              })}
            </div>

            <aside className="cart-summary">
              <h2>Resumen de compra</h2>

              <div className="cart-summary__row">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>

              <div className="cart-summary__row">
                <span>Envío</span>
                <span>{shipping === 0 ? "Gratis" : formatPrice(shipping)}</span>
              </div>

              {shipping > 0 && (
                <p className="cart-summary__hint">
                  Te faltan {formatPrice(missingForFreeShipping)} en compras para tener envío
                  gratis.
                </p>
              )}

              <div className="cart-summary__row cart-summary__row--total">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>

              <div className="cart-summary__actions">
                <button type="button" className="btn btn--primary" onClick={handleContinuePurchase}>
                  Continuar compra
                </button>
                <button type="button" className="btn btn--outline" onClick={handleCancelPurchase}>
                  Cancelar compra
                </button>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;
