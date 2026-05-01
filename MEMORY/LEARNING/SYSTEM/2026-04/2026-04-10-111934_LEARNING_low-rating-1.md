---
capture_type: LEARNING
timestamp: 2026-04-10 11:19:34 PST
rating: 1
source: explicit
auto_captured: true
tags: [low-rating, improvement-opportunity]
---

# Low Rating Captured: 1/10

**Date:** 2026-04-10
**Rating:** 1/10
**Detection Method:** Explicit Rating
**Feedback:** and 2

---

## Context

This confirms it. **Source 3 is a standard pattern** in your project — every ApplicationSet that needs secrets uses it. Here's the summary:

| ApplicationSet | Has Source 3 | Has SecretProviderClass | Other extra manifests |
|---|---|---|---|
| **defectdojo** | Yes | `secretproviderclass.yaml` | configmaps, secret-sync-pod, servicemonitor |
| **dependency-track** | Yes | `secretproviderclass.yaml` | secret-sync-pod, exporter, dashboards |
| **external-dns** | Yes | `secretproviderclass.yaml` | — |
| **robusta** | Yes | `secretproviderclass.yaml` (3 SPCs) | — |
| **bytebase** | Yes | `secretproviderclass.yaml` | secret-sync-pod, ingress |
| **netbackup** | Yes | **MISSING** | — |

So the pattern is clear:
1. Source 3 **should stay** — it's the standard way to deploy SecretProviderClass and extra manifests
2. The **error is because the directory is empty** after excluding `values.yaml`
3. NetBackup **will need secrets** (master server token, certs, etc.) — so a SecretProviderClass will be needed eventually

**The question now**: Does the NetBackup Helm chart itself create workloads that would consume these secrets? Since the operator pods aren't running yet (empty namespace), the chart might need the actual configuration values (masterServer, token, etc.) in `values.yaml` before it deploys anything.

Two paths forward:
1. **Create a placeholder SecretProviderClass** now to fix the error, ready for when the backup team provides Key Vault secrets
2. **First populate `values.yaml`** with real netbackup config so the operator actually deploys, then add SecretProviderClass

Which direction does the backup team situation point to? Do you have the netbackup master server details yet, or are we still waiting on that?

---

## Improvement Notes

This response was rated 1/10 by Barbosa. Use this as an improvement opportunity.

---
