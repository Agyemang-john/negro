"use client";

import React, {useEffect, useState} from 'react';
import Link from 'next/link';
import ReactImageMagnify from 'react-image-magnify';

// import { Link } from 'react-router-dom';
// import { useAuthStore } from '../../api/authStore';
// import api from '../../api/api';
// import { SERVER_URL } from '../../api/constants';
// import { useCart } from '../../utils/CartContext';
// import { useLocation, useNavigate, useParams } from 'react-router-dom';
// import { refreshDetail, truncateText } from '../../utils/Function';
import Rating from '@mui/material/Rating';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import Divider from '@mui/material/Divider';
import RoomIcon from '@mui/icons-material/Room';
import SafetyCheckIcon from '@mui/icons-material/SafetyCheck';
import Forward30Icon from '@mui/icons-material/Forward30';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
// import BasicModal from '../partials/Modal';
// import SizeChart from '../partials/SizeChart';
import XIcon from '@mui/icons-material/X';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import PinterestIcon from '@mui/icons-material/Pinterest';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import FavoriteIcon from '@mui/icons-material/Favorite';
import VerifiedIcon from '@mui/icons-material/Verified';

import ListItemText from '@mui/material/ListItemText';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import WhereToVoteIcon from '@mui/icons-material/WhereToVote';



const SizeColorProduct = ({ productData }) => {
  // const { cartCount, orderSummary, address, refreshCart } = useCart(); 
  // const { sku, slug }= useParams();
  const [open, setOpen] = useState(false);
  const [isFollowing, setFollowing] = useState(productData.is_following);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [address, setAddress] = useState(null);
  const [quantity, setQuantity] = useState(1);
  // const [variantId, setVariantId] = useState(variant.id);
  const [isInCart, setIsInCart] = useState(false);
  const isAuthenticated = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState(null);
  const [p, setProduct] = useState(productData.product);
  const [mainImage, setMainImage] = useState(productData.variant_data.variant.image || null);

  const [productDetail, setProdductDetail] = useState(productData.product);
  const [variantDetail, setvariantDetail] = useState(productData.variant_data.variant);
  const [sizeDetail, setSizeDetail] = useState(productData.variant_data.sizes);
  const [colorDetail, setcolorDetail] = useState(productData.variant_data.colors);
  const [allImages, setAllImages] = useState(productData.p_images);
  const [variantimages, setVarImages] = useState(productData.variant_data.variant_images);


const [openchart, setOpenChart] = React.useState(false);
  const [scroll, setScroll] = React.useState('paper');

const handleClickOpen = (scrollType) => () => {
  setOpenChart(true);
  setScroll(scrollType);
};

const handleCloseChart = () => {
  setOpenChart(false);
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
                                <a className="product-gallery-item active" href="#">
                                    <img onClick={() => setMainImage(variantDetail.image)} src={`${variantDetail.image}`} alt="product side" />
                                </a>

                              {variantimages.length < 1 ? (
                                <>
                                  {allImages && allImages.map((p) => (
                                      <a key={p.id} href="#" className="product-gallery-item" >
                                          <img onClick={() => setMainImage(p.images)} src={`${p.images}`} alt="product cross" />
                                      </a>
                                  ))}
                                </>
                              ):(
                                <>
                                  {variantimages && variantimages.map((p) => (
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
                                        <a key={v.id} className={`child ${variantDetail.id === v.id ? 'active' : ''} ${v.quantity < 1 ? 'unavailable': ''}`} onClick={() => handleImageClick(v)} >
                                            <img title={v.color.name} src={`${v.image}`} alt="product desc"/>
                                        </a>
                                    ))}
                                </div>
                            </Typography>

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
          <Box sx={{borderRadius: 2}} className="p-6 mb-6 bg-white shadow-sm rounded-">

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
                  <Typography className="hover:underline">
                    {isAuthenticated ? (
                      <Box sx={{ cursor: 'pointer' }} onClick={handleOpen} >{address ? (truncateText(address.address, 34)):(<>Add Address</>)}</Box> 
                    ):(
                      <Box sx={{ cursor: 'pointer' }} onClick={handleOpen}>Login to add address</Box> 
                    )}
                  </Typography>
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
          </Box>
        </aside>
    </div>

  )
}

export default SizeColorProduct
