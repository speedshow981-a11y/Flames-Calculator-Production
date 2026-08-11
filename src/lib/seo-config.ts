/**
 * Centralized SEO Configuration & Domain Constants for Flames Calculator
 */

export const SITE_URL = 'https://flamescalculator.org';

export const SITE_CONFIG = {
  name: 'Flames Calculator',
  tagline: 'Free Online Calculators, Financial Engines & Scientific Tools',
  defaultDomain: SITE_URL,
  author: 'Flames Calculator Mathematical Team',
};

/**
 * Returns the effective base URL for canonical tags, sitemaps, and schemas.
 * Strictly uses the central production domain constant SITE_URL.
 * Never leaks localhost, development URLs, or wrong domains into canonical/SEO systems.
 */
export function getBaseUrl(): string {
  return SITE_URL;
}

/**
 * Formats a clean canonical URL with consistent trailing slash.
 * Follows Google Search guidelines and prevents duplicate canonical signals.
 */
export function getCanonicalUrl(path = '/'): string {
  const base = getBaseUrl();
  if (!path || path === '/') {
    return `${base}/`;
  }
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  // Ensure trailing slash for SEO consistency on directory routes
  const pathWithSlash = cleanPath.endsWith('/') ? cleanPath : `${cleanPath}/`;
  return `${base}${pathWithSlash}`;
}


