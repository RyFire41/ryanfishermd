import React, { useMemo, useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
// Header is rendered globally in main.jsx

// Load markdown files from the insights folder
const mdFiles = import.meta.glob("../content/insights/*.md", { query: "?raw", import: "default", eager: true });

/* Minimal front-matter parser: expects 
---
title: ...
summary: ...
date: YYYY-MM-DD
---
<markdown>
*/
function parseFrontMatter(raw) {
  const m = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/m.exec(raw);
  if (!m) return { data: {}, content: raw };
  const yaml = m[1];
  const content = m[2];
  const data = {};
  yaml.split("\n").forEach((line) => {
    const i = line.indexOf(":");
    if (i > -1) {
      const key = line.slice(0, i).trim();
      const val = line.slice(i + 1).trim().replace(/^"|"$/g, "");
      data[key] = val;
    }
  });
  return { data, content };
}

/* Safe, local slugify (no extra deps) */
function slugify(s) {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/* Build article list from files */
const ALL_POSTS = Object.entries(mdFiles)
  .map(([path, raw]) => {
    const { data, content } = parseFrontMatter(raw);
    const fileBase = path.split("/").pop().replace(/\.md$/i, "");
    const slugFromFile = slugify(fileBase);
    const title = data.title || fileBase;
    const slugFromTitle = slugify(title);
    return {
      slug: slugFromTitle, // preferred slug
      fallbacks: new Set([slugFromFile, slugFromTitle]),
      title,
      summary: data.summary || "",
      date: data.date || "1970-01-01",
      content,
      draft: data.draft === "true" || data.draft === true,
    };
  })
  // exclude draft files so they can't be navigated to
  .filter((p) => !p.draft)
  .sort((a, b) => new Date(b.date) - new Date(a.date));

/* Reading time */
function readingTime(text) {
  const words = (text || "").trim().split(/\s+/).length;
  return `${Math.max(1, Math.ceil(words / 200))} min read`;
}

export default function InsightArticlePage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  /* Pick article by slug against both title and filename slugs */
  const { article, index } = useMemo(() => {
    const idx = ALL_POSTS.findIndex((p) => p.fallbacks.has(slug));
    return { article: ALL_POSTS[idx] || null, index: idx };
  }, [slug]);

  /* Scroll to top on load/route change */
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    console.log("✅ Markdown page mounted");
  }, [slug]);

  // show floating back-to-top after scrolling down
  const [showTopBtn, setShowTopBtn] = useState(false);
  useEffect(() => {
    const onScroll = () => setShowTopBtn(window.scrollY > 200);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!article) {
    return (
      <>
        <main className="min-h-screen bg-[#F4EFE4] py-10 px-4">
          <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-md p-8 border border-[#e9e5da]">
            <h1 className="text-2xl font-semibold text-[#2F4634] mb-2">
              Article not found
            </h1>
            <p className="text-[#374151]">
              The requested article could not be located.
            </p>
            <div className="mt-6">
              <Link
                to="/insights"
                className="inline-block px-4 py-2 rounded-full bg-[#2F4634] text-white text-sm font-medium hover:bg-[#8DA38A] transition-colors"
              >
                ← Back to Insights
              </Link>
            </div>
          </div>
        </main>
      </>
    );
  }

  const prev = index > 0 ? ALL_POSTS[index - 1] : null;
  const next = index < ALL_POSTS.length - 1 ? ALL_POSTS[index + 1] : null;

  return (
    <>
  <main id="main-content" role="main" tabIndex={-1} className="min-h-screen bg-[#F4EFE4] py-10 px-4">
        <article className="max-w-3xl mx-auto bg-white rounded-3xl shadow-md p-8 md:p-10 border border-[#e9e5da] fade-in">
          {/* Top navigation: previous / next buttons for quick article traversal */}
          <div className="flex justify-between items-center mb-4">
            <div>
              {prev ? (
                <Link
                  to={`/insights/${prev.slug}`}
                  aria-label={`Previous article: ${prev.title}`}
                  className="group inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#2F4634] text-white text-sm font-medium hover:bg-[#8DA38A] transition-colors"
                >
                  <span className="group-hover:hidden">← Previous</span>
                  <span className="hidden group-hover:inline truncate max-w-[12rem]">← {prev.title}</span>
                </Link>
              ) : (
                <span />
              )}
            </div>
            <div>
              {next ? (
                <Link
                  to={`/insights/${next.slug}`}
                  aria-label={`Next article: ${next.title}`}
                  className="group inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#2F4634] text-white text-sm font-medium hover:bg-[#8DA38A] transition-colors"
                >
                  <span className="group-hover:hidden">Next →</span>
                  <span className="hidden group-hover:inline truncate max-w-[12rem]">{next.title} →</span>
                </Link>
              ) : (
                <span />
              )}
            </div>
          </div>
          {/* Title + Meta */}
          <header className="mb-6">
            <h1 className="text-2xl md:text-3xl font-semibold text-[#2F4634] leading-tight">
              {article.title}
            </h1>
            <div className="mt-3 text-sm text-[#6b7280] italic flex flex-wrap gap-3">
              <span>
                {new Date(article.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
              <span>•</span>
              <span>{readingTime(article.content)}</span>
            </div>
          </header>

          {/* Markdown body */}
          <Helmet>
            <title>{article.title} — Dr. Ryan M. Fisher, MD</title>
            <meta name="description" content={article.summary || 'Physician insights from Dr. Ryan M. Fisher, MD.'} />
            <meta property="og:title" content={article.title} />
            <meta property="og:description" content={article.summary || ''} />
            <meta property="og:type" content="article" />
            <meta property="og:url" content={`https://ryanfishermd.com/insights/${article.slug}`} />
            <meta name="twitter:card" content="summary_large_image" />
          </Helmet>
          <div className="overflow-x-auto prose-dr">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                img: (props) => (
                  // ensure markdown images are lazy-loaded and decoded async
                  // keep classes and alt text
                  <img {...props} loading="lazy" decoding="async" alt={props.alt || ''} />
                ),
              }}
            >
              {article.content}
            </ReactMarkdown>
          </div>


          {/* Navigation */}
          <nav className="mt-10 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex gap-3">
              {prev ? (
                <button
                  onClick={() => navigate(`/insights/${prev.slug}`)}
                  className="group px-4 py-2 rounded-full bg-[#2F4634] text-white text-sm font-medium hover:bg-[#8DA38A] transition-colors"
                  aria-label={`Previous article: ${prev.title}`}
                >
                  <span className="group-hover:hidden">← Previous</span>
                  <span className="hidden group-hover:inline truncate max-w-[12rem]">← {prev.title}</span>
                </button>
              ) : (
                <span />
              )}
              {next ? (
                <button
                  onClick={() => navigate(`/insights/${next.slug}`)}
                  className="group px-4 py-2 rounded-full bg-[#2F4634] text-white text-sm font-medium hover:bg-[#8DA38A] transition-colors"
                  aria-label={`Next article: ${next.title}`}
                >
                  <span className="group-hover:hidden">Next →</span>
                  <span className="hidden group-hover:inline truncate max-w-[12rem]">{next.title} →</span>
                </button>
              ) : (
                <span />
              )}
            </div>

            <div className="flex gap-3 sm:justify-end">
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="px-4 py-2 rounded-full bg-[#2F4634] text-white text-sm font-medium hover:bg-[#8DA38A] transition-colors"
              >
                Back to Top ↑
              </button>
              <Link
                to="/insights"
                onClick={() => setTimeout(() => window.scrollTo({ top: 0, behavior: "instant" }), 0)}
                className="px-4 py-2 rounded-full border border-[#2F4634] text-[#2F4634] text-sm font-medium hover:bg-[#F4EFE4] transition-colors"
              >
                All Insights
              </Link>
            </div>
          </nav>
        </article>
          {/* Floating back-to-top button */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="Back to top"
            className={`fixed bottom-6 right-6 z-50 inline-flex items-center justify-center h-12 w-12 rounded-full bg-white border border-[#e9e5da] shadow-md text-[#2F4634] hover:bg-[#fbf9f5] transition-colors fade-toggle ${
              showTopBtn ? "show" : ""
            }`}
          >
            ↑
          </button>
      </main>
    </>
  );
}
