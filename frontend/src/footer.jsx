import "./footer.css";
import visaIcon from "./assets/visaicon.png";
import cardIcon from "./assets/cardicon.png";
import paypalIcon from "./assets/paypalicon.png";
import amexIcon from "./assets/amexicon.png";
import applePayIcon from "./assets/applepayicon.png";
import amazonPayIcon from "./assets/amazonpayicon.png";

const footerColumns = [
  {
    heading: "My Account",
    links: [
      { label: "Log In", page: "login" },
      { label: "Register", page: "signup" },
    ],
  },
  {
    heading: "Pages",
    links: [
      { label: "Home", page: "home" },
      { label: "Mens", page: "men" },
      { label: "Womens", page: "women" },
      { label: "Accessories", page: "accessories" },
    ],
  },
  {
    heading: "Help",
    links: [
      { label: "FAQ’s", page: "contact" },
      { label: "Live Chat", page: "contact" },
      { label: "Contact", page: "contact" },
      { label: "Shipping and Return", page: "contact" },
      { label: "Terms and Conditions", page: "about" },
    ],
  },
];

const payments = [
  { label: "Visa", src: visaIcon },
  { label: "Mastercard", src: cardIcon },
  { label: "PayPal", src: paypalIcon },
  { label: "AmEx", src: amexIcon },
  { label: "Apple Pay", src: applePayIcon },
  { label: "Amazon Pay", src: amazonPayIcon },
];

const socials = ["Facebook", "YouTube", "X", "TikTok", "Instagram"];

export default function Footer({ onNavigate }) {
  return (
    <footer className="footer-panel">
      <div className="footer-columns">
        {footerColumns.map((col) => (
          <div className="footer-column" key={col.heading}>
            <h3 className="footer-heading">{col.heading}</h3>

            <ul className="footer-links">
              {col.links.map((link) => (
                <li key={link.label}>
                  <a
                    href="#"
                    className="footer-link"
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigate?.(link.page);
                    }}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="footer-bottom">
        <div className="footer-payments">
          {payments.map((item) => (
            <span className="payment-chip" key={item.label}>
              <img src={item.src} alt={item.label} className="payment-icon" />
            </span>
          ))}
        </div>

        <div className="footer-social">
          {socials.map((label) => (
            <a key={label} href="#" className="social-chip">
              {label}
            </a>
          ))}
        </div>
      </div>

      <div className="footer-copy">
        © 2025 | Metric Limited | All Rights Reserved. | Measure Every Move.
      </div>
    </footer>
  );
}
