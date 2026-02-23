'use client';

import { useEffect } from 'react';
import { Button, Container, Stack, Text, Title } from '@mantine/core';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Container size="sm" py="xl">
      <Stack gap="lg" align="center">
        <Title order={1} size="h2">
          Something went wrong
        </Title>
        <Text size="sm" c="dimmed" ta="center">
          An unexpected error occurred. You can try again or go back to the home page.
        </Text>
        <Button variant="light" onClick={reset}>
          Try again
        </Button>
      </Stack>
    </Container>
  );
}
