# Skill: User Story Parsing

## Purpose

Parse user stories into structured acceptance criteria and atomic technical tasks for the Directory Frontend project.

## When to Use

- Breaking user stories into testable acceptance criteria
- Decomposing stories into implementation tasks across layers
- Validating that a user story covers all necessary dimensions

## User Story Format

```
As a [user type],
I want to [action/goal],
so that [benefit/value].
```

## Acceptance Criteria Generation

For every user story, generate acceptance criteria across these dimensions:

### UI / Rendering

```
GIVEN the user navigates to /{route}
WHEN the page loads
THEN the component renders without errors in both SSR and browser mode
AND loading skeleton is shown while data is fetching
AND error state is shown if HTTP call fails
AND empty state is shown if no data returned
AND all visible text uses | translate or has // TODO: i18n comment
```

### State Management

```
GIVEN the user performs {action}
WHEN the action is dispatched via StoreService
THEN the NgRx store updates within 1 render cycle
AND the component reflects the new state via selector subscription
AND loading/saving states show appropriate UI feedback
AND error state displays user-friendly error message
```

### API / BFF

```
GIVEN a valid authenticated request
WHEN the Angular service calls {BFF path}
THEN the BFF validates the downstream URL against domain allowlist
AND acquires OAuth token from oauth-client.js or backbone-client.js
AND proxies with Bearer token to downstream service
AND returns the downstream response with original status code
AND never exposes internal URLs, secrets, or token values
```

### Security

```
GIVEN any request to a protected route
WHEN the user is not authenticated
THEN authGuard redirects to /auth with no API calls made

GIVEN any BFF controller receives a request
WHEN the computed upstream URL is outside the domain allowlist
THEN the BFF returns 400 without making any external call

GIVEN any file change
WHEN reviewing for security
THEN no VAULT_TOKEN, ENCRYPT_KEY, or ENCRYPT_IV appears in code
AND protected files (ssl/, dist/, Dockerfile, app.config.js) are untouched
```

### SSR Compatibility

```
GIVEN the component is rendered on the server
WHEN window/document/localStorage/sessionStorage is accessed
THEN the access is guarded with isPlatformBrowser()
AND the component renders without errors in SSR mode
```

## Story Decomposition Rules

Break user stories into atomic tasks following this order:

```
1. [Model]   → Domain model interface
2. [DFC]     → URL constant in DFC
3. [BFF]     → Controller + Route (per HTTP method)
4. [NgRx]    → Feature store (6 files) + registration
5. [Angular] → Components (list, form, detail, dialog)
6. [Route]   → App route with appropriate guard
7. [Tests]   → Specs for all layers
8. [Docs]    → API + component documentation
```

## Example Decomposition

```
STORY: As a community member, I want to view and edit my profile

TASKS:
 1. [Model]   → ProfileModel in src/app/shared/models/profile.model.ts
 2. [DFC]     → PROFILE_PATH = '/drb/api/v1/profile' in app.const.ts
 3. [BFF]     → GET /drb/api/v1/profile — fetch current profile
 4. [BFF]     → PUT /drb/api/v1/profile — update current profile
 5. [NgRx]    → Profile feature store (state, actions, reducer, effects, selectors, StoreService)
 6. [NgRx]    → Register in app.config.ts
 7. [Angular] → ProfileViewComponent — display profile data
 8. [Angular] → ProfileEditComponent — edit form with validation
 9. [Route]   → /profile route with authGuard, lazy-loaded
10. [Tests]   → Component, service, reducer, effects, selector specs
11. [Docs]    → API endpoint + component documentation

ACCEPTANCE CRITERIA:
 - GIVEN authenticated user, WHEN navigating to /profile, THEN profile data loads
 - GIVEN profile is loading, THEN skeleton placeholder is shown
 - GIVEN user clicks Edit, THEN edit form appears with pre-filled data
 - GIVEN user submits valid form, THEN profile updates and success notification shows
 - GIVEN user submits invalid form, THEN validation errors display inline
 - GIVEN SSR render, THEN no browser API errors
```

## Priority Classification

| Keyword | Priority |
|---|---|
| "critical", "urgent", "blocker" | High |
| "important", "should", "needed" | Medium |
| "nice to have", "could", "optional" | Low |

