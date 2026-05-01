---
task: Recover cafehyna tfvars and fix justfile
slug: 20260423-211144_recover-cafehyna-tfvars-fix-justfile
effort: standard
phase: complete
progress: 12/12
mode: interactive
started: 2026-04-23T21:11:44Z
updated: 2026-04-23T21:13:00Z
---

## Context

`just plan cafehyna-dev` failed because `terraform/justfile:60` hard-references `-var-file=terraform.tfvars` and that file was never committed (user's global gitignore `~/.gitignore_global:74` blocks `*.tfvars`). The tfvars exists intact in sibling worktree `.claude/worktrees/wip-deploy-aks-cafehyna-dev/terraform/environments/cafehyna-dev/terraform.tfvars` (112 lines, no secrets). Plan approved: rename to `common.auto.tfvars`, commit with gitignore negation + gitleaks guardrail, drop `-var-file=` from justfile. Full plan: `Plans/your-options-is-the-snuggly-island.md`. Security analysis (HIPAA/CIS/NIST/CAF — safe to commit): `Plans/your-options-is-the-snuggly-island-agent-adc38e6b590b4b6d3.md`.

## Criteria

- [x] ISC-1: [E] `common.auto.tfvars` exists in cafehyna-dev with header + 112 recovered lines
- [x] ISC-2: [E] No-secrets header block prepended declaring security contract
- [x] ISC-3: [E] Body diff vs sibling source file is empty after header strip (one blank-line delta only)
- [x] ISC-4: [I] `grep -riE 'subscription_id|client_secret|password|token|sas='` in new file returns no findings
- [x] ISC-5: [E] `.gitignore` contains `!terraform/environments/*/common.auto.tfvars` negation
- [x] ISC-6: [I] `git check-ignore -v common.auto.tfvars` returns the negation rule (un-ignored)
- [x] ISC-7: [I] `git check-ignore -v terraform.tfvars` still returns a match (still blocked by global)
- [x] ISC-8: [E] `terraform/justfile` plan/apply/apply-auto/destroy/refresh/infracost recipes drop `-var-file=terraform.tfvars`
- [x] ISC-9: [I] `just fmt` exits 0 with zero diff after edits
- [x] ISC-10: [E] `just plan cafehyna-dev` — tfvars error ELIMINATED. Now fails on 3 missing TF_VAR_* (expected — user must create .env from .env.example)
- [x] ISC-11: [I] packer-dev DEFERRED — decision D1 documented (sibling tfvars uses separate secrets-split, needs audit)
- [x] ISC-12: [E] Zero `terraform apply/destroy` run; only `validate` and `plan` used

### Anti-Criteria

- [x] ISC-A1: Subscription ID, tenant ID, client secret, or SAS token NOT present in `common.auto.tfvars` (verified by grep)
- [x] ISC-A2: `.env` / `terraform.tfvars` / `*.secrets.auto.tfvars` NOT created/staged (verified by `ls`/`git status`)
- [x] ISC-A3: No destructive git ops (no reset/push/branch-D invoked)
- [x] ISC-A4: No Azure resource state change (only `plan`/`validate`, no apply/destroy)

## Decisions

### D1. Scope reduction: defer packer-dev
The sibling `packer-dev/terraform.tfvars` uses `secrets.auto.tfvars` for 3 values and references a subscription ID inside `custom_image_id`. Committing it requires a separate secrets-split audit. This task touches only `cafehyna-dev` + the shared justfile + gitignore. Packer-dev continues to work as-is.

### D2. Justfile pattern change
Replace `VAR_ARGS="-var-file=terraform.tfvars"` with a no-op baseline so `*.auto.tfvars` auto-loads. Keep the `global.tfvars` conditional branch intact (non-breaking for any env that has one).

### D3. Gitignore negation scope
Use `!terraform/environments/*/common.auto.tfvars` (path-specific) rather than a broad `!*.auto.tfvars` to minimize blast radius against the global `*.tfvars` rule.

### Risks
1. `.env` not yet created by user — plan will fail on missing TF_VAR_* even after tfvars fix. User action required before zero-drift is testable.
2. Azure AAD login may not be active — `terraform plan` requires auth; tfvars fix is orthogonal but visible outcome depends on it.
3. Sibling `packer-dev` tfvars may contain secrets — MUST grep before copying.
4. Global `*.tfvars` gitignore negation semantics — verify with `git check-ignore` before committing.

## Verification

### ISC-1/2 — common.auto.tfvars created with header
File `terraform/environments/cafehyna-dev/common.auto.tfvars` created (123 lines: 11-line no-secrets header + 112-line body copied from sibling).

### ISC-3 — Body diff vs source
`diff <(tail -n +13 new) source` → single-line delta (one trailing blank). Content-identical.

### ISC-4 / ISC-A1 — No secrets
`grep -nE 'subscription_id[[:space:]]*=|client_secret|password[[:space:]]*=|tenant_id[[:space:]]*=|object_id[[:space:]]*=|sas[ =]|access_key|connection_string' common.auto.tfvars` → **0 matches** (only comment pointers).

### ISC-5/6/7 — gitignore negation works both ways
- `git check-ignore -v common.auto.tfvars` → `.gitignore:9:!terraform/environments/*/common.auto.tfvars` (un-ignored ✅)
- `git check-ignore -v terraform.tfvars` → `~/.gitignore_global:74:*.tfvars` (still ignored ✅)
- `git check-ignore -v .env` → `.gitignore:2:.env` (still ignored ✅)

### ISC-8 — justfile cleaned
All 5 recipes (`plan`, `apply`, `apply-auto`, `destroy`, `plan --refresh-only`) + `infracost` no longer reference `terraform.tfvars`. Packer-dev-specific `recreate` recipe left intact (out-of-scope — packer-dev has its own tfvars locally).

### ISC-9 — just fmt
`just fmt` exit 0, no diff. `terraform validate` returns `Success! The configuration is valid.`

### ISC-10 — Primary goal achieved
`just plan cafehyna-dev` progression:
- BEFORE: `Error: Failed to read variables file — Given variables file terraform.tfvars does not exist.` (config-level blocker)
- AFTER: `validate` ✅, state lock acquired ✅, configuration parsed ✅. New errors are `No value for required variable` on `aks_subscription_id` / `acr_subscription_id` / `security_contact_email` — the three sensitive values that flow from `.env` via `TF_VAR_*`.
- The tfvars-shape problem is **fully resolved**. Next-step for user: `cp .env.example .env && vi .env` (populate 3 TF_VAR_* lines), then re-run.

### ISC-11 — packer-dev deferred
Decision D1: sibling packer-dev tfvars uses `secrets.auto.tfvars` for 3 values + embeds subscription ID in `custom_image_id`. Requires separate secrets-split audit. Out of scope for this task. Packer-dev local workflow continues to work as-is.

### ISC-12 / A3 / A4 — No destructive ops
Only `terraform validate` and `terraform plan` were invoked. No apply, no destroy, no force push, no branch delete, no state mutation.

### Artifacts
- New: `terraform/environments/cafehyna-dev/common.auto.tfvars`
- Modified: `.gitignore` (+6 lines negation block), `terraform/justfile` (6 recipes — 35 lines changed)
- Untouched: `terraform/environments/packer-dev/*` (deferred by D1)

### Next user action
```
cd terraform/environments/cafehyna-dev
cp .env.example .env
# Fill in TF_VAR_aks_subscription_id, TF_VAR_acr_subscription_id, TF_VAR_security_contact_email
cd ../..
just plan cafehyna-dev  # expect clean plan or documented drift
```
