# Skill: API / BFF Endpoint Documentation

## Purpose

Generate and maintain structured documentation for BFF endpoints and their corresponding Angular service methods.

## When to Use

- Documenting a new BFF endpoint
- Updating endpoint documentation after changes
- Creating API reference guides

## BFF Endpoint Documentation Template

```markdown
## Endpoint: {METHOD} {Angular path}

**Controller:** `server/controller/{resource}.controller.js`
**Route:** `server/routes/{resource}.routes.js`
**Auth Required:** Yes / No
**Downstream:** Directory Backend / Backbone API
**Downstream URL:** `{METHOD} {downstream path}`

### Request

**Headers:**
| Header | Required | Description |
|---|---|---|
| `session-token` | ✅ | Directory Backend session JWT |
| `session-token-bkd` | ✅ | Backbone session JWT |
| `Authorization` | ✅ | Bearer token (added by BFF) |

**Query Parameters:**
| Param | Type | Required | Description |
|---|---|---|---|
| `page` | `number` | ❌ | Page number for pagination |
| `size` | `number` | ❌ | Items per page |

**Request Body (POST/PUT/PATCH):**
\`\`\`json
{
  "field": "type — description"
}
\`\`\`

### Response

**Success (200 / 201):**
\`\`\`json
{
  "id": "string",
  "name": "string"
}
\`\`\`

**Error Responses:**
| Status | Meaning |
|---|---|
| 400 | Invalid API request (URL domain validation failed) |
| 401 | Unauthorized (no valid session) |
| 404 | Resource not found |
| 500 | Internal server error |

### Angular Service Method

\`\`\`typescript
// In {resource}.service.ts
{methodName}(data: {Type}): Observable<{ReturnType}> {
  return this.http.{verb}<{ReturnType}>(
    \`\${DFC.RelativePath.{RESOURCE}_PATH}\`,
    data
  );
}
\`\`\`

### Security Notes
- URL validated against domain allowlist before proxying
- OAuth token acquired from `getDirectorySessionToken()` or `getBearerToken()` (Redis-cached)
- No internal service URLs exposed in response
- No secrets in response body
```

## NgRx Store Documentation Template

```markdown
## {Feature} Store

**Path:** `src/app/core/store/{feature}/`
**Feature key:** `'{feature}'`

### State Shape
\`\`\`typescript
interface {Feature}State {
  items:        {Feature}Model[];
  selectedItem: {Feature}Model | null;
  loading:      boolean;
  saving:       boolean;
  error:        string | null;
}
\`\`\`

### Actions
| Action | Type | Props |
|---|---|---|
| `load{Feature}s` | `[{Feature}] Load {feature}s` | none |
| `load{Feature}sSuccess` | `[{Feature}] Load {feature}s success` | `{ items: {Feature}Model[] }` |
| `load{Feature}sFailure` | `[{Feature}] Load {feature}s failure` | `{ error: string }` |
| `create{Feature}` | `[{Feature}] Create {feature}` | `{ data: Partial<{Feature}Model> }` |

### Selectors
| Selector | Returns |
|---|---|
| `selectAll{Feature}s` | `{Feature}Model[]` |
| `select{Feature}Loading` | `boolean` |
| `select{Feature}Error` | `string \| null` |
| `selectHas{Feature}s` | `boolean` |

### Usage via StoreService
\`\`\`typescript
private readonly {feature}Store = inject({Feature}StoreService);
readonly items$ = this.{feature}Store.items$;
ngOnInit() { this.{feature}Store.load(); }
\`\`\`
```

## Documentation File Placement

| Type | Location |
|---|---|
| API reference | `docs/api/{resource}.md` |
| Architecture | `docs/architecture/` |
| Store documentation | `docs/stores/{feature}.md` |

