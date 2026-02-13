---
topic: customTab
description: Knowledge for creating and adding features to webapplications
---

# 0. Adding a new feature to webapps

When the user asks to add a feature to their app, follow this workflow.


When adding a feature, integrating code from an npm package, or bringing in a reference implementation:

1. **Prefer copying over rewriting.** Use `cp` (or equivalent) to copy files from the source (e.g. `node_modules/<package>/dist/...` or a reference app) into this project. Do not retype or rewrite the same code by hand.

2. **Then adjust.** After copying, do minimal edits: fix import paths (e.g. change relative `../../` imports to the project’s path alias like `@/`), update any app-specific config, and remove or adapt anything that doesn’t apply.

3. **When to copy.** Copy when:
   - Installing a feature from a template/feature package (e.g. authentication, search, charts).
   - The package ships full source in `dist/` or `src/` that is meant to be integrated.
   - You would otherwise be recreating multiple files by reading a reference and typing them out.

4. **When rewriting is okay.** Only rewrite or create from scratch when:
   - The source is not file-based (e.g. only docs or snippets).
   - The integration is a thin wrapper or a single small file.
   - Copying would pull in a large, unrelated tree and the actual need is a small part of it.



## 1. Match the request to a feature

Available features (npm packages):


| Feature                | Package                                                                 | Description                                                            |
| ---------------------- | ----------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| **Authentication**     | `@salesforce/webapp-template-feature-react-authentication-experimental` | Login, register, password reset, protected routes                      |
| **Global search**      | `@salesforce/webapp-template-feature-react-global-search-experimental`  | Search Salesforce objects with filters and pagination                  |
| **Navigation menu**    | `@salesforce/webapp-template-feature-react-nav-menu-experimental`       | App layout with responsive navigation menu                             |
| **Analytics charts**   | `@salesforce/webapp-template-feature-react-chart-experimental`          | Recharts line/bar charts with theming (AnalyticsChart, ChartContainer) |
| **GraphQL data access**| `@salesforce/webapp-template-feature-graphql-experimental`              | executeGraphQL utilities, codegen tooling, and example AccountsTable   |
| **Shared UI (shadcn)** | `@salesforce/webapp-template-feature-react-shadcn-experimental`         | Button, Card, Input, Select, Table, Tabs, etc.                         |

If no feature matches, tell the user and offer to build it from scratch following the project's existing patterns.

## 2. Install the npm package

```bash
npm install <package-name>
```

## 3. Read the README.md/AGENT.md

The node_modules folder of the installed package contains as READMe.md/AGENT.md.

Load it into the memory and follow its instructions.