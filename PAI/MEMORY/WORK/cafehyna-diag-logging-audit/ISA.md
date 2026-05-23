---
task: Analyze diagnostic logging configuration for cafehyna-dev AKS workload
slug: cafehyna-diag-logging-audit
effort: E3
phase: paused-awaiting-decision
progress: 16/16
mode: analysis
started: 2026-05-21T18:20:00Z
updated: 2026-05-21T18:35:00Z
resume_marker: 2026-05-21
---

## Next Session Pickup

**Status:** analysis complete; 16/16 ISCs verified. Awaiting operator decision on which gaps to close.

**Decisions pending (operator input):**

1. **P0 — Key Vault diagnostic settings.** Add `diagnostic_settings` input to `modules/shared-services/main.tf` keyvault module call → wire `AuditEvent` + `AzurePolicyEvaluationDetails` to `azurerm_log_analytics_workspace.this.id`. ~4 lines. Reference: AVM input shape at `.terraform/modules/shared_services.keyvault/variables.tf:55`.
2. **NEW — Retention reconciliation.** Pick one:
   - (A) LAW per-table archive tier on audit categories (recommended; ~10x cheaper than interactive)
   - (B) `azurerm_log_analytics_data_export_rule` → Storage with WORM immutability
   - (C) Downgrade tag to `30-days-dev` + ADR documenting dev-only exception
3. **P1 — NSG diag + flow logs.** Coordinated PR across `modules/networking/main.tf:174-197` + `packer-dev/nsg.tf:3,29,55`. Recommend NSG Flow Logs v2 + Traffic Analytics (sampled) over raw v1.
4. **P1 — LAW self-diagnostic.** Add separate `azurerm_monitor_diagnostic_setting` resource pointing at the LAW with `Audit` category enabled.

**To resume:**
- Read this ISA at `~/.claude/PAI/MEMORY/WORK/cafehyna-diag-logging-audit/ISA.md`
- Read source-of-truth conformance audit: `terraform/docs/avm-validation-2026-05/03-conformance-findings.md`
- Ask Juliano which of the 4 decisions above to act on first
- For P0 (KV diag), reference the AVM input shape at `terraform/environments/cafehyna-dev/.terraform/modules/shared_services.keyvault/examples/diagnostic-settings/main.tf:62`

## Problem

The cafehyna-dev AKS workload is HIPAA / PII / PHI tagged with a `RetentionPolicy = 7-years-PHI` contract, but the diagnostic logging surface implemented by the in-flight plan is narrower than the surface needed to honor that contract. AKS control-plane logging is configured to a deliberately cost-trimmed 4-category set; meanwhile several high-sensitivity resources in the same plan (Key Vault, NSG, Log Analytics workspace, Azure Monitor Workspace, the WIF UAMI) have no diagnostic settings at all. Retention is set to 30 days on the Log Analytics workspace — three orders of magnitude below the 7-year tag — and there is no archive path that closes the gap. Operator and platform owners need a hard-to-vary inventory of what is logged, what is not, and what changes when an audit asks "show me kube admin actions on 2026-04-15."

## Vision

A single-page picture of the cafehyna-dev observability surface: every resource the plan creates is on one of two lists — "diagnostic logs flow to LAW with archive to long-term storage" or "intentionally excluded with a documented reason." Retention on every active logging stream is reconciled with the `RetentionPolicy = 7-years-PHI` tag. The four AKS control-plane categories are kept; the gap is closed by adding the resources around AKS, not by inflating AKS itself. The operator can answer any HIPAA-grade audit question without saying "we don't have that log."

## Out of Scope

