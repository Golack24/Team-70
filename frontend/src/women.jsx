import { useState } from "react";
import "./women.css";
import womenImage from "./assets/women-gymshark.png";

export default function WomenPage() {
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
    { title: "Colour", options: ["Black", "Grey", "White", "Burgundy", "Teal"] },
    { title: "Price", options: ["Under £25", "£25 - £40", "£40+"] },
    { title: "Fit", options: ["Oversized", "Relaxed", "Regular"] },
    { title: "Collection", options: ["Performance", "Training", "Logo", "Essentials"] },
  ];

  return (
    <main className="women-page">
      <header className="women-header">
        <h1 className="women-title">Women</h1>
        <p className="women-subtitle">
          Powerful fits designed for movement, comfort, and confidence through every session.
        </p>
      </header>

      <button
        className="women-filters-toggle"
        type="button"
        onClick={() => setMobileFiltersOpen((v) => !v)}
      >
        {mobileFiltersOpen ? "Hide Filters" : "Show Filters"}
      </button>

      <div className="women-layout">
        <aside className={`women-filters ${mobileFiltersOpen ? "open" : ""}`}>
          <h2 className="filters-title">Filter</h2>

          {filterGroups.map((group) => (
            <section className="filter-group" key={group.title}>
              <h3 className="filter-heading">{group.title}</h3>
              <div className="filter-options">
                {group.options.map((opt) => (
                  <button className="filter-chip" type="button" key={opt}>
                    {opt}
                  </button>
                ))}
              </div>
            </section>
          ))}
        </aside>

        <section className="women-content">
          <div className="women-grid">
            {products.map((product) => (
              <article className="women-card" key={product.name}>
                <div
                  className="women-image"
                  style={{ backgroundImage: `url(${womenImage})` }}
                  aria-label={product.name}
                />
                <div className="women-info">
                  <h3 className="women-name">{product.name}</h3>
                  <p className="women-color">{product.color}</p>
                  <p className="women-price">{product.price}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}