import axios from 'axios';
import { createServerAxios } from '@/lib/serverFetch';

export async function getUserAndCart() {
    const axiosServer = await createServerAxios();

  try {
    const [userRes, cartRes] = await Promise.all([
        axiosServer.get(`/api/users/me/`,),
        axiosServer.get(`/api/v1/order/quantity/`,),
    ]);

    const user = userRes?.data || null;
    const cartCount = cartRes?.data?.quantity || 0;

    return { user, cartCount };
  } catch (error) {
    console.error('Error fetching user or cart:', error);
    return { user: null, cartCount: 0 };
  }
}
