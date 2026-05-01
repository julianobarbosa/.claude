---
capture_type: LEARNING
timestamp: 2026-03-03 17:52:06 PST
rating: 1
source: explicit
auto_captured: true
tags: [low-rating, improvement-opportunity]
---

# Low Rating Captured: 1/10

**Date:** 2026-03-03
**Rating:** 1/10
**Detection Method:** Explicit Rating


---

## Context

Now I have a complete picture. Here's the guide:

```
════ PAI | NATIVE MODE ═══════════════════════
🗒️ TASK: Guide ApplicationSet creation for new workload
📃 CONTENT: Step-by-step procedure based on project patterns
🗣️ TARS: Here's exactly what you need to deploy a new service via ApplicationSet
```

## How to Add a New ArgoCD ApplicationSet for Your Workload

Based on your project's established patterns, here are the **exact steps** in order:

---

### Step 1: Create the ApplicationSet YAML

```bash
cp infra-team/applicationset/TEMPLATE.yaml infra-team/applicationset/<your-service>.yaml
```

Then edit the file replacing all placeholders:

| Placeholder | Replace With | Example |
|---|---|---|
| `<SERVICE_NAME>` | Your service name | `grafana-oncall` |
| `<COMPONENT>` | Category | `monitoring`, `security`, `networking` |
| `<CHART_NAME>` | Helm chart name | `grafana-oncall` |
| `<CHART_REPO_URL>` | Helm repo URL | `https://grafana.github.io/helm-charts` |
| `<CHART_VERSION>` | Pinned version | `1.2.3` |
| `<TARGET_NAMESPACE>` | K8s namespace | `monitoring` |
| `<PURPOSE>` | Namespace purpose label | `monitoring` |
| `<CRITICALITY>` | `high`, `medium`, `low` | `medium` |

Remove clusters from the generator `elements` list where the service **should NOT** deploy. Set the `sync-wave` based on dependencies.

---

### Step 2: Create Environment Values Files

```bash
# Create directories for each target cluster
mkdir -p argo-cd-helm-values/kube-addons/<your-service>/{cafehyna-dev,cafehyna-hub,cafehyna-prd}

# Create values.yaml for each
touch argo-cd-helm-values/kube-addons/<your-service>/cafehyna-dev/values.yaml
touch argo-cd-helm-values/kube-addons/<your-service>/cafehyna-hub/values.yaml
touch argo-cd-helm-values/kube-addons/<your-service>/cafehyna-prd/values.yaml
```

For **dev clusters**, include spot tolerations:
```yaml
# cafehyna-dev/values.yaml
tolerations:
  - key: kubernetes.azure.com/scalesetpriority
    operator: Equal
    value: "spot"
    effect: NoSched

---

## Improvement Notes

This response was rated 1/10 by Barbosa. Use this as an improvement opportunity.

---
