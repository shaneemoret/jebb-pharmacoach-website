import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.jsx";
import { BlogIndex, BlogPost } from "./Blog.jsx";
import "@fontsource-variable/manrope/wght.css";
import "@fontsource-variable/source-sans-3/wght.css";
import "./styles.css";

const base = import.meta.env.BASE_URL;
const path = window.location.pathname.startsWith(base)
  ? window.location.pathname.slice(base.length)
  : window.location.pathname.replace(/^\//, "");
const route = path.replace(/\/$/, "");

const view = route === "blog"
  ? <BlogIndex />
  : route.startsWith("blog/")
    ? <BlogPost slug={route.slice("blog/".length)} />
    : <App />;

createRoot(document.getElementById("root")).render(
  <React.StrictMode>{view}</React.StrictMode>,
);
