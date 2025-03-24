import React, { useState, useEffect } from 'react';
import Typography  from '@mui/material/Typography';
import RoomIcon from '@mui/icons-material/Room';
import { Link } from 'react-router-dom';
import BasicModal from './Modal';


const ReverseGeocodeLocation = () => {
    const [country, setCountry] = useState('');
    const [error, setError] = useState('');
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
  
    useEffect(() => {
      // Function to get user's location with high accuracy
      const getLocation = () => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              reverseGeocode(latitude, longitude); // Reverse geocode lat, lng
            },
            (err) => {
              console.error('Geolocation Error:', err);
              setError('Location access denied or unavailable, using default location');
              setError('');
              // Use Kumasi as fallback if geolocation fails
              reverseGeocode(6.700071, -1.630783);
            },
            {
              enableHighAccuracy: true,  // Request high accuracy for mobile devices
              timeout: 5000,             // Timeout for geolocation request
              maximumAge: 0              // Disable cache for current location
            }
          );
        } else {
          setError('Geolocation not supported, using default location');
          // Use Kumasi as fallback if geolocation is not supported
          reverseGeocode(6.700071, -1.630783);
        }
      };
      // Function to reverse geocode latitude and longitude
      const reverseGeocode = async (lat, lng) => {
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
          );
          const data = await response.json();
          if (data && data.address && data.address.country) {
            setCountry(data.address.city + ', ' + data.address.country); // Set the country in state
          } else {
            setError('Unable to determine the country');
            setError('');
            alert(data.error)
          }
        } catch (error) {
          setError('Error retrieving location');
        }
      };
  
      // Call the function to get location on component mount
      getLocation();
    }, []);
  
    return (
      <div>
        <BasicModal open={open} handleClose={handleClose} />
        {error ? (
          <Typography variant="h6" color="error">
            {error}
          </Typography>
        ) : (
          <Typography variant="h5">
            <Link onClick={handleOpen} style={{ display: 'flex', alignItems: 'center', textDecoration: 'underline' }}>
              <RoomIcon fontSize="large" /> {country ? country : 'Locating...'}
            </Link>
          </Typography>
        )}
      </div>
    );
  };
  
  export default ReverseGeocodeLocation;

