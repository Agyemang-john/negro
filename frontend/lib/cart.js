import api from '@/utils/api';

// Add to Cart
export const addToCart = async (productId, quantity, variantId = null) => {
    try {
        const response = await api.post('/api/cart/add/', {
            product_id: productId,
            variant_id: variantId,
            quantity
        });
        return response.data;
    } catch (error) {
        console.error('Error adding to cart:', error.response?.data || error.message);
        throw error;
    }
};

// Remove from Cart
export const removeFromCart = async (productId, variantId = null) => {
    try {
        const response = await api.post('/api/cart/remove/', {
            product_id: productId,
            variant_id: variantId
        });
        return response.data;
    } catch (error) {
        console.error('Error removing from cart:', error.response?.data || error.message);
        throw error;
    }
};

export const getCartQuantity = async () => {
    try {
      // If the user is authenticated, call the backend API
        const response = await api.get('/api/v1/order/quantity/');  // Adjust this URL based on your backend route
        return response.data.quantity;
    } catch (error) {
      console.error('Error fetching cart quantity:', error.response?.data || error.message);
      return 0;  // Return 0 if there is an error
    }
  };

// Sync Cart on Login
export const syncCartOnLogin = async () => {
    try {
        await api.post('/api/cart/merge/'); // No need to send `cart_session_id`
    } catch (error) {
        console.error('Error merging guest cart:', error.response?.data || error.message);
    }
};
