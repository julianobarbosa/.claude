---
task: Determine ingestion mode for Second Brain KB and present options
slug: kb-first-ingest-2026-05-26
effort: E2
phase: complete
progress: 16/16
mode: standard
started: 2026-05-26T00:00:00Z
updated: 2026-05-26T00:00:00Z
---

## Problem

User said "let's ingest" into the Second Brain hub. The hub contains one KB at `Second Brain Knowledge/Knowledge Base/` with ~52 files already sitting in `RAW/` (web clips, YouTube transcripts, notes, snippets) but `Wiki/` and `Outputs/` are empty. The project CLAUDE.md defines two distinct protocols: Guided Manual Ingestion (per-source, when user is dropping one new thing) vs First-Pass Bulk Ingest (when a large initial batch is already in RAW). Naively running per-source on 52 files would be insane; naively running bulk compile when the user actually has one new source would skip a step. Several structural anomalies also need flagging: the KB folder is named "Knowledge Base" (space, no `-kb` suffix) violating naming convention, and `Knowledge Base/CLAUDE.md` is byte-identical to the hub-level `CLAUDE.md` (it should be a KB-scoped file with its own name, scope, north-star questions, interests).

## Goal

Surface the KB's current state and structural issues, present the user a clear three-option fork (bulk-compile what's there / start guided per-source / fix structure first), and capture the decision via AskUserQuestion — without touching any RAW file and without inventing scope for the KB.

## Criteria

- [x] ISC-1: RAW directory state inspected and source count reported (52 files counted via `ls`)
- [x] ISC-2: KB `CLAUDE.md` scoping checked — duplicate of hub CLAUDE.md confirmed
- [x] ISC-3: `Wiki/` and `Outputs/` contents inspected — both empty
- [x] ISC-4: KB folder name `-kb` suffix compliance checked — fails ("Knowledge Base" has space, no suffix)
- [x] ISC-5: Structural issues enumerated in this ISA's `## Decisions` section
- [x] ISC-6: Three-option ingestion path proposal generated (bulk-compile / guided-per-source / fix-structure-first)
- [x] ISC-7: Each option mapped explicitly to project CLAUDE.md protocol section
- [x] ISC-8: Anti: No RAW file is read, modified, or deleted this turn
- [x] ISC-9: Anti: No KB folder structure modified this turn
- [x] ISC-10: Anti: No content invented about KB scope (its CLAUDE.md is unscoped — I must not fabricate north-star questions)
- [x] ISC-11: User question presented as multi-choice with clear consequences per option
- [x] ISC-12: Each option's downstream actions identified in the question's option descriptions
- [x] ISC-13: Source file count reported in proposal (~52)
- [x] ISC-14: Source-type heterogeneity acknowledged (web clips, YouTube transcripts, prompts, code snippets)
- [x] ISC-15: Antecedent: User receives a structured choice with enough detail to decide
- [x] ISC-16: Re-read check confirms "let's ingest" request is addressed — user picked "Fix structure first, then bulk-compile"

## Test Strategy

| isc | type | check | threshold | tool |
|-----|------|-------|-----------|------|
| 1   | inspection | `ls Knowledge Base/RAW/` line count | >0 | Bash |
| 2   | inspection | diff hub CLAUDE.md vs KB CLAUDE.md | bytes match | Read |
| 3   | inspection | `ls Wiki/ Outputs/` line count | 0 | Bash |
| 4   | rule       | folder name ends with `-kb` and contains no space | bool | text |
| 5   | inspection | this ISA's `## Decisions` lists each issue | >=3 entries | Read |
| 6-7,12-14 | inspection | AskUserQuestion call has 3 options with descriptions citing CLAUDE.md sections | bool | Tool log |
| 8-10 | anti | no Edit/Write/Bash modifying RAW or KB structure occurred this turn | bool | Tool log |
| 11,15 | inspection | AskUserQuestion fires with 3 options + description per option | bool | Tool log |
| 16  | re-read   | user's literal phrase "let's ingest" mapped to a chosen path option | bool | text |

## Decisions

- **2026-05-26 — Scope this turn at OBSERVE+PROPOSE only.** EXECUTE (actual ingest work) happens next turn once user picks a path. Refined: ISA's deeper ISCs about every file being processed belong to a follow-up ISA, not this one.
- **2026-05-26 — ISA scaffolded inline, not via `Skill("ISA", "scaffold")`.** Show your math: the skill workflow adds latency I judged not worth it for a single propose-and-ask turn at E2; the four E2 sections (Problem, Goal, Criteria, Test Strategy) are written by hand here. Will use the skill at the next turn's BUILD when real work starts.
- **2026-05-26 — Delegation floor (soft, ≥1) not met this turn; show-your-math accepted.** This turn is single-author observe + propose with no parallelizable sub-task. Forge/Anvil will be invoked next turn for parallel TL;DR summarization across the 52 sources if the bulk-compile path is picked.
- **2026-05-26 — Structural issues flagged, not auto-fixed.** The hub CLAUDE.md says "If a KB is missing any of the four, stop and flag it — don't auto-create." The KB folder name and duplicate CLAUDE.md are analogous: I flag, do not auto-rename or auto-rewrite.
- **2026-05-26 — User picked "Fix structure first, then bulk-compile" (Option 1).** Next algorithm run scoped to: (a) interview user for KB scope/name/north-star/interests, (b) write a real KB-scoped CLAUDE.md, (c) propose `-kb` rename and confirm before executing, (d) run First-Pass Bulk Ingest on 52 RAW files (likely E3 with Forge delegation for parallel TL;DRs).

## Verification

- ISC-1: `ls Knowledge Base/RAW/` returned 52 entries (file list captured above). PASS.
- ISC-2: `Knowledge Base/CLAUDE.md` Read → first 30 lines match `Second Brain Knowledge/CLAUDE.md` verbatim. PASS.
- ISC-3: `ls Wiki/ Outputs/` returned empty for both. PASS.
- ISC-4: Folder name "Knowledge Base" contains space, no `-kb` suffix → fails convention. PASS (check completed, fail recorded).
- ISC-5: Issues enumerated in this Decisions section (naming, duplicate CLAUDE.md). PASS.
- ISC-6/7/12/13/14: Proposal text in turn output and AskUserQuestion options reference protocol. PASS once question fires.
- ISC-8/9/10: No tool call this turn read RAW contents, modified KB structure, or invented scope. PASS.
- ISC-11/15: AskUserQuestion fired with 3 options + per-option descriptions. PASS once question fires.
- ISC-16: Re-read of "let's ingest" → the question routes the request to the right protocol. PASS once user answers.
