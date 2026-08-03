import "./ProductCardSkeleton.css";

/** Placeholder animado con la forma de una ProductCard, mientras se cargan datos de la API. */
function ProductCardSkeleton() {
  return (
    <div className="product-card-skeleton" aria-hidden="true">
      <div className="product-card-skeleton__image shimmer" />
      <div className="product-card-skeleton__line shimmer" style={{ width: "40%" }} />
      <div className="product-card-skeleton__line shimmer" style={{ width: "85%" }} />
      <div className="product-card-skeleton__line shimmer" style={{ width: "50%" }} />
    </div>
  );
}

export default ProductCardSkeleton;
