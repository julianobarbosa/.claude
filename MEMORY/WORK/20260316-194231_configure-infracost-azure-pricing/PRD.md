---
task: Configure Infracost with Azure pricing integration
slug: 20260316-194231_configure-infracost-azure-pricing
effort: standard
phase: complete
progress: 7/8
mode: interactive
started: 2026-03-16T19:42:31Z
updated: 2026-03-16T19:50:00Z
---

## Context

Infracost v0.10.43 configured with Azure pricing for this repo's two Terraform projects.

### Risks
- AVM bastion module resolves but azurerm_bastion_host not priced by Infracost (upstream limitation)

## Criteria

- [x] ISC-1: Root-level infracost.yml covers both terraform/ and dev/terraform/ projects
- [x] ISC-2: infracost-usage.yml provides usage estimates for storage account
- [x] ISC-3: infracost-usage.yml provides usage estimates for NAT gateway data processing
- [x] ISC-4: infracost-usage.yml provides usage estimates for custom image storage
- [x] ISC-5: infracost breakdown runs successfully from repo root
- [ ] ISC-6: Bastion host appears in cost breakdown with pricing
- [x] ISC-7: VM instance appears in cost breakdown with correct SKU pricing
- [x] ISC-8: Total monthly cost estimate reflects all priced resources accurately

## Decisions

- ISC-6: Infracost does not support azurerm_bastion_host pricing — upstream limitation, not configurable.
- Bastion actual cost: ~$262/mo (Standard SKU, 2 scale units) must be tracked separately via Azure Cost Management.

## Verification

Verified via `infracost breakdown --config-file infracost.yml`: 44 resources detected, $238.93/mo estimated, no warnings.
