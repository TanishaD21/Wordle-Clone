import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signup } from "../services/authService"; // Import API function
import "./SignUp.css"; // Keep styles in a separate CSS file

const Signup = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(""); // API error handling

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // Reset errors on input change
    setServerError(""); // Reset server error on new input
  };

  const validateForm = () => {
    let newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

    if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters long";
    }
    
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!passwordRegex.test(formData.password)) {
      newErrors.password = "Password must contain at least 8 characters, one uppercase letter, one number, and one special character";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true); // Show loading state
    setServerError(""); // Reset any previous error

    try {
        console.log("📤 Sending signup request:", formData); // Log request data

        const response = await signup({
            username: formData.username,
            email: formData.email,
            password: formData.password,
        });

        console.log("✅ Signup successful:", response);

        navigate("/login"); // Redirect after successful signup
    } catch (error) {
        console.error("❌ Signup error:", error);

        // Log full response if available
        if (error.response) {
            console.error("❌ Server Response:", error.response.data);
            setServerError(error.response.data.message || "Signup failed. Please try again.");
        } else {
            setServerError("Network error. Please check your connection.");
        }
    } finally {
        setLoading(false);
    }
};


  return (
    <div className="container">
      <div className="doodle doodle1">🎯</div>
      <div className="doodle doodle2">🎲</div>
      <div className="doodle doodle3">🎮</div>
      <div className="doodle doodle4">🔠</div>
      <h1 className="game-over">WORDLE</h1>
      <div className="signup-form">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input type="text" name="username" value={formData.username} onChange={handleChange} required />
            {errors.username && <div className="error-message">{errors.username}</div>}
          </div>

          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
            {errors.email && <div className="error-message">{errors.email}</div>}
          </div>

          <div className="form-group">
            <label>Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required />
            <div className="password-requirements">
              Password must contain:
              <ul>
                <li>At least 8 characters</li>
                <li>One uppercase letter</li>
                <li>One number</li>
                <li>One special character</li>
              </ul>
            </div>
            {errors.password && <div className="error-message">{errors.password}</div>}
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
            {errors.confirmPassword && <div className="error-message">{errors.confirmPassword}</div>}
          </div>

          {serverError && <div className="error-message">{serverError}</div>}

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        <div className="links">
          Already have an account? <a href="/login">Login here</a>
        </div>
      </div>
    </div>
  );
};

export default Signup;
