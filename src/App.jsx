import { RouterProvider } from "react-router-dom";
import router from "./routes/AppRouter";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { OrdersProvider } from "./context/OrdersContext";
import { ComplaintsProvider } from "./context/ComplaintsContext";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <OrdersProvider>
          <ComplaintsProvider>
            <RouterProvider router={router} />
          </ComplaintsProvider>
        </OrdersProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
