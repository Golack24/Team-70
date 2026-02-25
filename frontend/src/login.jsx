import { useState } from "react";
import "./login.css";
import Navbar from "./navbar";
import Footer from "./footer";

export default function Login({ onNavigate }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Basic validation matching site patterns
    if (!formData.email || !formData.password) {
      setError("Both fields are required");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setSuccess("Logged in successfully!");
    setFormData({ email: "", password: "", rememberMe: false });

    setTimeout(() => {
      if (onNavigate) onNavigate("home");
    }, 1500);
  };

  const handleForgot = () => {
    setError("Password reset is not implemented yet");
    setTimeout(() => setError(""), 2000);
  };

  return (
    <>
      <div className="top-promo-bar">
        <span className="top-promo-text">10% OFF WITH CODE 'METRIC'</span>
      </div>
      <Navbar onNavigate={onNavigate} />
      <main className="login-page">
        <section className="login-card">
          <header className="login-header">
            <h1 className="login-heading">Welcome Back</h1>
            <p className="login-subheading">Sign in to your account</p>
          </header>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <form onSubmit={handleSubmit} className="login-form">
            <label className="form-field form-field-full">
              <span>Email*</span>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="you@example.com"
              />
            </label>

            <label className="form-field form-field-full">
              <span>Password*</span>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
              />
            </label>

            <label className="form-field-checkbox">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
              />
              <span>Remember me</span>
            </label>

            <div className="form-actions">
              <button type="submit" className="login-submit">
                Sign In
              </button>
            </div>
          </form>

          <div className="signup-link-container">
            <p className="signup-prompt">
              Don't have an account? Create one now
            </p>
            <button
              className="signup-link"
              onClick={() => onNavigate && onNavigate("signup")}
            >
              Create Account
            </button>
          </div>

          <div className="forgot-password">
            <button className="forgot-link" onClick={handleForgot}>
              Forgot your password?
            </button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
