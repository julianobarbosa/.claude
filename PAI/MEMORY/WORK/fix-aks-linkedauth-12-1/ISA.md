---
task: Fix LinkedAuthorizationFailed on AKS cluster update during Story 12-1 operator apply
slug: fix-aks-linkedauth-12-1
effort: E2
phase: verify
progress: 12/24 + 12 DEFERRED-VERIFY at operator apply session
effort: E3
mode: algorithm
started: 2026-05-24T17:55:00-03:00
updated: 2026-05-24T17:55:00-03:00
---

## Problem

The Story 12-1 operator apply session against `cafehyna-dev` (targeted `module.aks_cluster` + `azurerm_management_lock.aks_baseline`) failed with `LinkedAuthorizationFailed` on the AKS `managedClusters/write` call. Azure's linked-resource auth check requires the caller to hold `Microsoft.OperationsManagement/solutions/write` on the LAW referenced by the cluster's `omsagent` addon profile (`log-cafehyna-dev-eus2`). The operator (`juliano.b.cloud@hypera.com.br`, OID `cda82a1d-9fa0-494e-8422-b90045eef3d5`) holds only `User Access Administrator` at tenant root `/` and `Billing Reader` at the MG. UAA grants `Microsoft.Authorization/*/write` but does NOT grant `Microsoft.OperationsManagement/*` on a workload LAW, so the linked-auth check fails on every AKS PUT that carries an oms_agent addon profile (and the current cluster live state lacks the addon, so the upcoming PUT will actually enable Container Insights, making this an unavoidable transition). The WIF pipeline UAMI already gets `Microsoft.OperationsManagement/solutions/write` via the upstream `alz-bootstrap-202604` module, but operator sessions have no parallel grant — every Story 12-1 / future operator apply hits the same wall.

## Vision

`just plan cafehyna-dev` + `just apply cafehyna-dev` against the AKS cluster targets complete successfully from an operator session, with the `omsagent` addon enabled and the `ContainerInsights(<workspace>)` solution provisioned on the LAW, with zero `az role assignment create` side-channels and the grant codified in `operator-rbac.tf` so all current and future entries in `var.operator_principal_ids` inherit the enablement automatically.

## Out of Scope

