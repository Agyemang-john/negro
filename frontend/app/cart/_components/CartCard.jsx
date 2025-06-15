"use client";

import React, { useEffect, useState } from 'react';
import { updateGuestCart, deleteFromGuestCart } from '../_lib/cart';
import { useAppSelector } from '@/redux/hooks';
import axiosClient from '@/lib/clientFetch';
import { useAddToCartMutation } from "@/redux/productApi/cartApiSlice";
import SummaryCard from './SummaryCard';
import Card from '@mui/material/Card';
import CircularProgress from '@mui/material/CircularProgress';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Link from '@mui/material/Link';
import { toast } from 'react-toastify';


const truncateText = (text, maxLength) => {
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};

const CartCard = ({ cartItems, totalAmount, packagingFee}) => {
  const [addToCart] = useAddToCartMutation();
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useAppSelector(state => state.auth);
  const [items, setCartItems] = useState(cartItems);
  const [amount, setTotalAmount] = useState(totalAmount);
  const [fee, setFee] = useState(packagingFee);
  const [loading, setLoading] = useState(false);

  const deleteCartItem = async (item) => {
    setLoading(true);
    const productId = item.product.id;
    const variantId = item.variant ? item.variant.id : null;

    try {
      let response;

      if (isAuthenticated) {
        response = await axiosClient.post(`/api/v1/order/remove-cart/`, { product_id: productId, variant_id: variantId });
      } else {
        response = deleteFromGuestCart(productId, variantId);
      }

      toast.success(response.message);
        
    } catch (error) {
        console.error('Error removing item:', error);
    } finally {
        await fetchCartItems();
        setLoading(false);
    }
  };

  const fetchCartItems = async () => {
    setLoading(true);
    try {
        let response;
        response = await axiosClient.get(`/api/v1/order/cart/`);
         
        setCartItems(response.data.items);
        setTotalAmount(response.data.total_amount);
        setFee(response.data.packaging_fee);
    } catch (err) {
        console.log("Error", err)
    } finally {
        setLoading(false);
    }
  };

  const handleAddToCart = async (item, change) => {
    console.log("Hello..........")
      const productId = item.product.id;
      const variantId = item.variant ? item.variant.id : null;
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
        // // setInCart(response.is_in_cart);
        // setQuantity(response.quantity);
        // // setOutOfStock(response.is_out_of_stock || null);
      } catch (err) {
        toast.error(err.data?.detail || "Item was not added to cart");
        console.error('Failed to add to cart:', err);
      } finally {
        await fetchCartItems();
      }
    };


    if (loading) {
      return <div>{'Loading.....'}</div>;
    }

  return (
    <main className="container">
      {items && items.length === 0 ? (
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="error-info text-center">
                <div className="error-content">
                  <h5>No Cart Item Found</h5>
                  <p>
                    Sorry, <strong>Dear Customer</strong>, your cart is empty. Please return to the
                    homepage.
                  </p>
                  <div className="error-button">
                    <Link href="/" className="error-btn">
                      Shop More!
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div id="cart_items" className="bg-light">
          <div className="row main-div">
            <div className="col-lg-8 col-md-8 collg8">
              {items?.map((c, i) => (
                <section className="allData shadow-sm" key={i}>
                  <div id="cartdiv" className="main-section">
                    <div className="d-flex space-x-5 justify-content-between">
                      <div className="pb-0 mb-0 product-thumbnail">
                        <Link href={`/${c?.product?.sku}/${c?.product?.slug}`} className="product-thumbnail">
                          {c?.product?.variant !== 'None' ? (
                            <img
                              className="product-thumbnail mn-200"
                              src={c?.variant?.image}
                              width="100"
                              alt=""
                            />
                          ) : (
                            <img
                              className="product-thumbnail mn-200"
                              src={c?.product?.image}
                              width="100"
                              alt=""
                            />
                          )}
                        </Link>
                        <div className="align-items-center w-100">
                          <button
                            disabled={loading} onClick={() => deleteCartItem(c)}
                            className="badge btn-block ml-15 px-2 py-2 shadow-sm shadow-sm border text-dark bg-light"
                          >
                            Remove
                          </button>
                        </div>
                      </div>

                      <div className="w-100 vertical-container">
                        <div>
                          <h5 className="cart-item-title">
                            <Link href={`/${c?.product.sku}/${c.product.slug}`}>
                              {truncateText(c?.product.title, 40)}
                            </Link>
                          </h5>
                          <p>
                            {c?.variant ? (
                              <>
                                {c.variant.size ? <>Size: <span>{c.variant.size.name}</span></> : null}
                                {c.variant.size && c.variant.color ? ' | ' : ''}
                                {c.variant.color ? (
                                  <>Color: <span>{c.variant.color.name}</span></>
                                ) : null}
                              </>
                            ) : (
                              <>No variant available</>
                            )}
                          </p>
                        </div>

                        <div>
                          <div className="d-flex justify-content-between align-items-center">
                            <h4 className="product-price">
                              {!c.variant ? (
                                <span className="new-price">GHS {c.product?.price.toFixed(2)}</span>
                              ) : (
                                <span className="new-price">GHS {c.variant?.price.toFixed(2)}</span>
                              )}
                            </h4>
                          </div>

                          <div className="d-flex align-items-center justify-content-between">
                            <div></div>
                            <div className="input-counter">
                              <button
                                className="minus-button shadow"
                                onClick={() => handleAddToCart(c, -1)}
                              >
                                -
                              </button>
                              <input className="quantity_total_" min={0} type="text" value={c?.quantity} readOnly/>
                              <button
                                className="plus-button shadow"
                                onClick={() => handleAddToCart(c, 1,)}
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              ))}
            </div>

            <Box className="col-lg-4 col-md-4" id="summary_card" sx={{ maxWidth: '100%', padding: '' }}>
              <SummaryCard amount={amount} fee={fee}/>
            </Box>
          </div>
        </div>
      )}
    </main>
  );
};

export default CartCard;