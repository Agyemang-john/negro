import axios from 'axios';
import { useAddToCartMutation } from '@/redux/productApi/cartApiSlice';

import { useAppSelector } from '@/redux/hooks';

// Type definition for Cart Item
interface CartItem {
  productId: number;
  variantId?: number | null;
  quantity: number;
}

// Add to Cart
export const addToCart = async (productId: number, quantity: number, variantId: number | null = null) => {
  return addToCartOnServer(productId, quantity, variantId);
};

// Add to Cart (Server)
const addToCartOnServer = async (productId: number, quantity: number, variantId: number | null) => {
  try {
    const { data } = await axios.post(
      `${process.env.NEXT_PUBLIC_HOST}/api/cart/add/`,
      { product_id: productId, variant_id: variantId, quantity },
      { withCredentials: true }
    );
    return data;
  } catch (error: any) {
    console.error('Error adding to cart:', error.response?.data || error.message);
    throw error;
  }
};

// Remove from Cart
export const removeFromCart = async (productId: number, variantId: number | null = null) => {
  return  removeFromCartOnServer(productId, variantId)
};

// Remove from Cart (Server)
const removeFromCartOnServer = async (productId: number, variantId: number | null) => {
  try {
    const { data } = await axios.post(
      `${process.env.NEXT_PUBLIC_HOST}/api/cart/remove/`,
      { product_id: productId, variant_id: variantId },
      { withCredentials: true }
    );
    return data;
  } catch (error: any) {
    console.error('Error removing from cart:', error.response?.data || error.message);
    throw error;
  }
};
