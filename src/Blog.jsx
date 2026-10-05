import { useEffect, useState } from "react";
import { Header, SiteFooter, BOOKING_URL } from "./App.jsx";
import { prepareArticleBlocks } from "./blogBlocks.js";
import "./article.css";

const BASE = import.meta.env.BASE_URL;
export const blogHref = slug => `${BASE}blog${slug ? `/${slug}` : ""}`;
const readEmbeddedData = id => {
  const node = document.getElementById(id);
  return node ? JSON.parse(node.textContent) : null;
};

const longDate = value => {
  if (!value) return "";
  const date = new Date(`${value}T12:00:00Z`);
  return date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });
};
const readingTime = post => {
  if (!post.body) return null;
  const words = prepareArticleBlocks(post.body).reduce((total, block) =>
    total + (block.text ? block.text.split(/\s+/).length : 0)
    + (block.items ? block.items.join(" ").split(/\s+/).length : 0), 0);
  return `${Math.max(1, Math.ceil(words / 200))} min read`;
};
const headingSlug = text => text.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "section";

const authorProfile = post => {
  const name = (post.author || "The Pharma Coach").trim();
  if (name === "Jebb C. Ruff, MBA") return {
    name,
    kind: "jebb",
    href: `${BASE}about`,
    label: "Jebb Ruff",
    bio: "Jebb is a former pharmaceutical and medical device sales hiring manager, sales trainer, and career coach. Through The Pharma Coach, he helps people turn their experience into a practical plan for entering medical sales.",
  };
  if (name.toLowerCase() === "the pharma coach") return {
    name: "The Pharma Coach",
    kind: "organization",
    label: "The Pharma Coach editorial team",
    bio: "This article was originally published by The Pharma Coach. The archive record identifies the organization as the author rather than an individual contributor.",
  };
  return {
    name,
    kind: "contributor",
    label: name,
    bio: `This article was originally published in The Pharma Coach archive under the byline ${name}. The archived source record does not include a verified contributor biography.`,
  };
};

function InlineText({ runs, text }) {
  if (!runs) return text;
  return runs.map((run, index) => {
    let content = run.text;
    if (run.bold) content = <strong>{content}</strong>;
    if (run.italic) content = <em>{content}</em>;
    return run.url ? <a key={index} href={run.url}>{content}</a> : <span key={index}>{content}</span>;
  });
}

