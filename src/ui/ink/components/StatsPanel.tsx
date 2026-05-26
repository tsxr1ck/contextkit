import React from "react";
import { Box, Text } from "ink";
import { useDaemonStore } from "../store.js";

function formatTokens(n: number): string {
  if (n >= 1000) return `~${(n / 1000).toFixed(1)}k`;
  return `~${n}`;
}

function StatRow({
  label,
  value,
  color = "white",
}: {
  label: string;
  value: string;
  color?: string;
}): React.ReactElement {
  return (
    <Box gap={1}>
      <Text dimColor>{label}:</Text>
      <Text color={color} bold>
        {value}
      </Text>
    </Box>
  );
}

export function StatsPanel(): React.ReactElement {
  const provider = useDaemonStore((s) => s.activeProvider);
  const frameworks = useDaemonStore((s) => s.frameworks);
  const languages = useDaemonStore((s) => s.languages);
  const watchedFiles = useDaemonStore((s) => s.watchedFiles);
  const tokenEstimate = useDaemonStore((s) => s.tokenEstimate);
  const tokenSavings = useDaemonStore((s) => s.tokenSavings);
  const mode = useDaemonStore((s) => s.mode);
  const isParsing = useDaemonStore((s) => s.isParsing);

  return (
    <Box flexDirection="column" paddingX={1} gap={0}>
      <Text color="cyan" bold underline>
        Status
      </Text>

      <Box flexDirection="column" marginTop={1} gap={0}>
        <StatRow
          label="Provider"
          value={provider || "none detected"}
          color={provider ? "green" : "gray"}
        />

        <StatRow
          label="Stack"
          value={
            frameworks.length > 0 ? frameworks.join(" + ") : "detecting..."
          }
          color={frameworks.length > 0 ? "magenta" : "gray"}
        />

        <StatRow
          label="Languages"
          value={
            languages.length > 0 ? languages.join(", ") : "detecting..."
          }
          color={languages.length > 0 ? "blue" : "gray"}
        />

        <StatRow
          label="Files watched"
          value={String(watchedFiles)}
          color="yellow"
        />

        <StatRow
          label="Tokens"
          value={formatTokens(tokenEstimate)}
          color="cyan"
        />

        {mode === "lean" && tokenSavings > 0 && (
          <StatRow
            label="Saved"
            value={`${formatTokens(tokenSavings)} tokens (lean mode)`}
            color="green"
          />
        )}

        {isParsing && (
          <Box marginTop={1}>
            <Text color="yellow">⟳ Parsing...</Text>
          </Box>
        )}
      </Box>
    </Box>
  );
}
