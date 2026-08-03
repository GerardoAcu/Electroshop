import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";
import ProductCard from "../../components/product/ProductCard";
import ProductCardSkeleton from "../../components/product/ProductCardSkeleton";
import { fetchProducts } from "../../api/products";
import { normalizeText } from "../../utils/format";
import "./Categories.css";

const SORT_OPTIONS = [
  { value: "relevance", label: "Relevancia" },
  { value: "price-asc", label: "Precio: menor a mayor" },
  { value: "price-desc", label: "Precio: mayor a menor" },
  { value: "name-asc", label: "Nombre: A-Z" },
];

const AVAILABILITY_OPTIONS = [
  { value: "all", label: "Todos" },
  { value: "in-stock", label: "Disponibles" },
  { value: "out-of-stock", label: "Sin stock" },
];

function Categories() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState("all");
  const [availability, setAvailability] = useState("all");
  const [sortBy, setSortBy] = useState("relevance");

  // Si llegamos desde el buscador del navbar (o un link con ?search=...),
  // sincronizamos el término de búsqueda cada vez que cambie en la URL.
  useEffect(() => {
    setSearch(searchParams.get("search") || "");
  }, [searchParams]);

  useEffect(() => {
    let cancelled = false;

    fetchProducts()
      .then((data) => {
        if (!cancelled) setProducts(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "No pudimos cargar el catálogo.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const categories = useMemo(
    () => [...new Set(products.map((p) => p.category))].sort((a, b) => a.localeCompare(b, "es")),
    [products]
  );

  const visibleProducts = useMemo(() => {
    const query = normalizeText(search.trim());

    let result = products.filter((product) => {
      const matchesSearch =
        query.length === 0 ||
        normalizeText(product.name).includes(query) ||
        normalizeText(product.category).includes(query);

      const matchesCategory = category === "all" || product.category === category;

      const matchesAvailability =
        availability === "all" ||
        (availability === "in-stock" && product.stock > 0) ||
        (availability === "out-of-stock" && product.stock === 0);

      return matchesSearch && matchesCategory && matchesAvailability;
    });

    if (sortBy === "price-asc") {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      result = [...result].sort((a, b) => b.price - a.price);
    } else if (sortBy === "name-asc") {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name, "es"));
    }

    return result;
  }, [products, search, category, availability, sortBy]);

  function handleClearFilters() {
    setSearch("");
    setCategory("all");
    setAvailability("all");
    setSortBy("relevance");
  }

  const hasActiveFilters =
    search.trim() !== "" || category !== "all" || availability !== "all" || sortBy !== "relevance";

  return (
    <div className="page">
      <div className="container">
        <PageHeader
          eyebrow="Explorar"
          title="Catálogo"
          description="Notebooks, audio, gaming, hogar y mucho más. Buscá, filtrá y encontrá lo que necesitás."
        />

        {error ? (
          <div className="page__placeholder">
            No pudimos cargar el catálogo ({error}). Verificá que la API esté corriendo.
          </div>
        ) : loading ? (
          <div className="catalog-results__grid">
            {Array.from({ length: 8 }).map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))}
          </div>
        ) : (
          <>
            <div className="catalog-toolbar">
              <div className="catalog-toolbar__search">
                <span className="catalog-toolbar__search-icon" aria-hidden="true">🔍</span>
                <input
                  type="text"
                  className="catalog-toolbar__search-input"
                  placeholder="Buscar productos..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  aria-label="Buscar productos en el catálogo"
                />
              </div>

              <div className="catalog-toolbar__filters">
                <label className="catalog-toolbar__field">
                  <span>Categoría</span>
                  <select value={category} onChange={(event) => setCategory(event.target.value)}>
                    <option value="all">Todas</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="catalog-toolbar__field">
                  <span>Disponibilidad</span>
                  <select value={availability} onChange={(event) => setAvailability(event.target.value)}>
                    {AVAILABILITY_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="catalog-toolbar__field">
                  <span>Ordenar por</span>
                  <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
                    {SORT_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>

                {hasActiveFilters && (
                  <button type="button" className="catalog-toolbar__clear" onClick={handleClearFilters}>
                    Limpiar filtros
                  </button>
                )}
              </div>
            </div>

            <div className="catalog-results">
              <p className="catalog-results__count">
                {visibleProducts.length}{" "}
                {visibleProducts.length === 1 ? "producto encontrado" : "productos encontrados"}
              </p>

              {visibleProducts.length > 0 ? (
                <div className="catalog-results__grid">
                  {visibleProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="page__placeholder">
                  No encontramos productos que coincidan con tu búsqueda. Probá con otros términos o
                  limpiá los filtros.
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Categories;
