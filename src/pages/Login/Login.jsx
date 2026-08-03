import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";
import Button from "../../components/common/Button";
import { useAuth } from "../../context/AuthContext";
import "./Login.css";

function validate(form) {
  const errors = {};

  if (!form.name.trim()) {
    errors.name = "Ingresá tu nombre.";
  }

  if (!form.email.trim()) {
    errors.email = "Ingresá tu email.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    errors.email = "Ingresá un email válido.";
  }

  if (!form.password) {
    errors.password = "Ingresá tu contraseña.";
  } else if (form.password.length < 4) {
    errors.password = "La contraseña debe tener al menos 4 caracteres.";
  }

  return errors;
}

function Login() {
  const { user, isAuthenticated, login, loginAsGuest, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({});

  const redirectTo = location.state?.from || "/";

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    const validationErrors = validate(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    login({ name: form.name, email: form.email });
    navigate(redirectTo, { replace: true });
  }

  function handleGuest() {
    loginAsGuest();
    navigate(redirectTo, { replace: true });
  }

  // ---------- Ya hay una sesión iniciada ----------
  if (isAuthenticated) {
    return (
      <div className="page">
        <div className="container">
          <PageHeader
            eyebrow="Mi cuenta"
            title={`Hola, ${user.name}`}
            description={user.email ? user.email : "Estás navegando como invitado."}
          />
          <div className="login-session">
            <Button to="/orders" variant="primary">
              Ver mis compras
            </Button>
            <Button to="/" variant="outline">
              Seguir comprando
            </Button>
            <button type="button" className="login-logout" onClick={logout}>
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ---------- Formulario de login ----------
  return (
    <div className="page">
      <div className="container">
        <PageHeader
          eyebrow="Mi cuenta"
          title="Iniciar sesión"
          description="Ingresá tus datos o continuá como invitado."
        />

        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <div className="login-field">
            <label htmlFor="name">Nombre</label>
            <input id="name" name="name" type="text" value={form.name} onChange={handleChange} />
            {errors.name && <span className="login-error">{errors.name}</span>}
          </div>

          <div className="login-field">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" value={form.email} onChange={handleChange} />
            {errors.email && <span className="login-error">{errors.email}</span>}
          </div>

          <div className="login-field">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
            />
            {errors.password && <span className="login-error">{errors.password}</span>}
          </div>

          <button type="submit" className="btn btn--primary login-submit">
            Iniciar sesión
          </button>
          <button type="button" className="btn btn--outline login-guest" onClick={handleGuest}>
            Continuar como invitado
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
