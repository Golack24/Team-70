import "./contact.css";

export default function Contact() {
  const handleSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <main className="contact-page">
      <section className="contact-card">
        <header className="contact-header">
          <h1 className="contact-heading">Contact Us</h1>
          <p className="contact-subheading">
            Questions, feedback, or wholesale? Drop us a line and we’ll get back
            within one business day.
          </p>
        </header>

        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <label className="form-field">
              <span>Name*</span>
              <input type="text" name="name" placeholder="Your name" required />
            </label>

            <label className="form-field">
              <span>Email*</span>
              <input type="email" name="email" placeholder="Your email" required />
            </label>

            <label className="form-field">
              <span>Phone</span>
              <input type="tel" name="phone" placeholder="Optional phone number" />
            </label>

            <label className="form-field">
              <span>Subject*</span>
              <input type="text" name="subject" placeholder="Subject" required />
            </label>
          </div>

          <label className="form-field">
            <span>Description*</span>
            <textarea
              name="description"
              placeholder="Tell us how we can help"
              required
            />
          </label>

          <div className="form-actions">
            <button type="submit" className="contact-submit">
              Send Message
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}