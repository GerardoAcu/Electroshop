import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Button from "../../components/common/Button";
import PageHeader from "../../components/common/PageHeader";
import ProductCard from "../../components/product/ProductCard";
import { formatPrice, formatProductCode } from "../../utils/format";
import { fetchProductById, fetchProducts } from "../../api/products";
import { resolvePhotoUrl } from "../../api/config";
import { useCart } from "../../context/CartContext";
import "./ProductDetail.css";

function ProductDetail() {
  const { id } = useParams();
  const { addItem, getQuantityInCart } = useCart();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState(null);

  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      setNotFound(false);
      setQuantity(1);

      try {
        const data = await fetchProductById(id);
        if (cancelled) return;
        setProduct(data);

        const all = await fetchProducts();
        if (cancelled) return;
        const related = all
          .filter((p) => p.category === data.category && p.id !== data.id)
          .slice(0, 4);
        setRelatedProducts(related);
      } catch (err) {
        if (cancelled) return;
        if (err.message?.includes("404") || err.message?.includes("no encontrado")) {
          setNotFound(true);
        } else {
          setError(err.message || "No pudimos cargar el producto.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="page">
        <div className="container">
          <div className="page__placeholder">Cargando producto...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <div className="container">
          <PageHeader eyebrow="Producto" title="No pudimos cargar el producto" description={error} />
          <div className="page__placeholder">
            <p style={{ marginBottom: "1.25rem" }}>
              Verificá que la API esté corriendo en el puerto configurado.
            </p>
            <Button to="/categories" variant="primary">
              Volver al catálogo
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (notFound || !product) {
    return (
      <div className="page">
        <div className="container">
          <PageHeader
            eyebrow="Producto"
            title="Producto no encontrado"
            description={`No encontramos ningún producto con el identificador "${id}".`}
          />
          <div className="page__placeholder">
            <p style={{ marginBottom: "1.25rem" }}>
              Puede que el producto ya no esté disponible o que el enlace sea incorrecto.
            </p>
            <Button to="/categories" variant="primary">
              Volver al catálogo
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const { name, category, price, tag, stock, description, specs, photoUrl } = product;
  const resolvedPhoto = resolvePhotoUrl(photoUrl);
  const quantityInCart = getQuantityInCart(product.id);
  const remainingStock = Math.max(stock - quantityInCart, 0);
  const isOutOfStock = stock === 0;
  const isLowStock = stock > 0 && stock <= 3;

  const availabilityLabel = isOutOfStock
    ? "Sin stock"
    : isLowStock
    ? `Últimas ${stock} unidades disponibles`
    : `Disponible (${stock} unidades)`;

  const availabilityClass = isOutOfStock
    ? "product-detail__stock--out"
    : isLowStock
    ? "product-detail__stock--low"
    : "product-detail__stock--ok";

  function handleQuantityChange(delta) {
    setQuantity((current) => {
      const next = current + delta;
      if (next < 1) return 1;
      if (next > remainingStock) return remainingStock;
      return next;
    });
  }

  function handleAddToCart() {
    if (isOutOfStock || remainingStock === 0) return;
    addItem(product, quantity);
    setAdded(true);
    setQuantity(1);
    setTimeout(() => setAdded(false), 1800);
  }

  return (
    <div className="page">
      <div className="container">
        <nav className="product-detail__breadcrumb" aria-label="Volver">
          <Link to="/categories">← Volver al catálogo</Link>
        </nav>

        <div className="product-detail">
          <div className="product-detail__media">
            {tag && <span className="product-detail__tag">{tag}</span>}
            <div className="product-detail__image" aria-hidden="true">
              {resolvedPhoto ? (
                <img src={resolvedPhoto} alt="" loading="lazy" />
              ) : (
                <span>{product.icon || "📦"}</span>
              )}
            </div>
          </div>

          <div className="product-detail__info">
            <span className="page__eyebrow">{category}</span>
            <h1 className="product-detail__name">{name}</h1>
            <span className="product-detail__code">Código: {formatProductCode(product.id)}</span>
            <p className="product-detail__price">{formatPrice(price)}</p>

            <span className={`product-detail__stock ${availabilityClass}`}>
              {availabilityLabel}
            </span>

            <p className="product-detail__description">{description}</p>

            {specs?.length > 0 && (
              <div className="product-detail__specs">
                <h2>Características</h2>
                <ul>
                  {specs.map((spec) => (
                    <li key={spec}>{spec}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="product-detail__purchase">
              {!isOutOfStock && remainingStock > 0 && (
                <div className="product-detail__quantity">
                  <span>Cantidad</span>
                  <div className="product-detail__quantity-control">
                    <button
                      type="button"
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                      aria-label="Restar cantidad"
                    >
                      −
                    </button>
                    <span>{quantity}</span>
                    <button
                      type="button"
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= remainingStock}
                      aria-label="Sumar cantidad"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              <button
                type="button"
                className={`btn btn--primary product-detail__add-btn ${
                  added ? "product-detail__add-btn--added" : ""
                }`}
                onClick={handleAddToCart}
                disabled={isOutOfStock || remainingStock === 0}
              >
                {isOutOfStock
                  ? "Sin stock"
                  : remainingStock === 0
                  ? "Ya tenés todo el stock en tu carrito"
                  : added
                  ? "Agregado al carrito ✓"
                  : "Agregar al carrito"}
              </button>
            </div>

            {quantityInCart > 0 && !isOutOfStock && (
              <p className="product-detail__in-cart-note">
                Ya tenés {quantityInCart} {quantityInCart === 1 ? "unidad" : "unidades"} de este
                producto en tu carrito.
              </p>
            )}
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <section className="product-detail__related">
            <h2>También te puede interesar</h2>
            <div className="product-detail__related-grid">
              {relatedProducts.map((related) => (
                <ProductCard key={related.id} product={related} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default ProductDetail;
