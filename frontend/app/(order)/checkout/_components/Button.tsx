'use client';

import { Box, Button } from '@mui/material';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import { usePathname, useRouter } from 'next/navigation';

const steps = ['Address', 'Delivery', 'Review', 'Payment', 'Complete'];

const stepPathMap: string[] = [
  '/checkout/address',
  '/checkout/delivery',
  '/checkout/review',
  '/checkout/payment',
  '/checkout/complete',
];

export default function CheckoutStepperButtons() {
  const pathname = usePathname();
  const router = useRouter();

  const activeStep = stepPathMap.indexOf(pathname ?? '');

  const handleNext = () => {
    if (activeStep < stepPathMap.length - 1) {
      router.push(stepPathMap[activeStep + 1]);
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      router.push(stepPathMap[activeStep - 1]);
    }
  };

  return (
    <Box
      sx={[
        {
          display: 'flex',
          flexDirection: { xs: 'column-reverse', sm: 'row' },
          alignItems: 'end',
          flexGrow: 1,
          gap: 1,
          pb: { xs: 12, sm: 0 },
          mt: { xs: 2, sm: 0 },
          mb: '60px',
        },
        activeStep !== 0
          ? { justifyContent: 'space-between' }
          : { justifyContent: 'flex-end' },
      ]}
    >
      {activeStep > 0 && (
        <>
          <Button
            startIcon={<ChevronLeftRoundedIcon />}
            onClick={handleBack}
            variant="text"
            sx={{ display: { xs: 'none', sm: 'flex' } }}
          >
            Previous
          </Button>

          <Button
            startIcon={<ChevronLeftRoundedIcon />}
            onClick={handleBack}
            variant="outlined"
            fullWidth
            sx={{ display: { xs: 'flex', sm: 'none' } }}
          >
            Previous
          </Button>
        </>
      )}

      <Button
        variant="contained"
        endIcon={<ChevronRightRoundedIcon />}
        onClick={handleNext}
        sx={{ width: { xs: '100%', sm: 'fit-content' } }}
      >
        {activeStep === stepPathMap.length - 1 ? 'Place order' : 'Next'}
      </Button>
    </Box>
  );
}
