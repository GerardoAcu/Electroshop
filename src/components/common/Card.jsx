import "./Card.css";

/**
 * Contenedor base con estilo de tarjeta (usado por productos, ítems del
 * carrito, pedidos, etc.). Puramente presentacional por ahora.
 */
function Card({ children, className = "", ...props }) {
  return (
    <div className={`card ${className}`} {...props}>
      {children}
    </div>
  );
}

export default Card;
