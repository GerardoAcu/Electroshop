import { Link } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";
import { useAuth } from "../../context/AuthContext";
import "./More.css";

const MENU_SECTIONS = [
  {
    title: "Mi cuenta",
    items: [
      { to: "/login", icon: "👤", label: "Mi cuenta", description: "Iniciar sesión o ver mis datos" },
      { to: "/orders", icon: "📦", label: "Mis compras", description: "Ver pedidos y cancelar" },
      { to: "/cart", icon: "🛒", label: "Carrito", description: "Ver productos agregados" },
    ],
  },
  {
    title: "Ayuda",
    items: [
      { to: "/complaints", icon: "📝", label: "Reclamos", description: "Demoras o diferencias de pago" },
      { to: "/subscribe", icon: "📬", label: "Suscripción", description: "Recibir el catálogo por email" },
    ],
  },
  {
    title: "Catálogo",
    items: [
      { to: "/categories", icon: "🗂️", label: "Categorías", description: "Explorar todo el catálogo" },
      { to: "/empresa", icon: "🏢", label: "Perfil de la empresa", description: "Información institucional" },
      { to: "/admin", icon: "⚙️", label: "Administración", description: "Cargar y editar productos" },
    ],
  },
];

function More() {
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="page">
      <div className="container">
        <PageHeader
          eyebrow="Menú"
          title="Más opciones"
          description={
            isAuthenticated
              ? `Hola, ${user.name} — accesos a tu cuenta, pedidos, reclamos y ayuda.`
              : "Accesos a mi cuenta, pedidos, reclamos y ayuda."
          }
        />

        <div className="more-menu">
          {MENU_SECTIONS.map((section) => (
            <div className="more-menu__section" key={section.title}>
              <h2>{section.title}</h2>
              <div className="more-menu__items">
                {section.items.map((item) => (
                  <Link to={item.to} className="more-menu__item" key={item.to}>
                    <span className="more-menu__item-icon" aria-hidden="true">
                      {item.icon}
                    </span>
                    <span className="more-menu__item-text">
                      <span className="more-menu__item-label">{item.label}</span>
                      <span className="more-menu__item-description">{item.description}</span>
                    </span>
                    <span className="more-menu__item-arrow" aria-hidden="true">
                      →
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="more-about">
          <h2>Acerca de ElectroShop</h2>
          <p>
            ElectroShop es la tienda online de la cadena Shopping para comprar los mismos
            productos que se ofrecen de manera presencial: notebooks, audio, gaming, hogar y
            más. Este sitio es el Trabajo Final de Seminario Informático II — Equipos y
            Metodologías Ágiles.
          </p>
        </div>
      </div>
    </div>
  );
}

export default More;
