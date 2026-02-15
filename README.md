# Local Expert MCP Server

A local MCP (Model Context Protocol) server that serves knowledge from an `experts/` directory. Each expert folder can contain markdown files (e.g. `knowledge.md`); all are exposed as **resources** and can be queried by **topic** via a tool.

## Structure

```
experts/
├── customApplication/
│   └── knowledge.md
├── customTab/
│   └── knowledge.md
├── webapplications/           # directory index — call with topic "webapplications" first
│   └── knowledge.md
├── webapplications-feature-adding-features/
│   └── knowledge.md
├── webapplications-best-practice/
│   └── knowledge.md
├── webapplications-feature-analytics-chart/
│   └── knowledge.md
├── webapplications-feature-global-search/
│   └── knowledge.md
└── ... (other webapplications-* sub-experts)
```

- Any folder under `experts/` is an “expert” (e.g. `customApplication`, `customTab`, `webapplications`, `webapplications-best-practice`).
- All `.md` files under those folders are loaded and served.
- Each file can define what the knowledge is for via a **header** (used for topic filtering).
- For **webapplications**, the `webapplications/` folder holds a directory; other `webapplications-*` folders hold sub-knowledges. Call with topic `webapplications` first, then with the chosen sub-topic name for chained lookups.

## Knowledge file headers

Each markdown file can declare its topic in either way:

**1. YAML frontmatter (recommended):**

```yaml
---
topic: customApplication
description: Knowledge for building and configuring custom applications
---
```

Supported keys: `topic`, `for`, `expert`, `name`, `description`, `summary`.

**2. First markdown heading:**  
If there is no frontmatter, the first `# Heading` line is used as the topic.

## MCP surface

- **Resources**  
  Every markdown file is exposed as a resource with URI like:  
  `expert://<expertFolder>/<path/to/file>.md`  
  Clients can use `resources/list` and `resources/read` to discover and read them.

- **Tool: `get_expert_knowledge`**  
  - **Arguments:** `topic` (optional string).  
  - **Behavior:**  
    - If `topic` exactly matches an expert folder name (e.g. `webapplications`), returns only that expert’s files (for directory-style experts).  
    - Otherwise, if `topic` is provided: returns knowledge whose topic/expert/description matches (case-insensitive).  
    - If omitted: returns all loaded expert knowledge.  
  Use this to pull in only the expert that matches the user’s question (e.g. “customApplication”, “customTab”).  
  **Chained calls (webapplications):** Call first with topic `webapplications` to get a directory of sub-knowledges; then call again with a sub-topic (e.g. `webapplications-best-practice`, `webapplications-feature-analytics-chart`, `webapplications-feature-global-search`) to load the relevant knowledge.

## Launch and call

**1. Install and run the server (stdio):**

```bash
npm install
npm start
```

Or with a custom experts directory:

```bash
EXPERTS_DIR=/path/to/experts node index.js
```

**2. Test with the included client:**

```bash
node test-client.js
```

This lists resources and calls `get_expert_knowledge({ topic: "customApplication" })`.

**3. Use with MCP Inspector:**

```bash
npx @modelcontextprotocol/inspector node index.js
```

Then open the URL shown (e.g. http://localhost:6274) to list resources, read them, and call the tool.

**4. Use from Cursor/Claude:**

Add the server to your MCP config (e.g. Cursor MCP settings) as a stdio server:

- **Command:** `node`
- **Args:** `["/absolute/path/to/local-expert-mcp/index.js"]`
- **Cwd:** `/absolute/path/to/local-expert-mcp` (optional; defaults to project root)

Then you can use the `get_expert_knowledge` tool with a topic to fetch the right expert knowledge in chat.

## Ensuring the MCP is used when entity names match

So that the AI consistently calls this MCP when the user’s question or code involves expert entities (e.g. customApplication, customTab, webapplications):

1. **Server instructions**  
   The server sends **instructions** to the client listing expert names and telling the model to call `get_expert_knowledge` with the matching topic before answering. Cursor (and other MCP clients) can use this during initialization.

2. **Tool description**  
   The tool description is generated to list current expert slugs and when to call it, so the model is more likely to invoke it for those topics.

3. **Cursor rule in the project that uses this MCP**  
   In the project where you added the local-expert MCP (e.g. `afv-test`), add a rule so the AI always considers the tool when entity names match:
   - Copy [cursor-rule-expert-mcp.md](./cursor-rule-expert-mcp.md) into that project’s rules (e.g. `.cursor/rules/use-expert-mcp.mdc` or paste into a rule in Cursor Settings → Rules), or  
   - In Cursor: **Settings → General → Rules for AI**, add a rule that says: when the user’s question or code involves entity names that match the expert topics (customApplication, customTab, webapplications, etc.), call the `get_expert_knowledge` tool with that topic before answering.
