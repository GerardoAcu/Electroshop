import { createBrowserRouter } from "react-router-dom";
import Layout from "../components/layout/Layout";

import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import Cart from "../pages/Cart/Cart";
import Checkout from "../pages/Checkout/Checkout";
import ProductDetail from "../pages/ProductDetail/ProductDetail";
import Orders from "../pages/Orders/Orders";
import Complaints from "../pages/Complaints/Complaints";
import Subscribe from "../pages/Subscribe/Subscribe";
import Categories from "../pages/Categories/Categories";
import More from "../pages/More/More";
import NotFound from "../pages/NotFound/NotFound";
import Admin from "../pages/Admin/Admin";
import Company from "../pages/Company/Company";

/**
 * Definición central de rutas.
 * Todo cuelga de <Layout /> para compartir Navbar + Footer + BottomNav.
 * Agregar una página nueva = agregar su entrada acá.
 */
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "cart", element: <Cart /> },
      { path: "checkout", element: <Checkout /> },
      { path: "product/:id", element: <ProductDetail /> },
      { path: "orders", element: <Orders /> },
      { path: "complaints", element: <Complaints /> },
      { path: "subscribe", element: <Subscribe /> },
      { path: "categories", element: <Categories /> },
      { path: "more", element: <More /> },
      { path: "admin", element: <Admin /> },
      { path: "empresa", element: <Company /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

export default router;
