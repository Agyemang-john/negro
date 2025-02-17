import { NextResponse } from 'next/server';
import {jwtDecode} from 'jwt-decode';


export function middleware(req) {
    const token = req.cookies.get('access_token')?.value;
    
    // Define protected routes (including dynamic ones)
    const protectedRoutes = ['/'];

    // Extract the pathname from the request
    const pathname = req.nextUrl.pathname;
    
    // Check if the requested path matches any protected route (including dynamic routes)
    const isProtected = protectedRoutes.some(route => pathname.startsWith(route));

    if (isProtected) {
        if (!token) {
            return NextResponse.redirect(new URL('/login', req.url));
        }

        try {
            const decoded = jwtDecode(token);
            const currentTime = Date.now() / 1000;

            if (decoded.exp < currentTime) {
                return NextResponse.redirect(new URL('/login', req.url)); // Redirect if token expired
            }
        } catch (error) {
            return NextResponse.redirect(new URL('/login', req.url)); // Redirect if token is invalid
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/'], // Match dynamic routes
};
