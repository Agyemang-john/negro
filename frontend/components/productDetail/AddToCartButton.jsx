"use client";

import React, { useState, useEffect } from "react";
import { addToCart } from "@/lib/cart";
import { useAddToCartMutation } from "@/redux/productApi/cartApiSlice";
import { toast } from 'react-toastify';

const AddToCartButton = ({ isInCart, productId, variantId, quantityInCart }) => {
  const [addToCart, { isLoading, error, data }] = useAddToCartMutation();
  const [inCart, setInCart] = useState(isInCart);
  const [quantity, setQuantity] = useState(quantityInCart|| 1);

  useEffect(() => {
    setInCart(isInCart);
    setQuantity(quantityInCart)
  }, [isInCart, quantityInCart]);

  const handleAddToCart = async (change) => {
    try {
      const response = await addToCart({ product_id: productId, variant_id: variantId, quantity: change }).unwrap();
      toast.success(response.message);
      setInCart(response.is_in_cart);
      setQuantity(response.quantity);
    } catch (err) {
      toast.error(err.data?.detail || "Item was not added to cart");
      console.error('Failed to add to cart:', err);
    }
  };

  return (
    <div id="add_to_cart_btn" className="cart-option justify-content-center">
      {!inCart ? (
        <div id="button_toggle">
          <button
            disabled={isLoading}
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
          <input className="quantity_total_" type="text" value={quantity} readOnly />
          <button
            disabled={isLoading}
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
