---
topic: customTab
description: Knowledge for creating and adding features to webapplications
---

# Adding a new feature to webapps

When the user asks to add a feature to their app, follow this workflow.

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