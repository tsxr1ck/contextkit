import pc from "picocolors";

export const ui = {
  brand: (v: string) => pc.cyan(v),
  ok: (v: string) => pc.green(v),
  warn: (v: string) => pc.yellow(v),
  error: (v: string) => pc.red(v),
  dim: (v: string) => pc.dim(v),
  path: (v: string) => pc.blue(v),
  code: (v: string) => pc.magenta(v),
  strong: (v: string) => pc.bold(v),
  heading: (v: string) => pc.bold(pc.cyan(v)),
  mute: (v: string) => pc.dim(v),
};