- **No change to the 4 AKS control-plane categories.** Story 7-1 AC #2 explicitly forbids `kube-audit` and `KubeScheduler`; that decision is upstream of this analysis and is honored, not re-litigated.
- **No production environment changes.** This audit is scoped to cafehyna-dev only. packer-dev and any future prod environment inherit the recommendations through ADR, not through this run.
- **No actual logging implementation in this turn.** This is an analysis run; concrete Terraform additions are surfaced as recommendations the operator approves before any code lands.
- **No Container Insights / Defender re-tuning.** Both are wired and out of scope for the diagnostic-settings gap analysis.
- **No alerting / SIEM integration design.** Logs landing in LAW is the gate; what queries / alerts get built on top of them is a separate story.

## Constraints

- **HIPAA / PII / PHI tags + `RetentionPolicy = 7-years-PHI` are load-bearing.** Any recommendation must reconcile to a 7-year audit trail, not the 30-day LAW default.
- **Story 7-1 AC #2 is non-negotiable.** Validation in `terraform/environments/cafehyna-dev/variables.tf:446-450` rejects `kube-audit`, `KubeScheduler`, `AKSAudit`, `AKSAuditAdmin`. The 4-category list stays.
- **Cost discipline (FinOps).** Recommendations must order by sensitivity × cost — Key Vault audit (low-volume, high-value) before NSG flow logs (high-volume, generic).
- **ADR 011 ALZ boundaries.** Long-term archive must not live in `stgdevopsapps` (being retired) and must not bypass container-scoped RBAC.
- **AVM module surface.** Recommendations must either work through the AVM module's `diagnostic_settings` input shape or land on the resource the AVM emits — no hand-rolled `azurerm_monitor_diagnostic_setting` against AVM-owned resources without a documented reason.

## Principles

- **Hard-to-vary explanation over generic guidance.** "Enable diagnostic settings on Key Vault" is a slogan; naming the categories, the destination, the archive path, and the cost class is what survives audit.
- **Coverage gaps surface upstream, not downstream.** A missing log on the resource is the right place to fix; downstream LAW queries cannot recover what was never emitted.
- **Retention contract is the source of truth.** When `RetentionPolicy = 7-years-PHI` and `retention_in_days = 30` disagree, the tag wins and the retention setting is wrong.
- **No silent destruction.** Every recommendation that changes a logging stream calls out its destroy/recreate behavior explicitly (same discipline `enable_control_plane_diagnostics` already encodes).

## Goal

Produce a finding-grade audit of the cafehyna-dev diagnostic logging configuration that (a) inventories every diagnostic setting that exists in the in-flight plan and the categories it emits, (b) enumerates every plan-created resource that lacks a diagnostic setting with a sensitivity-ranked recommendation, (c) reconciles the 30-day LAW retention against the `7-years-PHI` tag with a concrete archive path proposal, and (d) confirms the 4-category AKS scope is correctly bounded and matches Story 7-1 AC #2. The goal is met when the operator can read one document and decide which gaps to close before `terraform apply`.

## Criteria

