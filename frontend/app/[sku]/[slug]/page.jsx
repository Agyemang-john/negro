import { fetchProductData } from "../../../lib/productApi"; // Import function from lib
import ProductDetail from '../../../components/productDetail/ProductDetail';
import api from "@/utils/api";

export default async function Product({ params, searchParams }) {

    const { variantid } = await searchParams;

    const { sku, slug } = await params;

    try {
        let url = `/api/v1/product/${sku}/${slug}/`;
        if (variantid) {
            const query = new URLSearchParams({ variantid }).toString()
            url += `?${query}`;
        }
        const { data } = await api.get(url, {
            headers: {
              "Cache-Control": "no-store", // Avoid caching for dynamic content
            },
        });

        console.log(data);

        return (
            <>
                <ProductDetail initialData={data} sku={sku} slug={slug}  />
            </>
        )
        
    } catch (error) {
        console.error("Error fetching product data:", error);
        
    }    
}

// // Optional: Improve SEO with `generateMetadata`
export async function generateMetadata({ params, searchParams }) {
    const { variantid } = await searchParams;
    const { sku, slug } = await params;
    const product = await fetchProductData(sku, slug, variantid);

    return {
        title: product ? product.product.title : "Product Not Found",
        description: product ? product.product.description : "This product does not exist.",
    };
}
