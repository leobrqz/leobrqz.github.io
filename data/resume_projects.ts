export interface ResumeProjectEntry {
  name: { en: string; pt: string };
  url: string;
  description: { en: string; pt: string };
  technologies: string[];
}

export const resume_projects: ResumeProjectEntry[] = [
  {
    name: { en: 'ShScriptHub', pt: 'ShScriptHub' },
    url: 'https://github.com/leobrqz/ShScriptHub',
    description: {
      en: `- Scans the project folder and lists all .sh scripts with a dedicated terminal per script.
      - Auto-detection of Python (venv, .venv) and Node (node_modules) environments; configurable Git Bash and venv paths.
      - Script cards with favorites, categories, live metrics (CPU, RAM, elapsed) and per-script run/kill controls.`,
      pt: `- Escaneia a pasta do projeto e lista todos os scripts .sh com terminal independente por script.
      - Detecção automática de ambientes Python (venv, .venv) e Node (node_modules); paths configuráveis para Git Bash e venv.
      - Cards de script com favoritos, categorias, métricas em tempo real (CPU, RAM, tempo) e controles de executar/parar por script.`,
    },
    technologies: ['Python', 'PySide6', 'Psutil'],
  },
  {
    name: { en: 'AutoPot-DR', pt: 'AutoPot-DR' },
    url: 'https://github.com/leobrqz/AutoPot-DR',
    description: {
      en: `- Implementation of multithreading for continuous monitoring of values in memory.
      - Memory manipulation with Pymem, pointer chain resolution and use of Ctypes.
      - Automatic execution of actions based on configurable limits.`,
      pt: `- Implementação de multithreading para monitoramento contínuo de valores em memória.
      - Manipulação de memória com Pymem, resolução de pointer chains e uso de Ctypes.
      - Execução automática de ações com base em limites configuráveis.`,
    },
    technologies: ['Python', 'PyQt5', 'Pymem', 'Ctypes', 'Threading'],
  },
  {
    name: { en: 'SmokeShopERP-DataAnalytics', pt: 'SmokeShopERP-DataAnalytics' },
    url: 'https://github.com/leobrqz/SmokeShopERP-DataAnalytics',
    description: {
      en: `- Management system with CRUD operations for clients, products and sales.
      - Data persistence in PostgreSQL with relational modeling.
      - Data analysis dashboard with sales metrics, profit margin, inventory turnover and other indicators.`,
      pt: `- Sistema de gestão com operações CRUD para clientes, produtos e vendas.
      - Persistência de dados em PostgreSQL com modelagem relacional.
      - Dashboard de análise de dados com métricas de vendas, margem de lucro, giro de estoque entre outros indicadores.`,
    },
    technologies: ['Python', 'PyQt6', 'PostgreSQL', 'NumPy', 'Matplotlib'],
  },
  {
    name: { en: 'MiniSchool', pt: 'MiniSchool' },
    url: 'https://github.com/leobrqz/MiniSchool',
    description: {
      en: `- Desktop school management system for courses, subjects, students and grades.
      - Tkinter interface with tabbed navigation and forms for CRUD operations.
      - Data persistence in PostgreSQL with relational modeling.
      - Grade system with multiple components (exam, assignment, simulators) and automatic final grade calculation.`,
      pt: `- Sistema desktop de gestão escolar para cursos, matérias, alunos e notas.
      - Interface Tkinter com navegação em abas e formulários para operações CRUD.
      - Persistência de dados em PostgreSQL com modelagem relacional.
      - Sistema de notas com múltiplos componentes (prova, trabalho, simulados) e cálculo automático da nota final.`,
    },
    technologies: ['Python', 'Tkinter', 'PostgreSQL', 'Psycopg2'],
  },
];
