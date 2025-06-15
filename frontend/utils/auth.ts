import axios from 'axios';
import { cookies } from 'next/headers';

const baseURL = process.env.NEXT_PUBLIC_HOST;

export async function verifyUserServer(): Promise<any | null> {
  const cookieStore = cookies();
  const accessToken = (await cookieStore).get('access')?.value;
  const refreshToken = (await cookieStore).get('refresh')?.value;

  if (!refreshToken) return null;

  const axiosInstance = axios.create({
    baseURL,
    headers: {
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
    },
    withCredentials: true,
  });

  // Add interceptor to refresh on 400
  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 400 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          await axios.post(`${baseURL}/api/jwt/refresh/`, {
            refresh: refreshToken,
          });

          return axiosInstance(originalRequest);
        } catch (refreshError) {
          console.warn('Token refresh failed:', refreshError);
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );

  // Now verify (this will use interceptors if needed)
  try {
    await axiosInstance.post('/api/jwt/verify/');
    return { authenticated: true };
  } catch (err) {
    console.warn('Final auth failure:', err);
    return null;
  }
}
