import * as readline from "node:readline";

const rl = () =>
  readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

/**
 * Ask a yes/no confirmation question.
 */
export async function confirm(message: string, defaultYes = true): Promise<boolean> {
  const suffix = defaultYes ? "[Y/n]" : "[y/N]";
  const r = rl();

  return new Promise((resolve) => {
    r.question(`${message} ${suffix} `, (answer) => {
      r.close();
      const trimmed = answer.trim().toLowerCase();
      if (trimmed === "") resolve(defaultYes);
      else resolve(trimmed === "y" || trimmed === "yes");
    });
  });
}

/**
 * Ask user to select one option from a list.
 */
export async function select(
  message: string,
  options: { label: string; value: string }[],
  defaultIndex = 0
): Promise<string> {
  const r = rl();

  console.log(`\n${message}`);
  for (let i = 0; i < options.length; i++) {
    const marker = i === defaultIndex ? "›" : " ";
    console.log(`  ${marker} ${i + 1}. ${options[i].label}`);
  }

  return new Promise((resolve) => {
    r.question(`\nChoice [${defaultIndex + 1}]: `, (answer) => {
      r.close();
      const trimmed = answer.trim();
      if (trimmed === "") {
        resolve(options[defaultIndex].value);
        return;
      }
      const idx = parseInt(trimmed, 10) - 1;
      if (idx >= 0 && idx < options.length) {
        resolve(options[idx].value);
      } else {
        resolve(options[defaultIndex].value);
      }
    });
  });
}

/**
 * Ask user to select multiple options from a list (comma-separated indices).
 */
export async function multiSelect(
  message: string,
  options: { label: string; value: string; default?: boolean }[]
): Promise<string[]> {
  const r = rl();

  console.log(`\n${message} (comma-separated numbers, or Enter for defaults)`);
  for (let i = 0; i < options.length; i++) {
    const marker = options[i].default ? "✔" : " ";
    console.log(`  ${marker} ${i + 1}. ${options[i].label}`);
  }

  const defaults = options.filter((o) => o.default).map((o) => o.value);

  return new Promise((resolve) => {
    r.question(`\nChoices: `, (answer) => {
      r.close();
      const trimmed = answer.trim();
      if (trimmed === "") {
        resolve(defaults);
        return;
      }
      const indices = trimmed
        .split(",")
        .map((s) => parseInt(s.trim(), 10) - 1)
        .filter((i) => i >= 0 && i < options.length);
      resolve(indices.map((i) => options[i].value));
    });
  });
}