function TikTok({ video }) {
  useEffect(() => {
    if (document.querySelector('script[src="https://www.tiktok.com/embed.js"]')) return;
    const script = document.createElement("script");
    script.src = "https://www.tiktok.com/embed.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);
  return (
    <blockquote className="tiktok-embed post__video" cite={video.url} data-video-id={video.id} style={{ maxWidth: 605, minWidth: 325 }}>
      <section><a href={video.url} target="_blank" rel="noreferrer">Watch the original video on TikTok ({video.handle})</a></section>
    </blockquote>
  );
}

export function BlogVisual({ post, size = "card" }) {
  const topic = post.tags?.[0] || "Career advice";
  return (
    <div className={`blog-visual blog-visual--${size}`} aria-hidden="true">
      <div className="blog-visual__copy">
        <span className="blog-visual__topic">{topic}</span>
        <strong>{post.title}</strong>
      </div>
    </div>
  );
}

function Card({ post }) {
  return (
    <article className="post-card">
      <a className="post-card__thumb" href={blogHref(post.slug)} tabIndex={-1} aria-hidden="true">
        <BlogVisual post={post} />
      </a>
      <p className="post-card__meta">
        <time dateTime={post.published}>{longDate(post.published)}</time>
        <span>{post.readingTime || readingTime(post)}</span>
      </p>
      <h2><a href={blogHref(post.slug)}>{post.title}</a></h2>
      <p className="post-card__excerpt">{post.excerpt}</p>
    </article>
  );
}

export function BlogIndex() {
  const posts = readEmbeddedData("blog-index-data") || [];
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const matches = posts.filter(post => `${post.title} ${post.excerpt}`.toLowerCase().includes(query.trim().toLowerCase()));
  const pageSize = 24;
  const pageCount = Math.max(1, Math.ceil(matches.length / pageSize));
  return (
    <>
    <Header />
    <main className="blog section-pad" id="top">
      <nav className="post__breadcrumb" aria-label="Breadcrumb"><a href={BASE}>Home</a><span aria-hidden="true">›</span><span>Blog</span></nav>
      <header className="blog__head">
        <p className="eyebrow">Career advice</p>
        <h1>Articles to help you land a pharma sales rep job.</h1>
        <p className="lead">Practical pieces from Jebb on resumes, interviews and the moves that get candidates in front of hiring managers.</p>
      </header>
      <div className="blog__search">
        <label htmlFor="article-search">Find an article</label>
        <input id="article-search" type="search" value={query} placeholder="Search by topic or title" onChange={event => { setQuery(event.target.value); setPage(0); }} />
        <p role="status">{matches.length} articles{query.trim() ? " found" : " in the library"}</p>
      </div>
      <div className="post-list">{matches.slice(page * pageSize, (page + 1) * pageSize).map(post => <Card post={post} key={post.slug} />)}</div>
      {matches.length === 0 && <p>No articles match that search. Try another topic.</p>}
      {pageCount > 1 && <nav className="blog__pagination" aria-label="Article pages">
        <button type="button" disabled={page === 0} onClick={() => setPage(page - 1)}>Previous</button>
        <span>Page {page + 1} of {pageCount}</span>
        <button type="button" disabled={page + 1 === pageCount} onClick={() => setPage(page + 1)}>Next</button>
      </nav>}
    </main>
    <SiteFooter />
    </>
  );
}

export function BlogPost({ slug }) {
  const data = readEmbeddedData("blog-post-data") || {};
  const post = data.post?.slug === slug ? data.post : null;
  useEffect(() => {
    if (post) document.title = `${post.title} | The Pharma Coach`;
  }, [post]);

  if (!post || !post.body) {
    return (
      <>
      <Header />
      <main className="blog section-pad" id="top">
        <header className="blog__head">
          <h1>That post is not here.</h1>
          <p className="lead">The link may be out of date.</p>
          <p><a className="post__back" href={blogHref()}>Back to all posts</a></p>
        </header>
      </main>
      <SiteFooter />
      </>
    );
  }

  const articleBody = prepareArticleBlocks(post.body);
  const author = authorProfile(post);
  const seenHeadings = new Map();
  const sections = articleBody.map((block, index) => {
    if (block.type !== "h2") return null;
    const base = headingSlug(block.text);
    const count = (seenHeadings.get(base) || 0) + 1;
    seenHeadings.set(base, count);
    return { id: count === 1 ? base : `${base}-${count}`, text: block.text, index };
  }).filter(Boolean);
  const sectionByIndex = new Map(sections.map(section => [section.index, section]));
  const related = data.related || [];
  const ftcSource = articleBody.find(block => block.type === "link" && block.url?.startsWith("https://consumer.ftc.gov/articles/job-scams"));
  const firstHeading = articleBody.findIndex(block => block.type === "h2");
  const introCount = post.video && firstHeading > 0 && articleBody.slice(0, firstHeading).every(block => block.type === "p") ? firstHeading : 0;

  return (
    <>
    <Header />
    <main className="post section-pad" id="top">
      <div className="post__shell">
        <nav className="post__breadcrumb" aria-label="Breadcrumb">
          <a href={BASE}>Home</a><span aria-hidden="true">›</span><a href={blogHref()}>Blog</a><span aria-hidden="true">›</span><span>{post.tags?.[0] || "Career advice"}</span>
        </nav>
        <header className="post__header">
          <p className="eyebrow">{post.tags?.[0] || "Career advice"}</p>
          <h1>{post.title}</h1>
          {post.excerpt && <p className="post__dek">{post.excerpt}</p>}
          <div className="post__authorline">
            {author.kind === "jebb" && <img src={`${BASE}assets/source/jebb-headshot-owner.webp`} alt="" width="52" height="52" />}
            <div>{author.href ? <a className="post__authorname" href={author.href}>{author.name}</a> : <span className="post__authorname">{author.name}</span>}<p><time dateTime={post.published}>{longDate(post.published)}</time>{post.modified && <><span aria-hidden="true"> · </span>Updated <time dateTime={post.modified}>{longDate(post.modified)}</time></>}<span aria-hidden="true"> · </span>{readingTime(post)}</p></div>
          </div>
        </header>
        <div className="post__feature">
          <BlogVisual post={post} size="feature" />
        </div>
        <div className="post__layout">
      <article className="post__content">
        {introCount > 0 && <div className="post__intro">{articleBody.slice(0, introCount).map((block, index) => <p key={index}><InlineText {...block} /></p>)}</div>}
        {post.video && <figure className="post__videofigure"><TikTok video={post.video} /><figcaption>Jebb explains the certificate warning in his original <a href={post.video.url} target="_blank" rel="noreferrer">TikTok video</a>.</figcaption></figure>}
        <div className="post__body">
          {articleBody.slice(introCount).map((block, offset) => {
            const index = offset + introCount;
            if (block.type === "h2") return <h2 id={sectionByIndex.get(index).id} key={index}><InlineText {...block} /></h2>;
            if (block.type === "h3") return <h3 key={index}><InlineText {...block} /></h3>;
            if (block.type === "image") return <figure className="post__archive-image" key={index}><img src={block.url} alt={block.text || ""} width={block.width} height={block.height} loading="lazy" /></figure>;
            if (block.type === "video") return <figure className="post__archive-video" key={index}><video controls preload="metadata" playsInline src={block.url} aria-label={block.text || post.title} /><figcaption><a href={block.url}>Open video</a></figcaption></figure>;
            if (block.type === "list") {
              const List = block.ordered ? "ol" : "ul";
              return <List key={index}>{block.items.map((item, i) => <li key={i}><InlineText text={item} runs={block.richItems?.[i]} /></li>)}</List>;
            }
            if (block.type === "quote") return <blockquote className="post__quote" key={index}><InlineText {...block} /></blockquote>;
            if (block.type === "link") return <p key={index}><a href={block.url} target={block.url.startsWith("http") ? "_blank" : undefined} rel={block.url.startsWith("http") ? "noreferrer" : undefined}>{block.text}</a></p>;
            return <p key={index}><InlineText {...block} /></p>;
          })}
        </div>
        <div className="post__cta">
          <h2>Want this applied to your own search?</h2>
          <p>Book a 45-minute discovery call with Jebb and talk through your next step.</p>
          <a className="button button--gold" href={BOOKING_URL}>Schedule a call</a>
        </div>
        <section className={`post__authorbio${author.kind === "jebb" ? "" : " post__authorbio--text"}`} aria-labelledby="post-author-heading">
          {author.kind === "jebb" && <img src={`${BASE}assets/source/jebb-headshot-owner.webp`} alt="Jebb Ruff" width="104" height="104" loading="lazy" />}
          <div>
            <h2 id="post-author-heading">About the author</h2>
            <p className="post__label">{author.label}</p>
            <p>{author.bio}</p>
            <div className="post__authorlinks">{author.kind === "jebb" && <><a href={`${BASE}about`}>Full profile</a><a href="https://www.tiktok.com/@entermedicalsales" target="_blank" rel="noreferrer">TikTok</a></>}<a href={blogHref()}>All articles</a></div>
          </div>
        </section>
        {post.editorialNote && <p className="post__editorial-note">{post.editorialNote}</p>}
        {(post.source || ftcSource || post.sources?.length > 0) && <section className="post__sources" aria-label="Sources">
          <h2>Sources</h2>
          <ul>
            {post.sources?.map(source => <li key={source.url}><a href={source.url} target="_blank" rel="noreferrer">{source.label}</a></li>)}
            {ftcSource && <li>Federal Trade Commission, <a href={ftcSource.url} target="_blank" rel="noreferrer">Job Scams</a></li>}
            {post.source && <li>{post.source.label}, <a href={post.source.url} target="_blank" rel="noreferrer">original video</a></li>}
          </ul>
        </section>}
      </article>
      <aside className="post__aside" aria-label="Article tools">
        {sections.length > 0 && <nav className="post__toc" aria-label="On this page">
          <h2>On this page</h2>
          <ol>{sections.map(section => <li key={section.id}><a href={`#${section.id}`}>{section.text}</a></li>)}</ol>
        </nav>}
      </aside>
        </div>
        {related.length > 0 && <section className="post__related" aria-labelledby="related-heading">
          <div className="post__relatedhead"><h2 id="related-heading">More from Jebb</h2><a href={blogHref()}>All articles →</a></div>
          <div className="post__relatedgrid">{related.map(item => <a className="post__relateditem" href={blogHref(item.slug)} key={item.slug}>
            <span>Article · {item.readingTime || readingTime(item)}</span><strong>{item.title}</strong><p>{item.excerpt}</p>
          </a>)}</div>
        </section>}
      </div>
    </main>
    <SiteFooter />
    </>
  );
}
