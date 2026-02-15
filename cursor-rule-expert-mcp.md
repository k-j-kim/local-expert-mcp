# Use local-expert MCP when context matches expert entities

When the user's question, code, or file names involve **entity names that match the local-expert MCP experts** (e.g. customApplication, customTab, webapplications), **call the `get_expert_knowledge`** tool with the matching topic **before** answering or editing code.

- Match the topic to the entity: e.g. "custom app" / "custom application" → topic `customApplication`; "custom tab" / "tabs" → topic `customTab`; "web application" → topic `webapplications`.
- **Webapplications (chained):** For web app questions, call first with topic `webapplications` to get a directory of sub-knowledges; then call again with the specific sub-topic (e.g. `webapplications-best-practice`, `webapplications-feature-adding-features`, `webapplications-feature-analytics-chart`, `webapplications-feature-global-search`, `webapplications-feature-authentication`, `webapplications-feature-nav-menu`, `webapplications-feature-graphql`, `webapplications-feature-shadcn`, `webapplications-adding-map`, `webapplications-creating-records`, `webapplications-weather-widget`, `webapplications-list-and-create-records`) that matches the user's request.
- Call the tool early so your answer or code follows the documented expert knowledge.

If unsure which topic fits, call `get_expert_knowledge` without a topic to retrieve all experts, then use the one that matches.
