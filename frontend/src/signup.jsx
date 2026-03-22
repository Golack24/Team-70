import { useState } from "react";
import "./signup.css";
import Navbar from "./navbar";
import Footer from "./footer";
import { registerUser } from "./api";

export default function SignupPage({ onNavigate, onAuth }) {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    username: "",
    phone: "",
    password: "",
    confirm: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        first_name: form.first_name || null,
        last_name: form.last_name || null,
        email: form.email,
        username: form.username || null,
        phone: form.phone || null,
        password: form.password,
      };
      const resp = await registerUser(payload);
      onAuth?.(resp?.user || resp);
    } catch (err) {
      setError(err?.message || "Sign up failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="top-promo-bar">
        <span className="top-promo-text">10% OFF WITH CODE 'METRIC'</span>
      </div>
      <Navbar onNavigate={onNavigate} />
      <main className="auth-page">
        <section className="auth-card">
          <header className="auth-header">
            <h1 className="auth-heading">Create Account</h1>
            <p className="auth-subheading">
              Join Metric to manage orders, save favourites, and checkout faster.
            </p>
          </header>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-grid">
              <label className="form-field">
                <span>First Name</span>
                <input
                  type="text"
                  name="first_name"
                  value={form.first_name}
                  onChange={handleChange}
                  placeholder="Jordan"
                />
              </label>
              <label className="form-field">
                <span>Last Name</span>
                <input
                  type="text"
                  name="last_name"
                  value={form.last_name}
                  onChange={handleChange}
                  placeholder="Adebayo"
                />
              </label>
              <label className="form-field">
                <span>Username</span>
                <input
                  type="text"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="metric_jordan"
                />
              </label>
              <label className="form-field">
                <span>Phone</span>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+44 7123 456789"
                />
              </label>
              <label className="form-field">
                <span>Email*</span>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="you@example.com"
                />
              </label>
              <label className="form-field">
                <span>Password*</span>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  placeholder="At least 6 characters"
                  minLength={6}
                />
              </label>
              <label className="form-field">
                <span>Confirm Password*</span>
                <input
                  type="password"
                  name="confirm"
                  value={form.confirm}
                  onChange={handleChange}
                  required
                  placeholder="Repeat your password"
                  minLength={6}
                />
              </label>
            </div>

            {error && <p className="auth-error">{error}</p>}

            <div className="form-actions">
              <button type="submit" className="auth-submit" disabled={loading}>
                {loading ? "Creating..." : "Create Account"}
              </button>
            </div>
          </form>

          <p className="auth-footer">
            Already have an account?{" "}
            <button type="button" className="auth-link" onClick={() => onNavigate?.("login")}>
              Log in instead
            </button>
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}