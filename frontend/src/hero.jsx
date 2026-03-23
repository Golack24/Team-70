import { useEffect, useState } from "react";
import "./hero.css";
import heroAthlete from "./assets/hero-athlete.png";
import gymsharkImage from "./assets/gymshark.png";
import womenImage from "./assets/women-gymshark.png";
import accessoryImage from "./assets/accessory.png";
import deliveryIcon from "./assets/deliveryicon.png";
import chatIcon from "./assets/chaticon.png";
import returnIcon from "./assets/returnicon.png";
import { fetchProducts } from "./api";

const categories = [
  { title: "Womens", image: womenImage, route: "women" },
  { title: "Mens", image: gymsharkImage, route: "men" },
  { title: "Accessories", image: accessoryImage, route: "accessories" },
];

const benefits = [
  {
    icon: deliveryIcon,
    title: "Free nationwide shipping",
    description:
      "Enjoy free nationwide shipping on every order with delivery arriving in 5 days or less, guaranteed.",
  },
  {
    icon: chatIcon,
    title: "24/7 support team",
    description:
      "Reach us anytime for fit guidance, shipping updates, or order help—real people, always on.",
  },
  {
    icon: returnIcon,
    title: "30 day returns",
    description:
      "Not right? Send it back within 30 days in original condition for a quick refund or exchange.",
  },
];

const formatPrice = (value) => {
  if (value === undefined || value === null || Number.isNaN(Number(value))) {
    return "£--";
  }
  const num = Number(value);
  return `£${num % 1 === 0 ? num.toFixed(0) : num.toFixed(2)}`;
};

export default function Hero({ onNavigate }) {
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const payload = await fetchProducts({ limit: 5 });
        const data = payload?.data || [];
        if (!cancelled) {
          setItems(data.slice(0, 5));
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setItems([]);
          setError(err?.message || "Unable to load products");
        }
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleClickProduct = (product) => {
    if (onNavigate)
      onNavigate({ name: "product", productId: product.id, product });
  };

  return (
    <>
      <section className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">metric</h1>
            <h2 className="hero-subtitle">measure every move</h2>
            <p className="hero-description">
              High-performance gymwear designed to optimise every rep, every
              session.
            </p>

            <button className="hero-button" onClick={() => onNavigate("men")}>
              shop now
            </button>
            {/* This can be removed or replaced with a proper admin link */}
            <button
              className="hero-button"
              style={{ marginTop: "0.5rem", background: "#222", color: "#fff" }}
              onClick={() => onNavigate("admin")}
            >
              Admin Dashboard
            </button>
          </div>

          <div className="hero-image-wrapper">
            <img
              src={heroAthlete}
              alt="Athlete holding a weight"
              className="hero-main-image"
            />
          </div>
        </div>
      </section>

      <div className="hero-promo-bar">
        <span className="hero-promo-text">shop oversized shirts</span>
      </div>

      <section className="product-gallery">
        {error && (
          <p className="hero-error">Could not load products. {error}</p>
        )}

        {!items.length && !error && (
          <p className="hero-empty">New drops coming soon.</p>
        )}

        {!!items.length && (
          <div className="product-grid">
            {items.map((item, idx) => (
              <button
                type="button"
                className="product-card"
                key={`${item.id || idx}-${item.name}`}
                onClick={() => handleClickProduct(item)}
              >
                <div
                  className="product-image"
                  style={{
                    backgroundImage: `url(${
                      item.image ? item.image : gymsharkImage
                    })`,
                  }}
                />
                <div className="product-info">
                  <h3 className="product-title">{item.name}</h3>
                  <p className="product-color">
                    {item.color || item.category_name || "Metric"}
                  </p>
                  <p className="product-price">
                    {formatPrice(item.price ?? item.amount)}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </section>

      <section className="categories-section">
        <h2 className="categories-heading">Categories</h2>
        <div className="categories-grid">
          {categories.map((cat) => (
            <div
              className="category-card"
              key={cat.title}
              style={{ backgroundImage: `url(${cat.image})` }}
            >
              <div className="category-overlay" />

              <div className="category-content">
                <span className="category-title">{cat.title}</span>

                <button
                  className="category-button"
                  onClick={() => onNavigate(cat.route)}
                >
                  Shop Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="benefits-section">
        <div className="benefits-grid">
          {benefits.map((item) => (
            <div className="benefit-card" key={item.title}>
              <div
                className="benefit-icon"
                style={{ backgroundImage: `url(${item.icon})` }}
              />
              <h3 className="benefit-title">{item.title}</h3>
              <p className="benefit-description">{item.description}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
