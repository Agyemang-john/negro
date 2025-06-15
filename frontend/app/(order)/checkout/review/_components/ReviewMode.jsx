// app/checkout/delivery/page.tsx
'use client';


import React, { useEffect, useState } from 'react';

import { Button, Typography, Box } from '@mui/material';
import Checkout from '../../_components/Checkout';
import { useRouter, usePathname } from 'next/navigation';


export default function ReviewStep() {


  return (
    <Checkout>
      Hello, this is the Review step! 🚚
      
    </Checkout>
  );
}
