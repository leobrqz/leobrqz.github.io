export interface ProjectMetaItem {
  libraries: string[];
  tools: string[];
}

export type ProjectsMeta = Record<string, ProjectMetaItem>;

export const projects_meta: ProjectsMeta = {
  JobAppliesTracker: {
    libraries: ['FastAPI', 'Pydantic', 'SQLAlchemy', 'Alembic', 'Next.js', 'React', 'Tailwind', 'shadcn', 'TanStack', 'Recharts', 'schedule-x'],
    tools: ['Docker', 'Turborepo'],
  },
  ShScriptHub: {
    libraries: ['PySide6', 'Psutil'],
    tools: [],
  },
  'AutoPot-DR': {
    libraries: ['PyQt5', 'Pymem', 'Ctypes', 'Threading'],
    tools: ['Cheat Engine'],
  },
  'SmokeShopERP-DataAnalytics': {
    libraries: ['PyQt6', 'Pymem', 'Matplotlib', 'Numpy', 'Psycopg2'],
    tools: ['PostgreSQL'],
  },
  MiniSchool: {
    libraries: ['Tkinter', 'Psycopg2'],
    tools: ['PostgreSQL'],
  },
  'Cheatsheet-LabAI': {
    libraries: ['Gradio', 'LangChain', 'OpenAI', 'Chromadb', 'Threading'],
    tools: ['Docker', 'Chroma Database'],
  },
  'myContracts-SpeedrunEthereum': {
    libraries: ['Hardhat', 'Next.js'],
    tools: ['Sepolia Testnet'],
  },
};
