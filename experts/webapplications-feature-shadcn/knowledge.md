---
topic: webapplications-feature-shadcn
description: Shared UI (shadcn) — Button, Card, Input, Select, Table, Tabs, etc.
---

# Shared UI — shadcn (webapplications)

**Also search** the project's rules and skills folders (e.g. `.cursor/rules/`, `.cursor/skills*/`, or project-specific rules) for relevant guidance when implementing.

**Package:** `@salesforce/webapp-template-feature-react-shadcn-experimental`

Button, Card, Input, Select, Table, Tabs, and other shadcn-style components.

**To add this feature:** Use **webapplications-feature-adding-features** (install package, copy-then-adjust, read README/AGENT.md from the package). Then apply **webapplications-best-practice** for path aliases, `components/ui` barrel (`src/components/ui/index.ts`), and design tokens in `src/styles/global.css`.

**Integration:** After `npm install`, copy from `node_modules/@salesforce/webapp-template-feature-react-shadcn-experimental` per the package's README/AGENT.md; add components under `src/components/ui/` and export from `src/components/ui/index.ts`; use `cn()` and CVA for variants.
