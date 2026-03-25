import { useEffect, useState, useMemo } from "react";
import "./men.css";
import Navbar from "./navbar";
import Footer from "./footer";
import gymsharkImage from "./assets/gymshark.png";
import { fetchProducts } from "./api";
import beltImg from "./assets/belt.jpg";
import glovesImg from "./assets/gloves.jpg";
import hoodieImg from "./assets/hoodie.jpg";
import pantsImg from "./assets/pants.jpg";
import shortsImg from "./assets/shorts.jpg";


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

const getProductImage = (product) => {
  const name = (product?.name || "").toLowerCase();

  if (name.includes("belt")) return beltImg;
  if (name.includes("glove")) return glovesImg;
  if (name.includes("hoodie")) return hoodieImg;
  if (name.includes("pant")) return pantsImg;
  if (name.includes("short")) return shortsImg;

};

const resolveImage = (image) => {
  if (!image) return gymsharkImage;
  if (image.startsWith("http://") || image.startsWith("https://")) return image;
  if (image.startsWith("/")) return image;
  if (image.startsWith("images/")) return `/${image}`;
  return image;
};

export default function MenPage({ onNavigate }) {
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

      console.log("MEN PAGE API DATA:", data);

     
    const menProducts = data.filter((product) => {
        const categoryName = String(
        product.category_name || product.category || "" ).trim().toLowerCase();

        const categoryId = Number(product.category_id);

        return categoryName === "men" || categoryId === 1;
    });

      if (!cancelled) {
        setProducts(menProducts);
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

      <main className="men-page">
        <section className="men-header">
          <h1 className="men-title">Men</h1>
          <p className="men-subtitle">
            Oversized silhouettes built for training. Engineered fabrics, strong seams, zero distractions.
          </p>
          {error && <p className="men-error">{error}</p>}
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

          <section className="men-products">
            {loading ? (
              <p>Loading products...</p>
            ) : visibleProducts.length === 0 ? (
              <p className="men-error">No men’s products found.</p>
            ) : (
              <div className="men-grid">
                {visibleProducts.map((product, idx) => (
                  <button
                    type="button"
                    className="men-card"
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
                      className="men-image"
                      style={{ backgroundImage: `url(${getProductImage(product)})` }}
                      aria-hidden="true"
                    />
                    <div className="men-info">
                      <h3 className="men-name">{product.name}</h3>
                      <p className="men-color">{product.category_name || "Men"}</p>
                      <p className="men-price">{formatPrice(product.price)}</p>
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