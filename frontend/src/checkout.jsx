import "./checkout.css";

export default function Checkout() {
  const cartItems = [
    { name: "Performance Oversized Tee", size: "M", qty: 1, price: "£25" },
    { name: "Gym Towel", size: "One Size", qty: 1, price: "£12" },
  ];

  return (
    <main className="checkout-page">
      <section className="checkout-container">
        <header className="checkout-header">
          <h1 className="checkout-heading">Checkout</h1>
          <p className="checkout-subheading">
            Review your order and complete your purchase.
          </p>
        </header>

        <div className="checkout-layout">
          <section className="checkout-card">
            <h2 className="checkout-section-title">Shipping Details</h2>

            <div className="checkout-grid">
              <label className="checkout-field">
                <span>First Name</span>
                <input type="text" placeholder="First name" />
              </label>

              <label className="checkout-field">
                <span>Last Name</span>
                <input type="text" placeholder="Last name" />
              </label>

              <label className="checkout-field checkout-field-full">
                <span>Email</span>
                <input type="email" placeholder="Email address" />
              </label>

              <label className="checkout-field checkout-field-full">
                <span>Address</span>
                <input type="text" placeholder="Street address" />
              </label>

              <label className="checkout-field">
                <span>City</span>
                <input type="text" placeholder="City" />
              </label>

              <label className="checkout-field">
                <span>Postcode</span>
                <input type="text" placeholder="Postcode" />
              </label>
            </div>
          </section>

          <aside className="checkout-card">
            <h2 className="checkout-section-title">Order Summary</h2>

            <div className="checkout-items">
              {cartItems.map((item) => (
                <div className="checkout-item" key={`${item.name}-${item.size}`}>
                  <div>
                    <p className="checkout-item-name">{item.name}</p>
                    <p className="checkout-item-meta">
                      {item.size} • Qty {item.qty}
                    </p>
                  </div>
                  <p className="checkout-item-price">{item.price}</p>
                </div>
              ))}
            </div>

            <div className="checkout-totals">
              <div className="checkout-total-row">
                <span>Subtotal</span>
                <span>£37</span>
              </div>
              <div className="checkout-total-row">
                <span>Shipping</span>
                <span>£4</span>
              </div>
              <div className="checkout-total-row total">
                <span>Total</span>
                <span>£41</span>
              </div>
            </div>

            <button type="button" className="checkout-submit">
              Place Order
            </button>
          </aside>
        </div>
      </section>
    </main>
  );
}