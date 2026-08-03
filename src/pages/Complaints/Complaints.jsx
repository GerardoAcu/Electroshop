import { useEffect, useState } from "react";
import PageHeader from "../../components/common/PageHeader";
import { useOrders } from "../../context/OrdersContext";
import { useComplaints, getComplaintProgress } from "../../context/ComplaintsContext";
import "./Complaints.css";

const INITIAL_FORM = { orderNumber: "", type: "demora", message: "" };

function validate(form) {
  const errors = {};
  if (!form.orderNumber) errors.orderNumber = "Seleccioná el pedido correspondiente.";
  if (!form.message.trim() || form.message.trim().length < 10) {
    errors.message = "Contanos qué pasó (mínimo 10 caracteres).";
  }
  return errors;
}

function Complaints() {
  const { orders } = useOrders();
  const { complaints, addComplaint } = useComplaints();

  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [lastComplaint, setLastComplaint] = useState(null);
  const [, forceRefresh] = useState(0);

  // El estado del reclamo se simula según el tiempo transcurrido;
  // este intervalo hace que se actualice solo, sin recargar la página.
  useEffect(() => {
    const interval = setInterval(() => forceRefresh((n) => n + 1), 15000);
    return () => clearInterval(interval);
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    const validationErrors = validate(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    const created = addComplaint(form);
    setLastComplaint(created);
    setForm(INITIAL_FORM);
  }

  return (
    <div className="page">
      <div className="container">
        <PageHeader
          eyebrow="Soporte"
          title="Reclamos"
          description="Registro y seguimiento de reclamos sobre pedidos. Se derivan de inmediato al gerente."
        />

        {orders.length === 0 ? (
          <div className="page__placeholder">
            Todavía no tenés pedidos sobre los cuales hacer un reclamo.
          </div>
        ) : (
          <div className="complaints">
            <form className="complaints-form" onSubmit={handleSubmit} noValidate>
              <div className="complaints-field">
                <label htmlFor="orderNumber">Pedido</label>
                <select
                  id="orderNumber"
                  name="orderNumber"
                  value={form.orderNumber}
                  onChange={handleChange}
                >
                  <option value="">Seleccioná un pedido...</option>
                  {orders.map((order) => (
                    <option key={order.orderNumber} value={order.orderNumber}>
                      #{order.orderNumber}
                    </option>
                  ))}
                </select>
                {errors.orderNumber && (
                  <span className="complaints-error">{errors.orderNumber}</span>
                )}
              </div>

              <div className="complaints-field">
                <label htmlFor="type">Motivo</label>
                <select id="type" name="type" value={form.type} onChange={handleChange}>
                  <option value="demora">Demora en la entrega</option>
                  <option value="pago">Diferencia de pago</option>
                  <option value="otro">Otro</option>
                </select>
              </div>

              <div className="complaints-field">
                <label htmlFor="message">Descripción</label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Contanos qué pasó con tu pedido..."
                />
                {errors.message && <span className="complaints-error">{errors.message}</span>}
              </div>

              <button type="submit" className="btn btn--primary">
                Enviar reclamo
              </button>

              {lastComplaint && (
                <p className="complaints-confirmation">
                  ✅ Reclamo #{lastComplaint.id} enviado y derivado al gerente.
                </p>
              )}
            </form>

            {complaints.length > 0 && (
              <div className="complaints-history">
                <h2>Tus reclamos</h2>
                {complaints.map((complaint) => {
                  const progress = getComplaintProgress(complaint);
                  return (
                    <div className="complaint-card" key={complaint.id}>
                      <div className="complaint-card__header">
                        <span>#{complaint.id}</span>
                        <span
                          className={`complaint-card__status complaint-card__status--${
                            progress.status === "Resuelto" ? "resuelto" : "pendiente"
                          }`}
                        >
                          {progress.status}
                        </span>
                      </div>
                      <p className="complaint-card__order">
                        Pedido #{complaint.orderNumber} —{" "}
                        {complaint.type === "demora"
                          ? "Demora en la entrega"
                          : complaint.type === "pago"
                          ? "Diferencia de pago"
                          : "Otro"}
                      </p>
                      <p className="complaint-card__message">{complaint.message}</p>
                      {progress.note && (
                        <p className="complaint-card__note">
                          <strong>Respuesta del gerente:</strong> {progress.note}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Complaints;
