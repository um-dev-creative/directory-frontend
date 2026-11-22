// Shared helpers of the i18n scripts (no dependencies: plain Node).
import {readdirSync, readFileSync, statSync} from 'node:fs';
import {join, relative} from 'node:path';

export const ROOT = new URL('../../', import.meta.url).pathname;
export const APP_DIR = join(ROOT, 'src/app');
export const I18N_DIR = join(ROOT, 'src/assets/i18n');
export const LANGUAGES = ['es', 'en', 'fr'];

/** Every file under `dir` whose name ends with one of `extensions`, excluding the specs. */
export function listFiles(dir, extensions) {
  const found = [];
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) {
      found.push(...listFiles(path, extensions));
    } else if (extensions.some((ext) => name.endsWith(ext)) && !name.endsWith('.spec.ts')) {
      found.push(path);
    }
  }
  return found.sort();
}

export const rel = (path) => relative(ROOT, path);

/** Flattens `{a: {b: 'x'}}` into `{'a.b': 'x'}`. */
export function flatten(object, prefix = '') {
  const flat = {};
  for (const [key, value] of Object.entries(object)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (value !== null && typeof value === 'object') {
      Object.assign(flat, flatten(value, path));
    } else {
      flat[path] = value;
    }
  }
  return flat;
}

export function loadLanguage(language) {
  return flatten(JSON.parse(readFileSync(join(I18N_DIR, `${language}.json`), 'utf8')));
}

/** The `{{ name }}` interpolation parameters of a text, sorted. */
export function placeholders(text) {
  return [...String(text).matchAll(/\{\{\s*([\w.]+)\s*\}\}/g)].map((m) => m[1]).sort();
}

/**
 * The template with the blocks between `<!-- i18n-ignore:start ... -->` and `<!-- i18n-ignore:end -->` and the other comments removed.
 * The ignored blocks are development-only panels, not user-facing text.
 */
export function stripIgnored(template) {
  return template
    .replace(/<!--\s*i18n-ignore:start[\s\S]*?<!--\s*i18n-ignore:end\s*-->/g, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/g, '');
}

/** Literal user-facing texts of a template: text nodes and the literal `placeholder`, `title`, `aria-label` and `alt` attributes. */
export function literalTexts(template) {
  const html = stripIgnored(template);
  const texts = [];
  for (const match of html.matchAll(/>([^<>]+)</g)) {
    const text = match[1]
      .replace(/\{\{[\s\S]*?\}\}/g, '')
      .replace(/@(?:if|else if|else|for|switch|case|default|let)\b[^{]*\{?/g, '')
      .replace(/[{}]/g, '')
      .replace(/&gt;|&lt;|&amp;|&nbsp;/g, '')
      .trim()
      .replace(/\s+/g, ' ');
    if (/\p{L}{2,}/u.test(text)) {
      texts.push({kind: 'text', text});
    }
  }
  for (const match of html.matchAll(/\s(placeholder|title|aria-label|alt)="([^"{}]+)"/g)) {
    if (/\p{L}{2,}/u.test(match[2])) {
      texts.push({kind: match[1], text: match[2]});
    }
  }
  return texts;
}

/** Keys used by the templates and the code: `'a.b' | translate`, `translate.instant('a.b')`, `.get('a.b')`, `.stream('a.b')` and `{key: 'a.b'}` (notifications). */
export function usedKeys(source) {
  const keys = new Set();
  for (const match of source.matchAll(/['"]([\w]+(?:\.[\w]+)+)['"]\s*\|\s*translate/g)) {
    keys.add(match[1]);
  }
  for (const match of source.matchAll(/\.(?:instant|get|stream)\(\s*['"]([\w]+(?:\.[\w]+)+)['"]/g)) {
    keys.add(match[1]);
  }
  for (const match of source.matchAll(/\bkey:\s*['"]([\w]+(?:\.[\w]+)+)['"]/g)) {
    keys.add(match[1]);
  }
  return keys;
}
