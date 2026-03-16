import "./hero.css";
import heroAthlete from "./assets/hero-athlete.png";
import gymsharkImage from "./assets/gymshark.png";
import womenImage from "./assets/women-gymshark.png";
import accessoryImage from "./assets/accessory.png";
import deliveryIcon from "./assets/deliveryicon.png";
import chatIcon from "./assets/chaticon.png";
import returnIcon from "./assets/returnicon.png";

export default function Hero() {
  const products = [
    { name: "Black Printed Oversized T-Shirt", image: gymsharkImage, color: "Black", price: "£25" },
    { name: "Training Oversized Tee", image: gymsharkImage, color: "Black", price: "£25" },
    { name: "Performance Oversized Tee", image: gymsharkImage, color: "Black", price: "£25" },
    { name: "Drop Shoulder Tee", image: gymsharkImage, color: "Black", price: "£25" },
    { name: "Core Oversized Tee", image: gymsharkImage, color: "Black", price: "£25" },
  ];

  const categories = [
    { title: "Women", image: womenImage },
    { title: "Men", image: gymsharkImage },
    { title: "Accessories", image: accessoryImage },
  ];

  const benefits = [
    {
      icon: deliveryIcon,
      title: "Free nationwide shipping",
      description:
        "Enjoy free nationwide shipping on every order — with delivery arriving in 5 days or less.",
    },
    {
      icon: chatIcon,
      title: "24/7 support team",
      description:
        "Need help with sizing, orders, or products? Our team is ready whenever you need us.",
    },
    {
      icon: returnIcon,
      title: "30 day returns",
      description:
        "Shop with confidence knowing you can return eligible items within 30 days.",
    },
  ];

  return (
    <>
      <section className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">Metric</h1>
            <h2 className="hero-subtitle">Measure Every Move</h2>
            <p className="hero-description">
              High-performance gymwear designed to optimise every rep, every session.
            </p>
            <button className="hero-button" type="button">
              Shop Now
            </button>
          </div>

          <div className="hero-image-wrapper">
            <img
              src={heroAthlete}
              alt="Athlete wearing Metric gymwear"
              className="hero-main-image"
            />
          </div>
        </div>
      </section>

      <section className="product-gallery">
        <div className="section-heading-row">
          <h2 className="section-heading">Shop Oversized Shirts</h2>
        </div>

        <div className="product-grid">
          {products.map((product) => (
            <article className="product-card" key={product.name}>
              <div
                className="product-image"
                style={{ backgroundImage: `url(${product.image})` }}
                aria-label={product.name}
              />
              <div className="product-info">
                <h3 className="product-title">{product.name}</h3>
                <p className="product-color">{product.color}</p>
                <p className="product-price">{product.price}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="categories-section">
        <h2 className="categories-heading">Categories</h2>
        <div className="categories-grid">
          {categories.map((cat) => (
            <article
              className="category-card"
              key={cat.title}
              style={{ backgroundImage: `url(${cat.image})` }}
            >
              <div className="category-overlay" />
              <div className="category-content">
                <h3 className="category-title">{cat.title}</h3>
                <button className="category-button" type="button">
                  Shop Now
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="benefits-section">
        <div className="benefits-grid">
          {benefits.map((item) => (
            <article className="benefit-card" key={item.title}>
              <div
                className="benefit-icon"
                style={{ backgroundImage: `url(${item.icon})` }}
                aria-label={item.title}
              />
              <h3 className="benefit-title">{item.title}</h3>
              <p className="benefit-description">{item.description}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}