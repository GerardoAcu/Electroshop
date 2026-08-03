import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Logo from "../../components/layout/Logo";
import Button from "../../components/common/Button";
import ProductCard from "../../components/product/ProductCard";
import ProductCardSkeleton from "../../components/product/ProductCardSkeleton";
import { fetchProducts } from "../../api/products";
import "./Home.css";

const FEATURED_COUNT = 6;

const TRUST_POINTS = [
  { icon: "🏷️", label: "Mejores precios" },
  { icon: "🚚", label: "Envíos rápidos" },
  { icon: "🎧", label: "Atención personalizada" },
];

const FLOATING_ICONS = ["💻", "🎧", "📺", "🔌", "🏠", "⌨️"];

function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    fetchProducts()
      .then((data) => {
        if (!cancelled) setFeaturedProducts(data.slice(0, FEATURED_COUNT));
      })
      .catch((err) => {
        if (!cancelled) setLoadError(err.message || "No pudimos cargar los destacados.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      {/* ---------- Hero ---------- */}
      <section className="hero">
        <div className="container hero__grid">
          <div className="hero__content">
            <span className="hero__eyebrow">Electrodomésticos y tecnología</span>

            <Logo light size="lg" />

            <h1 className="hero__title">
              Todo lo que tu hogar necesita, en un solo lugar
            </h1>

            <p className="hero__description">
              En ElectroShop encontrás notebooks, electrodomésticos, gaming y
              tecnología para el hogar, con los mejores precios, envíos
              rápidos a todo el país y atención personalizada en cada compra.
            </p>

            <div className="hero__actions">
              <Button to="/categories" variant="secondary" className="hero__btn-primary">
                Ver catálogo
              </Button>
              <Button to="/subscribe" variant="outline" className="hero__btn-outline">
                Solicitar catálogo
              </Button>
            </div>

            <ul className="hero__trust">
              {TRUST_POINTS.map((point) => (
                <li key={point.label}>
                  <span aria-hidden="true">{point.icon}</span>
                  {point.label}
                </li>
              ))}
            </ul>
          </div>

          <div className="hero__visual" aria-hidden="true">
            <div className="hero__blob" />
            <div className="hero__icon-grid">
              {FLOATING_ICONS.map((icon, index) => (
                <span key={index} className="hero__icon-chip">
                  {icon}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Productos destacados ---------- */}
      <section className="featured">
        <div className="container">
          <div className="featured__header">
            <div>
              <span className="page__eyebrow">Selección</span>
              <h2 className="featured__title">Productos destacados</h2>
              <p className="featured__subtitle">
                Lo más elegido por nuestros clientes esta semana.
              </p>
            </div>
            <Link to="/categories" className="featured__link">
              Ver todo el catálogo →
            </Link>
          </div>

          <div className="featured__grid">
            {loading ? (
              Array.from({ length: FEATURED_COUNT }).map((_, index) => (
                <ProductCardSkeleton key={index} />
              ))
            ) : loadError ? (
              <p className="featured__error">
                No pudimos cargar los productos destacados ({loadError}). Verificá que la API esté
                corriendo.
              </p>
            ) : (
              featuredProducts.map((product) => <ProductCard key={product.id} product={product} />)
            )}
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;
