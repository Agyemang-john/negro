"use client";

import React, {useEffect, useState} from 'react'
// import useVariantChange, {refreshDetail, truncateText}  from "../../utils/Function";
import Link from 'next/link';
import ReactImageMagnify from 'react-image-magnify';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import AddToCartButton from './AddToCartButton';

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
import Drawer from '@mui/material/Drawer'


const ColorProduct = ({ productData }) => {
  const { sku, slug } = useParams(); // Get route params
  const searchParams = useSearchParams();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

    const [address, setAddress] = useState(null);
    const [isFollowing, setFollowing] = useState(productData?.is_following);

    const [variantImages, setVariantImages] = useState(productData?.variant_data?.variant_images);
    const [isInCart, setIsInCart] = useState(productData?.is_in_cart);
    const [cartQuantity, setCartQuantity] = useState(productData?.cart_quantity);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [productDetail, setProductDetail] = useState(productData?.product);
    const [variantDetail, setVariantDetail] = useState(productData?.variant_data?.variant);
    const [colorDetail, setColorDetail] = useState(productData?.variant_data?.colors);
    const [allImages, setAllImages] = useState(productData?.p_images);
    const [mainImage, setMainImage] = useState(productData?.variant_data?.variant?.image);
    const [error, setError] = useState(null);
    

    const fetchProductData = async (variantId) => {
      try {
        const url = new URL(`${process.env.NEXT_PUBLIC_HOST}/api/v1/product/${sku}/${slug}/`);
        if (variantId) url.searchParams.append("variantid", variantId);
  
        const res = await fetch(url, { method: "GET", cache: "no-store", credentials: "include"});
        const data = await res.json();
  
        // Update State with New Data
        setIsInCart(data?.is_in_cart);
        setCartQuantity(data?.cart_quantity);
        setMainImage(data?.variant_data?.variant?.image);
        setProductDetail(data?.product);
        setVariantDetail(data?.variant_data?.variant);
        setColorDetail(data?.variant_data?.colors);
        setAllImages(data?.p_images);
        setVariantImages(data?.variant_data?.variant_images);
      } catch (error) {
        console.error("Error fetching product data:", error);
        setError("Failed to load product data");
      }
    };
  
    const handleVariantChange = (newVariantId) => {
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.set("variantid", newVariantId);
      router.replace(newUrl.toString(), { scroll: false });

      fetchProductData(newVariantId);
    };
  
    // Function to Handle Image Click
    const handleImageClick = (variantId) => {
      handleVariantChange(variantId);
    };


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
                                  

                                {!variantImages ? (
                                  <>
                                    {allImages.map((p) => (
                                        <Link href={'#'} key={p.id} className="product-gallery-item" >
                                            <img onClick={() => setMainImage(p.images)} src={`${p.images}`} alt="product cross" />
                                        </Link>
                                    ))}
                                  </>
                                ):(
                                  <>
                                    {variantImages && variantImages.map((p) => (
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
                              <AddToCartButton
                                isInCart={Boolean(isInCart)}
                                productId={productDetail?.id}
                                variantId={variantDetail?.id}
                                quantityInCart={cartQuantity}
                               
                              />
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
          <>
            <AddToCartButton
              isInCart={Boolean(isInCart)}
              productId={productDetail?.id}
              variantId={variantDetail?.id}
              quantityInCart={cartQuantity}
              
            />
          </>
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
                    Sold by: <strong>{productDetail.vendor.name} {productDetail.vendor.is_subscribed ? (<VerifiedIcon fontSize='large' color='info'/>): ''}  </strong>
                  {/* Verified badge */}
                  </Typography>
                  
                  {/* Link to seller info */}
                  <Link href={`/seller/${productDetail.vendor.slug}`} underline="hover" color="info" variant="body2">
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
