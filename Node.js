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
  return {
    title,
    system: "Musculoskeletal", // default; you can edit later
    pdf: file,
    external: "",
    sourceTitle: "",
  };
});

fs.writeFileSync(out, JSON.stringify(topics, null, 2));
console.log(`Wrote ${topics.length} topics to ${out}`);
