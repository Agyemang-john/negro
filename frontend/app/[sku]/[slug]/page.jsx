// app/[sku]/[slug]/page.js
import { cookies } from 'next/headers';
import axios from 'axios';
import ProductDetail from "@/components/productDetail/ProductDetail";


export default async function ProductPage({ params, searchParams }) {
  const cookieStore = cookies();
  const { slug, sku} = await params;
  const accessToken = (await cookieStore).get('access')?.value;
  const guestCart =  (await cookieStore).get('guest_cart')?.value;
  const { variantid } = await searchParams;

  try {
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_HOST}/api/v1/product/${sku}/${slug}/`, {
      headers: {
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        ...(guestCart && { 'X-Guest-Cart': guestCart }),
        Cookie: (await cookieStore).toString(),
      },
      params: { 
        ...(variantid && { variantid }),
      },
      withCredentials: true,
    });

    return <ProductDetail initialData={data} />;
  } catch (error) {
    console.error("Product fetch error:", error);
    
    return (
      <div className="container py-8 text-center">
        <h1 className="text-2xl font-bold mb-2">Product Loading Error</h1>
        <p className="text-gray-600 mb-4">
          We're sorry, but we couldn't load the product details at this time.
        </p>
        <a 
          href="/products" 
          className="text-blue-600 hover:underline"
        >
          Browse other products
        </a>
      </div>
    );
  }
}

export async function generateMetadata({ params, searchParams }) {
  const cookieStore = cookies();
  const { slug, sku} = await params;
  const accessToken = (await cookieStore).get('access')?.value;
  const guestCart =  (await cookieStore).get('guest_cart')?.value;
  const { variantid } = await searchParams;

  console.log("This is the access token:   ", accessToken)

  try {
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_HOST}/api/v1/product/${sku}/${slug}/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'X-Guest-Cart': guestCart,
        Cookie: (await cookieStore).toString(),
      },
      params: { 
        ...(variantid && { variantid }),
      },
      withCredentials: true,
    });

    return {
      title: data?.product?.title || "Product Details",
      description: data?.product?.description || "View this product",
      openGraph: {
        title: data?.product?.title,
        description: data?.product?.description,
        images: data?.product?.image?.url 
          ? [{ url: data.product.image.url }] 
          : [],
      },
      alternates: {
        canonical: `/product/${sku}/${slug}`,
      },
    };
  } catch (error) {
    return {
      title: "Product Not Found",
      description: "This product is unavailable",
      robots: {
        index: false,
        follow: false,
      },
    };
  }
}