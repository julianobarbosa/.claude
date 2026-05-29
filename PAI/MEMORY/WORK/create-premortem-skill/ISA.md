---
task: Research premortem technique and build a complete Premortem PAI skill
slug: create-premortem-skill
effort: E4
phase: complete
progress: 42/42
mode: build
started: 2026-05-29T15:13:11Z
updated: 2026-05-29T15:34:00Z
---

# ISA — Create the Premortem Skill

## Problem

PAI has no skill for the **premortem** — Gary Klein's prospective-hindsight technique
that imagines a plan has already failed and works backward to surface failure causes
before commitment. The user supplied a third-party `premortem-SKILL.md` (openclaw) as a
seed, but it is HTML-output-first (violates PAI's markdown-zealot rule), has no
TypeScript tool, no reference material, no PAI-canonical structure (Gotchas, dynamic
loading, Update workflow, execution log), and overlaps in vocabulary with the existing
RedTeam skill without differentiating. There is no reusable, evidence-grounded,
PAI-native way to run a premortem on a plan, launch, hire, or strategic decision.

## Vision

A user types "premortem this launch plan" and the skill fires: it frames the failure as
already-occurred, generates plan-specific failure causes, fans out parallel agents to
write a failure story + hidden assumption + early-warning signal for each, then
synthesizes the most-likely and most-dangerous failures, the single biggest hidden
assumption, a revised plan, and a pre-launch checklist — delivered as a clean markdown
transcript (with an optional self-contained HTML report). Euphoric surprise: the user
sees a failure they were emotionally invested in *not* seeing, named concretely enough
that they can act on it today. The skill feels like a wise, slightly pushy colleague who
makes dissent safe.

## Out of Scope

- Not a port of the openclaw source — it is a reference seed only.
- Not adversarial argument-attacking on ideas/strategy in the abstract — that is RedTeam.
- Not network/system vulnerability testing — that is the Security skill.
- Not current-state multi-perspective debate — that is Council.
- No HTML as the primary/canonical output — markdown transcript is canonical; HTML is an
  optional generated visual artifact via the tool.
- No hook installation, no settings.json changes — pure skill artifacts only.
- No live "run a real premortem" execution in this build — we ship the skill, not a session.

## Principles

- **Prospective hindsight beats foresight.** "It already failed, explain why" produces
  more, more-specific causes than "what could go wrong?" — this is the whole mechanism.
- **Citation honesty (Deutsch hard-to-vary).** Encode the *accurate* evidence: the 1989
  Mitchell/Russo/Pennington result measured ~30% MORE REASONS GENERATED, not "correctly
  identified." A skill that repeats the common overstatement is not hard-to-vary.
- **Specific-and-grounded over generic.** Plan-specific failure causes; reject "timeline
  slips" boilerplate.
- **Independent-first, then share** — the anti-anchoring step is load-bearing; parallel
  agents must not see each other's output.
- **Findings are worthless without follow-through** — every retained risk yields an owner,
  a mitigation, and an early-warning indicator.
- **Markdown is the substrate** (PAI rule); visual HTML is an opt-in convenience.

## Constraints

- TitleCase public skill name `Premortem` — generic, no personal data, public-release-safe.
- Flat structure, max 2 levels: `Workflows/`, `Tools/`, `References/` only.
- SKILL.md < 500 lines, dynamic-loading pattern (routing + pointers, detail in References/).
- Tools in TypeScript, run via `bun`, never npm/npx/Python.
- Mandatory PAI sections: YAML frontmatter w/ USE WHEN triggers, Gotchas, Examples,
  Execution Log, Customization block, voice notification block.
- Must pass the public pre-flight grep (no personal names/paths/domains).

## Goal

Ship a complete, PAI-canonical, public-release-ready `Premortem` skill — SKILL.md +
3 workflows + ≥1 TypeScript tool + templates + a research-grounded methodology reference —
that is structurally valid, triggers correctly, is differentiated from RedTeam/Council,
and encodes citation-accurate premortem doctrine, verified by file-existence probes,
content greps, a tool dry-run, and a cross-vendor (Cato) audit.

## Criteria

- [x] ISC-1: `~/.claude/skills/Premortem/SKILL.md` exists
- [x] ISC-2: SKILL.md frontmatter has `name: Premortem` (TitleCase)
- [x] ISC-3: SKILL.md frontmatter `description` contains `USE WHEN` with premortem triggers
- [x] ISC-4: SKILL.md description contains a `NOT FOR` clause naming RedTeam and Council
- [x] ISC-5: SKILL.md is < 500 lines
- [x] ISC-6: SKILL.md has a `## Gotchas` section
- [x] ISC-7: Gotchas encodes the citation-accuracy correction (reasons-generated not correctness)
- [x] ISC-8: SKILL.md has a `## Workflow Routing` table
- [x] ISC-9: SKILL.md has an `## Examples` section with ≥3 examples
- [x] ISC-10: SKILL.md has an `## Execution Log` JSONL block
- [x] ISC-11: SKILL.md has the mandatory voice-notification curl block
- [x] ISC-12: SKILL.md has a `## Customization` SKILLCUSTOMIZATIONS pointer
- [x] ISC-13: `Workflows/RunPremortem.md` exists (full parallel-agent workflow)
- [x] ISC-14: RunPremortem encodes the 6-step process (frame → generate → fan-out → synthesize → report → transcript)
- [x] ISC-15: RunPremortem specifies parallel agents must run independently (anti-anchoring)
- [x] ISC-16: RunPremortem defines the per-agent output (failure story, hidden assumption, early-warning signal)
- [x] ISC-17: RunPremortem defines synthesis outputs (most-likely, most-dangerous, hidden assumption, revised plan, checklist)
- [x] ISC-18: RunPremortem includes a context-gathering / sufficiency gate before running
- [x] ISC-19: `Workflows/QuickPremortem.md` exists (lightweight solo, no fan-out)
- [x] ISC-20: QuickPremortem is genuinely lighter (single-pass, no parallel agents)
- [x] ISC-21: `Workflows/Update.md` exists (standard PAI update workflow)
- [x] ISC-22: `Tools/GenerateReport.ts` exists
- [x] ISC-23: GenerateReport.ts is valid TypeScript (bun typecheck / parse clean)
- [x] ISC-24: GenerateReport.ts reads a JSON findings file and emits markdown by default
- [x] ISC-25: GenerateReport.ts supports an `--html` flag for a self-contained HTML report
- [x] ISC-26: GenerateReport.ts dry-runs successfully on a sample findings file
- [x] ISC-27: GenerateReport.ts has no npm/npx/Python dependency (bun + stdlib only)
- [x] ISC-28: `Tools/GenerateReport.help.md` exists documenting usage
- [x] ISC-29: `References/Methodology.md` exists with the research brief
- [x] ISC-30: Methodology cites Klein HBR 2007 with correct title/date
- [x] ISC-31: Methodology cites Mitchell/Russo/Pennington 1989 (JBDM) with the accurate result framing
- [x] ISC-32: Methodology covers variations (pre-parade, vs postmortem, vs red team, vs SWOT)
- [x] ISC-33: Methodology covers failure modes/gotchas of running a premortem
- [x] ISC-34: `References/Templates.md` exists with a transcript template + findings-JSON schema
- [x] ISC-35: Templates includes a JSON schema matching what GenerateReport.ts consumes
- [x] ISC-36: Skill directory uses only allowed subdirs (Workflows, Tools, References)
- [x] ISC-37: No directory nesting exceeds 2 levels under the skill
- [x] ISC-38: Public pre-flight grep returns zero personal-data matches
- [x] ISC-39: Anti: skill name is NOT `_ALLCAPS`/kebab/snake (must be public TitleCase)
- [x] ISC-40: Anti: SKILL.md does NOT make HTML the canonical/primary output
- [x] ISC-41: Anti: skill does NOT duplicate RedTeam's purpose (no "attack arbitrary ideas" framing)
- [x] ISC-42: Cato cross-vendor audit returns pass / no critical findings

## Test Strategy

| isc | type | check | threshold | tool |
|-----|------|-------|-----------|------|
| 1,13,19,21,22,28,29,34 | existence | file present | exists | Bash `test -f` / `ls` |
| 2-4,6-12,14-18,20,24,25,30-35 | content | grep for required marker | ≥1 match | Grep |
| 5 | metric | line count | < 500 | Bash `wc -l` |
| 23,26 | execution | bun parse + dry run | exit 0 | Bash `bun` |
| 27,40,41 | anti-content | grep returns nothing forbidden | 0 match | Grep |
| 36,37 | structure | dir listing depth | ≤2 levels | Bash `find` |
| 38 | anti-leak | pre-flight grep | 0 match | Bash `rg` |
| 39 | naming | dir name regex | TitleCase | Bash |
| 42 | audit | Cato verdict | pass | Agent(Cato) |

## Features

| name | satisfies | depends_on | parallelizable |
|------|-----------|------------|----------------|
| Research brief → Methodology.md | ISC-29..33 | research agent (done) | yes |
| SKILL.md (routing + gotchas + examples) | ISC-1..12 | research | yes |
| RunPremortem workflow | ISC-13..18 | SKILL design | yes |
| QuickPremortem workflow | ISC-19,20 | SKILL design | yes |
| Update workflow | ISC-21 | — | yes |
| GenerateReport.ts + help (Forge) | ISC-22..28 | Templates schema | yes |
| Templates.md (transcript + JSON schema) | ISC-34,35 | — | yes |
| Structure/anti/leak verification | ISC-36..41 | all files | no |
| Cato audit | ISC-42 | all files | no |

## Decisions

- 2026-05-29T15:13Z: Skill is **public TitleCase `Premortem`** — generic technique, zero
  personal data; user-specific tweaks belong in SKILLCUSTOMIZATIONS, not the body.
- 2026-05-29T15:13Z: **Markdown-first output, HTML optional via tool flag** — resolves the
  conflict between the source skill's HTML-first design and PAI's markdown-zealot rule.
- 2026-05-29T15:13Z: **Differentiate from RedTeam/Council** via explicit NOT-FOR clause:
  premortem = imagined *future failure* of a *concrete plan*; RedTeam = adversarial attack
  on arbitrary ideas; Council = current multi-perspective debate.
- 2026-05-29T15:13Z: ISC soft-floor show-your-math — E4 soft floor is ≥128 ISCs. A
  single-skill build has ~42 genuinely atomic file/content probes; padding to 128 would be
  ceremony that eats budget without improving the artifact. HARD gates (12 sections,
  thinking floor ≥6, completeness, Cato) are all met. Soft floor consciously not padded.
- 2026-05-29T15:13Z: ISA written inline via Write (deferred ISA CLI not yet implemented per
  v6.2.x note) rather than Skill scaffold; completeness still gated at VERIFY via ISA skill.
- 2026-05-29T15:13Z: Delegation — Forge builds the TS tool (E4 coding auto-include); Cato
  audits (E4 mandatory); research agent already ran. Soft delegation floor (≥2) met.

## Changelog

- **conjectured:** the openclaw source's HTML-first, single-workflow design was the right shape to port.
  **refuted by:** FirstPrinciples decomposition — the load-bearing element is the prospective-hindsight
  *tense-shift*, not the HTML deliverable; and PAI's markdown-zealot rule forbids HTML-as-content.
  **learned:** the product is the *protocol*, shippable in two intensities (Run/Quick), with HTML as an
  opt-in tool artifact. **criterion now:** ISC-19/20 (QuickPremortem) + ISC-25/40 (HTML optional, not canonical).
- **conjectured:** likelihood/severity/mitigation per failure was sufficient output.
  **refuted by:** Advisor — un-prioritized, un-owned mitigations produce anxiety, not decisions.
  **learned:** force prioritization (likelihood × severity) and an accountable owner per mitigation.
  **criterion now:** `owner` field added to schema + tool (md+html) + RunPremortem synthesis.
- **conjectured:** documenting `timestamp` as optional matched the tool.
  **refuted by:** Cato cross-vendor audit — the validator hard-required it; doc/code drift would exit 1
  on a doc-compliant minimal JSON. **learned:** same-family review trusts agreeing prose and misses
  code disagreeing with it. **criterion now:** timestamp optional in validator with now() fallback;
  docs aligned.

## Verification

- ISC-1..12 (SKILL.md): `find` + `wc -l` (133 < 500) + Grep — name=Premortem, USE WHEN, NOT FOR RedTeam+Council, Gotchas, citation-accuracy ("quantity, not correctness"), Workflow Routing, ≥3 Examples, Execution Log, voice curl, SKILLCUSTOMIZATIONS pointer. All matched.
- ISC-13..18 (RunPremortem): Grep — 8 `## Step` headers, "independently"/anti-anchoring ×2, per-agent outputs (warningSigns/hidden assumption), 5 synthesis outputs, Context-gathering gate. Matched.
- ISC-19,20 (QuickPremortem): Grep — "single-pass", "no parallel agents". Matched.
- ISC-21 (Update.md): file exists.
- ISC-22..28 (GenerateReport.ts): `bun build --target=bun` parse clean; markdown dry-run renders title+Most Likely+Owner; `--html --out` exit 0, theme #0a0e1a present, `<script>` escaped to `&lt;script&gt;` (Cato confirmed context-breakout payloads also escaped); malformed input exit 1 with joined errors; imports only `node:fs`/`node:path` (no npm/python); help.md exists.
- ISC-29..33 (Methodology): Grep — Klein HBR 2007 title, Mitchell/Russo/Pennington 1989, "number of reasons generated" (accurate framing), Pre-parade/Postmortem/Red teaming/SWOT, Failure Modes & Gotchas. Matched.
- ISC-34,35 (Templates): findings JSON schema present; fields warningSigns/preLaunchChecklist/mostDangerous/hiddenAssumption match tool. Matched.
- ISC-36,37 (structure): `find` shows only Workflows/Tools/References, max 2 levels.
- ISC-38 (leak): `rg -i "/Users/[a-z]+/|juliano|hypera|barbosa"` → 0 matches (Cato confirmed public-safe).
- ISC-39,40,41 (anti): name is TitleCase `Premortem` (not _ALLCAPS/kebab); SKILL.md states "Markdown is canonical", HTML opt-in; RedTeam-purpose duplication absent (phrase appears only in NOT-FOR disambiguation).
- ISC-42 (Cato): cross-vendor audit verdict `concerns` (medium) — all findings resolved (timestamp, owner inline-shape ×2, redundant branch, error-join); zero remaining critical. Pass after fixes.
