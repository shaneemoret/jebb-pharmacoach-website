const MARKDOWN_ROUTES = new Map([
  ["/", "/markdown/home.md"],
  ["/index.html", "/markdown/home.md"],
  ["/about", "/markdown/about.md"],
  ["/blog", "/markdown/blog.md"],
]);

function wantsMarkdown(accept) {
  return (accept || "").split(",").some((entry) => {
    const [type, ...parameters] = entry.trim().split(";");
    if (type.trim().toLowerCase() !== "text/markdown") return false;
    const quality = parameters.find((parameter) => parameter.trim().toLowerCase().startsWith("q="));
    return !quality || Number(quality.trim().slice(2)) > 0;
  });
}

function markdownPath(pathname) {
  const path = pathname.replace(/\/+$/, "") || "/";
  if (MARKDOWN_ROUTES.has(path)) return MARKDOWN_ROUTES.get(path);
  if (/^\/blog\/[a-z0-9-]+$/.test(path)) return `/markdown${path}.md`;
  return null;
}

function varyOnAccept(response) {
  const headers = new Headers(response.headers);
  const vary = headers.get("Vary");
  if (!vary || !vary.split(",").some((value) => value.trim().toLowerCase() === "accept")) {
    headers.set("Vary", vary ? `${vary}, Accept` : "Accept");
  }
  return headers;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const source = markdownPath(url.pathname);
    const negotiable = source && (request.method === "GET" || request.method === "HEAD");

    if (negotiable && wantsMarkdown(request.headers.get("Accept"))) {
      const asset = await env.ASSETS.fetch(new Request(new URL(source, url), { method: "GET" }));
      if (asset.ok) {
        const markdown = await asset.text();
        const headers = varyOnAccept(asset);
        headers.set("Content-Type", "text/markdown; charset=utf-8");
        headers.set("X-Markdown-Tokens", String(Math.ceil(markdown.length / 4)));
        headers.delete("Content-Length");
        headers.delete("ETag");
        return new Response(request.method === "HEAD" ? null : markdown, {
          status: asset.status,
          headers,
        });
      }
    }

    const response = await env.ASSETS.fetch(request);
    if (!negotiable) return response;
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: varyOnAccept(response),
    });
  },
};
