import { useEffect, useRef, useState } from "react";
import PageHeader from "../../components/common/PageHeader";
import { formatPrice, formatProductCode } from "../../utils/format";
import { resolvePhotoUrl } from "../../api/config";
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductPhoto,
} from "../../api/products";
import "./AdminProducts.css";

const EMPTY_FORM = {
  name: "",
  category: "",
  price: "",
  stock: "",
  description: "",
  specs: "",
  tag: "",
};

function toProductPayload(form) {
  return {
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
}

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  const [form, setForm] = useState(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [creating, setCreating] = useState(false);
  const [actionError, setActionError] = useState(null);

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(EMPTY_FORM);

  const [uploadingId, setUploadingId] = useState(null);
  const fileInputRefs = useRef({});

  function loadProducts() {
    setLoading(true);
    setLoadError(null);
    fetchProducts()
      .then(setProducts)
      .catch((err) => setLoadError(err.message || "No pudimos cargar el catálogo."))
      .finally(() => setLoading(false));
  }

  useEffect(loadProducts, []);

  function validate(values) {
    const errors = {};
    if (!values.name.trim()) errors.name = "Ingresá el nombre.";
    if (!values.category.trim()) errors.category = "Ingresá la categoría.";
    if (values.price === "" || Number(values.price) < 0) {
      errors.price = "Ingresá un precio válido.";
    }
    if (values.stock !== "" && Number(values.stock) < 0) {
      errors.stock = "El stock no puede ser negativo.";
    }
    return errors;
  }

  function handleFormChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleCreate(event) {
    event.preventDefault();
    const errors = validate(form);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setCreating(true);
    setActionError(null);
    try {
      await createProduct(toProductPayload(form));
      setForm(EMPTY_FORM);
      loadProducts();
    } catch (err) {
      setActionError(err.message || "No pudimos crear el producto.");
    } finally {
      setCreating(false);
    }
  }

  function startEdit(product) {
    setEditingId(product.id);
    setEditForm({
      name: product.name,
      category: product.category,
      price: String(product.price),
      stock: String(product.stock),
      description: product.description || "",
      specs: (product.specs || []).join(", "),
      tag: product.tag || "",
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setEditForm(EMPTY_FORM);
  }

  function handleEditChange(event) {
    const { name, value } = event.target;
    setEditForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSaveEdit(id) {
    const errors = validate(editForm);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setActionError(null);
    try {
      await updateProduct(id, toProductPayload(editForm));
      cancelEdit();
      loadProducts();
    } catch (err) {
      setActionError(err.message || "No pudimos guardar los cambios.");
    }
  }

  async function handleDelete(id) {
    const confirmed = window.confirm("¿Seguro que querés eliminar este producto?");
    if (!confirmed) return;

    setActionError(null);
    try {
      await deleteProduct(id);
      loadProducts();
    } catch (err) {
      setActionError(err.message || "No pudimos eliminar el producto.");
    }
  }

  async function handlePhotoChange(id, event) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingId(id);
    setActionError(null);
    try {
      await uploadProductPhoto(id, file);
      loadProducts();
    } catch (err) {
      setActionError(err.message || "No pudimos subir la foto.");
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
          description="Cargar productos nuevos, editar precio/stock y subir fotos."
        />

        {loadError && (
          <div className="page__placeholder">
            No pudimos cargar el catálogo ({loadError}). Verificá que la API esté corriendo.
          </div>
        )}

        {actionError && <p className="admin-error admin-error--banner">{actionError}</p>}

        <section className="admin-create">
          <h2>Nuevo producto</h2>
          <form className="admin-form" onSubmit={handleCreate} noValidate>
            <div className="admin-grid">
              <div className="admin-field">
                <label htmlFor="name">Nombre</label>
                <input id="name" name="name" value={form.name} onChange={handleFormChange} />
                {formErrors.name && <span className="admin-error">{formErrors.name}</span>}
              </div>

              <div className="admin-field">
                <label htmlFor="category">Categoría</label>
                <input
                  id="category"
                  name="category"
                  value={form.category}
                  onChange={handleFormChange}
                  placeholder="Ej: Audio"
                />
                {formErrors.category && <span className="admin-error">{formErrors.category}</span>}
              </div>

              <div className="admin-field">
                <label htmlFor="price">Precio</label>
                <input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  value={form.price}
                  onChange={handleFormChange}
                />
                {formErrors.price && <span className="admin-error">{formErrors.price}</span>}
              </div>

              <div className="admin-field">
                <label htmlFor="stock">Stock</label>
                <input
                  id="stock"
                  name="stock"
                  type="number"
                  min="0"
                  value={form.stock}
                  onChange={handleFormChange}
                />
                {formErrors.stock && <span className="admin-error">{formErrors.stock}</span>}
              </div>

              <div className="admin-field">
                <label htmlFor="tag">Etiqueta (opcional)</label>
                <input
                  id="tag"
                  name="tag"
                  value={form.tag}
                  onChange={handleFormChange}
                  placeholder="Ej: Más vendido"
                />
              </div>

              <div className="admin-field admin-field--full">
                <label htmlFor="description">Descripción</label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  value={form.description}
                  onChange={handleFormChange}
                />
              </div>

              <div className="admin-field admin-field--full">
                <label htmlFor="specs">Características (separadas por coma)</label>
                <input
                  id="specs"
                  name="specs"
                  value={form.specs}
                  onChange={handleFormChange}
                  placeholder="Ej: 8GB RAM, Pantalla 14&quot;, Batería 10hs"
                />
              </div>
            </div>

            <button type="submit" className="btn btn--primary" disabled={creating}>
              {creating ? "Creando..." : "Crear producto"}
            </button>
          </form>
        </section>

        <section className="admin-list">
          <h2>Catálogo ({products.length})</h2>

          {loading ? (
            <div className="page__placeholder">Cargando...</div>
          ) : (
            <div className="admin-table">
              {products.map((product) => {
                const isEditing = editingId === product.id;
                const resolvedPhoto = resolvePhotoUrl(product.photoUrl);

                return (
                  <div className="admin-row" key={product.id}>
                    <div className="admin-row__photo">
                      {resolvedPhoto ? (
                        <img src={resolvedPhoto} alt="" />
                      ) : (
                        <span aria-hidden="true">{product.icon || "📦"}</span>
                      )}
                      <label className="admin-row__photo-btn">
                        {uploadingId === product.id ? "Subiendo..." : "Cambiar foto"}
                        <input
                          type="file"
                          accept="image/*"
                          hidden
                          onChange={(event) => handlePhotoChange(product.id, event)}
                        />
                      </label>
                    </div>

                    {isEditing ? (
                      <div className="admin-row__edit">
                        <div className="admin-grid">
                          <div className="admin-field">
                            <label>Nombre</label>
                            <input name="name" value={editForm.name} onChange={handleEditChange} />
                          </div>
                          <div className="admin-field">
                            <label>Categoría</label>
                            <input
                              name="category"
                              value={editForm.category}
                              onChange={handleEditChange}
                            />
                          </div>
                          <div className="admin-field">
                            <label>Precio</label>
                            <input
                              name="price"
                              type="number"
                              min="0"
                              value={editForm.price}
                              onChange={handleEditChange}
                            />
                          </div>
                          <div className="admin-field">
                            <label>Stock</label>
                            <input
                              name="stock"
                              type="number"
                              min="0"
                              value={editForm.stock}
                              onChange={handleEditChange}
                            />
                          </div>
                          <div className="admin-field admin-field--full">
                            <label>Descripción</label>
                            <textarea
                              name="description"
                              rows={2}
                              value={editForm.description}
                              onChange={handleEditChange}
                            />
                          </div>
                        </div>
                        <div className="admin-row__actions">
                          <button
                            type="button"
                            className="btn btn--primary"
                            onClick={() => handleSaveEdit(product.id)}
                          >
                            Guardar
                          </button>
                          <button type="button" className="btn btn--outline" onClick={cancelEdit}>
                            Cancelar
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="admin-row__info">
                        <span className="admin-row__code">{formatProductCode(product.id)}</span>
                        <span className="admin-row__name">{product.name}</span>
                        <span className="admin-row__category">{product.category}</span>
                        <span className="admin-row__price">{formatPrice(product.price)}</span>
                        <span className="admin-row__stock">Stock: {product.stock}</span>

                        <div className="admin-row__actions">
                          <button
                            type="button"
                            className="btn btn--outline"
                            onClick={() => startEdit(product)}
                          >
                            Editar
                          </button>
                          <button
                            type="button"
                            className="admin-row__delete"
                            onClick={() => handleDelete(product.id)}
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default AdminProducts;
