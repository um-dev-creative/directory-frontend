# Skill: Feature Requirement Parsing

## Purpose

Parse business requirements or user stories into structured technical specifications consumable by the Angular UI, NgRx, BFF, and Tester agents.

## When to Use

- Translating a business requirement into implementable tasks
- Breaking down a feature request into layer-specific work items
- Creating a technical specification from a product description

## Input Formats Accepted

1. Free-form feature description
2. User story format: "As a [user], I want [goal] so that [benefit]"
3. Ticket/issue description
4. Design mockup description

## Parsing Output Schema

```
PARSED FEATURE: {Feature Name}

PRIORITY: High / Medium / Low
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
  - Reuses: {existing UI components from @app/components/ui/}

AUTH REQUIREMENTS:
  - Guard: authGuard / noAuthGuard / roleGuard('{role}')

SECURITY NOTES:
  - {Any security considerations}

AGENT TASK BREAKDOWN:
  1. BFF Agent: Create /drb/api/v1/{resource} route + controller
  2. NgRx Agent: Create {feature} feature store (6 files)
  3. Angular UI Agent: Create {Feature}Component
  4. Tester Agent: Write specs for all layers
  5. Documenter Agent: Generate API + component docs
  6. Reviewer Agent: Review all changes
```

## Keyword-to-Task Mapping

| Keyword in Requirement | Implied Tasks |
|---|---|
| "list", "display", "show", "view" | Load action + list component + GET endpoint |
| "add", "create", "register", "new" | Create action + form component + POST endpoint |
| "edit", "update", "modify", "change" | Update action + form component + PUT endpoint |
| "delete", "remove", "archive" | Delete action + confirmation modal + DELETE endpoint |
| "search", "filter", "find" | Query params + filter component + GET with params |
| "upload", "image", "avatar" | Multimedia endpoint + file input component |
| "profile", "account", "settings" | `authGuard` required |
| "public", "landing", "browse" | `noAuthGuard` or no guard |
| "admin", "partner", "manager" | `roleGuard` required |

## Acceptance Criteria Template

For every parsed feature, generate acceptance criteria across dimensions:

### UI / Rendering
```
GIVEN the user navigates to /{route}
WHEN the page loads
THEN the component renders without errors in both SSR and browser mode
AND loading skeleton is shown while data is fetching
AND error state is shown if HTTP call fails
AND empty state is shown if no data returned
```

### State Management
```
GIVEN the user performs {action}
WHEN the action is dispatched
THEN the NgRx store updates within 1 render cycle
AND the component reflects the new state
AND loading/error states are handled correctly
```

### API / BFF
```
GIVEN a valid authenticated request
WHEN the Angular service calls {BFF path}
THEN the BFF validates the downstream URL domain
AND proxies with OAuth Bearer token
AND returns the downstream response with original status code
AND never exposes internal URLs or secrets
```

### Security
```
GIVEN any request to a protected route
WHEN the user is not authenticated
THEN authGuard redirects to /auth
AND no API call is made

GIVEN any BFF controller receives a request
WHEN the computed upstream URL is outside the allowlist
THEN the BFF returns 400 without making any proxy call
```

## Story Decomposition Example

```
STORY: As a partner, I want to manage my offers list

TASKS:
1. [Model] Create OfferModel in src/app/shared/models/offer.model.ts
2. [DFC] Add OFFERS_PATH to DFC constants
3. [BFF] POST /drb/api/v1/offers → Create offer endpoint
4. [BFF] GET /drb/api/v1/offers → List offers endpoint
5. [BFF] PUT /drb/api/v1/offers/:id → Update offer endpoint
6. [BFF] DELETE /drb/api/v1/offers/:id → Delete offer endpoint
7. [NgRx] Create offers feature store (6 files)
8. [Angular] OffersListComponent (with loading/empty/error states)
9. [Angular] OfferFormComponent (create/edit)
10. [Angular] OfferDeleteDialogComponent (confirmation modal)
11. [Route] Add /offers route with authGuard
12. [Tests] Unit tests for all above
13. [Docs] API + component documentation
```

