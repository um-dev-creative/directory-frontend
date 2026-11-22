# Languages: Spanish, English and French (user guide)

The application's texts exist in **Spanish (default), English and French**: menus, forms, validation messages, notifications, emails to the user excluded.

## What you see
- The language is **Spanish** unless the application is told otherwise. Switching the language in the interface is not available yet; it is the next step.
- Texts with names, numbers or dates keep them in every language (for example "Fundado en 2024" / "Founded in 2024" / "Fondé en 2024").
- Texts that come from the server (for example a message that explains why a request failed) are shown as the server wrote them.

## For translators and reviewers
1. Open `docs/guides/i18n-review.md`: every text in Spanish, English and French side by side, grouped by section, with a checkbox per row.
2. The English and French texts were drafted by an AI assistant: **they need a human review** (names of legal documents, forms of address, tone).
3. To correct a text, edit it in `src/assets/i18n/en.json` or `src/assets/i18n/fr.json`, keep any `{{parameter}}` exactly as in Spanish, and run `pnpm run i18n:check`.
4. Tick the row in the review sheet (or regenerate it with `pnpm run i18n:review` after changing texts).

## What to expect
| Situation | Result |
| --- | --- |
| A text is missing in a language | The test suite and `pnpm run i18n:check` fail, so it is caught before release |
| A key used by the code does not exist | The key itself is shown on screen and `pnpm run i18n:check` fails |
| A text has a `{{parameter}}` in Spanish but not in English or French | The checks fail |