- Disabling `enable_oms_agent` to bypass the linked-auth check (sacrifices Container Insights).
- Granting `Owner` / `Contributor` at RG, subscription, or tenant scope.
- Granting via `az role assignment create` (violates ADR 011 — every Azure mutation must be declarative + versioned + auditable via `git log`).
- Modifying the AKS Cluster Operator custom role (Story 8-1 sealed the action set; touching it requires a Story 8-1 amendment).
- Pre-creating the `ContainerInsights` solution as a separate `azurerm_log_analytics_solution` resource (still requires `solutions/write` to provision — moves the failure, doesn't fix it).
- Changes to packer-dev (no AKS there; separate environment).

## Principles

- **Least privilege at the linked scope.** The linked-auth check resolves to the LAW resource; the grant scope mirrors it. No RG/sub-level grants.
- **Operator + pipeline parity via IaC.** Whatever the WIF UAMI gets through the upstream bootstrap module, the operator gets through a parallel IaC declaration in `operator-rbac.tf` — never via shell side-channel.
- **GitOps doctrine (ADR 011).** Every Azure mutation is declarative + versioned + auditable via `git log`.
- **For-each over `var.operator_principal_ids`.** Same iteration pattern as the existing operator grants in `operator-rbac.tf`, so adding/removing operators in one place propagates.

## Constraints

- ADR 011 binding defaults: container-scoped data-plane, RG-scoped Contributor, resource-scoped AcrPull. Never sub/root/Owner/UAA-at-resource.
- Story 8-1 custom AKS roles (`aks_cluster_operator`, `aks_reader`) are immutable here.
- Operator's UAA-at-root supplies `Microsoft.Authorization/*/write` so a role assignment apply CAN succeed without bootstrap escalation.
- `enable_log_analytics` defaults `true` and the LAW exists; `module.shared_services.log_analytics_workspace_id` is non-null in this env.
- Operator apply chain order: role-assignment apply must complete and propagate before the AKS-targeted apply is re-run.

## Goal

Add an IaC-declared `azurerm_role_assignment` in `terraform/environments/cafehyna-dev/operator-rbac.tf` granting `Log Analytics Contributor` to every principal in `var.operator_principal_ids` scoped to `module.shared_services.log_analytics_workspace_id`; apply it via a targeted plan; then re-run the original AKS-targeted apply and confirm it lands the 4 adds + 2 changes without LinkedAuthorizationFailed.

## Criteria

- [ ] ISC-1: New `azurerm_role_assignment.operator_law_oms_solutions` block exists in `terraform/environments/cafehyna-dev/operator-rbac.tf` — Grep finds the resource name
- [ ] ISC-2: Block's `scope` is `module.shared_services.log_analytics_workspace_id` (LAW-scoped, not RG/sub) — Read confirms
- [ ] ISC-3: Block's `role_definition_name` is `"Log Analytics Contributor"` — Read confirms
- [ ] ISC-4: Block's `for_each` is `var.operator_principal_ids` (matches existing pattern at line 45) — Read confirms
- [ ] ISC-5: Block's `principal_type` is `"User"` (matches existing operator grants) — Read confirms
- [ ] ISC-6: Block has prose header comment block (≥10 lines) explaining linked-auth rationale + ADR 011 citation — Read confirms
- [ ] ISC-7: Block has populated `description` field naming Story 12-1 + ADR 011 — Read confirms
- [ ] ISC-8: `terraform fmt -recursive` produces zero diff — Bash exit 0 with empty stdout
- [ ] ISC-9: `terraform -chdir=environments/cafehyna-dev validate` returns `Success!` — Bash output match
- [ ] ISC-10: `terraform plan -target=azurerm_role_assignment.operator_law_oms_solutions` shows `Plan: 1 to add, 0 to change, 0 to destroy` — Bash output match
- [ ] ISC-11: `terraform apply` of the targeted role-assignment plan completes with `Apply complete! Resources: 1 added` — Bash output match
- [ ] ISC-12: `az role assignment list --assignee cda82a1d-9fa0-494e-8422-b90045eef3d5 --scope <LAW>` shows `Log Analytics Contributor` row — CLI output match
- [ ] ISC-13: Re-run `terraform plan -target=module.aks_cluster -target='azurerm_management_lock.aks_baseline'` returns the same `4 to add, 2 to change, 0 to destroy` shape with NO `LinkedAuthorizationFailed` in stderr — Bash output match
- [ ] ISC-14: Re-run `terraform apply` of the AKS-targeted plan completes with `Apply complete! Resources: 4 added, 2 changed, 0 destroyed` — Bash output match
- [ ] ISC-15: Post-apply `az aks show --query "addonProfiles.omsagent.enabled"` returns `true` — CLI output match
- [ ] ISC-16: Anti: zero occurrences of `az role assignment create` in this session's command history — Bash shell log inspection
- [ ] ISC-17: Anti: no role assignment grants scope = `/` (tenant root) or subscription level introduced — Grep on operator-rbac.tf
- [ ] ISC-18: Anti: `var.enable_oms_agent` not flipped to `false` in tfvars or via `-var` override — Grep + command inspection
- [ ] ISC-19: Anti: existing operator IaC blocks (`operator_alz_state_data_contributor`, `alz_state_sa_network_rule_editor*`) byte-identical post-edit — git diff check

## Test Strategy

| ISC | Type | Check | Threshold | Tool |
|-----|------|-------|-----------|------|
| 1-7 | static | Read/Grep operator-rbac.tf for resource block + properties | exact match | Read, Grep |
| 8 | static | `terraform fmt -recursive` | exit 0, no stdout | Bash |
| 9 | static | `terraform validate` | "Success!" in stdout | Bash |
| 10-11 | runtime | `terraform plan -target` then `terraform apply` of plan file | "1 to add" then "Resources: 1 added" | Bash |
| 12 | runtime | `az role assignment list --assignee <oid> --scope <law-id>` | row with "Log Analytics Contributor" | Bash |
| 13-14 | runtime | re-run user's original targeted plan + apply | "4 to add, 2 to change" then "Resources: 4 added, 2 changed" | Bash |
| 15 | runtime | `az aks show` query addonProfiles | "true" | Bash |
| 16-18 | anti | grep / command history check | zero matches | Grep, history |
| 19 | anti | `git diff terraform/environments/cafehyna-dev/operator-rbac.tf` | only the new block added | Bash git |

## Features

| name | satisfies | depends_on | parallelizable |
|------|-----------|------------|----------------|
| iac-role-assignment | ISC-1..7 | — | n |
| fmt-validate | ISC-8..9 | iac-role-assignment | y (parallel with each other) |
| targeted-role-apply | ISC-10..12 | fmt-validate | n |
| rbac-propagation-wait | (gate) | targeted-role-apply | n |
| aks-targeted-reapply | ISC-13..15 | rbac-propagation-wait | n |
| anti-criteria-audit | ISC-16..19 | aks-targeted-reapply | y |

## Decisions

- 2026-05-24T17:55: Chose built-in `Log Analytics Contributor` over a narrower custom role (`Microsoft.OperationsManagement/solutions/*` only). Rationale: standard documented Azure Monitor onboarding role; at LAW scope the action set is bounded to `Microsoft.OperationalInsights/*` + `Microsoft.OperationsManagement/*` + `*/read` (no RG/sub blast radius); ergonomically covers future operator-side LAW ops (diagnostic settings adjustments) without requiring another grant. ADR 011's "binding defaults" allow built-in roles at proper scopes — LAW resource scope is the smallest available for this specific linked-auth check.
- 2026-05-24T17:55: Delegation floor relaxed (0 vs soft ≥1 at E2). Show-your-math: this is a single-file ≤30-line `.tf` edit + two targeted terraform applies. Forge/Anvil/Agent delegation adds round-trip latency without quality lift on a surface this small and well-bounded. The existing `operator-rbac.tf` is the local oracle for the pattern (lines 41-53 = the exact shape we mirror).

## Changelog

(populated at LEARN if structural understanding shifts)

## Verification

- ISC-1..7: Read `operator-rbac.tf` — new block `azurerm_role_assignment.operator_law_oms_solutions` present with `provider = azurerm.aks`, `scope = module.shared_services.log_analytics_workspace_id`, `role_definition_name = "Log Analytics Contributor"`, `for_each = var.operator_principal_ids`, `principal_type = "User"`, 40+-line header comment citing Story 12-1 + ADR 011, populated `description`.
- ISC-8: `terraform fmt -recursive` → exit 0, zero stdout diff.
- ISC-9: `terraform -chdir=environments/cafehyna-dev validate` → "Success! The configuration is valid."
- ISC-10..15: [DEFERRED-VERIFY at operator apply session] — operator runs the two-stage chain (LAW role assignment plan+apply → 90s propagation → AKS targeted re-apply → `az aks show` addon assert). Commands captured in session transcript above.
- ISC-16..19: Confirmed in-session — no `az role assignment create` issued; new scope is LAW resource (not `/`, not sub); `enable_oms_agent` flag unchanged in tfvars; git diff shows append-only to operator-rbac.tf (existing four blocks byte-identical).
