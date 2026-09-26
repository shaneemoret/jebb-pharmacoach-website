const YOUTUBE_ID = /^[A-Za-z0-9_-]{11}$/;

export function normalizeYouTubeVideoId(value = "") {
  const text = String(value).trim();
  if (YOUTUBE_ID.test(text)) return text;

  try {
    const url = new URL(text);
    const host = url.hostname.replace(/^www\./, "");
    let candidate = "";
    if (host === "youtu.be") candidate = url.pathname.split("/").filter(Boolean)[0] || "";
    else if (host === "youtube.com" || host === "m.youtube.com") {
      if (url.pathname === "/watch") candidate = url.searchParams.get("v") || "";
      else if (/^\/(?:shorts|embed)\//.test(url.pathname)) candidate = url.pathname.split("/")[2] || "";
    }
    return YOUTUBE_ID.test(candidate) ? candidate : null;
  } catch {
    return null;
  }
}

export function canonicalYouTubeUrl(value) {
  const id = normalizeYouTubeVideoId(value);
  return id ? `https://www.youtube.com/watch?v=${id}` : null;
}

export function youtubeEmbedUrl(value) {
  const id = normalizeYouTubeVideoId(value);
  return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
}

export function findDuplicatePostByVideo(posts, candidate) {
  const id = normalizeYouTubeVideoId(candidate?.id || candidate?.url || candidate);
  if (!id) return null;
  return posts.find(post => {
    const values = [post.video?.id, post.video?.url, post.source?.url];
    return values.some(value => normalizeYouTubeVideoId(value) === id);
  }) || null;
}
