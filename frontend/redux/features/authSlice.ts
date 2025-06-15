import { createSlice } from '@reduxjs/toolkit';

interface AuthState {
	isAuthenticated: boolean;
	isLoading: boolean;
	name: string | null;
}

const initialState = {
	isAuthenticated: false,
	isLoading: true,
	name: null,
} as AuthState;

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		setAuth: state => {
			state.isAuthenticated = true;
		},
		logout: state => {
			state.isAuthenticated = false;
			state.name = null;
		},
		finishInitialLoad: state => {
			state.isLoading = false;
		},
		hydrateAuth: (state, action) => {
			state.isAuthenticated = !!action.payload?.name;
			state.name = action.payload?.name || null;
			state.isLoading = false;  // Optional: Mark loading complete
		}
	},
});

export const { setAuth, logout, finishInitialLoad, hydrateAuth} = authSlice.actions;
export default authSlice.reducer;
