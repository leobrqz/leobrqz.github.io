export interface EducationEntry {
  degree: { en: string; pt: string };
  level: { en: string; pt: string };
  institution: string;
  location: string;
  start_date: string;
  end_date: string;
  description: { en: string; pt: string };
}

export const education: EducationEntry[] = [
  {
    degree: { en: "Bachelor's in Computer Science", pt: 'Bacharelado em Ciência da Computação' },
    level: { en: 'Undergraduate', pt: 'Graduação' },
    institution: 'Estácio',
    location: 'Florianópolis, Santa Catarina',
    start_date: '2024',
    end_date: '2027',
    description: {
      en: `Practical application of Scrum, Kanban and Extreme Programming in planning and incremental development.
Contact with fundamentals of cloud computing and AWS services.
System structuring and modeling with focus on requirement clarity and code organization.`,
      pt: `Aplicação prática de Scrum, Kanban e Extreme Programming no planejamento e desenvolvimento incremental.
Contato com fundamentos de computação em nuvem e serviços da AWS.
Estruturação e modelagem de sistemas com foco em clareza de requisitos e organização do código.`,
    },
  },
];
