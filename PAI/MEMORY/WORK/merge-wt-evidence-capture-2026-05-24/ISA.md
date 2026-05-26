---
task: Merge worktree hypera-golden-image-story-12-1-evidence-capture to main and clean up
slug: merge-wt-evidence-capture-2026-05-24
effort: E3
phase: complete
progress: 9/9
mode: algorithm
started: 2026-05-24T23:05:00Z
updated: 2026-05-24T23:05:00Z
---

## Problem

A worktree at `.claude/worktrees/hypera-golden-image-story-12-1-evidence-capture` carries one unmerged commit (`0b835fa feat(bmad): install next` — Story 12-1 evidence doc, +139/-59 in `docs/azure/alz-bootstrap-evidence-12-1.md`) plus one uncommitted fix to `.claude/settings.json` that replaces a hardcoded stale-worktree path with `$CLAUDE_PROJECT_DIR`. The branch and `main` diverged (PR 78 landed on main meanwhile). The worktree, the local branch, and the remote branch all need to come down after merge.

## Vision

After this run: `main` contains the evidence-capture commit plus a portable settings.json hook; the worktree directory is gone; no branch named `hypera-golden-image-story-12-1-evidence-capture` exists locally or on origin; `git worktree list` shows three entries instead of four.

## Out of Scope

- Editing the evidence-capture doc itself
- Rebasing the branch (use merge commit to preserve context)
- Force-pushing main
- Touching any other worktree
- Squashing the two commits into one (merge commit boundary keeps story-12-1 evidence traceable)

## Constraints

