import axios from 'axios';
import Cookies from 'js-cookie';
import { setAuthUser, refreshAccessToken } from './auth';  // Import shared logic

// Create an axios instance with a base URL
const api = axios.create({
    baseURL: 'http://localhost:8000',
    // baseURL: 'http://192.168.56.89:8000',
    withCredentials: true,
    // timeout: 10000,  // Set a timeout to prevent indefinitely hanging requests
});

// Request interceptor to attach the access token
api.interceptors.request.use(
    (config) => {
        const accessToken = Cookies.get('access_token');
        if (accessToken) {
            config.headers['Authorization'] = `Bearer ${accessToken}`;  // Attach access token
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);  // Handle request errors
    }
);

// Response interceptor to handle token expiration and refreshing
api.interceptors.response.use(
    (response) => response,  // Return response directly if it's successful
    async (error) => {
        const originalRequest = error.config;

        // If 401 Unauthorized and token has not been retried yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;  // Mark the request as retried

            try {
                // Refresh the access token using the refresh token logic from `auth.jsx`
                const newAccessToken = await refreshAccessToken();

                // If new access token is obtained, update the request headers and retry the original request
                if (newAccessToken) {
                    originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    return api(originalRequest);  // Retry the original request
                }
            } catch (refreshError) {
                console.error('Token refresh failed:', refreshError);
                // Clear cookies and redirect to login page on refresh failure
                Cookies.remove('access_token');
                Cookies.remove('refresh_token');
                window.location.href = '/auth/email';
            }
        }

        // Handle other errors
        return Promise.reject(error);
    }
);

export default api;
