import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";
import Button from "../../components/common/Button";
import { formatPrice } from "../../utils/format";
import { useCart } from "../../context/CartContext";
import { useOrders } from "../../context/OrdersContext";
import { useAuth } from "../../context/AuthContext";
import { adjustProductStock } from "../../api/products";
import "./Checkout.css";

const INITIAL_FORM = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  street: "",
  city: "",
  province: "",
  zip: "",
  paymentMethod: "card",
  cardNumber: "",
  cardName: "",
  cardExpiry: "",
  cardCvv: "",
};

function validate(form) {
  const errors = {};

  if (!form.firstName.trim()) errors.firstName = "Ingresá tu nombre.";
  if (!form.lastName.trim()) errors.lastName = "Ingresá tu apellido.";

  if (!form.email.trim()) {
    errors.email = "Ingresá tu email.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    errors.email = "Ingresá un email válido.";
  }

  if (!form.phone.trim()) {
    errors.phone = "Ingresá un teléfono de contacto.";
  } else if (!/^[0-9()+\-\s]{6,20}$/.test(form.phone.trim())) {
    errors.phone = "Ingresá un teléfono válido.";
  }

  if (!form.street.trim()) errors.street = "Ingresá calle y número.";
  if (!form.city.trim()) errors.city = "Ingresá tu ciudad.";
  if (!form.province.trim()) errors.province = "Ingresá tu provincia.";

  if (!form.zip.trim()) {
    errors.zip = "Ingresá tu código postal.";
  } else if (!/^[0-9A-Za-z\-\s]{3,10}$/.test(form.zip.trim())) {
    errors.zip = "Ingresá un código postal válido.";
  }

  if (form.paymentMethod === "card") {
    const cardDigits = form.cardNumber.replace(/\s/g, "");
    if (!/^\d{13,19}$/.test(cardDigits)) {
      errors.cardNumber = "Ingresá un número de tarjeta válido (13 a 19 dígitos).";
    }
    if (!form.cardName.trim()) {
      errors.cardName = "Ingresá el nombre del titular.";
    }
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(form.cardExpiry.trim())) {
      errors.cardExpiry = "Usá el formato MM/AA.";
    }
    if (!/^\d{3,4}$/.test(form.cardCvv.trim())) {
      errors.cardCvv = "Ingresá un CVV válido.";
    }
  }

  return errors;
}

