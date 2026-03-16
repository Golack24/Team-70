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

<<<<<<< HEAD
  const handleSubmit = (event) => {
    event.preventDefault();
=======
  const handleSubmit = async (e) => {
    e.preventDefault();
>>>>>>> 687141407e5d2aec5027d96121cc881f1be4d285
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

<<<<<<< HEAD
    setSuccess("Logged in successfully.");
    setFormData({
      email: "",
      password: "",
      rememberMe: false,
    });

    setTimeout(() => {
      if (onNavigate) onNavigate("home");
    }, 1200);
=======
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
>>>>>>> 687141407e5d2aec5027d96121cc881f1be4d285
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