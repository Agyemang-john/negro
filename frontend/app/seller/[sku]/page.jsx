import ProductDetail from "@/components/productDetail/ProductDetail";
import { cookies } from "next/headers";

export default async function Seller({ params }) {
	const cookieStore = cookies();
	const cartId = (await cookieStore).get('cart_id')?.value;
	const accessToken = (await cookieStore).get('access')?.value;
	const { slug } = await params;

	// Construct API URL
	let url = `${process.env.NEXT_PUBLIC_HOST}/api/v1/seller-detail/${slug}/`;

	try {
		const res = await fetch(url, { method: 'GET', cache: "no-store", credentials: "include", headers: {
			Cookie: `cart_id=${cartId}`,
			Authorization: `Bearer ${accessToken}`
		} }); // No cache for dynamic content
		if (!res.ok) throw new Error("Failed to fetch product");

		const product = await res.json();

		return <ProductDetail initialData={product}/>;
	} catch (error) {
		console.error("Error fetching product data:", error);
		return <p>Failed to load product.</p>;
	}
}

// 🔹 Improve SEO with dynamic metadata
export async function generateMetadata({ params }) {
	const cookieStore = cookies();
	const cartId = (await cookieStore).get('cart_id')?.value;
	const accessToken = (await cookieStore).get('access')?.value;
	const { slug } = await params;

	let url = `${process.env.NEXT_PUBLIC_HOST}/api/v1/vendor/${slug}/`;

	try {
		const res = await fetch(url, { method: 'GET', cache: "no-store", credentials: "include", headers: {
			Cookie: `cart_id=${cartId}`,
			Authorization: `Bearer ${accessToken}`
		} });
		if (!res.ok) throw new Error("Failed to fetch metadata");

		const data = await res.json();

		return {
			title: data?.name || "Product Not Found",
			description: product?.product.description || "This product does not exist.",
		};
	} catch (error) {
		return {
			title: "Product Not Found",
			description: "This product does not exist.",
		};
	}
}
