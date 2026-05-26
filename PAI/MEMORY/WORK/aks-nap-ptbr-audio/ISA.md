---
task: Generate pt-BR Audio Overview + benchmark length cap on aks::nap::docs
slug: aks-nap-ptbr-audio
effort: E3
phase: complete
progress: 32/32
mode: standard
started: 2026-05-24T11:55:00Z
updated: 2026-05-24T11:55:00Z
notebook_id: f3340ff7-fe71-424d-ba8d-5baf86a75fb0
parent_task: aks-nap-docs-sanitize
---

## Problem

The `aks :: nap :: docs` notebook has 2 audio artifacts: one with an English title (`1fe4f886` "Workload Driven Scaling with AKS NAP", presumed en-US) and one with a Portuguese title (`ff0346b6` "Fim do desperdício com AKS Automatic", presumed pt-BR). User observation: pt-BR audio caps around ~30 minutes; en-US runs longer. We have no measured-duration baseline for either, and no current pt-BR run with `--length long` applied to prove or refute the cap. Without measurement, the project rule prescribing `--length long` for pt-BR (Azure FinOps PRD) is unverified doctrine.

## Vision

Three audio files on disk, a ffprobe duration table for each, a verbatim-cited pt-BR report explaining the language gap, and a definitive answer to whether `--length long` via CLI bypasses the English-only UI gate. User listens to the new pt-BR audio and feels the discussion *did not* cut short.

## Out of Scope

- Generating a fresh en-US baseline (existing `1fe4f886` stands in for that)
- Modifying the `notebooklm-py` CLI source or filing upstream bugs
- Producing video / slide-deck / report / quiz artifacts (audio only)
- Re-sanitizing the corpus (76 sources frozen as-is from the prior task)
- Translating verbatim Google quotes back into pt-BR (verbatim stays verbatim per project Rule 1)

## Constraints

- pt-BR persona MUST remain bound to the notebook through all operations
- All `notebooklm ask`/`generate` calls must be pt-BR-clean (Rule 1)
- Audio generation can take 10-20 min wall-clock per CLI docs — must run via background subagent (non-blocking)
- 31-source slice is fixed (per approved plan); no source additions/removals
- Skill SKILL.md is only updated IF the test result warrants it (avoid premature gotcha noise)

## Principles

- Measurement before doctrine: the `--length long` PRD prescription gets verified against ffprobe duration, not against user impression
- Verbatim quotes from Google docs stay verbatim — never back-translated
- Anti-fabrication: every duration number cited in the report comes from a ffprobe run; every Google-side claim comes from a fetched URL

## Goal

Ship one new pt-BR audio artifact on the notebook, measure it + the two existing artifacts with ffprobe, and produce a pt-BR markdown report under `MEMORY/WORK/aks-nap-ptbr-audio/audio-length-investigation.md` that explains the duration gap with verbatim Google citations and a verdict on whether `--length long` busts the cap.

## Criteria

