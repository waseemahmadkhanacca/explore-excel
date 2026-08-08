import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const CANONICAL_HOST = 'exploreexcel.com';

/**
 * Collapses www into the canonical host in a single hop.
 *
 * Both hostnames served the full site with a 200, so every page existed at two
 * addresses and Search Console filed the www copies under "Alternate page with
 * proper canonical tag" instead of indexing them.
 *
 * This is done here rather than with a redirects() rule in next.config.mjs
 * because that rule cannot rewrite only the host: `/:path*` interpolates to a
 * literal ":path*" on the root, and because trailingSlash is on it dropped the
 * slash and then needed a second redirect to add it back. Rebuilding the URL
 * object keeps the path, the query string and the trailing slash exactly as
 * they arrived, including for files under /downloads/.
 */
export function middleware(request: NextRequest) {
  const url = new URL(request.url);

  if (url.hostname === `www.${CANONICAL_HOST}`) {
    url.hostname = CANONICAL_HOST;
    url.protocol = 'https:';
    url.port = '';
    return NextResponse.redirect(url, 301);
  }

  return NextResponse.next();
}

export const config = {
  // Everything, assets included — a duplicate host serves those too.
  matcher: '/:path*',
};
