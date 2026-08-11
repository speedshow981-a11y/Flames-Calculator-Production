import { ALL_CALCULATORS, CATEGORIES } from './calculators-data';
import { SITE_CONFIG, getBaseUrl, getCanonicalUrl } from './seo-config';

export interface SeoMetaProps {
  title: string;
  description: string;
  keywords?: string;
  canonicalUrl?: string;
  ogType?: string;
  ogImage?: string;
  schemaJson?: object;
  noindex?: boolean;
}

/**
 * Dynamically updates document head meta tags, canonical link, and JSON-LD schema
 */
export function updateDocumentSeo({
  title,
  description,
  keywords,
  canonicalUrl,
  ogType = 'website',
  ogImage,
  schemaJson,
  noindex = false,
}: SeoMetaProps): void {
  if (typeof document === 'undefined') return;

  const effectiveCanonical = canonicalUrl || getCanonicalUrl('/');

  // Update Title
  document.title = title;

  // Helper for meta tags
  const setMetaTag = (attrName: string, attrValue: string, content: string) => {
    let element = document.querySelector(`meta[${attrName}="${attrValue}"]`);
    if (!element) {
      element = document.createElement('meta');
      element.setAttribute(attrName, attrValue);
      document.head.appendChild(element);
    }
    element.setAttribute('content', content);
  };

  const removeMetaTag = (attrName: string, attrValue: string) => {
    const element = document.querySelector(`meta[${attrName}="${attrValue}"]`);
    if (element) {
      element.remove();
    }
  };

  // Standard Meta
  setMetaTag('name', 'description', description);
  if (keywords) {
    setMetaTag('name', 'keywords', keywords);
  }
  setMetaTag(
    'name',
    'robots',
    noindex
      ? 'noindex, follow'
      : 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1'
  );
  setMetaTag('name', 'author', SITE_CONFIG.author);

  // Open Graph
  setMetaTag('property', 'og:title', title);
  setMetaTag('property', 'og:description', description);
  setMetaTag('property', 'og:type', ogType);
  setMetaTag('property', 'og:url', effectiveCanonical);
  setMetaTag('property', 'og:site_name', SITE_CONFIG.name);
  if (ogImage) {
    setMetaTag('property', 'og:image', ogImage);
  } else {
    removeMetaTag('property', 'og:image');
  }

  // Twitter Card
  setMetaTag('name', 'twitter:card', 'summary_large_image');
  setMetaTag('name', 'twitter:title', title);
  setMetaTag('name', 'twitter:description', description);
  setMetaTag('name', 'twitter:url', effectiveCanonical);
  if (ogImage) {
    setMetaTag('name', 'twitter:image', ogImage);
  } else {
    removeMetaTag('name', 'twitter:image');
  }

  // Canonical Link
  let canonicalLink = document.querySelector('link[rel="canonical"]');
  if (noindex) {
    if (canonicalLink) {
      canonicalLink.remove();
    }
  } else {
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', effectiveCanonical);
  }

  // Schema.org JSON-LD injection
  let scriptTag = document.getElementById('flames-jsonld-schema') as HTMLScriptElement | null;
  if (schemaJson) {
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'flames-jsonld-schema';
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = JSON.stringify(schemaJson, null, 2);
  } else if (scriptTag) {
    scriptTag.remove();
  }
}

/**
 * Generates an XML Sitemap for all calculators, categories, AI Suite, and homepage
 */
export function generateXmlSitemap(customBaseUrl?: string): string {
  const baseUrl = customBaseUrl ? customBaseUrl.replace(/\/+$/, '') : getBaseUrl();

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  // Homepage
  xml += `  <url>\n    <loc>${baseUrl}/</loc>\n  </url>\n`;

  // AI Suite Page
  xml += `  <url>\n    <loc>${baseUrl}/ai-suite/</loc>\n  </url>\n`;

  // Categories
  CATEGORIES.forEach((cat) => {
    xml += `  <url>\n    <loc>${baseUrl}/category/${cat.id}/</loc>\n  </url>\n`;
  });

  // All Calculators
  ALL_CALCULATORS.forEach((calc) => {
    xml += `  <url>\n    <loc>${baseUrl}/calculators/${calc.id}/</loc>\n  </url>\n`;
  });

  xml += `</urlset>`;
  return xml;
}

/**
 * Generates robots.txt content allowing standard indexing
 */
export function generateRobotsTxt(customBaseUrl?: string): string {
  const baseUrl = customBaseUrl ? customBaseUrl.replace(/\/+$/, '') : getBaseUrl();
  return `User-agent: *
Allow: /

Sitemap: ${baseUrl}/sitemap.xml
`;
}
