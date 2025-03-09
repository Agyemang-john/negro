import { getCartQuantity } from "@/lib/cart"; // Helper function for fetching count

export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    try {
        const cartCount = await getCartQuantity(req);
        return res.status(200).json({ count: cartCount });
    } catch (error) {
        return res.status(500).json({ error: "Failed to fetch cart count" });
    }
}
