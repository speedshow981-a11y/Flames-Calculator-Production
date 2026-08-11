import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ALL_CALCULATORS, CATEGORIES, getCalculatorsByCategory, getCategoryById } from '../src/lib/calculators-data';
import { generateCalculatorContent } from '../src/lib/calculator-content';
import { generateXmlSitemap, generateRobotsTxt } from '../src/lib/seo-service';
import { SITE_URL, getCanonicalUrl } from '../src/lib/seo-config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, '../dist');

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function injectMetaAndContent(
  baseHtml: string,
  options: {
    title: string;
    description: string;
    canonicalUrl: string;
    schemaJson?: object;
    prerenderHtml?: string;
    is404?: boolean;
  }
): string {
  let html = baseHtml;

  // Title replacement
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(options.title)}</title>`);

  // Remove existing description & canonical if present
  html = html.replace(/<meta\s+name=["']description["'][\s\S]*?>/gi, '');
  html = html.replace(/<link\s+rel=["']canonical["'][\s\S]*?>/gi, '');
  html = html.replace(/<meta\s+property=["']og:[\s\S]*?>/gi, '');
  html = html.replace(/<meta\s+name=["']twitter:[\s\S]*?>/gi, '');
  html = html.replace(/<script\s+type=["']application\/ld\+json["'][\s\S]*?<\/script>/gi, '');

  // Build new SEO tags
  const tags: string[] = [
    `<meta name="description" content="${escapeHtml(options.description)}" />`,
    `<link rel="canonical" href="${options.canonicalUrl}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:title" content="${escapeHtml(options.title)}" />`,
    `<meta property="og:description" content="${escapeHtml(options.description)}" />`,
    `<meta property="og:url" content="${options.canonicalUrl}" />`,
    `<meta property="og:site_name" content="Flames Calculator" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeHtml(options.title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(options.description)}" />`,
  ];

  if (options.is404) {
    tags.push(`<meta name="robots" content="noindex, follow" />`);
  } else {
    tags.push(`<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />`);
  }

  if (options.schemaJson) {
    const jsonStr = JSON.stringify(options.schemaJson, null, 2);
    tags.push(`<script type="application/ld+json">\n${jsonStr}\n</script>`);
  }

  // Inject into <head>
  html = html.replace('</head>', `  ${tags.join('\n  ')}\n</head>`);

  // Inject semantic initial HTML into <div id="root">
  if (options.prerenderHtml) {
    html = html.replace(
      '<div id="root"></div>',
      `<div id="root">${options.prerenderHtml}</div>`
    );
  }

  return html;
}

function writePage(subPath: string, content: string) {
  const targetDir = path.join(distDir, subPath);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  fs.writeFileSync(path.join(targetDir, 'index.html'), content, 'utf-8');
}

