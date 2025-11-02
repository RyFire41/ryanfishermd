import React from "react";
import {
  FileDown,
  ExternalLink,
  Activity,
  MoveRight,
  Aperture,
  Circle,
  Hand,
  Footprints,
  Repeat,
  FileText,
} from "lucide-react";

import { attachPdfUrls } from "@/utils/pdfHelpers"; // adjust if path differs

const subgroupIcons = {
  Back: Activity,
  Shoulder: MoveRight,
  Knee: Aperture,
  Hip: Circle,
  "Hand/Wrist": Hand,
  "Foot/Ankle": Footprints,
  Elbow: Repeat,
  General: FileText,
};

export default function PdfLinkList({ topics = [] }) {
  if (!topics.length) return null;

  // group by system → subgroup if present
  const grouped = topics.reduce((acc, t) => {
    const system = t.system || "General";
    const subgroup = t.subgroup || null;

    if (!acc[system]) acc[system] = {};
    if (subgroup) {
      if (!acc[system][subgroup]) acc[system][subgroup] = [];
      acc[system][subgroup].push(t);
    } else {
      if (!acc[system]._flat) acc[system]._flat = [];
      acc[system]._flat.push(t);
    }

    return acc;
  }, {});

  return (
    <section className="mx-auto max-w-3xl space-y-10 fade-in scroll-smooth">
      {Object.entries(grouped).map(([system, groups]) => (
        <div key={system}>
          <h2
            id={system.toLowerCase().replace(/\s+/g, "-")}
            className="text-2xl font-semibold text-[#2F4634] mb-4 brand-serif"
          >
            {system}
          </h2>

          {/* Render subgroups only for Musculoskeletal */}
          {Object.keys(groups).some((g) => g !== "_flat") ? (
            Object.entries(groups)
              .filter(([g]) => g !== "_flat")
              .map(([sub, list]) => {
                const Icon = subgroupIcons[sub] || FileText;
                const anchorId = sub.toLowerCase().replace(/[^a-z0-9]+/g, "-");
                return (
                  <div key={sub} id={anchorId} className="mb-8 scroll-mt-24">
                    <div className="inline-flex items-center gap-2 flex-nowrap items-center gap-2 mb-3">
                      {/* <Icon
                        size={18}
                        className="text-[#8DA38A]"
                        aria-hidden="true"
                      /> */}
                      <h3 className="text-xl font-semibold text-[#2F4634]/90 brand-serif">
                        {sub}
                      </h3>
                    </div>

                    <ul className="grid gap-3 sm:grid-cols-2">
                      {attachPdfUrls(list).map((t) => (
                        <li key={t.title}>
                          <PdfItem t={t} />
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })
          ) : (
            <ul className="grid gap-3 sm:grid-cols-2">
              {attachPdfUrls(groups._flat || []).map((t) => (
                <li key={t.title}>
                  <PdfItem t={t} />
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </section>
  );
}

function PdfItem({ t }) {
  return (
    <div className="rounded-lg bg-white/70 px-4 py-3 hover:bg-[#e9e5da] transition-colors">
      {t.external && (
        <a
          href={t.external}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 flex-nowrap text-sm text-[#8DA38A] hover:text-[#2F4634]"
        >
          <ExternalLink size={14} strokeWidth={2} />
          <span>{t.sourceTitle || "More information"}</span>
        </a>
      )}
      {t.external && <div className="h-2" />} {/* adds small vertical gap */}
      <a
        href={t.pdfUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 flex-nowrap text-[#2F4634] font-medium"
      >
        <FileDown size={16} strokeWidth={2} /> {t.title}
      </a>
    </div>
  );
}
