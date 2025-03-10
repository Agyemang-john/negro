import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode'; // Correct import for jwt-decode

const PrivateRoute = () => {
    const accessToken = Cookies.get('access_token'); // Get token from cookies
    const location = useLocation();

    const isAuthenticated = () => {
        if (!accessToken) return false;

        try {
            const decodedToken = jwtDecode(accessToken);
            // Check if the token has expired (exp is in seconds)
            const currentTime = Math.floor(Date.now() / 1000);
            return decodedToken.exp > currentTime;
        } catch (error) {
            console.error("Error decoding token:", error); // Log error for debugging
            return false; // Token is invalid
        }
    };

    // If not authenticated, redirect to login with 'next' URL
    if (!isAuthenticated()) {
        const nextUrl = location.pathname + location.search; // Current location
        return <Navigate to={`/auth/email?next=${encodeURIComponent(nextUrl)}`} state={{ from: location }} replace />;
    }

    // If authenticated, render the protected content
    return <Outlet />;
};

export default PrivateRoute;

