/**
 * Cloudflare Web Analytics.
 *
 * Cookieless, so it needs no consent banner under GDPR — a real advantage over
 * Google Analytics for an EU-facing site. It stays inert until you paste your
 * token into NEXT_PUBLIC_CF_ANALYTICS_TOKEN, so there is nothing to remove
 * before launch and nothing to configure to keep it off.
 *
 * Get the token free at: Cloudflare dashboard -> your domain -> Analytics ->
 * Web Analytics -> Add a site.
 */
export default function Analytics() {
  const token = process.env.NEXT_PUBLIC_CF_ANALYTICS_TOKEN;
  if (!token) return null;

  return (
    <script
      defer
      src="https://static.cloudflareinsights.com/beacon.min.js"
      data-cf-beacon={JSON.stringify({ token })}
    />
  );
}
