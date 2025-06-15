import axios from 'axios';
import Cookies from 'js-cookie';
import { useAppDispatch } from '@/redux/hooks';
import { setAuth, finishInitialLoad } from '@/redux/features/authSlice';

// Client-side instance
const accessToken = Cookies.get('access');
const guestCart = Cookies.get('guest_cart');
const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_HOST,
  withCredentials: true,
  headers: {
    ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
    ...(guestCart && { 'X-Guest-Cart': guestCart }),
    'X-SSR-Refresh': 'true',
    'Content-Type': 'application/json',
    'Cache-Control': 'no-store',
  },
});

axiosClient.interceptors.request.use(
  (config) => {
      const accessToken = Cookies.get('access');
      const guestCart = Cookies.get('guest_cart');
      if (accessToken) {
          config.headers['Authorization'] = `Bearer ${accessToken}`;  // Attach access token
      }
      if (guestCart) {
        config.headers['X-Guest-Cart'] = guestCart;
      }
      return config;
  },
  (error) => {
      return Promise.reject(error);  // Handle request errors
  }
);


// Client-side interceptor remains the same
  axiosClient.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        const dispatch = useAppDispatch();
        
        try {
          const refreshToken = Cookies.get('refresh');
          if (!refreshToken) throw new Error('No refresh token');
          const refreshResponse = await axios.post(
            `${process.env.NEXT_PUBLIC_HOST}/api/jwt/refresh/`,
            { refresh: refreshToken },
            { withCredentials: true }
          );
          dispatch(setAuth());
          const newAccessToken = refreshResponse.data.access;
          if (!newAccessToken) throw new Error('No new access token');

          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

          instance.defaults.headers.Authorization = `Bearer ${newAccessToken}`;
          return axiosClient(originalRequest);
        } catch (refreshError) {
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }
      
      return Promise.reject(error);
    }
  );

export default axiosClient;