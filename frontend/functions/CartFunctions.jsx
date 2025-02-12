// src/utils/cartUtils.js
import api from "../utils/api";
import { useAuthStore } from "../utils/authStore";
import { useCart } from "./CartContext";


export function trackProductView(productId) {
  const maxHistoryLength = 10;
  const viewedProducts = JSON.parse(localStorage.getItem('viewed_products') || '[]');
  const timestamp = new Date().toISOString();

  // Check if product is already in history and update timestamp if found
  const existingProduct = viewedProducts.find(p => p.id === productId);
  if (existingProduct) {
      existingProduct.timestamp = timestamp;
  } else {
      // Add new product view
      viewedProducts.push({ id: productId, timestamp });
      if (viewedProducts.length > maxHistoryLength) {
          viewedProducts.shift();  // Keep only the last 10 viewed items
      }
  }

  localStorage.setItem('viewed_products', JSON.stringify(viewedProducts));
}

export async function postViewedProducts() {
  const viewedProducts = JSON.parse(localStorage.getItem('viewed_products') || '[]');
  
  try {
      await api.post('/api/viewed-products/', { viewed_products: viewedProducts });
      console.log("Viewed products synced successfully");
  } catch (error) {
      console.error("Error syncing viewed products:", error);
  }
}

export async function postSearchedProducts() {
  const searchedProducts = JSON.parse(localStorage.getItem('search_history') || '[]');
  
  try {
      await api.post('/api/searched-products/', { search_history: searchedProducts });
      console.log("Searched products synced successfully");
  } catch (error) {
      console.error("Error syncing viewed products:", error);
  }
}


export const getTotalCartQuantity = async () => {
    const isAuthenticated = useAuthStore.getState().isLoggedIn();
    let totalQuantity = 0;
  
    if (isAuthenticated) {
      // For logged-in users, fetch cart quantity from the server
      try {
        const response = await api.get('/api/cart/count/');
        totalQuantity = response.data.total_quantity;
      } catch (error) {
        console.error("Error fetching total quantity from server:", error);
      }
    } else {
      // For guest users, calculate the total quantity from localStorage
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
    }
  
    return totalQuantity;
  };

// Function to add items to cart
export const addToCart = (productId, variantId = null, quantity = 1) => {
    const isAuthenticated = useAuthStore.getState().isLoggedIn();
  if (isAuthenticated) {
    // If the user is logged in, send the request to the backend
    api.post('/api/cart/add/', {
      product_id: productId,
      variant_id: variantId,
      quantity: quantity,
    })
    .then(response => {
      console.log("Item added to server-side cart", response.data);
    })
    .catch(error => {
      console.error("Error adding to server-side cart:", error);
    });
  } else {
    // If the user is not logged in, save the cart item in localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Check if the item already exists in the cart
    const itemIndex = cart.findIndex(item => item.productId === productId && item.variantId === variantId);
    
    if (itemIndex !== -1) {
      // If the item exists, update the quantity
      cart[itemIndex].quantity += quantity;
    } else {
      // If the item doesn't exist, add it to the cart
      cart.push({
        productId: productId,
        variantId: variantId,
        quantity: quantity,
      });
    }

    // Save the updated cart back to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    console.log("Item added to localStorage cart");
  }
};

export const removeFromCart = (productId, variantId = null) => {
    const isAuthenticated = useAuthStore.getState().isLoggedIn();
  
    if (isAuthenticated) {
      // If the user is logged in, send the request to the backend
      api.post('/api/cart/remove/', {
        product_id: productId,
        variant_id: variantId,
      })
      .then(response => {
        console.log("Item removed from server-side cart", response.data);
      })
      .catch(error => {
        console.error("Error removing from server-side cart:", error);
      });
    } else {
      // If the user is not logged in, remove the item from localStorage
      let cart = JSON.parse(localStorage.getItem('cart')) || [];
  
      // Find the index of the item in the cart
      const itemIndex = cart.findIndex(item => item.productId === productId && item.variantId === variantId);
      
      if (itemIndex !== -1) {
        // If the item exists, remove it from the cart
        cart.splice(itemIndex, 1); // Remove the item from the array
        // Save the updated cart back to localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        console.log("Item removed from localStorage cart");
      } else {
        console.log("Item not found in localStorage cart");
      }
    }
  };
  

// Function to sync cart from localStorage to the server after login
export const syncCartAfterLogin = async () => {

    const localCart = JSON.parse(localStorage.getItem('cart')) || [];
  
    // Check if localCart has items to sync
    if (localCart.length > 0) {
      try {
        // Prepare the cart data to match the expected format in the backend
        const itemsToSync = localCart.map(item => ({
          productId: item.productId, // Ensure you use the correct field names
          variantId: item.variantId, // Ensure this field is optional
          quantity: item.quantity,     // Ensure quantity is included
        }));
  
        // Send the localStorage cart items to the server for syncing
        const response = await api.post('/api/cart/sync/', { cart: itemsToSync });
        // If successful, clear localStorage cart (because it's now in the backend)
        localStorage.removeItem('cart');
        console.log("LocalStorage cart synced with server:", response.data);
      } catch (error) {
        console.error("Error syncing cart after login:", error.response?.data || error.message);
      }
    }
  };

export const sendCartToServer = () => {
  // Step 1: Retrieve the cart from localStorage
  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  // Step 2: Check if the cart is empty
  if (cart.length === 0) {
    console.log("No items in the cart to send to the server.");
    return;
  }

  // Step 3: Format the cart data for the server
  const cartData = cart.map(item => ({
    product_id: item.productId,
    variant_id: item.variantId,
    quantity: item.quantity
  }));

  // Step 4: Send the cart data to the backend
  api.post('/api/cart/save/', { cart: cartData })
    .then(response => {
      console.log("Cart successfully sent to the server", response.data);

      // Optional: If the cart is saved successfully, clear the cart in localStorage
      localStorage.removeItem('cart');
      console.log("Local storage cart cleared.");
    })
    .catch(error => {
      console.error("Error sending cart to the server:", error);
    });
};
