import { useEffect } from "react";
import posts from "./posts.json";
import { Header, SiteFooter, BOOKING_URL } from "./App.jsx";

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
  const words = post.body.reduce((total, block) =>
    total + (block.text ? block.text.split(/\s+/).length : 0)
    + (block.items ? block.items.join(" ").split(/\s+/).length : 0), 0);
  return `${Math.max(1, Math.ceil(words / 200))} min read`;
};

function TikTok({ video }) {
  useEffect(() => {
    if (document.querySelector('script[src="https://www.tiktok.com/embed.js"]')) return;
    const script = document.createElement("script");
    script.src = "https://www.tiktok.com/embed.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);
  return (
    <blockquote className="tiktok-embed post__video" cite={video.url} data-video-id={video.id}>
      <section><a href={video.url} target="_blank" rel="noreferrer">Watch this on TikTok ({video.handle})</a></section>
    </blockquote>
  );
}

function Card({ post }) {
  return (
    <article className="post-card">
      <a className={`post-card__thumb${post.image ? "" : " post-card__thumb--blank"}`} href={blogHref(post.slug)} tabIndex={-1} aria-hidden="true">
        {post.image
          ? <img src={post.image} alt="" loading="lazy" decoding="async" />
          : <span>The Pharma Coach</span>}
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

  return (
    <>
    <Header />
    <main className="post section-pad" id="top">
      <article>
        <a className="post__back" href={blogHref()}>All posts</a>
        <p className="post-card__meta">
          <time dateTime={post.published}>{longDate(post.published)}</time>
          <span>{readingTime(post)}</span>
        </p>
        <h1>{post.title}</h1>
        <p className="post__byline">{post.author}</p>
        {post.video && <TikTok video={post.video} />}
        <div className="post__body">
          {post.body.map((block, index) => {
            if (block.type === "h2") return <h2 key={index}>{block.text}</h2>;
            if (block.type === "h3") return <h3 key={index}>{block.text}</h3>;
            if (block.type === "list") return <ul key={index}>{block.items.map((item, i) => <li key={i}>{item}</li>)}</ul>;
            return <p key={index}>{block.text}</p>;
          })}
        </div>
        {post.source && (
          <p className="post__source">
            {post.source.label}: <a href={post.source.url} target="_blank" rel="noreferrer">watch the original</a>.
          </p>
        )}
        <div className="post__cta">
          <h2>Want this applied to your own search?</h2>
          <p>Book a 45-minute discovery call with Jebb and talk through your next step.</p>
          <a className="button button--gold" href={BOOKING_URL}>Schedule a call</a>
        </div>
      </article>
    </main>
    <SiteFooter />
    </>
  );
}
