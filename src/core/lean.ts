import { Project } from "ts-morph";
import { resolve } from "node:path";
import { readFileSync, existsSync } from "node:fs";

// ── Types ────────────────────────────────────────────────────

export interface LeanResult {
  /** The pruned source text with only signatures and types */
  output: string;
  /** Original character count */
  originalChars: number;
  /** Pruned character count */
  prunedChars: number;
  /** Estimated token savings (chars / 4 as rough approximation) */
  tokenSavings: number;
}

// ── Rough token estimation ───────────────────────────────────

function estimateTokens(charCount: number): number {
  // ~4 chars per token is a reasonable approximation for code
  return Math.ceil(charCount / 4);
}

// ── Lean Parser ──────────────────────────────────────────────

/**
 * Strip function/method bodies from a TypeScript file, leaving only:
 * - Import/export statements
 * - Interface and type declarations
 * - Class declarations (with method signatures, but empty bodies)
 * - Function signatures (with empty bodies)
 * - Variable/const declarations
 * - Enums
 *
 * This dramatically reduces token count while preserving the API surface.
 */
export function leanParse(filePath: string): LeanResult | null {
  const absPath = resolve(filePath);
  if (!existsSync(absPath)) return null;

  const original = readFileSync(absPath, "utf-8");
  const originalChars = original.length;

  // Only process TypeScript/JavaScript files
  if (
    !absPath.endsWith(".ts") &&
    !absPath.endsWith(".tsx") &&
    !absPath.endsWith(".js") &&
    !absPath.endsWith(".jsx")
  ) {
    return {
      output: original,
      originalChars,
      prunedChars: originalChars,
      tokenSavings: 0,
    };
  }

  try {
    const project = new Project({
      useInMemoryFileSystem: true,
      compilerOptions: { allowJs: true, jsx: 1 /* Preserve */ },
    });

    const sourceFile = project.createSourceFile("temp.ts", original);
    const lines: string[] = [];

    // Collect imports
    for (const imp of sourceFile.getImportDeclarations()) {
      lines.push(imp.getText());
    }

    if (lines.length > 0) lines.push("");

    // Collect type aliases
    for (const ta of sourceFile.getTypeAliases()) {
      lines.push(ta.getText());
    }

    // Collect interfaces
    for (const iface of sourceFile.getInterfaces()) {
      lines.push(iface.getText());
    }

    // Collect enums
    for (const en of sourceFile.getEnums()) {
      lines.push(en.getText());
    }

    // Collect classes — keep structure but strip method bodies
    for (const cls of sourceFile.getClasses()) {
      const modifiers = cls.getModifiers().map((m) => m.getText()).join(" ");
      const name = cls.getName() || "Anonymous";
      const ext = cls.getExtends()?.getText();
      const impls = cls.getImplements().map((i) => i.getText());

      let classSig = modifiers ? `${modifiers} class ${name}` : `class ${name}`;
      if (ext) classSig += ` extends ${ext}`;
      if (impls.length > 0) classSig += ` implements ${impls.join(", ")}`;
      classSig += " {";
      lines.push(classSig);

      // Properties
      for (const prop of cls.getProperties()) {
        lines.push(`  ${prop.getText()}`);
      }

      // Method signatures
      for (const method of cls.getMethods()) {
        const mods = method.getModifiers().map((m) => m.getText()).join(" ");
        const methodName = method.getName();
        const params = method.getParameters().map((p) => p.getText()).join(", ");
        const returnType = method.getReturnTypeNode()?.getText();
        const sig = [mods, methodName].filter(Boolean).join(" ");
        lines.push(
          `  ${sig}(${params})${returnType ? `: ${returnType}` : ""} { /* ... */ }`,
        );
      }

      lines.push("}");
      lines.push("");
    }

    // Collect function declarations — signature only
    for (const fn of sourceFile.getFunctions()) {
      const mods = fn.getModifiers().map((m) => m.getText()).join(" ");
      const name = fn.getName() || "anonymous";
      const params = fn.getParameters().map((p) => p.getText()).join(", ");
      const returnType = fn.getReturnTypeNode()?.getText();
      const isExported = fn.isExported();
      const prefix = isExported ? "export " : "";
      const asyncMod = fn.isAsync() ? "async " : "";

      lines.push(
        `${prefix}${asyncMod}function ${name}(${params})${returnType ? `: ${returnType}` : ""} { /* ... */ }`,
      );
    }

    // Collect variable statements (const/let/var) — keep declarations
    for (const vs of sourceFile.getVariableStatements()) {
      const isExported = vs.isExported();
      const decls = vs.getDeclarations();
      for (const decl of decls) {
        const name = decl.getName();
        const typeNode = decl.getTypeNode()?.getText();
        const prefix = isExported ? "export " : "";
        const keyword = vs.getDeclarationKind();
        if (typeNode) {
          lines.push(`${prefix}${keyword} ${name}: ${typeNode};`);
        } else {
          lines.push(`${prefix}${keyword} ${name}: /* inferred */;`);
        }
      }
    }

    // Collect export declarations (re-exports)
    for (const exp of sourceFile.getExportDeclarations()) {
      lines.push(exp.getText());
    }

    const output = lines.join("\n");
    const prunedChars = output.length;

    return {
      output,
      originalChars,
      prunedChars,
      tokenSavings: estimateTokens(originalChars) - estimateTokens(prunedChars),
    };
  } catch {
    // If parsing fails, return original
    return {
      output: original,
      originalChars,
      prunedChars: originalChars,
      tokenSavings: 0,
    };
  }
}

/**
 * Process multiple files in lean mode and aggregate stats.
 */
export function leanParseMany(
  filePaths: string[],
): { results: Map<string, LeanResult>; totalSavings: number } {
  const results = new Map<string, LeanResult>();
  let totalSavings = 0;

  for (const fp of filePaths) {
    const result = leanParse(fp);
    if (result) {
      results.set(fp, result);
      totalSavings += result.tokenSavings;
    }
  }

  return { results, totalSavings };
}
