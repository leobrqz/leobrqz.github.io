export interface ResumeSkillItem {
  name: string;
  icon?: string;
}

export interface ResumeSkillsData {
  languages: ResumeSkillItem[];
  backend: ResumeSkillItem[];
  frontend: ResumeSkillItem[];
  ai_automations: ResumeSkillItem[];
  data: ResumeSkillItem[];
  cloud_devops: ResumeSkillItem[];
}

export const resume_skills: ResumeSkillsData = {
  languages: [
    { name: 'Python', icon: 'python' },
    { name: 'TypeScript', icon: 'js' },
    { name: 'JavaScript', icon: 'js' },
    { name: 'Java', icon: 'java' },
    { name: 'SQL', icon: 'database' },
    { name: 'HTML', icon: 'html5' },
    { name: 'CSS', icon: 'html5' },
    { name: 'Solidity', icon: 'ethereum' },
  ],
  backend: [
    { name: 'FastAPI', icon: 'bolt' },
    { name: 'SQLAlchemy', icon: 'database' },
    { name: 'PostgreSQL', icon: 'database' },
    { name: 'MySQL', icon: 'database' },
    { name: 'Supabase', icon: 'database' },
    { name: 'Redis', icon: 'database' },
  ],
  frontend: [
    { name: 'React', icon: 'react' },
    { name: 'Next.js', icon: 'code' },
    { name: 'Tailwind CSS', icon: 'code' },
    { name: 'Vite', icon: 'code' },
  ],
  ai_automations: [
    { name: 'LangChain', icon: 'link' },
    { name: 'RAG' },
    { name: 'OpenAI', icon: 'link' },
    { name: 'HuggingFace', icon: 'link' },
    { name: 'Playwright', icon: 'code' },
    { name: 'BeautifulSoup' },
    { name: 'Pinecone', icon: 'link' },
  ],
  data: [
    { name: 'Scikit-learn', icon: 'chart-line' },
    { name: 'Pandas', icon: 'chart-line' },
    { name: 'NumPy', icon: 'chart-line' },
    { name: 'Matplotlib', icon: 'chart-line' },
  ],
  cloud_devops: [
    { name: 'AWS', icon: 'aws' },
    { name: 'Cloudflare' },
    { name: 'Vercel' },
    { name: 'Docker', icon: 'docker' },
    { name: 'Git', icon: 'git' },
    { name: 'GitHub', icon: 'git' },
    { name: 'Linux', icon: 'linux' },
    { name: 'Codex' },
    { name: 'Claude Code' },
    { name: 'OpenCode' },
    { name: 'Cursor' },
  ],
};
