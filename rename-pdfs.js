// rename-pdfs.js
import fs from "fs";
import path from "path";

const dir = path.resolve("public/pdfs");

function slugify(name) {
  return name
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const files = fs.readdirSync(dir);

for (const file of files) {
  if (!file.toLowerCase().endsWith(".pdf")) continue;

  const base = path.basename(file, ".pdf");
  const slug = slugify(base);
  const newName = `${slug}.pdf`;

  if (newName !== file) {
    const oldPath = path.join(dir, file);
    const newPath = path.join(dir, newName);
    fs.renameSync(oldPath, newPath);
    console.log(`Renamed: ${file} → ${newName}`);
  }
}

console.log("Done renaming PDFs.");
