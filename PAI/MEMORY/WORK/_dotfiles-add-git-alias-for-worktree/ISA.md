---
task: Curate git worktree aliases sample for dotfiles
slug: _dotfiles-add-git-alias-for-worktree
effort: E3
phase: observe
progress: 0/12
mode: standard
started: 2026-05-24T15:10:00Z
updated: 2026-05-24T15:10:00Z
effort_source: classifier
---

## Problem
Juliano's `~/.dotfiles/git/` directory has only a README — no actual git config or aliases checked in. His `~/.gitconfig` has 30+ aliases (st, co, cm, lg, etc.) but **zero coverage for `git worktree`**, which is the most operationally useful feature added to git in the last decade for branch-parallel work, agent worktrees (PAI's `isolation: "worktree"` pattern), and "test a PR without thrashing your main checkout." Every worktree operation today is typed in full, which is friction that makes the feature feel heavier than it is.

## Vision
A single, opinionated, copy-pasteable sample — short pure-git aliases for the common 80%, shell-backed aliases for the patterns git can't express alone (create-from-remote, branch-naming convention, status-across-worktrees), and a small set of shell functions for the operations that need `cd` (which git aliases cannot perform). Juliano reads it once, drops it into `~/.gitconfig`, and his next worktree session feels like every other git operation — three keystrokes, done.

## Out of Scope
- Building a worktree manager TUI.
- Replacing his existing aliases.
- Opinionating on worktree directory layout beyond a documented default he can override.
- Auto-installing into his live `~/.gitconfig` without his approval.

## Constraints
- Must work with stock git ≥ 2.5 (no plugins, no extensions).
- Aliases must coexist with his current `[alias]` block — no name collisions with `wt*` (verified: none exist).
- Shell helpers must work in zsh and bash without modification.
- File must live in `~/.dotfiles/git/` so it's version-controlled with the rest of his dotfiles.
- No npm/Python/extra binaries. `gh` is optional and gated.

## Goal
Produce `~/.dotfiles/git/worktree-aliases.md` containing: (a) a self-contained `[alias]` snippet ready to paste into `~/.gitconfig`, (b) a `worktree.sh` shell-function snippet for cd-requiring helpers, (c) a one-page workflow walkthrough demonstrating every alias on a realistic flow, and (d) installation instructions tailored to his existing setup. The sample is "great" iff a reader can copy two snippets and immediately work worktrees with three-letter commands.

## Criteria
- [ ] ISC-1: File exists at `/Users/juliano.barbosa/.dotfiles/git/worktree-aliases.md`.
- [ ] ISC-2: Contains a `[alias]` code block valid as gitconfig (no syntax errors when pasted).
- [ ] ISC-3: Includes pure alias `wt = worktree` as the base.
- [ ] ISC-4: Includes `wta` for add, `wtl` for list, `wtr` for remove, `wtp` for prune.
- [ ] ISC-5: Includes shell-backed alias (`!`-prefixed) for creating a worktree from a new branch with sibling-directory convention.
- [ ] ISC-6: Includes shell-backed alias for status across all worktrees.
- [ ] ISC-7: Includes a `gh`-backed alias for "checkout PR #N as a worktree", gated on `gh` presence.
- [ ] ISC-8: Includes a `worktree.sh` shell-function block with at least one function that performs `cd` (something git aliases cannot do).
- [ ] ISC-9: Documents the directory-layout convention (sibling `../<repo>-<branch>`) with rationale.
- [ ] ISC-10: Includes a workflow walkthrough that exercises ≥6 of the aliases in sequence.
- [ ] ISC-11: Includes installation instructions referencing his existing `~/.gitconfig` `[alias]` section.
- [ ] ISC-12: Anti: Does NOT modify `~/.gitconfig` or any other live config without explicit approval.

## Test Strategy
| isc | type | check | threshold | tool |
|-----|------|-------|-----------|------|
| ISC-1 | file-exists | `ls` returns 0 | exit=0 | Bash |
| ISC-2..11 | content-match | `grep` for distinctive tokens | each returns ≥1 line | Bash/Grep |
| ISC-12 | anti | `git -C ~ diff ~/.gitconfig` | empty diff | Bash |

## Features
| name | satisfies | depends_on | parallelizable |
|------|-----------|------------|----------------|
| Write worktree-aliases.md | ISC-1..11 | — | no |
| Verify no live-config mutation | ISC-12 | Write | no |

## Decisions
- 2026-05-24T15:10Z: **Tier respected as E3** (classifier returned E3 via fail-safe). Conversation-context override considered (request is a single-deliverable content task that could fit E2), but the deliverable warrants real curation (best-practice survey, naming-collision check, sibling-directory rationale, gh-gating) so E3 is honest.
- 2026-05-24T15:10Z: **Alias prefix `wt`** chosen over `w` (collides with `whatchanged`) and over `worktree` (defeats the purpose). Verified zero existing aliases starting with `wt` in `~/.gitconfig`.
- 2026-05-24T15:10Z: **Sibling-directory convention** (`../<repo>-<branch>`) chosen over nested (`./worktrees/<branch>`). Nested worktrees confuse path-walking tooling (ripgrep, fd, IDE indexers) and break `.gitignore` reasoning. Sibling is the community-standard pattern.
- 2026-05-24T15:10Z: **Show your math on delegation floor** — E3 soft floor is ≥2 delegations. Skipping: this is single-author content production drawing on well-established git knowledge, no parallelism opportunity, no need for Forge/Anvil/Cato. A Research-skill survey of "git worktree alias patterns" would add ceremony without changing the deliverable. Trade is: marginally less novel surface, fully met budget.

## Changelog
_(none — initial run)_

## Verification
_(populated in VERIFY phase)_
