# /add-i18n — Add Missing Translation Keys

Finds all strings pending internationalization in the project and adds the corresponding keys to the i18n JSON files.

## Usage

```
/add-i18n [--feature <feature>] [--file <path>]
```

**Examples:**
- `/add-i18n` — scans the entire project
- `/add-i18n --feature partner` — scans only `src/app/features/partner/`
- `/add-i18n --file src/app/features/partner/components/offer-card/offer-card.component.html`

---

## Steps

### 1. Find pending strings

Search for all occurrences of the following patterns:

**In TypeScript files (`*.component.ts`, `*.service.ts`):**
```
// TODO: i18n
```

**In HTML templates (`*.component.html`):**
```
<!-- TODO: i18n -->
```

Use grep to find them:
```bash
grep -rn "TODO: i18n" src/app/ --include="*.ts" --include="*.html"
```

### 2. For each match, read the surrounding context

Read the file and identify:
- The exact visible string the user sees (e.g., `'Guardar cambios'`, `'Error al cargar'`)
- The component/feature it belongs to
- The semantic meaning of the string

### 3. Propose the translation key

Use the format `feature.component.element`:

```
partner.offer-card.title       → "Mis ofertas"
partner.offer-card.no-results  → "No hay ofertas disponibles"
auth.login.submit              → "Iniciar sesión"
community-member.profile.edit  → "Editar perfil"
```

Rules for key names:
- kebab-case at every level
- Maximum 3 levels: `feature.component.element`
- Descriptive and semantic — not positional (`button-1` is wrong, `submit` is right)
- Never duplicate an existing key — check `es.json` first before proposing

### 4. Read the existing i18n files

Always read both files before writing:
```
src/assets/i18n/es.json
src/assets/i18n/en.json
```

Verify that the proposed key does not already exist (same key, possibly different value).

### 5. Add the keys

Insert the new keys into the correct nested position in both files, preserving the JSON structure and alphabetical order within each object.

**Before:**
```json
{
  "partner": {
    "dashboard": {
      "title": "Panel de control"
    }
  }
}
```

**After adding `partner.offer-card.title`:**
```json
{
  "partner": {
    "dashboard": {
      "title": "Panel de control"
    },
    "offer-card": {
      "title": "Mis ofertas"
    }
  }
}
```

For `en.json`, provide the English translation. If uncertain, use the Spanish string prefixed with `[EN]` as a placeholder and note it for manual review.

### 6. Replace the hardcoded strings in the source files

After adding the keys, replace each hardcoded string with its translation pipe:

**In templates:**
```html
<!-- Before -->
<h2>Guardar cambios</h2> <!-- TODO: i18n -->

<!-- After -->
<h2>{{ 'partner.offer-card.title' | translate }}</h2>
```

**In TypeScript (using TranslateService):**
```typescript
// Before
const message = 'Error al cargar'; // TODO: i18n

// After — inject TranslateService
private readonly translate = inject(TranslateService);
const message = this.translate.instant('partner.offer-card.error');
```

### 7. Report

After finishing, report:
- Total `// TODO: i18n` found
- Keys added to `es.json` and `en.json`
- Files modified
- Any translations left as `[EN]` placeholder that need manual review

---

## Checklist

- [ ] Grep run to find all pending strings in the target scope
- [ ] No existing key overwritten in `es.json` / `en.json`
- [ ] New keys follow `feature.component.element` format in kebab-case
- [ ] Both `es.json` and `en.json` updated
- [ ] `<!-- TODO: i18n -->` / `// TODO: i18n` comments removed after replacement
- [ ] `| translate` pipe added in the template (or `TranslateService.instant()` in TypeScript)
- [ ] Valid JSON maintained — no trailing commas
