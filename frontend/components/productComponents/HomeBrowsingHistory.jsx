"use client"

import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { Box, Card, CardMedia, CardContent, Typography, Skeleton } from '@mui/material';
import Grid from '@mui/material/Grid2';
import Link from 'next/link';

function truncateText(text, length) {
  return text.length > length ? `${text.substring(0, length)}...` : text;
}

export default function HomeBrowsingHistory() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBrowsingHistory() {
      try {
        const viewed = Cookies.get('recently_viewed');
        if (!viewed) return;

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/product/recently-viewed-products/?ids=${viewed}`,
          {
            cache: 'no-store',
          }
        );
        const data = await response.json();
        setProducts(data || []);
      } catch (error) {
        // Optionally log error
      } finally {
        setLoading(false);
      }
    }

    fetchBrowsingHistory();
  }, []);

  return (
      <Grid sx={{ boxShadow: 'none', border: 'none' }} size={{ xs: 12, md: 4, lg: 4 }}>
        <Card sx={{ boxShadow: 'none', border: 'none' }}>
          <CardContent>
            <Typography sx={{ fontWeight: 'bold', mb: 2 }} variant="h5">
              Your Browsing History
            </Typography>
            <Grid container spacing={0.5}>
              {loading ? (
                <Grid container spacing={2}>
                  {[...Array(4)].map((_, index) => (
                    <Grid size={{ xs: 6 }} key={index}>
                      <Skeleton sx={{ borderRadius: '10px' }} animation="wave" variant="rectangular" width={150} height={150} />
                      <Skeleton animation="wave" variant="text" width="50%" />
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Grid container spacing={2}>
                  {products && products.slice(0, 4).map((product) => (
                    <Grid size={{ xs: 6, md: 6 }} key={product.id}>
                      <Link
                        href={`/${product.sku}/${product.slug}`}
                        style={{ textDecoration: 'none' }}
                      >
                          <CardMedia
                            component="img"
                            height="200"
                            image={product.image}
                            alt={product.title}
                          />
                            <Typography variant="body2" align="center">
                              {truncateText(product.title, 20)}
                            </Typography>
                      </Link>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Grid>
            {/* <Link to={"/user/dashboard/recently-viewed-products"}>See all</Link> */}
          </CardContent>
        </Card>
      </Grid>
  );
}
