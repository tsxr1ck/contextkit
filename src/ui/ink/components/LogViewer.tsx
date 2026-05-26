import React from "react";
import { Box, Text } from "ink";
import { useDaemonStore, type LogEntry } from "../store.js";

const LEVEL_STYLE: Record<
  LogEntry["level"],
  { color: string; label: string }
> = {
  info: { color: "blue", label: "INFO " },
  warn: { color: "yellow", label: "WARN " },
  error: { color: "red", label: "ERROR" },
  watch: { color: "cyan", label: "WATCH" },
  scan: { color: "magenta", label: "SCAN " },
  ok: { color: "green", label: " OK  " },
};

function formatTime(ts: number): string {
  const d = new Date(ts);
  return d.toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export function LogViewer(): React.ReactElement {
  const logs = useDaemonStore((s) => s.recentLogs);

  return (
    <Box
      flexDirection="column"
      paddingX={1}
      borderStyle="single"
      borderColor="gray"
      borderTop={true}
      borderBottom={false}
      borderLeft={false}
      borderRight={false}
    >
      {logs.length === 0 ? (
        <Text dimColor>Waiting for activity...</Text>
      ) : (
        logs.map((entry, i) => {
          const style = LEVEL_STYLE[entry.level];
          return (
            <Box key={`${entry.timestamp}-${i}`} gap={1}>
              <Text dimColor>{formatTime(entry.timestamp)}</Text>
              <Text color={style.color} bold>
                [{style.label}]
              </Text>
              <Text>{entry.message}</Text>
            </Box>
          );
        })
      )}
    </Box>
  );
}
