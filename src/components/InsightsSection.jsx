// Header is rendered globally in main.jsx
import ReactMarkdown from "react-markdown";
import { Link } from "react-router-dom";
import slugify from "slugify";
import React, { useState, useEffect } from "react";
import "../styles/markdown.css";

// Load markdown files as raw text
const mdFiles = import.meta.glob("../content/insights/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
});

// Front-matter parser
function parseFrontMatter(raw) {
  const match = /^---\n([\s\S]+?)\n---\n([\s\S]*)$/m.exec(raw);
  if (!match) return { data: {}, content: raw };
  const yaml = match[1];
  const content = match[2];
  const data = {};
  yaml.split("\n").forEach((line) => {
    const [key, ...rest] = line.split(":");
    if (key) data[key.trim()] = rest.join(":").trim();
  });
  return { data, content };
}

// Parse markdowns and create slugs
const insights = Object.entries(mdFiles)
  .map(([path, raw]) => {
    const { data, content } = parseFrontMatter(raw);
    const slug = path.split("/").pop().replace(".md", "");
    return {
      slug,
      title: data.title || "Untitled",
      summary: data.summary || "",
      date: data.date || "1970-01-01",
      content,
      draft: data.draft === "true" || data.draft === true,
    };
  })
  // exclude drafts
  .filter((p) => !p.draft)
  .sort((a, b) => new Date(b.date) - new Date(a.date));

// Format date to U.S. style
function formatDate(dateString, overrides = {}) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    ...overrides,
  });
}

// ✅ HOMEPAGE PREVIEW
export function InsightsPreview() {
  const latestInsights = insights.slice(0, 2);

  return (
    <section className="rounded-3xl border border-[#e9e5da] bg-white p-8 shadow-sm mt-10">
      <h2 className="text-2xl font-semibold text-[#2F4634]">Physician’s Insights</h2>
      <p className="mt-2 text-[#6b7280] text-sm max-w-3xl">
        Thoughtful reflections and short writings from Dr. Ryan M. Fisher, MD —
        exploring the art and science of whole-person care.
      </p>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">

          {latestInsights.map((entry) => {
            const slug = slugify(entry.title, { lower: true, strict: true });
            return (
              <Link
                key={entry.slug ?? slug}
                to={`/insights/${slug}`}
                className="block rounded-2xl border border-[#e9e5da] bg-[#fbf9f5] p-5 hover:bg-[#f9f6f0] transition-colors duration-200"
              >
                <h3 className="font-semibold text-[#1f2937] text-lg">{entry.title}</h3>
                <p className="mt-2 text-sm text-[#374151]">{entry.summary}</p>
                <p className="mt-3 text-xs text-[#6b7280] italic">
                  {formatDate(entry.date)}
                </p>
              </Link>
            );
          })}

      </div>

      <div className="mt-6 text-right">
        <a
          href="/insights"
          className="text-[#2F4634] font-medium underline hover:text-[#8DA38A]"
        >
          View All Insights →
        </a>
      </div>
    </section>
  );
}

// ✅ FULL PAGE — scrollable articles, each with anchor link
// Simple helper function for reading time estimation
function estimateReadingTime(text) {
  const wordsPerMinute = 200; // Average adult reading speed
  const words = text.split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
}
export default function InsightsFullPage() {
  // Pagination setup
  const [page, setPage] = useState(1);
  const perPage = 1;
  const totalPages = Math.ceil(insights.length / perPage);
  const start = (page - 1) * perPage;
  const visible = insights.slice(start, start + perPage);
useEffect(() => {
  const hash = window.location.hash.slice(1); // get the part after #
  if (hash) {
    // small delay to allow render before scroll
    setTimeout(() => {
      const target = document.getElementById(hash);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 400);
  }
}, []);

  return (
    <>
      <main className="min-h-screen bg-[#F4EFE4] py-10 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-semibold text-[#2F4634] mb-4 text-center">
            Physician’s Insights
          </h1>
          <p className="text-[#6b7280] text-sm mb-10 text-center max-w-2xl mx-auto">
            Reflections and educational writings from Dr. Ryan M. Fisher, MD.
          </p>

          {visible.map((entry) => (
            <section
              key={entry.slug}
              id={entry.slug}
              className="bg-white rounded-3xl shadow-md p-10 mb-12 border border-[#e9e5da]"
            >
              <h2 className="text-2xl font-semibold text-[#2F4634] mb-2">
                {entry.title}
              </h2>
              <p className="text-sm text-[#6b7280] italic mb-6">
                {formatDate(entry.date, { month: "long" })}
                {" • "}
                {estimateReadingTime(entry.content)}
              </p>

              <div className="prose-dr">
               <ReactMarkdown>{entry.content}</ReactMarkdown>
             </div>



            </section>
          ))}

          {/* Pagination Controls */}
          <div className="flex justify-between items-center mt-12">
            <button
              onClick={() => {
                setPage((p) => Math.max(p - 1, 1));
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              disabled={page === 1}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                page === 1
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-[#2F4634] text-white hover:bg-[#8DA38A]"
              }`}
            >
              ← Previous
            </button>

            <span className="text-sm text-[#2F4634]">
              Page {page} of {totalPages}
            </span>

            <button
              onClick={() => {
                setPage((p) => Math.min(p + 1, totalPages));
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              disabled={page === totalPages}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                page === totalPages
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-[#2F4634] text-white hover:bg-[#8DA38A]"
              }`}
            >
              Next →
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
