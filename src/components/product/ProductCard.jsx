import { useState } from "react";
import { Link } from "react-router-dom";
import { formatPrice } from "../../utils/format";
import { resolvePhotoUrl } from "../../api/config";
import { useCart } from "../../context/CartContext";
import "./ProductCard.css";

/**
 * Tarjeta de producto reutilizable (Home, Catálogo, Detalle → relacionados).
 * El botón "Agregar al carrito" está conectado al CartContext real.
 */
function ProductCard({ product }) {
  const { id, name, category, price, icon, tag, stock = 0, photoUrl } = product;
  const { addItem, getQuantityInCart } = useCart();
  const [added, setAdded] = useState(false);
  const resolvedPhoto = resolvePhotoUrl(photoUrl);

  const quantityInCart = getQuantityInCart(id);
  const isOutOfStock = stock === 0;
  const isMaxInCart = !isOutOfStock && quantityInCart >= stock;
  const isLowStock = stock > 0 && stock <= 3;

  const availabilityLabel = isOutOfStock
    ? "Sin stock"
    : isLowStock
    ? `Últimas ${stock} unidades`
    : "Disponible";

  const availabilityClass = isOutOfStock
    ? "product-card__stock--out"
    : isLowStock
    ? "product-card__stock--low"
    : "product-card__stock--ok";

  function handleAddToCart(event) {
    event.preventDefault();
    if (isOutOfStock || isMaxInCart) return;

    addItem(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  }

  const addButtonLabel = isOutOfStock
    ? "Sin stock"
    : isMaxInCart
    ? "Sin más stock"
    : added
    ? "Agregado ✓"
    : "Agregar al carrito";

  return (
    <div className="product-card">
      {tag && <span className="product-card__tag">{tag}</span>}

      <Link to={`/product/${id}`} className="product-card__media" aria-label={`Ver detalle de ${name}`}>
        <div className="product-card__image" aria-hidden="true">
          {resolvedPhoto ? (
            <img src={resolvedPhoto} alt="" loading="lazy" />
          ) : (
            <span>{icon || "📦"}</span>
          )}
        </div>
      </Link>

      <div className="product-card__body">
        <span className="product-card__category">{category}</span>
        <Link to={`/product/${id}`} className="product-card__name-link">
          <h3 className="product-card__name">{name}</h3>
        </Link>
        <span className="product-card__price">{formatPrice(price)}</span>
        <span className={`product-card__stock ${availabilityClass}`}>
          {availabilityLabel}
        </span>
      </div>

      <div className="product-card__actions">
        <Link to={`/product/${id}`} className="btn btn--outline product-card__detail-btn">
          Ver detalle
        </Link>
        <button
          type="button"
          className={`btn btn--primary product-card__add-btn ${added ? "product-card__add-btn--added" : ""}`}
          onClick={handleAddToCart}
          disabled={isOutOfStock || isMaxInCart}
        >
          {addButtonLabel}
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
