"use strict";

const path = require("path");
const { McpServer } = require("@modelcontextprotocol/sdk/server/mcp.js");
const { StdioServerTransport } = require("@modelcontextprotocol/sdk/server/stdio.js");
const { loadExperts } = require("./lib/expertsLoader.js");

const EXPERTS_DIR = process.env.EXPERTS_DIR || path.join(__dirname, "experts");

const experts = loadExperts(EXPERTS_DIR);

// Expert folder names (entity names) — used for instructions and tool description
const expertSlugs = [...new Set(experts.map((e) => e.expertSlug))].sort();
const expertList = expertSlugs.join(", ");

const server = new McpServer(
  {
    name: "local-expert-mcp",
    version: "1.0.0",
  },
  {
    instructions: `Use this server when the user's question, code, or file names involve these topics/entities: ${expertList}.

Call the get_expert_knowledge tool with the topic parameter set to the matching expert name (e.g. customApplication, customTab, webapplications) before answering or editing code related to that topic. This ensures answers and code follow the documented expert knowledge.`,
  }
);

// Register each expert file as a resource (URI: expert://expertSlug/...)
// Use normalized URI so server lookup (new URL(uri).toString()) matches
for (const ex of experts) {
  const resourceUri = new URL(ex.uri).toString();
  server.resource(
    ex.relativePath,
    resourceUri,
    {
      title: ex.topic ? `${ex.topic} — ${ex.relativePath}` : ex.relativePath,
      description: ex.description || `Expert knowledge: ${ex.relativePath}`,
      mimeType: "text/markdown",
    },
    () => ({
      contents: [
        {
          uri: resourceUri,
          mimeType: "text/markdown",
          text: ex.content,
        },
      ],
    })
  );
}

// Tool: get expert knowledge, optionally filtered by topic
const { z } = require("zod");
server.registerTool(
  "get_expert_knowledge",
  {
    description: `Fetch expert knowledge for a topic. Call this when the user's question or code involves any of these entities: ${expertList}. Pass the matching entity name as topic (e.g. topic: "customApplication" for custom app questions). Available experts: ${expertList}. If no topic is given, returns all expert knowledge.`,
    inputSchema: {
      topic: z
        .string()
        .optional()
        .describe(
          `Expert/topic name to filter by. Use one of: ${expertList}. Omit to return all.`
        ),
    },
  },
  async ({ topic }) => {
    let matched = experts;
    if (topic && topic.trim()) {
      const q = topic.trim().toLowerCase();
      matched = experts.filter(
        (ex) =>
          (ex.topic && ex.topic.toLowerCase().includes(q)) ||
          (ex.expertSlug && ex.expertSlug.toLowerCase().includes(q)) ||
          (ex.description && ex.description.toLowerCase().includes(q))
      );
    }
    if (matched.length === 0) {
      return {
        content: [
          {
            type: "text",
            text: topic
              ? `No expert knowledge found for topic "${topic}". Available experts: ${[
                  ...new Set(experts.map((e) => e.expertSlug)),
                ].join(", ")}`
              : "No expert knowledge files found.",
          },
        ],
      };
    }
    const parts = matched.map(
      (ex) =>
        `## ${ex.relativePath}${ex.topic ? ` (${ex.topic})` : ""}\n\n${ex.content}`
    );
    return {
      content: [
        {
          type: "text",
          text: parts.join("\n\n---\n\n"),
        },
      ],
    };
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  // Log to stderr so we don't break stdio JSON-RPC
  console.error(`local-expert-mcp: serving ${experts.length} expert file(s) from ${EXPERTS_DIR}`);
}

main().catch((err) => {
  console.error("Server error:", err);
  process.exit(1);
});
