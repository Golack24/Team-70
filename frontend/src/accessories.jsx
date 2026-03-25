import { useEffect, useState, useMemo } from "react";
import "./product.css";
import Navbar from "./navbar";
import Footer from "./footer";
import { fetchProducts } from "./api";

// MEN
import beltImg from "./assets/belt.jpg";
import glovesImg from "./assets/gloves.jpg";
import hoodieImg from "./assets/hoodie.jpg";
import pantsImg from "./assets/pants.jpg";
import shortsImg from "./assets/shorts.jpg";

// WOMEN
import tankImg from "./assets/tank.jpg";
import bikerImg from "./assets/Wshorts.jpg";
import cropHoodieImg from "./assets/crop.jpg";
import teeImg from "./assets/tee.jpg";
import leggingsImg from "./assets/leggings.jpg";
import braImg from "./assets/bra.jpg";

// ACCESSORIES
import duffelImg from "./assets/duffel.jpg";
import kneeImg from "./assets/knee.jpg";
import chalkImg from "./assets/chalk.jpg";
import rollerImg from "./assets/roller.jpg";
import strapsImg from "./assets/straps.jpg";

const formatPrice = (value) => {
  if (value === undefined || value === null || Number.isNaN(Number(value)))
    return "£--";
  const num = Number(value);
  return `£${num % 1 === 0 ? num.toFixed(0) : num.toFixed(2)}`;
};

const getStockValue = (product) => {
  const possibleStock =
    product?.stock ??
    product?.quantity ??
    product?.inventory ??
    product?.stock_quantity ??
    product?.available_stock ??
    product?.count_in_stock;

  if (
    possibleStock === undefined ||
    possibleStock === null ||
    Number.isNaN(Number(possibleStock))
  ) {
    return 0;
  }

  return Math.max(0, Number(possibleStock));
};

// 🔥 IMAGE MAPPER
const getProductImage = (product) => {
  const name = (product?.name || "").toLowerCase();

  // MEN
  if (name.includes("belt")) return beltImg;
  if (name.includes("glove")) return glovesImg;
  if (name.includes("hoodie")) return hoodieImg;
  if (
    name.includes("pant") ||
    name.includes("jogger") ||
    name.includes("track")
  )
    return pantsImg;
  if (name.includes("short")) return shortsImg;

  // WOMEN
  if (name.includes("tank")) return tankImg;
  if (name.includes("biker")) return bikerImg;
  if (name.includes("crop hoodie")) return cropHoodieImg;
  if (name.includes("tee") || name.includes("shirt")) return teeImg;
  if (name.includes("legging")) return leggingsImg;
  if (name.includes("bra")) return braImg;

  // ACCESSORIES
  if (name.includes("duffel") || name.includes("bag")) return duffelImg;
  if (name.includes("knee")) return kneeImg;
  if (name.includes("chalk")) return chalkImg;
  if (name.includes("roller")) return rollerImg;
  if (name.includes("strap")) return strapsImg;

  return hoodieImg; // default
};

export default function ProductPage({
  product,
  productId,
  onNavigate,
  onAddToCart,
}) {
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
        if (!cancelled)
          setError(err?.message || "Could not load product");
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [idToFetch, product]);

  const p = item || product;
  const stock = useMemo(() => getStockValue(p), [p]);

  useEffect(() => {
    if (stock === 0) {
      setQty(1);
      return;
    }

    setQty((currentQty) =>
      Math.min(Math.max(1, currentQty), stock)
    );
  }, [stock]);

  const adjustQty = (delta) => {
    setQty((currentQty) => {
      const nextQty = currentQty + delta;

      if (stock <= 0) return 1;
      if (nextQty < 1) return 1;
      if (nextQty > stock) return stock;

      return nextQty;
    });
  };

  const handleAdd = () => {
    if (!p || stock <= 0) return;
    onAddToCart?.(p, qty);
  };

  const handleContinueShopping = () => {
    const category = (p?.category_name || "").toLowerCase();

    if (category.includes("women")) {
      onNavigate?.("women");
      return;
    }

    if (category.includes("accessor")) {
      onNavigate?.("accessories");
      return;
    }

    onNavigate?.("men");
  };

  return (
    <>
      <div className="top-promo-bar">
        <span className="top-promo-text">
          10% OFF WITH CODE 'METRIC'
        </span>
      </div>

      <Navbar onNavigate={onNavigate} />

      <main className="product-page">
        {!p && (
          <div className="product-blank">
            {error ? (
              <p className="product-error">{error}</p>
            ) : (
              <p>Loading product...</p>
            )}
          </div>
        )}

        {p && (
          <section className="product-wrap">
            {/* 🔥 FIXED IMAGE */}
            <div className="product-gallery">
              <img
                className="product-hero-img"
                src={getProductImage(p)}
                alt={p.name}
              />
            </div>

            <div className="product-details">
              <p className="product-kicker">
                {p.category_name || "Metric Originals"}
              </p>

              <h1 className="product-title">{p.name}</h1>

              <p className="product-price">
                {formatPrice(p.price)}
              </p>

              <p className="product-description">
                {p.description ||
                  "Performance-built essentials engineered for every session."}
              </p>

              <div className="product-qty">
                <span>Quantity</span>

                <div className="qty-box">
                  <button
                    type="button"
                    onClick={() => adjustQty(-1)}
                    disabled={stock <= 0 || qty <= 1}
                  >
                    -
                  </button>

                  <span>{qty}</span>

                  <button
                    type="button"
                    onClick={() => adjustQty(1)}
                    disabled={stock <= 0 || qty >= stock}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="product-actions">
                <button
                  className="primary-btn"
                  onClick={handleAdd}
                  disabled={stock <= 0}
                >
                  {stock <= 0 ? "Out of stock" : "Add to cart"}
                </button>

                <button
                  className="ghost-btn"
                  onClick={handleContinueShopping}
                >
                  Continue shopping
                </button>
              </div>

              <div className="product-meta">
                <div>
                  <p className="meta-label">Stock</p>
                  <p className="meta-value">{stock}</p>
                </div>

                <div>
                  <p className="meta-label">Category</p>
                  <p className="meta-value">
                    {p.category_name || "Uncategorised"}
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer onNavigate={onNavigate} />
    </>
  );
}