import { useState } from "react";
import "./navbar.css";
import logo from "./assets/logo.png";
import cartIcon from "./assets/carticon.png";
import searchIcon from "./assets/searchicon.png";

export default function Navbar({ onNavigate, user, onLogout }) {
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

  const authLinks = user
    ? [{ label: "Logout", action: "logout" }]
    : [
        { label: "Sign Up", page: "signup" },
        { label: "Log In", page: "login" },
      ];

  const rightLinks = [
    { label: "About Us", page: "about" },
    { label: "Contact Us", page: "contact" },
    ...authLinks,
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
            <li key={item.label}>
              {item.action === "logout" ? (
                <button
                  type="button"
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

          <li>
            <a
              href="#"
              aria-label="Cart"
              className="nav-icon-link"
              onClick={handleNav("checkout")}
            >
              <img src={cartIcon} alt="Cart" className="nav-icon-img" />
            </a>
          </li>

          <li className="nav-icon-search">
            <a href="#" aria-label="Search" className="nav-icon-link">
              <img src={searchIcon} alt="Search" className="nav-icon-img" />
            </a>
          </li>
        </ul>

      {menuOpen && (
        <div className="nav-mobile-menu" id="nav-mobile-menu">
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
            )
          )}
          <button
            className="nav-mobile-link icon-link"
            type="button"
            onClick={handleNav("checkout")}
          >
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