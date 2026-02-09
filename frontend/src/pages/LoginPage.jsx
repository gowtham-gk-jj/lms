import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { authApi } from "../api/authApi";
import "./LoginPage.css";

const LoginPage = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login, user } = useAuth();
  const navigate = useNavigate();

  /* ===============================
     ROLE-BASED REDIRECT
  ================================ */
  const redirectUserByRole = useCallback(
    (role) => {
      const normalizedRole = role?.toLowerCase();

      switch (normalizedRole) {
        case "admin":
          navigate("/admin-dashboard", { replace: true });
          break;
        case "trainer":
        case "instructor":
          navigate("/trainer-dashboard", { replace: true });
          break;
        case "learner":
        case "student":
          navigate("/", { replace: true });
          break;
        default:
          navigate("/", { replace: true });
      }
    },
    [navigate]
  );

  /* ===============================
     AUTO REDIRECT IF LOGGED IN
  ================================ */
  useEffect(() => {
    if (user?.role) {
      redirectUserByRole(user.role);
    }
  }, [user, redirectUserByRole]);

  /* ===============================
     HANDLE LOGIN
  ================================ */
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const cleanEmail = credentials.email.toLowerCase().trim();

      // 🔑 CALL API
      const response = await authApi.login(
        cleanEmail,
        credentials.password
      );

      // 🔐 UPDATE AUTH CONTEXT (ONLY PLACE THAT TOUCHES STORAGE)
      login(response);

      // ✅ GET ROLE SAFELY (supports all backend formats)
      const role =
        response.user?.role ||
        response.role ||
        response.userRole;

      if (!role) {
        throw new Error("User role not found");
      }

      redirectUserByRole(role);
    } catch (err) {
      setError(
        err.response?.data?.message || "Invalid email or password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-screen-wrapper">
      <div className="login-container-card">
        <button className="back-btn" onClick={() => navigate("/")}>
          ← Go Back
        </button>

        <div className="login-brand-section">
          <h2>Login</h2>
          <p>LMS Management Portal</p>
        </div>

        {error && (
          <div className="login-alert-box">
            <span className="alert-icon">⚠️</span> {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="login-inner-form">
          <div className="login-field">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              required
              value={credentials.email}
              onChange={(e) =>
                setCredentials({
                  ...credentials,
                  email: e.target.value,
                })
              }
            />
          </div>

          <div className="login-field">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              required
              value={credentials.password}
              onChange={(e) =>
                setCredentials({
                  ...credentials,
                  password: e.target.value,
                })
              }
            />
          </div>

          <div className="login-extra-links">
            <Link to="/forgot-password">Forgot password?</Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="login-primary-btn"
          >
            {loading ? "Logging in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
