import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import axiosClient from '@/lib/clientFetch';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import Swal from 'sweetalert2';

const AddressModal = ({
  open,
  handleClose,
  selectedAddressId, // If passed, indicates editing mode
  handleAddressChange,
  handleChangeInput,
  inputValue,
  setInputValue, // To control the input value for address
  suggestions,
  selectedLocation,
  setSelectedLocation,
  handleSuggestionClick,
  select
}) => {
  const [fullName, setFullName] = useState('');
  const [mobile, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [gps_address, setPostcode] = useState('');
  const [region, setRegion] = useState('');
  const [addressLine, setAddressLine] = useState(''); // Controlled by inputValue now
  const [country, setCountry] = useState('');
  const [town, setTown] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  

  // Fetch the address if editing (when selectedAddressId is provided)
  useEffect(() => {
    if (selectedAddressId) {
      fetchAddressDetails(selectedAddressId);
    } else {
      // Reset the fields if adding a new address
      setLoading(false);
      resetFields();

    }
  }, [selectedAddressId]);

  // Function to fetch address details for editing
  const fetchAddressDetails = async (id) => {
    try {
      const response = await axiosClient.get(`${process.env.NEXT_PUBLIC_HOST}/api/v1/address/addresses/${id}/`);
      const address = response.data;

      // Populate fields with the fetched address data
      setFullName(address.full_name || '');
      setPhone(address.mobile || '');
      setPostcode(address.gps_address || '');
      setRegion(address.region || '');
      setInputValue(address.address || ''); // Use inputValue to control address line
      setCountry(address.country || '');
      setLatitude(address.latitude || '');
      setLongitude(address.longitude || '');
      setEmail(address.email || '');
      setTown(address.town || '');
    } catch (error) {
      console.error('Error fetching address details:', error);
    } finally {
      setLoading(false);
    }
  };

  // Reset fields to empty for adding a new address
  const resetFields = () => {
    setFullName('');
    setEmail('');
    setPhone('');
    setPostcode('');
    setRegion('');
    setInputValue(''); // Clear the input value
    setCountry('');
    setLatitude('');
    setLongitude('');
    setTown('');
  };

  // Prefill form fields if editing an address based on selected location from autocomplete
  useEffect(() => {
    if (selectedLocation) {
      setCountry(selectedLocation.address.country || '');
      setRegion(selectedLocation.address.state || '');
      setTown(selectedLocation.display_place || '');
      setInputValue(selectedLocation.display_name || ''); // Use inputValue
      setLatitude(selectedLocation.lat || '');
      setLongitude(selectedLocation.lon || '');
    }
  }, [selectedLocation]);


const handleSubmit = async () => {
    const newAddress = {
        full_name: fullName,
        mobile,
        email,
        gps_address,
        region,
        address: inputValue, // Use inputValue for address line
        town,
        country,
        latitude,
        longitude,
    };

    const url = selectedAddressId
        ? `${process.env.NEXT_PUBLIC_HOST}/api/v1/address/addresses/${selectedAddressId}/`
        : `${process.env.NEXT_PUBLIC_HOST}/api/v1/address/addresses/`;
    const method = selectedAddressId ? 'put' : 'post';

    try {
        // Show confirmation dialog
        const result = await Swal.fire({
            title: selectedAddressId ? 'Update Address?' : 'Add New Address?',
            text: selectedAddressId
                ? 'Are you sure you want to update this address?'
                : 'Are you sure you want to add this address?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, proceed',
            cancelButtonText: 'Cancel'
        });

        if (result.isConfirmed) {
            const response = await axiosClient({
                method: method,
                url: url,
                data: newAddress,
            });

            handleAddressChange(response.data); // Update address list or state
            handleClose(); // Close the modal or form

            Swal.fire({
                title: 'Success!',
                text: selectedAddressId
                    ? 'Address updated successfully.'
                    : 'New address added successfully.',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
            });
        }
    } catch (err) {
        console.error('Error submitting address:', err);
        Swal.fire({
            title: 'Error!',
            text: 'Failed to save the address. Please try again.',
            icon: 'error',
            timer: 3000,
            showConfirmButton: false
        });

        if (err.response?.data) {
            setError(err.response.data); // Handle and display detailed error if available
        }
    } finally {
        handleClose();
    }
};


  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 350,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 2,
    borderRadius: '8px',
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      {loading? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
            <CircularProgress />
          </Box>
      ) : (
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h4" component="h2">
          {selectedAddressId ? "Edit Address" : "Add Address"}
        </Typography>

        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          Please fill out the form below to {selectedAddressId ? "edit" : "add"} your address.
        </Typography>

        <TextField fullWidth label="Full Name" variant="outlined" value={fullName} onChange={(e) => setFullName(e.target.value)} sx={{ mt: 2 }} required />

        <TextField fullWidth label="Email" variant="outlined" value={email} onChange={(e) => setEmail(e.target.value)} sx={{ mt: 2 }} required />

        {/* Address Line with Autocomplete */}
        <TextField fullWidth label="Address Line" variant="outlined" value={inputValue} onChange={handleChangeInput} sx={{ mt: 2 }} required />

        {/* Autocomplete Suggestions */}
        {suggestions.length > 0 && (
          <Box sx={{ mt: 1 }}>
            {suggestions.map((suggestion, index) => (
              <MenuItem
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                sx={{ borderBottom: '1px solid #ddd' }}
              >
                {suggestion.display_name}
              </MenuItem>
            ))}
          </Box>
        )}
        {select ? (
          <>
          <TextField fullWidth label="Country" variant="outlined" value={country} onChange={(e) => setCountry(e.target.value)} sx={{ mt: 2 }} required />
  
          <TextField fullWidth label="Region/State" variant="outlined" value={region} onChange={(e) => setRegion(e.target.value)} sx={{ mt: 2 }} required/>
  
          <TextField fullWidth label="Town" variant="outlined" value={town} onChange={(e) => setTown(e.target.value)} sx={{ mt: 2 }} required />
  
          <TextField fullWidth label="Phone Number" variant="outlined" value={mobile} onChange={(e) => setPhone(e.target.value)} sx={{ mt: 2 }} required />
  
          <TextField fullWidth label="GPS Address" variant="outlined" value={gps_address} onChange={(e) => setPostcode(e.target.value)} sx={{ mt: 2 }} required />
  
          <TextField fullWidth label="Latitude" variant="outlined" sx={{ display: 'none', mt: 2 }} value={latitude} onChange={(e) => setLatitude(e.target.value)} />
  
          <TextField fullWidth label="Longitude" variant="outlined" sx={{ display: 'none', mt: 2 }} value={longitude} onChange={(e) => setLongitude(e.target.value)}/>
          </>
        ): ''}

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button variant="contained" size="large" sx={{ mt: 2 }} onClick={handleSubmit}>
            {selectedAddressId ? "Update Address" : "Add Address"}
          </Button>

          <Button variant="outlined" size="large" sx={{ mt: 2 }} onClick={handleClose}>
            Cancel
          </Button>
        </Box>

      </Box>
      )}

    </Modal>
  );
};

export default AddressModal;
