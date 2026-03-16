import { useState } from "react";
import "./login.css";

export default function Login({ onNavigate }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
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

    if (!formData.email || !formData.password) {
      setError("Both fields are required.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setSuccess("Logged in successfully.");
    setFormData({
      email: "",
      password: "",
      rememberMe: false,
    });

    setTimeout(() => {
      if (onNavigate) onNavigate("home");
    }, 1200);
  };

  const handleForgot = () => {
    setError("Password reset is not implemented yet.");
    setTimeout(() => setError(""), 2000);
  };

  return (
    <main className="login-page">
      <section className="login-card">
        <header className="login-header">
          <h1 className="login-heading">Welcome Back</h1>
          <p className="login-subheading">Sign in to your account</p>
        </header>

        {error ? <div className="login-message error">{error}</div> : null}
        {success ? <div className="login-message success">{success}</div> : null}

        <form className="login-form" onSubmit={handleSubmit}>
          <label className="login-field">
            <span>Email*</span>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </label>

          <label className="login-field">
            <span>Password*</span>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </label>

          <label className="login-checkbox">
            <input
              type="checkbox"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
            />
            <span>Remember me</span>
          </label>

          <button type="submit" className="login-submit">
            Sign In
          </button>

          <p className="login-switch">
            Don&apos;t have an account?{" "}
            <button
              type="button"
              className="login-link-button"
              onClick={() => onNavigate && onNavigate("signup")}
            >
              Create Account
            </button>
          </p>

          <button
            type="button"
            className="login-forgot-button"
            onClick={handleForgot}
          >
            Forgot your password?
          </button>
        </form>
      </section>
    </main>
  );
}