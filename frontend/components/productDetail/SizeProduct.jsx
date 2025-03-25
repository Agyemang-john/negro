import React, {useEffect, useState} from 'react';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import Link from 'next/link';
import ReactImageMagnify from 'react-image-magnify';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import AddToCartButton from './AddToCartButton';

import Rating from '@mui/material/Rating';
import XIcon from '@mui/icons-material/X';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import PinterestIcon from '@mui/icons-material/Pinterest';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import AssignmentIcon from '@mui/icons-material/Assignment';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import  ProductCard  from "./SideCard";

import BasicModal from '@/components/modals/Modal';
// import SizeChart from '../partials/SizeChart';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import WhereToVoteIcon from '@mui/icons-material/WhereToVote';
import Typography from '@mui/material/Typography';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';


const SizeProduct = ({ data, handleFollowToggle, isFollowing, followerCount, loading }) => {
    const { sku, slug } = useParams(); // Get route params
    const searchParams = useSearchParams();
    const router = useRouter();

    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const { isAuthenticated } = useAppSelector(state => state.auth);
    const [address, setAddress] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    
   
    const [variantImages, setVariantImages] = useState(data?.variant_data?.variant_images);
    const [isInCart, setIsInCart] = useState(data?.is_in_cart);
    const [cartQuantity, setCartQuantity] = useState(data?.cart_quantity);
    const [productDetail, setProductDetail] = useState(data?.product);
    const [variantDetail, setVariantDetail] = useState(data?.variant_data?.variant);
    const [sizeDetail, setSizeDetail] = useState(data?.variant_data?.sizes);
    const [allImages, setAllImages] = useState(data?.p_images);
    const [mainImage, setMainImage] = useState(data?.variant_data?.variant?.image);
    const [error, setError] = useState(null);
    const [sizeName, setSizeName] = useState(variantDetail?.size.name);

    const [openchart, setOpenChart] = React.useState(false);
    const [scroll, setScroll] = React.useState('paper');

    const handleClickOpen = (scrollType) => () => {
      setOpenChart(true);
      setScroll(scrollType);
    };

    const handleCloseChart = () => {
      setOpenChart(false);
    }

    const fetchProductData = async (variantId) => {
      setIsLoading(true)
      try {
        const url = new URL(`${process.env.NEXT_PUBLIC_HOST}/api/v1/product/${sku}/${slug}/`);
        if (variantId) url.searchParams.append("variantid", variantId);
  
        const res = await fetch(url, { method: "GET", cache: "no-store", credentials: "include"});
        const data = await res.json();

        console.log(data);
        setSizeName(data?.variant_data?.variant.size.name);
        setIsInCart(data?.is_in_cart);
        setCartQuantity(data?.cart_quantity);
        setSizeDetail(data.variant_data.sizes);
        setMainImage(data?.variant_data?.variant?.image);
        setProductDetail(data?.product);
        setVariantDetail(data?.variant_data?.variant);
        setAllImages(data?.p_images);
        setVariantImages(data?.variant_data?.variant_images);
        
      } catch (error) {
        console.error('Error fetching product data:', error);
        setError('Failed to load product data');
      } finally {
        setIsLoading(false);
      }
    };
  
    const handleVariantChange = (newVariantId) => {

      const newUrl = new URL(window.location.href);
      newUrl.searchParams.set("variantid", newVariantId);
      router.replace(newUrl.toString(), { scroll: false });

      fetchProductData(newVariantId);
    };

    const onSelect = (v) => {
        handleVariantChange(v);
    };

    const nameShow = (variant) => {
      setSizeName(variant.size.name);
    }
    const nameRemove = () => {
      setSizeName(variantDetail?.size.name);
    }


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
                                    <img 
                                      style={{ 
                                        border: mainImage === productDetail.image ? "2px solid grey" : "1px solid grey",
                                      }} 
                                      onClick={() => setMainImage(productDetail.image)} 
                                      src={`${productDetail.image}`} 
                                      alt="product side" />
                                </Link>

                                {variantImages.length === 0 ? (
                                  <>
                                    {allImages && allImages.map((p) => (
                                        <Link href={'#'} key={p.id} className="product-gallery-item">
                                            <img 
                                              style={{ 
                                                border: mainImage === p.images ? "2px solid grey" : "1px solid grey",
                                              }}
                                              onClick={() => setMainImage(p.images)} 
                                              src={`${p.images}`} 
                                              alt="product cross" 
                                            />
                                        </Link>
                                    ))}
                                  </>
                                ):(
                                  <>
                                    {variantImages && variantImages.map((p) => (
                                      <Link href={'#'} key={p.id} className="product-gallery-item" >
                                            <img 
                                              style={{ 
                                                border: mainImage === p.images ? "2px solid grey" : "1px solid grey",
                                              }}
                                              onClick={() => setMainImage(p.images)} 
                                              src={`${p.images}`} 
                                              alt="product cross" 
                                            />
                                      </Link>
                                    ))}
                                  </>
                                )}
                            </div>
                        </div>
                    </div>
                    

                    <div className="col-md-6">
                        <div className="product-details product-details-sidebar">
                          {/* <SizeChart open={openchart} handleClose={handleCloseChart} /> */}
                          <h1 className="product-title">{productDetail.title}</h1>

                          <div className="ratings-container">
                            <Rating name={`rating-1`} value={data.average_rating} precision={0.5} readOnly sx={{ marginLeft: 1 }}/>
                                <a className="ratings-text" href="#product-review-link" id="review-link">( {data.review_count} Review{data.review_count !== 1 ? 's':''})</a>
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
                                    <span id="selected_variant" className="fw-bold">{sizeName}</span>
                                </div>
                                <span style={{ cursor: 'pointer'}} className="chart_link"><a id="sizeChart-button" onClick={handleClickOpen('paper')}><AssignmentIcon />size guide</a></span>
                            </div>

                            <Grid container spacing={1} sx={{ mb: 1 }}>
                              {sizeDetail.map((variant) => (
                                <Grid size={{ sm: 3, xs: 3 }} key={variant.id}>
                                  <Button
                                    variant={variantDetail?.id === variant.id ? "outlined" : "outlined"}
                                    disabled={isLoading}
                                    sx={{
                                      position: "relative",
                                      borderRadius: 2,
                                      textTransform: "none",
                                      fontWeight: "bold",
                                      border: variantDetail?.id === variant.id ? "2px solid black" : "1px solid grey",
                                      bgcolor: variantDetail?.id === variant.id ? "white" : "white",
                                      color: "black",
                                      "&:hover": {
                                        bgcolor: "grey.300",
                                      },
                                      minWidth: 85,
                                      overflow: "hidden",
                                      ...(variant.quantity < 1 && {
                                        pointerEvents: "none",
                                        opacity: 0.6,
                                        "&::after": {
                                          content: '""',
                                          position: "absolute",
                                          top: "50%",
                                          left: 0,
                                          width: "100%",
                                          height: "2px",
                                          backgroundColor: "black",
                                          transform: "rotate(-45deg)",
                                        } 
                                      })
                                    }}
                                    onClick={() => onSelect(variant?.id)}
                                    onMouseOver={() => nameShow(variant)}
                                    onMouseLeave={() => nameRemove()}
                                  >
                                    {variant.size.name}
                                  </Button>
                                </Grid>
                              ))}
                            </Grid>

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

        <BasicModal open={open} handleClose={handleClose} />

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

export default SizeProduct
