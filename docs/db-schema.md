# Database Schema — Directory Site

Esquema de base de datos del backend Java. Sirve como referencia para construir modelos TypeScript, DTOs y lógica de validación en el frontend/BFF.

---

## Schemas

| Color | Schema |
|-------|--------|
| Azul  | Directory Site |
| Naranja | General |

---

## Table Overview

### contact_type *(General)*

Tipos de contacto disponibles (email, teléfono, etc.).

| Atributo | Tipo | Descripción |
|----------|------|-------------|
| id | uuid | Identificador único |
| name | varchar(20) | Nombre del tipo |
| description | varchar(250) | Descripción |
| active | bool | Indica si está activo |

---

### contact *(General)*

Datos de contacto de una persona, vinculados a un `contact_type`.

| Atributo | Tipo | Descripción |
|----------|------|-------------|
| id | uuid | Identificador único |
| content | varchar(250) | Valor del contacto (ej. email, teléfono) |
| contact_type_id | uuid | FK → `contact_type.id` |
| person_id | uuid | FK → `person.id` |
| active | bool | Indica si está activo |

---

### person *(General)*

Información demográfica de una persona.

| Atributo | Tipo | Descripción |
|----------|------|-------------|
| id | uuid | Identificador único |
| first_name | varchar(20) | Nombre |
| middle_name | varchar(20) | Segundo nombre |
| last_name | varchar(20) | Apellido |
| gender | char(1) | Género (`M`, `F`, etc.) |
| birthdate | date | Fecha de nacimiento |

---

### user *(General)*

Usuarios del sistema. Vinculado a `person` y a los negocios que posee.

| Atributo | Tipo | Descripción |
|----------|------|-------------|
| id | uuid | Identificador único |
| alias | varchar(12) | Nombre de usuario / alias |
| password | varchar(250) | Contraseña encriptada |
| active | bool | Indica si está activo |
| person_id | uuid | FK → `person.id` |
| created_date | timestamp(6) | Fecha de creación |
| last_update | timestamp(6) | Última actualización |
| email_account | varchar(255) | Email asociado |
| display_name | varchar(50) | Nombre visible |
| notification_email_active | bool | Notificaciones por email activas |
| notification_sms_active | bool | Notificaciones por SMS activas |
| privacy_data_out_active | bool | Opt-out de privacidad de datos |

---

### feature *(General)*

Funcionalidades o módulos del sistema disponibles para roles.

| Atributo | Tipo | Descripción |
|----------|------|-------------|
| id | uuid | Identificador único |
| name | varchar(20) | Nombre de la feature |
| description | varchar(250) | Descripción |
| active | bool | Indica si está activa |

---

### role *(General)*

Roles del sistema (administrador, cliente, partner, etc.).

| Atributo | Tipo | Descripción |
|----------|------|-------------|
| id | uuid | Identificador único |
| name | varchar(20) | Nombre del rol |
| description | varchar(250) | Descripción |
| active | bool | Indica si está activo |

---

### role_feature *(General)*

Relación N:M entre roles y features (control de acceso basado en roles).

| Atributo | Tipo | Descripción |
|----------|------|-------------|
| role_id | uuid | FK → `role.id` |
| feature_id | uuid | FK → `feature.id` |
| active | bool | Indica si la asociación está activa |

---

### application_role_user *(General)*

Vincula usuarios con roles en una aplicación específica.

| Atributo | Tipo | Descripción |
|----------|------|-------------|
| user_id | uuid | FK → `user.id` |
| role_id | uuid | FK → `role.id` |
| application_id | uuid | ID de la aplicación |
| active | bool | Indica si la asociación está activa |

---

### business *(Directory Site)*

Negocios u organizaciones registradas. El campo `user_fk` identifica al dueño.

| Atributo | Tipo | Descripción |
|----------|------|-------------|
| id | uuid | Identificador único |
| name | varchar(255) | Nombre del negocio |
| description | varchar(1500) | Descripción |
| created_date | date | Fecha de creación |
| last_update | date | Última actualización |
| category_fk | uuid | FK → `category.id` |
| user_fk | uuid | FK → `user.id` (dueño del negocio) |

