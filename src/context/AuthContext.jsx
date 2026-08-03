import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

const STORAGE_KEY = "electroshop:user";

function loadInitialUser() {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * Sesión simulada (sin backend real): guarda nombre/email en localStorage
 * para que la app "recuerde" al usuario entre recargas. No valida
 * contraseña contra ningún servidor; es una maqueta funcional.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(loadInitialUser);

  useEffect(() => {
    try {
      if (user) {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      } else {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // localStorage no disponible: la sesión sigue funcionando en memoria.
    }
  }, [user]);

  function login({ name, email }) {
    setUser({ name: name.trim(), email: email.trim() });
  }

  function loginAsGuest() {
    setUser({ name: "Invitado", email: null, guest: true });
  }

  function logout() {
    setUser(null);
  }

  const value = { user, isAuthenticated: Boolean(user), login, loginAsGuest, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/** Hook de acceso a la sesión. Debe usarse dentro de <AuthProvider>. */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un <AuthProvider>");
  }
  return context;
}
