import { TECHSTARS_PDF_URL } from '@/config/site';

export interface ExperienceEntry {
  title: { en: string; pt: string };
  company: string;
  location: string;
  period: { en: string; pt: string };
  description: { en: string; pt: string };
  url?: string;
}

export const experience: ExperienceEntry[] = [
  {
    title: { en: 'Junior Full Stack & AI Developer', pt: 'Junior Full Stack & AI Developer' },
    company: 'InfityWorks',
    location: 'Remote',
    period: { en: 'March 2026 – Present', pt: 'Março 2026 – Presente' },
    description: {
      en: `- Developed an AI-powered workflow automation platform inspired by n8n, integrating WhatsApp (Meta Graph API), Google Calendar, Google Meet, Jitsi Meet, Zoho, Zoom, Microsoft 365, Redis and Pinecone. The solution automated business processes, including WhatsApp prospecting, with **over 6,000 conversations automatically initiated and over 4,000 responses from potential clients**.
- Designed and developed microservices for AI processing and enterprise integrations, including a self-hosted infrastructure based on WhisperX for audio transcription and processing, along with independent services for system communication and workflow automation.
- Optimized application architecture, **reducing critical operation response times by up to 86%, increasing platform scalability, and achieving 1st place in the company's internal performance ranking**.
- Initiated infrastructure and development process improvements, promoting service migration to Cloudflare for **cost optimization** and formalizing the **adoption of AI-assisted development tools and methodologies**, making the development workflow more standardized and efficient.`,
      pt: `- Desenvolvi uma plataforma de automação de workflows com IA, inspirada no modelo do n8n, integrando WhatsApp (Meta Graph API), Google Calendar, Google Meet, Jitsi Meet, Zoho, Zoom, Microsoft365, Redis e Pinecone. A solução automatizou processos empresariais, incluindo prospecção via WhatsApp, com **mais de 6.000 conversas iniciadas automaticamente e mais de 4.000 respostas de potenciais clientes**.
- Projetei e desenvolvi microserviços para processamento de IA e integrações corporativas, incluindo uma infraestrutura self-hosted baseada em WhisperX para transcrição e processamento de áudio, além de serviços independentes para comunicação entre sistemas e automação de fluxos.
- Otimizei a arquitetura da aplicação, **reduzindo em até 86% o tempo de resposta de operações críticas, aumentando a escalabilidade da plataforma e conquistando o 1° lugar no ranking interno de desempenho da empresa**.
- Iniciei melhorias na infraestrutura e no processo de desenvolvimento, promovendo a migração de serviços para a Cloudflare para **otimização de custos** e formalizando a **adoção de ferramentas e metodologias de desenvolvimento assistido por IA**, tornando o fluxo de desenvolvimento mais padronizado e eficiente.`,
    },
  },
  {
    title: { en: 'Startup Weekend Florianópolis', pt: 'Startup Weekend Florianópolis' },
    company: 'Techstars',
    location: 'Florianópolis, Santa Catarina',
    period: { en: 'May 2026', pt: 'Maio 2026' },
    url: TECHSTARS_PDF_URL,
    description: {
      en: `- Led the development of a functional MVP for a platform to hire freelance professionals for residential services, conceived, validated and implemented in just 56 hours during the event.
- Participated in problem and solution validation with the target audience, contributing to product definition, value proposition and core platform features.
- Won **2nd place** in the competition and additional awards for project distinction, which was the **only solution presented with a functional and usable product by the end of the event**.`,
      pt: `- Liderei o desenvolvimento de um MVP funcional para uma plataforma de contratação de profissionais autônomos para serviços residenciais, concebido, validado e implementado em apenas 56 horas durante o evento.
- Participei da validação do problema e da solução junto ao público-alvo, contribuindo para a definição do produto, proposta de valor e funcionalidades centrais da plataforma.
- Conquistei o **2° lugar** da competição e premiações adicionais pelo destaque do projeto, que foi a **única solução apresentada com um produto funcional e utilizável ao final do evento**.`,
    },
  },
];
