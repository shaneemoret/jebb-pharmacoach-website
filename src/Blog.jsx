import { useEffect } from "react";
import posts from "./posts.json";
import { Header, SiteFooter, BOOKING_URL } from "./App.jsx";
import { prepareArticleBlocks } from "./blogBlocks.js";
import "./article.css";

const BASE = import.meta.env.BASE_URL;
export const blogHref = slug => `${BASE}blog${slug ? `/${slug}` : ""}`;
export const findPost = slug => posts.find(post => post.slug === slug);

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
        <span>{readingTime(post)}</span>
      </p>
      <h2><a href={blogHref(post.slug)}>{post.title}</a></h2>
      <p className="post-card__excerpt">{post.excerpt}</p>
    </article>
  );
}

export function BlogIndex() {
  return (
    <>
    <Header />
    <main className="blog section-pad" id="top">
      <header className="blog__head">
        <p className="eyebrow">Career advice</p>
        <h1>Articles to help you land a pharma sales rep job.</h1>
        <p className="lead">Practical pieces from Jebb on resumes, interviews and the moves that get candidates in front of hiring managers.</p>
      </header>
      <div className="post-list">{posts.map(post => <Card post={post} key={post.slug} />)}</div>
    </main>
    <SiteFooter />
    </>
  );
}

export function BlogPost({ slug }) {
  const post = findPost(slug);
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
  const seenHeadings = new Map();
  const sections = articleBody.map((block, index) => {
    if (block.type !== "h2") return null;
    const base = headingSlug(block.text);
    const count = (seenHeadings.get(base) || 0) + 1;
    seenHeadings.set(base, count);
    return { id: count === 1 ? base : `${base}-${count}`, text: block.text, index };
  }).filter(Boolean);
  const sectionByIndex = new Map(sections.map(section => [section.index, section]));
  const related = posts.filter(candidate => candidate.slug !== post.slug && candidate.body)
    .sort((a, b) => Number(b.tags?.some(tag => post.tags?.includes(tag))) - Number(a.tags?.some(tag => post.tags?.includes(tag))))
    .slice(0, 3);
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
            <img src={`${BASE}assets/source/jebb-headshot-owner-208.webp`} alt="" width="52" height="52" />
            <div><a className="post__authorname" href={`${BASE}about`}>{post.author}</a><p><time dateTime={post.published}>{longDate(post.published)}</time><span aria-hidden="true"> · </span>{readingTime(post)}</p></div>
          </div>
        </header>
        <div className="post__feature">
          <BlogVisual post={post} size="feature" />
        </div>
        <div className="post__layout">
      <article className="post__content">
        {introCount > 0 && <div className="post__intro">{articleBody.slice(0, introCount).map((block, index) => <p key={index}>{block.text}</p>)}</div>}
        {post.video && <figure className="post__videofigure"><TikTok video={post.video} /><figcaption>Jebb explains the certificate warning in his original <a href={post.video.url} target="_blank" rel="noreferrer">TikTok video</a>.</figcaption></figure>}
        <div className="post__body">
          {articleBody.slice(introCount).map((block, offset) => {
            const index = offset + introCount;
            if (block.type === "h2") return <h2 id={sectionByIndex.get(index).id} key={index}>{block.text}</h2>;
            if (block.type === "h3") return <h3 key={index}>{block.text}</h3>;
            if (block.type === "list") {
              const List = block.ordered ? "ol" : "ul";
              return <List key={index}>{block.items.map((item, i) => <li key={i}>{item}</li>)}</List>;
            }
            if (block.type === "quote") return <blockquote className="post__quote" key={index}>{block.text}</blockquote>;
            if (block.type === "link") return <p key={index}><a href={block.url} target={block.url.startsWith("http") ? "_blank" : undefined} rel={block.url.startsWith("http") ? "noreferrer" : undefined}>{block.text}</a></p>;
            return <p key={index}>{block.text}</p>;
          })}
        </div>
        <div className="post__cta">
          <h2>Want this applied to your own search?</h2>
          <p>Book a 45-minute discovery call with Jebb and talk through your next step.</p>
          <a className="button button--gold" href={BOOKING_URL}>Schedule a call</a>
        </div>
        <section className="post__authorbio" aria-labelledby="post-author-heading">
          <img src={`${BASE}assets/source/jebb-headshot-owner-208.webp`} alt="Jebb Ruff" width="104" height="104" loading="lazy" />
          <div>
            <p className="post__label">About the author</p>
            <h2 id="post-author-heading">Jebb Ruff</h2>
            <p>Jebb is a former pharmaceutical and medical device sales hiring manager, sales trainer, and career coach. Through The Pharma Coach, he helps people turn their experience into a practical plan for entering medical sales.</p>
            <div className="post__authorlinks"><a href={`${BASE}about`}>Full profile</a><a href="https://www.tiktok.com/@entermedicalsales" target="_blank" rel="noreferrer">TikTok</a><a href={blogHref()}>All articles</a></div>
          </div>
        </section>
        {(post.source || ftcSource) && <section className="post__sources" aria-label="Sources">
          <h2>Sources</h2>
          <ul>
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
            <span>Article · {readingTime(item)}</span><strong>{item.title}</strong><p>{item.excerpt}</p>
          </a>)}</div>
        </section>}
      </div>
    </main>
    <SiteFooter />
    </>
  );
}
