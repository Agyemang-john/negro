"use client";

import { useParams, useRouter, useSearchParams } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import CustomTabs  from './CustomTabs';
import Product from "@/components/productComponents/product";
import NoneProduct from "./NoneProduct";
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
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import Swal from 'sweetalert2';
// import { fetchProductData } from '@/lib/productApi';
import {fetchProductData} from '../../lib/productApi';


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


const ProductDetail = ({ initialData }) => {
  const [ productData, setProductData ] = useState(initialData);
   const { isAuthenticated } = useAppSelector(state => state.auth);
  const [error, setError] = useState(null);
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(3);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [isFollowing, setIsFollowing] = useState(productData?.is_following|| false) ;
  const [loading, setLoading] = useState(!initialData);

  const getLabel = (value) => {
    return labels[value] || '';
  };
  const handleSubmit = () => {

  }

  const tabLabels = ['Description', 'Additional Information', 'Shipping & Returns', 'Reviews'];
  const tabContents = [
    <div><div dangerouslySetInnerHTML={{ __html: productData.product?.description }} /></div>,
    <div><div dangerouslySetInnerHTML={{ __html: productData.product?.specifications }} /></div>,
    <div><div dangerouslySetInnerHTML={{ __html: productData.product?.delivery_returns}} /></div>,
    <div>
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
          } severity="info">Please log in to submit a review.</Alert>) : 
          (<Alert severity="info">You have already submitted a review.</Alert>)}</>
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
              <Button type="submit" variant="contained" color="primary-color">Submit Review</Button>
            </form>
          </Grid>
        )}
        </div>
    </div>,
  ];


 
  
  const handleFollowToggle = async () => {
    if (isAuthenticated) {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/vendor/${productData.product.vendor.slug}/`, {method: 'POST', credentials: 'include'});
            const data = await res.json();
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
  

  const { product } = initialData;

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
                        <CustomTabs tabLabels={tabLabels} tabContents={tabContents} />
                      </div>
                      
                        {productData?.related_products?.length > 0 && (
                          <>
                            <div className="row mt-3">
                              <div className="col-12">
                                <div className="heading heading-flex">
                                  <div className="heading-left">
                                    <h2 className="title">See related products</h2>
                                  </div>
                                  <div className="heading-right">
                                    <Link href="#" className="title-link">
                                      View more Products <ChevronRightIcon />
                                    </Link>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <Product products={productData.related_products} loading={loading} />
                          </>
                        )}

                        {productData?.vendor_products?.length > 0 && (
                          <>
                            <div className="row mt-3">
                              <div className="col-12">
                                <div className="heading heading-flex">
                                  <div className="heading-left">
                                    <h2 className="title">More from this Seller</h2>
                                  </div>
                                  <div className="heading-right">
                                    <Link href="#" className="title-link">
                                      View more Products <ChevronRightIcon />
                                    </Link>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <Product products={productData.vendor_products} loading={loading} />
                          </>
                        )}

                      </div>
                  </div>
                  {/* <RecentlyViewedProducts/> */}

              </main>
          </div>
      </>
  );
};

export default ProductDetail;
