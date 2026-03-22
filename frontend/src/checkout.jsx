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
  const subtotal = cart.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
    0,
  );
  const shipping = 0;
  const total = subtotal + shipping;

  return (
    <>
      <div className="top-promo-bar">
<<<<<<<<< Temporary merge branch 1
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
            <button
              className="ghost-link"
              type="button"
              onClick={() => onNavigate?.("home")}
            >
              Continue shopping →
            </button>
          </div>

          <div className="checkout-grid">
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
                      {item.category_name || "Gymwear"}{" "}
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
=========
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
>>>>>>>>> Temporary merge branch 2
