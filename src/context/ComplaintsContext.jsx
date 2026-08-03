import { createContext, useContext, useEffect, useState } from "react";

const ComplaintsContext = createContext(null);

const STORAGE_KEY = "electroshop:complaints";

function loadInitialComplaints() {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

const RESOLUTION_NOTES = {
  demora: "El gerente confirmó que el pedido ya está en camino y se reforzó el seguimiento con el transportista.",
  pago: "El gerente revisó el cobro y, si correspondía una diferencia, ya se generó el ajuste o reintegro.",
  otro: "El gerente tomó conocimiento del reclamo y se puso en contacto por el email registrado.",
};

/**
 * Estado simulado del reclamo según el tiempo transcurrido desde que se
 * envió: recién enviado queda "Derivado al gerente", después pasa a
 * "En revisión" y finalmente a "Resuelto" con una nota del gerente.
 * Es una simulación (no hay backend de gerentes) para mostrar el flujo
 * completo sin tener que esperar días reales.
 */
export function getComplaintProgress(complaint) {
  const minutesElapsed = (Date.now() - new Date(complaint.date).getTime()) / 60000;

  if (minutesElapsed < 2) {
    return { status: "Derivado al gerente", note: null };
  }
  if (minutesElapsed < 5) {
    return { status: "En revisión", note: null };
  }
  return {
    status: "Resuelto",
    note: RESOLUTION_NOTES[complaint.type] || RESOLUTION_NOTES.otro,
  };
}

/**
 * Reclamos de clientes, persistidos en localStorage.
 * Según el enunciado, todo reclamo se deriva de inmediato al gerente:
 * acá se simula guardando el reclamo con estado "derivado al gerente".
 */
export function ComplaintsProvider({ children }) {
  const [complaints, setComplaints] = useState(loadInitialComplaints);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(complaints));
    } catch {
      // localStorage no disponible: los reclamos siguen funcionando en memoria.
    }
  }, [complaints]);

  function addComplaint(complaint) {
    const newComplaint = {
      ...complaint,
      id: `RC-${Date.now().toString().slice(-6)}`,
      date: new Date().toISOString(),
      status: "Derivado al gerente",
    };
    setComplaints((current) => [newComplaint, ...current]);
    return newComplaint;
  }

  const value = { complaints, addComplaint };

  return <ComplaintsContext.Provider value={value}>{children}</ComplaintsContext.Provider>;
}

/** Hook de acceso a los reclamos. Debe usarse dentro de <ComplaintsProvider>. */
export function useComplaints() {
  const context = useContext(ComplaintsContext);
  if (!context) {
    throw new Error("useComplaints debe usarse dentro de un <ComplaintsProvider>");
  }
  return context;
}
