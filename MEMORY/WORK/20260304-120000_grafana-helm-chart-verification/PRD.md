---
task: verify grafana helm chart defaults and config keys
slug: 20260304-120000_grafana-helm-chart-verification
effort: standard
phase: complete
progress: 4/4
mode: interactive
started: 2026-03-04T12:00:00Z
updated: 2026-03-04T12:05:00Z
---

## Context

User needs authoritative answers on four Grafana/Robusta Helm chart configuration questions to resolve ambiguity while setting up a monitoring stack. All answers verified from primary source files.

## Criteria

- [x] ISC-1: Mimir-distributed 5.6.0 default service account name confirmed with source
- [x] ISC-2: Tempo-distributed 1.48.1 query-frontend HTTP port confirmed with source
- [x] ISC-3: mimir_config_override validity vs mimir.structuredConfig confirmed
- [x] ISC-4: Robusta kube-prometheus-stack key casing confirmed with Chart.yaml

## Verification

1. mimir.fullname helper in _helpers.tpl: when release="mimir", infix="mimir", overlap detected -> returns "mimir". ServiceAccount name = "mimir".
2. tempo-distributed query-frontend HTTP port = 3200. Confirmed via GitHub issue #3968 and values.yaml server.httpListenPort.
3. mimir_config_override does NOT exist as a top-level key. Correct key is mimir.structuredConfig.
4. Robusta Chart.yaml shows dependency name: kube-prometheus-stack with no alias -> values key is kube-prometheus-stack (kebab-case).
