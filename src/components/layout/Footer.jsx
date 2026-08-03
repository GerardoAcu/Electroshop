import { Link } from "react-router-dom";
import Logo from "./Logo";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div className="footer__brand">
          <Logo light />
          <p className="footer__tagline">Electrodomésticos para tu hogar</p>
        </div>

        <div className="footer__col">
          <h4 className="footer__title">Tienda</h4>
          <ul>
            <li><Link to="/">Inicio</Link></li>
            <li><Link to="/cart">Carrito</Link></li>
            <li><Link to="/subscribe">Suscribite al catálogo</Link></li>
          </ul>
        </div>

        <div className="footer__col">
          <h4 className="footer__title">Mi cuenta</h4>
          <ul>
            <li><Link to="/login">Iniciar sesión</Link></li>
            <li><Link to="/orders">Mis compras</Link></li>
            <li><Link to="/complaints">Reclamos</Link></li>
          </ul>
        </div>

        <div className="footer__col">
          <h4 className="footer__title">Ayuda</h4>
          <ul>
            <li>Pago seguro</li>
            <li>Devolución gratis</li>
            <li>Ayuda 24/7</li>
          </ul>
        </div>
      </div>

      <div className="footer__bottom">
        <div className="container footer__bottom-inner">
          <span>© {new Date().getFullYear()} ElectroShop. Todos los derechos reservados.</span>
          <span className="footer__note">
            Trabajo Final &mdash; Seminario Informático II &middot; <Link to="/admin">Administración</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
