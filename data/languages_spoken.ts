export interface LanguageSpokenEntry {
  name: { en: string; pt: string };
  level: { en: string; pt: string };
}

export const languages_spoken: LanguageSpokenEntry[] = [
  { name: { en: 'Portuguese', pt: 'Português' }, level: { en: 'Native', pt: 'Nativo' } },
  { name: { en: 'English', pt: 'Inglês' }, level: { en: 'Advanced', pt: 'Avançado' } },
  { name: { en: 'Spanish', pt: 'Espanhol' }, level: { en: 'Basic', pt: 'Básico' } },
];
