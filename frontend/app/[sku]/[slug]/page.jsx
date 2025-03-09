import ProductDetail from "@/components/productDetail/ProductDetail";
import { cookies } from "next/headers";

export default async function Product({ params, searchParams }) {
	const cookieStore = cookies();
	const cartId = (await cookieStore).get('cart_id')?.value;
	const { variantid } = await searchParams || {};
	const { sku, slug } = await params;

	// Construct API URL
	let url = `${process.env.NEXT_PUBLIC_HOST}/api/v1/product/${sku}/${slug}/`;
	if (variantid) {
		url += `?variantid=${variantid}`;
	}

	try {
		const res = await fetch(url, { method: 'GET', cache: "no-store", credentials: "include", headers: {
			Cookie: `cart_id=${cartId}`
		} }); // No cache for dynamic content
		if (!res.ok) throw new Error("Failed to fetch product");

		const product = await res.json();

		return <ProductDetail initialData={product} sku={sku} slug={slug} />;
	} catch (error) {
		console.error("Error fetching product data:", error);
		return <p>Failed to load product.</p>;
	}
}

// 🔹 Improve SEO with dynamic metadata
export async function generateMetadata({ params, searchParams }) {
	const cookieStore = cookies();
	const cartId = (await cookieStore).get('cart_id')?.value;
	const { variantid } = await searchParams || {};
	const { sku, slug } = await params;

	let url = `${process.env.NEXT_PUBLIC_HOST}/api/v1/product/${sku}/${slug}/`;
	if (variantid) {
		url += `?variantid=${variantid}`;
	}

	try {
		const res = await fetch(url, { method: 'GET', cache: "no-store", credentials: "include", headers: {
			Cookie: `cart_id=${cartId}`
		} });
		if (!res.ok) throw new Error("Failed to fetch metadata");

		const product = await res.json();

		return {
			title: product?.product.title || "Product Not Found",
			description: product?.product.description || "This product does not exist.",
		};
	} catch (error) {
		return {
			title: "Product Not Found",
			description: "This product does not exist.",
		};
	}
}
