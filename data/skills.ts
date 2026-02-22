export interface SkillItem {
  name: string;
  icon_url?: string;
  simple_icon?: string;
  icon?: string;
}

export interface SkillsData {
  languages: SkillItem[];
  frameworks: SkillItem[];
  data: SkillItem[];
  libraries: SkillItem[];
  databases: SkillItem[];
  tools: SkillItem[];
}

export const skills: SkillsData = {
  languages: [
    {
      name: 'Python',
      icon_url:
        'https://s3.dualstack.us-east-2.amazonaws.com/pythondotorg-assets/media/files/python-logo-only.svg',
    },
    {
      name: 'Java',
      icon_url: 'https://upload.wikimedia.org/wikipedia/pt/3/30/Java_programming_language_logo.svg',
    },
    { name: 'JavaScript', simple_icon: 'javascript' },
    { name: 'TypeScript', simple_icon: 'typescript' },
    { name: 'SQL', simple_icon: 'postgresql' },
    { name: 'HTML', simple_icon: 'html5' },
    { name: 'CSS', simple_icon: 'css' },
    { name: 'Solidity', simple_icon: 'solidity' },
  ],
  frameworks: [
    { name: 'FastAPI', simple_icon: 'fastapi' },
    { name: 'NextJS', simple_icon: 'nextdotjs' },
    { name: 'React', simple_icon: 'react' },
  ],
  data: [
    { name: 'Scikit-learn', simple_icon: 'scikitlearn' },
    { name: 'NumPy', simple_icon: 'numpy' },
    { name: 'Pandas', simple_icon: 'pandas' },
    {
      name: 'Matplotlib',
      icon_url: 'https://upload.wikimedia.org/wikipedia/commons/8/84/Matplotlib_icon.svg',
    },
  ],
  libraries: [
    { name: 'LangChain', simple_icon: 'langchain' },
    { name: 'PyQt', simple_icon: 'qt' },
    { name: 'Tkinter', simple_icon: 'python' },
    { name: 'Pymem', icon: 'memory' },
    { name: 'SQLAlchemy', simple_icon: 'sqlalchemy' },
    { name: 'OpenAI', icon_url: 'https://www.svgrepo.com/show/306500/openai.svg' },
    { name: 'HuggingFace', simple_icon: 'huggingface' },
  ],
  databases: [
    { name: 'PostgreSQL', simple_icon: 'postgresql' },
    { name: 'MySQL', simple_icon: 'mysql' },
  ],
  tools: [
    { name: 'Vite', simple_icon: 'vite' },
    { name: 'Git', simple_icon: 'git' },
    { name: 'Docker', simple_icon: 'docker' },
    { name: 'Linux', simple_icon: 'linux' },
    { name: 'AWS', icon_url: '/assets/icons/aws.svg' },
  ],
};
