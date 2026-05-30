# `azuredevops_pipeline_authorization` eliminates manual "grant access" clicks

## What

The `microsoft/azuredevops` Terraform provider's `azuredevops_pipeline_authorization` resource (plus `data.azuredevops_serviceendpoint_*` for cross-state SC lookups + `data.azuredevops_variable_group` for variable groups) declaratively grants a pipeline access to:

- Variable groups (`type = "variablegroup"`)
- Service connections / endpoints (`type = "endpoint"`)
- Agent queues (`type = "queue"`)
- Environments (`type = "environment"`)

This makes the **F1 (variable group access denied)** and **F2 (service connection not authorized)** ADO failure modes — which fire on every new pipeline registration when the ADO UI's "+ grant access" click is missed — **impossible by construction**. The auth resource is in the same `terraform apply` that creates the pipeline; drift surfaces on the next `plan`.

## Why it matters

Every "DEFERRED-VERIFY at operator pipeline-registration session" story that follows the manual ADO UI walkthrough has F1 + F2 as the top two pre-staged failure modes. With this resource:

- The failure modes are eliminated, not "documented as a fix-path."
- Authorization is rebuildable from git history.
- Drift-detected: someone clicking "remove" in the Library/SC permissions pane shows up on next `terraform plan` as a needed re-create.
- Cross-env state coupling avoided: use `data.azuredevops_serviceendpoint_*` to look up an SC by name from the env that owns it without `terraform_remote_state` plumbing.

## Where it's used

- `terraform/modules/ado-pipelines/main.tf` (introduced 2026-05-27 in Story 13-1 Option B pivot) — `azuredevops_pipeline_authorization.variable_group` + `azuredevops_pipeline_authorization.endpoint` for each pipeline in the env-layer wiring.
- `terraform/modules/wif-ado-service-connection/main.tf:42-49` — earlier use (per-SC pipeline authorization, the inverse direction of the relationship).
- Upstream ALZ accelerator `accelerator/output/bootstrap/v7.2.1/modules/azure_devops/pipeline.tf:18-40` — canonical reference shape covering all four `type` values.

## Provider scope requirements

To create these resources, the operator's PAT needs:
- "Build (Read, write & execute)" — for the underlying `azuredevops_build_definition`
- "Code (Read)" — for the repo binding
- "Variable Groups (Read)" — for the `data` lookup on variable groups
- "Service Connections (Read & manage)" — Story 10-4's existing scope, covers endpoint authorization
- "Project and Team (Read)" — for `data.azuredevops_project`

## When NOT to use

- When the pipeline is registered manually in ADO UI and the auth is intended to stay manual (i.e., short-lived throwaway pipeline). Even then, the cost of authoring the resource is one paste of a 6-line block — usually worth it.
- For agent-pool authorization, prefer keeping it in the module that owns the agent pool (Story 14-5's `ado-agent` in this repo) so the pool lifecycle and its consumers don't cross-couple.
