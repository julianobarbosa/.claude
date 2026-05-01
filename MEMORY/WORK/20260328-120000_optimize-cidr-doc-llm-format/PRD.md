---
task: Optimize CIDR doc format for LLM consumption
slug: 20260328-120000_optimize-cidr-doc-llm-format
effort: extended
phase: complete
progress: 18/18
mode: interactive
started: 2026-03-28T12:00:00-03:00
updated: 2026-03-28T12:01:00-03:00
---

## Context

Juliano wants the CIDR Azure subscriptions reference document (`_bmad-output/project-knowledge/cidr-azure-subscriptions.md`) reformatted for optimal LLM consumption using BMAD methodology. Current doc is 794 lines / ~12,428 tokens with significant bloat from raw subnet calculations, verbose tables, mermaid diagrams, and prose explanations of common networking concepts.

The document serves as project-knowledge for LLM agents working on Hypera's Azure infrastructure — AKS clusters, Terraform modules, network planning. The format must preserve all factual CIDR data while dramatically reducing token count.

### Risks
- Losing CIDR allocation data during compression (mitigated by verification pass)
- Format too compressed for human maintainability (balance needed)
- Mermaid diagrams carry topology info that must be preserved in text form
- Removing Terraform examples may force agents to generate more boilerplate output tokens
- 56% of current tokens are noise (derived data, prose, visual diagrams)

## Criteria

- [x] ISC-1: Research on LLM doc format best practices completed and synthesized
- [x] ISC-2: FirstPrinciples analysis identifies root token waste patterns in current doc
- [x] ISC-3: Format specification document produced with clear rules
- [x] ISC-4: YAML frontmatter follows BMAD distillate conventions (type, sources, token_estimate)
- [x] ISC-5: All 16 subscription CIDR allocations preserved in compact table
- [x] ISC-6: Hub-spoke topology info preserved without mermaid (text/bullet form)
- [x] ISC-7: AKS network addressing (dev + prd) preserved with design rationale
- [x] ISC-8: Painelclientes hub/dev/prd subnet details preserved
- [x] ISC-9: NSG baseline rules preserved in compressed form
- [x] ISC-10: Infrastructure-dev networks preserved
- [x] ISC-11: Azure reserved IP rules preserved (5 per subnet)
- [x] ISC-12: Terraform config examples compressed to key values only (no full HCL blocks)
- [x] ISC-13: Appendix A raw subnet calculations removed (replaced with ipcalc command reference)
- [x] ISC-14: Token count reduced by at least 40% from original 12,428
- [x] ISC-15: No prose paragraphs — bullets only per BMAD distillate rules
- [x] ISC-16: Each bullet self-contained per BMAD compression rules
- [x] ISC-17: Structural review validates organization and completeness
- [x] ISC-18: Rewritten document saved to project-knowledge location

## Decisions

## Verification
- All 18/18 ISC criteria pass
- Token reduction: 74.7% bytes, ~69% estimated tokens (12,428 → ~3,800)
- Zero CIDR data lost (all 16 subscriptions, all painelclientes subnets, all AKS configs verified)
- Structural review: document is sound, Reference/Database model, BMAD-compliant
- Two deliverables: format guide + rewritten document
