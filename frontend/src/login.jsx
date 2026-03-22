
import { useState } from "react";
import "./signup.css";
import Navbar from "./navbar";
import Footer from "./footer";
import { loginUser } from "./api";

export default function LoginPage({ onNavigate, onAuth }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
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

    try {
      const response = await fetch(
        "http://cs2team70.cs2410-web01pvm.aston.ac.uk/index.php?resource=users&action=login",
        {
          method: "POST",
          credentials: "include", // To handle sessions/cookies
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        },
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccess("Logged in successfully!");
        // Optionally handle 'rememberMe' by storing a token in localStorage if your backend returns one
        // if (formData.rememberMe && data.token) localStorage.setItem('authToken', data.token);

        setTimeout(() => {
          if (onNavigate) onNavigate("home");
        }, 1500);
      } else {
        setError(data.error || "Invalid email or password");
      }
    } catch (err) {
      setError("Error connecting to the server. Please try again later.");
    }
  };

  const handleForgot = () => {
    setError("Password reset is not implemented yet");
    setTimeout(() => setError(""), 2000);
  };

    setLoading(true);
    try {
      const resp = await loginUser(form);
      onAuth?.(resp?.user || resp);
    } catch (err) {
      setError(err?.message || "Login failed");
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
      <main className="auth-page">
        <section className="auth-card">
          <header className="auth-header">
            <h1 className="auth-heading">Log In</h1>
            <p className="auth-subheading">
              Welcome back. Enter your credentials to access your account.
            </p>
          </header>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-grid">
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
                  placeholder="••••••••"
                  minLength={6}
                />
              </label>
            </div>

            {error && <p className="auth-error">{error}</p>}

            <div className="form-actions">
              <button type="submit" className="auth-submit" disabled={loading}>
                {loading ? "Logging in..." : "Log In"}
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
          <p className="auth-footer">
            New here?{" "}
            <button type="button" className="auth-link" onClick={() => onNavigate?.("signup")}>
              Create an account
            </button>
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
