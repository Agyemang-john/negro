import Card from '@mui/material/Card';
import { useRouter } from 'next/navigation';
import CircularProgress from '@mui/material/CircularProgress';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Link from 'next/link';


interface SummaryCardProps {
    amount: number;
    fee: number;
}


const SummaryCard = ({ amount, fee  }: SummaryCardProps ) => {
    const router = useRouter();

    return ( 
        <Card sx={{ boxShadow: 1, borderRadius: '5px' }}>
            <CardContent>
                <Typography
                variant="h5"
                sx={{
                    textTransform: 'uppercase',
                    borderBottom: 1,
                    borderColor: 'grey.200',
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontWeight: 'bold',
                    pb: 1,
                }}
                >
                <span>Cart Summary</span>
                </Typography>
    
                <Box sx={{ borderBottom: 1, borderColor: 'grey.300', my: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1 }}>
                        <Typography variant="h6" fontWeight="bold">
                        Subtotal
                        </Typography>
                        <Typography variant="h4" id="summary_totalamount">
                        GHS {amount?.toFixed(2)}
                        </Typography>
                    </Box>
                </Box>
    
                <Box sx={{ borderBottom: 1, borderColor: 'grey.300', my: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1 }}>
                        <Typography variant="h6" fontWeight="bold">
                        Packaging fee
                        </Typography>
                        <Typography variant="h4" id="packaging_fee">
                        GHS {fee?.toFixed(2)}
                        </Typography>
                    </Box>
                </Box>
    
                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 2 }}
                    onClick={() => router.push('/checkout/delivery')}
                    >
                    Proceed to Checkout
                </Button>
    
                <Divider sx={{ my: 2 }} />
    
                <Typography variant="body2" color="textSecondary" sx={{ mt: 3 }}>
                    Free fast delivery. No order minimum. Exclusive savings. Start your 30-day free trial of
                    Prime.
                </Typography>
            </CardContent>
        </Card>
    )
}

export default SummaryCard