async function runPrerender() {
  console.log('🚀 Starting Static Pre-Rendering (SSG) for Flames Calculator...');

  if (!fs.existsSync(distDir)) {
    console.error('❌ dist directory does not exist! Please run vite build first.');
    process.exit(1);
  }

  const baseHtml = fs.readFileSync(path.join(distDir, 'index.html'), 'utf-8');
  const totalCalcs = ALL_CALCULATORS.length;

  // 1. Homepage Pre-rendering
  console.log('📄 Pre-rendering Homepage (/)');
  const homeTitle = 'Free Online Calculators – Flames Calculator';
  const homeDesc = 'Use free online calculators for finance, math, health, everyday calculations and more. Fast, simple, and easy-to-use precision calculator tools on Flames Calculator.';
  const homeCanonical = getCanonicalUrl('/');
  const homeSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${homeCanonical}#website`,
        url: homeCanonical,
        name: 'Flames Calculator',
        description: 'Free online calculation platform with verified financial, health, scientific, and math calculators.',
        publisher: {
          '@type': 'Organization',
          '@id': `${homeCanonical}#org`,
          name: 'Flames Calculator',
          url: homeCanonical,
          logo: `${homeCanonical}icon.png`,
        },
      },
      {
        '@type': 'WebApplication',
        '@id': `${homeCanonical}#app`,
        name: 'Flames Calculator',
        url: homeCanonical,
        description: 'Free online calculation platform with verified financial, health, scientific, and math calculators.',
        applicationCategory: 'UtilitiesApplication',
        operatingSystem: 'All Modern Browsers',
        offers: {
          '@type': 'Offer',
          price: '0.00',
          priceCurrency: 'USD',
        },
      },
      {
        '@type': 'Organization',
        '@id': `${homeCanonical}#org`,
        name: 'Flames Calculator',
        url: homeCanonical,
        logo: `${homeCanonical}icon.png`,
      },
    ],
  };

  const homeHtml = injectMetaAndContent(baseHtml, {
    title: homeTitle,
    description: homeDesc,
    canonicalUrl: homeCanonical,
    schemaJson: homeSchema,
  });
  fs.writeFileSync(path.join(distDir, 'index.html'), homeHtml, 'utf-8');

  // 2. Category Pages Pre-rendering
  console.log(`📂 Pre-rendering ${CATEGORIES.length} Category Pages (/category/*/)`);
  for (const cat of CATEGORIES) {
    const catTools = getCalculatorsByCategory(cat.id);
    const catTitle = `${cat.name} Calculators – Free Online Tools | Flames Calculator`;
    const catDesc = `Use free online ${cat.name.toLowerCase()} calculators. Browse ${catTools.length} calculation tools with instant results, formulas, and step-by-step guidance on Flames Calculator.`;
    const catCanonical = getCanonicalUrl(`/category/${cat.id}/`);

    const catSchema = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'CollectionPage',
          '@id': `${catCanonical}#page`,
          url: catCanonical,
          name: catTitle,
          description: catDesc,
          isPartOf: {
            '@type': 'WebSite',
            url: homeCanonical,
            name: 'Flames Calculator',
          },
          breadcrumb: {
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: homeCanonical,
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: cat.name,
                item: catCanonical,
              },
            ],
          },
        },
      ],
    };

    // Semantic initial HTML
    const toolsListHtml = catTools
      .map(
        (t) => `
        <article class="calc-card" style="border:1px solid #e2e8f0; border-radius:12px; padding:16px; margin-bottom:12px;">
          <h2><a href="/calculators/${t.id}/" style="color:#ea580c; text-decoration:none; font-weight:bold;">${escapeHtml(t.title)}</a></h2>
          <p style="color:#64748b; font-size:14px; margin-top:4px;">${escapeHtml(t.description)}</p>
          <a href="/calculators/${t.id}/" style="display:inline-block; margin-top:8px; font-size:13px; color:#ea580c; font-weight:600;">Launch Calculator &rarr;</a>
        </article>
      `
      )
      .join('\n');

    const catPrerenderHtml = `
      <main style="max-width:1100px; margin:0 auto; padding:24px 16px; font-family:system-ui,-apple-system,sans-serif;">
        <nav aria-label="Breadcrumb" style="font-size:13px; margin-bottom:16px; color:#64748b;">
          <a href="/" style="color:#64748b; text-decoration:none;">Home</a> &gt; <span>${escapeHtml(cat.name)}</span>
        </nav>
        <h1 style="font-size:28px; font-weight:800; color:#0f172a; margin-bottom:8px;">${escapeHtml(cat.name)}</h1>
        <p style="color:#64748b; font-size:15px; margin-bottom:24px;">${escapeHtml(cat.description)}</p>
        <section class="tools-grid">
          ${toolsListHtml}
        </section>
      </main>
    `;

    const generatedCatHtml = injectMetaAndContent(baseHtml, {
      title: catTitle,
      description: catDesc,
      canonicalUrl: catCanonical,
      schemaJson: catSchema,
      prerenderHtml: catPrerenderHtml,
    });

    writePage(`category/${cat.id}`, generatedCatHtml);
  }

  // 3. AI Suite Page Pre-rendering
  console.log('🤖 Pre-rendering AI Suite (/ai-suite/)');
  const aiTitle = 'Gemini AI Financial & Strategic Suite – Flames Calculator';
  const aiDesc = 'Run neural scenario modeling, debt payoff comparisons, and health biometrics optimization powered by Google Gemini on Flames Calculator.';
  const aiCanonical = getCanonicalUrl('/ai-suite/');
  const aiHtml = injectMetaAndContent(baseHtml, {
    title: aiTitle,
    description: aiDesc,
    canonicalUrl: aiCanonical,
  });
  writePage('ai-suite', aiHtml);

  // 4. All 217 Calculators Pre-rendering
  console.log(`⚡ Pre-rendering ${totalCalcs} Individual Calculator Pages (/calculators/*/)`);
  for (const calc of ALL_CALCULATORS) {
    const content = generateCalculatorContent(calc, 'US');
    const calcCanonical = getCanonicalUrl(`/calculators/${calc.id}/`);

    // Semantic initial HTML for search engines & instant loading
    const faqsHtml = (content.faqs || [])
      .map(
        (f) => `
        <div style="margin-bottom:16px; border:1px solid #f1f5f9; padding:12px; border-radius:8px;">
          <h3 style="font-size:15px; font-weight:700; color:#0f172a; margin-bottom:4px;">${escapeHtml(f.question)}</h3>
          <p style="font-size:14px; color:#475569; line-height:1.5;">${escapeHtml(f.answer)}</p>
        </div>
      `
      )
      .join('\n');

    const steps = content.workedExample?.stepByStep || (content.howToSteps || []).map((h) => h.text) || [];
    const stepsHtml = steps
      .map((s, idx) => `<li style="margin-bottom:8px; font-size:14px; color:#334155;"><strong>Step ${idx + 1}:</strong> ${escapeHtml(s)}</li>`)
      .join('\n');

    const formula = content.formulaSection?.formula || '';
    const formulaExp = content.formulaSection?.explanation || '';

    const calcPrerenderHtml = `
      <main style="max-width:1000px; margin:0 auto; padding:24px 16px; font-family:system-ui,-apple-system,sans-serif;">
        <nav aria-label="Breadcrumb" style="font-size:13px; margin-bottom:16px; color:#64748b;">
          <a href="/" style="color:#64748b; text-decoration:none;">Home</a> &gt;
          <a href="/category/${calc.category}/" style="color:#64748b; text-decoration:none;">${escapeHtml(calc.categoryName)}</a> &gt;
          <span>${escapeHtml(calc.title)}</span>
        </nav>
        <h1 style="font-size:32px; font-weight:800; color:#0f172a; margin-bottom:8px;">${escapeHtml(calc.title)}</h1>
        <p style="color:#64748b; font-size:15px; line-height:1.6; margin-bottom:24px;">${escapeHtml(calc.description)}</p>
        
        ${
          formula
            ? `<section style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:20px; margin-bottom:24px;">
          <h2 style="font-size:18px; font-weight:700; color:#0f172a; margin-bottom:12px;">Mathematical Verification & Formula</h2>
          <div style="background:#0f172a; color:#38bdf8; font-family:monospace; padding:12px; border-radius:8px; font-size:14px; margin-bottom:12px;">
            ${escapeHtml(formula)}
          </div>
          <p style="font-size:14px; color:#475569; line-height:1.6;">${escapeHtml(formulaExp)}</p>
        </section>`
            : ''
        }

        ${
          steps.length > 0
            ? `<section style="margin-bottom:24px;">
          <h2 style="font-size:18px; font-weight:700; color:#0f172a; margin-bottom:12px;">Step-by-Step Calculation Guide</h2>
          <ol style="padding-left:20px;">
            ${stepsHtml}
          </ol>
        </section>`
            : ''
        }

        ${
          (content.faqs || []).length > 0
            ? `<section style="margin-bottom:24px;">
          <h2 style="font-size:18px; font-weight:700; color:#0f172a; margin-bottom:12px;">Frequently Asked Questions</h2>
          ${faqsHtml}
        </section>`
            : ''
        }
      </main>
    `;

    const generatedCalcHtml = injectMetaAndContent(baseHtml, {
      title: content.metaTitle,
      description: content.metaDescription,
      canonicalUrl: calcCanonical,
      schemaJson: content.schemaJson,
      prerenderHtml: calcPrerenderHtml,
    });

    writePage(`calculators/${calc.id}`, generatedCalcHtml);
  }

  // 5. 404 Page Pre-rendering
  console.log('🛑 Pre-rendering 404 Page (dist/404.html)');
  const notFoundHtml = injectMetaAndContent(baseHtml, {
    title: '404 - Calculator Not Found | Flames Calculator',
    description: 'The requested calculation engine or category could not be located. Explore over 217 verified tools across finance, health, and science.',
    canonicalUrl: getCanonicalUrl('/404'),
    is404: true,
    prerenderHtml: `
      <main style="max-width:700px; margin:80px auto; text-align:center; padding:24px; font-family:system-ui,-apple-system,sans-serif;">
        <div style="font-size:64px; font-weight:900; color:#ea580c; margin-bottom:16px;">404</div>
        <h1 style="font-size:28px; font-weight:800; color:#0f172a; margin-bottom:12px;">Calculation Engine Not Found</h1>
        <p style="color:#64748b; font-size:15px; line-height:1.6; margin-bottom:24px;">The calculator or URL you requested does not exist or has been moved. Explore our full suite of precision tools.</p>
        <a href="/" style="display:inline-block; background:#ea580c; color:#ffffff; padding:12px 24px; border-radius:10px; font-weight:700; text-decoration:none;">Return to Directory &rarr;</a>
      </main>
    `,
  });
  fs.writeFileSync(path.join(distDir, '404.html'), notFoundHtml, 'utf-8');

  // 6. Generate Static Sitemap & Robots & .htaccess
  console.log('🗺️ Generating dist/sitemap.xml and dist/robots.txt');
  fs.writeFileSync(path.join(distDir, 'sitemap.xml'), generateXmlSitemap(), 'utf-8');
  fs.writeFileSync(path.join(distDir, 'robots.txt'), generateRobotsTxt(), 'utf-8');

  // 7. Generate Apache .htaccess for Hostinger / Shared Web Hosting
  console.log('⚙️ Generating dist/.htaccess for Hostinger & Apache hosting');
  const htaccessContent = `# Flames Calculator — Hostinger / Apache Web Server Configuration
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /

  # Force HTTPS
  RewriteCond %{HTTPS} off
  RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

  # Enforce Trailing Slash on directories for canonical consistency
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_URI} !(.[a-zA-Z0-9]{1,5})$
  RewriteCond %{REQUEST_URI} !/$
  RewriteRule ^(.*)$ $1/ [R=301,L]

  # Serve pre-rendered index.html if subdirectory exists
  RewriteCond %{REQUEST_FILENAME}/index.html -f
  RewriteRule ^(.*)$ $1/index.html [L]

  # Fallback to 404.html for non-existent routes
  ErrorDocument 404 /404.html
</IfModule>

<IfModule mod_deflate.c>
  # Compress HTML, CSS, JavaScript, Text, XML and fonts
  AddOutputFilterByType DEFLATE application/javascript
  AddOutputFilterByType DEFLATE application/rss+xml
  AddOutputFilterByType DEFLATE application/vnd.ms-fontobject
  AddOutputFilterByType DEFLATE application/x-font
  AddOutputFilterByType DEFLATE application/x-font-opentype
  AddOutputFilterByType DEFLATE application/x-font-otf
  AddOutputFilterByType DEFLATE application/x-font-truetype
  AddOutputFilterByType DEFLATE application/x-font-ttf
  AddOutputFilterByType DEFLATE application/x-javascript
  AddOutputFilterByType DEFLATE application/xhtml+xml
  AddOutputFilterByType DEFLATE application/xml
  AddOutputFilterByType DEFLATE font/opentype
  AddOutputFilterByType DEFLATE font/otf
  AddOutputFilterByType DEFLATE font/ttf
  AddOutputFilterByType DEFLATE image/svg+xml
  AddOutputFilterByType DEFLATE image/x-icon
  AddOutputFilterByType DEFLATE text/css
  AddOutputFilterByType DEFLATE text/html
  AddOutputFilterByType DEFLATE text/javascript
  AddOutputFilterByType DEFLATE text/plain
  AddOutputFilterByType DEFLATE text/xml
</IfModule>

<IfModule mod_headers.c>
  # 1 Year Cache for Static Assets
  <FilesMatch "\\.(ico|pdf|flv|jpg|jpeg|png|gif|webp|js|css|swf|svg|woff|woff2|ttf)$">
    Header set Cache-Control "max-age=31536000, public"
  </FilesMatch>
  # 1 Hour Cache for HTML & XML
  <FilesMatch "\\.(html|htm|xml|txt)$">
    Header set Cache-Control "max-age=3600, public, must-revalidate"
  </FilesMatch>
</IfModule>
`;
  fs.writeFileSync(path.join(distDir, '.htaccess'), htaccessContent, 'utf-8');

  console.log(`✅ SSG Pre-rendering Complete! Generated ${totalCalcs + CATEGORIES.length + 3} static HTML pages + sitemap.xml + robots.txt + .htaccess.`);

  // 8. Run Production SEO Audit & Validation Suite
  console.log('\n🔍 ========================================================');
  console.log('🔍 RUNNING PRODUCTION SEO AUDIT & VALIDATION SUITE');
  console.log('🔍 ========================================================');
  validateProductionSeo();
}

