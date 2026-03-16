import { useState } from "react";
import "./accessories.css";
import accessoryImage from "./assets/accessory.png";

export default function AccessoriesPage() {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const products = [
    { name: "Lifting Straps", color: "Black", price: "£15" },
    { name: "Wrist Wraps", color: "Black", price: "£18" },
    { name: "Performance Cap", color: "Black", price: "£20" },
    { name: "Gym Towel", color: "Grey", price: "£12" },
    { name: "Water Bottle", color: "Black", price: "£14" },
    { name: "Training Socks", color: "White", price: "£10" },
    { name: "Logo Beanie", color: "Black", price: "£16" },
    { name: "Grip Gloves", color: "Black", price: "£22" },
    { name: "Performance Belt", color: "Black", price: "£30" },
    { name: "Duffel Bag", color: "Black", price: "£45" },
    { name: "Crossbody Bag", color: "Black", price: "£28" },
    { name: "Phone Armband", color: "Black", price: "£13" },
    { name: "Shaker Bottle", color: "Black", price: "£12" },
    { name: "Headband", color: "Black", price: "£9" },
    { name: "Calf Sleeves", color: "Black", price: "£18" },
  ];

  const filterGroups = [
    { title: "Category", options: ["Bags", "Supports", "Hydration", "Headwear", "Training"] },
    { title: "Colour", options: ["Black", "Grey", "White"] },
    { title: "Price", options: ["Under £15", "£15 - £30", "£30+"] },
    { title: "Material", options: ["Cotton", "Poly Blend", "Neoprene", "Leather"] },
  ];

  return (
    <main className="accessories-page">
      <header className="accessories-header">
        <h1 className="accessories-title">Accessories</h1>
        <p className="accessories-subtitle">
          Training essentials to support every session. Durable, functional, and
          ready for daily use.
        </p>
      </header>

      <button
        className="accessories-filters-toggle"
        type="button"
        onClick={() => setMobileFiltersOpen((v) => !v)}
      >
        {mobileFiltersOpen ? "Hide Filters" : "Show Filters"}
      </button>

      <div className="accessories-layout">
        <aside
          className={`accessories-filters ${mobileFiltersOpen ? "open" : ""}`}
        >
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

        <section className="accessories-content">
          <div className="accessories-grid">
            {products.map((product) => (
              <article className="accessories-card" key={product.name}>
                <div
                  className="accessories-image"
                  style={{ backgroundImage: `url(${accessoryImage})` }}
                  aria-label={product.name}
                />
                <div className="accessories-info">
                  <h3 className="accessories-name">{product.name}</h3>
                  <p className="accessories-color">{product.color}</p>
                  <p className="accessories-price">{product.price}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}