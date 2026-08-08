/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  trailingSlash: true,

  async redirects() {
    return [
      // The www to non-www redirect lives in middleware.ts, not here — a
      // redirects() rule cannot rewrite the host alone without mangling the
      // root path and the trailing slash. See the comment in that file.

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
