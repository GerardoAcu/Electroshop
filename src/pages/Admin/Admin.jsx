import { useEffect, useRef, useState } from "react";
import PageHeader from "../../components/common/PageHeader";
import { formatPrice, formatProductCode } from "../../utils/format";
import { resolvePhotoUrl } from "../../api/config";
import {
  fetchProducts,
  fetchProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductPhoto,
} from "../../api/products";
import "./Admin.css";

const EMPTY_FORM = {
  id: null,
  name: "",
  category: "",
  price: "",
  stock: "",
  description: "",
  specs: "",
  tag: "",
};

function productToForm(product) {
  return {
    id: product.id,
    name: product.name,
    category: product.category,
    price: String(product.price),
    stock: String(product.stock),
    description: product.description || "",
    specs: (product.specs || []).join(", "),
    tag: product.tag || "",
  };
}

function validate(form) {
  const errors = {};
  if (!form.name.trim()) errors.name = "Ingresá el nombre.";
  if (!form.category.trim()) errors.category = "Ingresá la categoría.";
  if (form.price === "" || Number(form.price) < 0) errors.price = "Ingresá un precio válido.";
  if (form.stock !== "" && Number(form.stock) < 0) errors.stock = "El stock no puede ser negativo.";
  return errors;
}

function Admin() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [apiDown, setApiDown] = useState(false);

  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [uploadingId, setUploadingId] = useState(null);

  const formRef = useRef(null);
  const isEditing = form.id !== null;

  async function loadProducts() {
    setLoading(true);
    setLoadError(null);
    try {
      const data = await fetchProducts();
      setProducts(data);
      setApiDown(false);
    } catch (err) {
      setLoadError(err.message || "No pudimos conectar con la API.");
      setApiDown(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleEdit(product) {
    setForm(productToForm(product));
    setErrors({});
    setFeedback(null);
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

    // Trae el producto de nuevo desde la API por si otra persona lo cambió
    // (ej. el stock, tras una compra) desde que se cargó la lista.
    try {
      const fresh = await fetchProductById(product.id);
      setForm(productToForm(fresh));
    } catch {
      // Si falla, seguimos con los datos que ya teníamos cargados.
    }
  }

  function handleCancelEdit() {
    setForm(EMPTY_FORM);
    setErrors({});
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const validationErrors = validate(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    const payload = {
      name: form.name.trim(),
      category: form.category.trim(),
      price: Number(form.price),
      stock: Number(form.stock || 0),
      description: form.description.trim(),
      specs: form.specs
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      tag: form.tag.trim() || null,
    };

    setSaving(true);
    setFeedback(null);
    try {
      if (isEditing) {
        await updateProduct(form.id, payload);
        setFeedback({ type: "success", text: `Producto #${form.id} actualizado.` });
      } else {
        const created = await createProduct(payload);
        setFeedback({ type: "success", text: `Producto "${created.name}" creado con id ${created.id}.` });
      }
      setForm(EMPTY_FORM);
      await loadProducts();
    } catch (err) {
      setFeedback({ type: "error", text: err.message || "No pudimos guardar el producto." });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(product) {
    const confirmed = window.confirm(`¿Borrar "${product.name}" (#${product.id})? No se puede deshacer.`);
    if (!confirmed) return;

    try {
      await deleteProduct(product.id);
      if (form.id === product.id) setForm(EMPTY_FORM);
      await loadProducts();
    } catch (err) {
      setFeedback({ type: "error", text: err.message || "No pudimos borrar el producto." });
    }
  }

  async function handlePhotoChange(product, event) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingId(product.id);
    setFeedback(null);
    try {
      await uploadProductPhoto(product.id, file);
      await loadProducts();
    } catch (err) {
      setFeedback({ type: "error", text: err.message || "No pudimos subir la foto." });
    } finally {
      setUploadingId(null);
      event.target.value = "";
    }
  }

  return (
    <div className="page">
      <div className="container">
        <PageHeader
          eyebrow="Administración"
          title="Productos"
          description="Alta, edición, baja y fotos del catálogo. Los cambios se guardan directo en la API."
        />

        {apiDown ? (
          <div className="page__placeholder">
            No pudimos conectar con la API ({loadError}). Verificá que esté corriendo en{" "}
            <code>npm run dev</code> dentro de <code>electroshop-api</code>.
          </div>
        ) : (
          <div className="admin">
            <form className="admin-form" onSubmit={handleSubmit} noValidate ref={formRef}>
              <h2>{isEditing ? `Editando producto #${form.id}` : "Nuevo producto"}</h2>

              <div className="admin-grid">
                <div className="admin-field">
                  <label htmlFor="name">Nombre</label>
                  <input id="name" name="name" value={form.name} onChange={handleChange} />
                  {errors.name && <span className="admin-error">{errors.name}</span>}
                </div>

                <div className="admin-field">
                  <label htmlFor="category">Categoría</label>
                  <input id="category" name="category" value={form.category} onChange={handleChange} />
                  {errors.category && <span className="admin-error">{errors.category}</span>}
                </div>

                <div className="admin-field">
                  <label htmlFor="price">Precio</label>
                  <input
                    id="price"
                    name="price"
                    type="number"
                    min="0"
                    value={form.price}
                    onChange={handleChange}
                  />
                  {errors.price && <span className="admin-error">{errors.price}</span>}
                </div>

                <div className="admin-field">
                  <label htmlFor="stock">Stock</label>
                  <input
                    id="stock"
                    name="stock"
                    type="number"
                    min="0"
                    value={form.stock}
                    onChange={handleChange}
                  />
                  {errors.stock && <span className="admin-error">{errors.stock}</span>}
                </div>

                <div className="admin-field admin-field--full">
                  <label htmlFor="description">Descripción</label>
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    value={form.description}
                    onChange={handleChange}
                  />
                </div>

                <div className="admin-field admin-field--full">
                  <label htmlFor="specs">Características (separadas por coma)</label>
                  <input
                    id="specs"
                    name="specs"
                    value={form.specs}
                    onChange={handleChange}
                    placeholder="8 GB RAM, Pantalla 14, Batería 10hs"
                  />
                </div>

                <div className="admin-field">
                  <label htmlFor="tag">Etiqueta (opcional)</label>
                  <input
                    id="tag"
                    name="tag"
                    value={form.tag}
                    onChange={handleChange}
                    placeholder="Más vendido"
                  />
                </div>
              </div>

              {feedback && (
                <p className={`admin-feedback admin-feedback--${feedback.type}`}>{feedback.text}</p>
              )}

              <div className="admin-form__actions">
                <button type="submit" className="btn btn--primary" disabled={saving}>
                  {saving ? "Guardando..." : isEditing ? "Guardar cambios" : "Crear producto"}
                </button>
                {isEditing && (
                  <button type="button" className="btn btn--outline" onClick={handleCancelEdit}>
                    Cancelar edición
                  </button>
                )}
              </div>
            </form>

            <div className="admin-list">
              <h2>Catálogo ({products.length})</h2>

              {loading ? (
                <p>Cargando productos...</p>
              ) : (
                <div className="admin-table-wrap">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Foto</th>
                        <th>Código</th>
                        <th>Nombre</th>
                        <th>Categoría</th>
                        <th>Precio</th>
                        <th>Stock</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product) => {
                        const photo = resolvePhotoUrl(product.photoUrl);
                        return (
                          <tr key={product.id}>
                            <td>
                              <label className="admin-photo-cell">
                                {photo ? (
                                  <img src={photo} alt="" />
                                ) : (
                                  <span className="admin-photo-placeholder">📦</span>
                                )}
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(event) => handlePhotoChange(product, event)}
                                  disabled={uploadingId === product.id}
                                />
                                <span className="admin-photo-label">
                                  {uploadingId === product.id ? "Subiendo..." : "Cambiar"}
                                </span>
                              </label>
                            </td>
                            <td>{formatProductCode(product.id)}</td>
                            <td>{product.name}</td>
                            <td>{product.category}</td>
                            <td>{formatPrice(product.price)}</td>
                            <td>{product.stock}</td>
                            <td className="admin-table__actions">
                              <button type="button" onClick={() => handleEdit(product)}>
                                Editar
                              </button>
                              <button
                                type="button"
                                className="admin-table__delete"
                                onClick={() => handleDelete(product)}
                              >
                                Borrar
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Admin;
