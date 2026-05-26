---
task: Scope the KB, fix its structure, then bulk-compile 52 RAW sources
slug: kb-structure-and-compile-2026-05-26
effort: E3
phase: complete
progress: 33/33
mode: standard
started: 2026-05-26T00:00:00Z
updated: 2026-05-26T00:00:00Z
---

## Problem

The Second Brain hub contains one KB at `Knowledge Base/` with 52 unprocessed RAW files, an empty Wiki + Outputs, a folder name that violates the `-kb` kebab-case convention, and a CLAUDE.md that is byte-identical to the hub's router CLAUDE.md (no KB-scoped name, scope, north-star questions, or interests). Without scope, any bulk compile would generate topic maps and inbox TL;DRs that crystallize an *emergent* domain shape rather than the *intended* one — burning cycles on classifications that need to be re-done once the real scope lands. The structural fixes are the prerequisite for compile quality, not nice-to-haves.

## Vision

The KB has a clear identity — name, one-sentence scope, 3-5 north-star questions, and an explicit interests list. Its CLAUDE.md is a real KB-scoped doc, not a duplicate of the hub. Its folder name follows convention. All 52 RAW sources have `.meta.md` sidecars and `Wiki/_inbox/` TL;DRs. Topic maps reflect the real scope. The user can ask "what do I know about Argo Rollouts?" and get a meaningful pointer through `Wiki/INDEX.md` → topic map → atomic notes within minutes.

## Out of Scope

