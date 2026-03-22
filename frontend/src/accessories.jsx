import { useEffect, useState } from "react";
import "./accessories.css";
import accessoryImage from "./assets/accessory.png";
import { fetchProducts } from "./api";
import Navbar from "./Navbar";
import Footer from "./Footer";

const filterGroups = [
  {
    title: "Category",
    options: ["Bags", "Supports", "Hydration", "Headwear", "Training"],
  },
  {
    title: "Colour",
    options: ["Black", "Grey", "White"],
  },
  {
    title: "Price",
    options: ["Under £15", "£15 - £30", "£30+"],
  },
];

const formatPrice = (value) => {
  if (value === undefined || value === null || Number.isNaN(Number(value))) {
    return "£--";
  }
  const num = Number(value);
  return `£${num % 1 === 0 ? num.toFixed(0) : num.toFixed(2)}`;
};

export default function AccessoriesPage() {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const payload = await fetchProducts({ limit: 24 });
        const data = payload?.data || [];
        if (!cancelled && data.length) {
          setProducts(data);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err?.message || "Failed to load products");
        }
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <div className="top-promo-bar">
        <span className="top-promo-text">10% OFF WITH CODE 'METRIC'</span>
      </div>
      <Navbar onNavigate={onNavigate} />
      <main className="accessories-page">
        <section className="accessories-header">
          <h1 className="accessories-title">Accessories</h1>
          <p className="accessories-subtitle">
            Support pieces engineered for training—built to last and keep you moving.
          </p>
          {error && (
            <p className="accessories-error">Unable to load live products. Showing featured picks.</p>
          )}
        </section>

      <button
        className="accessories-filters-toggle"
        type="button"
        onClick={() => setMobileFiltersOpen((v) => !v)}
      >
        {mobileFiltersOpen ? "Hide Filters" : "Show Filters"}
      </button>

      <div className="accessories-layout">
        <aside className={`accessories-filters ${mobileFiltersOpen ? "open" : ""}`}>
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

          <section className="accessories-products">
            <div className="accessories-grid">
              {products.map((product, idx) => (
                <button
                  type="button"
                  className="accessories-card"
                  key={`${product.id || idx}-${product.name}`}
                  onClick={() =>
                    onNavigate?.({
                      name: "product",
                      productId: product.id,
                      product,
                    })
                  }
                >
                  <div
                    className="accessories-image"
                    style={{ backgroundImage: `url(${product.image || accessoryImage})` }}
                    aria-hidden="true"
                  />
                  <div className="accessories-info">
                    <h3 className="accessories-name">{product.name}</h3>
                    <p className="accessories-color">
                      {product.color || product.category_name || "Metric"}
                    </p>
                    <p className="accessories-price">{formatPrice(product.price)}</p>
                  </div>
                </button>
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}