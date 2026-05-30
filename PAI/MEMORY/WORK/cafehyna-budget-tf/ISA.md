---
task: Draft cafehyna-dev consumption budget Terraform module matching repo iac canon
slug: cafehyna-budget-tf
effort: E2
phase: complete
progress: 25/25
mode: algorithm
started: 2026-05-29T14:48:59Z
updated: 2026-05-29T14:52:30Z
---

## Problem

The EA cost-governance research (`docs/research/technical-azure-ea-cost-governance-research-2026-05-28.md`) defined budgets-as-code as the smallest reversible next step, but the budget exists only as an inline snippet. The repo has no `iac/budgets/` module; cafehyna-dev has no codified budget. Need a reusable Terraform module + a cafehyna-dev example, matching the `iac/policy/owner-tags/` canon, that `terraform validate`s clean — draft only, not applied.

## Constraints

- Match repo canon: azurerm `~> 4.73`, `required_version >= 1.6.0`, `brazilsouth` default region, reusable root module + `examples/<name>/` wrapper.
- No real Hypera GUIDs/secrets — example tfvars uses all-zeros placeholder (per owner-tags example).
- No `azurerm_resource_group`, no destructive/RG-scoped deletion (repo doctrine).
- Surgical: do not modify existing `iac/policy/owner-tags/` files or the unrelated uncommitted bmad/config changes.
- Draft only — do NOT `terraform apply`.

## Goal

Create `iac/budgets/` (reusable subscription consumption-budget module: versions/variables/main/outputs) + `iac/budgets/examples/cafehyna-dev/` wrapper + README, with Forecasted-90 + Actual-100 notifications, optional action-group wiring, first-party-usage filter, and the four known azurerm gotchas handled — passing `terraform fmt -check -recursive iac/budgets` and `terraform init -backend=false && terraform validate` on the example.

## Criteria

- [ ] ISC-1: `iac/budgets/versions.tf` exists; azurerm `~> 4.73`, `required_version >= 1.6.0`
- [ ] ISC-2: `iac/budgets/variables.tf` defines `subscription_id` (string, required, full resource ID)
- [ ] ISC-3: variables.tf defines `amount` (number) with positive validation
- [ ] ISC-4: variables.tf defines `time_grain` (default "Monthly") with validation of allowed values
- [ ] ISC-5: variables.tf defines `forecasted_threshold` (default 90) and `actual_threshold` (default 100)
- [ ] ISC-6: variables.tf defines `contact_emails` (list(string), default [])
- [ ] ISC-7: variables.tf defines `contact_roles` (list(string), default ["Owner"])
- [ ] ISC-8: variables.tf defines `action_group_ids` (list(string), default [])
- [ ] ISC-9: variables.tf defines `first_party_usage_only` (bool, default true)
- [ ] ISC-10: main.tf declares `azurerm_consumption_budget_subscription` with `time_period { start_date }`
- [ ] ISC-11: main.tf includes `lifecycle { ignore_changes = [time_period] }` (gotcha: plan churn)
- [ ] ISC-12: main.tf has a Forecasted notification (`threshold_type = "Forecasted"`)
- [ ] ISC-13: main.tf has an Actual notification (`threshold_type = "Actual"`)
- [ ] ISC-14: main.tf dynamic `filter` applies ChargeType=Usage (+PublisherType=Azure) when `first_party_usage_only`
- [ ] ISC-15: locals compute first-of-current-month `start_date` when var is null (gotcha: RFC-3339 first-of-month)
- [ ] ISC-16: each notification guarantees ≥1 recipient (gotcha: emails/roles/groups not all empty)
- [ ] ISC-17: `iac/budgets/outputs.tf` exposes budget `id` and `name`
- [ ] ISC-18: `iac/budgets/examples/cafehyna-dev/versions.tf` exists with same pins
- [ ] ISC-19: example main.tf declares `provider "azurerm"` and calls `module` `source = "../../"`
- [ ] ISC-20: example terraform.tfvars uses all-zeros placeholder `subscription_id`
- [ ] ISC-21: `iac/budgets/README.md` documents usage + the four gotchas
- [ ] ISC-22: Anti: no real Hypera subscription/tenant/EA GUID or secret in any new file
- [ ] ISC-23: Anti: no `azurerm_resource_group` and no destructive/deletion op in the module
- [ ] ISC-24: Anti: existing `iac/policy/owner-tags/` files unchanged (git diff empty for that path)
- [ ] ISC-25: `terraform fmt -check -recursive iac/budgets` and example `init -backend=false && validate` both pass

## Test Strategy

| isc | type | check | tool |
|-----|------|-------|------|
| 1-9,17 | file/content | Read/Grep new files for required blocks | Read, Grep |
| 10-16 | content | Grep main.tf for resource/notification/filter/lifecycle/locals | Grep |
| 18-21 | file/content | Read example + README | Read |
| 22 | anti | grep new files for GUID/secret patterns → none | Bash grep |
| 23 | anti | grep module for resource_group/destroy → none | Bash grep |
| 24 | anti | `git diff --stat iac/policy/owner-tags` empty | Bash git |
| 25 | command | `terraform fmt -check -recursive` + `init -backend=false && validate` | Bash terraform |

## Decisions

- 2026-05-29: Tier E2 via context-override — classifier returned MINIMAL on bare "go", but the thread shows it answers my explicit offer to draft the budget Terraform. Single-domain module draft.
- 2026-05-29: Delegation floor relaxed (show-math) — single-author ~8-file Terraform draft, locally verifiable via `terraform fmt`/`validate`; Forge/agent delegation would add coordination overhead without correctness gain at this size.
- 2026-05-29: Module placed at `iac/budgets/` (parallel to `iac/policy/`), reusable root + `examples/cafehyna-dev/`, mirroring owner-tags so the "copy-a-folder to onboard a subscription" pattern holds.

## Verification

- ISC-1..9,17 (files/vars/outputs): all 8 files written; `grep` confirmed versions pins, `subscription_id`/`amount`/`time_grain`/threshold/contact/`action_group_ids`/`first_party_usage_only` vars, and `budget_id`/`budget_name` outputs.
- ISC-10..16 (resource): `grep` main.tf — `azurerm_consumption_budget_subscription "this"`, `time_period{start_date}`, `lifecycle{ignore_changes=[time_period]}`, Forecasted + Actual notifications, dynamic `filter` ChargeType/PublisherType, `formatdate(...timestamp())` first-of-month local, default `contact_roles=["Owner"]`.
- ISC-18..21 (example/README): example versions/main(`source="../../"`, provider azurerm)/tfvars + README with usage + 4 gotchas.
- ISC-22 (Anti, GUIDs): grep — only all-zeros placeholder, no real GUID/secret.
- ISC-23 (Anti, RG/destroy): grep — no `azurerm_resource_group`, no deletion op.
- ISC-24 (Anti, surgical): `git diff --stat iac/policy/owner-tags` empty.
- ISC-25 (gates): `terraform fmt -check -recursive iac/budgets` → clean; `terraform init -backend=false` → initialized; `terraform validate` → "Success! The configuration is valid."
