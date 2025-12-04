import { useState } from "react";
import "./navbar.css";
import logo from "./assets/logo.png";
import cartIcon from "./assets/carticon.png";
import searchIcon from "./assets/searchicon.png";

export default function Navbar({ onNavigate }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNav = (page) => (e) => {
    e.preventDefault();
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
  ];

  const mobileLinks = [...leftLinks, ...rightLinks];

  return (
    <nav className="navbar">
      <ul className="nav-links">
        {leftLinks.map((item) => (
          <li key={item.label}>
            <a href="#" onClick={handleNav(item.page)}>
              {item.label}
            </a>
          </li>
        ))}
      </ul>

      {/* Centered logo */}
      <div className="logo-container">
        <img src={logo} alt="Logo" className="logo-img" />
      </div>

      {/* Right side links */}
      <ul className="nav-links nav-links-right">
        {rightLinks.map((item) => (
          <li key={item.label}>
            <a href="#" onClick={handleNav(item.page)}>
              {item.label}
            </a>
          </li>
        ))}
        
        <li>
          <a href="#" aria-label="Cart" className="nav-icon-link"onClick={handleNav("checkout")}>
            <img src={cartIcon} alt="Cart" className="nav-icon-img" />
          </a>
        </li>

        <li className="nav-icon-search">
          <a href="#" aria-label="Search" className="nav-icon-link">
            <img src={searchIcon} alt="Search" className="nav-icon-img" />
          </a>
        </li>
      </ul>

      {/* Mobile toggle */}
      <button
        className="nav-toggle"
        onClick={() => setMenuOpen((v) => !v)}
        aria-label={menuOpen ? "Close menu" : "Open menu"}
      >
        {menuOpen ? "✕" : "☰"}
      </button>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="nav-mobile-menu">
          {mobileLinks.map((item) => (
            <button
              key={item.label}
              className="nav-mobile-link"
              onClick={handleNav(item.page)}
            >
              {item.label}
            </button>
          ))}
          <button className="nav-mobile-link icon-link" type="button">
            <img src={cartIcon} alt="Cart" className="nav-icon-img" />
            <span>Cart</span>
          </button>
          <button className="nav-mobile-link icon-link" type="button">
            <img src={searchIcon} alt="Search" className="nav-icon-img" />
            <span>Search</span>
          </button>
        </div>
      )}
    </nav>
  );
}
