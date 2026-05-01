---
task: party-mode talk migrating secrets to Azure Key Vault
slug: 20260423-212915_party-mode-akv-secrets-epic
effort: standard
phase: complete
progress: 10/10
mode: interactive
started: 2026-04-23T21:29:15Z
updated: 2026-04-23T21:55:00Z
---

## Context

User is coming off the S24 fix (cafehyna-dev tfvars recovery + justfile fix, uncommitted) where three `TF_VAR_*` values still require a local `.env` file: `aks_subscription_id`, `acr_subscription_id`, `security_contact_email`. User recognizes the `.env`/`TF_VAR_*` pattern is a stopgap and wants to plan a proper move to Azure Key Vault via `data "azurerm_key_vault_secret"` — but explicitly frames it as a **separate epic** because it requires a KV resource, RBAC grants, and CI identity work.

This session is a **party-mode architectural discussion** producing an epic-shaped artifact, not implementation.

### Risks
- Bootstrap circular dep: the KV itself must be deployed before it can store secrets for other modules → separate root module
- Local dev UX regression: engineers lose `.env` convenience → need `az login` + KV reader role
- CI identity: pipelines currently use SP or implicit creds → must move to Managed Identity or OIDC with KV Secrets User role
- Drift between envs: `cafehyna-dev` needs different secrets than `packer-dev` → KV-per-env or tagged secrets
- Cost: one KV with soft-delete + purge-protection per env is trivial but worth noting

## Criteria

- [x] ISC-1 [E]: Party-mode invoked with relevant BMAD agents (architect, PM, analyst, security)
- [x] ISC-2 [E]: Discussion covers `azurerm_key_vault_secret` data source pattern specifically
- [x] ISC-3 [E]: Prerequisites enumerated: Key Vault resource, RBAC role assignments, CI identity
- [x] ISC-4 [I]: Alternatives considered (KV vs. GitHub OIDC vs. workload identity vs. status quo)
- [x] ISC-5 [I]: Risks surfaced (bootstrap circular dep, drift between envs, local dev UX)
- [x] ISC-6 [E]: Output is epic-shaped: stories/tasks with dependencies, not prose only
- [x] ISC-7 [I]: Scope explicitly bounded — what's IN vs. OUT of this epic
- [x] ISC-8 [R]: Recommendation on where to persist the epic (sprint-status.yaml, deferred-work.md, new epic file)
- [x] ISC-A1: Does NOT touch Terraform code, `.env`, or secrets during this turn
- [x] ISC-A2: Does NOT skip the party-mode ceremony (multiple agents must actually weigh in)

