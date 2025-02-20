import React from 'react';

const AddToCartButton = ({ isInCart, loading, handleAddToCart, quantity }) => {
  return (
    <div className='d-lg-none' style={{ margin: '10px', padding: 0 }}>
      <div id="add_to_cart_btn" className="cart-option">
        {!isInCart ? (
          <div id="button_toggle">
            <button
              disabled={loading}
              title="Add to shopping Cart"
              onClick={() => handleAddToCart(1)} // Call the function with quantity 1
              className="cart-btn shadow w-100"
            >
              {loading ? "Loading..." : "Add to Cart"}
            </button>
          </div>
        ) : (
          <div className="input-counter">
            <button
              disabled={loading}
              className="minus-button shadow-sm text-white"
              onClick={() => handleAddToCart(-1)} // Decrease quantity
            >
              -
            </button>
            <input
              className="quantity_total_"
              type="text"
              min={1}
              value={quantity}
              readOnly
            />
            <button
              disabled={loading}
              className="plus-button shadow-sm text-white"
              onClick={() => handleAddToCart(1)} // Increase quantity
            >
              +
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddToCartButton;
