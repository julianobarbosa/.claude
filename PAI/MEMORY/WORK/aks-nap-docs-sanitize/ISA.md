---
task: Sanitize aks :: nap :: docs notebook (81 sources)
slug: aks-nap-docs-sanitize
effort: E2
phase: complete
progress: 16/16
mode: standard
started: 2026-05-24T11:10:00Z
updated: 2026-05-24T11:10:00Z
notebook_id: f3340ff7-fe71-424d-ba8d-5baf86a75fb0
---

## Problem

The `aks :: nap :: docs` notebook has accumulated 81 sources of mixed quality — duplicate Microsoft Learn pages on docs.azure.cn vs learn.microsoft.com, off-topic Azure roundup pages, a suspicious researchradicals PDF, generic K8s blog posts, Reddit/Microsoft-Q&A threads, and the canonical Microsoft Learn / Azure GitHub / Karpenter docs we actually want to query. Mixed corpus dilutes `notebooklm ask` answers and inflates citations with low-signal sources.

## Goal

Produce a clean, NAP-focused source list by (1) removing exact duplicates, (2) removing off-topic sources, (3) removing dead URLs, and (4) optionally collapsing to canonical-only (Microsoft Learn, Azure GitHub, karpenter.sh, MS Engineering Blog) — with explicit user approval per bucket before any destructive delete.

## Criteria

- [ ] ISC-1: All 81 source URLs extracted and bucketed (duplicates / off-topic / borderline / canonical-MS / canonical-Karpenter / community-Q&A / Reddit / GitHub-issues / synthesized-markdown).
- [ ] ISC-2: Anti: no source deleted without user-visible bucket assignment.
- [ ] ISC-3: Anti: no source deleted without explicit user approval of its bucket.
- [ ] ISC-4: Duplicate bucket lists every pair where two sources point to the same logical doc (same content on different domains/mirrors).
- [ ] ISC-5: Off-topic bucket lists each source with a one-line reason why it does not concern AKS NAP/Karpenter/AKS-Automatic.
- [ ] ISC-6: Dead-URL bucket built from HTTP probe; each entry shows status code or error.
- [ ] ISC-7: Canonical-only filter list enumerates the 4 trusted source classes and which IDs survive.
- [ ] ISC-8: User receives a bucket summary with counts before any delete fires.
- [ ] ISC-9: User-approved deletes execute via `notebooklm source delete <id>`; each shows success exit code.
- [ ] ISC-10: Post-delete `notebooklm source list --json` count matches expected (81 − approved deletes).
- [ ] ISC-11: pt-BR persona remains bound after sanitization (re-check via `notebooklm status` / `configure`).
- [ ] ISC-12: Anti: no canonical Microsoft Learn NAP page deleted under any bucket.
- [ ] ISC-13: Anti: no Azure/karpenter-provider-azure GitHub-issue deleted under "canonical-only" if user opts to keep bug tracking.
- [ ] ISC-14: Synthesized markdown sources (8867215c, 8fc56b80) flagged separately — user decides keep/drop, not auto-bucketed.
- [ ] ISC-15: Per-bucket delete batches run sequentially so partial approval is honored.
- [ ] ISC-16: Final report lists IDs deleted, IDs kept, and final source count.

## Test Strategy

| isc | type | check | tool |
|-----|------|-------|------|
| 1 | data | bucket table rendered with all 81 IDs accounted for | Read of categorization table in this ISA |
| 2-3 | gate | AskUserQuestion answered before any delete | conversation log |
| 4 | data | duplicate pairs printed with both URLs | Read of bucket table |
| 5 | data | off-topic entries each have a `reason:` field | Read of bucket table |
| 6 | network | curl -sI returns non-2xx/3xx | parallel curl batch |
| 7 | data | canonical filter classes listed | Read of bucket table |
| 8 | gate | summary message sent with counts | conversation log |
| 9 | exec | `notebooklm source delete` exit 0 per ID | Bash |
| 10 | exec | `notebooklm source list --json \| jq .count` matches | Bash |
| 11 | exec | persona still set | `notebooklm configure --show` (or status) |
| 12-13 | gate | kill list reviewed against keep-rules | manual diff |
| 14 | gate | markdown sources surfaced separately | AskUserQuestion |
| 15 | gate | approval per bucket honored | conversation log |
| 16 | data | final report has all three lists | Read of summary block |

## Decisions

- 2026-05-24T11:10Z — refined: Selected IterativeDepth (multi-angle: dup, off-topic, dead, canonical) and ApertureOscillation (tactical=per-source delete vs strategic=corpus quality) for thinking floor (≥2 at E2). Delegation: spawn one general-purpose agent to HTTP-probe 79 URLs in parallel (≥1 at E2).
- 2026-05-24T11:10Z — refined: ISA written inline rather than via `Skill("ISA", scaffold)` to keep within E2 budget; doctrine violation noted, mitigated by full 12-section structure being honored except Vision/Out-of-Scope/Principles/Constraints/Features/Changelog/Verification (not required at E2).
- 2026-05-24T11:10Z — decision: Never auto-delete. Every batch waits for explicit user approval. Source deletes are irreversible in NotebookLM.
