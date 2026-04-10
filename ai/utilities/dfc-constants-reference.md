# Utility: DFC Constants Reference

## Purpose

Quick reference for `DFC` (DirectoryFrontendConst) constants used in Angular services and components to build BFF URLs.

## Path Reference

```typescript
import { DFC } from '@shared/constants/app.const';

// BFF base paths
DFC.RelativePath.DIRECTORY_BACKEND_BASE_URL  // '/drb/api/v1'
DFC.RelativePath.BACKBONE_BASE_URL           // 'bkd/api/v1'

// Auth
DFC.RelativePath.AUTH_PATH                   // '/auth'
DFC.RelativePath.VERIFY_CODE_PATH            // '/verify-code'

// General
DFC.RelativePath.GENERAL_PATH                // '/general'
DFC.RelativePath.BUSINESS_PATH               // '/businesses'
DFC.RelativePath.D_IMAGE_PATH                // '/d-image'
DFC.RelativePath.CATEGORY_PATH               // '/categories'
DFC.RelativePath.TIMEZONE_PATH               // '/timezones'

// HTTP Status
DFC.HttpStatus.HTTP_STATUS_UNAUTHORIZED      // { code: 401 }
DFC.HttpStatus.HTTP_STATUS_CREATED           // { code: 201 }

// Header builders
DFC.HttpHeader.STANDARD_TOKEN_BKD(token)     // HttpHeaders with session-token-bkd
DFC.HttpHeader.STANDARD_SESSION_HEADER(token, bearer)  // Auth + session headers
```

## Building API URLs

```typescript
// ✅ Correct pattern:
const url = `${DFC.RelativePath.DIRECTORY_BACKEND_BASE_URL}${DFC.RelativePath.BUSINESS_PATH}`;
// Result: '/drb/api/v1/businesses'

const byId = `${DFC.RelativePath.DIRECTORY_BACKEND_BASE_URL}${DFC.RelativePath.BUSINESS_PATH}/${id}`;
// Result: '/drb/api/v1/businesses/123'

// ❌ Forbidden — hardcoded URLs:
const url = '/drb/api/v1/businesses';         // Don't hardcode paths
const url = 'https://api.example.com/...';    // NEVER direct Java URLs
```

## Adding New Constants

When a new BFF route is created, add to `src/app/shared/constants/app.const.ts`:

```typescript
public static readonly RelativePath = {
  // ...existing constants...
  NEW_RESOURCE_PATH: '/new-resource'           // Add here
};
```

Then use in Angular service:
```typescript
this.http.get<NewResourceModel[]>(
  `${DFC.RelativePath.DIRECTORY_BACKEND_BASE_URL}${DFC.RelativePath.NEW_RESOURCE_PATH}`
);
```

