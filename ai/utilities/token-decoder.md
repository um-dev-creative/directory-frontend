# Utility: Token Decoder

## Purpose

Helper patterns for decoding JWT tokens in Angular (browser-safe, no signature verification).

## Angular JWT Decode Pattern

```typescript
// src/app/shared/pipes/backbone-jwt.pipe.ts usage:
// The pipe decodes Backbone JWTs to extract user fields

// Manual decode pattern (for reference):
private decodeJwt(token: string): Record<string, unknown> | null {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}
```

## Backbone JWT Fields

```typescript
interface BackboneJwtPayload {
  uid: string;       // User UUID — used as session key
  alias: string;     // User email alias
  email: string;     // User email
  firstname: string; // First name
  lastname: string;  // Last name
  exp: number;       // Expiration timestamp (Unix seconds)
}
```

## Directory Backend JWT Fields

```typescript
interface DirectoryJwtPayload {
  uid: string;           // User UUID
  vcCompleted: string;   // "true" if email verified
  exp: number;           // Expiration timestamp
}
```

## TTL Calculation from JWT

```typescript
// Calculate session TTL in milliseconds
const expiresAt = (decoded.exp as number) * 1000;  // Convert to ms
const ttlMs = expiresAt - Date.now();
const isValid = ttlMs > 0;
```

## BFF JWT Decode (Node.js)

```javascript
const jwt = require('jsonwebtoken');

// NEVER use jwt.verify() — BFF only decodes
const decoded = jwt.decode(token);
const userId = decoded?.uid;
const expiresAt = decoded?.exp * 1000;
```

