'use client';

import { useEffect, useState } from 'react';
import styles from './MockLab.module.css';

type MockId = 'terminal' | 'readme' | 'quest';

type MockDefinition = {
  id: MockId;
  number: string;
  name: string;
  shortName: string;
  descriptor: string;
  palette: string;
};

const MOCKS: MockDefinition[] = [
  {
    id: 'terminal',
    number: '01',
    name: 'Terminal Arcano',
    shortName: 'arcane terminal',
    descriptor: 'A guild terminal for building useful systems.',
    palette: 'acid / amber / graphite',
  },
  {
    id: 'readme',
    number: '02',
    name: 'README Editorial',
    shortName: 'living readme',
    descriptor: 'A personal README with a point of view.',
    palette: 'paper / green / ink',
  },
  {
    id: 'quest',
    number: '03',
    name: 'Pixel Field Journal',
    shortName: 'pixel field journal',
    descriptor: 'A pixel journal for shipped work and active quests.',
    palette: 'olive / parchment / pixel',
  },
];

const PROJECTS = [
  {
    name: 'JobAppliesTracker',
    type: 'product system',
    description: 'A job-search command center with pipeline history, metrics and a real API.',
    stack: ['Next.js', 'FastAPI', 'PostgreSQL'],
    accent: 'green',
  },
  {
    name: 'ShScriptHub',
    type: 'developer tool',
    description: 'A desktop hub for running, scheduling and observing project scripts.',
    stack: ['Python', 'PySide6', 'Psutil'],
    accent: 'amber',
  },
  {
    name: 'AutoPot-DR',
    type: 'automation lab',
    description: 'Continuous memory monitoring and configurable actions in a focused tool.',
    stack: ['Python', 'PyQt5', 'Threading'],
    accent: 'violet',
  },
];

const SKILLS = [
  'TypeScript',
  'React',
  'Next.js',
  'Python',
  'FastAPI',
  'PostgreSQL',
  'AI workflows',
  'Docker',
];

function isMockId(value: string | null): value is MockId {
  return MOCKS.some((mock) => mock.id === value);
}

function PixelMark({ className = '' }: { className?: string }) {
  return (
    <span className={`${styles.pixelMark} ${className}`} aria-hidden="true">
      <i />
      <i />
      <i />
      <i />
      <i />
      <i />
      <i />
      <i />
      <i />
    </span>
  );
}

const PLAYER_PIXEL_ART = [
  '000111000',
  '001111100',
  '001222100',
  '011222110',
  '012222210',
  '001333100',
  '011333110',
  '013333310',
  '033333330',
  '033333330',
  '003003300',
  '003003300',
];

function PixelSprite() {
  return (
    <span className={styles.pixelSprite} aria-hidden="true">
      {PLAYER_PIXEL_ART.flatMap((row, rowIndex) =>
        row.split('').map((cell, columnIndex) => {
          const tone =
            cell === '1'
              ? styles.pixelHair
              : cell === '2'
                ? styles.pixelSkin
                : cell === '3'
                  ? styles.pixelCloth
                  : styles.pixelEmpty;

          return <i className={`${styles.pixelCell} ${tone}`} key={`${rowIndex}-${columnIndex}`} />;
        })
      )}
    </span>
  );
}

function Avatar({ variant = 'default' }: { variant?: string }) {
  return (
    <div
      className={`${styles.avatar} ${styles[`avatar${variant}`]}`}
      aria-label="Leonardo Briquezi avatar"
    >
      <span className={styles.avatarGlow} />
      <span className={styles.avatarHead} />
      <span className={`${styles.avatarEye} ${styles.avatarEyeLeft}`} />
      <span className={`${styles.avatarEye} ${styles.avatarEyeRight}`} />
      <span className={styles.avatarBody} />
    </div>
  );
}

function Tag({ children, tone = '' }: { children: React.ReactNode; tone?: string }) {
  return <span className={`${styles.tag} ${tone ? styles[`tag${tone}`] : ''}`}>{children}</span>;
}

function MiniProject({
  project,
  className = '',
}: {
  project: (typeof PROJECTS)[number];
  className?: string;
}) {
  return (
    <article className={`${styles.miniProject} ${styles[`project${project.accent}`]} ${className}`}>
      <div className={styles.projectMeta}>
        <span className={styles.projectDot} />
        <span>{project.type}</span>
        <span className={styles.projectIndex}>/ 0{PROJECTS.indexOf(project) + 1}</span>
      </div>
      <h3>{project.name}</h3>
      <p>{project.description}</p>
      <div className={styles.projectBottom}>
        <div className={styles.projectTags}>
          {project.stack.map((item) => (
            <Tag key={item}>{item}</Tag>
          ))}
        </div>
        <span className={styles.projectArrow}>↗</span>
      </div>
    </article>
  );
}

