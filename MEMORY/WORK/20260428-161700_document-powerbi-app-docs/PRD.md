---
task: Document Power BI app using Microsoft Learn URL
slug: 20260428-161700_document-powerbi-app-docs
effort: standard
phase: complete
progress: 10/10
mode: interactive
started: 2026-04-28T16:17:00-03:00
updated: 2026-04-28T16:20:00-03:00
---

## Context

Barbosa invoked `bmad-document-project` with a Microsoft Learn URL pointing to the Azure Cost Management Power BI template app documentation. Existing project docs in `docs/` cover the custom HyperaFinOps PBIP project (last updated 2026-04-27). This task adds a new deep-dive doc covering the Azure Cost Management **template app** — an installable Power BI app from AppSource — which was being deployed to the `devops-team` workspace in the previous session.

The Microsoft Learn URL is the authoritative source:
https://learn.microsoft.com/en-us/azure/cost-management-billing/costs/analyze-cost-data-azure-cost-management-power-bi-template-app

Output: `docs/deep-dive-powerbi-app.md` + updated `docs/index.md`.

### Risks
- MS Learn page may be large; WebFetch may truncate — use microsoft-docs MCP as fallback
- Deep-dive template designed for code files; adapt for external-reference documentation
- index.md "Deep-Dive Documentation" section may need to be created

## Criteria

- [x] ISC-1: Microsoft Learn page content fetched and readable [E]
- [x] ISC-2: Deep-dive doc file created at docs/deep-dive-powerbi-app.md [E]
- [x] ISC-3: Doc includes overview of what the Azure Cost Management app is [I]
- [x] ISC-4: Doc includes prerequisites and requirements section [I]
- [x] ISC-5: Doc includes data sources and connection details [I]
- [x] ISC-6: Doc includes report pages and visuals described [I]
- [x] ISC-7: Doc includes deployment/installation steps summary [I]
- [x] ISC-8: Doc includes reference to Microsoft Learn URL as source [E]
- [x] ISC-9: docs/index.md updated with link to new deep-dive doc [E]
- [x] ISC-A1: Existing docs/index.md content not altered beyond adding the new link [E]

## Decisions

## Verification
