// components/CheckoutStepper.tsx
'use client'

import { Step, StepLabel, Stepper, Box } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { usePathname } from 'next/navigation';

const steps = ['Delivery', 'Address', 'Payment', 'Complete'];

const pathStepMap: Record<string, number> = {
    '/checkout/delivery': 0,
    '/checkout/address': 1,
    '/checkout/payment': 2,
    '/checkout/complete': 3,
  };

export default function SmallStepper() {
  const pathname = usePathname();
  const activeStep = pathStepMap[pathname] ?? 0;

  return (
        <Stepper
            id="mobile-stepper"
            activeStep={activeStep}
            alternativeLabel
            sx={{ display: { sm: 'flex', md: 'none' } }}
            >
            {steps.map((label) => (
                <Step
                sx={{
                    ':first-child': { pl: 0 },
                    ':last-child': { pr: 0 },
                    '& .MuiStepConnector-root': { top: { xs: 6, sm: 12 } },
                }}
                key={label}
                >
                <StepLabel
                    sx={{ '.MuiStepLabel-labelContainer': { maxWidth: '70px' } }}
                >
                    {label}
                </StepLabel>
                </Step>
            ))}
        </Stepper>

  );
}
