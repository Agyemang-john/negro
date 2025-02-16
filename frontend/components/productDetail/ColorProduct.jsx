"use client";

import React, {useEffect, useState} from 'react'
// import useVariantChange, {refreshDetail, truncateText}  from "../../utils/Function";
import Link from 'next/link';
import ReactImageMagnify from 'react-image-magnify';
import { useParams, useRouter, useSearchParams } from 'next/navigation';

// import QuantityCounter from '../../utils/Quantity';
// import { addToCart } from '../../utils/CartFunctions';
// import { useAuthStore } from '../../api/authStore';
// import { useCart } from '../../utils/CartContext';
import Rating from '@mui/material/Rating';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import XIcon from '@mui/icons-material/X';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import PinterestIcon from '@mui/icons-material/Pinterest';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import Divider from '@mui/material/Divider';
import RoomIcon from '@mui/icons-material/Room';
import SafetyCheckIcon from '@mui/icons-material/SafetyCheck';
import Forward30Icon from '@mui/icons-material/Forward30';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
// import BasicModal from '../partials/Modal';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import FavoriteIcon from '@mui/icons-material/Favorite';
import VerifiedIcon from '@mui/icons-material/Verified';
import api from '@/utils/api';


const ColorProduct = ({ productData }) => {
  const router = useRouter();
  const { sku, slug } = useParams();
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // const handleVariantChange = useVariantChange(p.slug, p.id, p.sub_category.slug);
  const [address, setAddress] = useState(null);
  const [isFollowing, setFollowing] = useState(productData.is_following);

  const [variantimages, setVarImages] = useState(productData.variant_data.variant_images);
  const [quantity, setQuantity] = useState(1);
    // const [variantId, setVariantId] = useState(variant.id); // You can set initial variant if applicable
    // const [productId, setProductId] = useState(p.id);
    const [isInCart, setIsInCart] = useState(false);
    const isAuthenticated = useState(false);
    const [loading, setLoading] = useState(true); 
    const [p, setProduct] = useState(productData.product);
    const [mainImage, setMainImage] = useState(productData.variant_data.variant.image || null);

    const [productDetail, setProdductDetail] = useState(productData.product);
    const [variantDetail, setvariantDetail] = useState(productData.variant_data.variant);
    const [colorDetail, setcolorDetail] = useState(productData.variant_data.colors);

    const [allImages, setAllImages] = useState(productData.p_images);
    const [error, setError] = useState(null);
    

    const fetchProductData = async (variantId) => {
      try {
        const { data } = await api.get(`/api/v1/product/${sku}/${slug}/`, {
          params: { variantid: variantId || '' },
        });
        setMainImage(data.variant_data.variant.image);
        setProdductDetail(data.product);
        setvariantDetail(data.variant_data.variant);
        setcolorDetail(data.variant_data.colors);
        setAllImages(data.p_images);
        setVarImages(data.variant_data.variant_images);
        console.log("Hellooo: ",{...data})
      } catch (error) {
        console.error('Error fetching product data:', error);
        setError('Failed to load product data');
      }
    };
  
    const handleVariantChange = async (newVariantId) => {
      await fetchProductData(newVariantId);
  
      // Update the URL without reloading the page
      router.push(`?variantid=${newVariantId}`, { scroll: false });
    };

    const handleImageClick = async (v) => {
      console.log(v)
    
      await handleVariantChange(v);
    
      setLoading(false);
    };


  
    // // Check cart on mount
    // useEffect(() => {
    //   checkCart();
    // }, [ isAuthenticated]);
  
    // const checkCart = async () => {
    //   try {
    //     setLoading(true);
    //     const localCart = JSON.parse(localStorage.getItem('cart')) || [];
    
    //     // Find item in local cart for guest users
    //     const itemInLocalCart = localCart.find(
    //       item => item.productId === productId && item.variantId === variantId
    //     );
    
    //     // If the user is authenticated, check the server cart
    //     if (isAuthenticated) {
    //       const serverCartResponse = await checkServerCart(productId, variantId);
    //       await handleServerCartResponse(serverCartResponse);
    //     } 
    //     // For guest users, handle the local cart check
    //     else if (itemInLocalCart) {
    //       setQuantity(itemInLocalCart.quantity);
    //       setIsInCart(true);
    //     } else {
    //       setIsInCart(false);
    //     }
    //   } catch (error) {
    //     console.error("Error checking cart:", error);
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    
    // // Helper to check the cart on the server
    // const checkServerCart = async (productId, variantId) => {
    //   try {
    //     const response = await api.get(`/api/cart/check/`, {
    //       params: { product_id: productId, variant_id: variantId }
    //     });
    //     return response.data;
    //   } catch (error) {
    //     console.error("Error checking cart on server:", error);
    //     throw error;
    //   }
    // };
    
    // // Handle server response and update the cart state accordingly
    // const handleServerCartResponse = async (response) => {
    //   if (response.inCart) {
    //     setQuantity(response.quantity);
    //     setIsInCart(true);
    //   } else {
    //     setIsInCart(false);
    //   }
    // };

    // const handleVariantChange = async (newVariantId) => {
    //   try {
    //     // Send a GET request to the server to fetch the product data based on the selected variant
    //     const response = await api.get(`/api/product/${slug}/${id}/${subCategorySlug}/`, {
    //       params: { variantid: newVariantId || '' },
    //     });

    //     setVariantId(newVariantId);
    //     setProdductDetial(response.data.product);
    //     setAllImages(response.data.p_images);
    //     setvariantDetial(response.data.variant_data.variant);
    //     setcolorDetial(response.data.variant_data.colors);
    //     setVarImages(response.data.variant_data.variant_images);
    //     // Get the current URL and its search parameters
    //     const currentUrl = new URL(window.location.href); // Create a URL object from the current URL
    //     const searchParams = currentUrl.searchParams; // Get the search params object

    //     // Update the variantid parameter in the URL
    //     searchParams.set('variantid', newVariantId);
    //     // Use window.history.replaceState to update the URL without causing a page refresh
    //     window.history.replaceState(null, '', `${currentUrl.pathname}?${searchParams.toString()}`);
    //   } catch (error) {
    //     // Handle any errors that occur during the request
    //     setError('Error fetching product data');    
    //   } 
    // };
  
    // const handleAddToCart = async () => {
    //   setLoading(true);
    //   if (isAuthenticated) {
    //     await addToCartOnServer(1); // Default 1 quantity when first added
    //   } else {
    //     await addToLocalStorage(1);
    //   }
    //   await checkCart();
    //   setLoading(false);
    // };
  
    // const addToCartOnServer = async (qty) => {
    //   try {
    //     // Make the API call to add the item to the server-side cart
    //     const response = await api.post('/api/cart/add/', {
    //       product_id: productId,
    //       variant_id: variantId,
    //       quantity: qty,
    //     });
    
    //     // Set the item as in the cart if the response is successful
    //     setIsInCart(true);
    //     // Optionally, you can log or handle the response here if needed
    //     console.log('Item added to cart:', response.data);
    //   } catch (error) {
    //     // Handle any errors that occur during the API call
    //     console.error("Error adding to server-side cart:", error);
    //   }
    //   await refreshCart();
    // };
  
    // const addToLocalStorage = async (qty) => {
    //   const cart = JSON.parse(localStorage.getItem('cart')) || [];
    //   const itemIndex = cart.findIndex(item => item.productId === productId && item.variantId === variantId);
  
    //   if (itemIndex !== -1) {
    //     cart[itemIndex].quantity += qty; // Update existing quantity
    //   } else {
    //     cart.push({ productId, variantId, quantity: qty }); // Add new item with quantity
    //   }
  
    //   localStorage.setItem('cart', JSON.stringify(cart));
    //   setIsInCart(true);
    //   // Refresh the cart count after updating local storage
    //   await refreshCart();
    // };
    
    // const handleIncrease = async  () => {
    //   setQuantity(prev => prev + 1);
    //   setLoading(true);
    //   if (isAuthenticated) {
    //     await addToCartOnServer(1); // Add one more unit to server-side cart
    //   } else {
    //     await addToLocalStorage(1); // Add one more unit to local storage cart
    //   }
    //   refreshCart();
    //   setLoading(false);
    // };
  
    // const handleDecrease = async  () => {
    //   if (quantity > 1) {
    //     setQuantity(prev => prev - 1);
  
    //     if (isAuthenticated) {
    //       await addToCartOnServer(-1); // Remove one unit from server-side cart
    //     } else {
    //       await addToLocalStorage(-1); // Remove one unit from local storage cart
    //     }
    //   } else {
    //     await handleRemoveFromCart(); // Remove completely if quantity is 1
    //   }
    //   // refreshCart();
    // };
  
    // const handleRemoveFromCart = async () => {
    //   setLoading(true);
    //   if (isAuthenticated) {
    //     removeFromServer();
    //   } else {
    //     removeFromLocalStorage();
    //   }
    //   await checkCart();
    //   await refreshCart();
    //   setLoading(false);
    // };
  
    // const removeFromServer = async () => {
    //   try {
    //     // Make the API call to remove the item from the server-side cart
    //     const response = await api.post('/api/cart/remove/', {
    //       product_id: productId,
    //       variant_id: variantId,
    //     });
    
    //     // If successful, update the state to reflect the removal
    //     setIsInCart(false);
    //     setQuantity(0);
    //   } catch (error) {
    //     // Handle any errors that occur during the API call
    //     console.error("Error removing from server-side cart:", error);
    //   }
    // };
  
    // const removeFromLocalStorage = async () => {
    //   const cart = JSON.parse(localStorage.getItem('cart')) || [];
    //   const updatedCart = cart.filter(item => !(item.productId === productId && item.variantId === variantId));
    //   // Update localStorage with the modified cart
    //   localStorage.setItem('cart', JSON.stringify(updatedCart));
    //   // Update the UI to reflect that the item is no longer in the cart
    //   setIsInCart(false);
    //   setQuantity(0);
    // };



  const isVariant = productDetail && colorDetail;



  return (
    <div className="row">
        <div className="col-lg-9">
            <div className="product-details-top">
                <div className="row">
                    <div className="col-md-6">
                        <div className="product-gallery">
                        <figure className="product-main-image">
                              <span className="product-label label-top">Top</span>
                                <ReactImageMagnify
                                  
                                  {...{
                                    smallImage: {
                                      alt: 'Product Image',
                                      isFluidWidth: true,
                                      src: mainImage,
                                    },
                                    largeImage: {
                                      src: mainImage,
                                      width: 1300,
                                      height: 1300,
                                    },
                                  }}
                                  style={{
                                    position: 'relative', // Required for z-index to work
                                    zIndex: 10,           // Adjust the z-index as needed
                                  }}
                                />
                              <a herf="#" id="btn-product-gallery" className="btn-product-gallery">
                              <ZoomInIcon />
                              </a>
                          </figure>
                            

                            <div id="product-zoom-gallery" className="product-image-gallery">
                                <Link className="product-gallery-item active" href="#" >
                                    <img onClick={() => setMainImage(variantDetail.image)} src={`${variantDetail.image}`} alt="product side" />
                                </Link>
                                  

                                {!variantimages ? (
                                  <>
                                    {allImages.map((p) => (
                                        <Link href={'#'} key={p.id} className="product-gallery-item" >
                                            <img onClick={() => setMainImage(p.images)} src={`${p.images}`} alt="product cross" />
                                        </Link>
                                    ))}
                                  </>
                                ):(
                                  <>
                                    {variantimages && variantimages.map((p) => (
                                      <Link href={'#'} key={p.id} className="product-gallery-item" >
                                            <img onClick={() => setMainImage(p.images)} src={`${p.images}`} alt="product cross" />
                                      </Link>
                                    ))}
                                  </>
                                )}
                            </div>
                        </div>
                    </div>
                    

                    <div className="col-md-6">
                        <div className="product-details product-details-sidebar">
                          {/* {loading ? (
                             <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                          ):(
                          )} */}
                          <h1 className="product-title">{productDetail.title}</h1>

                          <div className="ratings-container">
                            <Rating name={`rating-1`} value={productData.average_rating} precision={0.5} readOnly sx={{ marginLeft: 1 }}/>
                                <a className="ratings-text" href="#product-review-link" id="review-link">( {productData.review_count} Review{productData.review_count !== 1 ? 's':''})</a>
                          </div>

                            <div className="product-price">
                                <span id="price" className="new-price">GHS{variantDetail.price.toFixed(2)}</span>
                                <span className="old-price">GHS{productDetail.old_price.toFixed(2)}</span>
                            </div>
                            <Divider/>
                            {/* <Skeleton variant="rectangular" width={210} height={118} /> */}

                            <div className="d-flex justify-content-between mb-2">
                                <div className="d-flex justify-content-between">
                                    <span for="size-guide">Selected:  </span> &nbsp;&nbsp;
                                    <span id="selected_variant" className="fw-bold">{variantDetail.color.name}</span>
                                </div>
                                <span style={{ cursor: 'pointer'}} className="chart_link"><a id="sizeChart-button" onclick="document.getElementById('id01').style.display='block'"><AssignmentIcon />size guide</a></span>
                            </div>

                            <div className="details-filter-row details-row-size">
                                <label>Colors:</label>
                                <div className="product-nav swatch-container product-nav-thumbs">
                                    {colorDetail.map((v) => (
                                        <a key={v.id} className={`child ${variantDetail.id === v.id ? 'active' : ''}`} onClick={() => handleImageClick(v.id)} >
                                            <img title={v.color.name} src={`${v.image}`} alt="product desc"/>
                                        </a>
                                    ))}
                                </div>
                            </div>

                            <div className='d-lg-none' style={{ margin: '10px', padding: 0 }}>
                                <div id="add_to_cart_btn" className="cart-option">
                                    {!isInCart ? (
                                        <div id="button_toggle">
                                            <button disabled={loading} title="Add to shopping Cart" onClick={''} className="cart-btn shadow w-100">
                                            {loading ? "Loading..." : "Add to Cart"}
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="input-counter">
                                            <button disabled={loading} className="minus-button shadow-sm text-white" onClick={''}>
                                                -
                                            </button>
                                            <input className="quantity_total_" type="text" min={1} value={quantity} readOnly />
                                            <button disabled={loading} className="plus-button shadow-sm text-white" onClick={''}>
                                                +
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="product-details-footer details-footer-col">
                                {/* <div className="product-cat">
                                    <span>Category:</span>
                                    <a href={p.sub_category.category.main_category.get_absolute_url}>{p.sub_category.category.main_category.title}</a>,
                                    <a href={p.sub_category.category.get_absolute_url}>{p.sub_category.category.title}</a>,
                                    <a href={p.sub_category.get_absolute_url}>{p.sub_category.title}</a>
                                </div> */}

                                <div className="social-icons social-icons-sm">
                                    <span className="social-label">Share:</span>
                                    <a href="#" className="social-icon" title="Facebook" target="_blank"><FacebookIcon /></a>
                                    <a href="#" className="social-icon" title="Twitter" target="_blank"><XIcon /></a>
                                    <a href="#" className="social-icon" title="Instagram" target="_blank"><InstagramIcon /></a>
                                    <a href="#" className="social-icon" title="Pinterest" target="_blank"><PinterestIcon /></a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <aside className='col-lg-3'>
          <div className="p-6 mb-6 bg-white shadow-sm rounded-lg">

          <div className='d-none d-md-block' style={{ margin: '10px', padding: 0 }}>
            <div id="add_to_cart_btn" className="cart-option">
                {!isInCart ? (
                    <div id="button_toggle">
                        <button disabled={loading} title="Add to shopping Cart" onClick={''} className="cart-btn shadow w-100">
                        {loading ? "Loading..." : "Add to Cart"}
                        </button>
                    </div>
                ) : (
                    <div className="input-counter">
                        <button disabled={loading} className="minus-button shadow-sm text-white" onClick={''}>
                            -
                        </button>
                        <input className="quantity_total_" type="text" min={1} value={quantity} readOnly />
                        <button disabled={loading} className="plus-button shadow-sm text-white" onClick={''}>
                            +
                        </button>
                    </div>
                )}
            </div>
          </div>
            <Divider />

            {/* Delivery Section */}
            <h6 className="font-semibold text-gray-800 mt-2">Delivery & Location</h6>
            {/* <Button onClick={handleOpen}>Open modal from here</Button> */}
            {/* <BasicModal open={open} handleClose={handleClose} /> */}
            <ul>
              <li className="flex items-start mb-4">
                <div className='flex items-center'>
                <RoomIcon fontSize='medium'/>
                  <span className="block text-md text-gray-700 hover:underline">
                    {isAuthenticated ? (
                      <Box sx={{ cursor: 'pointer' }} onClick={handleOpen} >{address ? (truncateText(address.address, 34)):(<>Add Address</>)}</Box> 
                    ):(
                      <Box sx={{ cursor: 'pointer' }} onClick={handleOpen} >Login to add address</Box> 
                    )}
                  </span>
                </div>
              </li>
              <li className="border-t border-gray-300 mt-4"></li>
            </ul>

            {/* Return & Warranty Section */}
            <h6 className=" font-semibold text-gray-800 mt-2">Return & Warranty</h6>
            <ul>
              <li className="flex items-center mb-1">
                <SafetyCheckIcon/>
                <span className="text-md text-gray-700">100% Authentic</span>
              </li>
              <li className="flex items-center mb-1">
                <Forward30Icon/>
                <span className="text-md text-gray-700">10 Days Return</span>
              </li>
              <li className="flex items-center">
                <CalendarMonthIcon/>
                <span className="text-md text-gray-700">12 Months Warranty</span>
              </li>
            </ul>

            <Box sx={{ mt: 3, p: 2, border: '1px solid #e0e0e0', borderRadius: 2 }}>
              {/* Responsive Grid layout */}
              <Grid container alignItems="center" spacing={2}>
                {/* Seller Info */}
                {/* Seller Info */}
                <Box>
                  <Typography variant="h6" component="div" gutterBottom>
                    Sold by: <strong>{p.vendor.name} {p.vendor.is_subscribed ? (<VerifiedIcon fontSize='large' color='info'/>): ''}  </strong>
                  {/* Verified badge */}
                  </Typography>
                  
                  {/* Link to seller info */}
                  <Link href={`/seller/${p.vendor.slug}`} underline="hover" color="info" variant="body2">
                    View Seller Info
                  </Link>
                </Box>

                {/* Follow Button */}
                <Box textAlign={{ xs: 'center', sm: 'right' }}>
                  <Button
                    variant="contained"
                    color={isFollowing ? "secondary" : "info"}
                    startIcon={<FavoriteIcon />}
                    size="medium"
                    onClick={''}
                    sx={{ textTransform: 'none', width: '100%' }}
                  >
                    {isFollowing ? "Unfollow" : "Follow"}
                  </Button>
                </Box>
              </Grid>

              {/* Divider */}
              <Divider sx={{ my: 2 }} />

              {/* Additional Seller Info */}
              <Box>
                <Typography variant="body1" color="text.secondary">
                  Ships from: <strong>AwesomeVendor's Warehouse</strong>
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Returns accepted within 30 days
                </Typography>
              </Box>
            </Box>

          </div>
        </aside>

    </div>

  )
}

export default ColorProduct
