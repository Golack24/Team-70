import "./signup.css";
import Navbar from "./navbar";
import Footer from "./footer";

export default function Signup({ onNavigate }) {
  return (
    <>
      <div className="top-promo-bar">
        <span className="top-promo-text">10% OFF WITH CODE 'METRIC'</span>
      </div>
      <Navbar onNavigate={onNavigate} />
      <main className="signup-page">
        <div className="signup-space" />
      </main>
      <Footer />
    </>
  );
}
