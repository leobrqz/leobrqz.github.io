export type ProjectLabel =
  | { type: 'new' }
  | { type: 'update'; changelogUrl: string };

export interface ProjectMetaItem {
  libraries: string[];
  tools: string[];
  labels?: ProjectLabel[];
}

export type ProjectsMeta = Record<string, ProjectMetaItem>;

const SHSCRIPTHUB_RELEASE_V3_2 =
  'https://github.com/leobrqz/ShScriptHub/releases/tag/v3.2.0';

export const projects_meta: ProjectsMeta = {
  JobAppliesTracker: {
    libraries: ['FastAPI', 'Pydantic', 'SQLAlchemy', 'Alembic', 'Next.js', 'React', 'Tailwind', 'shadcn', 'TanStack', 'Recharts', 'schedule-x'],
    tools: ['Docker', 'Turborepo'],
    labels: [{ type: 'new' }],
  },
  ShScriptHub: {
    libraries: ['PySide6', 'Psutil'],
    tools: [],
    labels: [{ type: 'update', changelogUrl: SHSCRIPTHUB_RELEASE_V3_2 }],
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
