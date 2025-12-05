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
    "Black printed oversized t-shirt",
    "Black printed oversized t-shirt",
    "Black printed oversized t-shirt",
    "Black printed oversized t-shirt",
    "Black printed oversized t-shirt",
  ];

  const categories = [
    { title: "Womens", image: womenImage },
    { title: "Mens", image: gymsharkImage },
    { title: "Accessories", image: accessoryImage },
  ];

  const benefits = [
    {
      icon: deliveryIcon,
      title: "Free nationwide shipping",
      description:
        "Enjoy free nationwide shipping on every order — with delivery arriving in 5 days or less, guaranteed.",
    },
    {
      icon: chatIcon,
      title: "24/7 support team",
      description:
        "Enjoy free nationwide shipping on every order — with delivery arriving in 5 days or less, guaranteed.",
    },
    {
      icon: returnIcon,
      title: "30 day returns",
      description:
        "Enjoy free nationwide shipping on every order — with delivery arriving in 5 days or less, guaranteed.",
    },
  ];

  return (
    <>
      <section className="hero">
        <div className="hero-content">
          {/* LEFT SIDE TEXT */}
          <div className="hero-text">
            <h1 className="hero-title">metric</h1>
            <h2 className="hero-subtitle">measure every move</h2>
            <p className="hero-description">
              High-performance gymwear designed to optimise every rep, every
              session.
            </p>
            <button className="hero-button">shop now</button>
          </div>

          {/* RIGHT SIDE IMAGE */}
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
        <div className="product-grid">
          {products.map((name, idx) => (
            <div className="product-card" key={`${name}-${idx}`}>
              <div
                className="product-image"
                style={{ backgroundImage: `url(${gymsharkImage})` }}
                aria-hidden="true"
              />
              <div className="product-info">
                <h3 className="product-title">{name}</h3>
                <p className="product-color">Black</p>
                <p className="product-price">£25</p>
              </div>
            </div>
          ))}
        </div>
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
                <button className="category-button">Shop Now</button>
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
                aria-hidden="true"
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
