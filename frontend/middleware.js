import { NextResponse } from 'next/server';
import { jwtDecode } from 'jwt-decode';

export function middleware(req) {
    const token = req.cookies.get('access_token')?.value;
    const pathname = req.nextUrl.pathname; // Requested route

    if (!token) {
        // Encode pathname once to prevent double encoding
        const redirectPath = encodeURIComponent(pathname);

        // Redirect to login with original route as a query param
        const loginUrl = new URL('/login', req.url);
        loginUrl.searchParams.set('redirect', redirectPath);

        return NextResponse.redirect(loginUrl);
    }

    try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decoded.exp < currentTime) {
            const redirectPath = encodeURIComponent(pathname);
            const loginUrl = new URL('/login', req.url);
            loginUrl.searchParams.set('redirect', redirectPath);
            return NextResponse.redirect(loginUrl); // Redirect if token expired
        }
    } catch (error) {
        const redirectPath = encodeURIComponent(pathname);
        const loginUrl = new URL('/login', req.url);
        loginUrl.searchParams.set('redirect', redirectPath);
        return NextResponse.redirect(loginUrl); // Redirect if token is invalid
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/'], // Protected routes
};
