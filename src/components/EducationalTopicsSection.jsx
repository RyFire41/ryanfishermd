import React from "react";
import topics from "@/data/pdfs.json";
import PdfLinkList from "@/components/PdfLinkList";
import { FileDown, ExternalLink } from "lucide-react";

// Helper: pick N random unique items
function getRandomTopics(arr, count) {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// PREVIEW SECTION — shows 2 random topics on homepage
export function EducationalTopicsPreview() {
  // pick 2 random topics from your JSON list
  const featured = [...topics].sort(() => 0.5 - Math.random()).slice(0, 2);

  return (
    <section className="rounded-3xl border border-[#e9e5da] bg-white p-8 shadow-sm mt-10">
      <h2 className="text-2xl font-semibold text-[#2F4634]">
        Educational Topics
      </h2>
      <p className="mt-2 text-[#6b7280] text-sm max-w-3xl">
        Explore reliable, easy-to-understand information to help you stay
        informed about your health.
      </p>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        {featured.map((topic) => {
          // build anchor based on subgroup if present
          const anchor = topic.subgroup
            ? topic.subgroup.toLowerCase().replace(/[^a-z0-9]+/g, "-")
            : topic.system
              ? topic.system.toLowerCase().replace(/[^a-z0-9]+/g, "-")
              : "all-topics";

          return (
            <a
              key={topic.title}
              href={`/education#${anchor}`}
              className="block rounded-2xl border border-[#e9e5da] bg-[#fbf9f5] p-5 hover:bg-[#f9f6f0] transition-colors duration-200"
            >
              <h3 className="font-semibold text-[#1f2937] text-lg">
                {topic.title}
              </h3>
            </a>
          );
        })}
      </div>

      <div className="mt-6 text-right">
        <a
          href="/education#musculoskeletal"
          className="text-[#2F4634] font-medium underline hover:text-[#8DA38A]"
        >
          View All Topics →
        </a>
      </div>
    </section>
  );
}

// FULL PAGE — shows all topics
export function EducationalTopicsFullPage() {
  return (
    <main className="min-h-screen bg-[#F4EFE4] py-10 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-semibold text-[#2F4634] mb-4">
          Educational Topics
        </h1>
        <p className="text-[#6b7280] text-sm mb-8 max-w-3xl">
          Independent, evidence-based educational materials to support your
          understanding of health and wellness.
        </p>

        {/* anchor target for homepage link */}
        {/* full PDF + external resources list */}
        <div className="mt-12">
          <PdfLinkList topics={topics} />

          <section className="mt-8 text-sm text-[#2F4634]/80 flex items-center gap-6">
            <div className="flex items-center gap-2">
              <FileDown size={16} strokeWidth={2} /> <span>Download PDF</span>
            </div>
            <div className="flex items-center gap-2">
              <ExternalLink size={16} strokeWidth={2} />{" "}
              <span>External resource</span>
            </div>
          </section>

          <p className="text-xs text-[#6b7280] italic mt-10 text-center">
            These materials are intended for general education and may support
            discussions with your healthcare provider.
          </p>
        </div>
      </div>
    </main>
  );
}
