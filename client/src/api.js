import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api'; // Update with your backend URL

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true, // If using authentication (cookies, sessions)
});

export const loginUser = (credentials) => api.post('/auth/login', credentials);
export const signupUser = (userData) => api.post('/auth/signup', userData);
export const getUserProgress = (userId) => api.get(`/progress/${userId}`);
export const getLeaderboard = () => api.get('/leaderboard');
export const getDailyReward = (userId) => api.post(`/rewards/${userId}`);
export const getWordOfTheDay = () => api.get('/word');
export const validateWord = (word) => api.post('/word/validate', { word });
export const claimHint = (userId) => api.post(`/hints/${userId}`);

export default api;
