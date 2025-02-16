"use client";

import { useParams, useRouter, useSearchParams } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
// import { SERVER_URL } from '../../api/constants';
import api from '../../utils/api'

// import Product from "./Product";
import NoneProduct from "./NoneProduct";
// import useVariantChange, {capitalizeEachWord, refreshDetail}  from "../../utils/Function";
// import { useCart } from '../../utils/CartContext';
import ColorProduct from './ColorProduct';
import SizeProduct from './SizeProduct';
import SizeColorProduct from './SizeColorProduct';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import Pagination from '@mui/material/Pagination';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Rating from '@mui/material/Rating';
// import InsertCommentIcon from '@mui/icons-material/InsertComment';
// import moment from 'moment';
import Alert from '@mui/material/Alert';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CheckIcon from '@mui/icons-material/Check';
// import { useAuthStore } from "../../api/authStore";
// import { truncateText } from '../../utils/Function'; // Adjust the path if needed
// import { postViewedProducts, trackProductView } from '../../utils/CartFunctions';
import Swal from 'sweetalert2';
// import { fetchProductData } from '@/lib/productApi';
import {fetchProductData} from '../../lib/productApi';
// import RecentlyViewedProducts from '../partials/RecentlyViewedProducts';


const StyledTypography = styled(Typography)({
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: 2,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  });
  
  const TitleTypography = styled(Typography)(({ theme }) => ({
    position: 'relative',
    textDecoration: 'none',
    '&:hover': { cursor: 'pointer' },
    '& .arrow': {
      visibility: 'hidden',
      position: 'absolute',
      right: 0,
      top: '50%',
      transform: 'translateY(-50%)',
    },
    '&:hover .arrow': {
      visibility: 'visible',
      opacity: 0.7,
    },
    '&:focus-visible': {
      outline: '3px solid',
      outlineColor: 'hsla(210, 98%, 48%, 0.5)',
      outlineOffset: '3px',
      borderRadius: '8px',
    },
    '&::before': {
      content: '""',
      position: 'absolute',
      width: 0,
      height: '1px',
      bottom: 0,
      left: 0,
      backgroundColor: theme.palette.text.primary,
      opacity: 0.3,
      transition: 'width 0.3s ease, opacity 0.3s ease',
    },
    '&:hover::before': {
      width: '100%',
    },
  }));

  const labels = {
    0.5: 'Very Poor',
    1: 'Poor',
    1.5: 'Below Average',
    2: 'Average',
    2.5: 'Fair',
    3: 'Good',
    3.5: 'Very Good',
    4: 'Great Product, Recommend!',
    4.5: 'Excellent product, Highly Recommend!',
    5: 'Outstanding',
  };


