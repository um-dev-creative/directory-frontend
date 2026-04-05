# Skill: Domain Model Generation

## Purpose

Generate TypeScript domain model interfaces following Directory Frontend conventions for use across Angular, NgRx, and BFF layers.

## When to Use

- Defining a new domain entity for a feature
- Creating request/response types for BFF communication
- Establishing shared types between components and stores

## Model Template

```typescript
// src/app/shared/models/{feature}.model.ts

export interface {Feature}Model {
  id:          string;
  name:        string;
  description?: string;
  status?:     '{Feature}Status';
  createdAt?:  string;
  updatedAt?:  string;
}
```

## Naming Conventions

| Entity | Interface name | File name |
|---|---|---|
| Partner | `PartnerModel` | `partner.model.ts` |
| Deal | `DealModel` | `deal.model.ts` |
| Community Member | `CommunityMemberModel` | `community-member.model.ts` |

## Common Patterns

### Enum/Union Types for Status

```typescript
export type {Feature}Status = 'active' | 'inactive' | 'pending' | 'archived';

export interface {Feature}Model {
  id:     string;
  status: {Feature}Status;
}
```

### Nested Models

```typescript
export interface AddressModel {
  street:  string;
  city:    string;
  state:   string;
  zipCode: string;
  country: string;
}

export interface PartnerModel {
  id:       string;
  name:     string;
  address:  AddressModel;
  contacts: ContactModel[];
}
```

### Request/Response Types

```typescript
// For BFF request payloads
export interface Create{Feature}Request {
  name:        string;
  description: string;
}

// For paginated responses
export interface PaginatedResponse<T> {
  items:      T[];
  totalCount: number;
  page:       number;
  pageSize:   number;
}
```

## File Placement

```
src/app/shared/models/{feature}.model.ts
```

## Rules

1. **Always** use `interface` over `class` for data models (no behavior)
2. **Always** suffix with `Model` (e.g., `PartnerModel`, not `Partner`)
3. **Always** use `string` for IDs (even if the backend uses numeric IDs)
4. **Always** place in `src/app/shared/models/`
5. **Always** export the interface for use across layers
6. **Optional** fields use `?` suffix (not `| undefined`)

