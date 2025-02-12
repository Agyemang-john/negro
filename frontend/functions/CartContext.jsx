"use client";


import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuthStore } from '../utils/authStore'; // To manage auth states

// Create CartContext
const CartContext = createContext();

// Custom hook to use CartContext in any component
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  // Retrieve authentication status from the auth store
  const isAuthenticated = useAuthStore.getState().isLoggedIn();
  
  // State to manage the cart count globally
  const [progress, setProgress] = useState(false);
  const [address, setAddress] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [orderSummary, setOrderSummary] = useState({
    totalAmount: 0,
    deliveryFee: 0,
    grandTotal: 0,
    packagingFee: 0,
  });

  // Helper function to calculate cart total quantity for guest users
  const calculateLocalCartCount = () => {
    const localCart = JSON.parse(localStorage.getItem('cart')) || [];
    return localCart.reduce((total, item) => total + item.quantity, 0);
  };

  // Function to check and set the cart count (based on user auth status)
  const updateCartCount = async () => {
    if (isAuthenticated) {
      try {
        // Fetch cart data from the server if user is authenticated
        const response = await api.get('/api/cart/count/');
        setCartCount(response.data.total_quantity); // Use server data
      } catch (error) {
        console.error('Error fetching cart count from server:', error);
        setCartCount(0); // Fallback to 0 on error
      }
    } else {
      // If the user is not authenticated, calculate from localStorage
      const totalQuantity = calculateLocalCartCount();
      setCartCount(totalQuantity);
    }
  };

  // Function to calculate delivery fee, total amount, and active address
  const calculateOrderSummary = async () => {
    try {
      if (isAuthenticated) {
        // Fetch cart total and delivery fee from the server
        const cartResponse = await api.get('/api/cart/count/'); // Assumes an API endpoint exists for this
        const addressResponse = await api.get('/api/v1/address/addresses/default/'); // Assumes an API to fetch active address
        const response = await api.get('/api/cart/progress/');
        const cartProgress = response.data;
        const totalAmount = cartResponse.data.total_amount;
        const deliveryFee = cartResponse.data.total_delivery_fee;
        const grandTotal = cartResponse.data.grand_total;
        const packagingFee = cartResponse.data.packaging_fees;
        const activeAddress = addressResponse.data; // Assuming this provides the default shipping address

        // Update the order summary state
        setProgress(cartProgress);
        setAddress(activeAddress);
        setOrderSummary({
          totalAmount,
          deliveryFee,
          grandTotal,
          packagingFee,
        });
      } else {
        // For guest users, we might need a fallback approach if necessary
        setProgress(false);
        setAddress([]);
        setOrderSummary({
          totalAmount: 0,
          deliveryFee: 0,
          grandTotal: 0,
          packagingFee: 0,
        });
      }
    } catch (error) {
      setAddress([]);
      setOrderSummary({
        totalAmount: 0,
        deliveryFee: 0,
        grandTotal: 0,
        packagingFee: 0,
      });
    }
  };

  // useEffect to call updateCartCount when component mounts
  useEffect(() => {
    updateCartCount();
    calculateOrderSummary();
  }, [isAuthenticated]); // Update cart count whenever user logs in or logs out

  // Function to forcefully refresh cart count, e.g., after adding/removing items
  const refreshCart = async () => {
    await updateCartCount();
  };

  // Provide cartCount, refreshCart, and calculateOrderSummary function globally via Context
  return (
    <CartContext.Provider value={{ cartCount, refreshCart, orderSummary, address, progress, calculateOrderSummary }}>
      {children}
    </CartContext.Provider>
  );
};
