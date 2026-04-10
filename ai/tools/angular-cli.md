# Tool: Angular CLI

## Purpose

Reference for Angular CLI commands used by Angular UI and NgRx agents for scaffolding, building, and testing.

## Commands

### Build

```bash
# Development build (verify compilation)
ng build --configuration development

# SSR production build
pnpm run build:ssr

# Watch mode (dev)
pnpm run watch:ssr
```

### Test

```bash
# Standard CI test (always use this)
ng test --code-coverage --no-watch --browsers ChromeHeadlessNoSandbox

# Interactive (local only)
pnpm run test:browser
```

### Generate (scaffolding — then manually fix to follow conventions)

```bash
# Component (then: add standalone:true, replace constructor, add @if/@for)
ng generate component features/{feature}/{name}

# Service (then: replace constructor with inject())
ng generate service core/services/{name}

# Guard
ng generate guard core/guards/{name}
```

> ⚠️ Always manually update generated code to follow project conventions before committing.

## TypeScript Check

```bash
npx tsc --noEmit --project tsconfig.app.json
```

## Lint (if configured)

```bash
ng lint
```

## Dependency Audit (required before PR with dep changes)

```bash
npm audit --audit-level=high
```

## Path Alias Configuration (`tsconfig.json`)

```json
{
  "compilerOptions": {
    "paths": {
      "@app/*": ["src/app/*"],
      "@core/*": ["src/app/core/*"],
      "@shared/*": ["src/app/shared/*"],
      "@env/*": ["src/environments/*"]
    }
  }
}
```

