#!/usr/bin/env node
// Checks the translation files: same keys in es/en/fr, no empty values, same {{placeholders}} in every language, and every key the code
// uses exists. Exits with 1 on any error. Run it with `pnpm run i18n:check`.
import {readFileSync} from 'node:fs';
import {APP_DIR, LANGUAGES, listFiles, loadLanguage, placeholders, rel, usedKeys} from './lib.mjs';

const errors = [];
const languages = Object.fromEntries(LANGUAGES.map((language) => [language, loadLanguage(language)]));
const allKeys = new Set(LANGUAGES.flatMap((language) => Object.keys(languages[language])));

for (const key of [...allKeys].sort()) {
  for (const language of LANGUAGES) {
    const value = languages[language][key];
    if (value === undefined) {
      errors.push(`[${language}] missing key: ${key}`);
    } else if (typeof value !== 'string' || value.trim() === '') {
      errors.push(`[${language}] empty value: ${key}`);
    }
  }
  const reference = placeholders(languages.es[key] ?? '').join(',');
  for (const language of LANGUAGES.filter((l) => l !== 'es')) {
    if (languages[language][key] !== undefined && placeholders(languages[language][key]).join(',') !== reference) {
      errors.push(`[${language}] placeholders differ from es in: ${key}`);
    }
  }
}

const used = new Map();
for (const file of listFiles(APP_DIR, ['.html', '.ts'])) {
  for (const key of usedKeys(readFileSync(file, 'utf8'))) {
    used.set(key, [...(used.get(key) ?? []), rel(file)]);
  }
}
for (const [key, files] of used) {
  if (!allKeys.has(key)) {
    errors.push(`used but not defined: ${key} (${[...new Set(files)].join(', ')})`);
  }
}
const unused = [...allKeys].filter((key) => !used.has(key));

console.log(`languages: ${LANGUAGES.join(', ')} | keys: ${allKeys.size} | keys used by the code: ${used.size} | not referenced: ${unused.length}`);
if (unused.length > 0) {
  console.log(`not referenced (info, may be used dynamically): ${unused.slice(0, 15).join(', ')}${unused.length > 15 ? ', ...' : ''}`);
}
if (errors.length > 0) {
  console.error(`\n${errors.length} error(s):\n- ${errors.join('\n- ')}`);
  process.exit(1);
}
console.log('i18n check passed');
