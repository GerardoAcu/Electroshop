import { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Logo from "./Logo";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useOrders, getOrderProgress } from "../../context/OrdersContext";
import { fetchProducts } from "../../api/products";
import { formatPrice, normalizeText } from "../../utils/format";
import "./Navbar.css";

const NAV_LINKS = [
  { to: "/", label: "Inicio" },
  { to: "/cart", label: "Carrito" },
  { to: "/orders", label: "Mis compras" },
  { to: "/complaints", label: "Reclamos" },
];

const MAX_SUGGESTIONS = 6;

function relativeTime(isoString) {
  const minutes = Math.max(0, Math.round((Date.now() - new Date(isoString).getTime()) / 60000));
  if (minutes < 1) return "ahora mismo";
  if (minutes < 60) return `hace ${minutes} min`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `hace ${hours} h`;
  return `hace ${Math.round(hours / 24)} d`;
}

/** Arma la lista de notificaciones a partir de los pedidos: confirmación de
 * compra, y avisos de envío/entrega a medida que el pedido "avanza" (simulado). */
function buildNotifications(orders) {
  const items = [];

  orders.forEach((order) => {
    items.push({
      id: `${order.orderNumber}-confirmado`,
      date: order.date,
      text: `Pedido #${order.orderNumber} confirmado.`,
    });

    if (order.status !== "cancelado") {
      const progress = getOrderProgress(order);
      if (progress.status === "Enviado" || progress.status === "Entregado") {
        items.push({
          id: `${order.orderNumber}-enviado`,
          date: order.date,
          text: `Pedido #${order.orderNumber} enviado.`,
        });
      }
      if (progress.status === "Entregado") {
        items.push({
          id: `${order.orderNumber}-entregado`,
          date: order.date,
          text: `Pedido #${order.orderNumber} entregado.`,
        });
      }
    } else {
      items.push({
        id: `${order.orderNumber}-cancelado`,
        date: order.date,
        text: `Pedido #${order.orderNumber} cancelado.`,
      });
    }
  });

  return items.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 8);
}

function Navbar() {
  const { itemCount } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { orders } = useOrders();
  const navigate = useNavigate();

  const [allProducts, setAllProducts] = useState([]);
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const searchRef = useRef(null);
  const notificationsRef = useRef(null);

  const notifications = buildNotifications(orders);

  // Cierra las notificaciones si se hace click afuera del panel.
  useEffect(() => {
    function handleClickOutside(event) {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Trae el catálogo una sola vez para poder sugerir mientras se escribe.
  useEffect(() => {
    let cancelled = false;
    fetchProducts()
      .then((data) => {
        if (!cancelled) setAllProducts(data);
      })
      .catch(() => {
        // Si la API no responde, el buscador simplemente no sugiere nada;
        // igual se puede escribir y buscar en /categories.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Cierra las sugerencias si se hace click afuera del buscador.
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const trimmedQuery = query.trim();
  const normalizedQuery = normalizeText(trimmedQuery);

  const suggestions =
    normalizedQuery.length === 0
      ? []
      : allProducts
          .filter(
            (product) =>
              normalizeText(product.name).includes(normalizedQuery) ||
              normalizeText(product.category).includes(normalizedQuery)
          )
          .slice(0, MAX_SUGGESTIONS);

  function goToSearchResults() {
    if (trimmedQuery.length === 0) return;
    navigate(`/categories?search=${encodeURIComponent(trimmedQuery)}`);
    setShowSuggestions(false);
  }

  function handleSubmit(event) {
    event.preventDefault();
    goToSearchResults();
  }

  function handleSuggestionClick(product) {
    navigate(`/product/${product.id}`);
    setQuery("");
    setShowSuggestions(false);
  }

  function handleKeyDown(event) {
    if (event.key === "Escape") setShowSuggestions(false);
  }

  return (
    <header className="navbar">
      <div className="navbar__container container">
        <Logo light />

        <form
          className="navbar__search"
          role="search"
          onSubmit={handleSubmit}
          ref={searchRef}
        >
          <span className="navbar__search-icon" aria-hidden="true">
            🔍
          </span>
          <input
            type="text"
            placeholder="Buscar productos..."
            className="navbar__search-input"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onKeyDown={handleKeyDown}
            aria-label="Buscar productos"
            autoComplete="off"
          />

          {showSuggestions && trimmedQuery.length > 0 && (
            <div className="navbar__suggestions">
              {suggestions.length > 0 ? (
                <>
                  {suggestions.map((product) => (
                    <button
                      type="button"
                      key={product.id}
                      className="navbar__suggestion"
                      onClick={() => handleSuggestionClick(product)}
                    >
                      <span className="navbar__suggestion-name">{product.name}</span>
                      <span className="navbar__suggestion-price">
                        {formatPrice(product.price)}
                      </span>
                    </button>
                  ))}
                  <button
                    type="button"
                    className="navbar__suggestion navbar__suggestion--all"
                    onClick={goToSearchResults}
                  >
                    Ver todos los resultados para "{trimmedQuery}"
                  </button>
                </>
              ) : (
                <p className="navbar__suggestion-empty">
                  Sin resultados para "{trimmedQuery}"
                </p>
              )}
            </div>
          )}
        </form>

        {/* Accesos rápidos */}
        <div className="navbar__actions">
          <div className="navbar__notifications" ref={notificationsRef}>
            <button
              type="button"
              className="navbar__icon-btn"
              aria-label={`Notificaciones${notifications.length > 0 ? `, ${notifications.length}` : ""}`}
              onClick={() => setShowNotifications((current) => !current)}
            >
              🔔
              {notifications.length > 0 && (
                <span className="navbar__cart-badge">{notifications.length}</span>
              )}
            </button>

            {showNotifications && (
              <div className="navbar__notifications-panel">
                {notifications.length === 0 ? (
                  <p className="navbar__suggestion-empty">Todavía no tenés notificaciones.</p>
                ) : (
                  notifications.map((notification) => (
                    <div className="navbar__notification" key={notification.id}>
                      <span className="navbar__notification-text">{notification.text}</span>
                      <span className="navbar__notification-time">
                        {relativeTime(notification.date)}
                      </span>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
          <NavLink
            to="/login"
            className="navbar__icon-btn"
            aria-label={isAuthenticated ? `Mi cuenta, ${user.name}` : "Mi cuenta"}
            title={isAuthenticated ? user.name : "Iniciar sesión"}
          >
            {isAuthenticated ? user.name.charAt(0).toUpperCase() : "👤"}
          </NavLink>
          <NavLink
            to="/cart"
            className="navbar__icon-btn navbar__icon-btn--cart"
            aria-label={`Carrito${itemCount > 0 ? `, ${itemCount} productos` : ""}`}
          >
            🛒
            {itemCount > 0 && <span className="navbar__cart-badge">{itemCount}</span>}
          </NavLink>
        </div>
      </div>

      {/* Barra de navegación secundaria (solo visible en tablet/desktop) */}
      <nav className="navbar__links">
        <div className="container navbar__links-inner">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `navbar__link ${isActive ? "navbar__link--active" : ""}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
