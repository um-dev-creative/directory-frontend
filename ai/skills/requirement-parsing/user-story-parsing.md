# Skill: User Story Parsing

## Purpose

Parse user stories into acceptance criteria and technical tasks for the Directory Frontend project.

## Acceptance Criteria Template

For every user story, generate acceptance criteria across these dimensions:

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
THEN the BFF validates the downstream URL
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

## Story Decomposition

Break user stories into atomic tasks:

```markdown
STORY: As a partner, I want to manage my offers list

TASKS:
1. [BFF] POST /drb/api/v1/offers → Create offer endpoint
2. [BFF] GET /drb/api/v1/offers → List offers endpoint
3. [BFF] PUT /drb/api/v1/offers/:id → Update offer endpoint
4. [BFF] DELETE /drb/api/v1/offers/:id → Delete offer endpoint
5. [NgRx] Create offers feature store (6 files)
6. [Angular] OffersListComponent (with loading/empty/error states)
7. [Angular] OfferFormComponent (create/edit)
8. [Angular] OfferDeleteDialogComponent (confirmation modal)
9. [Tests] Unit tests for all above
```

