---
capture_type: LEARNING
timestamp: 2026-03-31 17:04:34 PST
rating: 1
source: explicit
auto_captured: true
tags: [low-rating, improvement-opportunity]
---

# Low Rating Captured: 1/10

**Date:** 2026-03-31
**Rating:** 1/10
**Detection Method:** Explicit Rating


---

## Context

Setting `workflow_mode = "full_rescan"`. Now choose your scan depth:

**1. Quick Scan** (2-5 minutes)
- Pattern-based analysis without reading source files
- Scans: Config files, package manifests, directory structure
- Best for: Quick project overview, initial understanding

**2. Deep Scan** (10-30 minutes)
- Reads files in critical directories based on project type
- Scans: All critical paths from documentation requirements
- Best for: Comprehensive documentation for brownfield PRD

**3. Exhaustive Scan** (30-120 minutes)
- Reads ALL source files in project
- Scans: Every source file (excludes node_modules, dist, build)
- Best for: Complete analysis, migration planning, detailed audit

Your choice [1/2/3] (default: 1):

For an infra project with 9 Terraform modules, **Deep Scan** (option 2) will give the best quality-to-time ratio — it reads the actual `.tf` files in each module to extract real resource definitions, variables, and outputs.

---

## Improvement Notes

This response was rated 1/10 by Barbosa. Use this as an improvement opportunity.

---
