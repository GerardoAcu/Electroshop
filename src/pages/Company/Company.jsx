import PageHeader from "../../components/common/PageHeader";
import Button from "../../components/common/Button";
import "./Company.css";

function Company() {
  return (
    <div className="page">
      <div className="container">
        <PageHeader
          eyebrow="Empresa"
          title="Perfil de la empresa"
          description="Información institucional y gestión del catálogo de ElectroShop."
        />

        <div className="company">
          <section className="company-card">
            <h2>Sobre ElectroShop</h2>
            <p>
              ElectroShop es la tienda online de la cadena Shopping para ofrecer soporte a las
              compras en línea de los mismos productos que se venden de manera presencial:
              notebooks, audio, gaming, hogar y más.
            </p>
            <p>
              Este sitio es el Trabajo Final de Seminario Informático II — Equipos y Metodologías
              Ágiles, desarrollado durante el primer cuatrimestre de 2026.
            </p>
          </section>

          <section className="company-card">
            <h2>Datos de contacto</h2>
            <ul className="company-contact">
              <li>
                <strong>Email de soporte:</strong> soporte@electroshop.com
              </li>
              <li>
                <strong>Reclamos:</strong> se derivan directamente al gerente desde la sección
                Reclamos.
              </li>
            </ul>
          </section>

          <section className="company-card company-card--action">
            <h2>Gestión del catálogo</h2>
            <p>
              Alta, edición, baja de productos y carga de fotos — todo se guarda directo en la
              base de datos de la tienda.
            </p>
            <Button to="/admin" variant="primary">
              Ir a Administración
            </Button>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Company;
