import { useEffect, useState } from "react";
import "./checkout.css";
import Navbar from "./navbar";
import Footer from "./footer";

  // Fetch basket + product details
  useEffect(() => {
    async function loadBasket() {
      try {
        const basketRes = await fetch("https://cs2410-web01pvm.aston.ac.uk/~cs2team70/api/index.php?resource=basket", {
          credentials: "include",
        });
        const basket = await basketRes.json();

        // Fetch product info for each basket item
        const detailed = await Promise.all(
          basket.map(async (b) => {
            const productRes = await fetch(
              `https://cs2410-web01pvm.aston.ac.uk/~cs2team70/api/index.php?resource=products&id=${b.product_id}`
            );
            const product = await productRes.json();
            return { ...b, product };
          })
        );

        setItems(detailed);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadBasket();
  }, []);

  // Update quantity
  async function updateQty(id, qty) {
    if (qty < 1) return;

    await fetch(
      `https://cs2410-web01pvm.aston.ac.uk/~cs2team70/api/index.php?resource=basket&id=${id}`,
      {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: qty }),
      }
    );

    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity: qty } : i))
    );
  }

  // Delete item
  async function removeItem(id) {
    await fetch(
      `https://cs2410-web01pvm.aston.ac.uk/~cs2team70/api/index.php?resource=basket&id=${id}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );

    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  // Prices
  const subtotal = items.reduce(
    (sum, item) => sum + item.quantity * parseFloat(item.product.price),
    0
  );
  const total = subtotal - discountAmount;

  if (loading) return <div className="checkout-loading">Loading checkout…</div>;
const formatPrice = (value) => {
  if (value === undefined || value === null || Number.isNaN(Number(value))) return "£--";
  const num = Number(value);
  return `£${num % 1 === 0 ? num.toFixed(0) : num.toFixed(2)}`;
};

export default function CheckoutPage({ onNavigate, cart = [], onUpdateQty, onRemove }) {
  const subtotal = cart.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);
  const shipping = 0;
  const total = subtotal + shipping;

  return (
    <>
      <div className="top-promo-bar">
        <span className="top-promo-text">10% OFF WITH CODE 'METRIC'</span>
      </div>

      <Navbar onNavigate={onNavigate} />

      <main className="checkout-page">
        <section className="checkout-left">
          <h1 className="checkout-title">Checkout</h1>
          <p className="checkout-subtitle">Secure your essentials in under a minute.</p>

          {items.length === 0 && (
            <p className="empty-cart">Your cart is empty.</p>
          )}

          {items.map((item) => (
            <div key={item.id} className="checkout-item">
              <div className="item-info">
                <h3 className="item-name">{item.product.name}</h3>
                <p className="item-color">£{item.product.price}</p>
                <button className="remove-btn" onClick={() => removeItem(item.id)}>
                  Remove
                </button>
              </div>

              {/* Quantity selector */}
              <div className="qty-box">
                <button onClick={() => updateQty(item.id, item.quantity - 1)}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => updateQty(item.id, item.quantity + 1)}>+</button>
              </div>
            </div>
          ))}
        </section>

        {/* RIGHT SIDE — ORDER SUMMARY */}
        <aside className="checkout-right">
          <h2 className="summary-title">Order Summary</h2>

          <div className="summary-line">
            <span>Subtotal</span>
            <span>£{subtotal.toFixed(2)}</span>
          </div>

          <div className="summary-line">
            <span>Shipping</span>
            <span>FREE</span>
          </div>

          <div className="discount-section">
            <label>Discount Code</label>
            <input
              type="text"
              value={discountCode}
              placeholder="Enter code"
              onChange={(e) => setDiscountCode(e.target.value)}
            />
            <button className="apply-btn">Apply</button>
          </div>

          {discountAmount > 0 && (
            <div className="summary-line">
              <span>Discount</span>
              <span>-£{discountAmount.toFixed(2)}</span>
            </div>
          )}

          <hr />

          <div className="summary-total">
            <span>Total</span>
            <span>£{total.toFixed(2)}</span>
          </div>

          <button className="checkout-btn">Place Order</button>
        </aside>
      </main>

      <Footer />
    </>
  );
}
        <span className="top-promo-text">Free shipping on all orders today</span>
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
            <button className="ghost-link" type="button" onClick={() => onNavigate?.("home")}>
              Continue shopping →
            </button>
          </div>

          <div className="checkout-grid">
            <div className="cart-panel">
              {cart.length === 0 && (
                <div className="cart-empty">
                  <p>Your cart is empty.</p>
                  <button type="button" className="primary-btn" onClick={() => onNavigate?.("men")}>
                    Start shopping
                  </button>
                </div>
              )}

              {cart.map((item) => (
                <article className="cart-item" key={`${item.id}-${item.variant || "base"}`}>
                  <div
                    className="cart-thumb"
                    style={{ backgroundImage: `url(${item.image || ""})` }}
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
                      {item.category_name || "Gymwear"} {item.size ? ` · Size ${item.size}` : ""}
                    </p>
                    <div className="cart-actions">
                      <button type="button" className="pill" onClick={() => onRemove?.(item.id)}>
                        Remove
                      </button>
                      <div className="qty">
                        <button
                          type="button"
                          onClick={() => onUpdateQty?.(item.id, (item.quantity || 1) - 1)}
                          aria-label="Decrease quantity"
                        >
                          -
                        </button>
                        <span>{item.quantity || 1}</span>
                        <button
                          type="button"
                          onClick={() => onUpdateQty?.(item.id, (item.quantity || 1) + 1)}
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

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
              </div>

              <div className="form-section">
                <div className="section-head">
                  <p className="eyebrow">Shipping</p>
                  <h3>Address details</h3>
                </div>
                <div className="checkout-form">
                  <label>
                    <span className="label-row">
                      <span>Full name</span>
                      <span className="required">*</span>
                    </span>
                    <input type="text" placeholder="Aisha Khan" required />
                  </label>
                  <label>
                    <span className="label-row">
                      <span>Email</span>
                      <span className="required">*</span>
                    </span>
                    <input type="email" placeholder="you@example.com" required />
                  </label>
                  <label>
                    <span className="label-row">
                      <span>Street address</span>
                      <span className="required">*</span>
                    </span>
                    <input type="text" placeholder="123 Metric Lane" required />
                  </label>
                  <label className="split even">
                    <span>
                      <span className="label-row">
                        <span>House / Apt</span>
                        <span className="required">*</span>
                      </span>
                      <input type="text" placeholder="18B" required />
                    </span>
                    <span>
                      <span className="label-row">
                        <span>City</span>
                        <span className="required">*</span>
                      </span>
                      <input type="text" placeholder="London" required />
                    </span>
                  </label>
                </div>
              </div>

              <div className="form-section">
                <div className="section-head">
                  <p className="eyebrow">Payment</p>
                  <h3>Card details</h3>
                </div>
                <div className="checkout-form">
                  <label className="split">
                    <span>
                      <span className="label-row">
                        <span>Card</span>
                        <span className="required">*</span>
                      </span>
                      <input type="text" placeholder="1234 5678 9012 3456" required />
                    </span>
                    <span>
                      <span className="label-row">
                        <span>Expiry</span>
                        <span className="required">*</span>
                      </span>
                      <input type="text" placeholder="MM / YY" required />
                    </span>
                  </label>
                  <label className="split">
                    <span>
                      <span className="label-row">
                        <span>CVC</span>
                        <span className="required">*</span>
                      </span>
                      <input type="text" placeholder="123" required />
                    </span>
                  </label>
                  <label>
                    Discount code
                    <input type="text" placeholder="METRIC10" />
                  </label>
                </div>
              </div>

              <button className="primary-btn" type="button">
                Place order
              </button>
              <p className="fine-print">
                By placing your order, you agree to our terms and privacy policy.
              </p>
            </aside>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
