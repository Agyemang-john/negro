"use client"

import React, { useEffect, useState } from "react";
import Link from 'next/link';
import { Skeleton, Stack } from '@mui/material';
import Rating from '@mui/material/Rating';
import { truncateText } from '../../functions/Function'; // Adjust the path if needed
import { Swiper, SwiperSlide } from "swiper/react";
// import { Navigation, Pagination } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const options = {
  navigation: false,
  pagination: { clickable: true },
  spaceBetween: 10,
  breakpoints: {
    0: { slidesPerView: 2.2 },
    480: { slidesPerView: 3 },
    768: { slidesPerView: 5 },
    1024: { slidesPerView: 6 },
  },
};

const ProductCarousel = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); 

  console.log(products)
  
  useEffect(() => {    
    fetchData();
  }, []);

  const fetchData = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/index/`, {
          cache: "no-store", // Avoid caching for dynamic content
          credentials: "include"
        });
        const data = await res.json();
          setProducts(data.new_products || []);
      } catch (error) {
          console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
  };


  return (
      <div>
        <div className="heading heading-flex mb-2">
        <div className="col-12">
          <div className="heading heading-flex">
              <div className="heading-left">
                <h2 className="title">
                  {loading ? (
                    <Skeleton animation="wave" variant="text" width="100%" />
                  ):(
                    <>
                    Products
                    </>
                  )}
                </h2>
              </div>
            </div>
        </div>
        </div>

        <Swiper {...options}>
        {loading ? (
          <Stack direction="row" spacing={2} style={{ width: '100%' }}>
            {/* Skeleton for products */}
            {[...Array(7)].map((_, i) => (
              <div key={i} className="product-skeleton">
                <Skeleton sx={{ borderRadius: '10px' }} animation="wave" variant="rectangular" width={150} height={210} />
                <Skeleton animation="wave" variant="text" width="60%" style={{ marginTop: '8px' }} />
                <Skeleton animation="wave" variant="text" width="40%" />
                <Skeleton animation="wave" variant="text" width="50%" />
              </div>
            ))}
          </Stack>
        ) : (
          products.map((p, i) => (
          <SwiperSlide key={i} className="product">
              <figure className="product-media">
                <Link href={`/${p.product.sku}/${p.product.slug}`}>
                  <img
                    src={`${p.product.image}`}
                    alt="Product"
                    className="product-image"
                  />
                </Link>
              </figure>

              <div className="product-body">
                <h3 className="product-title">
                  <Link href={`/${p.product.sku}/${p.product.slug}`}>
                    {truncateText(p.product.title, 21)}
                  </Link>
                </h3>
                <div className="product-price">GHS{p.product.price.toFixed(2)}</div>

                <div className="ratings-container">
                  <Rating
                    size="small"
                    name="half-rating-read"
                    value={p.average_rating}
                    precision={0.5}
                    readOnly
                  />
                  <span className="ratings-text">
                    ({p.review_count})
                  </span>
                </div>
              </div>
            </SwiperSlide>
          ))
        )}
      </Swiper>
        {/* <div className="mb-5"></div> */}
      </div>
  )
}

export default ProductCarousel
