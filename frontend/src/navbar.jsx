import { useState } from "react";
import "./navbar.css";
import logo from "./assets/logo.png";
import cartIcon from "./assets/carticon.png";
import searchIcon from "./assets/searchicon.png";

export default function Navbar({ onNavigate, user, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNav = (page) => (e) => {
    e.preventDefault();
    setMenuOpen(false);
    onNavigate?.(page);
  };

  const leftLinks = [
    { label: "Home", page: "home" },
    { label: "Men", page: "men" },
    { label: "Women", page: "women" },
    { label: "Accessories", page: "accessories" },
  ];

  const rightLinks = user
    ? [
        { label: "About Us", page: "about" },
        { label: "Contact Us", page: "contact" },
        { label: "Logout", action: "logout" },
      ]
    : [
        { label: "About Us", page: "about" },
        { label: "Contact Us", page: "contact" },
        { label: "Sign Up", page: "signup" },
        { label: "Log In", page: "login" },
      ];

  const mobileLinks = [...leftLinks, ...rightLinks];

  return (
    <nav className={`navbar ${menuOpen ? "is-open" : ""}`}>
      <div className="navbar-inner">
        {/* MOBILE TOGGLE */}
        <button
          type="button"
          className="nav-toggle"
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>

        {/* LEFT LINKS */}
        <ul className="nav-links">
          {leftLinks.map((item) => (
            <li key={item.label}>
              <a href="#" onClick={handleNav(item.page)}>
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        {/* LOGO */}
        <div className="logo-container">
          <img src={logo} alt="Logo" className="logo-img" />
        </div>

        {/* RIGHT LINKS */}
        <ul className="nav-links nav-links-right">
          {rightLinks.map((item) => (
            <li key={item.label}>
              {item.action === "logout" ? (
                <button
                  className="nav-auth-btn"
                  onClick={() => {
                    setMenuOpen(false);
                    onLogout?.();
                  }}
                >
                  Logout
                </button>
              ) : (
                <a href="#" onClick={handleNav(item.page)}>
                  {item.label}
                </a>
              )}
            </li>
          ))}

          {/* CART */}
          <li>
            <a
              href="#"
              className="nav-icon-link"
              onClick={handleNav("checkout")}
            >
              <img src={cartIcon} alt="Cart" className="nav-icon-img" />
            </a>
          </li>

          {/* SEARCH */}
          <li>
            <a href="#" className="nav-icon-link">
              <img src={searchIcon} alt="Search" className="nav-icon-img" />
            </a>
          </li>
        </ul>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="nav-mobile-menu">
          {mobileLinks.map((item) =>
            item.action === "logout" ? (
              <button
                key={item.label}
                className="nav-mobile-link"
                onClick={() => {
                  setMenuOpen(false);
                  onLogout?.();
                }}
              >
                {item.label}
              </button>
            ) : (
              <button
                key={item.label}
                className="nav-mobile-link"
                onClick={handleNav(item.page)}
              >
                {item.label}
              </button>
            ),
          )}

          {/* MOBILE ICONS */}
          <button
            className="nav-mobile-link icon-link"
            onClick={handleNav("checkout")}
          >
            <img src={cartIcon} alt="Cart" className="nav-icon-img" />
            <span>Cart</span>
          </button>

          <button className="nav-mobile-link icon-link">
            <img src={searchIcon} alt="Search" className="nav-icon-img" />
            <span>Search</span>
          </button>
        </div>
      )}
    </nav>
  );
}
