import "./contact.css";
import Navbar from "./navbar";
import Footer from "./footer";

export default function Contact({ onNavigate }) {
  return (
    <>
      <div className="top-promo-bar">
        <span className="top-promo-text">10% OFF WITH CODE 'METRIC'</span>
      </div>
      <Navbar onNavigate={onNavigate} />
      <main className="contact-page">
        <section className="contact-card">
          <header className="contact-header">
            <h1 className="contact-heading">Contact Us</h1>
            <p className="contact-subheading">
              Questions, feedback, or wholesale? Drop us a line and we’ll get back within one business day.
            </p>
          </header>

          <form className="contact-form">
            <div className="form-grid">
              <label className="form-field">
                <span>Name*</span>
                <input type="text" name="name" required placeholder="Your full name" />
              </label>
              <label className="form-field">
                <span>Email*</span>
                <input type="email" name="email" required placeholder="you@example.com" />
              </label>
              <label className="form-field">
                <span>Phone</span>
                <input type="tel" name="phone" placeholder="+44 7123 456789" />
              </label>
            </div>

            <label className="form-field form-field-full">
              <span>Subject*</span>
              <input type="text" name="subject" required placeholder="Order issue, sizing, shipping..." />
            </label>

            <label className="form-field">
              <span>Description*</span>
              <textarea name="description" rows="4" required placeholder="Share details so we can help quickly." />
            </label>

            <div className="form-actions">
              <button type="submit" className="contact-submit">
                Send Message
              </button>
            </div>
          </form>
        </section>
      </main>
      <Footer />
    </>
  );
}
