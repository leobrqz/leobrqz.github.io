export interface SkillItem {
  name: string;
  icon_url?: string;
  simple_icon?: string;
  icon?: string;
}

export interface SkillsData {
  languages: SkillItem[];
  backend: SkillItem[];
  frontend: SkillItem[];
  ai_automations: SkillItem[];
  data: SkillItem[];
  cloud_devops: SkillItem[];
}

export const skills: SkillsData = {
  languages: [
    {
      name: 'Python',
      icon_url:
        'https://s3.dualstack.us-east-2.amazonaws.com/pythondotorg-assets/media/files/python-logo-only.svg',
    },
    { name: 'TypeScript', simple_icon: 'typescript' },
    { name: 'JavaScript', simple_icon: 'javascript' },
    {
      name: 'Java',
      icon_url: 'https://upload.wikimedia.org/wikipedia/pt/3/30/Java_programming_language_logo.svg',
    },
    { name: 'SQL', icon_url: 'https://img.icons8.com/fluency/48/sql.png' },
    { name: 'HTML', simple_icon: 'html5' },
    { name: 'CSS', simple_icon: 'css' },
    { name: 'Solidity', simple_icon: 'solidity' },
  ],
  backend: [
    { name: 'FastAPI', simple_icon: 'fastapi' },
    { name: 'SQLAlchemy', simple_icon: 'sqlalchemy' },
    { name: 'PostgreSQL', simple_icon: 'postgresql' },
    { name: 'MySQL', simple_icon: 'mysql' },
    { name: 'Supabase', simple_icon: 'supabase' },
  ],
  frontend: [
    { name: 'React', simple_icon: 'react' },
    { name: 'Next.js', simple_icon: 'nextdotjs' },
    { name: 'Tailwind CSS', simple_icon: 'tailwindcss' },
    { name: 'Vite', simple_icon: 'vite' },
  ],
  ai_automations: [
    { name: 'LangChain', simple_icon: 'langchain' },
    {
      name: 'OpenAI',
      icon_url: 'https://www.svgrepo.com/show/306500/openai.svg',
    },
    { name: 'HuggingFace', simple_icon: 'huggingface' },
    {
      name: 'Playwright',
      icon_url: 'https://playwright.dev/img/playwright-logo.svg',
    },
    { name: 'BeautifulSoup' },
  ],
  data: [
    { name: 'Scikit-learn', simple_icon: 'scikitlearn' },
    { name: 'Pandas', simple_icon: 'pandas' },
    { name: 'NumPy', simple_icon: 'numpy' },
    {
      name: 'Matplotlib',
      icon_url: 'https://upload.wikimedia.org/wikipedia/commons/8/84/Matplotlib_icon.svg',
    },
  ],
  cloud_devops: [
    { name: 'AWS', icon_url: '/assets/icons/aws.svg' },
    { name: 'Docker', simple_icon: 'docker' },
    { name: 'Git', simple_icon: 'git' },
    { name: 'Linux', simple_icon: 'linux' },
  ],
};
