# Directory Frontend

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.0.5.

## Quality Gate Status
[![Quality gate](https://sonarcloud.io/api/project_badges/quality_gate?project=lanmata_directory-frontend)](https://sonarcloud.io/summary/new_code?id=lanmata_directory-frontend)

## Knowledge Base
[Official Documentation](https://prx.myjetbrains.com/articles/DS-A-1/Directory-Frontend)

## 📚 Documentation

### Component Library & Design System
Our comprehensive UI component library and design system documentation is available in the [`docs/`](./docs/) directory:

- **[📖 Complete Documentation](./docs/README.md)** - Overview and quick start guide
- **[🎨 Brand & Design System](./docs/guides/)** - Color palette and design guidelines  
- **[🧩 Component Guides](./docs/components/)** - Detailed implementation guides for all UI components

### Available Components
- ✅ **Button** - Multiple variants, sizes, and states
- ✅ **Input** - Form inputs with validation and reactive forms support
- ✅ **Badge** - Status indicators and labels
- ✅ **Card** - Content containers with various layouts
- ✅ **Modal** - Dialog and overlay components
- ✅ **Skeleton** - Loading placeholders and states

### Quick Start - UI Components
```typescript
import { 
  ButtonComponent, 
  InputComponent, 
  SkeletonComponent 
} from './app/components/ui';
```

```html
<app-button variant="primary" size="md">
  Click me
</app-button>

<app-input 
  type="email" 
  placeholder="Enter email"
  [required]="true">
</app-input>

<app-skeleton 
  variant="card" 
  [loading]="isLoading">
</app-skeleton>
```

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

Quick test run (unit tests):

```powershell
# from repository root
npm ci; npm test
```

```
# Notes:
# - Tests use Karma/Jasmine as configured in package.json.
# - If running in CI/container, ensure ChromeHeadlessNoSandbox is available or adjust Karma config.
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Backend API: Campaigns

This frontend integrates with the directory-backend campaigns endpoint used to list and manage campaigns.

- Endpoint: GET /api/campaigns
- Query params:
  - page (number) — 1-based page number (optional, default 1)
  - limit (number) — page size (optional, default 10)

The Angular client `src/app/core/services/campaign/campaign.client.ts` exposes a `list(params: { page?: number; limit?: number })` method that returns an Observable of a normalized paginated result. The client implements a simple in-memory cache per `page|limit` while the session is active and surfaces friendly error messages.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
