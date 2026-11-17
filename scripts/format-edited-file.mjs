#!/usr/bin/env node
// Claude Code PostToolUse hook: formats (Prettier) and lint-fixes (ESLint) the file
// Claude just edited, so every diff you review is already clean.
// Never blocks Claude: always exits 0, even if formatting fails.
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { extname, join } from 'node:path';

const PRETTIER_EXTS = new Set([
  '.ts',
  '.tsx',
  '.js',
  '.mjs',
  '.json',
  '.css',
  '.md',
  '.html',
  '.yml',
  '.yaml',
]);
const ESLINT_EXTS = new Set(['.ts', '.tsx', '.js', '.mjs']);

try {
  const input = JSON.parse(readFileSync(0, 'utf8'));
  const file = input?.tool_input?.file_path;
  const root = process.env.CLAUDE_PROJECT_DIR ?? process.cwd();

  if (typeof file === 'string' && existsSync(file) && !file.includes('node_modules')) {
    const ext = extname(file);
    const bin = (name) => join(root, 'node_modules', '.bin', name);
    const run = (cmd, args) => {
      try {
        execFileSync(cmd, args, { cwd: root, stdio: 'ignore', timeout: 20_000 });
      } catch {
        // Unfixable lint errors or a parse error mid-edit: leave it for `pnpm check`.
      }
    };

    if (ESLINT_EXTS.has(ext)) run(bin('eslint'), ['--fix', '--no-warn-ignored', file]);
    if (PRETTIER_EXTS.has(ext)) run(bin('prettier'), ['--write', '--ignore-unknown', file]);
  }
} catch {
  // Malformed hook input: nothing to do.
}
process.exit(0);
