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
    links: ["Log In", "Register"],
  },
  {
    heading: "Pages",
    links: ["Home", "Mens", "Womens", "Accessories"],
  },
  {
    heading: "Help",
    links: ["FAQ’s", "Live Chat", "Contact", "Shipping and Return", "Terms and Conditions"],
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

export default function Footer() {
  return (
    <footer className="footer-panel">
      <div className="footer-columns">
        {footerColumns.map((col) => (
          <div className="footer-column" key={col.heading}>
            <h3 className="footer-heading">{col.heading}</h3>
            <ul className="footer-links">
              {col.links.map((link) => (
                <li key={link}>
                  <a className="footer-link" href="#">
                    {link}
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
            <a className="social-chip" href="#" key={label}>
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
