export function JsonLd({ data }: { data: (object | null)[] }) {
  const clean = data.filter(Boolean);
  if (!clean.length) return null;
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(clean) }}
    />
  );
}
