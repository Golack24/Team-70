import { useState } from "react";
import "./resetPassword.css";
import Navbar from "./navbar";
import Footer from "./footer";
import { resetPasswordUser } from "./api";

export default function ResetPasswordPage({ onNavigate }) {
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!form.email || !form.password || !form.confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await resetPasswordUser({
        email: form.email,
        password: form.password,
      });

      setMessage(res?.message || "Password reset successful");
      setForm({ email: "", password: "", confirmPassword: "" });

      setTimeout(() => {
        onNavigate?.("login");
      }, 1500);
    } catch (err) {
      setError(err?.message || "Failed to reset password");
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
            <h1 className="auth-heading">Reset Password</h1>
            <p className="auth-subheading">
              Enter your email and choose a new password.
            </p>
          </header>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-grid" style={{ gridTemplateColumns: "1fr" }}>
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
                <span>New Password*</span>
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

              <label className="form-field">
                <span>Confirm Password*</span>
                <input
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  minLength={6}
                />
              </label>
            </div>

            {error && <p className="auth-error">{error}</p>}
            {message && <p className="auth-success">{message}</p>}

            <div className="form-actions">
              <button type="submit" className="auth-submit" disabled={loading}>
                {loading ? "Updating..." : "Reset Password"}
              </button>

              <button
                type="button"
                className="auth-link"
                onClick={() => onNavigate?.("login")}
                style={{ marginLeft: 12 }}
              >
                Back to login
              </button>
            </div>
          </form>
        </section>
      </main>

      <Footer />
    </>
  );
}
