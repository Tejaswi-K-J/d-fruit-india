import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import { Toaster } from "react-hot-toast";

import Navbar from "./components/common/Navbar";
import Footer from "./components/footer/Footer";
import ErrorBoundary from "./components/common/ErrorBoundary";

import Home from "./pages/Home";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";

function App() {
  const [showCategories, setShowCategories] = useState(false);
  const toggleCategories = () => setShowCategories((prev) => !prev);

  return (
    <BrowserRouter>
      <Navbar onToggleCategories={toggleCategories} />

      <ErrorBoundary>
        <Routes>
          <Route path="/"         element={<Home showCategories={showCategories} />} />
          <Route path="/products" element={<Home showCategories={showCategories} />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart"     element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/about"    element={<About />} />
          <Route path="/contact"  element={<Contact />} />
          <Route path="/success"  element={<OrderSuccess />} />
        </Routes>
      </ErrorBoundary>

      <Footer />

      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            fontFamily: "var(--font-body)",
            fontSize: "14px",
            borderRadius: "10px",
            background: "var(--ink)",
            color: "#fff",
          },
          success: {
            iconTheme: { primary: "#40916C", secondary: "#fff" },
          },
          error: {
            iconTheme: { primary: "#C0392B", secondary: "#fff" },
          },
        }}
      />
    </BrowserRouter>
  );
}

export default App;