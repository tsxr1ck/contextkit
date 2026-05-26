import React from "react";
import { Box, Text } from "ink";
import { useDaemonStore } from "../store.js";

const LOGO = "◆ contextkit";

export function Header(): React.ReactElement {
  const branch = useDaemonStore((s) => s.gitBranch);
  const cwd = useDaemonStore((s) => s.cwd);
  const mode = useDaemonStore((s) => s.mode);
  const isWatching = useDaemonStore((s) => s.isWatching);
  const projectName = useDaemonStore((s) => s.projectName);

  // Shorten cwd for display
  const shortCwd = cwd.replace(
    process.env.HOME || "",
    "~",
  );

  return (
    <Box
      flexDirection="row"
      justifyContent="space-between"
      paddingX={1}
      borderStyle="single"
      borderColor="cyan"
      borderBottom={true}
      borderTop={false}
      borderLeft={false}
      borderRight={false}
    >
      <Box gap={1}>
        <Text color="cyan" bold>
          {LOGO}
        </Text>
        <Text color="white" bold>
          {projectName || "watch"}
        </Text>
      </Box>

      <Box gap={2}>
        <Text dimColor>{shortCwd}</Text>

        {branch && (
          <Box gap={1}>
            <Text color="magenta">⎇</Text>
            <Text color="magenta" bold>
              {branch}
            </Text>
          </Box>
        )}

        <Text color={mode === "lean" ? "yellow" : "green"} bold>
          {mode.toUpperCase()}
        </Text>

        <Text color={isWatching ? "green" : "gray"}>
          {isWatching ? "● LIVE" : "○ IDLE"}
        </Text>
      </Box>
    </Box>
  );
}
