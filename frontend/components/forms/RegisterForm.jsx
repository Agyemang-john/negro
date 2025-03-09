'use client';

import { useRegister } from '@/hooks';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { TextField, Button, Typography, Container, Box, IconButton, InputAdornment } from '@mui/material';
import Grid from '@mui/material/Grid2';
import Swal from 'sweetalert2';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { useRegisterMutation } from '@/redux/features/authApiSlice';

export default function RegisterForm() {
	
	const [register, { isLoading }] = useRegisterMutation();

    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        password: '',
    });

    const [passwordValid, setPasswordValid] = useState({
        upperCase: false,
        lowerCase: false,
        number: false,
        specialChar: false,
        validLength: false,
    });

    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const router = useRouter();

    const [isTyping, setIsTyping] = useState(false); // To track if user has started typing
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });

        if (name === 'password') {
            setIsTyping(true);  // Mark that user has started typing
            validatePassword(value);
        }
    };

    const validatePassword = (password) => {
        const upperCase = /[A-Z]/.test(password);
        const lowerCase = /[a-z]/.test(password);
        const number = /\d/.test(password);
        const specialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        const validLength = password.length >= 8; // Minimum 8 characters rule

        setPasswordValid({
            upperCase,
            lowerCase,
            number,
            specialChar,
            validLength,
        });
    };

    const handleSubmit = (e) => {
      e.preventDefault();


      // Check if form is valid before submitting
        if (!formIsValid()) {
            // Optionally, show a warning or notify the user that the form is invalid
            Swal.fire({
            icon: 'warning',
            title: 'Validation Failed',
            text: 'Please fill in all required fields correctly before submitting.',
            confirmButtonText: 'OK',
            });
            return; // Prevent form submission
        }
  
        register({ first_name, last_name, email, password, re_password })
            .unwrap()
            .then(() => {
                toast.success('Please check email to verify account');
                router.push('/auth/login');
            })
            .catch(() => {
                toast.error('Failed to register account');
            });
      
    };

  const formIsValid = () => {
    // Check if all fields are filled and password is valid
    return (
      formData.first_name &&
      formData.last_name &&
      formData.email &&
      formData.phone &&
      passwordValid.upperCase &&
      passwordValid.lowerCase &&
      passwordValid.number &&
      passwordValid.specialChar &&
      passwordValid.validLength
    );
  };

    return (
        <Container maxWidth="sm" sx={{ padding: 4 }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Get Started Today!
                </Typography>
                <Typography variant="body1" color="textSecondary">
                    Create an account to enjoy the benefits
                </Typography>
            </Box>

            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                            label="First Name"
                            variant="outlined"
                            fullWidth
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleChange}
                            error={Boolean(errors.first_name)}
                            helperText={errors.first_name}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                            label="Last Name"
                            variant="outlined"
                            fullWidth
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleChange}
                            error={Boolean(errors.last_name)}
                            helperText={errors.last_name}
                        />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                        <TextField
                            label="Email"
                            variant="outlined"
                            fullWidth
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            error={Boolean(errors.email)}
                            helperText={errors.email}
                        />
                    </Grid>
                    <Grid size={{ xs: 12}}>
                        <TextField
                            label="Phone"
                            variant="outlined"
                            fullWidth
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            error={Boolean(errors.phone)}
                            helperText={errors.phone}
                        />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                        <TextField
                            label="Password"
                            variant="outlined"
                            type={showPassword ? "text" : "password"}
                            fullWidth
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            helperText="Password must be at least 8 characters, contain an uppercase letter, a number, and a special character."

                            error={
                              isTyping && ( // Only show errors after typing starts
                                  !passwordValid.upperCase ||
                                  !passwordValid.lowerCase ||
                                  !passwordValid.number ||
                                  !passwordValid.specialChar ||
                                  !passwordValid.validLength
                              )
                            }

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
                        {isTyping && (
                          <div>
                              <ul>
                                  <li style={{ color: passwordValid.upperCase ? 'green' : 'red' }}>
                                      {passwordValid.upperCase ? <CheckCircleIcon /> : <CancelIcon />}
                                      Must contain at least one uppercase letter
                                  </li>
                                  <li style={{ color: passwordValid.lowerCase ? 'green' : 'red' }}>
                                      {passwordValid.lowerCase ? <CheckCircleIcon /> : <CancelIcon />}
                                      Must contain at least one lowercase letter
                                  </li>
                                  <li style={{ color: passwordValid.number ? 'green' : 'red' }}>
                                      {passwordValid.number ? <CheckCircleIcon /> : <CancelIcon />}
                                      Must contain at least one number
                                  </li>
                                  <li style={{ color: passwordValid.specialChar ? 'green' : 'red' }}>
                                      {passwordValid.specialChar ? <CheckCircleIcon /> : <CancelIcon />}
                                      Must contain at least one special character
                                  </li>
                                  <li style={{ color: passwordValid.validLength ? 'green' : 'red' }}>
                                      {passwordValid.validLength ? <CheckCircleIcon /> : <CancelIcon />}
                                      Must be at least 8 characters long
                                  </li>
                              </ul>
                          </div>
                        )}

                    </Grid>
                </Grid>

                {successMessage && (
                    <Typography variant="body2" color="success.main" mt={2}>
                        {successMessage}
                    </Typography>
                )}

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                    <Typography variant="body2" color="textSecondary">
                        Already have an account?{' '}
                        <Link href="/login">Sign in</Link>
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                        sx={{ width: '150px' }}
                    >
                        Sign Up
                    </Button>
                </Box>
            </form>
        </Container>
    );
}
