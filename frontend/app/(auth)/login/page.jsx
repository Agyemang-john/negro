"use client"

import React, { useState } from 'react';
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from '../../../api/hooks/useAuth';
import Link from 'next/link';
import { Visibility, VisibilityOff } from '@mui/icons-material';

import {
  Box,
  TextField,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Container,
  Card,
  CardContent,
  IconButton, 
  InputAdornment,
} from '@mui/material';

import Grid from '@mui/material/Grid2';

const Login = () => {
  // const { refreshCart } = useCart();
  const { login, loading, error } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [email, setEmailOrPhone] = useState('');

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const resetForm = () => {
    setPassword('');
  };


  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = decodeURIComponent(searchParams.get("next") || "/");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await login(email, password);
    if (response === 200) {
      router.push(redirectTo);
    }
    resetForm();
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Grid container spacing={4} alignItems="center">
        <Grid size={{ xs: 12, md: 6 }} >
          <Card sx={{ boxShadow: 0 }}>
            <CardContent>
              <Typography variant="h4" gutterBottom textAlign="center">
                Get Started Today!
              </Typography>
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}
              <Typography variant="subtitle1" textAlign="center">
                {email}
              </Typography>
              <Box component="form" onSubmit={handleSubmit} mt={4}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  variant="outlined"
                  value={email}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  required
                />

                <TextField
                  fullWidth
                  variant="outlined"
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  margin="normal"
                  required
                  InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton onClick={togglePasswordVisibility} edge="end">
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                    ),
                }}

                />
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mt={2}
                >
                  <Typography variant="body2">
                    No account?{' '}
                    <Link href="/register" style={{ textDecoration: 'none' }}>
                      Sign up
                    </Link>
                  </Typography>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={loading}
                  >
                    {loading ? <CircularProgress size={24} /> : 'Continue'}
                  </Button>
                </Box>
              </Box>
              <Typography variant="body2" textAlign="center" mt={2}>
                <Link href="/" style={{ textDecoration: 'none' }}>
                  Forgot password?
                </Link>
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }} >
          <Box
            component="img"
            src="https://images.unsplash.com/photo-1630450202872-e0829c9d6172?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80"
            alt="Password reset illustration"
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: 0,
            }}
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Login;

