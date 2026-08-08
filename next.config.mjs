/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  trailingSlash: true,

  async redirects() {
    return [
      // Collapse www into the canonical host.
      //
      // Both hostnames were serving the full site with a 200, so every page
      // existed at two addresses. The canonical tag pointed at the non-www
      // version, which is why Search Console filed the duplicates under
      // "Alternate page with proper canonical tag" rather than indexing them.
      // A 301 is strictly better than relying on the canonical: it removes the
      // duplicate instead of asking Google to disregard it, and it stops the
      // crawl budget of a new site being spent twice on the same content.
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.exploreexcel.com' }],
        destination: 'https://exploreexcel.com/:path*',
        permanent: true,
      },

      // The template slug moved to the American spelling, which is also the
      // term US readers search for. Permanent, so any link or index entry
      // pointing at the old URL passes its value to the new one.
      {
        source: '/templates/loan-amortisation',
        destination: '/templates/loan-amortization',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
