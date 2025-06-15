"use client";

import React, { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import Link from 'next/link';

import { Container, Icon } from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import ShieldIcon from '@mui/icons-material/Shield';

const Header = () => {
    return (
        <Box sx={{ backgroundColor: '#f8f9fa', py: 2 }}>
        <Container>
            <Grid container alignItems="center" justifyContent="space-between">
            {/* Logo and Title */}
            <Grid size={{ xs: 12, sm: 4, md: 3 }} >
                <Link href="/" underline="none">
                <Typography variant="h5" component="h2" fontWeight="bold" color="primary">
                    AdepaMarket
                </Typography>
                </Link>
            </Grid>

            {/* Center Title */}
            <Grid size={{ xs: 12, sm: 4, md: 3 }}>
                <Typography variant="h6" align="center">
                Check delivery option
                </Typography>
            </Grid>

            {/* Right Side Icons */}
            <Grid sx={{ display: 'flex'}} size={{ xs: 12, sm: 4, md: 3 }}>
                <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: { xs: 2, sm: 4 }
                }}
                >
                {/* Help Section */}
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <PhoneIcon sx={{ mr: 1 }} />
                    <Box>
                        <Typography variant="body2">Need Help?</Typography>
                        <Typography variant="body2">
                            <Link href="#" color="primary" underline="hover">
                                Contact Us
                            </Link>
                        </Typography>
                    </Box>
                </Box>

                {/* Easy Returns */}
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <ShoppingBagIcon sx={{ mr: 1 }} />
                    <Box>
                    <Typography variant="body2">Easy</Typography>
                    <Typography variant="body2">Returns</Typography>
                    </Box>
                </Box>

                {/* Secure Payment */}
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <ShieldIcon sx={{ mr: 1 }} />
                    <Box>
                    <Typography variant="body2">Secure</Typography>
                    <Typography variant="body2">Payment</Typography>
                    </Box>
                </Box>
                </Box>
            </Grid>
            </Grid>
        </Container>
    </Box>
    )
}

export default Header