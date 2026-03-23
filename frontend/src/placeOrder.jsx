import { useState } from "react";
import Navbar from "./navbar";
import Footer from "./footer";
import {
  fetchCouponByCode,
  calculateDiscount,
  createAddress,
  createOrder,
} from "./api";

const formatPrice = (value) => {
  const num = Number(value || 0);
  return `£${num.toFixed(2)}`;
};

export default function PlaceOrderPage({
  onNavigate,
  cart = [],
  subtotal = 0,
  total = 0,
}) {
  const [form, setForm] = useState({
    line1: "",
    line2: "",
    city: "",
    postcode: "",
    country: "",
    is_default: 1,
  });

  const [placing, setPlacing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handlePlaceOrder = async () => {
    try {
      setPlacing(true);
      setError("");

      if (!form.line1 || !form.city || !form.postcode || !form.country) {
        setError("Please complete all required address fields.");
        return;
      }

      await createAddress(form);

      await createOrder({
        total,
        status: "pending",
      });

      setSuccess(true);
    } catch (err) {
      setError(err.message || "Failed to place order");
    } finally {
      setPlacing(false);
    }
  };

  return (
    <>
      <div className="top-promo-bar">
        <span className="top-promo-text">Secure checkout</span>
      </div>

      <Navbar onNavigate={onNavigate} />

      <main className="checkout-page">
        <section className="checkout-wrapper">
          <div className="checkout-header">
            <div>
              <p className="eyebrow">Order Details</p>
              <h1>Shipping Address</h1>
              <p className="lede">Enter your address to complete the order.</p>
            </div>
          </div>

          {success ? (
            <div className="summary-panel" style={{ maxWidth: "700px" }}>
              <h2>Order placed successfully</h2>
              <p>
                Your order has been placed and is now visible in the admin
                system.
              </p>
              <p>
                <strong>Total:</strong> {formatPrice(total)}
              </p>

              <button
                type="button"
                className="primary-btn"
                onClick={() => onNavigate?.("home")}
              >
                Continue shopping
              </button>
            </div>
          ) : (
            <div className="checkout-grid">
              <div className="cart-panel">
                <div className="admin-form-group">
                  <label>Address Line 1</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={form.line1}
                    onChange={(e) => handleChange("line1", e.target.value)}
                  />
                </div>

                <div className="admin-form-group">
                  <label>Address Line 2</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={form.line2}
                    onChange={(e) => handleChange("line2", e.target.value)}
                  />
                </div>

                <div className="admin-form-group">
                  <label>City</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={form.city}
                    onChange={(e) => handleChange("city", e.target.value)}
                  />
                </div>

                <div className="admin-form-group">
                  <label>Postcode</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={form.postcode}
                    onChange={(e) => handleChange("postcode", e.target.value)}
                  />
                </div>

                <div className="admin-form-group">
                  <label>Country</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={form.country}
                    onChange={(e) => handleChange("country", e.target.value)}
                  />
                </div>

                {error && (
                  <p style={{ color: "crimson", marginTop: "1rem" }}>{error}</p>
                )}
              </div>

              <aside className="summary-panel">
                <h2>Order summary</h2>

                {cart.map((item) => (
                  <div
                    key={`${item.id}-${item.variant || "base"}`}
                    className="row"
                    style={{ marginBottom: "0.75rem" }}
                  >
                    <span>
                      {item.name} × {item.quantity || 1}
                    </span>
                    <span>
                      {formatPrice(
                        Number(item.price || 0) * Number(item.quantity || 1),
                      )}
                    </span>
                  </div>
                ))}

                <div className="summary-rows">
                  <div className="row">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>

                  <div className="row total">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>

                <button
                  className="primary-btn"
                  type="button"
                  onClick={handlePlaceOrder}
                  disabled={placing || cart.length === 0}
                >
                  {placing ? "Placing order..." : "Confirm order"}
                </button>
              </aside>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}

<div className="cart-panel">
  <div className="place-order-form">
    <div className="place-order-group">
      <label>Address Line 1</label>
      <input
        type="text"
        className="place-order-input"
        value={form.line1}
        onChange={(e) => handleChange("line1", e.target.value)}
      />
    </div>

    <div className="place-order-group">
      <label>Address Line 2</label>
      <input
        type="text"
        className="place-order-input"
        value={form.line2}
        onChange={(e) => handleChange("line2", e.target.value)}
      />
    </div>

    <div className="place-order-group">
      <label>City</label>
      <input
        type="text"
        className="place-order-input"
        value={form.city}
        onChange={(e) => handleChange("city", e.target.value)}
      />
    </div>

    <div className="place-order-group">
      <label>Postcode</label>
      <input
        type="text"
        className="place-order-input"
        value={form.postcode}
        onChange={(e) => handleChange("postcode", e.target.value)}
      />
    </div>

    <div className="place-order-group">
      <label>Country</label>
      <input
        type="text"
        className="place-order-input"
        value={form.country}
        onChange={(e) => handleChange("country", e.target.value)}
      />
    </div>

    {error && <p className="place-order-error">{error}</p>}
  </div>

  <div className="place-order-success">
    <h2>Order placed successfully</h2>
    <p>Your order has been placed and is now visible in the admin system.</p>
    <p>
      <strong>Total:</strong> {formatPrice(total)}
    </p>

    <button
      type="button"
      className="primary-btn"
      onClick={() => onNavigate?.("home")}
    >
      Continue shopping
    </button>
  </div>

  <div className="place-order-success">
    <h2>Order placed successfully</h2>
    <p>Your order has been placed and is now visible in the admin system.</p>
    <p>
      <strong>Total:</strong> {formatPrice(total)}
    </p>

    <button
      type="button"
      className="primary-btn"
      onClick={() => onNavigate?.("home")}
    >
      Continue shopping
    </button>
  </div>
</div>;