function validateProductionSeo() {
  const titles = new Map<string, string>();
  const canonicals = new Map<string, string>();
  const errors: string[] = [];

  // A. Validate Sitemap
  const sitemapPath = path.join(distDir, 'sitemap.xml');
  if (!fs.existsSync(sitemapPath)) {
    errors.push('dist/sitemap.xml does not exist');
  } else {
    const sitemapContent = fs.readFileSync(sitemapPath, 'utf-8');
    const locMatches = sitemapContent.match(/<loc>(.*?)<\/loc>/g) || [];
    const sitemapUrls = locMatches.map((m) => m.replace(/<\/?loc>/g, ''));
    console.log(`  ✓ Sitemap exists with ${sitemapUrls.length} indexable URLs`);

    if (sitemapUrls.length !== ALL_CALCULATORS.length + CATEGORIES.length + 2) {
      errors.push(`Expected ${ALL_CALCULATORS.length + CATEGORIES.length + 2} URLs in sitemap, found ${sitemapUrls.length}`);
    }

    for (const url of sitemapUrls) {
      if (!url.startsWith(SITE_URL)) {
        errors.push(`Sitemap URL does not use production domain ${SITE_URL}: ${url}`);
      }
      if (url.includes('404')) {
        errors.push(`Sitemap contains 404 URL: ${url}`);
      }
    }
  }

  // B. Validate Robots.txt
  const robotsPath = path.join(distDir, 'robots.txt');
  if (!fs.existsSync(robotsPath)) {
    errors.push('dist/robots.txt does not exist');
  } else {
    const robotsContent = fs.readFileSync(robotsPath, 'utf-8');
    if (!robotsContent.includes(`Sitemap: ${SITE_URL}/sitemap.xml`)) {
      errors.push('robots.txt does not reference the correct production sitemap URL');
    }
    console.log('  ✓ robots.txt verified');
  }

  // C. Validate Homepage
  const homePath = path.join(distDir, 'index.html');
  if (!fs.existsSync(homePath)) {
    errors.push('dist/index.html does not exist');
  } else {
    const homeHtml = fs.readFileSync(homePath, 'utf-8');
    const titleMatch = homeHtml.match(/<title>(.*?)<\/title>/i);
    const canonicalMatch = homeHtml.match(/<link\s+rel=["']canonical["']\s+href=["'](.*?)["']/i);
    if (!titleMatch) errors.push('Homepage missing <title>');
    if (!canonicalMatch || canonicalMatch[1] !== `${SITE_URL}/`) {
      errors.push(`Homepage canonical mismatch: expected ${SITE_URL}/, got ${canonicalMatch ? canonicalMatch[1] : 'none'}`);
    }
    if (titleMatch) titles.set(titleMatch[1], 'Homepage (/)');
    if (canonicalMatch) canonicals.set(canonicalMatch[1], 'Homepage (/)');
    console.log('  ✓ Homepage SEO verified');
  }

  // D. Validate Category Pages
  console.log(`  ✓ Validating ${CATEGORIES.length} Category pages...`);
  for (const cat of CATEGORIES) {
    const catPagePath = path.join(distDir, 'category', cat.id, 'index.html');
    if (!fs.existsSync(catPagePath)) {
      errors.push(`Category page missing: ${catPagePath}`);
      continue;
    }
    const html = fs.readFileSync(catPagePath, 'utf-8');
    const titleMatch = html.match(/<title>(.*?)<\/title>/i);
    const descMatch = html.match(/<meta\s+name=["']description["']\s+content=["'](.*?)["']/i);
    const canonicalMatch = html.match(/<link\s+rel=["']canonical["']\s+href=["'](.*?)["']/i);
    const robotsMatch = html.match(/<meta\s+name=["']robots["']\s+content=["'](.*?)["']/i);

    if (!titleMatch) errors.push(`Category ${cat.id} missing <title>`);
    if (!descMatch) errors.push(`Category ${cat.id} missing description`);
    if (!canonicalMatch || canonicalMatch[1] !== `${SITE_URL}/category/${cat.id}/`) {
      errors.push(`Category ${cat.id} invalid canonical: ${canonicalMatch ? canonicalMatch[1] : 'none'}`);
    }
    if (!robotsMatch || !robotsMatch[1].includes('index, follow')) {
      errors.push(`Category ${cat.id} invalid robots meta: ${robotsMatch ? robotsMatch[1] : 'none'}`);
    }

    if (titleMatch) {
      const existing = titles.get(titleMatch[1]);
      if (existing) errors.push(`Duplicate title found: "${titleMatch[1]}" in Category ${cat.id} and ${existing}`);
      titles.set(titleMatch[1], `Category: ${cat.id}`);
    }
    if (canonicalMatch) {
      const existing = canonicals.get(canonicalMatch[1]);
      if (existing) errors.push(`Duplicate canonical found: "${canonicalMatch[1]}" in Category ${cat.id} and ${existing}`);
      canonicals.set(canonicalMatch[1], `Category: ${cat.id}`);
    }
  }

  // E. Validate All 217 Calculators
  console.log(`  ✓ Validating all ${ALL_CALCULATORS.length} Calculator pages...`);
  let validCalcsCount = 0;
  for (const calc of ALL_CALCULATORS) {
    const calcPagePath = path.join(distDir, 'calculators', calc.id, 'index.html');
    if (!fs.existsSync(calcPagePath)) {
      errors.push(`Calculator page missing: ${calcPagePath}`);
      continue;
    }
    const html = fs.readFileSync(calcPagePath, 'utf-8');
    const titleMatch = html.match(/<title>(.*?)<\/title>/i);
    const descMatch = html.match(/<meta\s+name=["']description["']\s+content=["'](.*?)["']/i);
    const canonicalMatch = html.match(/<link\s+rel=["']canonical["']\s+href=["'](.*?)["']/i);
    const robotsMatch = html.match(/<meta\s+name=["']robots["']\s+content=["'](.*?)["']/i);
    const h1Match = html.match(/<h1[\s\S]*?>([\s\S]*?)<\/h1>/i);
    const schemaMatch = html.match(/<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/i);

    if (!titleMatch) errors.push(`Calculator ${calc.id} missing <title>`);
    if (!descMatch) errors.push(`Calculator ${calc.id} missing description`);
    if (!canonicalMatch || canonicalMatch[1] !== `${SITE_URL}/calculators/${calc.id}/`) {
      errors.push(`Calculator ${calc.id} invalid canonical: ${canonicalMatch ? canonicalMatch[1] : 'none'}`);
    }
    if (!robotsMatch || !robotsMatch[1].includes('index, follow')) {
      errors.push(`Calculator ${calc.id} invalid robots meta: ${robotsMatch ? robotsMatch[1] : 'none'}`);
    }
    if (!h1Match) errors.push(`Calculator ${calc.id} missing <h1>`);
    if (!schemaMatch) {
      errors.push(`Calculator ${calc.id} missing JSON-LD schema`);
    } else {
      try {
        JSON.parse(schemaMatch[1]);
      } catch (e: any) {
        errors.push(`Calculator ${calc.id} has invalid JSON-LD: ${e.message}`);
      }
    }

    if (titleMatch) {
      const existing = titles.get(titleMatch[1]);
      if (existing) errors.push(`Duplicate title found: "${titleMatch[1]}" in Calculator ${calc.id} and ${existing}`);
      titles.set(titleMatch[1], `Calculator: ${calc.id}`);
    }
    if (canonicalMatch) {
      const existing = canonicals.get(canonicalMatch[1]);
      if (existing) errors.push(`Duplicate canonical found: "${canonicalMatch[1]}" in Calculator ${calc.id} and ${existing}`);
      canonicals.set(canonicalMatch[1], `Calculator: ${calc.id}`);
    }

    validCalcsCount++;
  }

  // F. Validate 404 Page
  const notFoundPath = path.join(distDir, '404.html');
  if (!fs.existsSync(notFoundPath)) {
    errors.push('dist/404.html does not exist');
  } else {
    const html = fs.readFileSync(notFoundPath, 'utf-8');
    if (!html.includes('noindex')) {
      errors.push('404 page does not contain noindex tag');
    }
    console.log('  ✓ 404 page verified with noindex');
  }

  // G. Old-Domain & HTTP Deep Scan of dist/
  console.log('  ✓ Scanning dist/ files for deprecated domains or insecure HTTP URLs...');
  function scanDir(dir: string) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const full = path.join(dir, file);
      if (fs.statSync(full).isDirectory()) {
        scanDir(full);
      } else if (/\.(html|xml|txt|json)$/i.test(file)) {
        const text = fs.readFileSync(full, 'utf-8');
        if (text.includes('nsccalculators.com')) {
          errors.push(`File ${full} contains deprecated domain 'nsccalculators.com'`);
        }
        if (text.includes('http://flamescalculator.org')) {
          errors.push(`File ${full} contains insecure 'http://flamescalculator.org' (must be HTTPS)`);
        }
      }
    }
  }
  scanDir(distDir);

  if (errors.length > 0) {
    console.error('\n❌ PRODUCTION SEO AUDIT FAILED with the following errors:');
    errors.forEach((err, i) => console.error(`  ${i + 1}. ${err}`));
    process.exit(1);
  }

  console.log('\n🎉 ========================================================');
  console.log('🎉 SEO STATUS: READY (100% PASS)');
  console.log(`🎉 • Validated Calculators: ${validCalcsCount}/${ALL_CALCULATORS.length}`);
  console.log(`🎉 • Validated Categories: ${CATEGORIES.length}/${CATEGORIES.length}`);
  console.log(`🎉 • Unique Titles Verified: ${titles.size}`);
  console.log(`🎉 • Unique Canonicals Verified: ${canonicals.size}`);
  console.log(`🎉 • Deprecated Domains Found: 0`);
  console.log(`🎉 • Production Domain: ${SITE_URL}`);
  console.log('🎉 ========================================================\n');
}

runPrerender().catch((err) => {
  console.error('Error during prerender:', err);
  process.exit(1);
});
