'use client';

import React, {useEffect, useState} from 'react';
import { useFollowToggle } from '@/hooks/useFollowToggle';
import Link from "next/link";
import ReactImageMagnify from 'react-image-magnify';
import AddToCartButton from './AddToCartButton';

import Rating from '@mui/material/Rating';
import XIcon from '@mui/icons-material/X';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import PinterestIcon from '@mui/icons-material/Pinterest';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import Divider from '@mui/material/Divider';
// import BasicModal from '../partials/Modal';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import  ProductCard  from "./SideCard";

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import WhereToVoteIcon from '@mui/icons-material/WhereToVote';
// import {
//   FacebookShareButton,
//   TwitterShareButton,
//   WhatsappShareButton,
//   TwitterIcon,
//   WhatsappIcon,
// } from 'react-share';


const NoneProduct = ({ productData, handleFollowToggle, isFollowing, followerCount, loading }) => {  
  const [data, setData] = useState(productData);
  const [isInCart, setIsInCart] = useState(productData.is_in_cart);
  const [cartQuantity, setCartQuantity] = useState(productData.cart_quantity);
  const [p, setProduct] = useState(productData.product);
  const [mainImage, setMainImage] = useState(productData.product.image || null);
  const [open, setOpen] = useState(false);
  const [p_image, setProductImages] = useState(productData.p_images);
  const [address, setAddress] = useState(null);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  console.log(data);


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
                                <a className="product-gallery-item active" href="#" >
                                    <img onClick={() => setMainImage(`${p.image}`)} src={`${p.image}`} alt="product side" />
                                </a>
                                {p_image && p_image.map((p) => (
                                    <a key={p.id} className="product-gallery-item" href="#" >
                                        <img onClick={() => setMainImage(p.images)} src={`${p.images}`} alt="product cross" />
                                    </a>
                                ))}
                                {/* Additional images should be added here */}
                            </div>
                        </div>
                    </div>
                    

                    <div className="col-md-6">
                        <div className="product-details product-details-sidebar">
                            <h1 className="product-title">{p.title}</h1>

                            <div className="ratings-container">
                            <Rating name={`rating-1`} value={data.average_rating} precision={0.5} readOnly sx={{ marginLeft: 1 }}/>
                                <a className="ratings-text" href="#product-review-link" id="review-link">( {data.review_count} Review{data.review_count !== 1 ? 's':''})</a>
                            </div>

                            <div className="product-price">
                                <span data-base-price={p.price} id="price" className="new-price">GHS{p.price.toFixed(2)}</span>
                                <span data-base-price={p.old_price} className="old-price">GHS{p.old_price.toFixed(2)}</span>
                            </div>
                            <Divider/>

                            <div className="details-filter-row details-row-size">
                                <span style={{ cursor: 'pointer' }} className="chart_link">
                                <span style={{ cursor: 'pointer'}} className="chart_link"><a href="#" id="sizeChart-button" onclick="document.getElementById('id01').style.display='block'"><AssignmentIcon />size guide</a></span>
                                </span>
                            </div>

                            <div className='d-lg-none' style={{ margin: '10px', padding: 0 }}>
                              <AddToCartButton
                                isInCart={Boolean(isInCart)}
                                productId={p?.id}
                                variantId={null}
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
                                      {p.available_in_regions.map((p) => (
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
                              {p.product_type === 'grocery' ? (
                                <Typography variant='h6'>Ingredients:</Typography>
                              ):(
                                <Typography variant='h6'>Features:</Typography>
                              )}

                              </AccordionSummary>
                              <AccordionDetails>
                                <Box className='mb-2' sx={{ mt: 1 }}>
                                  <div dangerouslySetInnerHTML={{ __html: p.features }} />
                                </Box>
                              </AccordionDetails>
                            </Accordion>

                           

                            <div className="product-details-footer details-footer-col">
                                <div className="social-icons social-icons-sm">
                                    <span className="social-label">Share:</span>
                                    
                                    <a className="social-icon" title="Facebook" target="_blank">
                                      {/* <FacebookShareButton url={productUrl} quote={productTitle}>
                                          <FacebookIcon />
                                      </FacebookShareButton> */}
                                    </a>
                                    <a className="social-icon" title="Twitter" target="_blank">
                                    {/* <TwitterShareButton url={productUrl} title={productTitle}>
                                      <XIcon/>
                                      </TwitterShareButton> */}
                                    </a>
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
            variantId={null}
            product={p}
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

export default NoneProduct
