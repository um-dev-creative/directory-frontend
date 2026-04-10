# Global Agent Configuration

## Project Identity

| Property | Value |
|---|---|
| **Project** | Directory Frontend (LatinHub) |
| **Version** | 0.0.1 |
| **Environment** | `qa-cloud` |
| **Node env** | `dev` |
| **Language** | TypeScript 5.7.3 strict |
| **Package manager** | pnpm 9.x |

## Agent Registry

| Agent | Path | GitHub Copilot Prompt |
|---|---|---|
| **Angular UI Developer** | `ai/agents/angular-ui/agent.md` | `#gen-angular-component` |
| **NgRx State Developer** | `ai/agents/ngrx/agent.md` | `#gen-ngrx-feature` |
| **BFF Developer** | `ai/agents/bff/agent.md` | `#gen-bff-route` |
| **Developer (General)** | `ai/agents/developer/agent.md` | Coordinates above |
| **Tester** | `ai/agents/tester/agent.md` | `#gen-unit-test` |
| **Product Manager** | `ai/agents/product-manager/agent.md` | Feature specs |
| **Product Owner** | `ai/agents/product-owner/agent.md` | Backlog + DoD |

## Sub-Agent Registry

| Sub-Agent | Parent | Path |
|---|---|---|
| Component Builder | Angular UI | `ai/agents/angular-ui/subagents/component-builder.md` |
| UI Library Builder | Angular UI | `ai/agents/angular-ui/subagents/ui-library-builder.md` |
| SSR Guard Checker | Angular UI | `ai/agents/angular-ui/subagents/ssr-guard-checker.md` |
| Feature Store Builder | NgRx | `ai/agents/ngrx/subagents/feature-store-builder.md` |
| Effects Builder | NgRx | `ai/agents/ngrx/subagents/effects-builder.md` |
| Selector Builder | NgRx | `ai/agents/ngrx/subagents/selector-builder.md` |
| Route Builder | BFF | `ai/agents/bff/subagents/route-builder.md` |
| Controller Builder | BFF | `ai/agents/bff/subagents/controller-builder.md` |
| Session Handler | BFF | `ai/agents/bff/subagents/session-handler.md` |

## Skill Registry

| Skill | Path |
|---|---|
| Angular code analysis | `ai/skills/code-analysis/angular-patterns.md` |
| NgRx code analysis | `ai/skills/code-analysis/ngrx-patterns.md` |
| BFF code analysis | `ai/skills/code-analysis/bff-patterns.md` |
| Angular unit tests | `ai/skills/test-generation/angular-unit-tests.md` |
| NgRx unit tests | `ai/skills/test-generation/ngrx-unit-tests.md` |
| Component documentation | `ai/skills/documentation/component-documentation.md` |
| API documentation | `ai/skills/documentation/api-documentation.md` |
| Feature requirement parsing | `ai/skills/requirement-parsing/feature-parsing.md` |
| User story parsing | `ai/skills/requirement-parsing/user-story-parsing.md` |

## Tool Registry

| Tool | Path |
|---|---|
| Angular CLI | `ai/tools/angular-cli.md` |
| NgRx Schematics | `ai/tools/ngrx-schematics.md` |
| BFF Route Builder | `ai/tools/bff-route-builder.md` |
| Code Reviewer | `ai/tools/code-reviewer.md` |

## Global Constraints (All Agents)

```
NEVER modify: ssl/, dist/, Dockerfile, docker-entrypoint.sh, server/config/app.config.js
NEVER expose: VAULT_TOKEN, ENCRYPT_KEY, ENCRYPT_IV, OAuth client secrets
NEVER use: NgModule, constructor injection, *ngIf/*ngFor, raw HttpClient
NEVER call: Java backends directly from Angular
ALWAYS: standalone: true, inject(), @if/@for, BFF-only HTTP, SSR guards
```

