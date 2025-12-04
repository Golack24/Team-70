import { useState } from "react";
import "./signup.css";
import Navbar from "./navbar";
import Footer from "./footer";

export default function Signup({ onNavigate }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
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

    // Validation
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("All fields are required");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (!formData.agreeToTerms) {
      setError("You must agree to the terms and conditions");
      return;
    }

    // Success message
    setSuccess("Account created successfully!");
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      agreeToTerms: false,
    });

    setTimeout(() => {
      if (onNavigate) onNavigate("home");
    }, 1500);
  };

  return (
    <>
      <div className="top-promo-bar">
        <span className="top-promo-text">10% OFF WITH CODE 'METRIC'</span>
      </div>
      <Navbar onNavigate={onNavigate} />
      <main className="signup-page">
        <section className="signup-card">
          <header className="signup-header">
            <h1 className="signup-heading">Create Account</h1>
            <p className="signup-subheading">
              Join us and start shopping today
            </p>
          </header>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <form onSubmit={handleSubmit} className="signup-form">
            <div className="form-grid">
              <label className="form-field">
                <span>First Name*</span>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  placeholder="John"
                />
              </label>
              <label className="form-field">
                <span>Last Name*</span>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  placeholder="Doe"
                />
              </label>
            </div>

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

            <label className="form-field form-field-full">
              <span>Confirm Password*</span>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="••••••••"
              />
            </label>

            <label className="form-field-checkbox">
              <input
                type="checkbox"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleChange}
              />
              <span>I agree to the Terms and Conditions</span>
            </label>

            <div className="form-actions">
              <button type="submit" className="signup-submit">
                Create Account
              </button>
            </div>
          </form>

          <div className="login-link-container">
            <p className="login-prompt">Already have an account?</p>
            <button
              className="login-link"
              onClick={() => onNavigate && onNavigate("login")}
            >
              Log In
            </button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
