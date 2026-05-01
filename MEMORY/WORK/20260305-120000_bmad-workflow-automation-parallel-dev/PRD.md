---
task: BMAD workflow automation and parallel dev improvements
slug: 20260305-120000_bmad-workflow-automation-parallel-dev
effort: advanced
phase: build
progress: 0/28
mode: interactive
started: 2026-03-05T12:00:00-03:00
updated: 2026-03-05T12:01:00-03:00
---

## Context

Implement a 7-change plan across 2 repos to eliminate BMAD workflow friction identified in a 169-session insights report. The plan addresses wrong_approach (#1 friction, 24 instances), 13% not_achieved sessions, tmux parallelization breaks, and pre-commit hook waste. Changes 1-4 target the project repo, changes 5-7 target the claude-code-skills repo.

### Risks
- Code-review instructions.xml has XML structure that must be maintained
- Sprint-status instructions.md mixes markdown and XML — edits must preserve structure
- Skills repo Execute.md and Merge.md are workflow docs — changes must be coherent with existing flow
- Agent Teams feature is experimental — must keep tmux as fallback

### Plan
Parallelize: Changes 1-4 (project repo) and changes 5-7 (skills repo) are independent and can run in parallel via a team. Within each group, changes are also independent.

## Criteria

- [ ] ISC-1: Root CLAUDE.md exists at project root
- [ ] ISC-2: CLAUDE.md contains action-first rule to read sprint-status.yaml
- [ ] ISC-3: CLAUDE.md contains pre-commit bypass protocol for untouched files
- [ ] ISC-4: CLAUDE.md contains workflow chaining hints after CR and DS
- [ ] ISC-5: CLAUDE.md contains worktree conventions with branch naming
- [ ] ISC-6: CLAUDE.md contains project structure reference section
- [ ] ISC-7: Code-review has auto-epic completion logic after line 199
- [ ] ISC-8: Auto-epic extracts epic number from story_key
- [ ] ISC-9: Auto-epic scans all stories for that epic in development_status
- [ ] ISC-10: Auto-epic updates epic to done when all stories done
- [ ] ISC-11: Auto-epic outputs notification of auto-transition
- [ ] ISC-12: Code-review has workflow chaining step after step 5 output
- [ ] ISC-13: Workflow chaining presents 3 options to user
- [ ] ISC-14: Workflow chaining suggests command without auto-invoking
- [ ] ISC-15: Sprint-status has epic auto-fix in risk detection section
- [ ] ISC-16: Epic auto-fix detects all-stories-done but epic still in-progress
- [ ] ISC-17: Epic auto-fix auto-corrects and reports as fixed
- [ ] ISC-18: Execute.md has Agent tool invocation with worktree isolation
- [ ] ISC-19: Execute.md keeps tmux as documented fallback
- [ ] ISC-20: Execute.md detects CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS env var
- [ ] ISC-21: Execute.md execution state includes agent_type field
- [ ] ISC-22: Merge.md has Step 5a for self-healing merge
- [ ] ISC-23: Self-healing auto-accepts sprint-status.yaml status changes
- [ ] ISC-24: Self-healing accepts additive terraform module blocks
- [ ] ISC-25: Self-healing has retry pattern with merge abort then rebase
- [ ] ISC-26: Self-healing flags for manual intervention on rebase failure
- [ ] ISC-27: SKILL.md has Execution Modes table in Quick Reference
- [ ] ISC-28: Execution Modes table documents Agent Teams and tmux modes
- [ ] ISC-A-1: No existing workflow behavior is broken
- [ ] ISC-A-2: Workflow chaining does not auto-invoke workflows
