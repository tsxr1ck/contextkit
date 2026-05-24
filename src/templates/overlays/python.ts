import type { Overlay } from "../../types/index.js";

export const pythonOverlay: Overlay = {
  id: "python",
  rootSections: [
    {
      id: "python-conventions",
      heading: "Python",
      bullets: [
        "Follow PEP 8 style conventions.",
        "Use type hints for function signatures and class attributes.",
        "Prefer `pathlib.Path` over `os.path` for file operations.",
        "Use `dataclasses` or `pydantic` for structured data over plain dicts.",
      ],
    },
  ],
  rules: [],
  contextOverrides: {
    primaryLanguage: "Python",
    packageManager: "pip",
    testCommand: "pytest",
    lintCommand: "ruff check .",
    typecheckCommand: "mypy .",
    devCommand: "",
    buildCommand: "",
  },
};
