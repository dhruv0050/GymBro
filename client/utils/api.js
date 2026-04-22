// Central API base URL configuration
// Uses VITE_API_BASE_URL from .env, falls back to localhost:5000
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export default API_BASE_URL;
