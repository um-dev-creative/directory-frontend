# AI Agent System — Directory Frontend

> Extended agent definitions, skills, tools, and configuration for the Directory Frontend project.
>
> **How this folder is used by GitHub Copilot:**
> GitHub Copilot does NOT read this folder automatically.
> The actual Copilot integration lives in **`.github/`**:
> - `.github/copilot-instructions.md` → loaded automatically on every Copilot request
> - `.github/prompts/*.prompt.md` → invokable agents via `#` in Copilot Chat
>
> The files in `ai/` are referenced **from** those prompt files so that when Copilot
> accesses the codebase (`tools: [codebase]`), it can read the detailed agent definitions.
> Think of `ai/` as the **knowledge base** and `.github/` as the **entry points**.

```
.github/
├── copilot-instructions.md     ← Copilot reads this AUTOMATICALLY (global rules)
└── prompts/
    ├── gen-angular-component.prompt.md  ← #gen-angular-component → reads ai/agents/angular-ui/
    ├── gen-ngrx-feature.prompt.md       ← #gen-ngrx-feature      → reads ai/agents/ngrx/
    ├── gen-bff-route.prompt.md          ← #gen-bff-route          → reads ai/agents/bff/
    ├── gen-unit-test.prompt.md          ← #gen-unit-test          → reads ai/agents/tester/
    └── review-code.prompt.md            ← #review-code            → reads ai/skills/code-analysis/

ai/                             ← Knowledge base (referenced by prompts above)
├── agents/                     ← Detailed agent + sub-agent definitions
├── skills/                     ← Reusable pattern libraries
├── tools/                      ← Command references
├── config/                     ← Global rules, env constraints, security policy
└── utilities/                  ← Helper references (JWT, DFC constants)
```

---

## Quick Start with GitHub Copilot

Use these prompts in Copilot Chat (`Ctrl+I` / `Cmd+I`):

| Prompt | Action |
|---|---|
| `#gen-angular-component` | Generate a standalone Angular component |
| `#gen-ngrx-feature` | Generate a complete NgRx feature store |
| `#gen-bff-route` | Generate a BFF Express route + controller |
| `#gen-unit-test` | Generate unit tests for a file |
| `#review-code` | Review code for convention compliance |

Prompt files are in `.github/prompts/`.

---

## Agent Architecture

```
ai/
├── agents/
│   ├── angular-ui/         ← Angular 20 UI Developer Agent
│   │   ├── agent.md
│   │   └── subagents/
│   │       ├── component-builder.md
│   │       ├── ui-library-builder.md
│   │       └── ssr-guard-checker.md
│   │
│   ├── ngrx/               ← NgRx 20 State Developer Agent
│   │   ├── agent.md
│   │   └── subagents/
│   │       ├── feature-store-builder.md
│   │       ├── effects-builder.md
│   │       └── selector-builder.md
│   │
│   ├── bff/                ← Express.js BFF Developer Agent
│   │   ├── agent.md
│   │   └── subagents/
│   │       ├── route-builder.md
│   │       ├── controller-builder.md
│   │       └── session-handler.md
│   │
│   ├── developer/          ← General Developer Agent (coordinates above)
│   │   └── agent.md
│   │
│   ├── tester/             ← Unit Test Generator Agent
│   │   └── agent.md
│   │
│   ├── product-manager/    ← Feature Specification Agent
│   │   └── agent.md
│   │
│   └── product-owner/      ← Backlog + DoD Agent
│       └── agent.md
│
├── skills/
│   ├── code-analysis/
│   │   ├── angular-patterns.md
│   │   ├── ngrx-patterns.md
│   │   └── bff-patterns.md
│   ├── test-generation/
│   │   ├── angular-unit-tests.md
│   │   └── ngrx-unit-tests.md
│   ├── documentation/
│   │   ├── component-documentation.md
│   │   └── api-documentation.md
│   └── requirement-parsing/
│       ├── feature-parsing.md
│       └── user-story-parsing.md
│
├── tools/
│   ├── angular-cli.md
│   ├── ngrx-schematics.md
│   ├── bff-route-builder.md
│   └── code-reviewer.md
│
├── config/
│   ├── global-config.md        ← Agent registry + global constraints
│   ├── env-constraints.md      ← .env rules and allowed operations
│   └── security-policy.md      ← Tiered security rules
│
└── utilities/
    ├── token-decoder.md        ← JWT decode patterns
    └── dfc-constants-reference.md  ← DFC URL constants
```

---

## Agent Selection Guide

| I need to... | Use this agent |
|---|---|
| Create an Angular page or component | `angular-ui/agent.md` |
| Extend the UI component library | `angular-ui/subagents/ui-library-builder.md` |
| Check SSR safety of a component | `angular-ui/subagents/ssr-guard-checker.md` |
| Create a new NgRx feature store | `ngrx/agent.md` |
| Add async effects for a feature | `ngrx/subagents/effects-builder.md` |
| Add derived/computed state | `ngrx/subagents/selector-builder.md` |
| Add a new BFF API endpoint | `bff/agent.md` |
| Implement session management logic | `bff/subagents/session-handler.md` |
| Write unit tests | `tester/agent.md` |
| Implement a complete feature | `developer/agent.md` |
| Define acceptance criteria | `product-manager/agent.md` |
| Validate a feature is "Done" | `product-owner/agent.md` |

---

## Non-Negotiable Global Rules

1. `standalone: true` — all Angular components, no NgModule
2. `inject()` — dependency injection function, never constructor
3. `@if` / `@for` — new control flow, never `*ngIf`/`*ngFor`
4. `HttpService` only — never raw `HttpClient`
5. BFF-first — Angular never calls Java backends
6. `isPlatformBrowser()` — all browser API access guarded
7. No secrets — `VAULT_TOKEN`, `ENCRYPT_KEY`, `ENCRYPT_IV` never in code
8. Protected files — `app.config.js`, `ssl/`, `dist/`, `Dockerfile` untouched

