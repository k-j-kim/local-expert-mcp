"use strict";

const path = require("path");
const { Client } = require("@modelcontextprotocol/sdk/client/index.js");
const { StdioClientTransport } = require("@modelcontextprotocol/sdk/client/stdio.js");

async function main() {
  const transport = new StdioClientTransport({
    command: "node",
    args: [path.join(__dirname, "index.js")],
    cwd: __dirname,
  });
  const client = new Client(
    { name: "test-client", version: "1.0.0" },
    { capabilities: {} }
  );
  await client.connect(transport);

  console.log("=== resources/list ===");
  const listResult = await client.listResources();
  console.log(JSON.stringify(listResult.resources, null, 2));

  console.log("\n=== tools/call get_expert_knowledge({ topic: 'customApplication' }) ===");
  const toolResult = await client.callTool({
    name: "get_expert_knowledge",
    arguments: { topic: "customApplication" },
  });
  console.log(JSON.stringify(toolResult, null, 2));

  await client.close();
  console.log("\nDone.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
