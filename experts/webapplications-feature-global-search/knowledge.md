---
topic: webapplications-feature-global-search
description: Global search — search Salesforce objects with filters and pagination; REST keyword search
---

# Global search (webapplications)

**Also search** the project's rules and skills folders (e.g. `.cursor/rules/`, `.cursor/skills*/`, or project-specific rules) for relevant guidance when implementing.

**Package:** `@salesforce/webapp-template-feature-react-global-search-experimental`

Search Salesforce objects with filters and pagination.

**To add this feature:** Use **webapplications-feature-adding-features** (install package, copy-then-adjust, read README/AGENT.md from the package). Then apply **webapplications-best-practice** for routes, path aliases, and verification.

**Integration:** After `npm install`, copy from `node_modules/@salesforce/webapp-template-feature-react-global-search-experimental` per the package's README/AGENT.md; fix imports to use `@/` and align with app layout and routes.

---

## REST keyword search (non-GraphQL list search)

You can use the **REST keyword search** endpoint for list/search results instead of GraphQL. Object **detail** can still use GraphQL (e.g. single record by id).

**Endpoint:** `POST /search/results/keyword` (via `uiApiClient` from `@salesforce/webapp-experimental/api`).

**Query string (required):**

- `q` — search query. **Required.** Must be **between 2 and 999 characters**. Empty or 1-character values (e.g. `""`, `"*"`) will return `INVALID_SEARCH` ("The 'q' must be between 2 and 999 characters."). For "show all" or no user input, send a placeholder of length ≥ 2 (e.g. `"all"` or `"**"`).
- `objectApiName` — object to search (e.g. `Property_Listing__c`).

**Body (JSON):**

- `filters` — array (e.g. `[]`).
- `pageSize` — number (e.g. 20).
- `pageToken` — string (e.g. `"0"` for first page; use server-returned tokens for next/previous).
- `sortBy` — string (e.g. `""`).

Optionally include `q` in the body as well if the backend reads it from there.

**Response:** Parse `keywordSearchResult` from the JSON response; it contains `records`, `nextPageToken`, `previousPageToken`, etc. Record shape matches **SearchResultRecord** (e.g. from feature `@/types/search/searchResults`).

**When to use REST vs GraphQL:**

- **List/search:** REST keyword search (`/search/results/keyword`) or GraphQL list query are both valid; REST avoids GraphQL schema/cursor handling for simple list UIs.
- **Single-record detail:** GraphQL (or record API) is often used for full field set and related data; keep using **webapplications-feature-graphql** or record fetch for detail pages.
