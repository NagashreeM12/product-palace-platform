
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import VendorDashboard from "./pages/vendor/Dashboard";
import VendorProducts from "./pages/vendor/Products";
import VendorOrders from "./pages/vendor/Orders";
import VendorAnalytics from "./pages/vendor/Analytics";
import VendorProductForm from "./pages/vendor/ProductForm";
import CustomerOrders from "./pages/customer/Orders";
import CustomerAccount from "./pages/customer/Account";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import OrderSuccess from "./pages/OrderSuccess";
import { ProductsProvider } from "./contexts/ProductsContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ProductsProvider>
        <AuthProvider>
          <CartProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Layout />}>
                  <Route index element={<Home />} />
                  <Route path="product/:id" element={<ProductDetail />} />
                  <Route path="cart" element={<Cart />} />
                  <Route path="checkout" element={<Checkout />} />
                  <Route path="success" element={<OrderSuccess />} />
                  <Route path="account/orders" element={<CustomerOrders />} />
                  <Route path="account" element={<CustomerAccount />} />
                  <Route path="vendor/dashboard" element={<VendorDashboard />} />
                  <Route path="vendor/products" element={<VendorProducts />} />
                  <Route path="vendor/products/new" element={<VendorProductForm />} />
                  <Route path="vendor/products/edit/:id" element={<VendorProductForm />} />
                  <Route path="vendor/orders" element={<VendorOrders />} />
                  <Route path="vendor/analytics" element={<VendorAnalytics />} />
                </Route>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </CartProvider>
        </AuthProvider>
      </ProductsProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
