import React, { lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.jsx";
import { About } from "./About.jsx";
import "@fontsource-variable/manrope/wght.css";
import "@fontsource-variable/source-sans-3/wght.css";
import "./styles.css";

// Download the archive only on blog routes, never on the homepage.
const BlogIndex = lazy(() => import("./Blog.jsx").then(module => ({ default: module.BlogIndex })));
const BlogPost = lazy(() => import("./Blog.jsx").then(module => ({ default: module.BlogPost })));

const base = import.meta.env.BASE_URL;
const path = window.location.pathname.startsWith(base)
  ? window.location.pathname.slice(base.length)
  : window.location.pathname.replace(/^\//, "");
const route = path.replace(/\/$/, "");

const view = route === "about"
  ? <About />
  : route === "blog"
    ? <BlogIndex />
    : route.startsWith("blog/")
      ? <BlogPost slug={route.slice("blog/".length)} />
      : <App />;

createRoot(document.getElementById("root")).render(
  <React.StrictMode><Suspense fallback={<main className="section-pad"><p>Loading articles…</p></main>}>{view}</Suspense></React.StrictMode>,
);
