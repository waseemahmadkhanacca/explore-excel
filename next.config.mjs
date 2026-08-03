/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  trailingSlash: true,

  async redirects() {
    return [
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
