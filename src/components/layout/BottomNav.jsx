import { NavLink } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import "./BottomNav.css";

const TABS = [
  { to: "/categories", label: "Categorías", icon: "📂" },
  { to: "/", label: "Inicio", icon: "🏠", end: true },
  { to: "/cart", label: "Carrito", icon: "🛒" },
  { to: "/more", label: "Más", icon: "⋯" },
];

/**
 * Barra de navegación inferior, solo visible en mobile (ver BottomNav.css).
 * Replica la estructura vista en las referencias de diseño de ElectroShop.
 */
function BottomNav() {
  const { itemCount } = useCart();

  return (
    <nav className="bottom-nav" aria-label="Navegación principal">
      {TABS.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end={tab.end}
          className={({ isActive }) =>
            `bottom-nav__tab ${isActive ? "bottom-nav__tab--active" : ""}`
          }
        >
          <span className="bottom-nav__icon" aria-hidden="true">
            {tab.icon}
            {tab.to === "/cart" && itemCount > 0 && (
              <span className="bottom-nav__badge">{itemCount}</span>
            )}
          </span>
          <span className="bottom-nav__label">{tab.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}

export default BottomNav;
