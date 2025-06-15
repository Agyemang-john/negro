"use client";

import React, { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { updateGuestCart, getGuestCartItem } from './../../app/cart/_lib/cart';
import { useAddToCartMutation } from "@/redux/productApi/cartApiSlice";
import { toast } from 'react-toastify';


const AddToCartButton = ({ isInCart, productId, variantId, quantityInCart, isOutOfStock }) => {
  const { isAuthenticated } = useAppSelector(state => state.auth);
  const [addToCart] = useAddToCartMutation();
  const [inCart, setInCart] = useState(isInCart);
  const [outOfStock, setOutOfStock] = useState(isOutOfStock);
  const [quantity, setQuantity] = useState(quantityInCart);
  const [isLoading, setIsLoading] = useState(false);
  console.log("Add to cart status 222: ", inCart)
  console.log("Add to cart status: ", isInCart)
  console.log(quantityInCart)

  // Initialize from cookies if guest user
  useEffect(() => {
      setInCart(isInCart);
      setQuantity(quantityInCart);
      setOutOfStock(isOutOfStock);
  }, [isInCart, quantityInCart, variantId, isOutOfStock]);

  const handleAddToCart = async (change) => {
    setIsLoading(true);
    try {
      let response;
      
      if (isAuthenticated) {
        response = await addToCart({ 
          product_id: productId, 
          variant_id: variantId, 
          quantity: change 
        }).unwrap();
      } else {
        response = updateGuestCart(productId, change, variantId);
      }

      toast.success(response.message);
      setInCart(response.is_in_cart);
      setQuantity(response.quantity);
      setOutOfStock(response.is_out_of_stock || null);
    } catch (err) {
      toast.error(err.data?.detail || "Item was not added to cart");
      console.error('Failed to add to cart:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="add_to_cart_btn" className="cart-option justify-content-center mt-1">
      {!inCart ? (
        <div id="button_toggle">
          <button
            disabled={outOfStock || isLoading}
            title="Add to shopping Cart"
            onClick={() => handleAddToCart(1)}
            className="cart-btn shadow w-100"
          >
            {isLoading ? "Loading..." : "Add to Cart"}
          </button>
        </div>
      ) : (
        <div className="input-counter">
          <button
            disabled={isLoading}
            className="minus-button shadow"
            onClick={() => handleAddToCart(-1)}
          >
            -
          </button>
          <input className="quantity_total_" min={0} type="text" value={quantity} readOnly />
          <button
            disabled={outOfStock || isLoading}
            className="plus-button shadow"
            onClick={() => handleAddToCart(1)}
          >
            +
          </button>
        </div>
      )}
    </div>
  );
};

export default AddToCartButton;