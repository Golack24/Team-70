import "./checkout.css"
import Navbar from "./navbar"
import Footer from "./footer"
export default function Checkout({ onNavigate }) {
  return (
    <>
    <Navbar />
    <div className="checkout-container">
      <h1>Checkout</h1>
      {/* Add your checkout form or content here */}
    </div>
    <Footer />
    </>
  );
}
