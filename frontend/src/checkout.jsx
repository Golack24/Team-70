import { useState } from "react";
import "./checkout.css";
import Navbar from "./navbar";
import Footer from "./footer";

const formatPrice = (value) => {
  if (value === undefined || value === null || Number.isNaN(Number(value)))
    return "£--";
  const num = Number(value);
  return `£${num % 1 === 0 ? num.toFixed(0) : num.toFixed(2)}`;
};

export default function CheckoutPage({
  onNavigate,
  cart = [],
  onUpdateQty,
  onRemove,
}) {
  const [discountCode, setDiscountCode] = useState("");
  const subtotal = cart.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
    0,
  );

  const shipping = 0;
  const total = subtotal + shipping;

  return (
    <>
      <div className="top-promo-bar">
        <span className="top-promo-text">
          Free shipping on all orders today
        </span>
      </div>

      <Navbar onNavigate={onNavigate} />

      <main className="checkout-page">
        <section className="checkout-wrapper">
          <div className="checkout-header">
            <div>
              <p className="eyebrow">Cart</p>
              <h1>Checkout</h1>
              <p className="lede">Secure your essentials in under a minute.</p>
            </div>

            <button
              className="ghost-link"
              type="button"
              onClick={() => onNavigate?.("home")}
            >
              Continue shopping →
            </button>
          </div>

          <div className="checkout-grid">
            {/* LEFT SIDE — CART */}
            <div className="cart-panel">
              {cart.length === 0 && (
                <div className="cart-empty">
                  <p>Your cart is empty.</p>
                  <button
                    type="button"
                    className="primary-btn"
                    onClick={() => onNavigate?.("men")}
                  >
                    Start shopping
                  </button>
                </div>
              )}

              {cart.map((item) => (
                <article
                  className="cart-item"
                  key={`${item.id}-${item.variant || "base"}`}
                >
                  <div
                    className="cart-thumb"
                    style={{
                      backgroundImage: `url(${item.image || ""})`,
                    }}
                    aria-hidden="true"
                  />

                  <div className="cart-meta">
                    <div className="cart-line">
                      <h3>{item.name}</h3>
                      <span className="price">
                        {formatPrice((item.price || 0) * (item.quantity || 1))}
                      </span>
                    </div>

                    <p className="muted">
                      {item.category_name || "Gymwear"}
                      {item.size ? ` · Size ${item.size}` : ""}
                    </p>

                    <div className="cart-actions">
                      <button
                        type="button"
                        className="pill"
                        onClick={() => onRemove?.(item.id)}
                      >
                        Remove
                      </button>

                      <div className="qty">
                        <button
                          type="button"
                          onClick={() =>
                            onUpdateQty?.(item.id, (item.quantity || 1) - 1)
                          }
                        >
                          -
                        </button>

                        <span>{item.quantity || 1}</span>

                        <button
                          type="button"
                          onClick={() =>
                            onUpdateQty?.(item.id, (item.quantity || 1) + 1)
                          }
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* RIGHT SIDE — SUMMARY */}
            <aside className="summary-panel">
              <h2>Order summary</h2>

              <div className="summary-rows">
                <div className="row">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>

                <div className="row">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
                </div>

                <div className="row total">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <div className="discount-section">
                  <label>Discount Code</label>
                  <input
                    type="text"
                    value={discountCode}
                    placeholder="Enter code"
                    onChange={(e) => setDiscountCode(e.target.value)}
                  />
                </div>
                <div className="discount-section">
                  <label>Discount Code</label>
                  <input
                    type="text"
                    value={discountCode}
                    placeholder="Enter code"
                    onChange={(e) => setDiscountCode(e.target.value)}
                  />
                </div>
              </div>

              <button className="primary-btn" type="button">
                Place order
              </button>
            </aside>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
