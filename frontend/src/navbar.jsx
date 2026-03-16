import { useState } from "react";
import "./navbar.css";
import logo from "./assets/logo.png";
import cartIcon from "./assets/carticon.png";
import searchIcon from "./assets/searchicon.png";

export default function Navbar({ onNavigate, theme, onToggleTheme }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNav = (page) => (event) => {
    event.preventDefault();
    setMenuOpen(false);
    if (onNavigate) onNavigate(page);
  };

  const leftLinks = [
    { label: "Home", page: "home" },
    { label: "Men", page: "men" },
    { label: "Women", page: "women" },
    { label: "Accessories", page: "accessories" },
  ];

  const rightLinks = [
    { label: "About Us", page: "about" },
    { label: "Contact Us", page: "contact" },
    { label: "Sign Up", page: "signup" },
    { label: "Log In", page: "login" },
  ];

  const mobileLinks = [...leftLinks, ...rightLinks];
  const navClass = menuOpen ? "navbar is-open" : "navbar";

  return (
    <nav className={navClass}>
      <div className="navbar-inner">
        <button
          className="nav-toggle"
          onClick={() => setMenuOpen((value) => !value)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          type="button"
        >
          {menuOpen ? "Close" : "Menu"}
        </button>

        <ul className="nav-links">
          {leftLinks.map((item) => (
            <li key={item.page}>
              <a href="#" onClick={handleNav(item.page)}>
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="logo-container">
          <a href="#" onClick={handleNav("home")} aria-label="Go to home page">
            <img src={logo} alt="Metric logo" className="logo-img" />
          </a>
        </div>

        <ul className="nav-links nav-links-right">
          {rightLinks.map((item) => (
            <li key={item.page}>
              <a href="#" onClick={handleNav(item.page)}>
                {item.label}
              </a>
            </li>
          ))}

          <li>
            <button
              type="button"
              className="theme-toggle"
              onClick={onToggleTheme}
              aria-label="Toggle dark mode"
            >
              {theme === "dark" ? "Light Mode" : "Dark Mode"}
            </button>
          </li>

          <li>
            <a href="#" className="nav-icon-link" aria-label="Cart">
              <img src={cartIcon} alt="Cart" className="nav-icon-img" />
            </a>
          </li>

<<<<<<< HEAD
          <li>
            <a href="#" className="nav-icon-link nav-icon-search" aria-label="Search">
=======
          <li className="nav-icon-search">
            <a href="#" aria-label="Search" className="nav-icon-link">
>>>>>>> 687141407e5d2aec5027d96121cc881f1be4d285
              <img src={searchIcon} alt="Search" className="nav-icon-img" />
            </a>
          </li>
        </ul>

        <div className="nav-spacer" />

        {menuOpen && (
          <div className="nav-mobile-menu">
            {mobileLinks.map((item) => (
              <button
                key={item.page}
                className="nav-mobile-link"
                onClick={handleNav(item.page)}
                type="button"
              >
                {item.label}
              </button>
            ))}

            <button
              className="nav-mobile-link"
              onClick={onToggleTheme}
              type="button"
            >
              Switch to {theme === "dark" ? "Light" : "Dark"} Mode
            </button>

            <button className="nav-mobile-link" type="button">
              Cart
            </button>

            <button className="nav-mobile-link" type="button">
              Search
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}