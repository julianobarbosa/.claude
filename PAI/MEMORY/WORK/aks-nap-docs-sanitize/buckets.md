# aks :: nap :: docs — Source Buckets (81 total)

Generated 2026-05-24. Categorization by URL+title, before HTTP probe results.

## Bucket A — Exact / Near-Exact Duplicates (kill list = 1)

These pairs point to the same logical Microsoft Learn doc on different mirrors. Keep `learn.microsoft.com`, drop the others.

| Drop | URL | Reason | Keep |
|------|-----|--------|------|
| `c29c83fc` | docs.azure.cn/.../node-auto-provisioning-aksnodeclass | China mirror of MS Learn page | `e6393df3` learn.microsoft.com |

(`02263472` is the GitHub source-of-truth `.md` for the same page → keep separately as code-level reference.)

(`56d40359` docs.azure.cn reliability-availability-zones-configure has no exact MS Learn counterpart in the list; KEEP for now.)

(`d781aa63` docs.azure.cn upgrade-options has no MS Learn counterpart in the list; KEEP for now.)

---

## Bucket B — Off-Topic (kill list = 9)

Not about AKS NAP, Karpenter, or AKS Automatic.

| ID | Title | Why off-topic |
|----|-------|---------------|
| `e5801108` | Automated Cloud Service Instance Testing for Warm Bootup Using Multi-Agent Systems (ResearchGate) | Academic paper on multi-agent test orchestration; no NAP content |
| `71da7de7` | Azure Signal Monitor (azurecharts.com/signals) | Generic Azure-wide change feed |
| `9e14d7ad` | Azure Update Storyline (azurecharts.com/updates/story?id=7690) | Single Azure update card, not NAP-specific |
| `ed2370fb` | Azure Weekly Update - 20th February 2026 (Reddit) | Generic Azure weekly roundup |
| `9596a9ef` | Azure/AKS 2025-03-16 on GitHub - NewReleases.io | Generic AKS release tracker (snapshot of one release date) |
| `fcfc2116` | Anyone use kubernetes provider in terraform? (Reddit) | Terraform-provider question, not NAP |
| `b623ed2f` | How to Build Resilient Backends with Kubernetes: 7 Lessons (Growin) | Generic K8s resilience post |
| `5382acff` | How to Choose the Right Cloud Provider for Kubernetes (SparkFabrik) | Generic cloud-comparison post |
| ~~`7fc81ea3`~~ | researchradicals.com PDF | **MOVED — probe revealed legitimate scholarly PDF on cloud autoscaling (HPA/VPA/CA, predictive scaling). ON-TOPIC. Keep.** |

---

## Bucket C — Borderline / Cross-Cloud Reference (kill candidates = 5; user decides)

These are AWS/EKS Karpenter content. Useful as Karpenter doctrine cross-reference; not Azure-specific. **Default: KEEP** (Karpenter behavior on AKS often follows EKS lessons). Surface for user to decide.

