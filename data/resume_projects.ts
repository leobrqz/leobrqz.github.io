export interface ResumeProjectEntry {
  name: { en: string; pt: string };
  url: string;
  description: { en: string; pt: string };
  technologies: string[];
}

export const resume_projects: ResumeProjectEntry[] = [
  {
    name: { en: 'JobAppliesTracker', pt: 'JobAppliesTracker' },
    url: 'https://github.com/leobrqz/JobAppliesTracker',
    description: {
      en: `- Web platform to centralize job applications, companies, job boards, resumes/cvs, profile data, interview calendar events with meeting URLs, and performance metrics dashboard.
      - Pipeline funnel per application with stage history, filters by status/stages/platform/company, and archiving.
      - REST API organized by resource/domain route prefixes, persistence via SQLAlchemy ORM and PostgreSQL, schema versioning via Alembic, and service orchestration with Docker Compose.`,
      pt: `- Plataforma web para centralizar candidaturas, empresas, plataformas de vagas, currículos, dados de perfil e calendário de entrevistas com URLs de reunião, além de um dashboard de métricas.
      - Funil por candidatura com histórico de etapas, filtros por status/etapas/plataforma/empresa e arquivamento.
      - API REST organizada por recurso (rotas prefixadas por domínio), persistência com SQLAlchemy (ORM) e PostgreSQL, schema versionado e evoluído via Alembic e orquestração dos serviços com Docker Compose.`,
    },
    technologies: [
      'TypeScript',
      'Python',
      'React',
      'Next.js',
      'FastAPI',
      'PostgreSQL',
      'SQLAlchemy',
      'Turborepo',
      'Docker',
    ],
  },
  {
    name: { en: 'ShScriptHub', pt: 'ShScriptHub' },
    url: 'https://github.com/leobrqz/ShScriptHub',
    description: {
      en: `- Centralizes .sh scripts from a project into a single hub for automation of builds, deploys and other tasks.
      - Runs each script in its own terminal with CWD set to the script directory; detects and activates venv for Python scripts, and kills the full process tree when stopping.
      - Shows real-time metrics (CPU, RSS, threads) and a read-only script viewer with syntax highlighting.
      - Supports scheduling by specific time or interval; background execution captures stdout/stderr with tee and persists run logs as JSON displayed inside the app.`,
      pt: `- Centraliza scripts .sh de um projeto em um hub para automação de builds, deploys e outras tarefas.
      - Executa cada script em um terminal separado com CWD no diretório do script; detecção e ativação de venv em scripts Python, além de Kill da árvore de processos.
      - Métricas em tempo real (CPU, RSS, threads) e viewer do script com syntax highlighting.
      - Agendamento por horário ou intervalo, execução em background com captura de stdout/stderr via tee e persistência dos logs por run em JSON visualizados dentro do aplicativo.`,
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
];
