import React, { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import {
  Box, Button, Typography, Modal, TextField, MenuItem, RadioGroup,
  FormControlLabel, Radio, Divider
} from '@mui/material';
import Link from 'next/link';
import AddressModal from './AddressModal';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', sm: '70%', md: '50%', lg: '40%' },
  bgcolor: 'background.paper',
  borderRadius: '5px',
  border: '1px solid #B2BEB5',
  boxShadow: 24,
  p: 4,
};

const BasicModal = ({ open, handleClose }) => {
  const navigate = useRouter();
  const { isAuthenticated } = useAppSelector(state => state.auth);

  const [addressesList, setAddressesList] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [openSubModal, setOpenSubModal] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [error, setError] = useState(null);
  const [select, setSelected] = useState(false);
  const [loading, setLoading] = useState(false);

  const API_KEY = 'pk.ac7f55c6c458a12ea5ed586db0b1bb4d';

  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/v1/address/addresses/`,
        { method: 'GET', cache: "no-store", credentials: "include"}
      );
      if (!res.ok) throw new Error("Failed to fetch addresses");
		  const response = await res.json();
      setAddressesList(response.data);
    } catch (error) {
      setError('Unable to fetch addresses.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleOpenSubModal = (addressId = null) => {
    setSelectedAddressId(addressId);
    setOpenSubModal(true);
  };

  const handleCloseSubModal = () => {
    setOpenSubModal(false);
    setSelectedAddressId(null);
    setInputValue('');
    setSuggestions([]);
    setSelectedLocation(null);
  };

  const handleChangeInput = async (event) => {
    const value = event.target.value;
    setInputValue(value);
    if (value.length > 2) await fetchSuggestions(value);
    else setSuggestions([]);
  };

  const fetchSuggestions = async (query) => {
    try {
      const response = await axios.get(`https://api.locationiq.com/v1/autocomplete.php`, {
        params: { key: API_KEY, q: query, format: 'json' },
      });
      setSuggestions(response.data);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion.display_name);
    setSelectedLocation(suggestion);
    setSuggestions([]);
    setSelected(true)
  };

  const handleAddressClick = async (id) => {
    try {
      await axios.put('/api/v1/address/addresses/default/', { id });
      setAddressesList(addressesList.map((address) =>
        address.id === id ? { ...address, status: true } : { ...address, status: false }
      ));
      await fetchAddresses();
    } catch (error) {
      console.error('Error updating address:', error);
    }
  };

  if (loading) {
    return <p>Loading ...</p>
  }
  

  return (
    <Modal open={open} onClose={handleClose} closeAfterTransition>
      <Box sx={style}>
        <Typography variant="h4" component="h2">Select Your Delivery Location</Typography>

        <RadioGroup>
          {addressesList && addressesList.map((address) => (
            <Box
              key={address.id}
              sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, border: '1px solid #f0f0f0', borderRadius: '8px', mb: 2 }}
            >
              <FormControlLabel
                value={address.id.toString()}
                control={<Radio onChange={() => handleAddressClick(address.id)} checked={address?.status} />}
                label={<Typography><strong>{address.full_name}</strong> {address?.address}</Typography>}
              />
              <Button variant="outlined" color="secondary" onClick={() => handleOpenSubModal(address.id)}>
                Edit Address
              </Button>
            </Box>
          ))}

          {/* Conditional button rendering */}
        {isAuthenticated ? (
          addressesList?.length >= 4 ? (
            <Typography sx={{ color: 'red', mt: 2 }}>
              You have reached the maximum number of allowed addresses.
            </Typography>
          ) : (
            <Box sx={{ ml: 4, mb: 2 }}>
              <Button variant="outlined" color="secondary" onClick={() => handleOpenSubModal()}>
                Add new address
              </Button>
            </Box>
          )
        ) : (
          <Box sx={{ ml: 4, m: 2 }}>
            <Button variant="contained" color="primary" onClick={''}>
              Login to add address
            </Button>
          </Box>
        )}

        </RadioGroup>

        <Link href={'/user/dashboard/address'}>Manage address book</Link>

        <AddressModal
          open={openSubModal}
          handleClose={handleCloseSubModal}
          selectedAddressId={selectedAddressId}
          handleAddressChange={fetchAddresses}
          handleChangeInput={handleChangeInput}
          inputValue={inputValue}
          setInputValue={setInputValue}
          suggestions={suggestions}
          selectedLocation={selectedLocation}
          setSelectedLocation={setSelectedLocation}
          handleSuggestionClick={handleSuggestionClick}
          select={select}
        />
      </Box>
    </Modal>
  );
};

export default BasicModal;
