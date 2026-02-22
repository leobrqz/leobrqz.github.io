"use client";

import {
  Alert,
  Box,
  Button,
  Container,
  Group,
  Loader,
  Grid,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import { useCallback, useState } from "react";
import { t, type Lang } from "../../lib/i18n";
import { useProjects, type EnrichedProject } from "../../lib/use-projects";
import styles from "./ProjectsPage.module.css";

export type ProjectsPageProps = {
  lang: Lang;
};

type ReadmeState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "html"; html: string }
  | { status: "none" }
  | { status: "error" };

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}

function ProjectCard({
  project,
  lang,
  readmeState,
  onToggleReadme,
}: {
  project: EnrichedProject;
  lang: Lang;
  readmeState: ReadmeState;
  onToggleReadme: (name: string, show: boolean) => void;
}) {
  const loading = readmeState.status === "loading";
  const showContent =
    readmeState.status === "html" ||
    readmeState.status === "none" ||
    readmeState.status === "error";

  const handleToggle = useCallback(() => {
    onToggleReadme(project.name, !showContent);
  }, [project.name, showContent, onToggleReadme]);

  return (
    <Paper withBorder p="lg" radius="md" shadow="sm">
      <Stack gap="md">
        <Grid gutter="md">
          <Grid.Col span={{ base: 12, sm: 8 }}>
            <Stack gap="xs">
              <Title order={3} size="h4">
                <Text
                  component="a"
                  href={project.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  inherit
                  c="var(--mantine-color-anchor)"
                  style={{ textDecoration: "underline" }}
                >
                  {project.name}
                </Text>
              </Title>
              {project.description && (
                <Text size="sm" c="dimmed">
                  {project.description}
                </Text>
              )}
              <Text size="xs" c="dimmed">
                {t(lang, "projects.last_updated")}: {formatDate(project.updated_at)}
              </Text>
            </Stack>
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 4 }}>
            {(project.languages.length > 0 ||
              project.language ||
              project.libraries.length > 0 ||
              project.tools.length > 0) && (
              <Paper withBorder p="md" radius="sm">
                <Box
                  style={{
                    display: "grid",
                    gridTemplateColumns: `repeat(${
                      [
                        project.languages.length > 0 || project.language,
                        project.libraries.length > 0,
                        project.tools.length > 0,
                      ].filter(Boolean).length
                    }, 1fr)`,
                    gap: "var(--mantine-spacing-md)",
                  }}
                >
                  {(project.languages.length > 0 || project.language) && (
                    <Box style={{ minWidth: 0 }}>
                      <Text size="xs" fw={600} c="dimmed">
                        {t(lang, "projects.languages")}
                      </Text>
                      <Text size="xs">
                        {project.languages.length > 0
                          ? project.languages.join(", ")
                          : project.language ?? ""}
                      </Text>
                    </Box>
                  )}
                  {project.libraries.length > 0 && (
                    <Box style={{ minWidth: 0 }}>
                      <Text size="xs" fw={600} c="dimmed">
                        {t(lang, "projects.libraries")}
                      </Text>
                      <Text size="xs">{project.libraries.join(", ")}</Text>
                    </Box>
                  )}
                  {project.tools.length > 0 && (
                    <Box style={{ minWidth: 0 }}>
                      <Text size="xs" fw={600} c="dimmed">
                        {t(lang, "projects.tools")}
                      </Text>
                      <Text size="xs">{project.tools.join(", ")}</Text>
                    </Box>
                  )}
                </Box>
              </Paper>
            )}
          </Grid.Col>
        </Grid>
        <Button
          variant="light"
          size="xs"
          loading={loading}
          onClick={handleToggle}
        >
          {showContent
            ? t(lang, "projects.hide_readme")
            : t(lang, "projects.show_readme")}
        </Button>
        {showContent && (
          <Box
            component="div"
            style={{
              borderTop: "1px solid var(--mantine-color-default-border)",
              paddingTop: "var(--mantine-spacing-md)",
              marginTop: 2,
            }}
          >
            {readmeState.status === "html" && (
              <Box
                className={`${styles.readmeWrapper} markdown-body`}
                dangerouslySetInnerHTML={{ __html: readmeState.html }}
                style={{
                  borderRadius: "var(--mantine-radius-sm)",
                  padding: "var(--mantine-spacing-md)",
                  fontSize: "var(--mantine-font-size-sm)",
                  overflow: "auto",
                }}
              />
            )}
            {readmeState.status === "none" && (
              <Text size="sm" c="dimmed">
                {t(lang, "projects.no_readme")}
              </Text>
            )}
            {readmeState.status === "error" && (
              <Text size="sm" c="red">
                {t(lang, "projects.unable_to_load")}
              </Text>
            )}
          </Box>
        )}
      </Stack>
    </Paper>
  );
}

export function ProjectsPage({ lang }: ProjectsPageProps) {
  const { state, refetch, fetchReadme } = useProjects();
  const [readmeOpen, setReadmeOpen] = useState<Record<string, ReadmeState>>({});

  const onToggleReadme = useCallback(
    (name: string, show: boolean) => {
      if (!show) {
        setReadmeOpen((prev) => {
          const next = { ...prev };
          delete next[name];
          return next;
        });
        return;
      }
      setReadmeOpen((prev) => ({ ...prev, [name]: { status: "loading" } }));
      fetchReadme(name)
        .then((html) => {
          setReadmeOpen((prev) => ({
            ...prev,
            [name]: html ? { status: "html", html } : { status: "none" },
          }));
        })
        .catch(() => {
          setReadmeOpen((prev) => ({ ...prev, [name]: { status: "error" } }));
        });
    },
    [fetchReadme]
  );

  if (state.status === "loading") {
    return (
      <Box component="main" py="xl">
        <Container size="md">
          <Stack align="center" gap="md" py="xl">
            <Loader size="md" />
            <Text size="sm" c="dimmed">
              {t(lang, "projects.last_updated")}…
            </Text>
          </Stack>
        </Container>
      </Box>
    );
  }

  if (state.status === "empty") {
    const message =
      state.kind === "no_config"
        ? t(lang, "projects.no_projects")
        : t(lang, "projects.no_repos");
    return (
      <Box component="main" py="xl">
        <Container size="md">
          <Alert
            icon={<IconAlertCircle size={16} />}
            title={t(lang, "pages.projects")}
            color="gray"
          >
            <Text size="sm" component="span" dangerouslySetInnerHTML={{ __html: message }} />
          </Alert>
        </Container>
      </Box>
    );
  }

  if (state.status === "error") {
    return (
      <Box component="main" py="xl">
        <Container size="md">
          <Alert
            icon={<IconAlertCircle size={16} />}
            title={t(lang, "pages.projects")}
            color="red"
          >
            {t(lang, "projects.error_loading")}
          </Alert>
          <Button variant="light" mt="md" onClick={refetch}>
            Retry
          </Button>
        </Container>
      </Box>
    );
  }

  return (
    <Box component="main" py="xl">
      <Container size="md">
        <Stack gap="xl">
          <Title order={1}>{t(lang, "pages.projects")}</Title>
          <Stack gap="md">
            {state.projects.map((project) => (
              <ProjectCard
                key={project.name}
                project={project}
                lang={lang}
                readmeState={readmeOpen[project.name] ?? { status: "idle" }}
                onToggleReadme={onToggleReadme}
              />
            ))}
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
