import { Link } from "react-router-dom";
import "./Logo.css";

/**
 * ElectroShop brand mark.
 * Recreada en SVG (nube + carrito) a partir del logo oficial de referencia,
 * para que escale nítida a cualquier tamaño (navbar, footer, favicon, hero).
 *
 * @param {"full" | "icon"} variant - "full" muestra ícono + wordmark,
 *   "icon" muestra solo la marca nube/carrito (espacios reducidos).
 * @param {boolean} light - versión clara (nube blanca, wordmark blanco),
 *   para usar sobre fondos azules/oscuros. Sin esto, la marca queda en
 *   su versión azul, pensada para fondos blancos/grises.
 * @param {"md" | "lg"} size - tamaño del logo. "lg" se usa en el hero.
 */
function Logo({ variant = "full", light = false, size = "md" }) {
  const cloudFill = light ? "#FFFFFF" : "var(--color-primary)";
  const glyphFill = light ? "var(--color-primary)" : "#FFFFFF";

  return (
    <Link
      to="/"
      className={`logo logo--${variant} logo--${size}`}
      aria-label="ElectroShop - Ir al inicio"
    >
      <svg
        className="logo__mark"
        viewBox="0 0 40 34"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M11.5 27C6.8 27 3 23.2 3 18.5C3 14.3 6 10.8 9.9 10.1C11.1 5.9 15 3 19.5 3C24.6 3 28.8 6.7 29.6 11.6C33.7 12.1 37 15.6 37 19.9C37 24.5 33.3 28 28.8 28H11.5V27Z"
          fill={cloudFill}
        />
        <path
          d="M14 19H26L24.6 25.2C24.45 25.85 23.87 26.3 23.2 26.3H16.9C16.24 26.3 15.66 25.86 15.5 25.22L14 19Z"
          fill={glyphFill}
        />
        <path d="M12.5 16H27.5" stroke={glyphFill} strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="17.6" cy="29.2" r="1.6" fill={glyphFill} />
        <circle cx="22.6" cy="29.2" r="1.6" fill={glyphFill} />
      </svg>

      {variant === "full" && (
        <span className={`logo__word ${light ? "logo__word--light" : ""}`}>
          <span className="logo__word-electro">Electro</span>
          <span className="logo__word-shop">Shop</span>
        </span>
      )}
    </Link>
  );
}

export default Logo;
