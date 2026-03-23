import { useMemo, useState } from "react";
import "./checkout.css";
import Navbar from "./navbar";
import Footer from "./footer";
import { fetchCouponByCode, calculateDiscount } from "./api";

const formatPrice = (value) => {
  if (value === undefined || value === null || Number.isNaN(Number(value))) {
    return "£--";
  }
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
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discountMessage, setDiscountMessage] = useState("");
  const [discountError, setDiscountError] = useState("");
  const [applyingDiscount, setApplyingDiscount] = useState(false);

  const subtotal = useMemo(() => {
    return cart.reduce(
      (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 1),
      0
    );
  }, [cart]);

  const shipping = 0;

  const discountResult = useMemo(() => {
    if (!appliedCoupon) {
      return {
        valid: false,
        discountAmount: 0,
        finalTotal: subtotal,
      };
    }

    return calculateDiscount(appliedCoupon, subtotal);
  }, [appliedCoupon, subtotal]);

  const total = Math.max(0, Number(discountResult.finalTotal || subtotal) + shipping);

  const handleApplyDiscount = async () => {
    const code = discountCode.trim();

    if (!code) {
      setDiscountError("Please enter a discount code");
      setDiscountMessage("");
      setAppliedCoupon(null);
      return;
    }

    try {
      setApplyingDiscount(true);
      setDiscountError("");
      setDiscountMessage("");

      const coupon = await fetchCouponByCode(code);

      if (!coupon) {
        setAppliedCoupon(null);
        setDiscountError("Coupon not found");
        return;
      }

      const result = calculateDiscount(coupon, subtotal);

      if (!result.valid) {
        setAppliedCoupon(null);
        setDiscountError(result.message);
        return;
      }

      setAppliedCoupon(coupon);
      setDiscountMessage(result.message);
      setDiscountError("");
    } catch (err) {
      setAppliedCoupon(null);
      setDiscountMessage("");
      setDiscountError(err.message || "Failed to apply coupon");
    } finally {
      setApplyingDiscount(false);
    }
  };

  const handleRemoveDiscount = () => {
    setAppliedCoupon(null);
    setDiscountCode("");
    setDiscountMessage("");
    setDiscountError("");
  };

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

                {appliedCoupon && discountResult.valid && (
                  <div className="row">
                    <span>
                      Discount ({appliedCoupon.code || appliedCoupon.CODE})
                    </span>
                    <span>-{formatPrice(discountResult.discountAmount)}</span>
                  </div>
                )}

                <div className="row total">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>

                <div className="discount-section">
                  <label>Discount Code</label>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <input
                      type="text"
                      value={discountCode}
                      placeholder="Enter code"
                      onChange={(e) => setDiscountCode(e.target.value)}
                      disabled={applyingDiscount}
                    />
                    <button
                      type="button"
                      className="primary-btn"
                      onClick={handleApplyDiscount}
                      disabled={applyingDiscount || cart.length === 0}
                    >
                      {applyingDiscount ? "Applying..." : "Apply"}
                    </button>
                  </div>

                  {discountMessage && (
                    <p style={{ color: "green", marginTop: "0.5rem" }}>
                      {discountMessage}
                    </p>
                  )}

                  {discountError && (
                    <p style={{ color: "crimson", marginTop: "0.5rem" }}>
                      {discountError}
                    </p>
                  )}

                  {appliedCoupon && discountResult.valid && (
                    <button
                      type="button"
                      className="ghost-link"
                      onClick={handleRemoveDiscount}
                      style={{ marginTop: "0.5rem" }}
                    >
                      Remove discount
                    </button>
                  )}
                </div>
              </div>

              <button className="primary-btn" type="button" disabled={cart.length === 0}>
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