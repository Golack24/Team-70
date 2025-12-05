import "./checkout.css";
import Navbar from "./navbar";
import Footer from "./footer";

export default function Checkout({ onNavigate }) {
  // Static mock cart items for MVP
  const cartItems = [
    {
      name: "Oversized Performance Tee",
      type: "TEE",
      color: "Black",
      size: "L",
      price: "£32",
    },
    {
      name: "Performance Joggers",
      type: "JOGGERS",
      color: "Charcoal",
      size: "M",
      price: "£48",
    },
  ];

  return (
    <>
      <div className="top-promo-bar">
        <span className="top-promo-text">10% OFF WITH CODE 'METRIC'</span>
      </div>

      <Navbar onNavigate={onNavigate} />
      <main className="checkout-page">
        <h1 className="checkout-title">Checkout</h1>
        <p className="checkout-subtitle">
          Secure your essentials in under a minute.
        </p>

        <div className="checkout-layout">
          {/* LEFT: CART ITEMS */}
          <section className="checkout-cart">
            {cartItems.map((item) => (
              <div className="cart-card" key={item.name}>
                <div className="cart-type">{item.type}</div>
                <div className="cart-info">
                  <p className="cart-name">{item.name}</p>
                  <p className="cart-details">
                    {item.color} • Size {item.size}
                  </p>
                  <button className="cart-remove">Remove</button>
                </div>

                <div className="cart-controls">
                  <button className="qty-btn">-</button>
                  <span className="qty-number">1</span>
                  <button className="qty-btn">+</button>
                </div>

                <div className="cart-price">{item.price}</div>
              </div>
            ))}
          </section>

          {/* RIGHT: ORDER + SHIPPING FORM */}
          <section className="checkout-summary">
            <h2 className="summary-heading">Order Summary</h2>

            <div className="summary-row">
              <span>Subtotal</span>
              <span>£80</span>
            </div>

            <div className="summary-row">
              <span>Shipping</span>
              <span>Free</span>
            </div>

            <div className="summary-total-row">
              <span>Total</span>
              <span>£80</span>
            </div>

            <h3 className="section-label">Shipping Address</h3>

            <form className="checkout-form">
              <label>
                Full Name
                <input type="text" placeholder="Aisha Khan" />
              </label>

              <label>
                Email
                <input type="email" placeholder="you@example.com" />
              </label>

              <label>
                Street Address
                <input type="text" placeholder="123 Metric Lane" />
              </label>

              <div className="form-row">
                <label>
                  House / Apt
                  <input type="text" placeholder="16B" />
                </label>

                <label>
                  City
                  <input type="text" placeholder="London" />
                </label>
              </div>

              <h3 className="section-label">Payment Details</h3>

              <label>
                Card Number
                <input type="text" placeholder="1234 5678 9012 3456" />
              </label>

              <div className="form-row">
                <label>
                  Expiry
                  <input type="text" placeholder="MM/YY" />
                </label>

                <label>
                  CVC
                  <input type="text" placeholder="000" />
                </label>
              </div>

              <button type="button" className="checkout-button">
                Place Order
              </button>
            </form>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}