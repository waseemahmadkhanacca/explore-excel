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