function ContributionGrid({ muted = false }: { muted?: boolean }) {
  const cells = Array.from({ length: 35 }, (_, index) => (index * 7 + 3) % 5);

  return (
    <div
      className={`${styles.contributionGrid} ${muted ? styles.contributionMuted : ''}`}
      aria-label="Activity map"
    >
      {cells.map((level, index) => (
        <span key={index} className={`${styles[`level${level}`]}`} />
      ))}
    </div>
  );
}

function TerminalMock() {
  return (
    <section className={`${styles.mock} ${styles.terminalMock}`} data-mock="terminal">
      <div className={styles.terminalNoise} />
      <header className={styles.terminalHeader}>
        <div className={styles.terminalBrand}>
          <span className={styles.terminalPrompt}>&gt;_</span>
          <span>
            <strong>leobrqz@workbench</strong>
            <small>~/portfolio / session 014</small>
          </span>
        </div>
        <nav className={styles.terminalNav} aria-label="Terminal navigation">
          <a href="#terminal-about">profile</a>
          <a href="#terminal-skills">skills</a>
          <a href="#terminal-work">projects</a>
          <a href="#terminal-signal">contact</a>
        </nav>
        <span className={styles.onlinePill}>
          <i /> available
        </span>
      </header>

      <div className={styles.terminalBody}>
        <div className={styles.terminalHero} id="terminal-about">
          <div className={styles.terminalHeroCopy}>
            <p className={styles.terminalKicker}>
              <span>01</span> / WORKBENCH READY / FLORIANOPOLIS, BR
            </p>
            <h1>
              I build tools for <em>real work.</em>
            </h1>
            <p className={styles.terminalLead}>
              Fullstack developer focused on backend systems, expressive interfaces and AI-powered
              automation.
            </p>
            <div className={styles.terminalSession}>
              <div className={styles.commandLine}>
                <span>$</span> cat profile.txt <i>_</i>
              </div>
              <pre className={styles.terminalOutput}>{`role:  fullstack developer
focus: backend + product interfaces
mode:  learn / build / ship`}</pre>
            </div>
            <div className={styles.terminalActions}>
              <a href="#terminal-work" className={styles.solidTerminalButton}>
                ./open-projects <span>↘</span>
              </a>
              <a href="#terminal-signal" className={styles.ghostTerminalButton}>
                ./contact
              </a>
            </div>
          </div>
          <div className={styles.terminalOrbital}>
            <div className={styles.terminalMonitor}>
              <div className={styles.terminalMonitorBar}>
                <span>./monitor --live</span>
                <strong>PID 014</strong>
              </div>
              <div className={styles.terminalMonitorStatus}>
                <i /> system healthy
              </div>
              {[
                ['api design', '88%', 'strong'],
                ['interface craft', '74%', 'medium'],
                ['curiosity', '96%', 'high'],
                ['shipping', '91%', 'high'],
              ].map(([label, value, tone]) => (
                <div className={styles.terminalMonitorLine} key={label}>
                  <span>{label}</span>
                  <i>
                    <em className={styles[`monitor${tone}`]} />
                  </i>
                  <b>{value}</b>
                </div>
              ))}
              <div className={styles.terminalMonitorTree}>
                <span>project_tree/</span>
                <small>├── apps/</small>
                <small>├── services/</small>
                <small>└── experiments/</small>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.terminalReadout}>
          <div>
            <span>stack.primary</span>
            <strong>TS · REACT · PY · FASTAPI</strong>
          </div>
          <div>
            <span>current.mode</span>
            <strong className={styles.greenText}>building / learning</strong>
          </div>
          <div>
            <span>experience</span>
            <strong>fullstack + ai</strong>
          </div>
        </div>

        <div className={styles.terminalSection} id="terminal-skills">
          <div className={styles.terminalSectionTitle}>
            <div>
              <span className={styles.terminalSectionNumber}>02</span>
              <span>./skills --loaded</span>
            </div>
            <span className={styles.sectionHint}>8 core tools / 4 domains</span>
          </div>
          <div className={styles.terminalSkillMatrix}>
            {[
              ['languages', 'TypeScript', 'Python', 'SQL'],
              ['frontend', 'React', 'Next.js', 'CSS'],
              ['backend', 'FastAPI', 'PostgreSQL', 'Redis'],
              ['automation', 'Playwright', 'Docker', 'OpenAI'],
            ].map(([group, ...items]) => (
              <div className={styles.terminalSkillGroup} key={group}>
                <span className={styles.terminalSkillGroupName}>[{group}]</span>
                {items.map((item) => (
                  <div className={styles.terminalSkillLine} key={item}>
                    <span>{item}</span>
                    <strong>READY</strong>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div className={styles.terminalStackNote}>
            <span>$</span> proficiency is a moving target; curiosity is the dependency.
          </div>
        </div>

        <div className={styles.terminalSection} id="terminal-work">
          <div className={styles.terminalSectionTitle}>
            <div>
              <span className={styles.terminalSectionNumber}>03</span>
              <span>./projects --selected</span>
            </div>
            <span className={styles.sectionHint}>3 builds / inspect output ↗</span>
          </div>
          <div className={styles.terminalProjects}>
            {PROJECTS.map((project) => (
              <MiniProject key={project.name} project={project} />
            ))}
          </div>
          <div className={styles.terminalProjectLog}>
            <div>
              <span>JobAppliesTracker</span>
              <small>API + dashboard / PostgreSQL / Docker</small>
              <strong>SHIP 01</strong>
            </div>
            <div>
              <span>ShScriptHub</span>
              <small>desktop tooling / scheduling / live metrics</small>
              <strong>SHIP 02</strong>
            </div>
            <div>
              <span>AutoPot-DR</span>
              <small>memory monitoring / multithreading / automation</small>
              <strong>SHIP 03</strong>
            </div>
          </div>
        </div>

        <div className={styles.terminalSignal} id="terminal-signal">
          <div>
            <p className={styles.terminalKicker}>
              <span>04</span> / OPEN CHANNEL
            </p>
            <h2>
              Have a problem worth
              <br />
              <em>solving?</em>
            </h2>
          </div>
          <div className={styles.signalTerminal}>
            <span>$</span> ./start-a-conversation <i>↗</i>
          </div>
        </div>
      </div>
      <footer className={styles.terminalFooter}>
        <span>© 2026 LEOBRQZ</span>
        <span>STATUS: CURIOUS / ALWAYS</span>
        <span>↑ back to root</span>
      </footer>
    </section>
  );
}

function ReadmeMock() {
  return (
    <section className={`${styles.mock} ${styles.readmeMock}`} data-mock="readme">
      <header className={styles.githubHeader}>
        <div className={styles.githubMark}>⌁</div>
        <div className={styles.repoPath}>
          <strong>leobrqz</strong>
          <span>/</span>
          <strong>portfolio</strong>
          <Tag tone="public">Public</Tag>
        </div>
        <div className={styles.githubSearch}>
          ⌕ <span>Type / to search</span>
        </div>
        <div className={styles.githubUtility}>
          <span>＋</span>
          <span>◒</span>
          <Avatar />
        </div>
      </header>
      <nav className={styles.repoTabs} aria-label="Repository navigation">
        <a className={styles.activeRepoTab} href="#readme">
          <span>◫</span> Overview
        </a>
        <a href="#readme-projects">
          <span>▱</span> Repositories <b>8</b>
        </a>
        <a href="#readme-activity">
          <span>▥</span> Activity
        </a>
        <a href="#readme-about">
          <span>◌</span> About
        </a>
      </nav>

      <div className={styles.readmePage} id="readme">
        <main className={styles.readmeMain}>
          <div className={styles.readmeFileBar}>
            <span>README.md</span>
            <span>edit · history · raw</span>
          </div>
          <article className={styles.readmePaper} id="readme-about">
            <div className={styles.readmeIntro}>
              <Avatar variant="Readme" />
              <div>
                <span className={styles.readmeEyebrow}>Hello, world! 👋</span>
                <h1>Leonardo Briquezi</h1>
                <p>Fullstack developer & Computer Science student.</p>
              </div>
            </div>
            <div className={styles.readmeRule} />
            <p className={styles.readmeManifesto}>
              I build end-to-end web applications, useful automations and interfaces that make
              complex things feel closer.
            </p>
            <div className={styles.readmeColumns}>
              <div>
                <h2>
                  <span>#</span> What I do
                </h2>
                <p>
                  Backend-focused development with a soft spot for clear interfaces, reliable
                  systems and the tiny details that make software feel alive.
                </p>
              </div>
              <div>
                <h2>
                  <span>#</span> Currently
                </h2>
                <ul className={styles.checkList}>
                  <li>Building with TypeScript + Python</li>
                  <li>Exploring AI workflow design</li>
                  <li>Learning in public, one repo at a time</li>
                </ul>
              </div>
            </div>
            <h2 className={styles.readmeHeading}>
              <span>##</span> Toolbox
            </h2>
            <div className={styles.readmeToolbox}>
              {SKILLS.map((skill) => (
                <Tag key={skill}>{skill}</Tag>
              ))}
            </div>
            <div className={styles.readmeStackPanel}>
              <div className={styles.readmePanelHeading}>
                <strong>
                  <span>##</span> Stack in practice
                </strong>
                <small>the tools behind the badges</small>
              </div>
              <div className={styles.readmeStackRows}>
                {[
                  ['TypeScript + React', 'interfaces / product surfaces', '4 shipped builds'],
                  ['Python + FastAPI', 'services / automation / data', 'backend focus'],
                  ['PostgreSQL + Docker', 'persistence / deployment', 'reliable defaults'],
                  ['AI workflows + Playwright', 'agents / testing / tooling', 'active research'],
                ].map(([stack, use, note]) => (
                  <div className={styles.readmeStackRow} key={stack}>
                    <strong>{stack}</strong>
                    <span>{use}</span>
                    <small>{note}</small>
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.readmeProjectShowcase} id="readme-work">
              <div className={styles.readmePanelHeading}>
                <strong>
                  <span>##</span> Selected work
                </strong>
                <small>context over vanity metrics</small>
              </div>
              <div className={styles.readmeProjectRows}>
                {PROJECTS.map((project, index) => (
                  <article className={styles.readmeProjectRow} key={project.name}>
                    <span className={styles.readmeProjectNumber}>0{index + 1}</span>
                    <div>
                      <div className={styles.readmeProjectTitle}>
                        <strong>{project.name}</strong>
                        <Tag>{project.type}</Tag>
                      </div>
                      <p>{project.description}</p>
                      <small>{project.stack.join(' / ')}</small>
                    </div>
                    <a href="#readme-projects" aria-label={`Inspect ${project.name}`}>
                      ↗
                    </a>
                  </article>
                ))}
              </div>
            </div>
            <div className={styles.readmeContribution} id="readme-activity">
              <div className={styles.contributionHead}>
                <strong>1,284 contributions in the last year</strong>
                <span>Contribution settings ⚙</span>
              </div>
              <ContributionGrid />
              <div className={styles.contributionLegend}>
                <span>Less</span>
                <i className={styles.level0} />
                <i className={styles.level1} />
                <i className={styles.level2} />
                <i className={styles.level3} />
                <i className={styles.level4} />
                <span>More</span>
              </div>
            </div>
          </article>
        </main>
        <aside className={styles.readmeAside}>
          <div className={styles.profileCard}>
            <span className={styles.profileRing}>
              <Avatar variant="Readme" />
            </span>
            <h2>leobrqz</h2>
            <p>Leonardo Briquezi</p>
            <p className={styles.profileBio}>
              Software should solve a real problem before it tries to impress.
            </p>
            <button type="button" className={styles.followButton}>
              Follow
            </button>
            <div className={styles.profileMeta}>
              <span>◉ Brazil</span>
              <span>↗ leonardobriquezi.me</span>
              <span>♧ @leobrqz</span>
            </div>
          </div>
          <div className={styles.pinnedCard} id="readme-projects">
            <div className={styles.pinnedHeading}>
              <strong>Popular repositories</strong>
              <a href="#readme-projects">Customize pins</a>
            </div>
            {PROJECTS.map((project) => (
              <div className={styles.repoMini} key={project.name}>
                <div>
                  <span className={styles.repoIcon}>◉</span>
                  <strong>{project.name}</strong>
                  <Tag>{project.type}</Tag>
                </div>
                <p>{project.description}</p>
                <small>
                  <i className={styles.languageDot} /> {project.stack[0]} · stars 12 · forks 3
                </small>
              </div>
            ))}
          </div>
        </aside>
      </div>
      <footer className={styles.githubFooter}>
        <span>© 2026 Leonardo Briquezi</span>
        <span>Made with React · View source ↗</span>
        <span>Português / English</span>
      </footer>
    </section>
  );
}

function QuestMock() {
  return (
    <section
      className={`${styles.mock} ${styles.questMock} ${styles.pixelQuestMock}`}
      data-mock="quest"
    >
      <div className={styles.questStars} />
      <header className={styles.questHeader}>
        <div className={styles.guildLogo}>
          <PixelMark />
          <span>
            FIELD JOURNAL
            <br />
            <strong>LEOBRQZ / 014</strong>
          </span>
        </div>
        <nav>
          <a href="#quest-quests">journal</a>
          <a href="#quest-inventory">skills</a>
          <a href="#quest-tales">contact</a>
        </nav>
        <div className={styles.questHeaderStatus}>
          <span className={styles.onlinePill}>
            <i /> sync 18:42 / online
          </span>
          <button type="button">
            TAB <span>+</span>
          </button>
        </div>
      </header>
      <div className={styles.questBody}>
        <div className={styles.questHero}>
          <div className={styles.questHeroCopy}>
            <div className={styles.questBadge}>
              <span>✦</span> PLAYER FILE / 014
            </div>
            <h1>
              Leonardo
              <br />
              <em>Briquezi</em>
            </h1>
            <p className={styles.questRole}>
              Fullstack developer / backend-minded / curious by default
            </p>
            <p className={styles.questIntro}>
              A working journal of systems shipped, lessons learned and the next problem.
            </p>
            <a className={styles.questCta} href="#quest-quests">
              <span>Open the journal</span>
              <b>+</b>
            </a>
          </div>
          <div className={styles.characterStage}>
            <div className={styles.characterRays} />
            <div className={styles.characterBadge}>
              LVL
              <br />
              <strong>24</strong>
            </div>
            <div className={styles.characterPortrait}>
              <PixelSprite />
              <span className={styles.pixelSword}>+</span>
            </div>
            <div className={styles.characterCaption}>
              <span>CLASS</span>
              <strong>
                FULLSTACK
                <br />
                BUILDER
              </strong>
            </div>
          </div>
        </div>

        <div className={styles.questDivider}>
          <span>✦</span>
          <i />
          <span>ACTIVE QUESTS / SHIPPED WORK</span>
          <i />
          <span>✦</span>
        </div>

        <section className={styles.questSection} id="quest-quests">
          <div className={styles.questSectionHeading}>
            <div>
              <span className={styles.questEyebrow}>01 / QUEST LOG</span>
              <h2>
                Active work.
                <br />
                <em>Useful output.</em>
              </h2>
            </div>
            <p>Projects are recorded as problems, constraints, decisions and working artifacts.</p>
          </div>
          <div className={styles.questCards}>
            {PROJECTS.map((project, index) => (
              <article
                className={`${styles.questCard} ${styles[`questCard${index}`]}`}
                key={project.name}
              >
                <div className={styles.questCardTop}>
                  <span className={styles.questRarity}>
                    {index === 0 ? 'IN PROGRESS' : index === 1 ? 'SHIPPED' : 'MAINTENANCE'}
                  </span>
                  <span>0{index + 1} / 03</span>
                </div>
                <div className={styles.questIcon}>
                  {index === 0 ? '[+]' : index === 1 ? '[=]' : '[*]'}
                </div>
                <h3>{project.name}</h3>
                <p>{project.description}</p>
                <div className={styles.questReward}>
                  <span>STACK</span>
                  <strong>{project.stack.join(' · ')}</strong>
                  <b>↗</b>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.inventorySection} id="quest-inventory">
          <div className={styles.inventoryCard}>
            <span className={styles.questEyebrow}>02 / SKILL TREE</span>
            <h2>
              Tools in
              <br />
              <em>practice.</em>
            </h2>
            <div className={styles.inventoryGrid}>
              {SKILLS.slice(0, 6).map((skill, index) => (
                <div className={styles.inventoryItem} key={skill}>
                  <span>0{index + 1}</span>
                  <strong>{skill}</strong>
                  <i>{index < 3 ? 'daily use' : 'in rotation'}</i>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.statsCard}>
            <span className={styles.questEyebrow}>03 / FIELD METRICS</span>
            <h3>Current attributes</h3>
            {[
              ['API design', '88'],
              ['UI systems', '74'],
              ['Debugging', '96'],
              ['Shipping', '91'],
            ].map(([name, value]) => (
              <div className={styles.statBar} key={name}>
                <div>
                  <span>{name}</span>
                  <b>{value}</b>
                </div>
                <i>
                  <em style={{ width: `${value}%` }} />
                </i>
              </div>
            ))}
            <div className={styles.xpLine}>
              <span>QUESTS COMPLETED</span>
              <strong>24 / MANY</strong>
            </div>
          </div>
        </section>

        <section className={styles.questTales} id="quest-tales">
          <span className={styles.questEyebrow}>04 / NEXT QUEST</span>
          <h2>
            Have a problem
            <br />
            <em>worth mapping?</em>
          </h2>
          <p>Bring the constraint. We can turn it into a useful system.</p>
          <a href="mailto:hello@leonardobriquezi.me">
            Open a channel <span>+</span>
          </a>
        </section>
      </div>
      <footer className={styles.questFooter}>
        <span>✦ LEOBRQZ / FIELD NOTES OF A DIGITAL BUILDER</span>
        <span>© 2026 THE GUILD</span>
        <span>SCROLL TO EXPLORE ↓</span>
      </footer>
    </section>
  );
}

function ActiveMock({ id }: { id: MockId }) {
  switch (id) {
    case 'readme':
      return <ReadmeMock />;
    case 'quest':
      return <QuestMock />;
    default:
      return <TerminalMock />;
  }
}

export function MockLab() {
  const [activeStyle, setActiveStyle] = useState<MockId>('terminal');
  const activeMock = MOCKS.find((mock) => mock.id === activeStyle) ?? MOCKS[0];

  useEffect(() => {
    const styleFromUrl = new URLSearchParams(window.location.search).get('style');
    if (isMockId(styleFromUrl)) {
      setActiveStyle(styleFromUrl);
    }
  }, []);

  function selectStyle(id: MockId) {
    setActiveStyle(id);
    const url = new URL(window.location.href);
    url.searchParams.set('style', id);
    window.history.replaceState({}, '', url);
  }

  return (
    <main className={styles.lab} data-active-style={activeStyle}>
      <aside className={styles.catalog}>
        <div className={styles.catalogTop}>
          <div className={styles.labLogo}>
            LB<span>✦</span>
          </div>
          <span className={styles.catalogMode}>DESIGN LAB / 03</span>
        </div>
        <div className={styles.catalogIntro}>
          <span className={styles.catalogEyebrow}>PORTFOLIO REDESIGN</span>
          <h1>
            Three possible
            <br />
            <em>homes.</em>
          </h1>
          <p>Uma exploração visual para encontrar a linguagem certa para o próximo portfólio.</p>
        </div>
        <nav className={styles.catalogNav} aria-label="Visual directions">
          <span className={styles.catalogNavLabel}>SELECT A DIRECTION</span>
          {MOCKS.map((mock) => (
            <button
              key={mock.id}
              type="button"
              data-style={mock.id}
              aria-pressed={mock.id === activeStyle}
              className={`${styles.catalogButton} ${mock.id === activeStyle ? styles.catalogButtonActive : ''}`}
              onClick={() => selectStyle(mock.id)}
            >
              <span className={styles.catalogButtonIndex}>{mock.number}</span>
              <span className={styles.catalogButtonCopy}>
                <strong>{mock.name}</strong>
                <small>{mock.descriptor}</small>
              </span>
              <i>↗</i>
            </button>
          ))}
        </nav>
        <div className={styles.catalogFooter}>
          <div>
            <span>ACTIVE DIRECTION</span>
            <strong>{activeMock.name}</strong>
            <small>{activeMock.palette}</small>
          </div>
          <div className={styles.branchPill}>
            <i /> branch / portfolio-mock-lab
          </div>
          <p>Prototype lab · 08.08.2026</p>
        </div>
      </aside>
      <section className={styles.previewArea}>
        <div className={styles.previewToolbar}>
          <div>
            <span className={styles.toolbarDot} />
            <span>LIVE PROTOTYPE</span>
            <b>/ {activeMock.shortName}</b>
          </div>
          <div className={styles.toolbarActions}>
            <span>1440 × 1000</span>
            <span className={styles.toolbarDivider} />
            <span>scroll to explore</span>
            <span className={styles.toolbarKey}>⌘ K</span>
          </div>
        </div>
        <div className={styles.previewFrame}>
          <ActiveMock id={activeStyle} />
        </div>
      </section>
    </main>
  );
}