const ProductDetail = ({ initialData, sku, slug }) => {
  const [ productData, setProductData ] = useState(initialData|| null );
   // // const isAuthenticated = useAuthStore.getState().isLoggedIn();
  const [isAuthenticated, setIsAuthenticated] =  useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  // const [variantId, setVariantId] = useState(null);
  // const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // const [activeId, setActiveId] = useState(null);
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(3);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [isFollowing, setIsFollowing] = useState(productData?.is_following|| false) ;
 

  const fetchProductData = async (variantId) => {
    try {
      const response = await api.get(`/api/v1/product/${sku}/${slug}/`, {
        params: { variantid: variantId || '' },
      });

      setProductData(response.data);
    } catch (error) {
      console.error('Error fetching product data:', error);
      setError('Failed to load product data');
    }
  };

  const handleVariantChange = async (newVariantId) => {
    await fetchProductData(newVariantId);

    // Update the URL without reloading the page
    router.push(`?variantid=${newVariantId}`, undefined, { shallow: true });
  };

  // Automatically update product data when variant changes in URL
  useEffect(() => {
    const variantId = searchParams.get('variantid');
    if (variantId) {
      fetchProductData(variantId);
    }
  }, [searchParams, sku, slug]);

  const getLabel = (value) => {
    return labels[value] || '';
  };
  const handleSubmit = () => {

  }
  
  const handleFollowToggle = async () => {
    if (isAuthenticated) {
        try {
            const response = await api.post(`/api/vendor/${productData.product.vendor.slug}/`);
            const data = response.data;
            setIsFollowing(data.is_following);  // Update button state
            // setFollowersCount(data.followers_count);
        } catch (error) {
            console.error("Error toggling follow:", error);
        }
    } else{
        Swal.fire({
            position: "center",
            icon: "info",
            title: "Login to follow Seller",
            showConfirmButton: false,
            timer: 1500
        });
    }
  };
  
  // useEffect(() => {
  //   postViewedProducts();
  // }, [sku]);


  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setError(null);
  
  //   try {
  //     const response = await api.post(`/api/add-review/`, {
  //       review: reviewText,
  //       rating: rating,
  //       product: product.product.id,
  //     });
  //     console.log('Review added:', response.data);

  //     // Optionally reset the form or handle successful submission
  //     setReviewSubmitted(true);
  //     setFeedback('Thank you for your feedback! Your review has been sent for verification and will be visible soon.');
  //     setReviewText(''); // Clear the review text
  //     setRating(3); // Reset rating to default
  //   } catch (err) {
  //     if (err.response && err.response.status === 403) {
  //       // Handle the case when the user hasn't purchased the product
  //       setFeedback('You must purchase this product before leaving a review.');  // Display feedback to the user
  //     } else {
  //         setError(err.response?.data || 'An error occurred while submitting your review.'); // Handle other errors
  //     }
  //     console.error('Error adding review:', err);
  //   }
  // };


  // if (loading) return <div>Loading...</div>;
  // if (error) return <div>{error}</div>;
  // if (!product) return <div>No product data found</div>;

  const { product } = productData;

  let variantComponent;
    switch (product.variant) {
        case "None":
            variantComponent = <NoneProduct productData={productData} />;
            break;
        case "Size":
            variantComponent = <SizeProduct data={productData} handleFollowToggle={handleFollowToggle} isFollowing={isFollowing} />;
            break;
        case "Color":
            variantComponent = <ColorProduct productData={productData}/>;
            break;
        case "Size-Color":
            variantComponent = <SizeColorProduct productData={productData} />;
            break;
        default:
            variantComponent = <div>Invalid variant type.</div>;
    }


  return (
    <>
      {/* <ProductDetailHeader/> */}
          <div className="page-wrapper">
              <main className="main">
                  <nav aria-label="breadcrumb" className="breadcrumb-nav border-0 mb-0 d-none d-md-block">
                      <div className="container d-flex align-items-center">
                          <ol className="breadcrumb">
                              <li className="breadcrumb-item">
                                  <a href="/">Home</a>
                              </li>
                              <li className="breadcrumb-item">
                                  <a href="#">Products</a>
                              </li>
                              <li className="breadcrumb-item active" aria-current="page">
                                  Default
                              </li>
                          </ol>

                          <nav className="product-pager ml-auto" aria-label="Product">
                              <a className="product-pager-link product-pager-prev" href="#" aria-label="Previous" tabIndex="-1">
                                  <i className="icon-angle-left"></i>
                                  <span>Prev</span>
                              </a>

                              <a className="product-pager-link product-pager-next" href="#" aria-label="Next" tabIndex="-1">
                                  <span>Next</span>
                                  <i className="icon-angle-right"></i>
                              </a>
                          </nav>
                      </div>
                  </nav>

                  <div className="page-content">
                      <div className="container">

                      {variantComponent}

                      <div className="product-details-tab">
                          <ul className="nav nav-pills justify-content-center" role="tablist">
                              <li className="nav-item">
                                  <a className="nav-link active" id="product-desc-link" data-toggle="tab" href="#product-desc-tab" role="tab" aria-controls="product-desc-tab" aria-selected="true">Description</a>
                              </li>
                              <li className="nav-item">
                                  <a className="nav-link" id="product-info-link" data-toggle="tab" href="#product-info-tab" role="tab" aria-controls="product-info-tab" aria-selected="false">Additional information</a>
                              </li>
                              <li className="nav-item">
                                  <a className="nav-link" id="product-shipping-link" data-toggle="tab" href="#product-shipping-tab" role="tab" aria-controls="product-shipping-tab" aria-selected="false">Shipping & Returns</a>
                              </li>
                              <li className="nav-item">
                                  <a className="nav-link" id="product-review-link" data-toggle="tab" href="#product-review-tab" role="tab" aria-controls="product-review-tab" aria-selected="false">Review{productData.review_count !== 1 ? 's': ''} ({productData.review_count})</a>
                              </li>
                          </ul>
                          <div className="tab-content">
                              <div className="tab-pane fade show active" id="product-desc-tab" role="tabpanel" aria-labelledby="product-desc-link">
                                  <div className="product-desc-content">
                                      <h3>Product Information</h3>
                                      <div>
                                        {/* {product.product.description} */}
                                        <div dangerouslySetInnerHTML={{ __html: productData.product?.description }} />
                                      </div>
                                  </div>
                              </div>
                              <div className="tab-pane fade" id="product-info-tab" role="tabpanel" aria-labelledby="product-info-link">
                                  <div className="product-desc-content">
                                      <h3>Specifications</h3>
                                      <div>
                                        {/* {product.product.description} */}
                                        <div dangerouslySetInnerHTML={{ __html: productData.product?.specifications }} />
                                      </div>
                                  </div>
                              </div>
                              <div className="tab-pane fade" id="product-shipping-tab" role="tabpanel" aria-labelledby="product-shipping-link">
                                  <div className="product-desc-content">
                                      <h3>Delivery & returns</h3>
                                      <div>
                                        <div dangerouslySetInnerHTML={{ __html: productData.product?.delivery_returns}} />
                                      </div>
                                  </div>
                              </div>
                              <div className="tab-pane fade" id="product-review-tab" role="tabpanel" aria-labelledby="product-review-link">
                                  <div className="reviews">
                                      <h3>Review{productData.review_count !== 1 ? 's': ''} ({productData.review_count})</h3>
                                      <div className="review">

                                        <Grid container spacing={8} columns={12} sx={{ my: 4 }}>
                                        {productData.reviews && productData.reviews?.length > 0 ? (
                                        <>
                                          {productData.reviews && productData.reviews.map((r) =>(
                                            <Grid key={r.id} size={{ xs: 12, sm: 6 }}>
                                                <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 1, height: '100%', }} >
                                                  <Typography gutterBottom variant="h5" component="div">
                                                      <Rating name={`rating-1`} value={r.rating} precision={0.5} readOnly/>
                                                  </Typography>

                                                  <TitleTypography gutterBottom variant="h6" tabIndex={0} className={'Mui-focused'} >
                                                      {getLabel(r.rating)}
                                                  </TitleTypography>
                                                  <StyledTypography variant="body1" color="text.secondary" gutterBottom>
                                                      {r.review}
                                                  </StyledTypography>

                                                  <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, alignItems: 'center', justifyContent: 'space-between', }} >
                                                      <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'center' }}>
                                                          <AvatarGroup max={3}>
                                                              <Avatar alt="John" src="" sx={{ width: 24, height: 24 }} />
                                                          </AvatarGroup>
                                                          {/* <Typography variant="caption"> {capitalizeEachWord(r.user.first_name)} </Typography> */}
                                                      </Box> 
                                                      {/* <Typography variant="caption">{moment(r.date).fromNow()}</Typography> */}
                                                  </Box>
                                                </Box>
                                            </Grid>
                                          ))}
                                        </>
                                        ): 
                                        (<>
                                        <StyledTypography variant="body1" color="text.secondary" gutterBottom>
                                          No reviews yet. Be the first to write a review! 
                                        </StyledTypography>
                                        </>)}
                                      </Grid>

                                      {error || feedback ? (<Alert severity="error">{error|| feedback}</Alert>):''}
                                     {reviewSubmitted && (
                                        <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
                                          {feedback}
                                        </Alert>
                                      )}
                                        {!isAuthenticated || reviewSubmitted ? (
                                          <>{!isAuthenticated ? (<Alert action={
                                            <Button color="inherit" size="small"> Signin! </Button>
                                          } severity="info">Please log in to submit a review.</Alert>) : (<Alert severity="info">You have already submitted a review.</Alert>)}</>
                                        ) : (
                                        <Grid>
                                          <form onSubmit={handleSubmit} style={{ margin: '20px' }}>
                                            <Typography variant="h5" gutterBottom>Add a Review</Typography>
                                            <TextField fullWidth multiline rows={4} value={reviewText} onChange={(e) => setReviewText(e.target.value)} placeholder="Write your review here" required variant="outlined" margin="normal" />
                                            <Typography component="legend">Rating:</Typography>
                                            <Rating
                                              name={`rating-1`}
                                              value={rating}
                                              precision={1}
                                              onChange={(event, newValue) => {
                                                setRating(newValue); // Update rating state on change
                                              }}
                                              size="large"
                                            />
                                            <br />
                                            {error && <Typography color="error">{error}</Typography>}
                                            <Button type="submit" variant="contained" color="primary">Submit Review</Button>
                                          </form>
                                        </Grid>
                                        )}
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </div>
                        {productData.related_products && productData.related_products.length > 0 ? (<>
                        <div className="row mt-30">
                          <div className="col-12">
                            <div className="heading heading-flex">
                              <div className="heading-left">
                                  <h2 className="title">Products related to this item</h2>
                              </div>
                              <div className="heading-right">
                                  <Link href={'#'} className="title-link">View more Products <ChevronRightIcon /></Link>
                              </div>
                            </div>
                          </div>

                          <div className="col-12">
                              <div className="row">
                             
                              </div>
                          </div>
                        </div>
                        </>)
                        : 
                        ('')}
                        
                        {productData.vendor_products && productData.vendor_products.length > 0 ? (<>
                        <div className="row mt-3">
                          <div className="col-12">
                            <div className="heading heading-flex">
                              <div className="heading-left">
                                  <h2 className="title">More from This Seller</h2>
                              </div>
                              <div className="heading-right">
                                  <Link href={'#'} className="title-link">View more Products <ChevronRightIcon /></Link>
                              </div>
                            </div>
                          </div>
                          {/* <div className="col-12">
                              <div className="row">
                              <OwlCarousel className="owl-theme" {...options}>
                                {product?.vendor_products.map((p) => (
                                  <div key={p.id} className="product">
                                    <figure className="product-media">
                                      <Link to={`/${p.sku}/${p.slug}`}>
                                        <img
                                          src={`${p.image}`}
                                          alt="Product"
                                          className="product-image"
                                        />
                                      </Link>
                                    </figure>
                                    <div className="product-body">
                                      <h3 className="product-title">
                                        <Link to={`/${p.sku}/${p.slug}`}>{truncateText(p.title, 23)}</Link>
                                      </h3>
                                      <div className="product-price">GHS{p.price.toFixed(2)}</div>
                                    </div>
                                  </div>
                                ))}
                              </OwlCarousel>
                              </div>
                          </div> */}
                        </div>
                        </>)
                        :('')
                        }

                      </div>
                  </div>
                  {/* <RecentlyViewedProducts/> */}

              </main>
          </div>
      {/* <Footer/> */}
      </>
  );
};

export default ProductDetail;
