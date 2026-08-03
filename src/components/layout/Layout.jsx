import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import BottomNav from "./BottomNav";

/**
 * Layout general de la aplicación.
 * Todas las rutas se renderizan dentro de <Outlet /> manteniendo
 * el Navbar, el Footer y (en mobile) la barra inferior fijos.
 */
function Layout() {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="app-shell__content">
        <Outlet />
      </main>
      <Footer />
      <BottomNav />
    </div>
  );
}

export default Layout;
