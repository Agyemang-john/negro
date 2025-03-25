"use client";

import React, {useEffect, useState} from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { truncateText } from "@/components/utils/TruncateText";
import { Box, Card, IconButton, Typography } from "@mui/material";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import StorefrontIcon from "@mui/icons-material/Storefront";
import DeliveryDiningIcon from "@mui/icons-material/DeliveryDining";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import AddToCartButton from "./AddToCartButton";
import Grid from '@mui/material/Grid2';
import Divider from '@mui/material/Divider';
import Link from "next/link";
import RoomIcon from '@mui/icons-material/Room';

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Button from '@mui/material/Button';
import FavoriteIcon from '@mui/icons-material/Favorite';
import VerifiedIcon from '@mui/icons-material/Verified';

interface Vendor {
    name: string;
    is_subscribed: boolean;
}

interface Variant {
    price: number;
    id: number;
}
interface Product {
    vendor: Vendor;
    price: number;
    id: number;
}
interface Address {
    address: string;
}


interface ProductCardProps {
  isInCart: boolean;
  cartQuantity: number;
  product: Product;
  followerCount: number;
  variant?: Variant | null;
  isFollowing: boolean;
  loading: boolean;
  handleFollowToggle: () => void;
  address: Address;
  handleOpen: () => void;
}

export default function ProductCard({
  isInCart,
  cartQuantity,
  followerCount,
  isFollowing,
  loading,
  product,
  variant,
  handleFollowToggle,
  address,
  handleOpen,
}: ProductCardProps) {
    const router =  useRouter()
    const { isAuthenticated } = useAppSelector(state => state.auth);



  return (
    <Box sx={{ mb: 1 }}>
      <Card sx={{ p: 1, borderRadius: 3, boxShadow: 0 }}>
        {variant ? (
            <Typography variant="h4" fontWeight="bold">₵{variant.price.toFixed(2)}</Typography>
        ): (
            <Typography variant="h4" fontWeight="bold">₵{product.price.toFixed(2)}</Typography>
        )}
        <Typography variant="body2" color="text.secondary">
          Price when purchased online <InfoOutlinedIcon/>
        </Typography>
        <Typography variant="body2" sx={{ display: "flex", alignItems: "center", mt: 1 }}>
          <LocalShippingIcon fontSize="small" sx={{ mr: 0.5 }} /> Free shipping
        </Typography>
        <AddToCartButton isInCart={isInCart} productId={product.id} variantId={variant ? variant.id : null} quantityInCart={cartQuantity} />

        <Divider  sx={{ mt: 1 }}/>

        <Typography sx={{ mt: 1 }} variant="subtitle1" fontWeight="bold">How you'll get this item:</Typography>
        <Grid container spacing={1} sx={{ mt: 1 }}>
          <Grid size={{ sm: 4, xs: 4 }}>
            <Card sx={{ textAlign: "center", p: 1, border: "2px solid black" }}>
              <LocalShippingIcon />
              <Typography variant="body2">Shipping</Typography>
              <Typography variant="caption" color="success.main">Free</Typography>
            </Card>
          </Grid>
          <Grid size={{ sm: 4, xs: 4 }} >
            <Card sx={{ textAlign: "center", p: 1 }}>
              <StorefrontIcon />
              <Typography variant="body2">Pickup</Typography>
              <Typography variant="caption" color="text.secondary">Not available</Typography>
            </Card>
          </Grid>
          <Grid size={{ sm: 4, xs: 4 }}>
            <Card sx={{ textAlign: "center", p: 1 }}>
              <DeliveryDiningIcon />
              <Typography variant="body2">Delivery</Typography>
              <Typography variant="caption" color="text.secondary">Not available</Typography>
            </Card>
          </Grid>
        </Grid>

        <Box display="flex" sx={{ mt: 1 }} alignItems="center" gap={0}>
            <RoomIcon />

            {isAuthenticated ? (
                <Typography variant="body1" fontWeight="bold">
                    {address ? truncateText(address.address, 30) : "Add Address"}
                </Typography>
            ) : (
                <Typography variant="body1" fontWeight="bold">
                    Login to add address
                </Typography>
            )}

            {isAuthenticated && (
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ cursor: "pointer", ml: 1, "&:hover": { textDecoration: "underline" }, textDecoration: "underline" }}
                    onClick={handleOpen}
                    >
                    Change
                </Typography>
            )}
            {!isAuthenticated && (
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ cursor: "pointer", ml: 1, "&:hover": { textDecoration: "underline" }, textDecoration: "underline" }}
                    onClick={() => router.push('/login')}
                >
                Signin
                </Typography>
            )}
        </Box>

        <Divider  sx={{ mt: 1 }}/>

        <Box sx={{ mt: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: 2 }}>
            {/* Responsive Grid layout */}
            <Grid container alignItems="center" spacing={2}>
            {/* Seller Info */}
            <Box>
                <Typography variant="h6" component="div" gutterBottom>
                    Sold by: <strong>{product.vendor.name} {product.vendor.is_subscribed ? (<VerifiedIcon fontSize='large' color='info'/>): ''}  </strong>
                {/* Verified badge */}
                </Typography>
                
                {/* a to seller info */}
                <Link href='#' color="info">
                    View Seller Info
                </Link>
            </Box>

            {/* Follow Button */}
            <Box sx={{ textAlign: { xs: 'center', sm: 'right', width: '100%' } }} >
                <Button
                variant="contained"
                color={isFollowing ? "secondary" : "info"}
                startIcon={<FavoriteIcon />}
                size="medium"
                disabled={loading}
                onClick={handleFollowToggle}
                sx={{ textTransform: 'none', width: '100%' }}
                >
                {isFollowing ? "Unfollow" : "Follow"} ({followerCount})
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
        
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
          <IconButton>
            <FavoriteBorderIcon />
          </IconButton>
          <IconButton>
            <AddShoppingCartIcon />
          </IconButton>
        </Box>
      </Card>
    </Box>
  );
}