function Checkout() {
  const { items, subtotal, shipping, total, clearCart } = useCart();
  const { addOrder } = useOrders();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState(() => ({
    ...INITIAL_FORM,
    email: user?.email || "",
    firstName: user?.name && !user.guest ? user.name.split(" ")[0] : "",
  }));
  const [errors, setErrors] = useState({});
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    const validationErrors = validate(form);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    const orderNumber = `ES-${Date.now().toString().slice(-6)}`;
    const order = {
      orderNumber,
      items,
      subtotal,
      shipping,
      total,
      customerName: `${form.firstName.trim()} ${form.lastName.trim()}`,
      email: form.email.trim(),
      paymentMethod: form.paymentMethod,
    };
    setConfirmedOrder(order);
    addOrder(order);
    clearCart();

    // Actualiza la disponibilidad de productos en el inventario (API) al armar el pedido.
    // Se usa un ajuste atómico (delta) en vez de leer-y-pisar, para que dos compras
    // simultáneas no se pisen el stock entre sí.
    items.forEach((item) => {
      adjustProductStock(item.id, -item.quantity).catch(() => {
        // Si la API no responde, la compra ya quedó confirmada igual;
        // el stock se podrá corregir más tarde desde /admin.
      });
    });
  }

  // ---------- Confirmación de compra ----------
  if (confirmedOrder) {
    return (
      <div className="page">
        <div className="container">
          <div className="checkout-confirmation">
            <span className="checkout-confirmation__icon" aria-hidden="true">✅</span>
            <h1>¡Gracias por tu compra, {confirmedOrder.customerName}!</h1>
            <p>
              Tu pedido <strong>#{confirmedOrder.orderNumber}</strong> fue confirmado. Vas a
              recibir un email con los detalles de tu compra.
            </p>

            <div className="checkout-confirmation__summary">
              <h2>Resumen del pedido</h2>
              {confirmedOrder.items.map((item) => (
                <div className="checkout-confirmation__row" key={item.id}>
                  <span>
                    {item.name} × {item.quantity}
                  </span>
                  <span>{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
              <div className="checkout-confirmation__row">
                <span>Subtotal</span>
                <span>{formatPrice(confirmedOrder.subtotal)}</span>
              </div>
              <div className="checkout-confirmation__row">
                <span>Envío</span>
                <span>{confirmedOrder.shipping === 0 ? "Gratis" : formatPrice(confirmedOrder.shipping)}</span>
              </div>
              <div className="checkout-confirmation__row checkout-confirmation__row--total">
                <span>Total pagado</span>
                <span>{formatPrice(confirmedOrder.total)}</span>
              </div>
              <p className="checkout-confirmation__payment">
                Método de pago:{" "}
                {confirmedOrder.paymentMethod === "card" ? "Tarjeta" : "Transferencia bancaria"}
              </p>
            </div>

            <div className="checkout-confirmation__actions">
              <Button to="/" variant="primary">
                Volver al inicio
              </Button>
              <Button to="/categories" variant="outline">
                Seguir comprando
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ---------- Carrito vacío ----------
  if (items.length === 0) {
    return (
      <div className="page">
        <div className="container">
          <PageHeader
            eyebrow="Pago"
            title="Finalizar compra"
            description="Completá tus datos para confirmar el pedido."
          />
          <div className="page__placeholder">
            <p style={{ marginBottom: "1.25rem" }}>
              Tu carrito está vacío, así que no hay nada para finalizar todavía.
            </p>
            <Button to="/categories" variant="primary">
              Ir al catálogo
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ---------- Formulario ----------
  return (
    <div className="page">
      <div className="container">
        <PageHeader
          eyebrow="Pago"
          title="Finalizar compra"
          description="Completá tus datos de contacto, envío y pago para confirmar el pedido."
        />

        <Link to="/cart" className="checkout__back-link">
          ← Volver al carrito
        </Link>

        <form className="checkout" onSubmit={handleSubmit} noValidate>
          <div className="checkout__form">
            <section className="checkout-section">
              <h2>Datos de contacto</h2>
              <div className="checkout-grid">
                <div className="checkout-field">
                  <label htmlFor="firstName">Nombre</label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={form.firstName}
                    onChange={handleChange}
                  />
                  {errors.firstName && <span className="checkout-error">{errors.firstName}</span>}
                </div>

                <div className="checkout-field">
                  <label htmlFor="lastName">Apellido</label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={form.lastName}
                    onChange={handleChange}
                  />
                  {errors.lastName && <span className="checkout-error">{errors.lastName}</span>}
                </div>

                <div className="checkout-field">
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                  />
                  {errors.email && <span className="checkout-error">{errors.email}</span>}
                </div>

                <div className="checkout-field">
                  <label htmlFor="phone">Teléfono</label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="Ej: 381 555-1234"
                    value={form.phone}
                    onChange={handleChange}
                  />
                  {errors.phone && <span className="checkout-error">{errors.phone}</span>}
                </div>
              </div>
            </section>

            <section className="checkout-section">
              <h2>Dirección de envío</h2>
              <div className="checkout-grid">
                <div className="checkout-field checkout-field--full">
                  <label htmlFor="street">Calle y número</label>
                  <input
                    id="street"
                    name="street"
                    type="text"
                    placeholder="Ej: Av. Siempre Viva 742"
                    value={form.street}
                    onChange={handleChange}
                  />
                  {errors.street && <span className="checkout-error">{errors.street}</span>}
                </div>

                <div className="checkout-field">
                  <label htmlFor="city">Ciudad</label>
                  <input id="city" name="city" type="text" value={form.city} onChange={handleChange} />
                  {errors.city && <span className="checkout-error">{errors.city}</span>}
                </div>

                <div className="checkout-field">
                  <label htmlFor="province">Provincia</label>
                  <input
                    id="province"
                    name="province"
                    type="text"
                    value={form.province}
                    onChange={handleChange}
                  />
                  {errors.province && <span className="checkout-error">{errors.province}</span>}
                </div>

                <div className="checkout-field">
                  <label htmlFor="zip">Código postal</label>
                  <input id="zip" name="zip" type="text" value={form.zip} onChange={handleChange} />
                  {errors.zip && <span className="checkout-error">{errors.zip}</span>}
                </div>
              </div>
            </section>

            <section className="checkout-section">
              <h2>Método de pago</h2>
              <div className="checkout-payment-options">
                <label className="checkout-radio">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={form.paymentMethod === "card"}
                    onChange={handleChange}
                  />
                  Tarjeta de crédito/débito
                </label>
                <label className="checkout-radio">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="transfer"
                    checked={form.paymentMethod === "transfer"}
                    onChange={handleChange}
                  />
                  Transferencia bancaria
                </label>
              </div>

              {form.paymentMethod === "card" ? (
                <div className="checkout-grid">
                  <div className="checkout-field checkout-field--full">
                    <label htmlFor="cardNumber">Número de tarjeta</label>
                    <input
                      id="cardNumber"
                      name="cardNumber"
                      type="text"
                      inputMode="numeric"
                      placeholder="0000 0000 0000 0000"
                      value={form.cardNumber}
                      onChange={handleChange}
                    />
                    {errors.cardNumber && <span className="checkout-error">{errors.cardNumber}</span>}
                  </div>

                  <div className="checkout-field checkout-field--full">
                    <label htmlFor="cardName">Nombre del titular</label>
                    <input
                      id="cardName"
                      name="cardName"
                      type="text"
                      value={form.cardName}
                      onChange={handleChange}
                    />
                    {errors.cardName && <span className="checkout-error">{errors.cardName}</span>}
                  </div>

                  <div className="checkout-field">
                    <label htmlFor="cardExpiry">Vencimiento (MM/AA)</label>
                    <input
                      id="cardExpiry"
                      name="cardExpiry"
                      type="text"
                      placeholder="MM/AA"
                      value={form.cardExpiry}
                      onChange={handleChange}
                    />
                    {errors.cardExpiry && <span className="checkout-error">{errors.cardExpiry}</span>}
                  </div>

                  <div className="checkout-field">
                    <label htmlFor="cardCvv">CVV</label>
                    <input
                      id="cardCvv"
                      name="cardCvv"
                      type="text"
                      inputMode="numeric"
                      placeholder="123"
                      value={form.cardCvv}
                      onChange={handleChange}
                    />
                    {errors.cardCvv && <span className="checkout-error">{errors.cardCvv}</span>}
                  </div>
                </div>
              ) : (
                <p className="checkout-transfer-note">
                  Vas a recibir los datos bancarios por email para completar la transferencia una
                  vez confirmado el pedido.
                </p>
              )}
            </section>
          </div>

          <aside className="checkout-summary">
            <h2>Tu pedido</h2>
            <div className="checkout-summary__items">
              {items.map((item) => (
                <div className="checkout-summary__item" key={item.id}>
                  <span className="checkout-summary__item-icon" aria-hidden="true">
                    {item.icon}
                  </span>
                  <div className="checkout-summary__item-info">
                    <span className="checkout-summary__item-name">{item.name}</span>
                    <span className="checkout-summary__item-qty">Cantidad: {item.quantity}</span>
                  </div>
                  <span className="checkout-summary__item-price">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="checkout-summary__row">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="checkout-summary__row">
              <span>Envío</span>
              <span>{shipping === 0 ? "Gratis" : formatPrice(shipping)}</span>
            </div>
            <div className="checkout-summary__row checkout-summary__row--total">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>

            <button type="submit" className="btn btn--primary checkout-submit">
              Confirmar compra
            </button>
            <button
              type="button"
              className="btn btn--outline checkout-cancel"
              onClick={() => navigate("/cart")}
            >
              Cancelar
            </button>
          </aside>
        </form>
      </div>
    </div>
  );
}

export default Checkout;
