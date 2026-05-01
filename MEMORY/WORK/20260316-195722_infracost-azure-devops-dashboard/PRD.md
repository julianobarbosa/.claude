---
task: Integrate Infracost results into Azure DevOps dashboard
slug: 20260316-195722_infracost-azure-devops-dashboard
effort: standard
phase: complete
progress: 10/10
mode: interactive
started: 2026-03-16T19:57:22Z
updated: 2026-03-16T20:06:00Z
---

## Context

Added Infracost cost estimation as Stage 4 to the existing PR validation pipeline.

## Criteria

- [x] ISC-1: New "Cost" stage added to PR validation pipeline
- [x] ISC-2: Cost stage depends on Plan stage completion
- [x] ISC-3: Infracost CLI installed in pipeline agent
- [x] ISC-4: Infracost uses terraform plan JSON from Plan stage
- [x] ISC-5: Cost breakdown output published as pipeline artifact
- [x] ISC-6: Cost diff posted as PR comment via Infracost
- [x] ISC-7: INFRACOST_API_KEY referenced from variable group
- [x] ISC-8: Pipeline YAML syntax is valid
- [x] ISC-9: infracost-usage.yml referenced in pipeline config
- [x] ISC-10: Integration plan doc updated to reflect Phase 2 progress

## Decisions

- Manual CLI install over marketplace task
- Plan stage converts tfplan to JSON for Cost stage consumption
- `--behavior=update` for clean PR comments
- PR comment conditional on Build.Reason=PullRequest

## Verification

All 10/10 criteria verified. YAML parses cleanly. Pipeline: Validate → Security → Plan → Cost.
