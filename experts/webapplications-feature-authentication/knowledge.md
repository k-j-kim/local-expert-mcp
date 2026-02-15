---
topic: webapplications-feature-authentication
description: Authentication — login, register, password reset, protected routes
---

# Authentication (webapplications)

**Also search** the project's rules and skills folders (e.g. `.cursor/rules/`, `.cursor/skills*/`, or project-specific rules) for relevant guidance when implementing.

**Package:** `@salesforce/webapp-template-feature-react-authentication-experimental`

Login, register, password reset, and protected routes.

**To add this feature:** Use **webapplications-feature-adding-features** (install package, copy-then-adjust, read README/AGENT.md from the package). Then apply **webapplications-best-practice** for routes, path aliases, auth config (`ROUTES` from `@/utils/authenticationConfig`), and verification.

**Integration:** After `npm install`, copy from `node_modules/@salesforce/webapp-template-feature-react-authentication-experimental` per the package's README/AGENT.md; fix imports to use `@/` and align with AppLayout and route guards (PrivateRoute, AuthenticationRoute).
