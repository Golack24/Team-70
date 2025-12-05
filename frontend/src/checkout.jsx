import "./checkout.css";
import Navbar from "./navbar";
import Footer from "./footer";

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
