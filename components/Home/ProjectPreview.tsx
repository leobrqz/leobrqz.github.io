import styles from './ProjectPreview.module.css';

export type ProjectPreviewKind = 'tracker' | 'scriptHub' | 'memory' | 'repository';

function PreviewBar({ children }: { children: string }) {
  return (
    <div className={styles.previewBar}>
      <span>{children}</span>
      <i />
    </div>
  );
}

export function ProjectPreview({ kind }: { kind: ProjectPreviewKind }) {
  return (
    <div className={styles.previewFrame} aria-hidden="true">
      {kind === 'tracker' && (
        <div className={`${styles.preview} ${styles.trackerPreview}`}>
          <PreviewBar>JOB TRACKER</PreviewBar>
          <div className={styles.trackerHeading}>APPLICATIONS</div>
          <div className={styles.pipelineStages}>
            <span>Applied</span>
            <span>Interview</span>
            <span>Offer</span>
          </div>
          <div className={styles.pipelineRail}>
            <i />
            <i />
            <i />
          </div>
          <div className={styles.dashboardRows}>
            <span />
            <span />
            <span />
          </div>
        </div>
      )}
      {kind === 'scriptHub' && (
        <div className={`${styles.preview} ${styles.scriptPreview}`}>
          <PreviewBar>SH SCRIPTHUB</PreviewBar>
          <div className={styles.scriptWindow}>
            <div className={styles.scriptSidebar}>
              <b>RUN QUEUE</b>
              <span>
                <i /> SHELL
              </span>
              <span>
                <i /> PYTHON
              </span>
              <span>
                <i /> SCHEDULED
              </span>
            </div>
            <div className={styles.terminalPane}>
              <b>TERMINAL / LIVE</b>
              <span>
                <i>$</i> run script
              </span>
              <span className={styles.terminalOutput}>stdout / process active</span>
              <span className={styles.terminalCursor} />
            </div>
          </div>
        </div>
      )}
      {kind === 'memory' && (
        <div className={`${styles.preview} ${styles.memoryPreview}`}>
          <PreviewBar>AUTOPOT / MEMORY</PreviewBar>
          <div className={styles.memoryHeading}>
            <span>DWARVEN REALMS / PROCESS</span>
            <i />
          </div>
          <div className={styles.memoryRows}>
            <span>
              POINTER CHAIN <i />
            </span>
            <span>
              CURRENT VALUE <i />
            </span>
            <span>
              ACTION LIMIT <i />
            </span>
          </div>
          <div className={styles.memoryMeter}>
            <i />
          </div>
        </div>
      )}
      {kind === 'repository' && (
        <div className={`${styles.preview} ${styles.repositoryPreview}`}>
          <PreviewBar>REPOSITORY</PreviewBar>
          <div className={styles.repositoryFiles}>
            <span>src</span>
            <span>README.md</span>
            <span>package.json</span>
            <span>tests</span>
          </div>
        </div>
      )}
    </div>
  );
}
