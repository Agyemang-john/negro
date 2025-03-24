import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { v4 as uuidv4 } from "uuid";

export function middleware(request: NextRequest) {
    let response = NextResponse.next();

    // Retrieve cart_id cookie
    const cartId = request.cookies.get("cart_id");

    if (!cartId) {
        const newCartId = uuidv4();
        response.cookies.set("cart_id", newCartId, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 365 * 24 * 60 * 60, // 1 year
            path: "/",
            sameSite: "lax",
        });
    }

    return response;
}

export const config = {
    matcher: ["/", "/login", "/register", "/:sku/:slug"],
};
