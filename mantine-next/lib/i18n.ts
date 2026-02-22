import { pt, en, type I18nDict } from "../data/i18n";

export type Lang = "pt" | "en";

const dicts = { pt, en } as unknown as Record<Lang, I18nDict>;

export function getTranslations(lang: Lang): I18nDict {
  return dicts[lang];
}

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function getByPath(obj: Record<string, unknown>, path: string): unknown {
  const parts = path.split(".");
  let current: unknown = obj;
  for (const part of parts) {
    if (current == null || typeof current !== "object" || !(part in (current as object))) {
      return undefined;
    }
    current = (current as Record<string, unknown>)[part];
  }
  return current;
}

export function t(lang: Lang, key: string): string {
  const dict = dicts[lang] as Record<string, unknown>;
  const value = getByPath(dict, key);
  return isString(value) ? value : key;
}