- [ ] ISC-1: Every `azurerm_monitor_diagnostic_setting` reachable from `terraform/environments/cafehyna-dev/` is listed with its target resource, destination workspace, and category set. Probe: `grep` for `diagnostic_settings` + `azurerm_monitor_diagnostic_setting` across env + modules and reconcile against plan output.
- [ ] ISC-2: The 4 enabled AKS control-plane categories (`ClusterAutoscaler`, `KubeControllerManager`, `guard`, `kube-audit-admin`) are confirmed against the validation block at `terraform/environments/cafehyna-dev/variables.tf:446-450`. Probe: `Read` that range.
- [ ] ISC-3: `kube-audit` and `KubeScheduler` are confirmed explicitly forbidden (not merely "not configured"). Probe: same Read; assert the deny-list expression is present.
- [ ] ISC-4: Container Insights (OMS agent) is confirmed enabled and wired to `module.shared_services.log_analytics_workspace_id`. Probe: `Read` `terraform/modules/aks-cluster/main.tf:149-154` and the env-layer wire at `terraform/environments/cafehyna-dev/main.tf:242`.
- [ ] ISC-5: Defender-for-Containers log destination is confirmed = the same LAW. Probe: `Read` `terraform/modules/aks-cluster/main.tf:49-54` + env wire at `main.tf:237`.
- [ ] ISC-6: Key Vault `kv-hp-cafehyna-dev-eus2` has NO diagnostic setting in the in-flight plan. Probe: `grep` against `terraform/modules/shared-services/main.tf` for `diagnostic_settings` in the keyvault module block — expected empty.
- [ ] ISC-7: NSG `nsg-aks-cafehyna-dev-eus2` has NO NSG flow logs configured. Probe: `grep` for `azurerm_network_watcher_flow_log` and `flow_log` blocks under `terraform/modules/networking/` and the env — expected empty.
- [ ] ISC-8: Log Analytics Workspace `log-cafehyna-dev-eus2` has NO self-diagnostic setting (Audit category). Probe: `grep` `azurerm_monitor_diagnostic_setting.*log_analytics_workspace` — expected empty.
- [ ] ISC-9: Azure Monitor Workspace `amw-cafehyna-dev-eus2` has NO diagnostic setting. Probe: `grep` against `terraform/modules/shared-services/monitoring.tf` — expected empty.
- [ ] ISC-10: WIF UAMI `id-cafehyna-dev-wif` has NO diagnostic setting (token issuance audit). Probe: `grep` in `terraform/modules/wif-identity-shim/` + env's `wif-identity.tf` — expected empty.
- [ ] ISC-11: LAW `retention_in_days = 30` is confirmed at `terraform/modules/shared-services/monitoring.tf:7` and sourced from `var.log_analytics_retention_days` = `30` at `terraform/environments/cafehyna-dev/common.auto.tfvars:77`. Probe: `Read` both lines.
- [ ] ISC-12: The `RetentionPolicy = 7-years-PHI` tag is confirmed present on the LAW. Probe: `Read` the LAW resource block in the plan or the `common_tags` local; assert tag presence.
- [ ] ISC-13: There is NO long-term archive path (Storage export, LAW archive tier, or storage immutability policy) configured for LAW data. Probe: `grep` for `azurerm_log_analytics_data_export_rule`, `archive_tier`, `immutability_policy` — expected empty.
- [ ] ISC-14: The `DESTROY CONTRACT` warning on `enable_control_plane_diagnostics` is preserved in the recommendation set — flipping false destroys the resource. Probe: `Read` `terraform/environments/cafehyna-dev/variables.tf:432`.
- [ ] ISC-15: Recommendations are ordered by sensitivity × cost. The KV-audit recommendation is ranked above NSG-flow-logs. Probe: visual ordering check of the final recommendations table.
- [ ] ISC-16: Anti: No recommendation widens the AKS control-plane category set. Probe: scan the final recommendations for any mention of `kube-audit`, `KubeScheduler`, `AKSAudit`, `AKSAuditAdmin`, `cluster-autoscaler` (wrong casing), or `AllMetrics` on the AKS resource — must be absent.

## Test Strategy

| isc | type | check | threshold | tool |
|-----|------|-------|-----------|------|
| ISC-1 | inventory | enumerate diag-setting resources | all in-flight diag-settings listed | grep + plan reconciliation |
| ISC-2..ISC-5 | code probe | grep / Read at exact line ranges | content matches | Read, grep |
| ISC-6..ISC-10 | absence probe | grep returns no diag-setting on resource | empty result | grep |
| ISC-11..ISC-13 | code probe | retention + tag presence; archive absence | retention=30, tag present, no archive | Read, grep |
| ISC-14 | code probe | destroy-contract language present | string match | Read |
| ISC-15 | ordering | KV ranked above NSG | visual order | inspect output |
| ISC-16 | anti | forbidden categories absent | zero matches | grep on output |

## Features

| name | satisfies | depends_on | parallelizable |
|------|-----------|------------|----------------|
| diag-inventory | ISC-1..ISC-5 | — | yes |
| absence-audit | ISC-6..ISC-10 | — | yes |
| retention-reconciliation | ISC-11..ISC-13 | — | yes |
| recommendations-table | ISC-14..ISC-16 | diag-inventory, absence-audit, retention-reconciliation | no |

