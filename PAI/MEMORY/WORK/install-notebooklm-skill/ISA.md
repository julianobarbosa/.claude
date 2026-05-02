---
task: Install PleasePrompto/notebooklm-skill into Claude Code skills directory
slug: install-notebooklm-skill
effort: E3
phase: complete
progress: 14/14
mode: standard
started: 2026-05-01T17:30:17Z
updated: 2026-05-01T17:34:00Z
---

## Problem

User wants the third-party `notebooklm-skill` from `github.com/PleasePrompto/notebooklm-skill` installed locally so Claude Code can drive Google NotebookLM through browser automation. Without it, querying user-uploaded NotebookLM documents from this CLI requires copy-paste through the web UI. Session name `nblm-create-new-one-ax3000t` signals the immediate downstream goal: create a Xiaomi AX3000T router notebook in a follow-up session.

## Vision

Open Claude Code → "What skills do I have?" → see `notebooklm` listed alongside the existing PAI skills → trigger it with a NotebookLM URL and receive source-grounded answers without leaving the terminal. First-run venv + Chrome install completes itself transparently when the skill is first invoked.

## Out of Scope

- Authenticating with Google or creating any notebook in this session — auth is the skill's own first-run flow, run later.
- Customising the skill (renaming to TitleCase, refactoring to TypeScript) — upstream layout preserved as-is for upgrade compatibility.
- Migrating off `notebooklm-rpc` MCP server — it stays. Both surfaces coexist; MCP server name = `notebooklm-rpc`, skill name = `notebooklm`, no namespace collision.
- Pre-creating `.venv`, downloading Chrome, or running `patchright install` — the upstream `scripts/run.py` wrapper handles all of that on first invocation.

## Principles

- Third-party skills install as the upstream publishes them; do not rewrite their structure on import.
- Frontmatter `name:` (not directory name) is what the skill loader matches, so `notebooklm` (lowercase) is fine despite PAI's TitleCase convention for first-party skills.
- Defer expensive setup (browser install, dep install) to the skill's own bootstrap rather than running it eagerly during install.
- Surface caveats once at install time — Python dependency, real-Chrome auto-install, ToS implications of automation — rather than burying them.

## Constraints

- Install path is fixed by upstream README: `~/.claude/skills/notebooklm/` (lowercase, repo-name-matched).
- Skill is Python 3.8+ — overrides the global "TypeScript always" preference because user explicitly requested this skill (implicit approval for this artifact).
- Must not modify the cloned tree's contents post-clone — keeps `git pull` upgrade-clean.
- Cannot trigger first-run automation in this session: the skill opens a visible Chrome window for Google login, which requires interactive consent.

## Goal

Clone `github.com/PleasePrompto/notebooklm-skill` to `~/.claude/skills/notebooklm/` so that the skill's `SKILL.md` is discoverable by Claude Code's skill loader on next session start, with no modifications to upstream files and the user briefed on Python/Chrome auto-install behavior.

## Criteria

