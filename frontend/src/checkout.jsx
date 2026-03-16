import { useEffect, useState } from "react";
import "./checkout.css";
import Navbar from "./navbar";
import Footer from "./footer";

export default function Checkout({ onNavigate }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [discountCode, setDiscountCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);

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