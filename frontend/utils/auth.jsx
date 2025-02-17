import Cookies from 'js-cookie';
import {jwtDecode} from 'jwt-decode';  // Correct default import
import { useAuthStore } from "./authStore"; // State management (Zustand, Recoil, etc.)
import axios from 'axios';
import api from './api';  // Placeholder, adjust accordingly
import { SERVER_URL } from './constants';

/**
 * Set the authenticated user by storing tokens and updating the user state.
 * @param {string} access_token - The JWT access token.
 * @param {string} refresh_token - The JWT refresh token.
 */
export const setAuthUser = (access_token, refresh_token, first_name) => {
    try {
        // Set access and refresh tokens in cookies
        Cookies.set("access_token", access_token, { secure: false });
        Cookies.set("refresh_token", refresh_token, { secure: false });
        // Cookies.set("access_token", access_token, { expires: 1, secure: false });
        // Cookies.set("refresh_token", refresh_token, { expires: 7, secure: false });

        // Decode access token to get user details
        const user = first_name;

        // Update user state in your store
        if (user) useAuthStore.getState().setUser(user);
        useAuthStore.getState().setLoading(false);
    } catch (error) {
        console.error('Error setting user auth state:', error);
        clearAuthUser();  // Clear tokens if something goes wrong
    }
};

/**
 * Clear access and refresh tokens from cookies and reset user state.
 */
export const clearAuthUser = () => {
    try {
        Cookies.remove("access_token");
        Cookies.remove("refresh_token");
        const { resetUser, setLoading } = useAuthStore.getState();
        resetUser();
        setLoading(false);
    } catch (error) {
        console.error('Error clearing user auth state:', error);
    }
};

/**
 * Check if a valid access token exists and is not expired.
 * @returns {boolean} - Whether the user is authenticated.
 */
export const isAuthenticated = () => {
    const token = Cookies.get("access_token");
    if (token) {
        try {
            const decodedToken = jwtDecode(token);
            return decodedToken.exp * 1000 > Date.now();  // Check if token is still valid
        } catch (error) {
            console.error('Error decoding token:', error);
        }
    }
    return false;
};


/**
 * Refresh the access token using the refresh token.
 * @returns {string|null} - The new access token, or null if refresh failed.
 */
export const refreshAccessToken = async () => {
    const refreshToken = Cookies.get("refresh_token");
    if (!refreshToken) return null;

    try {
        const { data } = await axios.post(`${SERVER_URL}/api/v1/auth/token/refresh/`, { refresh: refreshToken });
        setAuthUser(data.access, refreshToken);  // Update tokens
        return data.access;
    } catch (error) {
        console.error('Error refreshing token:', error);
        clearAuthUser();  // Clear auth if refresh fails
        return null;
    }
};

/**
 * Set the user based on the access token; refresh it if expired.
 */
export const setUser = async () => {
    const accessToken = Cookies.get("access_token");
    const refreshToken = Cookies.get("refresh_token");

    if (!accessToken || !refreshToken) return;

    if (isAccessTokenExpired(accessToken)) {
        const newToken = await refreshAccessToken();
        if (newToken) setAuthUser(newToken, refreshToken);
    } else {
        setAuthUser(accessToken, refreshToken);
    }
};

/**
 * Check if the access token has expired.
 * @param {string} accessToken - The JWT access token.
 * @returns {boolean} - True if the access token is expired, false otherwise.
 */
export const isAccessTokenExpired = (accessToken) => {
    try {
        const decodedToken = jwtDecode(accessToken);
        return decodedToken.exp < Date.now() / 1000;  // Compare token expiry with current time
    } catch (error) {
        return true;  // If there's an error, treat the token as expired
    }
};

export const logoutUser = async () => {
    try {
        const refreshToken = Cookies.get('refresh_token'); // Retrieve the refresh token from cookies

        if (!refreshToken) {
            console.error('No refresh token found.');
            return { success: false, message: 'No refresh token available.' };
        }

        // Send the logout request to the server
        const response = await api.post('/api/v1/auth/logout/', {
            refresh_token: refreshToken,
        });

        // Clear tokens from cookies
        Cookies.remove('access_token');
        Cookies.remove('refresh_token');

        return { success: true, message: response.data.message };
    } catch (error) {
        console.error('Logout failed:', error.response?.data || error.message);
        return { success: false, message: error.response?.data?.bad_token || 'Logout failed.' };
    }
};


