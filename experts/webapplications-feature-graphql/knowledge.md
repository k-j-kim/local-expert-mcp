---
topic: webapplications-feature-graphql
description: GraphQL data access — executeGraphQL, codegen, AccountsTable
---

# GraphQL data access (webapplications)

**Also search** the project's rules and skills folders (e.g. `.cursor/rules/`, `.cursor/skills*/`, or project-specific rules) for relevant guidance when implementing.

**Package:** `@salesforce/webapp-template-feature-graphql-experimental`

executeGraphQL utilities, codegen tooling, and example AccountsTable.

**To add this feature:** Use **webapplications-feature-adding-features** (install package, copy-then-adjust, read README/AGENT.md from the package). Then apply **webapplications-best-practice** for routes, path aliases, and verification.

**Integration:** After `npm install`, copy from `node_modules/@salesforce/webapp-template-feature-graphql-experimental` per the package's README/AGENT.md; fix imports to use `@/` and `@api/`; place API/GraphQL types under `src/api/` as needed.

---

## Listing a custom object (generic)

To **list** any custom object (e.g. for a list page or dashboard):

- Use **executeGraphQL** with a query like `uiapi.query.ObjectApiName__c(first: $first, after: $after)`.
- The connection returns **edges**; each **edge** has a **node**. The node has `Id`, `ApiName`, and each requested field as `{ value, displayValue }` (UI API shape).
- **Variables:** `first` (Int), `after` (String, optional). Pass `after: null` for the first page.
- **Extract values:** For each field, read `node.FieldApiName__c.value` (or `displayValue` for display). Handle null/undefined.
- **Sorting:** If the API supports `orderBy` (e.g. `ObjectName__c_OrderBy`), use it; otherwise sort the result array in JavaScript (e.g. by date descending).
- **Type the response:** Define an interface for the query response (e.g. `uiapi.query.ObjectName__c.edges[].node`) and map nodes to a simple app type (id, name, field1, field2, …) for the UI.
- For **create** of the same object, use **webapplications-creating-records** (createRecord). For a full list+create flow, see **webapplications-list-and-create-records**.
