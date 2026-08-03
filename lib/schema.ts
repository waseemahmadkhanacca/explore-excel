export const SITE = {
  name: 'Explore Excel',
  url: 'https://exploreexcel.com',
  tagline: 'Explore. Learn. Automate.',
  author: {
    name: 'Waseem',
    credential: 'ACCA',
    url: 'https://exploreexcel.com/about',
  },
} as const;

interface FormulaMeta {
  slug: string;
  name: string;
  description: string;
  updated: string;
  video?: string;
  faq?: { q: string; a: string }[];
}

/**
 * Site-level identity, for the homepage only.
 *
 * WebSite makes the site eligible for a sitelinks search box, and gives Google
 * an explicit name to use rather than one inferred from the title tag.
 * Organization is what a knowledge panel is built from.
 */
export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE.name,
    alternateName: 'ExploreExcel',
    url: `${SITE.url}/`,
    description: SITE.tagline,
    inLanguage: 'en-US',
    publisher: { '@type': 'Organization', name: SITE.name, url: `${SITE.url}/` },
  };
}

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE.name,
    url: `${SITE.url}/`,
    logo: `${SITE.url}/og-image.png`,
    description:
      'A live, interactive Excel reference. Every formula page carries a working spreadsheet you can edit in the browser.',
    founder: { '@type': 'Person', name: SITE.author.name },
  };
}

/** For an index page that lists things — the formula library, templates, blog. */
export function collectionSchema(name: string, description: string, path: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name,
    description,
    url: `${SITE.url}${path}`,
    inLanguage: 'en-US',
    isPartOf: { '@type': 'WebSite', name: SITE.name, url: `${SITE.url}/` },
  };
}

/** Article schema — tells Google this is a maintained technical reference. */
export function articleSchema(f: FormulaMeta) {
  return {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: `${f.name} function in Excel`,
    description: f.description,
    dateModified: f.updated,
    author: {
      '@type': 'Person',
      name: SITE.author.name,
      honorificSuffix: SITE.author.credential,
      url: SITE.author.url,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE.name,
      url: SITE.url,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE.url}/logo-mark.svg`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE.url}/formulas/${f.slug}/`,
    },
  };
}

/**
 * FAQ schema — this is the highest-value markup on the site.
 * It can win a rich result that occupies several times the vertical
 * space of a normal listing, which matters far more than ranking
 * position alone on a page-one result.
 */
export function faqSchema(faq: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  };
}

/** Breadcrumbs replace the raw URL in search results with a readable path. */
export function breadcrumbSchema(trail: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${SITE.url}${item.path}`,
    })),
  };
}