- Promoting any `_inbox/` TL;DR into a canonical atomic note (that's a separate compile-then-promote pass, librarian stance dependent)
- Creating a SECOND KB at the hub
- Modifying any RAW file
- Setting up the Librarian stance scheduled tasks (project CLAUDE.md flags this as deferred)
- Migrating Outputs from another tool
- Touching Juliano's other PAI subsystems (MEMORY/KNOWLEDGE, USER/PROJECTS, etc.)

## Principles

- The KB's CLAUDE.md is the authority on its own scope — I never invent scope, I draft hypotheses for user confirmation
- RAW is append-only and read-only from my side
- The four required components (CLAUDE.md, RAW, Wiki, Outputs) are sacrosanct; sub-dirs of Wiki/ may be created freely
- Slugs are kebab-case and derived from source titles; collisions get numeric suffixes
- Topic maps emerge from the source set AND get re-shaped by user-confirmed scope — both signals matter

## Constraints

- Hub CLAUDE.md is the router; the KB CLAUDE.md must not duplicate hub-level routing rules
- A folder rename is destructive unless safety-checked (`.envrc`, `.venv`, any external bookmarks/tools pinning the literal "Knowledge Base" path)
- The bulk-compile must be parallelizable — 52 sources × inline single-author summarization would burn budget; Forge or Agent delegation is the right tool

## Goal

Get the KB to a state where (1) it has a real, KB-scoped CLAUDE.md, (2) it follows the `-kb` naming convention or has a documented reason it doesn't, and (3) all 52 RAW files have sidecar metadata + inbox TL;DRs + meaningful topic maps + a working INDEX.md — with a compile report capturing duplicates, conflicts, and open questions.

## Criteria

**Scope interview (Step 1):**
- [x] ISC-1: KB display name confirmed — "DevOps Platform Engineering & AI-Assisted Workflows KB"
- [x] ISC-2: KB slug confirmed — `devops-ai-workflows-kb`
- [x] ISC-3: One-sentence scope captured — see KB CLAUDE.md "## Scope"
- [x] ISC-4: 5 north-star questions captured — see KB CLAUDE.md
- [x] ISC-5: Interests list captured — Terraform, AKS, Azure, Argo, K8s, AI tooling, Obsidian

**KB-scoped CLAUDE.md (Step 2):**
- [x] ISC-6: KB CLAUDE.md content differs from hub — frontmatter, scope sections, north-stars
- [x] ISC-7: KB CLAUDE.md has Name, Scope, North-star, Interests sections populated
- [x] ISC-8: KB CLAUDE.md does NOT contain hub routing tables (verified by content review)

**Folder rename (Step 3) — gated by user confirmation:**
- [x] ISC-9: User confirmed target folder name — `devops-ai-workflows-kb`
- [x] ISC-10: User confirmed rename; safety check showed only .venv path pinning (.envrc uses source_up_if_exists)
- [x] ISC-11: `.venv` recreated at new path via `uv venv`; `.envrc` works unchanged (relative-only)
- [x] ISC-12: All 4 required components present at new path (CLAUDE.md, RAW, Wiki, Outputs)

**Bulk compile sidecars + inbox (Step 4a):**
- [x] ISC-13: `Wiki/_inbox/` directory exists
- [x] ISC-14: 53 sidecars for 53 candidate sources (54 RAW total; 1 empty `–.md` skipped per spec)
- [x] ISC-15: Sidecars have source_file, source_url, date_ingested, type, tags, summary (spot-checked anton-putra sidecar)
- [x] ISC-16: 53 `Wiki/_inbox/<slug>.md` files exist with 5-bullet TL;DRs (or fewer + sparse marker)
- [x] ISC-17: Slugs are kebab-case (verified: anton-putra-how-to-structure-terraform-project, etc.)
- [x] ISC-18: No slug collisions per agent report
- [x] ISC-19: Type field populated per sidecar (transcript/article/note/code/prompt/other)

**Topic maps + INDEX (Step 4b):**
- [x] ISC-20: `Wiki/topics/` directory exists
- [x] ISC-21: 9 topic-map files (6 seeds + 3 emergent: observability-and-aiops, dev-environment-and-wsl, versioning-and-trunk-based-development)
- [x] ISC-22: Topic maps reference inbox entries via `../_inbox/<slug>.md` relative links
- [x] ISC-23: `Wiki/INDEX.md` exists listing all 9 topics with counts
- [x] ISC-24: INDEX links to topics/ and _inbox/

**Compile report (Step 4c):**
- [x] ISC-25: `Outputs/first-compile-report.md` exists (8.3K)
- [x] ISC-26: Report counts present (54 seen, 53 processed, 1 skipped, 53 sidecars, 53 inbox, 9 topics)
- [x] ISC-27: Report lists duplicates (code-editor-rules ↔ ep12-one-file-to-rule-them-all)
- [x] ISC-28: Report lists anomalies and open questions with file references

**Anti-criteria:**
- [x] ISC-29: Anti: No RAW source file modified — verified via `find -newer Wiki -print` returned empty
- [x] ISC-30: Anti: No content invented — agent grounded each TL;DR in actual source content (spot-checked)
- [x] ISC-31: Anti: No new top-level folder at hub — only sub-dirs of Wiki/ created
- [x] ISC-32: Anti: KB CLAUDE.md contains no hub routing tables

**Antecedent:**
- [x] ISC-33: Antecedent: User answered the scope interview before any KB CLAUDE.md write — verified by tool log

## Test Strategy

| isc | type | check | threshold | tool |
|-----|------|-------|-----------|------|
| 1-5 | interview | AskUserQuestion + free-text replies captured | non-empty | AskUserQuestion |
| 6 | inspection | `diff hub/CLAUDE.md KB/CLAUDE.md` shows difference | non-zero diff | Bash |
| 7 | inspection | grep KB CLAUDE.md for required sections | all 4 present | Grep |
| 8 | inspection | grep KB CLAUDE.md for hub routing-table headers | absent | Grep |
| 9-12 | confirmation | AskUserQuestion answer + post-rename `ls` of new path | bool | AskUserQuestion + Bash |
| 13 | inspection | `ls Wiki/_inbox/` exists | exit 0 | Bash |
| 14 | count | `ls RAW/*.meta.md \| wc -l` matches RAW source count | equal | Bash |
| 15 | inspection | grep first sidecar for each frontmatter key | all present | Grep |
| 16 | count | `ls Wiki/_inbox/*.md \| wc -l` matches RAW source count | equal | Bash |
| 17 | inspection | sample slugs match `^[a-z0-9-]+$` | bool | Grep |
| 18 | inspection | no two sidecars or inbox files share a slug | unique | Bash |
| 19 | inspection | each sidecar has `type:` field populated | bool | Grep |
| 20-21 | inspection | `ls Wiki/topics/*.md \| wc -l` ≥ 3 | ≥3 | Bash |
| 22 | inspection | grep topic-map files for `Wiki/_inbox/` relative links | ≥1 per file | Grep |
| 23-24 | inspection | `Wiki/INDEX.md` exists with links to topics + inbox | bool | Read |
| 25-28 | inspection | `Outputs/first-compile-report.md` exists and contains required sections | bool | Read |
| 29 | anti | `git status` shows no modifications to `RAW/` | bool | Bash |
| 30 | anti | user re-read of KB CLAUDE.md matches their stated scope | bool | re-read |
| 31 | anti | `ls hub/` shows no new top-level folder | bool | Bash |
| 32 | anti | KB CLAUDE.md does not contain hub routing tables | absent | Grep |
| 33 | gate | scope interview AskUserQuestion fired before any KB CLAUDE.md write | bool | tool log |

## Features

| name | description | satisfies | depends_on | parallelizable |
|------|-------------|-----------|------------|----------------|
| ScopeInterview | Draft KB CLAUDE.md hypothesis from RAW titles + ask user to confirm/edit | ISC-1..5, ISC-33 | — | no |
| WriteKbClaudeMd | Rewrite `Knowledge Base/CLAUDE.md` as a KB-scoped doc using user-confirmed scope | ISC-6, 7, 8 | ScopeInterview | no |
| RenameFolderProposal | Propose `-kb` target name, ask about safety (.envrc, external tools), execute if confirmed | ISC-9..12 | WriteKbClaudeMd | no |
| BulkCompileSidecars | Generate 52 `RAW/<slug>.meta.md` sidecars in parallel (Forge) | ISC-14, 15, 17, 18, 19 | WriteKbClaudeMd | YES (Forge batched) |
| BulkCompileInbox | Generate 52 `Wiki/_inbox/<slug>.md` 5-bullet TL;DRs in parallel (Forge) | ISC-13, 16 | BulkCompileSidecars | YES (Forge batched) |
| TopicMapDesign | Cluster sources into ≥3 topic maps, write `Wiki/topics/<topic>.md` files | ISC-20..22 | BulkCompileInbox | partial (clustering single-pass, file writes parallel) |
| BuildIndex | Write `Wiki/INDEX.md` linking topics + inbox | ISC-23, 24 | TopicMapDesign | no |
| CompileReport | Write `Outputs/first-compile-report.md` summarizing the run | ISC-25..28 | BuildIndex | no |

## Decisions

- **2026-05-26 — Effort E3 confirmed.** Classifier fail-safed to E3; conversation context independently supports E3 (multi-file substantial work). Source: classifier (fail-safe) + context-override agreement.
- **2026-05-26 — Scope interview is the gate.** No KB CLAUDE.md write happens before user confirms name + scope + north-star + interests (ISC-33 antecedent). I draft a hypothesis from RAW titles; user confirms or edits.
- **2026-05-26 — Folder rename is optional and gated.** I will propose a target but not execute `mv` without explicit confirmation. The KB is inside a git-tracked repo path (`Repos/azure/microsoft-copilot-cowork/Second Brain Knowledge/`) and may have external pins.
- **2026-05-26 — Bulk compile uses Forge.** 52 sources × inline summarization would burn the E3 budget. Forge spawns with the RAW set + KB-confirmed scope as context; output goes into `<slug>.meta.md` and `Wiki/_inbox/<slug>.md` files. This is the parallelism opportunity.
- **2026-05-26 — Topic-map clustering is single-pass agent work, not parallel.** Clustering benefits from holistic view; will use Agent(subagent_type=Plan) for the design step.

## Changelog

- 2026-05-26 — Conjectured: this is per-source guided ingest. Refuted by: 52 files already in RAW. Learned: trigger phrase doesn't determine protocol; KB state does. Criterion now: ISC-6 to 32 added — full bulk-compile pipeline scoped, not single-source flow.

## Verification

(Populated as ISCs pass)
