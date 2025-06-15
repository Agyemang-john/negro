// components/CheckoutStepper.tsx
'use client'

import { Step, StepLabel, Stepper, Box } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { usePathname } from 'next/navigation';

const steps = ['Address', 'Delivery', 'Review', 'Payment', 'Complete'];

const pathStepMap: Record<string, number> = {
    '/checkout/address': 0,
    '/checkout/delivery': 1,
    '/checkout/review': 2,
    '/checkout/payment': 3,
    '/checkout/complete': 4,
};

export default function CheckoutStepper() {
  const pathname = usePathname();
  const activeStep = pathStepMap[pathname] ?? 0;

  return (
        <Stepper
            id="mobile-stepper"
            activeStep={activeStep}
            alternativeLabel
            // sx={{ display: { sm: 'flex', md: 'none' } }}
            sx={{ width: '100%', height: 40 }}
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
