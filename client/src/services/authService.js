import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

// Signup API
export const signup = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/register`, userData); // Use "/register" instead of "/signup"
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};

// Login API
export const login = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/login`, userData);
        localStorage.setItem("token", response.data.token);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};

// Validate Token API (Fixed Issue)
export const validateUser = async () => {
    try {
        const token = localStorage.getItem("token");
        if (!token) return null;

        const response = await axios.get(`${API_URL}/validate`, {  // Fixed the URL
            headers: { "x-auth-token": token },
        });
        return response.data;
    } catch (error) {
        return null;
    }
};

// Logout Function
export const logout = () => {
    localStorage.removeItem("token");
};
