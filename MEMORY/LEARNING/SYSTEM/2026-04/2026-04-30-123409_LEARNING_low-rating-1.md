---
capture_type: LEARNING
timestamp: 2026-04-30 12:34:09 PST
rating: 1
source: explicit
auto_captured: true
tags: [low-rating, improvement-opportunity]
---

# Low Rating Captured: 1/10

**Date:** 2026-04-30
**Rating:** 1/10
**Detection Method:** Explicit Rating


---

## Context

━━━ 👁️ OBSERVE ━━━ 1/7 (BLOCKER FOUND)

🔎 REVERSE ENGINEERING:
- **Explicitly wanted:** Continue Story 1.1 — deploy `Custo Tagueado %` and `Custo Sem Tag` measures to the live Power BI Service model
- **Explicitly wanted:** Measures working in Service, not just in local TMDL git
- **Not wanted:** Power BI Desktop (prohibited)
- **Not wanted:** Touching anything beyond `_Measures.tmdl`

🔍 SELF-INTERROGATION:
1. **Critical uncaptured constraint:** The HyperaFinOps star schema has **never been published**. The live workspace model is the Azure Cost Management template app connector (read-only). Story 1.1's formulas reference `Dim_ResourceGroup[TagsCompletas]` which doesn't exist in the connector model.
4. User would say: "Yes — what do we do about the missing star schema?"

💪🏼 EFFORT LEVEL: Extended | Blocker requires architectural decision before execution

---

**STOP — Architectural decision needed before proceeding.**

I verified the Power BI workspace via browser. Here's what I found:

**The live workspace contains only the Azure Cost Management template app connector model** — not the HyperaFinOps star schema. The model shows "Viewing" mode and has English-named tables (`Balance summary`, `Usage details`, `Budgets`). There is no `Dim_ResourceGroup`, no `Fact_Usage`, no `Custo Efetivo` measure.

The local `_Measures.tmdl` has the measures correctly written, but **the model they reference doesn't exist in Power BI Service**.

**Two paths forward:**

**Path A — The measures go into the connector model**
- The template app model is where the report and dashboards already live
- We'd need to add a `_Measures` calculated table and rewrite formulas to use `Usage details` columns instead of `Dim_ResourceGroup[TagsCompletas]`
- This means changing Story 1.1's acceptance criteria — the formulas would be different
- The connector model appears to be in "Viewing" mode — need to check if custom measures can be added at all

**Path B — Publish the HyperaFinOps star schema

---

## Improvement Notes

This response was rated 1/10 by Barbosa. Use this as an improvement opportunity.

---
