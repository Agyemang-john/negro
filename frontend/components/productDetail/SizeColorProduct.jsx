"use client";

import React, {useEffect, useState} from 'react';
import Link from 'next/link';
import ProductImage from "./ProductImage";
import AddToCartButton from './AddToCartButton';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';

import { useParams, useRouter, useSearchParams } from 'next/navigation';
import  ProductCard  from "./SideCard";
import Rating from '@mui/material/Rating';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import Divider from '@mui/material/Divider';
// import SizeChart from '../partials/SizeChart';
import XIcon from '@mui/icons-material/X';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import PinterestIcon from '@mui/icons-material/Pinterest';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import WhereToVoteIcon from '@mui/icons-material/WhereToVote';



const SizeColorProduct = ({ productData, handleFollowToggle, isFollowing, followerCount, loading }) => {
    const { sku, slug } = useParams(); // Get route params
    const searchParams = useSearchParams();
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [address, setAddress] = useState(null);
    const { isAuthenticated } = useAppSelector(state => state.auth);

    const [variantImages, setVariantImages] = useState(productData?.variant_data?.variant_images);
    const [isInCart, setIsInCart] = useState(productData?.is_in_cart);
    const [cartQuantity, setCartQuantity] = useState(productData?.cart_quantity);
    const [productDetail, setProductDetail] = useState(productData?.product);
    const [variantDetail, setVariantDetail] = useState(productData?.variant_data?.variant);
    const [colorDetail, setColorDetail] = useState(productData?.variant_data?.colors);
    const [sizeDetail, setSizeDetail] = useState(productData?.variant_data?.sizes);
    const [allImages, setAllImages] = useState(productData?.p_images);
    const [mainImage, setMainImage] = useState(productData?.variant_data?.variant?.image);


  const [openchart, setOpenChart] = React.useState(false);
    const [scroll, setScroll] = React.useState('paper');

  const handleClickOpen = (scrollType) => () => {
    setOpenChart(true);
    setScroll(scrollType);
  };

  const handleCloseChart = () => {
    setOpenChart(false);
  };

    const handleSizeChange = async (event) => {
      const selectedSizeId = event.target.value;
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/v1/product/ajaxcolor/`, {
          method: "POST", // Set the request method to POST
          credentials: "include", // Include the credentials
          cache: "no-store",
          headers: {
            "Content-Type": "application/json", // Specify JSON data
          },
          body: JSON.stringify({
            size: selectedSizeId,
            productid: productDetail?.id,
          }),
        });
        const data = await res.json();
        setColorDetail(data?.colors);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    const fetchProductData = async (variantId) => {
      try {
        const url = new URL(`${process.env.NEXT_PUBLIC_HOST}/api/v1/product/${sku}/${slug}/`);
        if (variantId) url.searchParams.append("variantid", variantId);
  
        const res = await fetch(url, { method: "GET", cache: "no-store", credentials: "include"});
        const data = await res.json();

        setIsInCart(data?.is_in_cart);
        setCartQuantity(data?.cart_quantity);
        setSizeDetail(data?.variant_data.sizes);
        setAllImages(data?.p_images);
        setMainImage(data?.variant_data?.variant?.image);
        setProductDetail(data?.product);
        setVariantDetail(data?.variant_data?.variant);
        setColorDetail(data?.variant_data?.colors);
        setVariantImages(data?.variant_data?.variant_images);
        console.log(data)
      } catch (error) {
        console.error('Error fetching product data:', error);
        setError('Failed to load product data');
      }
    };
  
    const handleVariantChange = (newVariantId) => {
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.set("variantid", newVariantId);
      router.replace(newUrl.toString(), { scroll: false });

      fetchProductData(newVariantId);
    };

    const onSelect = (v) => {
      if (v.quantity > 0) {
        handleVariantChange(v.id);
        return; // Don't do anything if the variant is not available
      } 
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
                              <ProductImage mainImage={mainImage} />
                              <a herf="#" id="btn-product-gallery" className="btn-product-gallery">
                              <ZoomInIcon />
                              </a>
                          </figure>
                            <div id="product-zoom-gallery" className="product-image-gallery">
                                <a className="product-gallery-item active" href="#">
                                    <img onClick={() => setMainImage(variantDetail.image)} src={`${variantDetail.image}`} alt="product side" />
                                </a>

                              {!variantImages? (
                                <>
                                  {allImages && allImages.map((p) => (
                                      <a key={p.id} href="#" className="product-gallery-item" >
                                          <img onClick={() => setMainImage(p.images)} src={`${p.images}`} alt="product cross" />
                                      </a>
                                  ))}
                                </>
                              ):(
                                <>
                                  {variantImages && variantImages.map((p) => (
                                    <a key={p.id} href="#" className="product-gallery-item" >
                                          <img onClick={() => setMainImage(p.images)} src={`${p.images}`} alt="product cross" />
                                    </a>
                                  ))}
                                </>
                              )}
                            </div>
                        </div>
                    </div>
                    
                    {/* <SizeChart open={openchart} handleClose={handleCloseChart} /> */}
                    <div className="col-md-6">
                        <div className="product-details product-details-sidebar">
                          <h1 className="product-title">{productDetail.title}</h1>

                            <div className="ratings-container">
                              <Rating name={`rating-1`} value={productData.average_rating} precision={0.5} readOnly sx={{ marginLeft: 1 }}/>
                                <a className="ratings-text" href="#product-review-link" id="review-link">( {productData.review_count} Review{productData.review_count !== 1 ? 's':''})</a>
                            </div>

                            <div className="product-price">
                                <span id="price" className="new-price">GHS{variantDetail.price.toFixed(2)}</span>
                                <span className="old-price">GHS{productDetail.old_price.toFixed(2)}</span>
                            </div> 

                            <Divider />

                            {/* <Skeleton variant="rectangular" width={210} height={118} /> */}
                            <Typography variant="h5" 
                              color={"success"}
                              // color={product.inStock ? "success.main" : "error.main"}
                              sx={{ mt: 1 }}
                              >
                              In stock
                              {/* {product.inStock ? 'In Stock' : 'Out of Stock'} */}
                            </Typography>

                           
                            

                            <Typography variant='body3' className="d-flex justify-content-between mb-2">
                                <div className="d-flex justify-content-between">
                                    <span for="size-guide">Selected:  </span> &nbsp;&nbsp;
                                    <span className="fw-bold">{variantDetail.color.name}, </span> &nbsp; <span className="fw-bold"> {variantDetail.size.name}</span>
                                </div>
                                <span style={{ cursor: 'pointer'}} className="chart_link"><a id="sizeChart-button" onClick={handleClickOpen('paper')}><AssignmentIcon />size guide</a></span>
                            </Typography>

                            <Typography className="details-filter-row details-row-size mb-2">
                                <label>Sizes:</label>
                                <div className="product-nav swatch-container product-nav-thumbs">
                                    <select name="size" id="mySelect" onChange={(event) => handleSizeChange(event)} className="form-control">
                                      {sizeDetail.map((rs) => (
                                        <option key={rs.size.id} value={rs.size.id} selected={variantDetail.size.id === rs.size.id}>
                                          {rs.size.name}
                                        </option>
                                      ))}
                                    </select>
                                </div>
                            </Typography>

                            <Typography className="details-filter-row details-row-size mb-2">
                                <label>Colors:</label>
                                <div className="product-nav swatch-container product-nav-thumbs">
                                  {colorDetail.map((v) => (
                                    <a
                                      key={v.id}
                                      className={`child ${variantDetail?.id === v.id ? 'active' : ''} ${v.quantity < 1 ? 'unavailable' : ''}`}
                                      onClick={() => onSelect(v)} // Calls onSelect with the selected variant
                                    >
                                      <img title={v.color.name} src={v.image} alt="product desc" />
                                    </a>
                                  ))}
                                </div>
                            </Typography>

                            <div className='d-lg-none' style={{ margin: '10px', padding: 0 }}>
                              <AddToCartButton
                                isInCart={Boolean(isInCart)}
                                productId={productDetail?.id}
                                variantId={variantDetail?.id}
                                quantityInCart={cartQuantity}
                               
                              />
                            </div>

                            <Accordion
                              sx={{
                                mb: 2,
                                boxShadow: 'none',    // Remove box shadow
                                border: 'none',       // Remove border
                                '&:before': {
                                  display: 'none',    // Remove the default divider line
                                },
                              }}
                             >
                              <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1-content" id="panel1-header" >
                                <Typography variant='h6'>Ships to:</Typography>
                              </AccordionSummary>
                              <AccordionDetails>
                                <Typography>
                                  <List>
                                    <Grid container direction="row" spacing={2}>
                                      {productDetail.available_in_regions.map((p) => (
                                        <>
                                        <Grid key={p.id}>
                                        <ListItem>
                                          <WhereToVoteIcon color='success' /> {p.name}
                                        </ListItem>
                                        </Grid>
                                        </>
                                      ))}
                                    </Grid>
                                  </List>
                                </Typography>
                              </AccordionDetails>
                            </Accordion>

                            <Accordion
                              sx={{
                                boxShadow: 'none',    // Remove box shadow
                                border: 'none',       // Remove border
                                '&:before': {
                                  display: 'none',    // Remove the default divider line
                                },
                              }}
                              >
                              <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1-content" id="panel1-header" >
                              {productDetail.product_type === 'grocery' ? (
                                <Typography variant='h6'>Ingredients:</Typography>
                              ):(
                                <Typography variant='h6'>Features:</Typography>
                              )}

                              </AccordionSummary>
                              <AccordionDetails>
                                <Box className='mb-2' sx={{ mt: 1 }}>
                                  <div dangerouslySetInnerHTML={{ __html: productDetail.features }} />
                                </Box>
                              </AccordionDetails>
                            </Accordion>

                            <div className="product-details-footer details-footer-col">
                                <div className="social-icons social-icons-sm">
                                    <Typography className="social-label">Share:</Typography>
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
          <ProductCard
            isInCart={Boolean(isInCart)}
            cartQuantity={cartQuantity}
            variant={variantDetail}
            product={productDetail}
            followerCount={followerCount}
            isFollowing={isFollowing}
            handleFollowToggle={handleFollowToggle}
            loading={loading}
            address={address}
            handleOpen={handleOpen}
          />
        </aside>
    </div>

  )
}

export default SizeColorProduct
