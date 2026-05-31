# PAI Tool Update Workflow

> Repeatable steps for changing any `PAI/TOOLS/*.ts` tool. Derived from the
> tmux-notification refactor (commit `6849c51`). Goal: never claim a tool
> change works without tool-based evidence.

## When to use

Any edit to a file under `PAI/TOOLS/` — bug fix, refactor, feature, or
extracting shared logic. Scales down (one-line fix) and up (new shared module).

## Steps

### 1. Locate every copy
Logic in PAI tools is sometimes duplicated across files (e.g. `pai.ts` and
`algorithm.ts` each carried their own `getTmuxRef`). Before editing, find all
copies so they don't drift:
```bash
rg -n "<symbol>" PAI/ -g '*.ts' -g '!**/node_modules/**'
```
If duplicated, prefer extracting to a flat `PAI/TOOLS/<Name>.ts` module
(PascalCase, imported as `./<Name>` — matches `./Inference`, `./BillingPathAssertion`).

### 2. Make the change
Surgical edits only. Keep the existing runtime conventions of each file
(`spawnSync` from `bun` in some, `child_process` in others — both run under bun).

### 3. Orphan check
Confirm no dangling references to anything you removed/renamed:
```bash
rg -n "<removed-symbol>" PAI/TOOLS/<file>.ts   # expect: no matches
```
Also confirm imports you relied on are still used (no orphan imports created).

### 4. Typecheck every touched file
```bash
for f in <FileA> <FileB>; do
  bun build PAI/TOOLS/$f.ts --target=bun >/dev/null 2>&1 && echo "$f: OK" || echo "$f: BUILD ERROR"
done
```

### 5. Runtime test the behavior
Don't trust the typecheck alone — exercise the actual code path:
```bash
bun -e 'import { fn } from "./PAI/TOOLS/<Name>.ts"; console.log(fn());'
```
For UI/notification changes, capture the real output (e.g.
`tmux display-message -p "..."`) and compare before/after.

### 6. Commit — stage ONLY your files
The `~/.claude` working tree is noisy (runtime state, security logs, plugins).
**Never `git add -A`.** Stage explicit paths and verify:
```bash
git add PAI/TOOLS/<FileA> PAI/TOOLS/<FileB>
git diff --cached --name-only   # must list exactly your files
git commit -F - <<'EOF'
<type>(pai): <summary>
...
Signed-off-by: Juliano Barbosa <julianomb@gmail.com>
EOF
```
Pre-commit runs gitleaks + detect-secrets automatically. `~/.claude` commits
directly to `main` — no branches. No Claude Code attribution footers.

### 7. (Optional) Portable patch for reuse elsewhere
To carry a change to another PAI install or the public PAI repo:
```bash
git format-patch -1 <sha> -o PAI/PATCHES/
# apply elsewhere:  git am < PAI/PATCHES/0001-*.patch   (or: git apply <file>)
```

## Quick checklist
- [ ] All copies of the logic located (rg)
- [ ] Change made, conventions preserved
- [ ] Orphan check clean
- [ ] Every touched file typechecks (`bun build`)
- [ ] Runtime behavior verified with real output
- [ ] Only intended files staged (`git diff --cached --name-only`)
- [ ] Committed to `main`, secret scans passed
