import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authService"; // Import the login API function
import "./Login.css"; // Ensure you have a CSS file for styling

const Login = ({ setUser }) => {
    const [formData, setFormData] = useState({ username: "", password: "" });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const navigate = useNavigate();

    // Handle input changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: "" }); // Reset errors on input change
        setErrorMessage(""); // Reset server error
    };

    // Form validation
    const validateForm = () => {
        let newErrors = {};
        if (formData.username.length < 3) {
            newErrors.username = "Username must be at least 3 characters long";
        }
        if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters long";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        
        setLoading(true);
        setErrorMessage(null);

        try {
            // Call the login API function
            const userData = await login(formData);
            
            setUser(userData); // Update global state (if using Context)
            localStorage.setItem("user", JSON.stringify(userData)); // Save user data

            navigate("/profile"); // Redirect to profile page after login
        } catch (error) {
            setErrorMessage(error.message || "Login failed. Please try again.");
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
            <div className="login-form">
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input type="text" id="username" name="username" value={formData.username} onChange={handleChange} required />
                        {errors.username && <div className="error-message">{errors.username}</div>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required />
                        {errors.password && <div className="error-message">{errors.password}</div>}
                    </div>

                    <button type="submit" className="submit-btn" disabled={loading}>
                        {loading ? "Logging in..." : "Login"}
                    </button>
                    
                    {errorMessage && <div className="error-message">{errorMessage}</div>}
                </form>

                <div className="links">
                    <a href="#">Forgot Password?</a>
                    <a href="/signup">Sign Up</a>
                </div>
            </div>
        </div>
    );
};

export default Login;
