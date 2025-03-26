"use client";

import React, {useEffect, useState} from 'react'
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import Link from 'next/link';
import ProductImage from "./ProductImage";
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import AddToCartButton from './AddToCartButton';

import Rating from '@mui/material/Rating';
import XIcon from '@mui/icons-material/X';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import PinterestIcon from '@mui/icons-material/Pinterest';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import Divider from '@mui/material/Divider';


const ColorProduct = ({ productData, handleFollowToggle, isFollowing, followerCount, loading }) => {
    const { sku, slug } = useParams(); // Get route params
    const searchParams = useSearchParams();
    const router = useRouter();
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const { isAuthenticated } = useAppSelector(state => state.auth);

    const [address, setAddress] = useState(null);
    const [variantImages, setVariantImages] = useState(productData?.variant_data?.variant_images);
    const [isInCart, setIsInCart] = useState(productData?.is_in_cart);
    const [cartQuantity, setCartQuantity] = useState(productData?.cart_quantity);
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
                              <ProductImage mainImage={mainImage} />
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

export default ColorProduct
