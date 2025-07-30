import axios from "axios";

const API_URL = "http://localhost:5000/api/users";

// Function to get user profile data
export const getUserProfile = async () => {
    try {
        const token = localStorage.getItem("token"); // Get auth token
        if (!token) return null;

        const response = await axios.get(`${API_URL}/profile`, {
            headers: { "x-auth-token": token }, // ✅ Use "x-auth-token" header
        });

        return response.data;
    } catch (error) {
        console.error("❌ Error fetching user profile:", error.response?.data || error.message);
        return null;
    }
};

// Function to update user profile (e.g., display name)
export const updateUserProfile = async (updatedData) => {
    try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No authentication token");

        const response = await axios.put(`${API_URL}/update`, updatedData, {
            headers: { "x-auth-token": token }, // ✅ Use "x-auth-token" header
        });

        return response.data;
    } catch (error) {
        console.error("❌ Error updating profile:", error.response?.data || error.message);
        throw error;
    }
};
