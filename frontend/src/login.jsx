
import { useState } from "react";
import "./signup.css";
import Navbar from "./navbar";
import Footer from "./footer";
import { loginUser } from "./api";


export default function LoginPage({ onNavigate, onAuth }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    // Basic validation
    if (!form.email || !form.password) {
      setError("Both fields are required");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      if (typeof loginUser === "function") {
        const resp = await loginUser(form);
        onAuth?.(resp?.user || resp);
        setSuccess("Logged in successfully!");
        setTimeout(() => {
          if (onNavigate) onNavigate("home");
        }, 1500);
      } else {
        const response = await fetch(
          "http://cs2team70.cs2410-web01pvm.aston.ac.uk/index.php?resource=users&action=login",
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: form.email,
              password: form.password,
            }),
          },
        );
        const data = await response.json();
        if (response.ok && data.success) {
          setSuccess("Logged in successfully!");
          setTimeout(() => {
            if (onNavigate) onNavigate("home");
          }, 1500);
        } else {
          setError(data.error || "Invalid email or password");
        }
      }
    } catch (err) {
      setError(err?.message || "Error connecting to the server. Please try again later.");
    } finally {
      setLoading(false);
    }
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
            {success && <p className="auth-success">{success}</p>}

            <div className="form-actions">
              <button type="submit" className="auth-submit" disabled={loading}>
                {loading ? "Logging in..." : "Log In"}
              </button>
              <button type="button" className="auth-link" onClick={handleForgot} style={{marginLeft: 12}}>
                Forgot password?
              </button>
            </div>
          </form>

          <p className="auth-footer">
            New here?{" "}
            <button
              type="button"
              className="auth-link"
              onClick={() => onNavigate?.("signup")}
            >
              Create an account
            </button>
          </p>
        </section>
      </main>

      <Footer />
    </>
  );
}