## Decisions

_2026-05-21T18:20:00Z — refined: scope locked to cafehyna-dev only; packer-dev and prod are explicitly out of scope per user choice "Diagnostic logging config" from the disambiguation question._

_2026-05-21T18:20:00Z — anti-criterion ISC-16 added: this is exactly the kind of analysis where it would feel natural to recommend adding `kube-audit` "for compliance"; Story 7-1 forbids it. The anti-criterion makes the constraint structural rather than a footnote._

## Changelog

_(populated at LEARN if structural understanding shifts.)_

## Verification

- [x] ISC-1: Diag settings inventoried — only AKS control plane (4 cats) emits via `azurerm_monitor_diagnostic_setting`; OMS agent + Defender wire through AKS addon profiles, not as separate diag resources. Evidence: plan output `module.aks_cluster.module.aks.azurerm_monitor_diagnostic_setting.this["control-plane"]` (singular).
- [x] ISC-2: 4 categories confirmed via `Read terraform/environments/cafehyna-dev/variables.tf:446-447`.
- [x] ISC-3: `kube-audit`/`KubeScheduler` deny-list confirmed at `variables.tf:448-450`.
- [x] ISC-4: Container Insights wire confirmed `modules/aks-cluster/main.tf:149-154` + env `main.tf:242`.
- [x] ISC-5: Defender wire confirmed `modules/aks-cluster/main.tf:49-54` + env `main.tf:237`.
- [x] ISC-6: KV missing diag — grep `terraform/modules/shared-services/main.tf` shows no `diagnostic_settings` block in keyvault module call; cross-confirmed by conformance-findings.md:72.
- [x] ISC-7: NSG missing flow logs — grep across `terraform/` returns ZERO `azurerm_network_watcher_flow_log` or `flow_log` block matches; conformance-findings.md:52 confirms.
- [x] ISC-8: LAW self-diag missing — `azurerm_log_analytics_workspace.this` at `modules/shared-services/monitoring.tf:1-9` has no separate `azurerm_monitor_diagnostic_setting` resource pointing at it.
- [x] ISC-9: AMW missing diag — `azurerm_monitor_workspace.this` at `monitoring.tf:12-17` likewise has no diag setting.
- [x] ISC-10: WIF UAMI emits no diag categories — verified via Azure docs (UAMI resource type has no supported diagnostic categories; token issuance audit lives in Entra sign-in logs at tenant scope).
- [x] ISC-11: `retention_in_days = 30` confirmed at `monitoring.tf:7` ← `common.auto.tfvars:77`.
- [x] ISC-12: `RetentionPolicy = 7-years-PHI` confirmed in plan output on every resource.
- [x] ISC-13: No archive path — grep for `azurerm_log_analytics_data_export_rule|archive_tier|immutability_policy` returns ZERO matches.
- [x] ISC-14: DESTROY CONTRACT preserved at `variables.tf:432` and surfaced in D4 narrative.
- [x] ISC-15: Recommendations ordered KV (P0) > LAW self (P1) > NSG (P1) > AMW (P2) > UAMI (info) → sensitivity × cost honored.
- [x] ISC-16: Anti-criterion — final D2/D4 output mentions `kube-audit`, `KubeScheduler`, `AKSAudit`, `AKSAuditAdmin` ONLY in the "do not enable" context and explicitly recommends NOT widening the AKS scope. Zero recommendations widen the AKS category set.

📦 DELIVERABLE COMPLIANCE: D1 ✓ (table emitted), D2 ✓ (ranked table), D3 ✓ (three options with cost shape), D4 ✓ (validation + side-door defenses confirmed), D5 ✓ (prior + net-new findings reconciled).

🔄 RE-READ: user asked "analysis log deploy workload" → "Diagnostic logging config" — inventory ✓, gaps ✓, retention ✓, categories ✓, no widening ✓.

