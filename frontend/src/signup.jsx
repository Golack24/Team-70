import { useState } from "react";
import "./signup.css";

export default function SignupPage({ onNavigate }) {
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

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("All fields are required.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (!formData.agreeToTerms) {
      setError("You must agree to the terms and conditions.");
      return;
    }

    setSuccess("Account created successfully.");
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
    }, 1200);
  };

  return (
    <main className="signup-page">
      <section className="signup-card">
        <header className="signup-header">
          <h1 className="signup-heading">Create Account</h1>
          <p className="signup-subheading">Join us and start shopping today</p>
        </header>

        {error ? <div className="signup-message error">{error}</div> : null}
        {success ? <div className="signup-message success">{success}</div> : null}

        <form className="signup-form" onSubmit={handleSubmit}>
          <div className="signup-grid">
            <label className="signup-field">
              <span>First Name*</span>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </label>

            <label className="signup-field">
              <span>Last Name*</span>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </label>

            <label className="signup-field signup-field-full">
              <span>Email*</span>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </label>

            <label className="signup-field">
              <span>Password*</span>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </label>

            <label className="signup-field">
              <span>Confirm Password*</span>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </label>
          </div>

          <label className="signup-checkbox">
            <input
              type="checkbox"
              name="agreeToTerms"
              checked={formData.agreeToTerms}
              onChange={handleChange}
            />
            <span>I agree to the Terms and Conditions</span>
          </label>

          <button type="submit" className="signup-submit">
            Create Account
          </button>

          <p className="signup-switch">
            Already have an account?{" "}
            <button
              type="button"
              className="signup-link-button"
              onClick={() => onNavigate && onNavigate("login")}
            >
              Log In
            </button>
          </p>
        </form>
      </section>
    </main>
  );
}