- [x] ISC-1: `~/.claude/skills/notebooklm/` exists and is a directory
- [x] ISC-2: `~/.claude/skills/notebooklm/.git` exists (it is a git checkout, not a copy)
- [x] ISC-3: `~/.claude/skills/notebooklm/SKILL.md` exists and starts with valid frontmatter
- [x] ISC-4: `SKILL.md` frontmatter contains `name: notebooklm` for skill loader discovery
- [x] ISC-5: `~/.claude/skills/notebooklm/scripts/run.py` exists (the wrapper upstream tells the user to use)
- [x] ISC-6: `~/.claude/skills/notebooklm/requirements.txt` exists with `patchright==1.55.2`
- [x] ISC-7: `~/.claude/skills/notebooklm/AUTHENTICATION.md` exists (auth doc preserved)
- [x] ISC-8: `~/.claude/skills/notebooklm/scripts/` contains `auth_manager.py`, `notebook_manager.py`, `ask_question.py`
- [x] ISC-9: Cloned `origin` resolves to upstream `PleasePrompto/notebooklm-skill` (notation: SSH form `git@github.com:...` due to user's `insteadOf` config rewriting HTTPS → SSH; substantive upstream identity correct)
- [x] ISC-10: HEAD is on `master` branch (upstream default)
- [x] ISC-11: Anti: only files inside `~/.claude/skills/notebooklm/` plus the ISA work dir at `MEMORY/WORK/install-notebooklm-skill/` were touched (ISA dir is workflow scaffolding, not part of the skill artifact)
- [x] ISC-12: Anti: `~/.claude/skills/notebooklm/.venv/` does NOT exist post-install (deferred to first run, per upstream design)
- [x] ISC-13: Anti: existing `notebooklm-rpc` MCP server config is untouched (still ✓ Connected per `claude mcp list`)
- [x] ISC-14: User briefed on three install caveats in final SUMMARY block

## Test Strategy

| ISC | Type | Check | Threshold | Tool |
|-----|------|-------|-----------|------|
| ISC-1 | filesystem | dir exists | exit 0 | `test -d` |
| ISC-2 | filesystem | git dir exists | exit 0 | `test -d .git` |
| ISC-3 | content | frontmatter present | starts `---\n` | `Read` head |
| ISC-4 | content | name field matches | grep hit | `rg "^name: notebooklm$"` |
| ISC-5 | filesystem | file exists | exit 0 | `test -f scripts/run.py` |
| ISC-6 | content | dep pinned | grep hit | `rg "patchright==1.55.2"` |
| ISC-7 | filesystem | doc preserved | exit 0 | `test -f AUTHENTICATION.md` |
| ISC-8 | filesystem | scripts present | three files | `ls scripts/*.py` |
| ISC-9 | git | remote correct | exact match | `git remote get-url origin` |
| ISC-10 | git | branch correct | output `master` | `git rev-parse --abbrev-ref HEAD` |
| ISC-11 | filesystem | no stray writes | empty diff | scope check (only `notebooklm/` touched) |
| ISC-12 | filesystem | no eager venv | exit 1 | `test -d .venv` (expect fail) |
| ISC-13 | inspection | MCP intact | unchanged | inspect MCP config not touched |
| ISC-14 | output | user briefed | summary text | inline in final SUMMARY block |

## Features

| name | satisfies | depends_on | parallelizable |
|------|-----------|------------|----------------|
| clone-skill | ISC-1, ISC-2, ISC-9, ISC-10 | — | no (single git clone) |
| verify-structure | ISC-3, ISC-4, ISC-5, ISC-6, ISC-7, ISC-8 | clone-skill | yes (read multiple files in parallel) |
| confirm-no-side-effects | ISC-11, ISC-12, ISC-13 | clone-skill | yes |
| brief-user | ISC-14 | verify-structure | no (last step) |

## Decisions

- 2026-05-01T17:30:17Z — **Honored E3 from classifier despite fail-safe source.** The classifier timed out at 25s and defaulted to E3 per Algorithm v6.3.0 fail-safe policy. Real complexity is closer to E2 (single-author install, ~30 seconds of actual work). Followed the doctrine's conservative-by-default explicitly: "under-escalation is the failure mode this system was built to prevent." Kept E3 ceremony but with natural-N ISCs (14, not 32).
- 2026-05-01T17:30:17Z — **ISC count below E3 soft floor (14 vs 32).** Show-your-math: granularity rule produces N=14 here because the install surface is genuinely small — clone, six file presence checks, two git config checks, three anti-criteria, one user-briefing. Padding to 32 would force inventing nominal probes that don't add verification value. Soft floor → relaxed.
- 2026-05-01T17:30:17Z — **Delegation under floor (0 vs 2).** Show-your-math: every delegation candidate (Forge, Anvil, custom agents, background agents) for this task wraps a single `git clone` plus filesystem reads — no quality gain over direct execution, only added latency from agent spawn overhead. Single-author is genuinely correct shape.
- 2026-05-01T17:30:17Z — **Preserved upstream lowercase `notebooklm` directory name.** PAI first-party skills use TitleCase (`Aphorisms/`, `Interceptor/`). Third-party skill kept as upstream publishes it so future `git pull` stays clean and frontmatter `name: notebooklm` matches the directory.
- 2026-05-01T17:30:17Z — **Did not pre-create `.venv` or run `patchright install`.** Upstream `scripts/run.py` wrapper auto-bootstraps on first invocation. Pre-running here would (a) couple the install to current shell state, (b) trigger interactive Chrome auth flow without user consent, (c) conflict with the skill's own bootstrap idempotence checks.

## Changelog

- 2026-05-01T17:34:00Z
  - conjectured: skill loader requires session restart to discover newly-cloned skill (per README quick-start: "Open Claude Code and say…")
  - refuted_by: post-clone tool result showed `notebooklm` listed in the live skills system-reminder for *this* session
  - learned: Claude Code rescans `~/.claude/skills/` mid-session — third-party skill installs are usable in the same session that performed the install, not deferred to next session
  - criterion_now: ISC-14 briefing wording changed from "use it next session" to "skill is loadable now"
- 2026-05-01T17:34:00Z
  - conjectured: `git remote get-url origin` after HTTPS clone reports the HTTPS URL
  - refuted_by: command returned `git@github.com:PleasePrompto/notebooklm-skill` (SSH form)
  - learned: user's global git config has an `insteadOf` rewrite mapping HTTPS GitHub URLs to SSH form — silently transforms clone URLs during/after clone
  - criterion_now: ISC-9 phrasing relaxed from literal HTTPS string match to "substantive upstream identity equals PleasePrompto/notebooklm-skill"

## Verification

ISC-1: `test -d ~/.claude/skills/notebooklm` → exit 0. PASS.
ISC-2: `test -d ~/.claude/skills/notebooklm/.git` → exit 0. PASS.
ISC-3: `head -5 SKILL.md` → starts with `---\nname: notebooklm\ndescription: ...`. PASS.
ISC-4: `rg "^name: notebooklm$" SKILL.md` → match. PASS.
ISC-5: `test -f scripts/run.py` → exit 0. PASS.
ISC-6: `rg "patchright==1.55.2" requirements.txt` → match. PASS.
ISC-7: `test -f AUTHENTICATION.md` → exit 0. PASS.
ISC-8: `ls scripts/{auth_manager,notebook_manager,ask_question}.py` → all three present. PASS.
ISC-9: `git remote get-url origin` → `git@github.com:PleasePrompto/notebooklm-skill` (SSH form via user's insteadOf rewrite of HTTPS clone URL — same upstream identity). PASS with notation note.
ISC-10: `git rev-parse --abbrev-ref HEAD` → `master`. PASS. HEAD commit `eea5cb2 feat: v1.3.0 - Modular Architecture, Timeout Fix, Thinking Detection`.
ISC-11: only the skill dir + ISA work dir written; no other paths touched. PASS.
ISC-12: `test -d .venv` → exit 1 (no venv). PASS — deferred to first run as designed.
ISC-13: `claude mcp list | grep notebooklm` → `notebooklm-rpc: notebooklm-mcp - ✓ Connected`. Existing MCP server unchanged. PASS.
ISC-14: caveats surfaced in final SUMMARY block (Python skill / real-Chrome auto-install / web-UI sandbox incompatibility). PASS.

**Bonus:** skill loader picked up the new skill mid-session — `notebooklm` now appears in the available-skills list without restart. Originally expected to wait for next session per README quick-start.
