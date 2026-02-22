export interface ResumeSkillItem {
  name: string;
  icon: string;
}

export interface ResumeSkillsData {
  languages: ResumeSkillItem[];
  frameworks: ResumeSkillItem[];
  libraries: ResumeSkillItem[];
  databases: ResumeSkillItem[];
  tools: ResumeSkillItem[];
}

export const resume_skills: ResumeSkillsData = {
  languages: [
    { name: "Python", icon: "python" },
    { name: "Java", icon: "java" },
    { name: "JavaScript", icon: "js" },
    { name: "TypeScript", icon: "js" },
    { name: "SQL", icon: "database" },
    { name: "HTML", icon: "html5" },
    { name: "CSS", icon: "html5" },
    { name: "Solidity", icon: "ethereum" },
  ],
  frameworks: [
    { name: "FastAPI", icon: "bolt" },
    { name: "NextJS", icon: "code" },
    { name: "React", icon: "react" },
  ],
  libraries: [
    { name: "Scikit-learn", icon: "chart-line" },
    { name: "NumPy", icon: "chart-line" },
    { name: "Pandas", icon: "chart-line" },
    { name: "Matplotlib", icon: "chart-line" },
    { name: "LangChain", icon: "link" },
    { name: "PyQt", icon: "desktop" },
    { name: "Tkinter", icon: "desktop" },
    { name: "Pymem", icon: "memory" },
    { name: "SQLAlchemy", icon: "database" },
    { name: "OpenAI", icon: "link" },
    { name: "HuggingFace", icon: "link" },
  ],
  databases: [
    { name: "PostgreSQL", icon: "database" },
    { name: "MySQL", icon: "database" },
  ],
  tools: [
    { name: "Vite", icon: "code" },
    { name: "Git", icon: "git" },
    { name: "Docker", icon: "docker" },
    { name: "Linux", icon: "linux" },
    { name: "AWS", icon: "aws" },
  ],
};
