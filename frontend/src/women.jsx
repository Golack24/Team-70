import { useEffect, useState } from "react";
import "./women.css";
import Navbar from "./navbar";
import Footer from "./footer";
import womenImage from "./assets/women-gymshark.png";
import { fetchProducts } from "./api";
import Navbar from "./navbar";
import Footer from "./footer";
// Local fallback so the Women page still shows products when the API has no data yet.
const fallbackProducts = [
  {
    id: 1,
    name: "Aurora Ceramic Mug",
    price: 14.99,
    stock: 120,
    description: "Hand-glazed ceramic mug with a matte exterior and glossy interior.",
    image: "images/mugs/aurora.jpg",
    category_name: "Drinkware",
    category_id: 1,
  },
  {
    id: 2,
    name: "Summit Insulated Bottle",
    price: 29.5,
    stock: 80,
    description: "18oz double-wall stainless steel bottle; keeps drinks cold for 24h.",
    image: "images/bottles/summit.jpg",
    category_name: "Drinkware",
    category_id: 1,
  },
  {
    id: 3,
    name: "Willow Notebook A5",
    price: 11.25,
    stock: 200,
    description: "160-page dotted A5 notebook with lay-flat binding and recycled paper.",
    image: "images/stationery/willow.jpg",
    category_name: "Stationery",
    category_id: 2,
  },
  {
    id: 4,
    name: "Atlas Mechanical Pencil",
    price: 9.95,
    stock: 150,
    description: "0.5mm mechanical pencil, knurled grip, refillable lead chamber.",
    image: "images/stationery/atlas.jpg",
    category_name: "Stationery",
    category_id: 2,
  },
  {
    id: 5,
    name: "Harbor Linen Tote",
    price: 24.0,
    stock: 90,
    description: "Heavyweight linen tote with inner pocket and reinforced straps.",
    image: "images/bags/harbor.jpg",
    category_name: "Bags",
    category_id: 3,
  },
  {
    id: 6,
    name: "Ember Desk Lamp",
    price: 64.0,
    stock: 35,
    description: "Adjustable LED desk lamp with warm/cool modes and USB-C power.",
    image: "images/lighting/ember.jpg",
    category_name: "Lighting",
    category_id: 4,
  },
  {
    id: 7,
    name: "Cinder Soy Candle",
    price: 18.0,
    stock: 110,
    description: "8oz soy candle, cedarwood and vetiver scent, cotton wick.",
    image: "images/home/cinder.jpg",
    category_name: "Home",
    category_id: 4,
  },
  {
    id: 8,
    name: "Grove Throw Blanket",
    price: 58.0,
    stock: 40,
    description: "Woven cotton throw with herringbone pattern and fringe edges.",
    image: "images/home/grove.jpg",
    category_name: "Home",
    category_id: 5,
  },
  {
    id: 9,
    name: "Trail Wireless Earbuds",
    price: 79.0,
    stock: 55,
    description: "IPX5 wireless earbuds with 8h playtime and compact charging case.",
    image: "images/electronics/trail.jpg",
    category_name: "Electronics",
    category_id: 6,
  },
  {
    id: 10,
    name: "Horizon Wall Clock",
    price: 42.0,
    stock: 25,
    description: "Minimal wall clock with silent sweep movement and brushed metal frame.",
    image: "images/home/horizon.jpg",
    category_name: "Home",
    category_id: 5,
  },
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

const formatPrice = (value) => {
  if (value === undefined || value === null || Number.isNaN(Number(value))) {
    return "£--";
  }
  const num = Number(value);
  return `£${num % 1 === 0 ? num.toFixed(0) : num.toFixed(2)}`;
};

export default function WomenPage({ onNavigate }) {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const payload = await fetchProducts({ limit: 24, tag: "women" });
        const data = payload?.data || [];
        if (cancelled) return;
        if (data.length) {
          setProducts(data);
          setError(null);
        } else {
          setProducts(fallbackProducts);
          setError(null);
        }
      } catch (err) {
        if (cancelled) return;
        setError(err?.message || "Failed to load products");
        setProducts(fallbackProducts);
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
      <main className="women-page">
        <section className="women-header">
          <h1 className="women-title">Women</h1>
          <p className="women-subtitle">
            Oversized silhouettes built for training. Engineered fabrics, strong seams, zero distractions.
          </p>
          {error && (
            <p className="women-error">Unable to load live products. Showing featured picks.</p>
          )}
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
            <div className="women-grid">
              {products.map((product, idx) => (
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
                    style={{ backgroundImage: `url(${product.image || womenImage})` }}
                    aria-hidden="true"
                  />
                  <div className="women-info">
                    <h3 className="women-name">{product.name}</h3>
                    <p className="women-color">{product.color || product.category_name || "Metric"}</p>
                    <p className="women-price">{formatPrice(product.price)}</p>
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
