---
task: complete Story 1.1 Custo Tagueado DAX measures deployment
slug: 20260430-082600_story-1-1-custo-tagueado-dev-completion
effort: standard
phase: blocked
progress: 10/14
mode: interactive
started: 2026-04-30T08:26:00-03:00
updated: 2026-04-30T08:28:00-03:00
---

## Context

Story 1.1 adds two DAX measures (`Custo Tagueado %` and `Custo Sem Tag`) to the HyperaFinOps semantic model. The TMDL file was updated from git history and committed in `91019bb` alongside story docs. The measures are in the local TMDL file and in git. Remaining work: verify the measures exist in Power BI Service (via browser), trigger a dataset refresh, confirm the Feb 2026 reference totals hold, add a card visual to verify the percentage renders, and close out all story tasks.

### Risks

- The TMDL in git may not match what's in the PBI Service semantic model if a PBIP sync was not completed
- The Power BI Service may not reflect the local TMDL changes without an explicit publish/sync step
- The "finops-powerbi" path uses `HyperaFinOps.SemanticModel` but the story references "Azure Cost Management App With Dashboard" — workspace name vs PBIP folder name difference
- Dataset refresh may fail if gateway is not available or CSV path is misconfigured
- AC4 commit message convention (`feat(dax):`) was not followed — measure was in a "docs:" commit; this is a convention gap, not a functional gap

## Criteria

- [x] ISC-1: `Custo Tagueado %` measure exists in `_Measures.tmdl` with exact formula [E]
- [x] ISC-2: `Custo Tagueado %` formatString is `0.0%;-0.0%;0.0%` in TMDL [E]
- [x] ISC-3: `Custo Tagueado %` displayFolder is `Conformidade Tags` in TMDL [E]
- [x] ISC-4: `Custo Tagueado %` lineageTag is `m-custo-tagueado-pct` in TMDL [E]
- [x] ISC-5: `Custo Sem Tag` measure exists in `_Measures.tmdl` with exact formula [E]
- [x] ISC-6: `Custo Sem Tag` formatString is `R$ #,##0` in TMDL [E]
- [x] ISC-7: `Custo Sem Tag` displayFolder is `Conformidade Tags` in TMDL [E]
- [x] ISC-8: `Custo Sem Tag` lineageTag is `m-custo-sem-tag` in TMDL [E]
- [ ] ISC-9: Both measures visible in Power BI Service Manage measures UI [E]
- [ ] ISC-10: Dataset refresh completes without errors in Power BI Service [E]
- [ ] ISC-11: `Custo Tagueado %` renders as percentage (not BLANK/ERROR) in card visual [E]
- [ ] ISC-12: Post-refresh Marketplace total equals R$ 45,326 [E]
- [ ] ISC-13: Post-refresh Usage total equals R$ 1,458,793 [E]
- [ ] ISC-14: Story file all tasks checked and status set to `review` [E]
- [x] ISC-A1: No report.json, no PQ files, no other TMDL files modified in same commit [E]
- [x] ISC-A2: Reservation/RI tiles NOT added to dashboard [E]

## Decisions

- AC4 commit convention gap: The TMDL was committed in `91019bb` as "docs:" commit. Since rewriting history on main is destructive and the semantic isolation was respected (no report.json/PQ/other TMDL), this is accepted as-is. A note will be added to story completion notes.
- Reference totals verification (AC3: Marketplace R$45,326 / Usage R$1,458,793) depends on dataset refresh completing. If scheduled refresh already ran, these may already be current.

## Verification