- Branch and main diverged → merge commit (`--no-ff`) is the only safe path; FF would lose PR 78 (it wouldn't — FF would be refused — but a `--ff-only` attempt would fail loudly, which is fine)
- Origin is Azure DevOps via SSH (`git@ssh.dev.azure.com-hypera:...`). Per project CLAUDE.md, OAuth Bearer fallback exists if SSH fails
- Pre-commit hooks may fire on unrelated files; project CLAUDE.md authorizes `--no-verify` if failure is on files not in `--cached`

## Goal

Merge the worktree branch into main (preserving the uncommitted settings.json fix as a committed change first), push main to origin, remove the worktree, delete the branch locally and on origin — all without losing work, force-pushing, or leaving dangling state.

## Criteria

- [ ] ISC-1: Uncommitted `.claude/settings.json` change committed on `hypera-golden-image-story-12-1-evidence-capture` with descriptive message (probe: `git -C <wt> log -1 --stat` shows the file)
- [ ] ISC-2: Local `main` confirmed at the same SHA as `origin/main` before merge (probe: `git rev-parse main` == `git rev-parse origin/main`)
- [ ] ISC-3: Branch merged into `main` via `--no-ff` (probe: `git -C <main> log -1` shows a merge commit referencing the branch name)
- [ ] ISC-4: `main` pushed to `origin/main` successfully (probe: `git -C <main> rev-parse main` == `git -C <main> rev-parse origin/main` post-push)
- [ ] ISC-5: Worktree directory `.claude/worktrees/hypera-golden-image-story-12-1-evidence-capture` removed from disk (probe: `test ! -d <path>`)
- [ ] ISC-6: `git worktree list` no longer lists the worktree (probe: `git -C <main> worktree list | grep -c hypera-golden-image-story-12-1-evidence-capture` == 0)
- [ ] ISC-7: Local branch deleted (probe: `git -C <main> branch --list <branch>` empty)
- [ ] ISC-8: Remote branch deleted on origin (probe: `git ls-remote --heads origin <branch>` empty)
- [ ] ISC-9: Anti: no force-push, no destructive op on main, no work lost (probe: reflog shows only `merge` and `commit` for main in this session)

## Test Strategy

| isc | type | check | threshold | tool |
|-----|------|-------|-----------|------|
| 1 | git | last commit on branch touches `.claude/settings.json` | 1 file | `git log -1 --stat` |
| 2 | git | local main SHA == origin/main SHA pre-merge | exact match | `git rev-parse` |
| 3 | git | merge commit exists with `--no-ff` shape | 2 parents | `git log -1 --pretty=%P` |
| 4 | git | push reported success and SHAs match | exit 0, SHAs match | `git push origin main` |
| 5 | fs | worktree dir absent | absent | `test -d` |
| 6 | git | worktree list lacks entry | count 0 | `git worktree list \| grep` |
| 7 | git | local branch list empty for branch | empty | `git branch --list` |
| 8 | git | remote heads list empty for branch | empty | `git ls-remote --heads` |
| 9 | git | reflog for main has only merge ops | no resets | `git reflog main` |

## Features

| name | satisfies | depends_on | parallelizable |
|------|-----------|------------|----------------|
| commit-settings-fix | ISC-1 | — | no |
| verify-main-clean | ISC-2 | — | yes (with commit-settings-fix) |
| merge-no-ff | ISC-3 | commit-settings-fix, verify-main-clean | no |
| push-main | ISC-4 | merge-no-ff | no |
| remove-worktree | ISC-5, ISC-6 | merge-no-ff (so branch is merged) | yes (with push-main) |
| delete-local-branch | ISC-7 | remove-worktree | no |
| delete-remote-branch | ISC-8 | push-main | yes (with delete-local-branch) |
| safety-audit | ISC-9 | all above | no |

## Decisions

- 2026-05-24: **Inline ISCs / waive ISA-skill scaffold subagent.** Show-your-math: pure procedural git, deterministic 9-ISC decomposition, fits in this transcript; skill-subagent invocation adds ~30s for zero correctness benefit. Doctrine v6.3.0 E2+ rule waived with this entry.
- 2026-05-24: **Delegation soft floor (E3 ≥2) waived.** Single-author git plumbing; Forge/Engineer/Plan add latency with zero correctness gain on `git merge --ff-only` + `git worktree remove`. Logged.
- 2026-05-24: **Commit uncommitted settings.json change rather than discard.** Diff replaces a hardcoded stale-worktree path with `$CLAUDE_PROJECT_DIR` — unambiguously correct. User said "merge this wt" which includes worktree state.
- 2026-05-24: **`--no-ff` merge instead of rebase.** Branch and main diverged; merge commit preserves the story-12-1 context boundary; no need to rewrite history.
- 2026-05-24: **Effort source = classifier fail-safe (E3, timeout).** Honored verbatim per v6.3.0 override hierarchy; conversation-context override is escalation-only.

## Changelog

(populated at LEARN)

## Verification

- ISC-1: git log -1 — commit `df02024` "chore(hooks): use $CLAUDE_PROJECT_DIR for story-automator stop hook" touches `.claude/settings.json` (1 file, +1/-1)
- ISC-2: git rev-parse — local main `09089415...` == origin/main `09089415...` pre-merge
- ISC-3: git log -1 --pretty='%P' — merge commit `92c7ab3` parents `0908941 df02024` (2 parents → --no-ff confirmed)
- ISC-4: git push — `0908941..92c7ab3  main -> main`; post-push `git rev-parse main` == `git rev-parse origin/main` == `92c7ab33...`
- ISC-5: test ! -d — worktree path absent on disk
- ISC-6: git worktree list | grep -c — count of branch-name entries = 0
- ISC-7: git branch --list — empty
- ISC-8: git ls-remote --heads origin <branch> — empty; push output: `[deleted] hypera-golden-image-story-12-1-evidence-capture`
- ISC-9: git reflog main — only `merge … 'ort' strategy` entry this session; no resets, no force-push, no work lost

## Changelog

- 2026-05-24: conjectured: branch could fast-forward to main; refuted_by: `git merge-base --is-ancestor main HEAD` returned non-zero; learned: PR 78 had landed on main while branch was open; criterion_now: use `--no-ff` merge commit rather than FF.
- 2026-05-24: conjectured: main worktree was clean; refuted_by: `git -C $MAIN_WT status --short` showed `M .claude/settings.json` identical to the branch's uncommitted; learned: dup uncommitted across worktrees signals a hook-path generalization is overdue everywhere; criterion_now: revert dup before merge so the same content lands cleanly via the merge commit.
- 2026-05-24: doctrine note: classifier returned `fail-safe E3` due to 25s inference timeout; honored verbatim per v6.3.0 override hierarchy (escalation-only). Surface to user as potential doctrine refinement: allow downgrade when SOURCE=fail-safe AND conversation context is unambiguously procedural.

