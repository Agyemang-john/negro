import { Metadata } from "next";
import { createServerAxios } from '@/lib/serverFetch';
import CartCard from "./_components/CartCard";
import Link from "next/link";

export const metadata = {
  title: "Cart | Negromart",
  description: "See items added to cart",
};

async function getCartData() {
  try {
    const axiosServer = await createServerAxios();
    const response = await axiosServer.get('/api/v1/order/cart/', {
      headers: {
        'Cache-Control': 'no-cache',
      },
    });

    // Validate response structure
    if (!response.data || !Array.isArray(response.data.items)) {
      throw new Error('Invalid cart data structure');
    }

    return {
      items: response.data.items || [],
      total_amount: response.data.total_amount || 0,
      packaging_fee: response.data.packaging_fee || 0,
      cart_id: response.data.cart_id,
    };
  } catch (error) {
    console.error('Cart fetch error:', error);
    
    // Handle 404 specifically
    if (error.response?.status === 404) {
      return { items: [], total_amount: 0, packaging_fee: 0 };
    }
    
    // Throw other errors to be handled by the page
    throw new Error(error.response?.data?.message || 'Failed to fetch cart data');
  }
}

export default async function CartPage() {
  let cartData;
  
  try {
    cartData = await getCartData();
  } catch (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">
          {error.message || 'Failed to load cart data. Please try again later.'}
          <div className="mt-2">
            <button 
              onClick={() => window.location.reload()}
              className="btn btn-sm btn-outline-danger"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      {cartData.items.length > 0 ? (
        <CartCard 
          cartItems={cartData.items}
          totalAmount={cartData.total_amount}
          packagingFee={cartData.packaging_fee}
        />
      ) : (
        <div className="alert alert-info text-center">
          <h4>Your cart is empty</h4>
          <p className="mb-3">Looks like you haven't added any items yet</p>
          <Link href="/" className="btn btn-primary">
            Browse Products
          </Link>
        </div>
      )}
    </div>
  );
}