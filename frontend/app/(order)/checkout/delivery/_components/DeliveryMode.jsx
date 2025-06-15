// app/checkout/delivery/page.tsx
'use client';


import React, { useEffect, useState } from 'react';

import { Button, Typography, Box } from '@mui/material';
import Checkout from '../../_components/Checkout';
import { useRouter, usePathname } from 'next/navigation';

const pathStepMap = {
  '/checkout/delivery': 0,
  '/checkout/address': 1,
  '/checkout/payment': 2,
  '/checkout/complete': 3,
};

export default function DeliveryStep() {
  const pathname = usePathname();
  const activeStep = pathStepMap[pathname] ?? 0;
  const router = useRouter();

  return (
    <Checkout>
      Hello, this is the delivery step! 🚚
      
    </Checkout>
  );
}
