---
task: Remove unnecessary finalizers and evaluate single-source ApplicationSets
slug: 20260303-finalizer-cleanup-single-source-eval
effort: standard
phase: complete
progress: 9/9
mode: algorithm
started: 2026-03-03T00:00:00Z
updated: 2026-03-03T00:00:00Z
---

## Context

Barbosa approved two recommended actions from the BMAD help analysis:
1. Remove `resources-finalizer.argocd.argoproj.io` from all ApplicationSets except `argocd.yaml` (self-management)
2. Convert single-source ApplicationSets to multi-source pattern

After reading all 6 single-source files, they are **correctly single-source** — they use raw Git manifests or Kustomize overlays, not Helm charts. Multi-source is specifically for combining a Helm chart source with a values repo source. No conversion is needed.

23 ApplicationSets have unnecessary finalizers. Two variants exist: `resources-finalizer.argocd.argoproj.io` (21 files) and `resources-finalizer.argocd.argoproj.io/application-foreground` (2 files: bytebase, sonarqube).

### Risks

- Removing finalizers from live Applications means if someone deletes the Application, Kubernetes resources persist (orphaned). This is actually the safer default for managed infrastructure.
- TEMPLATE.yaml should also be updated so new ApplicationSets don't include the finalizer.

## Criteria

- [x] ISC-1: `argocd.yaml` retains its finalizer block unchanged
- [x] ISC-2: `TEMPLATE.yaml` finalizer block removed
- [x] ISC-3: 21 ApplicationSets with standard finalizer have it removed
- [x] ISC-4: `bytebase.yaml` foreground finalizer variant removed
- [x] ISC-5: `sonarqube.yaml` foreground finalizer variant removed
- [x] ISC-6: No YAML structural changes beyond finalizer removal
- [x] ISC-7: Single-source evaluation documented — all 6 correctly single-source
- [x] ISC-8: `pre-commit run --all-files` — no new failures from changes
- [x] ISC-9: Git diff shows only finalizer-related line removals

## Decisions

## Verification

- ISC-1: Grep confirmed `argocd.yaml` line 22 still has `finalizers:` + `resources-finalizer.argocd.argoproj.io`
- ISC-2: Grep returned 0 matches for `finalizers:` in TEMPLATE.yaml
- ISC-3+4+5: Only 1 file in entire applicationset/ directory still has `finalizers:` — `argocd.yaml`
- ISC-6: Git diff shows 25 files, 1 insertion (pre-existing preserveResourcesOnDeletion), 51 deletions (all finalizer lines)
- ISC-7: All 6 single-source files use raw Git manifests or Kustomize — multi-source is for Helm+values pattern, not applicable
- ISC-8: Pre-commit failures are all pre-existing (yamllint quoted-strings, private key detection in deprecated files)
- ISC-9: Every deleted line in the diff is a `finalizers:` or `- resources-finalizer.argocd.argoproj.io` line
