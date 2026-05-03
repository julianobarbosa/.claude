# Plan — Recommended PAI Packs for Juliano's Box

## Context

You asked "what the best Packs I need in my box." Two facts shape the answer:

1. **You already have all 45 individual skills installed** in `~/.claude/skills/` — verified by directory listing. This is not a fresh install; it's a curation question.
2. **TELOS is still bootstrap-sample** (`PRINCIPAL_IDENTITY.md`, `MISSION.md`, `GOALS.md` are all placeholders). Without your real mission/goals, domain-specific recommendations (e.g., pharma/Hypera-aligned packs) cannot be made with confidence — they would be guesses.

The Packs/ directory contains 51 entries: 45 individual skills + 6 curated bundles (Agents, ContentAnalysis, Investigation, Media, Research, Scraping, Telos, Thinking, Utilities — all complete with INSTALL.md/VERIFY.md/src/).

So this plan answers two practical questions:
- **Tier 1 — High-leverage core**: which packs deliver the most value across almost any work, regardless of domain
- **Tier 2 — Workflow match**: which packs match your visible recent activity (NotebookLM exploration, security/MDATP scans, skill development, Adversarial Reviews)
- **Deferred**: domain-specific recommendations after `/interview` populates TELOS

## Recommendation Buckets

### Bucket A — Foundational (use these constantly, master them first)

| Pack | Why it's foundational |
|------|----------------------|
| **ISA** | Owns the universal "done" primitive. Every Algorithm run touches it. Non-negotiable. |
| **ContextSearch** | Cold-start recovery across session registry, ISAs, work directories. Saves rediscovery. |
| **Interceptor** | CLAUDE.md mandates Interceptor (not agent-browser) for ALL web verification. Without it, "verified" claims are hollow. |
| **Delegation** | Six parallelization patterns. Without this, you single-thread work that should fan out. |
| **PAIUpgrade** | Continuous self-improvement of PAI itself. Compounds over time. |
| **Interview** | The bootstrap path that turns sample TELOS into your real Life OS. **Run this next.** |
| **Telos** | The Life OS itself. Foundational once Interview populates it. |

### Bucket B — Thinking depth (Algorithm thinking-floor enforcers)

The v6.3.0 Algorithm closed-enumeration thinking capabilities — these are the only names that count toward the HARD thinking floor at E2+. Keep installed:

- **FirstPrinciples**, **SystemsThinking**, **RootCauseAnalysis**, **Council**, **RedTeam**, **Science**, **BeCreative**, **Ideate**, **BitterPillEngineering**, **Evals**, **WorldThreatModel**, **ApertureOscillation**, **IterativeDepth**, **Fabric**

You already have all of these. **Action: none — keep all.**

### Bucket C — Matches your visible work patterns

From recent `MEMORY/WORK/` slugs (notebooklm exploration, mdatp-fullscan, install-notebooklm-skill) and the `add-pai-packs` worktree:

| Pack | Rationale |
|------|-----------|
| **CreateSkill** | You're actively packaging skills (notebooklm install). Use its validate/canonicalize workflows. |
| **CreateCLI** | If skill-dev grows into deployable tools. |
| **Browser** + **Interceptor** | NotebookLM is web-driven; both are required. |
| **Research** (skill + bundle) | Quick/Standard/Extensive/Deep modes — picks the right depth automatically. |
| **ExtractWisdom** | NotebookLM consumes content; Wisdom turns transcripts/docs into structured insight. |
| **RedTeam** | The recurring "Adversarial Review working tree diff" requests in your relationship notes ARE this pack. Make sure you invoke `Skill("RedTeam", "adversarial analysis of <target>")` rather than re-rolling the workflow each time. |

### Bucket D — Bundles you don't have (consider installing)

You have every individual skill but no bundle wrappers. Bundles install multiple related packs in one wizard:

| Bundle | Bundles in | Worth installing if... |
|--------|-----------|------------------------|
| **ContentAnalysis** | ExtractWisdom + supporting | You ingest a lot of long-form content (talks, podcasts, articles) |
| **Investigation** | PrivateInvestigator + supporting | You do people/identity research often |
| **Media** | Art + Remotion + diagram tooling | You produce visuals/video regularly |
| **Scraping** | BrightData + Apify | You scrape across multiple platforms regularly |
| **Thinking** | First Principles + Council + RedTeam + Science + BeCreative | Convenience grouping; redundant if you already have all five |
| **Utilities** | CreateCLI + CreateSkill + Fabric + Browser + 513 files | Convenience grouping; very large, redundant for you |

**Recommendation: skip bundles.** You already have every constituent skill. Bundles add directory clutter without adding capability. Install one only if you want a deterministic install for a fresh machine or to share with someone.

### Bucket E — Domain-specific (DEFERRED — needs `/interview`)

Cannot recommend pharma-specific or Hypera-aligned packs without TELOS populated. Examples that *might* be relevant once your goals are clear:

- **USMetrics** — US economic indicators. Likely irrelevant for Brazilian pharma; **uninstall candidate** unless you have specific US-investing or US-macro use cases.
- **Aphorisms**, **Daemon**, **Sales**, **WriteStory** — depend entirely on whether you do public writing, brand work, or sales narrative.

**Action:** run `/interview` first, then revisit.

### Bucket F — Likely safe to uninstall (clutter reduction)

If your installed skills directory is feeling heavy and you want to prune, these are the lowest-marginal-value for someone in your visible profile:

- **USMetrics** — US-specific macro data, Brazilian pharma focus makes this near-zero value
- **Aphorisms** — unless you publish quote-driven content
- **Sales** — unless you build sales decks/narrative regularly
- **Daemon** — public daemon profile; only valuable if you publish a public AI presence

**Verify before removing:** check `MEMORY/WORK/` for any past invocation of these — if you've used a skill in the last 90 days, keep it.

## Critical Files to Reference

- `/Users/juliano.barbosa/Repos/github/Personal_AI_Infrastructure/Packs/README.md` — canonical pack inventory
- `/Users/juliano.barbosa/.claude/skills/` — your currently-installed skills (47 entries verified)
- `/Users/juliano.barbosa/.claude/PAI/USER/TELOS/` — bootstrap-sample, run `/interview` to personalize
- `/Users/juliano.barbosa/.claude/PAI/MEMORY/WORK/` — recent project slugs (signal for which skills get used)

## Verification

How you'll know these recommendations were right:

1. **Foundational set in active use** — every multi-file work session invokes ISA, ContextSearch, and Interceptor at least once.
2. **Thinking floor met without phantom names** — Algorithm runs at E3+ select 4+ thinking capabilities from the closed enumeration without hitting "phantom thinking capability" failures.
3. **`/interview` completed within 30 days** — the bootstrap-sample TELOS is replaced with your real mission/goals/constraints, unlocking domain-specific recommendations.
4. **Pruning sanity check** — for each Bucket F candidate, run `rg -l "Skill.*<PackName>" ~/.claude/PAI/MEMORY/WORK/` — zero hits over 90 days = safe to uninstall.

## What This Plan Does NOT Do

- Does not install or remove anything (read-only plan).
- Does not assume what your Hypera role actually is — that requires `/interview`.
- Does not recommend new packs to author — only ranks what already exists.

## Suggested Next Action

Run `/interview` (you already have the Interview skill installed). Once TELOS is populated, regenerate `PRINCIPAL_TELOS.md` and ask me again — I will then give domain-tailored Bucket-E recommendations with confidence.
