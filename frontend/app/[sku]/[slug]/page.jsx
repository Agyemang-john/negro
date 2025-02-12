import { fetchProductData } from "../../../lib/productApi"; // Import function from lib
import ProductDetail from '../../../components/productDetail/ProductDetail';

export default async function Product({ params, searchParams }) {

    const { variantid } = await searchParams;

    const { sku, slug } = await params;


    const productData = await fetchProductData(sku, slug, variantid);
    console.log(productData);
    return (
        <>
            <ProductDetail data={productData}/>
        </>
    )
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