> **Nota para el frontend**: No existe columna `slug` en la tabla. El identificador en rutas (`/partner/:id`) es el UUID. El DTO de respuesta del backend expone este campo como `userId` (`BusinessDetailResponse.userId`).

---

### product *(Directory Site)*

Productos ofrecidos por negocios.

| Atributo | Tipo | Descripción |
|----------|------|-------------|
| id | uuid | Identificador único |
| name | varchar(255) | Nombre del producto |
| description | varchar(1500) | Descripción |
| created_date | date | Fecha de creación |
| last_update | date | Última actualización |
| active | bool | Indica si está activo |
| category_fk | uuid | FK → `category.id` |

---

### business_product *(Directory Site)*

Relación N:M entre negocios y productos.

| Atributo | Tipo | Descripción |
|----------|------|-------------|
| business_id | uuid | FK → `business.id` |
| product_id | uuid | FK → `product.id` |
| created_date | timestamp | Fecha de creación de la asociación |
| last_update | timestamp | Última actualización |
| active | bool | Indica si la asociación está activa |

---

### campaign *(Directory Site)*

Campañas de marketing asociadas a un negocio.

| Atributo | Tipo | Descripción |
|----------|------|-------------|
| id | uuid | Identificador único |
| name | varchar(120) | Nombre de la campaña |
| description | varchar(1200) | Descripción |
| start_date | timestamp(6) | Inicio de la campaña |
| end_date | timestamp(6) | Fin de la campaña |
| created_date | timestamp | Fecha de creación |
| last_update | timestamp | Última actualización |
| category_fk | uuid | FK → `category.id` |
| business_fk | uuid | FK → `business.id` |
| active | bool | Indica si está activa |

---

### category *(Directory Site)*

Categorías jerárquicas para productos, campañas y negocios.

| Atributo | Tipo | Descripción |
|----------|------|-------------|
| id | uuid | Identificador único |
| name | varchar(255) | Nombre |
| description | varchar(1200) | Descripción |
| category_parent_fk | uuid | FK → `category.id` (categoría padre; null = raíz) |
| created_date | timestamp(6) | Fecha de creación |
| last_update | timestamp(6) | Última actualización |
| active | bool | Indica si está activa |

---

## Relaciones clave

```
user (1) ──────────── (N) business           [user_fk]
business (1) ──────── (N) campaign            [business_fk]
business (N) ──────── (N) product             [business_product]
business (N) ──────── (1) category            [category_fk]
campaign (N) ──────── (1) category            [category_fk]
product (N) ───────── (1) category            [category_fk]
category (N) ──────── (1) category            [category_parent_fk] (self-referential)
person (1) ─────────── (1) user               [person_id]
person (1) ─────────── (N) contact            [person_id]
contact (N) ─────────── (1) contact_type      [contact_type_id]
role (N) ──────────── (N) feature             [role_feature]
user (N) ──────────── (N) role                [application_role_user]
```

---

## Modelos TypeScript correspondientes

Los modelos viven en `src/app/shared/models/`:

| Tabla DB | Archivo TypeScript |
|----------|--------------------|
| `business` | `business.model.ts` → `BusinessCreateRequest`, `BusinessDetailResponse`, `BusinessUpdateRequest` |
| `campaign` | `campaign.model.ts` → `Campaign`, `CampaignCreateRequest` |
| `category` | (endpoint `/drb/api/v1/general/categories`) |
| `user` | `session.state.ts` → `UserAuth` |

---

## Paths de la API (BFF → Backend Java)

| Recurso | Path BFF |
|---------|----------|
| Businesses | `GET/POST /drb/api/v1/general/businesses` |
| Business por ID | `GET /drb/api/v1/general/businesses/:id` |
| Actualizar business | `PATCH /drb/api/v1/general/businesses/:id` |
| Campañas | `GET/POST /drb/api/v1/general/campaigns` |
| Campaña por ID | `GET/PATCH /drb/api/v1/general/campaigns/:id` |
| Categorías | `GET /drb/api/v1/general/categories` |
| Timezones | `GET /drb/api/v1/general/timezones` |
