import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { v4 as uuidv4 } from 'uuid';

export function middleware(request: NextRequest) {
    let response = NextResponse.next();
    if (!request.cookies.get('cart_id')) {
        const cartId = uuidv4()
        response.cookies.set('cart_id', cartId, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 365 * 24 * 60 * 60,
            path: '/',
            sameSite: 'lax',
        });
        return response;
    }

}

export const config = {
    matcher: ['/:sku/:slug', '/', '/login', '/register']
}