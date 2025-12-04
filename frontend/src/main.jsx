import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Navbar from "./navbar";
import Hero from "./hero";
import Footer from "./footer";
import AboutPage from "./about";
import ContactPage from "./contact";
import MenPage from "./men";
import WomenPage from "./women";
import AccessoriesPage from "./accessories";
import SignupPage from "./signup";
import Checkout from "./checkout";

const PromoBar = () => (
  <div className="top-promo-bar">
    <span className="top-promo-text">10% OFF WITH CODE 'METRIC'</span>
  </div>
);

function App() {
  const [page, setPage] = useState("home");

  if (page === "about") {
    return (
      <StrictMode>
        <AboutPage onNavigate={setPage} />
      </StrictMode>
    );
  }

  if (page === "contact") {
    return (
      <StrictMode>
        <ContactPage onNavigate={setPage} />
      </StrictMode>
    );
  }

  if (page === "signup") {
    return (
      <StrictMode>
        <SignupPage onNavigate={setPage} />
      </StrictMode>
    );
  }

  if (page === "checkout") {
    return (
      <StrictMode>
        <Checkout onNavigate={setPage} />
      </StrictMode>
    );
 }

  if (page === "accessories") {
    return (
      <StrictMode>
        <AccessoriesPage onNavigate={setPage} />
      </StrictMode>
    );
  }

  if (page === "women") {
    return (
      <StrictMode>
        <WomenPage onNavigate={setPage} />
      </StrictMode>
    );
  }

  if (page === "men") {
    return (
      <StrictMode>
        <MenPage onNavigate={setPage} />
      </StrictMode>
    );
  }

  return (
    <StrictMode>
      <PromoBar />
      <Navbar onNavigate={setPage} />
      {/* ALL content must be wrapped inside this div */}
      <div style={{ marginTop: "clamp(170px, 24vw, 278px)" }}>
        <Hero />
      </div>
      <Footer />
    </StrictMode>
  );
}

createRoot(document.getElementById("root")).render(<App />);
