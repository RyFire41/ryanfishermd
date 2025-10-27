import React from "react";
// Header is rendered globally in main.jsx
import topics from "../data/topics.json";

// Educational Topics list — add or remove items here
;

// Preview component — shows first few topics on homepage
export function EducationalTopicsPreview() {
  const featured = topics.slice(0, 3); // shows 3 on homepage

  return (
    <section className="rounded-3xl border border-[#e9e5da] bg-white p-8 shadow-sm mt-10">
      <h2 className="text-2xl font-semibold text-[#2F4634]">Educational Topics</h2>
      <p className="mt-2 text-[#6b7280] text-sm max-w-3xl">
        Explore reliable, easy-to-understand information to help you stay informed about your health.
      </p>

      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {featured.map((topic, idx) => (
          <article
            key={idx}
            className="rounded-2xl border border-[#e9e5da] bg-[#fbf9f5] p-5 hover:bg-[#f9f6f0] transition-colors duration-200"
          >
            <h3 className="font-semibold text-[#1f2937] text-lg">{topic.title}</h3>
            <p className="mt-2 text-sm text-[#374151]">{topic.description}</p>
          </article>
        ))}
      </div>

      <div className="mt-6 text-right">
        <a
          href="/education"
          className="text-[#2F4634] font-medium underline hover:text-[#8DA38A]"
        >
          View All Topics →
        </a>
      </div>
    </section>
  );
}

// Full-page version
export function EducationalTopicsFullPage() {
  return (
    <>
    <main className="min-h-screen bg-[#F4EFE4] py-10 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-semibold text-[#2F4634] mb-4">Educational Topics</h1>
        <p className="text-[#6b7280] text-sm mb-8 max-w-3xl">
          Independent, evidence-based educational materials to support your understanding of health and wellness.
        </p>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {topics.map((topic, idx) => (
            <article
              key={idx}
              className="rounded-2xl border border-[#e9e5da] bg-white p-6 hover:bg-[#f9f6f0] transition-colors duration-200 shadow-sm"
            >
              <h3 className="font-semibold text-[#1f2937] text-lg">{topic.title}</h3>
              <p className="mt-2 text-sm text-[#374151]">{topic.description}</p>
            </article>
          ))}
        </div>

        <p className="text-xs text-[#6b7280] italic mt-10 text-center">
          These materials are intended for general education and may support discussions with your healthcare provider.
        </p>
      </div>
    </main>
    </>
  );
}
