---
task: Deep comparison of tmux vs cmux multiplexers
slug: 20260410-tmux-vs-cmux-comparison
effort: extended
phase: complete
progress: 18/18
mode: interactive
started: 2026-04-10T00:00:00Z
updated: 2026-04-10T00:05:00Z
---

## Context

Juliano asked for a deep, web-researched comparison of tmux vs cmux with a recommendation. He has 187 tmuxp YAML configs, uses tmux daily for multi-stack context switching across Kubernetes, Azure, Terraform, Helm, and DevOps tooling. Migration cost is a critical implicit factor.

cmux is a new (Feb 2026) native macOS terminal by Manaflow (YC startup) built for AI agent orchestration using libghostty. It is NOT a general tmux replacement — it targets a specific niche of multi-agent AI development workflows.

### Risks
- cmux is only 2 months old — API/features may change rapidly
- cmux is macOS-only — no Linux/SSH server support
- User's 187 tmuxp configs represent massive investment in tmux ecosystem

## Criteria

- [x] ISC-1: Document covers cmux purpose and architecture [E]
- [x] ISC-2: Document covers tmux purpose and architecture [E]
- [x] ISC-3: Feature-by-feature comparison table present [E]
- [x] ISC-4: Platform support differences documented [I]
- [x] ISC-5: Session persistence comparison documented [I]
- [x] ISC-6: AI agent orchestration capabilities compared [I]
- [x] ISC-7: Plugin ecosystem comparison documented [I]
- [x] ISC-8: Performance and rendering comparison documented [R]
- [x] ISC-9: Notification system comparison documented [I]
- [x] ISC-10: Configuration approach comparison documented [I]
- [x] ISC-11: Community health and maturity compared [I]
- [x] ISC-12: Migration cost from tmux to cmux assessed [R]
- [x] ISC-13: Use case matrix with clear recommendations [E]
- [x] ISC-14: User-specific recommendation given 187 tmuxp configs [R]
- [x] ISC-15: Sources and URLs cited [E]
- [x] ISC-16: Document saved in project directory [E]
- [x] ISC-A-1: Anti: No unsourced claims about cmux features [R]
- [x] ISC-A-2: Anti: No recommendation to fully replace tmux without justification [R]

## Decisions

- 2026-04-10: Output as markdown document in project worktree, not Obsidian vault — this is a dotfiles project comparison
- 2026-04-10: Both tools serve different purposes — document reflects complementary rather than replacement framing

## Verification

- ISC-1 through ISC-16: All sections present and verified by re-reading the document
- ISC-A-1: All cmux features traced to web research from 2 independent agents
- ISC-A-2: Document explicitly recommends "keep tmux, add cmux" — no replacement suggestion
