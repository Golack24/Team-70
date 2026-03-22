import { useEffect, useState } from "react";
import "./product.css";
import Navbar from "./navbar";
import Footer from "./footer";
import { fetchProducts } from "./api";

const formatPrice = (value) => {
  if (value === undefined || value === null || Number.isNaN(Number(value))) return "£--";
  const num = Number(value);
  return `£${num % 1 === 0 ? num.toFixed(0) : num.toFixed(2)}`;
};

export default function ProductPage({ product, productId, onNavigate, onAddToCart }) {
  const [qty, setQty] = useState(1);
  const [item, setItem] = useState(product || null);
  const [error, setError] = useState(null);
  const idToFetch = productId || product?.id;

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (!idToFetch || product) return;
      try {
        const payload = await fetchProducts({ id: idToFetch });
        if (!cancelled) {
          setItem(payload || null);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) setError(err?.message || "Could not load product");
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [idToFetch, product]);

  const p = item || product;

  const adjustQty = (delta) => {
    setQty((q) => Math.max(1, q + delta));
  };

  const handleAdd = () => {
    if (!p) return;
    onAddToCart?.(p, qty);
  };

  return (
    <>
      <div className="top-promo-bar">
        <span className="top-promo-text">10% OFF WITH CODE 'METRIC'</span>
      </div>
      <Navbar onNavigate={onNavigate} />
      <main className="product-page">
        {!p && (
          <div className="product-blank">
            {error ? <p className="product-error">{error}</p> : <p>Loading product...</p>}
          </div>
        )}

        {p && (
          <section className="product-wrap">
            <div className="product-gallery">
              <div
                className="product-hero-img"
                style={{ backgroundImage: `url(${p.image || ""})` }}
                aria-hidden="true"
              />
            </div>

            <div className="product-details">
              <p className="product-kicker">{p.category_name || "Metric Originals"}</p>
              <h1 className="product-title">{p.name}</h1>
              <p className="product-price">{formatPrice(p.price)}</p>
              <p className="product-description">
                {p.description || "Performance-built essentials engineered for every session."}
              </p>

              <div className="product-qty">
                <span>Quantity</span>
                <div className="qty-box">
                  <button type="button" onClick={() => adjustQty(-1)} aria-label="Decrease quantity">
                    -
                  </button>
                  <span>{qty}</span>
                  <button type="button" onClick={() => adjustQty(1)} aria-label="Increase quantity">
                    +
                  </button>
                </div>
              </div>

              <div className="product-actions">
                <button className="primary-btn" type="button" onClick={handleAdd}>
                  Add to cart
                </button>
                <button className="ghost-btn" type="button" onClick={() => onNavigate?.("men")}>
                  Continue shopping
                </button>
              </div>

              <div className="product-meta">
                <div>
                  <p className="meta-label">Stock</p>
                  <p className="meta-value">{p.stock ?? "—"}</p>
                </div>
                <div>
                  <p className="meta-label">Category</p>
                  <p className="meta-value">{p.category_name || "Uncategorised"}</p>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
