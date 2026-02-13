"use strict";

const fs = require("fs");
const path = require("path");

/**
 * Parse YAML-like frontmatter from the start of a string.
 * Returns { frontmatter: object, body: string } or { frontmatter: null, body } if none.
 */
function parseFrontmatter(text) {
  const match = text.match(/^\s*---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/);
  if (!match) return { frontmatter: null, body: text };
  const raw = match[1];
  const body = match[2] || "";
  const frontmatter = {};
  for (const line of raw.split("\n")) {
    const m = line.match(/^\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*:\s*(.*)$/);
    if (m) frontmatter[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, "");
  }
  return { frontmatter, body };
}

/**
 * Get topic/description from content. Uses frontmatter (topic, for, description) or first # heading.
 */
function getKnowledgeMeta(content) {
  const { frontmatter, body } = parseFrontmatter(content);
  if (frontmatter && Object.keys(frontmatter).length > 0) {
    const topic =
      frontmatter.topic ||
      frontmatter.for ||
      frontmatter.expert ||
      frontmatter.name;
    const description =
      frontmatter.description || frontmatter.summary || topic || "";
    return { topic: topic || "", description };
  }
  const headingMatch = body.match(/^#\s+(.+)$/m);
  const topic = headingMatch ? headingMatch[1].trim() : "";
  return { topic, description: topic };
}

/**
 * Recursively find all .md files under dir.
 */
function findMarkdownFiles(dir, baseDir = dir) {
  const results = [];
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch (e) {
    return results;
  }
  for (const ent of entries) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      results.push(...findMarkdownFiles(full, baseDir));
    } else if (ent.isFile() && ent.name.endsWith(".md")) {
      results.push(path.relative(baseDir, full));
    }
  }
  return results;
}

/**
 * Load all expert knowledge from expertsDir (default: experts/ relative to cwd).
 * Returns array of { uri, filePath, relativePath, topic, description, content }.
 */
function loadExperts(expertsDir) {
  const resolved = path.isAbsolute(expertsDir)
    ? expertsDir
    : path.join(process.cwd(), expertsDir);
  if (!fs.existsSync(resolved) || !fs.statSync(resolved).isDirectory()) {
    return [];
  }
  const relativePaths = findMarkdownFiles(resolved);
  const experts = [];
  for (const rel of relativePaths) {
    const filePath = path.join(resolved, rel);
    let content;
    try {
      content = fs.readFileSync(filePath, "utf8");
    } catch (e) {
      continue;
    }
    const { topic, description } = getKnowledgeMeta(content);
    const pathSegments = rel.replace(/\\/g, "/").split("/");
    const expertSlug = pathSegments[0] || "default";
    const uri = `expert://${expertSlug}/${pathSegments.slice(1).join("/") || path.basename(rel)}`;
    experts.push({
      uri,
      filePath,
      relativePath: rel,
      expertSlug,
      topic,
      description,
      content,
    });
  }
  return experts;
}

module.exports = {
  loadExperts,
  parseFrontmatter,
  getKnowledgeMeta,
  findMarkdownFiles,
};
