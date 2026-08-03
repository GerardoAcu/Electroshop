import { Link } from "react-router-dom";
import "./Button.css";

/**
 * Botón base reutilizable en toda la app.
 * variant: "primary" | "secondary" | "outline"
 *
 * Si se pasa la prop `to`, se renderiza como <Link> (React Router) en vez
 * de <button>, mantiene la misma clase visual pero evita anidar un
 * <button> dentro de un <a> (HTML inválido).
 */
function Button({ children, variant = "primary", type = "button", className = "", to, ...props }) {
  const classes = `btn btn--${variant} ${className}`.trim();

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={classes} {...props}>
      {children}
    </button>
  );
}

export default Button;
