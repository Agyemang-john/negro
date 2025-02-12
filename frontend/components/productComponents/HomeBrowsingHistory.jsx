"use client"

import React, { useEffect, useState } from 'react';
import { Box, Card, CardMedia, CardContent, Typography, Skeleton } from '@mui/material';
import Grid from '@mui/material/Grid2';
import api from '../../utils/api';

import Link from 'next/link'

function truncateText(text, length) {
  return text.length > length ? `${text.substring(0, length)}...` : text;
}

export default function HomeBrowsingHistory() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBrowsingHistory() {
      try {
        const response = await api.get(`/api/viewed-products/`, {
          headers: {
            'Cache-Control': 'no-store', // Avoid caching for dynamic content
          },
        });
        setProducts(response.data.recently_viewed);
      } catch (error) {
        // console.error('Failed to fetch browsing history:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchBrowsingHistory();
  }, []);

  return (
    <Box>
      <Typography sx={{ fontWeight: 'bold', mb: 2 }} variant="h5">
        Your Browsing History
      </Typography>

      {loading ? (
        <Grid container spacing={2}>
          {[...Array(4)].map((_, index) => (
            <Grid size={{ xs: 6 }} key={index}>
              <Skeleton sx={{ borderRadius: '10px' }} variant="rectangular" height={50} />
              <Skeleton variant="text" />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Grid container spacing={2}>
          {products && products.map((product) => (
            <Grid sx={{ boxShadow: 'none', border: 'none', }} size={{ xs: 12, md: 4, lg: 4 }}>
              <Link
                href={`/${product.slug}/${product.id}/${product.sub_category.slug}`}
                style={{ textDecoration: 'none' }}
              >
                <Card>
                  <CardMedia
                    component="img"
                    height="200"
                    image={product.image}
                    alt={product.title}
                  />
                  <CardContent>
                    <Typography variant="body2" align="center">
                      {truncateText(product.title, 28)}
                    </Typography>
                  </CardContent>
                </Card>
              </Link>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
