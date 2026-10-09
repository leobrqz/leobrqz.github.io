import { IconBracketsAngle, IconDatabase } from '@tabler/icons-react';
import type { SkillItem } from '@/data/skills';

const LOCAL_ICONS: Record<string, string> = {
  Python: 'python',
  Java: 'java',
  SQL: 'sql',
  OpenAI: 'openai',
  Playwright: 'playwright',
  Matplotlib: 'matplotlib',
  AWS: 'aws',
};

export function SkillIcon({ skill }: { skill: SkillItem }) {
  const iconName = skill.simple_icon ?? LOCAL_ICONS[skill.name];

  if (iconName) {
    const extension = iconName === 'sql' || iconName === 'numpy' ? 'png' : 'svg';
    return (
      <img
        src={`/assets/skill-icons/${iconName}.${extension}`}
        width="20"
        height="20"
        alt=""
        aria-hidden="true"
        loading="lazy"
      />
    );
  }

  const Fallback = skill.name === 'BeautifulSoup' ? IconBracketsAngle : IconDatabase;
  return <Fallback size={20} stroke={1.5} aria-hidden="true" />;
}
