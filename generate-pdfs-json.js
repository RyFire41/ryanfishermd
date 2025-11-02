// generate-pdfs-json.js
import fs from "fs";
import path from "path";

const dir = path.resolve("public/pdfs");
const out = path.resolve("src/data/pdfs.json");

const files = fs
  .readdirSync(dir)
  .filter((f) => f.toLowerCase().endsWith(".pdf"))
  .sort();

const topics = files.map((file) => {
  const title = file
    .replace(/\.pdf$/i, "")
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  let system = "Musculoskeletal"; // default
  let subgroup = null;

  // only apply subcategories within Musculoskeletal
  if (system === "Musculoskeletal") {
    const lower = title.toLowerCase();

    if (lower.includes("back") || lower.includes("spine")) subgroup = "Back";
    else if (lower.includes("knee")) subgroup = "Knee";
    else if (lower.includes("hip")) subgroup = "Hip";
    else if (lower.includes("shoulder") || lower.includes("rotator"))
      subgroup = "Shoulder";
    else if (lower.includes("wrist") || lower.includes("carpal"))
      subgroup = "Hand/Wrist";
    else if (lower.includes("foot") || lower.includes("ankle"))
      subgroup = "Foot/Ankle";
    else if (lower.includes("elbow") || lower.includes("epicondylitis"))
      subgroup = "Elbow";
    else subgroup = "General";
  }

  return {
    title,
    system,
    subgroup,
    pdf: file,
    external: "",
    sourceTitle: "",
  };
});

fs.writeFileSync(out, JSON.stringify(topics, null, 2));
console.log(`Wrote ${topics.length} topics to ${out}`);
