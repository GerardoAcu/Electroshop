import { useState } from "react";
import PageHeader from "../../components/common/PageHeader";
import "./Subscribe.css";

const STORAGE_KEY = "electroshop:subscription";

function loadInitialSubscription() {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function Subscribe() {
  const [subscription, setSubscription] = useState(loadInitialSubscription);
  const [email, setEmail] = useState("");
  const [frequency, setFrequency] = useState("weekly");
  const [error, setError] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Ingresá un email válido.");
      return;
    }

    const newSubscription = { email: email.trim(), frequency };
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(newSubscription));
    } catch {
      // localStorage no disponible: la suscripción queda solo en esta sesión.
    }
    setSubscription(newSubscription);
    setError("");
  }

  function handleUnsubscribe() {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // localStorage no disponible.
    }
    setSubscription(null);
    setEmail("");
  }

  if (subscription) {
    return (
      <div className="page">
        <div className="container">
          <PageHeader
            eyebrow="Novedades"
            title="Suscribite al catálogo"
            description="Recibí ofertas y novedades de ElectroShop."
          />
          <div className="subscribe-confirmation">
            <span className="subscribe-confirmation__icon" aria-hidden="true">📬</span>
            <p>
              Vas a recibir el catálogo de productos por email a{" "}
              <strong>{subscription.email}</strong>, con frecuencia{" "}
              {subscription.frequency === "weekly" ? "semanal" : "mensual"}.
            </p>
            <button type="button" className="btn btn--outline" onClick={handleUnsubscribe}>
              Cancelar suscripción
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container">
        <PageHeader
          eyebrow="Novedades"
          title="Suscribite al catálogo"
          description="Recibí periódicamente el catálogo de productos por correo electrónico."
        />

        <form className="subscribe-form" onSubmit={handleSubmit} noValidate>
          <div className="subscribe-field">
            <label htmlFor="subscribe-email">Email</label>
            <input
              id="subscribe-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="tu@email.com"
            />
            {error && <span className="subscribe-error">{error}</span>}
          </div>

          <div className="subscribe-field">
            <label htmlFor="subscribe-frequency">Frecuencia de envío</label>
            <select
              id="subscribe-frequency"
              value={frequency}
              onChange={(event) => setFrequency(event.target.value)}
            >
              <option value="weekly">Semanal</option>
              <option value="monthly">Mensual</option>
            </select>
          </div>

          <button type="submit" className="btn btn--primary">
            Suscribirme
          </button>
        </form>
      </div>
    </div>
  );
}

export default Subscribe;
