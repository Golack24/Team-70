import { StrictMode, useEffect, useState } from "react";
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
import Login from "./login";
import Checkout from "./checkout";

const PromoBar = () => (
  <div className="top-promo-bar">
    <div className="top-promo-text">10% OFF WITH CODE "METRIC"</div>
  </div>
);

function App() {
  const [page, setPage] = useState("home");
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light" || savedTheme === "dark") {
      return savedTheme;
    }

    const prefersDark =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;

    return prefersDark ? "dark" : "light";
  });

  useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((currentTheme) =>
      currentTheme === "dark" ? "light" : "dark"
    );
  };

  const sharedNavbarProps = {
    onNavigate: setPage,
    theme,
    onToggleTheme: toggleTheme,
  };

  if (page === "about") {
    return (
      <>
        <PromoBar />
        <Navbar {...sharedNavbarProps} />
        <AboutPage />
        <Footer />
      </>
    );
  }

  if (page === "contact") {
    return (
      <>
        <PromoBar />
        <Navbar {...sharedNavbarProps} />
        <ContactPage />
        <Footer />
      </>
    );
  }

  if (page === "signup") {
    return (
      <>
        <PromoBar />
        <Navbar {...sharedNavbarProps} />
        <SignupPage onNavigate={setPage} />
        <Footer />
      </>
    );
  }

  if (page === "login") {
    return (
      <>
        <PromoBar />
        <Navbar {...sharedNavbarProps} />
        <Login onNavigate={setPage} />
        <Footer />
      </>
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
      <>
        <PromoBar />
        <Navbar {...sharedNavbarProps} />
        <AccessoriesPage />
        <Footer />
      </>
    );
  }

  if (page === "women") {
    return (
      <>
        <PromoBar />
        <Navbar {...sharedNavbarProps} />
        <WomenPage />
        <Footer />
      </>
    );
  }

  if (page === "men") {
    return (
      <>
        <PromoBar />
        <Navbar {...sharedNavbarProps} />
        <MenPage />
        <Footer />
      </>
    );
  }



  return (
    <>
      <PromoBar />
      <Navbar {...sharedNavbarProps} />
      <Hero />
      <Footer />
    </>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);