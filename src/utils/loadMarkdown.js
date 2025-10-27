import fs from "fs";
import path from "path";

export function loadMarkdownPosts() {
  const dir = path.resolve("src/content/insights");
  const files = fs.readdirSync(dir);

  const posts = files
    .map((filename) => {
      const filePath = path.join(dir, filename);
      const fileContents = fs.readFileSync(filePath, "utf8");
      const { data, content } = matter(fileContents);
      return { ...data, content, slug: filename.replace(/\.md$/, ""), __filename: filename };
    })
    // remove drafts (files with `draft: true` in frontmatter)
    .filter((p) => !p || !p.draft)
    // remove any null-ish values
    .filter(Boolean);

  // sort newest first (only on included posts)
  return posts.sort((a, b) => new Date(b.date) - new Date(a.date));
}
