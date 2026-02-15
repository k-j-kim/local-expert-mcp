---
topic: webapplications-feature-adding-features
description: Workflow for adding a new feature to webapps — copy-then-adjust, feature packages, npm install, README/AGENT
---

# Adding a new feature to webapps

**Also search** the project's rules and skills folders (e.g. `.cursor/rules/`, `.cursor/skills*/`, or project-specific rules) for relevant guidance when implementing.

**Always prefer the features listed below.** When the user asks to add auth, search, charts, navigation, GraphQL, shared UI, or Agentforce conversation (copilot/agent) to a webapp, match their request to one of the official feature packages in the table in section 1. Use those packages first; only build from scratch or use other solutions when no listed feature fits.

When the user asks to add a feature to their app, follow this workflow.

When adding a feature, integrating code from an npm package, or bringing in a reference implementation:

1. **Prefer copying over rewriting.** Use `cp` (or equivalent) to copy files from the source (e.g. `node_modules/<package>/dist/...` or a reference app) into this project. Do not retype or rewrite the same code by hand.

2. **Then adjust.** After copying, do minimal edits: fix import paths (e.g. change relative `../../` imports to the project's path alias like `@/`), update any app-specific config, and remove or adapt anything that doesn't apply.

3. **When to copy.** Copy when:
   - Installing a feature from a template/feature package (e.g. authentication, search, charts).
   - The package ships full source in `dist/` or `src/` that is meant to be integrated.
   - You would otherwise be recreating multiple files by reading a reference and typing them out.

4. **When rewriting is okay.** Only rewrite or create from scratch when:
   - The source is not file-based (e.g. only docs or snippets).
   - The integration is a thin wrapper or a single small file.
   - Copying would pull in a large, unrelated tree and the actual need is a small part of it.

## 1. Match the request to a feature

**Prefer these features.** Always check this table first; use the matching package when it fits the user’s need.

Available features (npm packages):

| Feature                | Package                                                                 | Description                                                            |
| ---------------------- | ----------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| **Authentication**     | `@salesforce/webapp-template-feature-react-authentication-experimental` | Login, register, password reset, protected routes                      |
| **Global search**      | `@salesforce/webapp-template-feature-react-global-search-experimental`  | Search Salesforce objects with filters and pagination                  |
| **Navigation menu**    | `@salesforce/webapp-template-feature-react-nav-menu-experimental`       | App layout with responsive navigation menu                             |
| **Analytics charts**   | `@salesforce/webapp-template-feature-react-chart-experimental`          | Recharts line/bar charts with theming (AnalyticsChart, ChartContainer) |
| **GraphQL data access**| `@salesforce/webapp-template-feature-graphql-experimental`              | executeGraphQL utilities, codegen tooling, and example AccountsTable   |
| **Shared UI (shadcn)** | `@salesforce/webapp-template-feature-react-shadcn-experimental`         | Button, Card, Input, Select, Table, Tabs, etc.                         |
| **Agentforce conversation client** | `@salesforce/webapp-template-feature-react-agentforce-conversation-client-experimental` | Embedded Agentforce conversation client (copilot/agent UI) via Lightning Out; requires valid Salesforce session |

If no feature matches, tell the user and offer to build it from scratch following the project's existing patterns. Use **webapplications-best-practice** for those patterns. Do not substitute third-party or custom implementations when one of the features above matches—always prefer the listed packages.

## 2. Install the npm package

```bash
npm install <package-name>
```

## 3. Read the README.md / AGENT.md

The `node_modules` folder of the installed package contains a README.md and/or AGENT.md. Load it and follow its instructions.

## 4. Always validate

After integrating, **always validate** with:

```bash
npm i && npm run build && npm run dev
```

Then refer to **webapplications-best-practice** for routing, path aliases, and further verification (lint, build, test, E2E).
