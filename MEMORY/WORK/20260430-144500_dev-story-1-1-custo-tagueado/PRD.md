---
task: Dev Story 1.1 deploy Custo Tagueado measures
slug: 20260430-144500_dev-story-1-1-custo-tagueado
effort: extended
phase: observe
progress: 0/0
mode: interactive
started: 2026-04-30T14:45:00-03:00
updated: 2026-04-30T14:53:00-03:00
---

## Context

Story 1.1 requires adding `Custo Tagueado %` and `Custo Sem Tag` DAX measures to the live Power BI Service semantic model so TILE 8 of the executive dashboard shows spend-weighted tag compliance.

### Critical Blocker Discovered (OBSERVE phase)

**The HyperaFinOps star schema model has never been published to Power BI Service.**

Browser verification of workspace `9d992de7` shows only 4 items:
- `AzureCostManagementApp-dashboard` — Report (template app)
- `AzureCostManagementApp-dashboard` — Semantic model (Azure Cost Management connector, read-only, dataset `63397e26`)
- Two dashboards (`AzureCostManagementApp-dashboard-execute`, copy)

The live semantic model is the **Azure Cost Management template app connector** with English-named tables (`Balance summary`, `Usage details`, `Budgets`, `RI charges`, etc.). It shows **"Viewing"** mode — not editable via Manage measures.

The local PBIP skeleton (`finops-powerbi/HyperaFinOps.SemanticModel/`) contains only `_Measures.tmdl` — no `model.tmdl`, no `relationships.tmdl`, no fact/dim table TMDL files. It is not deployable.

The measures in `_Measures.tmdl` reference `Dim_ResourceGroup[TagsCompletas]` — a column that does not exist in the live connector model.

### Decision Required

Two paths:
1. **Add measures to the template app model** — create a `_Measures` calculated table and add `Custo Tagueado %` / `Custo Sem Tag` referencing `Usage details` columns (different schema, formula must change)
2. **Publish the HyperaFinOps star schema first** — build out the missing TMDL files and publish the custom model to the workspace, then add measures

### Risks

- Path A (connector model): model is confirmed **read-only** ("Viewing mode, changes will not be saved") — cannot add measures at all
- Path B (publish star schema): TMDL skeleton incomplete — only `_Measures.tmdl` exists, needs model.tmdl, 6+ table .tmdl files, relationships.tmdl
- Story 1.1 as written presupposes a deployed star schema that does not exist in Power BI Service
- Publishing an incomplete TMDL will fail at import time — all required files must exist

### Think Phase Decision

Path A is blocked (read-only model). Path B is the only viable path. Story 1.1 requires publishing the HyperaFinOps semantic model first. Awaiting user decision on scope.

## Criteria

- [ ] ISC-1: Architectural path (connector vs star schema) decided and documented [R]
- [ ] ISC-2: Target semantic model identified and confirmed editable in Service [E]
- [ ] ISC-3: `Custo Tagueado %` measure added to live Service model [E]
- [ ] ISC-4: `Custo Tagueado %` formula exactly `DIVIDE(CALCULATE([Custo Efetivo], Dim_ResourceGroup[TagsCompletas] = TRUE()), [Custo Efetivo])` [E]
- [ ] ISC-5: `Custo Tagueado %` formatString is `0.0%;-0.0%;0.0%` [E]
- [ ] ISC-6: `Custo Tagueado %` displayFolder is `Conformidade Tags` [E]
- [ ] ISC-7: `Custo Tagueado %` lineageTag is `m-custo-tagueado-pct` [E]
- [ ] ISC-8: `Custo Sem Tag` measure added to live Service model [E]
- [ ] ISC-9: `Custo Sem Tag` formula exactly `CALCULATE([Custo Efetivo], Dim_ResourceGroup[TagsCompletas] = FALSE())` [E]
- [ ] ISC-10: `Custo Sem Tag` formatString is `R$ #,##0` [E]
- [ ] ISC-11: `Custo Sem Tag` displayFolder is `Conformidade Tags` [E]
- [ ] ISC-12: `Custo Sem Tag` lineageTag is `m-custo-sem-tag` [E]
- [ ] ISC-13: Both measures return non-BLANK, non-ERROR values after dataset refresh [E]
- [ ] ISC-14: Marketplace total R$ 45,326 and Usage total R$ 1,458,793 unchanged after refresh [E]
- [ ] ISC-15: Only `_Measures.tmdl` modified in git commit [E]
- [ ] ISC-A1: No Power BI Desktop used at any point [E]
- [ ] ISC-A2: No `report.json` or PQ files modified in same commit [E]
- [ ] ISC-A3: No `Custo Total` used in measure formula (must use `Custo Efetivo`) [E]
