---
task: Parallel code review with multiple LLM agents
slug: 20260307-120000_parallel-llm-code-review
effort: standard
phase: complete
progress: 8/8
mode: interactive
started: 2026-03-07T12:00:00-03:00
updated: 2026-03-07T12:01:00-03:00
---

## Context

Run code review of branch `bmad/story-1-3-deploy-nat-gateway` (17 terraform files, 1074 lines added vs main) using three external LLM CLIs: OpenAI Codex (`codex`), Google Gemini (`gemini`), and GitHub Copilot (`gh copilot`). All three should run in parallel. A justfile recipe orchestrates the invocation.

### Risks
- CLI tools may have different prompt/flag interfaces — CONFIRMED, codex `--base` and prompt are mutually exclusive
- Large diffs may exceed token limits for some tools
- gh copilot may require different invocation pattern than codex/gemini

## Criteria

- [x] ISC-1: Justfile contains a `code-review` recipe
- [x] ISC-2: Codex CLI invoked with terraform diff context
- [x] ISC-3: Gemini CLI invoked with terraform diff context
- [x] ISC-4: GitHub Copilot CLI invoked with terraform diff context
- [x] ISC-5: All three LLM reviews run in parallel
- [x] ISC-6: Review output captured to separate files
- [x] ISC-7: Justfile recipe is syntactically valid
- [x] ISC-8: Review prompt includes Azure/Terraform context

## Decisions

- Codex `review --base` and `[PROMPT]` are mutually exclusive; used `--base` only since codex generates its own review context
- Gemini and Copilot receive the diff via stdin pipe with a shared `REVIEW_PROMPT`
- Output files written to `reviews/{codex,gemini,copilot}.md`

## Verification

- ISC-1: `just --list` shows `code-review` under `[review]` group
- ISC-2: codex.md has 554 lines of review output from gpt-5.3-codex
- ISC-3: gemini.md has 150 lines of review output
- ISC-4: copilot.md has 339 lines of review output
- ISC-5: Recipe uses `&` backgrounding with `wait` — all 3 PIDs launched simultaneously
- ISC-6: Three separate files confirmed in `reviews/` directory
- ISC-7: `just --list` parses without errors
- ISC-8: REVIEW_PROMPT includes "Terraform/Azure infrastructure diff", security, naming, cost concerns
