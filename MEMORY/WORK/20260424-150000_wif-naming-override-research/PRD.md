---
task: Research naming module override patterns for WIF module
slug: 20260424-150000_wif-naming-override-research
effort: extended
phase: observe
progress: 0/0
mode: interactive
started: 2026-04-24T15:00:00-03:00
updated: 2026-04-24T15:00:00-03:00
---

## Context

The user is code-reviewing `terraform/modules/wif-identity/` which creates one UAMI + one FIC for Azure DevOps Workload Identity Federation. The module currently uses:

```hcl
locals {
  uami_name = coalesce(var.uami_name_override, "id-${var.env_name}-wif")
  fic_name  = coalesce(var.fic_name_override, "fic-${var.service_connection_name}")
}
```

Key tensions:
- ADR 010 §4 pinned UAMI name as `id-<env>-wif` (binding contract)
- AC #2 authorized exactly ONE override variable (`uami_name_override`)
- Implementer added `fic_name_override` for symmetry (unspec'd)
- Sibling env `terraform/environments/packer-dev/module.tf` already uses `Azure/naming/azurerm` v0.4.3
- ADR 010 §2 D6: FIC subject-claim is load-bearing; rename breaks federation (AADSTS700213)

User needs primary-source research (not opinion) for a real review decision. Three candidate outcomes:
- A) Keep both overrides, document `fic_name_override`
- B) Remove `fic_name_override`, tighten to spec
- C) Rewrite naming layer to use `Azure/naming/azurerm`, drop both override knobs

### Research Questions
1. Does `Azure/terraform-azurerm-naming` cover `azurerm_user_assigned_identity` and `azurerm_federated_identity_credential`? What prefixes?
2. Community position on `*_name_override` anti-pattern in Azure TF modules (AVM, CAF, HashiCorp forum, Reddit)
3. Symmetric vs asymmetric override knobs — idiomatic pattern?
4. Security risk: override knobs on contract-bound identity resources

## Criteria

- [ ] ISC-1 [E]: Azure/naming UAMI prefix identified with GitHub file citation
- [ ] ISC-2 [E]: Azure/naming FIC support confirmed or denied with citation
- [ ] ISC-3 [E]: Microsoft CAF abbreviation for UAMI documented with URL
- [ ] ISC-4 [E]: Microsoft CAF abbreviation for FIC documented with URL
- [ ] ISC-5 [E]: AVM UAMI module input pattern extracted from README
- [ ] ISC-6 [E]: Azure/caf-terraform naming pattern cited from repo
- [ ] ISC-7 [E]: At least one HashiCorp Discuss or Reddit thread on name overrides cited
- [ ] ISC-8 [E]: Symmetry convention documented with concrete AVM/CAF example
- [ ] ISC-9 [E]: Load-bearing-identity risk position sourced or marked unsourced
- [ ] ISC-10 [E]: Recommendation A/B/C stated with reasoning tied to citations
- [ ] ISC-11 [E]: Findings doc is 600-1000 words (capped at 1000)
- [ ] ISC-12 [E]: Every factual claim has inline URL citation
- [ ] ISC-13 [E]: Split consensus or missing sources flagged honestly
- [ ] ISC-14 [E]: Four section structure followed (1. Azure/naming, 2. Community, 3. Symmetry, 4. Recommendation)
- [ ] ISC-15 [E]: Primary sources preferred over blog posts
- [ ] ISC-16 [E]: Findings file written to MEMORY/WORK path and shared absolute path
- [ ] ISC-A1: No speculation when authoritative source is missing
- [ ] ISC-A2: No emoji in findings document
- [ ] ISC-A3: No padding to hit word count — dense citations only
- [ ] ISC-A4: No recap of the context the user provided

## Decisions
