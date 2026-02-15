---
topic: webapplications-list-and-create-records
description: List and create any custom object — GraphQL list, createRecord, hook with refetch, form picklists
---

# List and create records (webapplications)

**Also search** the project's rules and skills folders (e.g. `.cursor/rules/`, `.cursor/skills*/`) for relevant guidance when implementing.

Use this knowledge when building a **list view plus create form** for any Salesforce custom object (not tied to a specific object).

## Pattern

- **List:** Query the object via **GraphQL** (`executeGraphQL`, `uiapi.query.ObjectApiName__c`). Use **webapplications-feature-graphql** for the connection shape (first/after, edges.node, field `{ value, displayValue }`). Map nodes to a simple summary type; sort client-side by date or other field if needed.
- **Create:** Use **createRecord** from `@salesforce/webapp-experimental/api`. See **webapplications-creating-records** for required/optional fields and id handling.
- **Hook:** One hook that fetches the list on mount and exposes `refetch`. After a successful create, call `refetch()` so the list updates without a full page reload.
- **Form:** Collect only fields that exist on the object. For picklist fields, use option values that **match the object's value set** (e.g. from the object's field metadata or a known value set). Default required picklists (e.g. Status to "New", Priority to "Standard") when the object defines defaults.
- **UI:** Table or cards for the list; form above or on a separate route. Show loading and error states for both list and submit. Optional: dashboard widget showing a slice of the list (e.g. first N items) with a "See all" link.

## Structure (generic)

| Concern | Where |
|--------|--------|
| API: list + create | e.g. `src/api/<objectName>Api.ts` — query function (GraphQL) and create function (createRecord) |
| Hook: list + refetch | e.g. `src/hooks/use<ObjectName>List.ts` — returns `{ items, loading, error, refetch }` |
| Page | Form (controlled inputs, submit → create → refetch) and table/list of items |

## Cross-references

- **webapplications-feature-graphql** — How to query a custom object (connection, node shape, field value extraction).
- **webapplications-creating-records** — createRecord, id extraction, only send existing fields, picklist/required handling.
