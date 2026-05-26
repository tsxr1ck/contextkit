import React from "react";
import { Box, Text } from "ink";
import { useDaemonStore } from "../store.js";

const INDENT = "  ";
const BRANCH = "├── ";
const LAST_BRANCH = "└── ";
const PIPE = "│   ";

interface TreeNode {
  name: string;
  children?: TreeNode[];
}

function buildTree(dirs: string[]): TreeNode[] {
  const root: TreeNode[] = [];

  for (const dir of dirs.sort()) {
    const parts = dir.split("/");
    let current = root;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      let existing = current.find((n) => n.name === part);

      if (!existing) {
        existing = { name: part, children: [] };
        current.push(existing);
      }

      current = existing.children!;
    }
  }

  return root;
}

function TreeNodeView({
  node,
  isLast,
  prefix,
}: {
  node: TreeNode;
  isLast: boolean;
  prefix: string;
}): React.ReactElement {
  const connector = isLast ? LAST_BRANCH : BRANCH;
  const childPrefix = prefix + (isLast ? INDENT : PIPE);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <Box flexDirection="column">
      <Text>
        <Text dimColor>{prefix}</Text>
        <Text dimColor>{connector}</Text>
        <Text color={hasChildren ? "cyan" : "white"} bold={hasChildren}>
          {node.name}
        </Text>
        {hasChildren && <Text dimColor>/</Text>}
      </Text>
      {node.children?.map((child, i) => (
        <TreeNodeView
          key={child.name}
          node={child}
          isLast={i === node.children!.length - 1}
          prefix={childPrefix}
        />
      ))}
    </Box>
  );
}

export function TreeView(): React.ReactElement {
  const directories = useDaemonStore((s) => s.directories);
  const projectName = useDaemonStore((s) => s.projectName);
  const tree = buildTree(directories);

  return (
    <Box flexDirection="column" paddingX={1}>
      <Text color="cyan" bold underline>
        Project Structure
      </Text>
      <Box flexDirection="column" marginTop={1}>
        <Text color="white" bold>
          {projectName || "."}/
        </Text>
        {tree.map((node, i) => (
          <TreeNodeView
            key={node.name}
            node={node}
            isLast={i === tree.length - 1}
            prefix=""
          />
        ))}
      </Box>
    </Box>
  );
}
