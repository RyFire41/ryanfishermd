import { PDF_BASE_PATH } from "@/config/files";

export function slugify(value) {
  return String(value || "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function pdfFilenameFromTopic(topic) {
  if (!topic) return "";
  const base =
    typeof topic === "string"
      ? topic
      : topic.pdf || topic.slug || topic.title || "";
  const clean = slugify(base);
  return clean.endsWith(".pdf") ? clean : `${clean}.pdf`;
}

export function pdfUrlFromTopic(topic) {
  const filename = pdfFilenameFromTopic(topic);
  return filename ? `${PDF_BASE_PATH}/${filename}` : "";
}

export function attachPdfUrls(topicsList = []) {
  return topicsList.map((t) => ({ ...t, pdfUrl: pdfUrlFromTopic(t) }));
}
