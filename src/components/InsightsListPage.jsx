import React from "react";
// Header is rendered globally in main.jsx
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import slugify from "slugify";

// Import markdown files
const mdFiles = import.meta.glob("../content/insights/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
});

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
  .filter((p) => !p.draft)
  .sort((a, b) => new Date(b.date) - new Date(a.date));

export default function InsightsListPage() {
  return (
    <>
      <Helmet>
        <title>Physician’s Insights — Dr. Ryan M. Fisher, MD</title>
        <meta name="description" content="A curated list of insights from Dr. Ryan M. Fisher, MD on preventive care and whole-person medicine." />
      </Helmet>
  <main id="main-content" role="main" tabIndex={-1} className="min-h-screen bg-[#F4EFE4] py-10 px-4">
        <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-semibold text-[#2F4634] mb-4 text-center">
          Physician’s Insights — All Articles
        </h1>
        <p className="text-[#6b7280] text-sm mb-8 text-center max-w-2xl mx-auto">
          A curated list of published insights, sorted by publish date. Click any
          title to read the full piece.
        </p>

        <div className="grid gap-6">
          {insights.map((post) => (
            <article key={post.slug} className="bg-white rounded-2xl p-6 border border-[#e9e5da] shadow-sm">
              <h2 className="text-xl font-semibold text-[#2F4634]"><Link to={`/insights/${slugify(post.title, { lower: true, strict: true })}`}>{post.title}</Link></h2>
              <p className="text-sm text-[#374151] mt-2">{post.summary}</p>
              <p className="text-xs text-[#6b7280] italic mt-3">{new Date(post.date).toLocaleDateString("en-US")}</p>
            </article>
          ))}
        </div>
      </div>
    </main>
    </>
  );
}
