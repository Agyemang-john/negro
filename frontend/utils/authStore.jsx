// import create  from 'zustand';
import { create } from 'zustand';

// Define the Zustand store
const useAuthStore = create((set, get) => ({
    user: typeof window !== "undefined" ? JSON.parse(localStorage.getItem('user')) || null : null,
    loading: true, // Loading state to show loaders or spinners when necessary
    error: null, // Error state to manage login failures or issues

    // Action to set the user after successful login
    setUser: (user) => {
        if (typeof window !== "undefined") {
            localStorage.setItem('user', JSON.stringify(user));  // Store in browser
        }
        set(() => ({ user, loading: false, error: null }));
    },

    // Action to handle login errors
    setError: (error) => set(() => ({
        error,
        loading: false,
    })),

    // Action to toggle the loading state (useful for async req uests)
    setLoading: (loading) => set(() => ({
        loading,
    })),
    
    // Action to clear the user (for example, on logout)
    resetUser: () => set(() => ({
        user: null,
        loading: false,
        error: null,
    })),

    isLoggedIn: () => get().user !== null,

}));

export { useAuthStore };


