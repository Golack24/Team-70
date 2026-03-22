import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Navbar from "./navbar";
import Hero from "./hero";
import Footer from "./footer";
import AboutPage from "./about";
import ContactPage from "./contact";
import MenPage from "./men";
import WomenPage from "./women";
import AccessoriesPage from "./accessories";
import SignupPage from "./signup";
import LoginPage from "./login";
import CheckoutPage from "./checkout";
import ProductPage from "./product";
import { logoutUser } from "./api";

const PromoBar = () => (
  <div className="top-promo-bar">
    <span className="top-promo-text">10% OFF WITH CODE 'METRIC'</span>
  </div>
);

function App() {
  const [page, setPage] = useState({ name: "home" });
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("metric_user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [cart, setCart] = useState(() => {
    try {
      const stored = localStorage.getItem("metric_cart");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("metric_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("metric_user");
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem("metric_cart", JSON.stringify(cart));
  }, [cart]);

  const handleNavigate = (next) => {
    if (typeof next === "string") {
      setPage({ name: next });
    } else if (next && typeof next === "object") {
      setPage(next);
    }
  };

  const handleAuthSuccess = (userPayload) => {
    setUser(userPayload || null);
    setPage({ name: "home" });
  };

  const addToCart = (product, quantity = 1) => {
    if (!product?.id) return;
    setCart((prev) => {
      const existing = prev.find((p) => p.id === product.id);
      if (existing) {
        return prev.map((p) =>
          p.id === product.id
            ? { ...p, quantity: (p.quantity || 1) + quantity }
            : p,
        );
      }
      const base = {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category_name: product.category_name,
      };
      return [...prev, { ...base, quantity }];
    });
  };

  const updateQty = (productId, nextQty) => {
    setCart((prev) =>
      prev
        .map((p) =>
          p.id === productId
            ? {
                ...p,
                quantity: Math.max(
                  1,
                  Number.isNaN(Number(nextQty)) ? 1 : nextQty,
                ),
              }
            : p,
        )
        .filter((p) => p.quantity > 0),
    );
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((p) => p.id !== productId));
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      // ignore logout failures so UI can still proceed
    } finally {
      setUser(null);
      setPage({ name: "home" });
    }
  };

  if (page.name === "about") {
    return (
      <StrictMode>
        <AboutPage onNavigate={handleNavigate} />
      </StrictMode>
    );
  }

  if (page.name === "contact") {
    return (
      <StrictMode>
        <ContactPage onNavigate={handleNavigate} />
      </StrictMode>
    );
  }

  if (page.name === "signup") {
    return (
      <StrictMode>
        <SignupPage onNavigate={handleNavigate} onAuth={handleAuthSuccess} />
      </StrictMode>
    );
  }

  if (page.name === "login") {
    return (
      <StrictMode>
        <LoginPage onNavigate={handleNavigate} onAuth={handleAuthSuccess} />
      </StrictMode>
    );
  }

  if (page.name === "accessories") {
    return (
      <StrictMode>
        <AccessoriesPage onNavigate={handleNavigate} />
      </StrictMode>
    );
  }

  if (page.name === "women") {
    return (
      <StrictMode>
        <WomenPage onNavigate={handleNavigate} />
      </StrictMode>
    );
  }

  if (page.name === "men") {
    return (
      <StrictMode>
        <MenPage onNavigate={handleNavigate} />
      </StrictMode>
    );
  }

  if (page.name === "checkout") {
    return (
      <StrictMode>
        <CheckoutPage
          onNavigate={handleNavigate}
          cart={cart}
          onUpdateQty={updateQty}
          onRemove={removeFromCart}
        />
      </StrictMode>
    );
  }

  if (page.name === "product") {
    return (
      <StrictMode>
        <ProductPage
          product={page.product}
          productId={page.productId}
          onNavigate={handleNavigate}
          onAddToCart={addToCart}
        />
      </StrictMode>
    );
  }

  return (
    <StrictMode>
      <PromoBar />
      <Navbar onNavigate={handleNavigate} user={user} onLogout={handleLogout} />
      {/* ALL content must be wrapped inside this div */}
      <div
        style={{
          marginTop:
            "calc(var(--navbar-offset, 140px) + clamp(16px, 6vw, 54px))",
        }}
      >
        <Hero onNavigate={handleNavigate} />
      </div>
      <Footer />
    </StrictMode>
  );
}

createRoot(document.getElementById("root")).render(<App />);
