import SellerDetail from "../_components/SellerDetail";
import { createServerAxios } from '@/lib/serverFetch';


export default async function Seller({ params }) {
	const axiosServer = await createServerAxios();
	const { slug } = await params;

	// Construct API URL

	try {
		const { data } = await axiosServer.get(`/api/v1/vendor/seller-detail/${slug}/`, {
		  headers: {
			'Cache-Control': 'no-cache',
		  },
		});
	
		return <SellerDetail data={data} />;
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

// 🔹 Improve SEO with dynamic metadata
export async function generateMetadata({ params }) {
	const axiosServer = await createServerAxios();
	const { slug } = await params;

	try {
		const { data } = await axiosServer.get(`/api/v1/vendor/seller-detail/${slug}/`, {
			headers: {
			  'Cache-Control': 'no-cache',
			},
		});

		return {
			title: data?.vendor?.name+ " || Negromart"  || "Product Details",
			description: data?.vendor?.about?.about || "View this product",
			openGraph: {
			  title: data?.vendor?.name,
			  description: data?.vendor?.about?.about,
			  images: data?.vendor?.about?.profile_image 
				? [{ url: data.vendor.about?.profile_image }] 
				: [],
			},
			alternates: {
			  canonical: `/seller/${slug}`,
			},
		};
	} catch (error) {
		return {
			title: "Seller Not Found",
			description: "This seller is unavailable",
			robots: {
			  index: false,
			  follow: false,
			},
		};
	}
}
