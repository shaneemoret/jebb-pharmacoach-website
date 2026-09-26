import { readFileSync, writeFileSync, appendFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const dist = path.join(root, 'dist/client');
const readJson = file => JSON.parse(readFileSync(path.join(root, file), 'utf8'));
const posts = readJson('src/posts.json');
const pages = readJson('src/migrated-pages.json');
const profiles = readJson('src/social-profiles.json');
const origin = 'https://thepharmacoach.com';
const image = origin + '/assets/source/jebb-banner-owner.png';
const escape = value => String(value).replace(/[&"<>]/g, c => ({ '&': '&amp;', '"': '&quot;', '<': '&lt;', '>': '&gt;' })[c]);
const organization = {
  '@type': 'Organization', '@id': origin + '/#organization', name: 'The Pharma Coach, LLC',
  url: origin + '/', sameAs: profiles.map(p => p.url),
  founder: { '@type': 'Person', '@id': origin + '/about/#jebb', name: 'Jebb C. Ruff, MBA' },
};
const routes = [
  { slug: '', title: 'Start Your Career in Pharmaceutical Sales', description: 'Start or advance your career in pharmaceutical sales with practical coaching for nurses, healthcare professionals, and sales reps.' },
  { slug: 'about', title: 'About The Pharma Coach | Jebb C. Ruff, MBA', description: 'Meet Jebb Ruff, medical sales hiring manager, sales trainer and founder of The Pharma Coach. Explore his background and coaching approach.' },
  { slug: 'blog', title: 'Pharmaceutical Sales Career Advice', description: 'Practical advice from Jebb Ruff on pharmaceutical sales resumes, interviews, networking and career changes.' },
  ...pages,
  ...posts.filter(p => p.body).map(p => ({ ...p, slug: 'blog/' + p.slug, description: p.excerpt, article: true })),
];

for (const page of routes) {
  const file = path.join(dist, page.slug, 'index.html');
  const url = origin + '/' + (page.slug ? page.slug + '/' : '');
  const title = page.title.includes('The Pharma Coach') ? page.title : page.title + ' | The Pharma Coach';
  let html = readFileSync(file, 'utf8');
  html = html.replace(/<title>[^<]*<\/title>/g, '')
    .replace(/<meta (?:name="(?:description|twitter:[^"]+)"|property="og:[^"]+")[^>]*>/g, '')
    .replace(/<link rel="(?:canonical|alternate)"[^>]*>/g, '');
  const graph = [organization];
  if (page.article) graph.push({
    '@type': 'BlogPosting', '@id': url + '#article', headline: page.title, description: page.description,
    url, mainEntityOfPage: url, datePublished: page.published, image,
    author: { '@type': 'Person', '@id': origin + '/about/#jebb', name: page.author || 'Jebb Ruff', url: origin + '/about/' },
    publisher: { '@id': organization['@id'] },
  });
  if (page.slug === 'about') graph.push({
    '@type': 'Person', '@id': origin + '/about/#jebb', name: 'Jebb C. Ruff, MBA',
    url, jobTitle: 'Medical sales hiring manager, sales trainer and career coach',
    worksFor: { '@id': organization['@id'] },
  });
  if (page.faqs) graph.push({ '@type': 'FAQPage', mainEntity: page.faqs.map(([question, answer]) => ({ '@type': 'Question', name: question, acceptedAnswer: { '@type': 'Answer', text: answer } })) });
  const markdown = page.slug ? '/markdown/' + page.slug + '.md' : '/index.md';
  html = html.replace('</head>', `
    <title>${escape(title)}</title>
    <meta name="description" content="${escape(page.description)}" />
    <link rel="canonical" href="${url}" />
    <link rel="alternate" type="text/markdown" href="${markdown}" />
    <meta property="og:type" content="${page.article ? 'article' : 'website'}" />
    <meta property="og:title" content="${escape(title)}" />
    <meta property="og:description" content="${escape(page.description)}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:image" content="${image}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escape(title)}" />
    <meta name="twitter:description" content="${escape(page.description)}" />
    <meta name="twitter:image" content="${image}" />
    <script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/</g, '\\u003c')}</script>
    <link rel="stylesheet" href="/analytics.css" />
    <script src="/analytics.js" defer></script>
  </head>`);
  if (pages.includes(page)) {
    const social = profiles.map(p => `<a href="${p.url}">${p.name}</a>`).join('');
    html = html.replace('</nav></footer>', social + '</nav></footer>');
  }
  writeFileSync(file, html);
}

// Derived from published routes, never from a hand-maintained Wix-era list.
writeFileSync(path.join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes.map(p => `  <url><loc>${origin}/${p.slug ? p.slug + '/' : ''}</loc></url>`).join('\n')}\n</urlset>\n`);

const aliases = pages.flatMap(p => (p.aliases || []).map(alias => [alias, '/' + p.slug + '/']));
const redirects = [
  ...aliases,
  ['free-medical-sales-training', 'https://medrepcollege.com/access'],
  ['apply-for-pharmaceutical-sales-career-coaching', 'https://medrepcollege.com/apply-for-med-rep-college-now'],
  ['application', 'https://medrepcollege.com/apply-for-med-rep-college-now'],
  ['pharmaceutical-sales-strategy-call', 'https://medrepcollege.com/secure-your-spot'],
  ['pharmaceutical-sales-success-stories', '/#testimonials'],
  ['contact', '/about/#about-team'],
];
// Prepend exact migration routes before existing wildcard routes.
const existing = readFileSync(path.join(dist, '_redirects'), 'utf8');
writeFileSync(path.join(dist, '_redirects'), redirects.flatMap(([from, to]) => [`/${from} ${to} 301`, `/${from}/ ${to} 301`]).join('\n') + '\n' + existing);

writeFileSync(path.join(dist, '404.html'), `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Page not found | The Pharma Coach</title><style>body{margin:0;padding:10vh 8vw;background:#0B0F14;color:white;font:20px/1.6 sans-serif}a{color:#D4AF37}h1{max-width:24ch}</style></head><body><p>THE PHARMA COACH</p><h1>That page isn't here.</h1><p>The link may have changed. Find <a href="/blog/">career advice</a>, explore <a href="/#programs">coaching programs</a>, or <a href="/about/">contact Jebb</a>.</p></body></html>`);

// The secondary GitHub Pages build is a preview, not another search destination.
if (process.env.GITHUB_PAGES) {
  for (const page of routes) {
    const file = path.join(dist, page.slug, 'index.html');
    writeFileSync(file, readFileSync(file, 'utf8').replace('</head>', '<meta name="robots" content="noindex, nofollow"></head>'));
  }
}
appendFileSync(path.join(dist, '_headers'), '\n/analytics.js\n  Cache-Control: public, max-age=0, must-revalidate\n/analytics.css\n  Cache-Control: public, max-age=0, must-revalidate\n');
console.log(`Finalized analytics, social metadata and sitemap for ${routes.length} canonical pages.`);
