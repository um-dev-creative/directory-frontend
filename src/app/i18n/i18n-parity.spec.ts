import es from '../../assets/i18n/es.json';
import en from '../../assets/i18n/en.json';
import fr from '../../assets/i18n/fr.json';

type Dictionary = { [key: string]: string | Dictionary };

const flatten = (dictionary: Dictionary, prefix = ''): Record<string, string> =>
  Object.entries(dictionary).reduce<Record<string, string>>((flat, [key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    return typeof value === 'string' ? {...flat, [path]: value} : {...flat, ...flatten(value, path)};
  }, {});

const placeholders = (text: string): string[] => [...text.matchAll(/\{\{\s*([\w.]+)\s*\}\}/g)].map((match) => match[1]).sort();

const languages: Record<string, Record<string, string>> = {
  es: flatten(es as Dictionary),
  en: flatten(en as Dictionary),
  fr: flatten(fr as Dictionary)
};
const allKeys = [...new Set(Object.values(languages).flatMap((dictionary) => Object.keys(dictionary)))].sort();

/** The three translation files must say the same things: same keys, no empty text, same {{parameters}}. `pnpm run i18n:check` also checks the keys the code uses. */
describe('i18n parity (es, en, fr)', () => {
  it('has translations', () => {
    expect(allKeys.length).toBeGreaterThan(100);
  });

  for (const language of ['es', 'en', 'fr']) {
    it(`${language} has every key of the other languages`, () => {
      expect(allKeys.filter((key) => !(key in languages[language]))).toEqual([]);
    });

    it(`${language} has no empty text`, () => {
      expect(allKeys.filter((key) => (languages[language][key] ?? '').trim() === '')).toEqual([]);
    });
  }

  it('uses the same {{parameters}} in every language', () => {
    const different = allKeys.filter((key) =>
      ['en', 'fr'].some((language) => placeholders(languages[language][key] ?? '').join() !== placeholders(languages['es'][key] ?? '').join()));
    expect(different).toEqual([]);
  });

  it('has no key that is also the prefix of another key (a text and a group with the same name)', () => {
    const conflicts = allKeys.filter((key) => allKeys.some((other) => other.startsWith(`${key}.`)));
    expect(conflicts).toEqual([]);
  });
});
