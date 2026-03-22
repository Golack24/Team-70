import "./checkout.css";
import Navbar from "./navbar";
import Footer from "./footer";

const formatPrice = (value) => {
  if (value === undefined || value === null || Number.isNaN(Number(value)))
    return "£--";
  const num = Number(value);
  return `£${num % 1 === 0 ? num.toFixed(0) : num.toFixed(2)}`;
};

import { useState } from "react";

export default function CheckoutPage({
  onNavigate,
  cart = [],
  onUpdateQty,
  onRemove,
}) {
  // Local state for discount code
  const [discountCode, setDiscountCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);

  // Calculate subtotal
  const subtotal = cart.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
    0,
  );

  const shipping = 0;
  // Example: 10% off with code 'METRIC'
  const validDiscount = discountCode.trim().toUpperCase() === "METRIC";
  const discount = validDiscount ? subtotal * 0.1 : 0;
  const total = subtotal + shipping - discount;

  // Handlers
  const handleApplyDiscount = () => {
    if (validDiscount) {
      setDiscountAmount(discount);
    } else {
      setDiscountAmount(0);
    }
  };

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

          {cart.length === 0 && (
            <p className="empty-cart">Your cart is empty.</p>
          )}

          {cart.map((item) => (
            <div key={item.id} className="checkout-item">
              <div className="item-info">
                <h3 className="item-name">{item.name}</h3>
                <p className="item-color">£{item.price}</p>
                <button className="remove-btn" onClick={() => onRemove?.(item.id)}>
                  Remove
                </button>
              </div>

              {/* Quantity selector */}
              <div className="qty-box">
                <button onClick={() => onUpdateQty?.(item.id, (item.quantity || 1) - 1)}>-</button>
                <span>{item.quantity || 1}</span>
                <button onClick={() => onUpdateQty?.(item.id, (item.quantity || 1) + 1)}>+</button>
              </div>
            </div>
          ))}
        </section>

        {/* RIGHT SIDE — ORDER SUMMARY */}
        <aside className="checkout-right">
          <h2 className="summary-title">Order Summary</h2>

          <div className="summary-line">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
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
            <button className="apply-btn" type="button" onClick={handleApplyDiscount}>Apply</button>
          </div>

          {discountAmount > 0 && (
            <div className="summary-line">
              <span>Discount</span>
              <span>-{formatPrice(discountAmount)}</span>
            </div>
          )}

          <hr />

          <div className="summary-total">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>

          <button className="checkout-btn">Place Order</button>
        </aside>
      </main>

      <Footer />
    </>
  );
}



