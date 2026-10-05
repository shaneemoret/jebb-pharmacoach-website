import { readFileSync, writeFileSync, appendFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const dist = path.join(root, 'dist/client');
const readJson = file => JSON.parse(readFileSync(path.join(root, file), 'utf8'));
const posts = readJson('src/posts.json').filter(post => post.body);
const pages = readJson('src/migrated-pages.json');
const about = readJson('src/about.json');
const profiles = readJson('src/social-profiles.json');
const origin = 'https://thepharmacoach.com';
const shareImage = origin + '/assets/source/social-share-default.jpg';
const escape = value => String(value ?? '').replace(/[&"<>]/g, c => ({ '&': '&amp;', '"': '&quot;', '<': '&lt;', '>': '&gt;' })[c]);
const cleanHeadline = value => String(value ?? '').replace(/\s*—\s*/g, ': ').replace(/\s+/g, ' ').trim();
const jsonForHtml = value => JSON.stringify(value).replace(/</g, '\\u003c');
const readingTime = post => `${Math.max(1, Math.ceil((post.body || []).reduce((sum, block) => sum + [block.text, ...(block.items || [])].filter(Boolean).join(' ').trim().split(/\s+/).filter(Boolean).length, 0) / 200))} min read`;
const summaries = posts.map(({ slug, title, excerpt, published, tags, body }) => ({ slug, title, excerpt, published, tags, readingTime: readingTime({ body }) }));
const homeFaqs = [
  ['Can I move into pharma without pharma experience?', 'Yes, some roles accept experience from other fields. Sales, healthcare, and teaching can offer transferable skills. Requirements vary by employer and role.'],
  ['Why am I applying but not getting interviews?', 'Your résumé, target roles, or networking approach may not show how your experience fits. Jebb helps you identify the gaps rather than simply send more applications.'],
  ['What makes this different from generic career advice?', 'Jebb brings medical-sales hiring and training experience to your résumé, networking, and interview preparation. The focus is on this industry and your next role.'],
  ['Should I start before I’m ready to leave my job?', 'You can research roles and prepare your applications while employed. Start when you have time to do the work; you do not need to rush a career decision.'],
  ['Will coaching guarantee a job or a higher salary?', 'No. Hiring and compensation depend on employers, your experience, and your execution. Review program terms before paying; do not assume placement or earnings are guaranteed.'],
  ['What does the first call cost?', 'The discovery call is $25 for 45 minutes with Jebb. Discuss your fit and next steps before choosing a coaching program. Confirm current booking and cancellation terms before paying.'],
];
const organization = { '@type': 'Organization', '@id': origin + '/#organization', name: 'The Pharma Coach, LLC', url: origin + '/', sameAs: profiles.map(profile => profile.url), founder: { '@type': 'Person', '@id': origin + '/about/#jebb', name: 'Jebb C. Ruff, MBA' } };
const articleAuthor = page => {
  const name = (page.author || 'The Pharma Coach').trim();
  if (name === 'Jebb C. Ruff, MBA') return { '@type': 'Person', '@id': origin + '/about/#jebb', name, url: origin + '/about/' };
  if (name.toLowerCase() === 'the pharma coach') return { '@id': organization['@id'] };
  return { '@type': 'Person', '@id': page.canonical + '#archive-author', name };
};
const articleFaqs = post => {
  const result = [];
  let inFaq = false;
  for (let index = 0; index < post.body.length; index += 1) {
    const block = post.body[index];
    if (block.type === 'h2') inFaq = /frequently asked questions|common questions|faq/i.test(block.text || '');
    if (inFaq && block.type === 'h3' && /\?$/.test(block.text || '')) {
      const answer = post.body.slice(index + 1).find(item => item.type === 'p');
      if (answer?.text) result.push([block.text, answer.text]);
    }
  }
  return result;
};
const routes = [
  { slug: '', title: 'Start Your Career in Pharmaceutical Sales', description: 'Start or advance your career in pharmaceutical sales with practical coaching for nurses, healthcare professionals, and sales reps.', faqs: homeFaqs },
  { slug: 'about', title: 'About The Pharma Coach | Jebb C. Ruff, MBA', description: 'Meet Jebb Ruff, medical sales hiring manager, sales trainer and founder of The Pharma Coach. Explore his background and coaching approach.' },
  { slug: 'blog', title: 'Pharmaceutical Sales Career Advice', description: 'Practical advice from Jebb Ruff on pharmaceutical sales resumes, interviews, networking and career changes.' },
  ...pages,
  ...posts.map(post => ({ ...post, articleSlug: post.slug, slug: 'blog/' + post.slug, description: post.excerpt, article: true, faqs: articleFaqs(post) })),
];
const titleCounts = new Map();
const descriptionCounts = new Map();
for (const route of routes) {
  const title = cleanHeadline(route.title.includes('The Pharma Coach') ? route.title : `${route.title} | The Pharma Coach`);
  titleCounts.set(title, (titleCounts.get(title) || 0) + 1);
  const description = cleanHeadline(route.description);
  descriptionCounts.set(description, (descriptionCounts.get(description) || 0) + 1);
}
const titleSeen = new Map();
const descriptionSeen = new Map();
for (const route of routes) {
  const title = cleanHeadline(route.title.includes('The Pharma Coach') ? route.title : `${route.title} | The Pharma Coach`);
  const titleIndex = (titleSeen.get(title) || 0) + 1;
  titleSeen.set(title, titleIndex);
  route.seoTitle = titleCounts.get(title) === 1 ? title : cleanHeadline(`${route.title} (${route.published || titleIndex}) | The Pharma Coach`);
  const description = cleanHeadline(route.description);
  const descriptionIndex = (descriptionSeen.get(description) || 0) + 1;
  descriptionSeen.set(description, descriptionIndex);
  route.seoDescription = descriptionCounts.get(description) === 1 ? description : `${description.replace(/[.!]?$/, '.')} Originally published ${route.published || `archive item ${descriptionIndex}`}.`;
}

const renderBlock = block => {
  const text = escape(block.text);
  if (block.type === 'h2') return `<h2>${text}</h2>`;
  if (block.type === 'h3') return `<h3>${text}</h3>`;
  if (block.type === 'list') return `<${block.ordered ? 'ol' : 'ul'}>${block.items.map(item => `<li>${escape(item)}</li>`).join('')}</${block.ordered ? 'ol' : 'ul'}>`;
  if (block.type === 'quote') return `<blockquote>${text}</blockquote>`;
  if (block.type === 'image') return `<figure><img src="${escape(block.url)}" alt="${text}" width="${block.width}" height="${block.height}" loading="lazy"></figure>`;
  if (block.type === 'video') return `<figure><video controls preload="metadata" src="${escape(block.url)}" aria-label="${text}"></video></figure>`;
  if (block.type === 'link') return `<p><a href="${escape(block.url)}">${text}</a></p>`;
  return `<p>${text}</p>`;
};
const staticHeader = '<header class="site-header"><a class="wordmark" href="/">THE PHARMA COACH</a><nav class="nav" aria-label="Primary navigation"><a href="/#programs">Programs</a><a href="/#method">The Method</a><a href="/#testimonials">Testimonials</a><a href="/blog/">Blog</a><a href="/about/">About</a></nav></header>';
const staticFooter = '<footer><nav aria-label="Footer"><a href="/">Home</a> <a href="/blog/">Blog</a> <a href="/about/">About</a></nav></footer>';
const renderFallback = page => {
  if (page.article) return `${staticHeader}<main class="post section-pad"><nav class="post__breadcrumb" aria-label="Breadcrumb"><a href="/">Home</a><span>›</span><a href="/blog/">Blog</a><span>›</span><span>${escape(page.tags?.[0] || 'Career advice')}</span></nav><article><header><h1>${escape(page.title)}</h1><p>${escape(page.excerpt)}</p><p>By ${escape(page.author)} · <time datetime="${escape(page.published)}">${escape(page.published)}</time> · ${readingTime(page)}</p></header>${page.body.map(renderBlock).join('')}<section><h2>About the author</h2><p>${escape(page.author === 'Jebb C. Ruff, MBA' ? 'Jebb is a former pharmaceutical and medical device sales hiring manager, sales trainer, and career coach.' : `This archive article is attributed to ${page.author || 'The Pharma Coach'}.`)}</p></section></article></main>${staticFooter}`;
  if (page.slug === 'blog') return `${staticHeader}<main class="blog section-pad"><nav class="post__breadcrumb" aria-label="Breadcrumb"><a href="/">Home</a><span>›</span><span>Blog</span></nav><header><h1>Articles to help you land a pharma sales rep job.</h1><p>Practical pieces from Jebb on resumes, interviews and the moves that get candidates in front of hiring managers.</p></header><div class="post-list">${summaries.map(post => `<article class="post-card"><h2><a href="/blog/${escape(post.slug)}/">${escape(post.title)}</a></h2><p>${escape(post.excerpt)}</p></article>`).join('')}</div></main>${staticFooter}`;
  if (page.slug === 'about') return `${staticHeader}<main class="about section-pad"><nav class="post__breadcrumb" aria-label="Breadcrumb"><a href="/">Home</a><span>›</span><span>About</span></nav><h1>${escape(about.headline)}</h1><p>${escape(about.valueProp)}</p><img src="/assets/source/jebb-headshot-owner.webp" alt="Jebb Ruff, The Pharma Coach" width="1139" height="1381"><h2>What The Pharma Coach does</h2>${about.services.map(service => `<article><h3>${escape(service.name)}</h3><p>${escape(service.body)}</p></article>`).join('')}<h2>The team behind The Pharma Coach</h2><p>Jebb C. Ruff, MBA, founder and medical sales hiring manager.</p></main>${staticFooter}`;
  if (page.slug === '') return `${staticHeader}<main><section class="hero"><img src="/assets/source/jebb-banner-owner.webp" alt="Jebb Ruff, The Pharma Coach" width="2056" height="765"><h1>Start your career in pharmaceutical sales.</h1><p>Jebb helps nurses, healthcare professionals, and sales reps land pharmaceutical sales rep roles and advance in the field.</p></section><section id="programs"><h2>Choose your coaching support.</h2>${pages.slice(0, 3).map(item => `<article><h3><a href="/${item.slug}/">${escape(item.title)}</a></h3><p>${escape(item.description)}</p></article>`).join('')}</section><section id="method"><h2>How the $100K Med Rep Method works.</h2></section><section id="testimonials"><h2>Client results</h2></section><section><h2>Frequently asked questions</h2>${homeFaqs.map(([q, a]) => `<article><h3>${escape(q)}</h3><p>${escape(a)}</p></article>`).join('')}</section></main>${staticFooter}`;
  return null;
};

for (const page of routes) {
  const file = path.join(dist, decodeURIComponent(page.slug), 'index.html');
  const url = origin + '/' + (page.slug ? page.slug + '/' : '');
  let html = readFileSync(file, 'utf8');
  html = html.replace(/<title>[^<]*<\/title>/g, '').replace(/<meta (?:name="(?:description|twitter:[^"]+)"|property="og:[^"]+")[^>]*>/g, '').replace(/<link rel="(?:canonical|alternate)"[^>]*>/g, '');
  const graph = [organization];
  if (page.slug === '') graph.push({ '@type': 'WebSite', '@id': origin + '/#website', name: 'The Pharma Coach', url: origin + '/', publisher: { '@id': organization['@id'] } });
  if (page.article) graph.push({ '@type': 'BlogPosting', '@id': url + '#article', headline: page.title, description: page.seoDescription, url, mainEntityOfPage: url, datePublished: page.published, ...(page.modified ? { dateModified: page.modified } : {}), image: { '@type': 'ImageObject', url: shareImage, width: 1200, height: 630 }, author: articleAuthor(page), publisher: { '@id': organization['@id'] } });
  if (page.slug === 'about') graph.push({ '@type': 'Person', '@id': origin + '/about/#jebb', name: 'Jebb C. Ruff, MBA', url, jobTitle: 'Medical sales hiring manager, sales trainer and career coach', worksFor: { '@id': organization['@id'] } });
  if (page.slug) {
    const items = [{ '@type': 'ListItem', position: 1, name: 'Home', item: origin + '/' }];
    if (page.article) items.push({ '@type': 'ListItem', position: 2, name: 'Blog', item: origin + '/blog/' });
    items.push({ '@type': 'ListItem', position: items.length + 1, name: page.title, item: url });
    graph.push({ '@type': 'BreadcrumbList', '@id': url + '#breadcrumb', itemListElement: items });
  }
  if (page.faqs?.length) graph.push({ '@type': 'FAQPage', mainEntity: page.faqs.map(([question, answer]) => ({ '@type': 'Question', name: question, acceptedAnswer: { '@type': 'Answer', text: answer } })) });
  const markdown = page.slug ? '/markdown/' + page.slug + '.md' : '/index.md';
  html = html.replace('</head>', `<title>${escape(page.seoTitle)}</title><meta name="description" content="${escape(page.seoDescription)}"><link rel="canonical" href="${url}"><link rel="alternate" type="text/markdown" href="${markdown}"><meta property="og:type" content="${page.article ? 'article' : 'website'}"><meta property="og:title" content="${escape(page.seoTitle)}"><meta property="og:description" content="${escape(page.seoDescription)}"><meta property="og:url" content="${url}"><meta property="og:image" content="${shareImage}"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="The Pharma Coach"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${escape(page.seoTitle)}"><meta name="twitter:description" content="${escape(page.seoDescription)}"><meta name="twitter:image" content="${shareImage}"><script type="application/ld+json">${jsonForHtml({ '@context': 'https://schema.org', '@graph': graph })}</script><link rel="stylesheet" href="/analytics.css"><script src="/analytics.js" defer></script></head>`);
  const fallback = renderFallback(page);
  if (fallback) {
    const data = page.slug === 'blog' ? `<script type="application/json" id="blog-index-data">${jsonForHtml(summaries)}</script>` : page.article ? `<script type="application/json" id="blog-post-data">${jsonForHtml({ post: { ...page, slug: page.articleSlug }, related: summaries.filter(item => item.slug !== page.articleSlug).sort((a, b) => Number(b.tags?.some(tag => page.tags?.includes(tag))) - Number(a.tags?.some(tag => page.tags?.includes(tag)))).slice(0, 3) })}</script>` : '';
    html = html.replace('<div id="root"></div>', `<div id="root">${fallback}</div>${data}`);
  }
  if (pages.includes(page)) html = html.replace('</nav></footer>', profiles.map(profile => `<a href="${profile.url}">${profile.name}</a>`).join('') + '</nav></footer>');
  writeFileSync(file, html);
}

writeFileSync(path.join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes.map(page => `  <url><loc>${origin}/${page.slug ? page.slug + '/' : ''}</loc>${page.article ? `<lastmod>${page.modified || page.published}</lastmod>` : ''}</url>`).join('\n')}\n</urlset>\n`);
const aliases = pages.flatMap(page => (page.aliases || []).map(alias => [alias, '/' + page.slug + '/']));
const redirects = [...aliases, ['free-medical-sales-training', 'https://medrepcollege.com/access'], ['apply-for-pharmaceutical-sales-career-coaching', 'https://medrepcollege.com/apply-for-med-rep-college-now'], ['application', 'https://medrepcollege.com/apply-for-med-rep-college-now'], ['pharmaceutical-sales-strategy-call', 'https://medrepcollege.com/secure-your-spot'], ['pharmaceutical-sales-success-stories', '/#testimonials'], ['contact', '/about/#about-team']];
const existing = readFileSync(path.join(dist, '_redirects'), 'utf8');
writeFileSync(path.join(dist, '_redirects'), redirects.flatMap(([from, to]) => [`/${from} ${to} 301`, `/${from}/ ${to} 301`]).join('\n') + '\n' + existing);
writeFileSync(path.join(dist, '404.html'), '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Page not found | The Pharma Coach</title><style>body{margin:0;padding:10vh 8vw;background:#0B0F14;color:white;font:20px/1.6 sans-serif}a{color:#D4AF37}h1{max-width:24ch}</style></head><body><p>THE PHARMA COACH</p><h1>That page is not here.</h1><p>The link may have changed. Find <a href="/blog/">career advice</a>, explore <a href="/#programs">coaching programs</a>, or <a href="/about/">contact Jebb</a>.</p></body></html>');
if (process.env.GITHUB_PAGES) for (const page of routes) {
  const file = path.join(dist, decodeURIComponent(page.slug), 'index.html');
  writeFileSync(file, readFileSync(file, 'utf8').replace('</head>', '<meta name="robots" content="noindex, nofollow"></head>'));
}
appendFileSync(path.join(dist, '_headers'), '\n/analytics.js\n  Cache-Control: public, max-age=0, must-revalidate\n/analytics.css\n  Cache-Control: public, max-age=0, must-revalidate\n');
console.log(`Finalized crawlable HTML, structured data, social metadata and sitemap for ${routes.length} canonical pages.`);
