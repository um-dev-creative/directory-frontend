# Skill: Feature Requirement Parsing

## Purpose

Parse business requirements or user stories into structured technical specifications consumable by the Angular UI, NgRx, and BFF agents.

## Input Formats Accepted

1. Free-form feature description
2. User story format: "As a [user], I want [goal] so that [benefit]"
3. Ticket/issue description
4. Design mockup description

## Parsing Output Schema

```
PARSED FEATURE: {Feature Name}

LAYERS AFFECTED:
  - [ ] Angular UI  (components needed?)
  - [ ] NgRx Store  (state changes needed?)
  - [ ] BFF Layer   (new endpoints needed?)

DOMAIN ENTITIES:
  - {Entity}: {properties list}

BFF ENDPOINTS:
  - {METHOD} /drb/api/v1/{resource} → {downstream path}

ANGULAR ROUTES:
  - /{path} → {FeatureComponent} (auth: yes/no)

NGRX ACTIONS:
  - [{Feature}] Load {resource}s
  - [{Feature}] Create {resource}
  - [{Feature}] Update {resource}
  - [{Feature}] Delete {resource}

UI COMPONENTS:
  - {ComponentName}: {purpose}
  - Reuses: {existing UI components}

AUTH REQUIREMENTS:
  - Guard: authGuard / noAuthGuard / roleGuard('{role}')

SECURITY NOTES:
  - {Any security considerations}

AGENT TASKS:
  1. BFF Agent: Create /drb/api/v1/{resource} route
  2. NgRx Agent: Create {feature} feature store
  3. Angular UI Agent: Create {Feature}Component
  4. Tester Agent: Write specs for all above
```

## Parsing Rules

- If the requirement mentions "list", "display", "show" → needs Load action + list component
- If it mentions "add", "create", "register" → needs Create action + form component
- If it mentions "edit", "update", "modify" → needs Update action + form component
- If it mentions "delete", "remove" → needs Delete action + confirmation modal
- If it mentions "profile", "account", "settings" → needs `authGuard`
- If it mentions "public", "landing", "browse" → uses `noAuthGuard` or no guard
- If it mentions "admin", "partner", "manager" → check `roleGuard` requirements

