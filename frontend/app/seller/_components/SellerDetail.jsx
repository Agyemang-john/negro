"use client";

import React, { useEffect, useState } from 'react';
import axiosClient from '@/lib/clientFetch';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import Link from 'next/link';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Badge from '@mui/material/Badge';
import Rating from '@mui/material/Rating';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid2';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import VerifiedIcon from '@mui/icons-material/Verified';
import PhoneIcon from '@mui/icons-material/Phone';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import moment from 'moment';
import Swal from 'sweetalert2';
import { capitalizeEachWord, formatNumber, truncateText } from '../_utils/seller';
import { styled } from '@mui/material/styles';
import AspectRatio from '@mui/joy/AspectRatio';


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


const SellerDetail = ({ data }) => {
    const { isAuthenticated } = useAppSelector(state => state.auth);
    const navigate = useRouter();
    const { sku, slug } = useParams();
    const [value, setValue] = useState(0);
    const [vendorData, setVendorData] = useState(data?.vendor);
    const [products, setVendorProducts] = useState(data?.products);
    const [followers, setFollowersCount] = useState(data?.followers_count);
    const [rating, setRating] = useState(data?.average_rating);
    const [reviews, setReviews] = useState(data?.reviews);
    const [todayHours, setTodayHours] = useState(null);
    const [isFollowing, setIsFollowing] = useState(data?.is_following);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

     
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

      // Dependency array includes param.slug to re-run if it changes

    const handleFollowToggle = async () => {
        if (isAuthenticated) {
            try {
                const response = await axiosClient.post(`/api/vendor/${slug}/`);
                const data = response.data;
                setIsFollowing(data.is_following);  // Update button state
                setFollowersCount(data.followers_count);
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


    if (error) {
        return <div>{error}</div>;
    }

    if (loading) {
        return <div>{'Loading.....'}</div>;
    }

    const getLabel = (value) => {
        return labels[value] || '';
    };



    return (
        <>
        <main className='container'>
            <Box>
                <Box sx={{ padding: '10px', borderRadius: '8px' }}>
                    <AspectRatio ratio={3} maxHeight={200} sx={{ flex: 1, width: '100%', borderRadius: '0%' }}>
                        <Box
                            sx={{
                                // height: '150px',
                                backgroundImage: `url(${vendorData?.about?.cover_image})`,
                                backgroundSize: 'cover',
                                borderRadius: '8px 8px 0 0',
                                position: 'relative',
                                opacity: '50%',
                            }}
                            >
                            <IconButton
                                // onClick={() => navigate(-1)} 
                                sx={{ position: 'absolute', top: 16, left: 16, color: 'green' }}
                            >
                                <ArrowBackIcon />
                            </IconButton>


                            <Badge
                                badgeContent={<NotificationsIcon />}
                                color="success"
                                overlap="circular"
                                sx={{ position: 'absolute', top: 16, right: 16 }}
                            />
                        </Box>
                    </AspectRatio>

                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            flexDirection: 'grid',
                            marginTop: '-100px', 
                            padding: '20px',
                            position: 'relative',
                        }}
                    >
                        <Avatar
                            alt="Seller Profile Picture"
                            src={`${vendorData?.about?.profile_image}`}
                            sx={{
                                width: 120,
                                height: 120,
                                border: '5px solid white',
                            }}
                        />

                        <Box sx={{ marginLeft: '20px', flex: 1 }}>
                            <Typography sx={{ fontSize: '1.6rem' }} variant="h5" fontWeight="bold">
                                {vendorData?.name} {vendorData?.is_subscribed ? (<VerifiedIcon fontSize='large' color='info'/>): ''}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                Joined: since {moment(vendorData?.created_at).format("MMMM YYYY")} <br /> {formatNumber(followers)|| 0} follower{followers !== 1 ? 's': '' } •
                            </Typography>

                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                <Rating name="seller-rating" value={rating} precision={0.5} readOnly />
                                <Typography variant="body2" sx={{ ml: 1, color: 'textSecondary' }}>
                                    {rating? rating?.toFixed(1) : 0.0 } / 5.0
                                </Typography>
                            </Box>

                            <Chip
                                icon={<AccessTimeIcon />}
                                label={vendorData.is_open_now ? `Open until ${todayHours.to_hour}` : 'Closed'}
                                color={vendorData.is_open_now ? 'success' : 'error'}
                                sx={{ mt: 1 }}
                            />

                        </Box>

                    </Box>
                </Box>

                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 4, lg: 4 }}>
                        <Box sx={{ padding: '10px', backgroundColor: 'white', }}>
                            <Box mb={2}>
                                <Typography variant="h6" fontWeight="bold" sx={{ fontSize: '1.6rem', display: 'flex', alignItems: 'center' }}>
                                <LocationOnIcon sx={{ mr: 1 }} /> Location
                                </Typography>
                                <Typography variant="body2" color="textSecondary" sx={{ fontSize: '1rem' }}>
                                    {vendorData?.about?.address}
                                </Typography>
                            </Box>

                            <Box mb={2}>
                                <Typography variant="h6" fontWeight="bold" sx={{ fontSize: '1.6rem', display: 'flex', alignItems: 'center' }}>
                                <AccessTimeIcon sx={{ mr: 1 }} /> Opening Hours
                                </Typography>
                                <Typography variant="body2" color="textSecondary" sx={{ fontSize: '1rem' }}>
                                    {vendorData?.opening_hours?.map((p) => (
                                        <>
                                            {p.is_closed ? (
                                                <>
                                                <>{p.day}: Closed</> <br/>
                                                </>
                                            ):(
                                            <>
                                            {p.day}: {p.from_hour} - {p.to_hour} <br />
                                            </>
                                            )}
                                        </>
                                    ))}
                                </Typography>
                            </Box>

                            <Box mb={2}>
                                <Typography variant="h6" fontWeight="bold" sx={{ fontSize: '1.6rem', display: 'flex', alignItems: 'center' }}>
                                <PhoneIcon sx={{ mr: 1 }} /> Contact
                                </Typography>
                                <Typography variant="body2" color="textSecondary" sx={{ fontSize: '1rem' }}>
                                    {vendorData.contact}
                                </Typography>
                                <Typography variant="body2" color="textSecondary" sx={{ fontSize: '1rem' }}>
                                    {vendorData.email}
                                </Typography>
                            </Box>

                            <Box>
                                <Typography variant='h5' fontWeight="bold" sx={{ fontSize: '1.6rem' }}>About</Typography>
                                <Typography sx={{ fontSize: '1rem' }} variant="body2" color="textSecondary">
                                    {vendorData?.about?.about}
                                </Typography>
                            </Box>

                            <Divider sx={{ my: 2 }} />

                            <Stack direction="row" spacing={2} justifyContent="space-between">
                            <Button
                                variant="contained"
                                color={isFollowing ? "secondary" : "primary"}
                                startIcon={<FavoriteBorderIcon />}
                                sx={{ textTransform: 'none', fontWeight: 'bold' }}
                                onClick={handleFollowToggle}
                            >
                                {isFollowing ? "Unfollow" : "Follow"}
                            </Button>
                                <Button 
                                variant="outlined" 
                                color="secondary" 
                                sx={{ textTransform: 'none', fontWeight: 'bold' }}
                                >
                                Contact Seller
                                </Button>
                            </Stack>

                        </Box>
                    </Grid>
                    <Grid size={{ xs: 12, md: 8, lg: 8 }}>

                    <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
                    <Tabs value={value} onChange={handleChange} centered>
                        <Tab label="Products" />
                        <Tab label="Reviews" />
                    </Tabs>

                    <Box sx={{ padding: 2 }}>
                        {value === 0 && (
                            <>
                            {products.map((p) => (
                                <div className="product product-list m-0 p-1">
                                    <Grid container spacing={1}>
                                        <Grid size={{ xs: 5, md: 3, lg: 3 }}>
                                            <Box>
                                                <figure className="product-media">
                                                    <Link href={`/${p.product.sku}/${p.product.slug}`}>
                                                        <img  src={`${p.product.image}`} alt="Product" className="product-image" />
                                                    </Link>
                                                </figure>
                                            </Box>
                                        </Grid>

                                        <Grid size={{ xs: 7, md: 9, lg: 9 }}>
                                            <div className="product-list">
                                                <div className="product-body product-action-inner">                                        
                                                    <div className="product-cat">
                                                        <Link href={`/category/${p.product.sub_category.slug}`}>{p.product.sub_category.title}</Link>
                                                    </div>
                                                
                                                    <Typography variant="h6" className="product-title">
                                                        <Link href={`/${p.product.sku}/${p.product.slug}`}>{p.product.title}</Link>
                                                    </Typography>
                                                
                                                </div>
                                                <Typography variant="h6" className="product-price">
                                                GHS {p.product.price.toFixed(2)}
                                                </Typography>
                                                <div className="ratings-container">
                                                <Rating value={p.average_rating} precision={0.5} readOnly className="" />
                                                <span className="ratings-text">({p.review_count} Review{p.review_count !== 1 ? 's': ''})</span>
                                                </div>
                                            </div>
                                        </Grid>
                                    </Grid>
                                </div>
                            ))}
                            </>
                        )}
                        {value === 1 && (
                         <Grid container spacing={8} columns={12} sx={{ my: 4 }}>
                         {reviews.length > 0 ? (
                         <>
                           {reviews.map((r) =>(
                             <Grid key={r.id} size={{ xs: 12, sm: 6 }}>
                                 <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 1, height: '100%', }} >
                                   <Typography gutterBottom variant="h5" component="div">
                                       <Rating name={`rating-1`} value={r.rating} precision={0.5} readOnly/>
                                   </Typography>

                                   <TitleTypography gutterBottom variant="h6" tabIndex={0} className={'Mui-focused'} >
                                       <div class="product-nav product-nav-thumbs">
                                            <a href="#" class="active">
                                                <img src={`${r.product_image}`} alt="product desc"/>
                                            </a>
                                        </div>
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
                                           <Typography variant="caption"> {capitalizeEachWord(r.user.first_name)} </Typography>
                                       </Box> <Typography variant="caption">{moment(r.date).fromNow()}</Typography>
                                   </Box>
                                 </Box>
                                 <Divider sx={{ mt:2 }}/>
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
                        )}
                    </Box>
                    </Box>

                    </Grid>
                </Grid>
            </Box>
        </main>
        </>
    );
};

export default SellerDetail;
