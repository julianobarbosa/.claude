---
task: Create complete justfile for ArgoCD project
slug: 20260421-164111_justfile-argocd-project
effort: standard
phase: complete
progress: 18/18
mode: interactive
started: 2026-04-21T16:41:11Z
updated: 2026-04-21T16:48:00Z
---

## Context

Hypera Charlie ArgoCD project — Kustomize-managed Kubernetes manifests for the
`charlie-server` app in namespace `charlie-prd`. Pre-commit config references
`make pre-commit`/`make pre-push` with no Makefile present. Created a justfile
as the canonical task runner.

### Plan

Single `justfile` at worktree root. Variables for namespace/app/image/tag.
Recipes grouped: help, setup, formatting/linting, build, validation, deploy,
image, ArgoCD, secret helpers, aggregate entrypoints.

### Risks

- `kubectl apply --dry-run=client` still contacts API server → switched
  `validate` to pure `kustomize build` offline check; kept cluster-aware
  variants as `validate-client`/`validate-server`.
- `list-secrets` grep pipeline flaky under pipefail → replaced with awk.

## Criteria

- [x] ISC-1: [E] justfile exists at worktree repo root
- [x] ISC-2: [E] Default recipe lists available recipes via `just --list`
- [x] ISC-3: [I] Namespace variable defaults to `charlie-prd` and is overridable
- [x] ISC-4: [I] App name variable defaults to `charlie-server` and is overridable
- [x] ISC-5: [I] Image variable points to `acrcharliehypera.azurecr.io/charlie-server`
- [x] ISC-6: [R] `fmt-check` recipe runs `just --fmt --unstable --check`
- [x] ISC-7: [R] `lint` recipe runs yamllint on all yaml files
- [x] ISC-8: [E] `pre-commit` recipe runs pre-commit on staged files
- [x] ISC-9: [E] `pre-push` recipe runs pre-commit with `--hook-stage push` on all files
- [x] ISC-10: [I] `build` recipe runs `kustomize build .` and prints manifest
- [x] ISC-11: [I] `validate` recipe verifies kustomize overlay builds offline
- [x] ISC-12: [I] `diff` recipe pipes `kustomize build` into `kubectl diff`
- [x] ISC-13: [I] `apply` recipe pipes `kustomize build` into `kubectl apply -n {{namespace}}`
- [x] ISC-14: [I] `delete` recipe pipes `kustomize build` into `kubectl delete -n {{namespace}}`
- [x] ISC-15: [I] `set-image tag` recipe runs `kustomize edit set image` with new tag
- [x] ISC-16: [I] `argocd-sync` recipe runs `argocd app sync {{app}}`
- [x] ISC-17: [I] `argocd-status` recipe runs `argocd app get {{app}}`
- [x] ISC-18: [I] `ci` recipe aggregates fmt-check + lint + validate
- [x] ISC-A1: Anti — no recipes run destructive commands without visible command output
- [x] ISC-A2: Anti — no hardcoded secrets or credentials in the justfile
- [x] ISC-A3: Anti — no recipe requires tools beyond those already used by the repo

## Decisions

- Default validation is offline (`kustomize build` only). Cluster-dependent
  variants exposed as `validate-client` and `validate-server`.
- `list-secrets` uses awk state machine instead of `grep -A1 | grep | awk`
  pipeline to avoid pipefail brittleness.
- Added `validate-client` recipe mid-flight when splitting offline vs
  cluster-aware validation — keeps the common case (`ci`, `validate`)
  executable without kubeconfig.

## Verification

- `just --list`: lists all 37 recipes
- `just vars`: shows resolved defaults
- `just namespace=test-ns vars`: confirms override works
- `just build`: renders the overlay
- `just show-images`: returns `image: acrcharliehypera.azurecr.io/charlie-server:v0.0.1`
- `just current-image`: returns `newTag:v0.0.1`
- `just list-secrets`: returns `acr-azure-auth`
- `just fmt-check`: exit 0 (clean formatting)
- `just validate`: prints `kustomize build OK`
- `just ci`: fmt-check passes; lint surfaces pre-existing yaml length
  violations in `hypera-ca-secret.yaml` and `acr-auth.yaml` (repo content
  issue, not justfile defect — correct behavior)
