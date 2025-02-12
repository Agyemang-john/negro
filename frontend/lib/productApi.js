import api from "../utils/api"; // Import your Axios instance

export async function fetchProductData(sku, slug, variantId = null) {
    try {
        let url = `/api/v1/product/${sku}/${slug}/`;
        if (variantId) {
          url += `?variantid=${variantId}`;
        }
        const response = await api.get(url, {
            headers: {
              "Cache-Control": "no-store", // Avoid caching for dynamic content
            },
          });
        return response.data;
    } catch (error) {
        console.error("Error fetching product data:", error);
        return null; // Handle errors gracefully
    }
}
