// src/utils/pdfHelpers.js

// Base folder for PDFs (already defined in your config)
import { PDF_BASE_PATH } from "@/config/files";

// Convert a title or slug into a clean URL-safe filename
export function slugify(value) {
  return String(value || "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Determine filename from topic data
export function pdfFilenameFromTopic(topic) {
  if (!topic) return "";
  if (typeof topic === "string") return `${slugify(topic)}.pdf`;
  if (typeof topic.pdf === "string")
    return topic.pdf.endsWith(".pdf") ? topic.pdf : `${topic.pdf}.pdf`;
  const base = topic.slug || topic.title || "";
  return `${slugify(base)}.pdf`;
}

// Construct the full URL to the PDF
export function pdfUrlFromTopic(topic) {
  const filename = pdfFilenameFromTopic(topic);
  return filename ? `${PDF_BASE_PATH}/${filename}` : "";
}

// Attach a pdfUrl to each topic in a list
export function attachPdfUrls(topicsList = []) {
  return topicsList.map((t) => ({ ...t, pdfUrl: pdfUrlFromTopic(t) }));
}
