import { NextRequest, NextResponse } from 'next/server';

/**
 * SUBDOMAIN ROUTING MIDDLEWARE
 *
 * HOW IT WORKS:
 * ─────────────
 * In PRODUCTION (avopay.in):
 *   loyalmart.avopay.in  →  internally routes to /t/loyalmart
 *   avopay.avopay.in     →  internally routes to /t/avopay
 *   admin.avopay.in      →  routes to /admin
 *   avopay.in (root)     →  routes to / (landing page)
 *
 * In LOCAL DEV (localhost:3000):
 *   Subdomains don't work by default, so use path-based routing instead:
 *   localhost:3000/t/loyalmart  →  same branded portal
 *   localhost:3000/t/avopay     →  same branded portal
 *   localhost:3000/admin        →  admin panel
 *
 * PRODUCTION SETUP NEEDED:
 * ─────────────────────────
 * 1. Point *.avopay.in (wildcard DNS) to your server
 * 2. Deploy this Next.js app there
 * 3. The middleware will auto-handle all subdomain routing
 */

const ROOT_DOMAIN = 'avopay.in';
const RESERVED_SUBDOMAINS = ['www', 'admin', 'app', 'api'];

export function middleware(req: NextRequest) {
    const url = req.nextUrl.clone();
    const host = req.headers.get('host') || '';

    // Only run in production — skip localhost
    if (host.includes('localhost') || host.includes('127.0.0.1')) {
        return NextResponse.next();
    }

    // Parse subdomain from host
    // e.g. "loyalmart.avopay.in" → "loyalmart"
    const hostWithoutPort = host.split(':')[0];
    const subdomain = hostWithoutPort.replace(`.${ROOT_DOMAIN}`, '');

    // No subdomain (root domain) or same as root → serve normally
    if (!subdomain || subdomain === ROOT_DOMAIN || subdomain === hostWithoutPort) {
        return NextResponse.next();
    }

    // Reserved subdomains → serve normally (they have their own pages)
    if (RESERVED_SUBDOMAINS.includes(subdomain)) {
        return NextResponse.next();
    }

    // Tenant subdomain — rewrite to /t/[subdomain] internally
    // The URL in the browser stays as "loyalmart.avopay.in"
    // but Next.js serves /t/loyalmart
    url.pathname = `/t/${subdomain}${url.pathname === '/' ? '' : url.pathname}`;
    return NextResponse.rewrite(url);
}

export const config = {
    // Run middleware on all routes except static files, api routes, and _next
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
