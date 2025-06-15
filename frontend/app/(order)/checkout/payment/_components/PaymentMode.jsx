// app/checkout/delivery/page.tsx
'use client';

import { Button, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import Checkout from '../../_components/Checkout';

export default function DeliveryStep() {
  const router = useRouter();

  return (
    <Checkout>
      <Typography variant="h6">Select payment method</Typography>
      Choose your preferred payment method for the order.
      {/* Delivery form or options */}
      <Button variant="contained" onClick={() => router.push('/checkout/complete')}>
        Next
      </Button>
    </Checkout>
  );
}
