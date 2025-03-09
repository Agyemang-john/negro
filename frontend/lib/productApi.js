
export async function fetchProductData(sku, slug, variantId = null) {
    try {
        let url = `/api/v1/product/${sku}/${slug}/`;
        if (variantId) {
          url += `?variantid=${variantId}`;
        }
        const res = await fetch(url, { cache: "no-store", credentials: "include" }); // No cache for dynamic content
        if (!res.ok) throw new Error("Failed to fetch product");

        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Error fetching product data:", error);
        return null; // Handle errors gracefully
    }
}
