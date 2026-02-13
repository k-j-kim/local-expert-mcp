# Use local-expert MCP when context matches expert entities

When the user's question, code, or file names involve **entity names that match the local-expert MCP experts** (e.g. customApplication, customTab, webapplications), **call the `get_expert_knowledge`** tool with the matching topic **before** answering or editing code.

- Match the topic to the entity: e.g. "custom app" / "custom application" → topic `customApplication`; "custom tab" / "tabs" → topic `customTab`; "web application" → topic `webapplications`.
- Call the tool early so your answer or code follows the documented expert knowledge.

If unsure which topic fits, call `get_expert_knowledge` without a topic to retrieve all experts, then use the one that matches.
