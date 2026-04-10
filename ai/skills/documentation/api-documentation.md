# Skill: API Documentation

## Purpose

Generate and maintain documentation for BFF endpoints and their corresponding Angular service methods.

## BFF Endpoint Documentation Template

```markdown
## Endpoint: {METHOD} {path}

**Controller:** `server/controller/{resource}.controller.js`  
**Route:** `server/routes/{resource}.routes.js`  
**Auth Required:** Yes / No  
**Downstream:** Directory Backend / Backbone API

### Request

**Headers:**
| Header | Required | Description |
|---|---|---|
| `session-token` | ✅ | Directory Backend session JWT |
| `session-token-bkd` | ✅ | Backbone session JWT |
| `Authorization` | ✅ | Bearer token |

**Body:**
\`\`\`json
{
  "field": "type — description"
}
\`\`\`

### Response

**Success (200/201):**
\`\`\`json
{
  "id": "string",
  "name": "string"
}
\`\`\`

**Error Responses:**
| Status | Meaning |
|---|---|
| 400 | Invalid API request (domain validation failed) |
| 401 | Unauthorized (no valid session) |
| 500 | Internal server error |

### Angular Service Method

\`\`\`typescript
// In {resource}.service.ts
{methodName}(data: {Type}): Observable<{ReturnType}> {
  return this.http.{method}<{ReturnType}>(
    `${DFC.RelativePath.{RESOURCE}_PATH}`,
    data
  );
}
\`\`\`

### Security Notes
- URL validated against domain allowlist before proxying
- OAuth token from `getDirectorySessionToken()` (Redis-cached)
- No secrets in response body
```

