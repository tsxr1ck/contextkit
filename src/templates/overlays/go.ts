import type { Overlay } from "../../types/index.js";

export const goOverlay: Overlay = {
  id: "go",
  rootSections: [
    {
      id: "go-conventions",
      heading: "Go",
      bullets: [
        "Follow standard Go project layout conventions.",
        "Use `gofmt` / `goimports` for formatting — do not manually adjust style.",
        "Prefer returning errors over panicking.",
        "Keep interfaces small and define them where they are consumed.",
        "Use table-driven tests.",
      ],
    },
  ],
  rules: [],
  contextOverrides: {
    primaryLanguage: "Go",
    packageManager: "go",
    testCommand: "go test ./...",
    lintCommand: "golangci-lint run",
    typecheckCommand: "go vet ./...",
    devCommand: "go run .",
    buildCommand: "go build ./...",
  },
};
