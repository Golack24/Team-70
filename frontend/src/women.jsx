import { useEffect, useState, useMemo } from "react";
import "./women.css";
import Navbar from "./navbar";
import Footer from "./footer";
import womenImage from "./assets/women-gymshark.png";
import { fetchProducts } from "./api";

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

const formatPrice = (value) => {
  if (value === undefined || value === null || Number.isNaN(Number(value))) {
    return "£--";
  }
  const num = Number(value);
  return `£${num % 1 === 0 ? num.toFixed(0) : num.toFixed(2)}`;
};

const resolveImage = (image) => {
  if (!image) return womenImage;
  if (image.startsWith("http://") || image.startsWith("https://")) return image;
  if (image.startsWith("/")) return image;
  if (image.startsWith("images/")) return `/${image}`;
  return image;
};

export default function WomenPage({ onNavigate }) {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        const payload = await fetchProducts({ limit: 100 });
        const data = payload?.data || [];

        const womenProducts = data.filter((product) => {
          const category = String(product.category_name || "").toLowerCase();
          return category === "women" || Number(product.category_id) === 2;
        });

        if (!cancelled) {
          setProducts(womenProducts);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err?.message || "Failed to load products");
          setProducts([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  const visibleProducts = useMemo(() => products, [products]);

  return (
    <>
      <div className="top-promo-bar">
        <span className="top-promo-text">10% OFF WITH CODE 'METRIC'</span>
      </div>

      <Navbar onNavigate={onNavigate} />

      <main className="women-page">
        <section className="women-header">
          <h1 className="women-title">Women</h1>
          <p className="women-subtitle">
            Oversized silhouettes built for training. Engineered fabrics, strong seams, zero distractions.
          </p>
          {error && <p className="women-error">{error}</p>}
        </section>

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

          <section className="women-products">
            {loading ? (
              <p>Loading products...</p>
            ) : visibleProducts.length === 0 ? (
              <p className="women-error">No women’s products found.</p>
            ) : (
              <div className="women-grid">
                {visibleProducts.map((product, idx) => (
                  <button
                    type="button"
                    className="women-card"
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
                      className="women-image"
                      style={{ backgroundImage: `url(${resolveImage(product.image)})` }}
                      aria-hidden="true"
                    />
                    <div className="women-info">
                      <h3 className="women-name">{product.name}</h3>
                      <p className="women-color">{product.category_name || "Women"}</p>
                      <p className="women-price">{formatPrice(product.price)}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}