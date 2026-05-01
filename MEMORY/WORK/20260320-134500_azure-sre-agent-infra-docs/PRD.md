---
task: Implement Azure SRE Agent infrastructure and docs
slug: 20260320-134500_azure-sre-agent-infra-docs
effort: advanced
phase: complete
progress: 30/30
mode: interactive
started: 2026-03-20T13:45:00-03:00
updated: 2026-03-20T13:45:30-03:00
---

## Context

Implement Azure SRE Agent infrastructure for the Microsoft Copilot SRE project. The existing `kusto.tf` is a monolithic 106-line file containing providers, variables, resources, and outputs. Plan requires:
1. Fetching Azure SRE Agent documentation from `sre.azure.com/docs?audience=external` into local `docs/azure-sre-agent/`
2. Refactoring `kusto.tf` into logical terraform files
3. Adding new SRE Agent terraform resources (managed identity, Key Vault, container, Log Analytics)
4. Creating a BMAD SRE Ops agent following existing agent patterns

### Risks
- `sre.azure.com/docs` may use client-side rendering, requiring browser tools instead of WebFetch
- azurerm provider v3 may not support all SRE Agent resources — need to verify resource types exist
- Refactoring `kusto.tf` must preserve existing state (no resource address changes without `moved` blocks)
- Existing `sre_principal_id` variable already references an App — new managed identity must align

### Plan
- Phase 1: Fetch docs via WebFetch/browser, structure into categorized markdown
- Phase 2a: Split `kusto.tf` preserving resource addresses exactly
- Phase 2b-2d: Create `sre-agent.tf`, `sre-agent-config.tf`, update variables/outputs
- Phase 3: Create BMAD SRE Ops agent, register in help CSV

## Criteria

### Phase 1: Documentation
- [x] ISC-1: `docs/azure-sre-agent/README.md` exists with index and source URLs
- [x] ISC-2: At least 5 categorized subdirectories under `docs/azure-sre-agent/`
- [x] ISC-3: Each markdown file has source URL and fetch date header
- [x] ISC-4: Each markdown file contains non-trivial content (>10 lines)

### Phase 2a: Terraform Refactor
- [x] ISC-5: `providers.tf` contains terraform block and provider block only
- [x] ISC-6: `variables.tf` contains all variable blocks from original kusto.tf
- [x] ISC-7: `kusto.tf` contains only Kusto resource and data source blocks
- [x] ISC-8: `outputs.tf` contains all output blocks from original kusto.tf
- [x] ISC-9: No resource address changes — all resource names identical to original
- [x] ISC-10: `data "azurerm_client_config"` preserved in appropriate file

### Phase 2b: SRE Agent Resources
- [x] ISC-11: `sre-agent.tf` contains `azurerm_user_assigned_identity` resource
- [x] ISC-12: `sre-agent.tf` contains `azurerm_role_assignment` for the identity
- [x] ISC-13: `sre-agent.tf` contains `azurerm_key_vault` resource
- [x] ISC-14: `sre-agent.tf` contains container runtime resource (ACI)
- [x] ISC-15: `sre-agent.tf` contains `azurerm_log_analytics_workspace` resource

### Phase 2c: Integration Config
- [x] ISC-16: `sre-agent-config.tf` contains Kusto principal assignment for agent
- [x] ISC-17: `sre-agent-config.tf` contains `azurerm_monitor_diagnostic_setting`
- [x] ISC-18: `sre-agent-config.tf` contains `azurerm_monitor_action_group`

### Phase 2d: Variables and Outputs
- [x] ISC-19: `variables.tf` includes `sre_agent_name` variable
- [x] ISC-20: `variables.tf` includes `sre_agent_container_image` variable
- [x] ISC-21: `variables.tf` includes `sre_agent_mcp_connectors` map variable
- [x] ISC-22: `variables.tf` includes `observability_providers` list variable
- [x] ISC-23: `outputs.tf` includes `sre_agent_endpoint` output
- [x] ISC-24: `outputs.tf` includes `sre_agent_identity_principal_id` output

### Phase 3: BMAD Agent
- [x] ISC-25: `_bmad/bmm/agents/sre-ops/` directory exists with agent YAML
- [x] ISC-26: SRE Ops agent has incident management menu items
- [x] ISC-27: SRE Ops agent references `docs/azure-sre-agent/` for context
- [x] ISC-28: `bmad-help.csv` contains SRE Ops agent entries

### Anti-criteria
- [x] ISC-A-1: Anti: No hardcoded secrets or API keys in terraform files
- [x] ISC-A-2: Anti: No changes to subscription_id or resource_group defaults

## Decisions

## Verification

- ISC-1: README.md exists (79 lines) with fetch date and source URL table
- ISC-2: 7 subdirectories (00-07), 6 with markdown content
- ISC-3: All files have Source URL + Fetch date headers
- ISC-4: All 13 files have 55-83 lines each
- ISC-5-10: terraform refactor verified — all resources preserved, terraform validate passes
- ISC-11-15: sre-agent.tf has identity, role assignments, KV, ACI, Log Analytics
- ISC-16-18: sre-agent-config.tf has Kusto ingestor, diagnostic setting, action group
- ISC-19-24: All new variables and outputs present with correct types
- ISC-25-28: BMAD SRE Ops agent created with correct pattern, 5 CSV entries added
- ISC-A-1: No hardcoded secrets confirmed
- ISC-A-2: Subscription and resource group defaults unchanged
- terraform validate: "Success! The configuration is valid."
