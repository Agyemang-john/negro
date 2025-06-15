// app/checkout/delivery/page.tsx
'use client';

import { Button, Typography } from '@mui/material';
import Stack from '@mui/material/Stack';
import { useRouter } from 'next/navigation';
import Checkout from '../../_components/Checkout';

export default function CompleteStep() {
  const router = useRouter();

  return (
    <Checkout>
      <Stack spacing={2} useFlexGap>
        <Typography variant="h1">📦</Typography>
        <Typography variant="h5">Thank you for your order!</Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          Your order number is
          <strong>&nbsp;#140396</strong>. We have emailed your order
          confirmation and will update you once its shipped.
        </Typography>
        <Button
          variant="contained"
          onClick={() => router.push('/')}
          sx={{ alignSelf: 'start', width: { xs: '100%', sm: 'auto' } }}
        >
          Go to my orders
        </Button>
      </Stack>
    </Checkout>
  );
}
