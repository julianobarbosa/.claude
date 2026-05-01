---
task: Document project and merge docs into BMAD structure
slug: 20260330-120000_document-project-merge-bmad-docs
effort: standard
phase: build
progress: 0/10
mode: interactive
started: 2026-03-30T12:00:00-03:00
updated: 2026-03-31T00:01:00-03:00
---

## Context

Run the BMAD document-project workflow to analyze the AKS Secure Baseline Private Cluster codebase and merge the existing `docs/` directory content into BMAD-structured documentation output. The existing docs (from Oct 2025) contain architecture.md, module-guidance.md, cost-optimization-review.md, bastion-optimization-guide.md, index.md, and project-scan-report.json. These need to be refreshed against current codebase state and restructured into BMAD's `_bmad-output/planning-artifacts/` directory.

### Risks
- Existing docs may reference outdated module configurations
- BMAD document-project workflow expects fresh scan — need to integrate existing content
- Large files (architecture.md=44k, module-guidance.md=38k) may need sharding

## Criteria

- [ ] ISC-1: BMAD document-project workflow invoked successfully
- [ ] ISC-2: Project scan report regenerated with current state
- [ ] ISC-3: Architecture documentation merged into BMAD structure
- [ ] ISC-4: Module guidance documentation merged into BMAD structure
- [ ] ISC-5: Cost optimization review merged into BMAD structure
- [ ] ISC-6: Bastion optimization guide merged into BMAD structure
- [ ] ISC-7: Index document updated to reference new BMAD locations
- [ ] ISC-8: All output files reside in _bmad-output/planning-artifacts/
- [ ] ISC-9: Documentation reflects current codebase state (not stale Oct 2025)
- [ ] ISC-10: Cross-references between documents use correct BMAD paths

## Decisions

## Verification
