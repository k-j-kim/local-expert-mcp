---
topic: webapplications
description: Directory of webapplications sub-knowledges — call get_expert_knowledge with one of the sub-topic names below to load that knowledge.
---

# Web Applications — Directory

This is the **directory** of sub-knowledges for web applications (Salesforce React BYO, feature packages, copy-then-adjust workflow). **Call `get_expert_knowledge` again with one of the topic names below** to load the relevant knowledge.

## Sub-knowledges (use as `topic` in get_expert_knowledge)

| Topic name | Use when |
|------------|---------|
| **webapplications-feature-adding-features** | Adding a feature to a webapp, installing a feature package, copy-then-adjust workflow, feature table and npm install steps |
| **webapplications-best-practice** | Building or extending the React BYO app: routes, path aliases, Tailwind/shadcn, folder structure, components, build/test, verification checklist |
| **webapplications-feature-analytics-chart** | Analytics charts, Recharts, AnalyticsChart, ChartContainer |
| **webapplications-feature-global-search** | Global search, searching Salesforce objects with filters and pagination; REST keyword search, q 2–999 chars |
| **webapplications-feature-authentication** | Login, register, password reset, protected routes, auth |
| **webapplications-feature-nav-menu** | App layout, responsive navigation menu |
| **webapplications-feature-graphql** | GraphQL data access, executeGraphQL, codegen, AccountsTable; object detail (list search can use REST) |
| **webapplications-feature-shadcn** | Shared UI (shadcn): Button, Card, Input, Select, Table, Tabs, etc. |
| **webapplications-adding-map** | Adding a map: Leaflet, geocoding, markers, usePropertyMapMarkers, useGeocode |
| **webapplications-creating-records** | Creating Salesforce records: createRecord, custom/standard objects, id handling, Application__c, Lead |
| **webapplications-weather-widget** | Real weather widget: Open-Meteo (free, no key), useWeather hook, dashboard card, WMO codes |
| **webapplications-list-and-create-records** | List + create any custom object: GraphQL list, createRecord, hook with refetch, form picklists match object |

**Flow:** After reading this directory, call `get_expert_knowledge({ topic: "<sub-topic-name>" })` with the single sub-topic that best matches the user's request (e.g. `webapplications-best-practice`, `webapplications-feature-analytics-chart`, `webapplications-feature-adding-features`). Use **webapplications-feature-adding-features** when the user wants to add a feature; use **webapplications-best-practice** for app structure, routing, UI, and verification.

**Adding features:** Always prefer the feature packages listed in **webapplications-feature-adding-features** (auth, search, charts, nav, GraphQL, shadcn, Agentforce conversation client) over building from scratch or other solutions when one of them matches the request.