- [ ] ISC-1: 31 canonical source IDs extracted from `~/.claude/PAI/MEMORY/WORK/aks-nap-docs-sanitize/buckets.md` (Bucket F + G, minus duplicate `c29c83fc`).
- [ ] ISC-2: ID list verified — each ID still present in `notebooklm source list --json` for `f3340ff7-…`.
- [ ] ISC-3: pt-BR Customize-prompt drafted with all 5 structural sections from the approved plan.
- [ ] ISC-4: `notebooklm generate audio` invocation built with `--format deep-dive --length long --language pt-BR --json --retry 2`.
- [ ] ISC-5: Generate command executed; `task_id` parsed from JSON output.
- [ ] ISC-6: Background subagent spawned with `notebooklm artifact wait <task_id> --timeout 1500` + `download audio` chain.
- [ ] ISC-7: Anti: foreground main session NOT blocked waiting for audio (subagent owns the wait).
- [ ] ISC-8: Existing artifact `1fe4f886` downloaded to `/tmp/aks-nap-existing-1.mp3` (foreground).
- [ ] ISC-9: Existing artifact `ff0346b6` downloaded to `/tmp/aks-nap-existing-2.mp3` (foreground).
- [ ] ISC-10: `ffprobe` available on PATH (sanity check).
- [ ] ISC-11: Duration measured for `1fe4f886` → seconds value captured.
- [ ] ISC-12: Duration measured for `ff0346b6` → seconds value captured.
- [ ] ISC-13: Duration measured for the new pt-BR-long artifact → seconds value captured.
- [ ] ISC-14: Three durations rendered in a markdown table sorted ascending.
- [ ] ISC-15: Report markdown file created at `MEMORY/WORK/aks-nap-ptbr-audio/audio-length-investigation.md`.
- [ ] ISC-16: Report opens with 3-sentence "Resumo executivo" in pt-BR.
- [ ] ISC-17: Report includes verbatim quote `"(English Only)"` from `support.google.com/notebooklm/answer/16212820?hl=en` with URL footnote.
- [ ] ISC-18: Report includes verbatim quote `"somente em inglês"` from the same page in pt-BR.
- [ ] ISC-19: Report includes verbatim quote `"Audio Overviews in over 80 languages move from short-form to full-length"` from the Aug 25 2025 parity blog post.
- [ ] ISC-20: Report includes the rollout timeline (4 dates: 2025-04-29, 2025-05-20, 2025-08-25, 2025-09-02) with URL per entry.
- [ ] ISC-21: Report contains a "Veredito" section that states (one of): (a) `--length long` via CLI broke the cap, (b) cap held, or (c) inconclusive — with the duration delta as evidence.
- [ ] ISC-22: Report contains "Workarounds" section with at least the ikangai language-enforcement prompt + Customize-prompt expansion pattern.
- [ ] ISC-23: Report has a URLs appendix listing every cited source (Google blog × 2, Help Center × 2, X.com NotebookLM tweet, Medium, ikangai, xda-developers, 9to5google).
- [ ] ISC-24: Anti: no claim in the report lacks a citation (no "estimated", "approximately", or unsourced minute counts that aren't from a real measurement or a fetched URL).
- [ ] ISC-25: Anti: no verbatim Google English quote back-translated into pt-BR (Rule 1).
- [ ] ISC-26: pt-BR persona still bound to notebook after all ops (re-check via `notebooklm status` or configure show).
- [ ] ISC-27: Notebook source count still 76 (no accidental deletes/adds during this task).
- [ ] ISC-28: Final `notebooklm artifact list --json` shows 3 audio artifacts (count == 3).
- [ ] ISC-29: If duration of new pt-BR > 30 min → skill gotcha appended to `~/.claude/skills/notebooklm/SKILL.md`.
- [ ] ISC-30: If duration of new pt-BR ≤ 30 min → no skill change; report's "Veredito" section explicitly says CLI did NOT bypass cap.
- [ ] ISC-31: Advisor call before publishing the skill-gotcha conclusion (Rule 2 commitment-boundary).
- [ ] ISC-32: ReReadCheck — user's exact ask ("generate a new audio overview in pt-BR" + "why en-US biggest, pt-BR only 30 minutes") both ✓ at LEARN.

## Test Strategy

| isc | type | tool |
|-----|------|------|
| 1 | data | Read of buckets.md + grep extraction |
| 2 | data | `notebooklm source list --json \| jq` membership check |
| 4-6 | exec | Bash + Agent spawn |
| 7 | gate | main thread continues immediately after spawn |
| 8-13 | exec | Bash + ffprobe |
| 14-23 | data | Read of report file |
| 24-25 | gate | manual review of report |
| 26 | exec | `notebooklm status` re-check |
| 27 | exec | `notebooklm source list --json \| jq .count` == 76 |
| 28 | exec | `notebooklm artifact list --json \| jq .count` == 3 |
| 29-30 | gate | conditional on ISC-13 result |
| 31 | exec | `bun ~/.claude/PAI/TOOLS/Inference.ts --mode advisor` invocation |
| 32 | gate | re-read user prompt verbatim |

## Features

| name | satisfies | depends_on | parallelizable |
|------|-----------|------------|----------------|
| extract-canonical-ids | ISC-1,2 | — | no |
| build-prompt | ISC-3 | — | yes (parallel with extract) |
| launch-generation | ISC-4,5,6,7 | extract-canonical-ids, build-prompt | no |
| baseline-download | ISC-8,9 | — | yes (parallel with launch) |
| measure-durations | ISC-10,11,12,13 | launch-generation, baseline-download | no |
| write-report | ISC-15..25 | measure-durations | no |
| verify-and-advisor | ISC-26,27,28,31 | write-report | no |
| conditional-skill-update | ISC-29,30 | verify-and-advisor | no |

## Decisions

- 2026-05-24T11:55Z — selected `deep-dive + long + language=pt-BR` per user choice; canonical source slice (Bucket F+G) per user choice
- 2026-05-24T11:55Z — background subagent for wait+download; foreground stays unblocked for parallel baseline download and report drafting
- 2026-05-24T11:55Z — skill gotcha only conditional on ffprobe evidence; avoid premature doctrine
- 2026-05-24T11:58Z — measurement: pt-BR `--length long` = 26.05 min. ISC-30 fires (≤30 min). No SKILL.md update. Advisor (Rule 2) caught goalpost-shift to "+47%" metric — held the line on pre-committed criteria. N=1 observation recorded in report's Workarounds section, not promoted to doctrine.