| ID | Title | Note |
|----|-------|------|
| `74a0166b` | AWS EKS Migration: Switch from CA to Karpenter (allcloud) | EKS playbook |
| `0ec412f0` | How Salesforce migrated CA → Karpenter (AWS Architecture Blog) | EKS-fleet case study |
| `9520ece0` | CA vs Karpenter: We tested both on 100+ EKS clusters (Reddit) | EKS practitioner thread |
| `4c460437` | Cluster Autoscaler Vs Karpenter (nOps) | Generic comparison |
| `f51099e5` | Karpenter vs CA: Definitive Guide for 2025 (ScaleOps) | Generic comparison |
| `a3984867` | Karpenter vs CA: Migrated 50+ Clusters (Here's What Won) | Generic comparison |
| `e77a5666` | Migrating from CA (karpenter.sh canonical docs) | **Canonical Karpenter doc — keep regardless** |
| `59748b9f` | paolosalvatori/aks-kaito-terraform | About KAITO (AI workload), not NAP — leans off-topic |

---

## Bucket D — Community Q&A / Reddit / Discuss-Kubernetes (kill candidates if "canonical-only" = 9)

Practitioner threads. Lower signal but contain real-world failure modes.

| ID | Title | Source |
|----|-------|--------|
| `b8510b43` | AKS NAP (preview) not working | Microsoft Q&A |
| `2d034e07` | AKS Node Auto Provisioning - NAP | Microsoft Q&A |
| `a220e1e8` | Karpenter can be used in AKS? | Microsoft Q&A |
| `dec0d13e` | Karpenter on AKS: SubnetIsFull errors | Microsoft Q&A |
| `c9ab11a1` | Looking for your experiences with AKS NAP + Karpenter | Reddit /r/AZURE |
| `58081ed5` | Karpenter - horribly inefficient allocation? | Reddit /r/kubernetes |
| `b46f727d` | Running Karpenter and AKS CA Together | discuss.kubernetes.io |
| (`fcfc2116`, `ed2370fb` already in Bucket B) | — | — |

---

## Bucket E — Synthesized Markdown (user decides individually = 2)

Long-form synthesis docs added as in-notebook MD sources. Likely results of past `notebooklm ask` runs distilled to MD.

| ID | Title |
|----|-------|
| `8867215c` | The Evolution of Autonomous Compute: Karpenter & NAP in AKS |
| `8fc56b80` | The Strategic Evolution of Cluster Compute Orchestration: NAP |

Surface separately. Don't auto-bucket.

---

## Bucket F — Canonical Microsoft / Azure (KEEP under all filters = 23)

Microsoft Learn, Azure GitHub (Azure/AKS, Azure/karpenter-provider-azure, MicrosoftDocs/azure-aks-docs, Azure/aks-flex), AKS Engineering Blog, learn.microsoft.com/pt-br.

| ID | Title |
|----|-------|
| `1d25d7a1` | AKS Engineering Blog |
| `e6393df3` | Configure AKSNodeClass Resources for NAP (learn.microsoft.com) |
| `d4dde7da` | Configure Disruption Policies for NAP |
| `0847f238` | Configure Node Pools for NAP |
| `56d40359` | Configure availability zones in AKS (docs.azure.cn — only mirror present) |
| `7bf6b4e8` | Create AKS Cluster with NAP in Custom VNet |
| `4406355a` | Enable or Disable NAP |
| `8b95ab26` | Node Image Updates for NAP |
| `99a12e54` | Overview of AKS Automatic Managed System Node Pools |
| `3c7329d7` | Overview of NAP |
| `20f212e8` | Overview of networking configurations for NAP |
| `b90bf45d` | Security bulletins for AKS |
| `97e6f507` | Troubleshoot Node Auto-Provisioning Managed Add-on |
| `f64268c2` | Visão geral do NAP (pt-BR mirror) |
| `63d94ede` | Zone resiliency recommendations for AKS |
| `d781aa63` | Upgrade Options for AKS (docs.azure.cn — only mirror present) |
| `990484c4` | Microsoft.ContainerService/managedClusters ARM/Bicep ref |
| `4cbc89eb` | Announcing AKS Automatic managed system node pools (AKS Eng Blog) |
| `5b1ea73f` | Navigating Capacity Challenges with NAP (AKS Eng Blog) |
| `b39cea6b` | Releases · Azure/AKS — GitHub |
| `7363dd46` | aks-flex/docs/usages/karpenter.md (Azure/aks-flex) |
| `574b58cf` | MicrosoftDocs/azure-aks-docs migrate-from-autoscaler MD |
| `02263472` | MicrosoftDocs/azure-aks-docs node-auto-provisioning-aksnodeclass MD |
| `94b36973` | node-auto-provisioning-node-pools.md (MicrosoftDocs/azure-aks-docs) |
| `96909b70` | Karpenter: Spot with AKS 80% off (techcommunity.microsoft.com) |
| `94800d0a` | Azure/karpenter-provider-azure repo |

---

## Bucket G — Canonical Karpenter / Workshop (KEEP under all filters = 6)

karpenter.sh and the Microsoft-authored Karpenter-on-AKS workshop.

| ID | Title |
|----|-------|
| `08feae90` | Documentation | Karpenter (karpenter.sh) |
| `e77a5666` | Migrating from CA (karpenter.sh) |
| `23b61ce1` | Cost Optimization Workshop (fdtmsft.github.io/karpenter-azure-workshop) |
| `757e5430` | Module 1 - Nodepool Basics (workshop) |
| `51f46a8d` | Module 4 - Spot with Karpenter (workshop) |
| `7fdc03b4` | Setup AKS and NAP (workshop) |

---

## Bucket H — Azure GitHub Issues (Bug Tracking) (KEEP if user keeps issues = 9)

Real bug threads on Azure/karpenter-provider-azure and Azure/AKS. Canonical for "what's broken right now" but optional if user wants pure docs.

| ID | Issue |
|----|-------|
| `76407035` | karpenter-provider-azure #371 (cluster restart) |
| `22e10f65` | karpenter-provider-azure #649 (VM doesn't attach) |
| `9bc8f629` | karpenter-provider-azure #1280 (SKU debug impossible) |
| `28e9b0bc` | karpenter-provider-azure #1260 (no parallel image pull) |
| `c4193b86` | karpenter-provider-azure #1211 (abandoned nodes) |
| `dc767fe6` | Azure/AKS #5569 (NAP backend pool error) |
| `ba25db02` | Azure/AKS #5586 (can't enable NAP on private cluster) |
| `362019d0` | Azure/AKS #5345 (diskEncryptionSetID failure) |
| `f5510629` | Azure/AKS #5396 (NAP static capacity feature request) |

---

## Bucket I — Third-Party Practitioner Posts (KEEP unless "canonical-only" = 15)

Real blog posts about NAP/Karpenter-on-AKS. Quality varies; mostly DEV.to, stormforge, and one-off engineering blogs.

| ID | Title |
|----|-------|
| `331139a3` | AKS Automatic (Windows Forum) |
| `8079e54e` | AKS Karpenter Tutorial (stormforge.io) |
| `d23e24fa` | AKS NAP: What is it? (Florin Loghiade) |
| `3f898425` | AKS Scaling Deep Dive (blog.srinman.com) |
| `4d8c1ffe` | Cost-Optimized Node Mgmt: Karpenter on AKS (azurebeast) |
| `89bdfae4` | How to Configure AKS NAP (OneUptime) |
| `dfbb04d7` | Is AKS Automatic Enterprise Ready? (engineeringclouds.io) |
| `4339b406` | AKS Karpenter and NAP (DEV.to) |
| `e6bd3b2e` | MattOffPrem - crafting-with-karpenter (Notes about Azure) |
| `1602167a` | Stormforge And Karpenter For AKS (DEV.to) |
| `8cb37389` | Understanding AKS NAP (DEV.to) |
| `f40bcbdf` | What is AKS Automatic? (intercept.cloud) |
| `b8af95d2` | Azure verified module managedcluster (Terraform Registry) |
| `767942e0` | azurerm_kubernetes_cluster (Terraform Registry) |

---

## Roll-up

- **Bucket A** (duplicates): 1 drop
- **Bucket B** (off-topic): 9 drops
- **Bucket C** (cross-cloud refs): 6–8 *optional* drops (user choice)
- **Bucket D** (Q&A/Reddit): 7 *optional* drops (only if "canonical-only")
- **Bucket E** (synthesized MD): 2 *user decides*
- **Bucket F+G+H** (canonical MS/Karpenter/Issues): 38 always kept
- **Bucket I** (practitioner): 14 kept unless "canonical-only" = drop all 14

Worst-case kill list under "canonical-only" full apply: 1 + 9 + 8 + 7 + 14 = **39 deletes** → 42 sources remain.
Conservative apply (A+B only): **10 deletes** → 71 sources remain.
