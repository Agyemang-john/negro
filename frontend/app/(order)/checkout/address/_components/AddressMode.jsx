// app/checkout/delivery/page.tsx
'use client';

import { Button, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import Checkout from '../../_components/Checkout';

export default function AddressStep() {
  const router = useRouter();

  return (
    <Checkout>
      <Typography variant="h6">Select Address</Typography>
      {/* Delivery form or options */}
      <Button variant="contained" onClick={() => router.push('/checkout/payment')}>
        Next
      </Button>
    </Checkout>
  );
}
