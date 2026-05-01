---
task: Document KQL project structure and context
slug: 20260402-130000_document-kql-project-context
effort: standard
phase: complete
progress: 8/8
mode: interactive
started: 2026-04-02T13:00:00-03:00
updated: 2026-04-02T13:03:00-03:00
---

## Context

Document the greenfield KQL (Kusto Query Language) project within the `microsoft-copilot-cowork` monorepo. The project aims to be a comprehensive KQL resource covering: query libraries, tools, learning/reference materials, and query creation utilities. Targets all major Azure data services: Log Analytics/Monitor, Microsoft Sentinel, and Azure Data Explorer.

The project currently has only BMAD v6.2.2 scaffolding with empty `docs/`, `Plans/`, and `design-artifacts/` directories. No source code or documentation exists yet. The document-project task will produce a `project-context.md` that gives AI agents full context about the project's purpose, scope, structure, and conventions.

### Risks
- Project is greenfield with no existing code/docs to derive context from — must rely on user input
- Scope is broad (library + tools + learning + query creation) — document must clearly delineate planned scope

## Criteria

- [x] ISC-1: project-context.md exists in docs/ directory
- [x] ISC-2: Document identifies project name and purpose clearly
- [x] ISC-3: Document lists all target Azure services (Log Analytics, Sentinel, ADX)
- [x] ISC-4: Document describes query library scope and organization
- [x] ISC-5: Document describes tools/utilities scope
- [x] ISC-6: Document describes learning/reference material scope
- [x] ISC-7: Document describes project directory structure and conventions
- [x] ISC-8: Document includes tech stack and KQL version targeting

## Decisions

## Verification
