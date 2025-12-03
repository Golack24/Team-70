import { useState } from "react";
import "./men.css";
import Navbar from "./navbar";
import Footer from "./footer";
import gymsharkImage from "./assets/gymshark.png";

export default function MenPage({ onNavigate }) {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const products = [
    { name: "Performance Oversized Tee", color: "Black", price: "£25" },
    { name: "Training Oversized Tee", color: "Black", price: "£25" },
    { name: "Logo Oversized Tee", color: "Black", price: "£25" },
    { name: "Mesh Oversized Tee", color: "Black", price: "£25" },
    { name: "Essential Oversized Tee", color: "Black", price: "£25" },
    { name: "Raglan Performance Tee", color: "Black", price: "£25" },
    { name: "Heavyweight Oversized Tee", color: "Black", price: "£25" },
    { name: "Seamless Oversized Tee", color: "Black", price: "£25" },
    { name: "Tonal Logo Oversized Tee", color: "Black", price: "£25" },
    { name: "Vent Mesh Oversized Tee", color: "Black", price: "£25" },
    { name: "Drop Shoulder Oversized Tee", color: "Black", price: "£25" },
    { name: "Performance Longline Tee", color: "Black", price: "£25" },
    { name: "Modal Blend Oversized Tee", color: "Black", price: "£25" },
    { name: "Core Essential Tee", color: "Black", price: "£25" },
    { name: "Everyday Oversized Tee", color: "Black", price: "£25" },
  ];

  const filterGroups = [
    {
      title: "Colour",
      options: ["Black", "Grey", "White", "Burgundy", "Teal"],
    },
    {
      title: "Price",
      options: ["Under £25", "£25 - £40", "£40+"],
    },
    {
      title: "Fit",
      options: ["Oversized", "Relaxed", "Regular"],
    },
    {
      title: "Collection",
      options: ["Performance", "Training", "Logo", "Essentials"],
    },
  ];

  return (
    <>
      <div className="top-promo-bar">
        <span className="top-promo-text">10% OFF WITH CODE 'METRIC'</span>
      </div>
      <Navbar onNavigate={onNavigate} />
      <main className="men-page">
        <section className="men-header">
          <h1 className="men-title">Men</h1>
          <p className="men-subtitle">
            Oversized silhouettes built for training. Engineered fabrics, strong seams, zero distractions.
          </p>
        </section>

        <button
          className="men-filters-toggle"
          type="button"
          onClick={() => setMobileFiltersOpen((v) => !v)}
        >
          {mobileFiltersOpen ? "Hide Filters" : "Show Filters"}
        </button>

        <div className="men-layout">
          <aside className={`men-filters ${mobileFiltersOpen ? "open" : ""}`}>
            <h2 className="filters-title">Filter</h2>
            {filterGroups.map((group) => (
              <div className="filter-group" key={group.title}>
                <h3 className="filter-heading">{group.title}</h3>
                <div className="filter-options">
                  {group.options.map((opt) => (
                    <button key={opt} className="filter-chip" type="button">
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </aside>

          <div className="men-content">
            <section className="men-grid">
              {products.map((product) => (
                <article className="men-card" key={product.name}>
                  <div
                    className="men-image"
                    style={{ backgroundImage: `url(${gymsharkImage})` }}
                    aria-hidden="true"
                  />
                  <div className="men-info">
                    <h3 className="men-name">{product.name}</h3>
                    <p className="men-color">{product.color}</p>
                    <p className="men-price">{product.price}</p>
                  </div>
                </article>
              ))}
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
