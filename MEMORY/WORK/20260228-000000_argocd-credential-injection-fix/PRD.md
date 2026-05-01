---
task: "Debug and fix ArgoCD v3.3.2 credential injection failure (302 redirect for 95 apps)"
slug: "20260228-000000_argocd-credential-injection-fix"
effort: Advanced
phase: observe
progress: 0/24
mode: ALGORITHM
started: "2026-02-28T00:00:00Z"
updated: "2026-02-28T00:00:00Z"
---

## Context

Continuing from previous session where ArgoCD hub was restored after all Deployments were deleted and vanilla v3.3.2 manifests were applied. ConfigMaps, SAML cert, OIDC credentials, and Azure DevOps PAT were all fixed. However 95+ apps remain in Unknown state due to ArgoCD v3.3.2 NOT injecting credentials from `kubernetes-config-repo` secret when making git requests.

**Root symptom:** Repo-server logs show 302 redirect for `kubernetes-configuration` repo requests. The request is made as `https://hypera@dev.azure.com/...` WITHOUT HTTP Basic Auth credentials. Git ls-remote FROM INSIDE the pod with PAT embedded in URL SUCCEEDS.

**Context:**
- KUBECONFIG: `~/.kube/aks-rg-hypera-cafehyna-hub-config`
- ArgoCD namespace: `argocd`
- Cluster: cafehyna-hub, AKS, k8s v1.32.0
- ArgoCD v3.3.2 (jumped from v2.7.3 via vanilla manifests)
- New PAT: `***REDACTED-AZURE-PAT***`
- PAT scoped to `hypera` org only (401 for `hyperadevops` org)

**Known repo secrets:**
- `kubernetes-config-repo` — url=`https://hypera@dev.azure.com/hypera/Cafehyna%20-%20Desenvolvimento%20Web/_git/kubernetes-configuration`, user=hyperadevops, type=repository
- `helm-values-repo`, `infra-team-repo` — similar structure
- `hyperadevops-argocd-repo` — url=`https://hyperadevops@dev.azure.com/hyperadevops/devops-team/_git/argocd`, user=hyperadevops (PAT 401 here)
- `creds-2183761534`, `creds-2192142047` — type=repo-creds (credential templates)

### Risks

- URL normalization mismatch: ArgoCD v3.3.2 may strip `hypera@` from URL before matching secrets
- `project: default` field in secret may cause project-scoped matching failure
- repo-creds templates may conflict with per-repo secrets
- ArgoCD v3.3.2 changed credential matching algorithm (major version jump from v2.7.3)
- PAT scope issue: 6 apps using `hyperadevops` org will remain broken regardless

## Criteria

- [ ] ISC-1: Repo-server logs no longer show 302 for kubernetes-configuration repo
- [ ] ISC-2: Repo-server correctly injects Basic Auth credentials into git requests
- [ ] ISC-3: Root cause of credential matching failure identified and documented
- [ ] ISC-4: kubernetes-config-repo secret URL decoded and verified correct format
- [ ] ISC-5: Secret labels match ArgoCD v3.3.2 expected format
- [ ] ISC-6: ArgoCD v3.3.2 credential matching algorithm understood
- [ ] ISC-7: URL encoding issue (hypera@ prefix, %20) investigated and resolved
- [ ] ISC-8: repo-creds templates conflict checked and resolved if needed
- [ ] ISC-9: project field in secret verified not causing mismatch
- [ ] ISC-10: repo-server pod reloaded secrets after PAT patch confirmed
- [ ] ISC-11: argocd-cm has correct url field (https://argocd.cafehyna.com.br)
- [ ] ISC-12: kubernetes-configuration apps forced refresh after fix
- [ ] ISC-13: App count transitions from Unknown to Synced/OutOfSync post-fix
- [ ] ISC-14: helm-values-repo credential injection tested and verified
- [ ] ISC-15: infra-team-repo credential injection tested and verified
- [ ] ISC-16: hyperadevops-argocd-repo identified as PAT-scope-limited (different issue)
- [ ] ISC-17: User informed PAT needs "All accessible organizations" scope for hyperadevops
- [ ] ISC-18: 31 currently Synced apps remain Synced after fix
- [ ] ISC-19: Duplicate service cleanup (argo-cd-* vs argocd-*) assessed
- [ ] ISC-20: No regressions in SAML/OIDC/RBAC configuration
- [ ] ISC-21: Fix applied to cluster (not just diagnosed)
- [ ] ISC-22: ArgoCD app controller triggered to reconcile after fix
- [ ] ISC-23: Verification shows app count improving (< 95 Unknown)
- [ ] ISC-24: Post-fix state documented with evidence

## Decisions

### Root Cause Analysis — 2026-02-28

**The credential injection failure has TWO root causes:**

#### Root Cause 1: `useAzureWorkloadIdentity: true` field conflict

The base secret definitions (e.g., `03-kubernetes-config-repo.yaml`) contain:
```yaml
stringData:
  type: git
  url: https://hypera@dev.azure.com/hypera/Cafehyna%20-%20Desenvolvimento%20Web/_git/kubernetes-configuration
  useAzureWorkloadIdentity: true
  project: default
```

When we patched the secret with `username` and `password` in the previous session, the `useAzureWorkloadIdentity: true` field is STILL present in the secret (because kubectl patch --type merge only adds/updates fields, it doesn't remove them). ArgoCD v3.3.2 sees `useAzureWorkloadIdentity: true` and tries to use Azure Workload Identity instead of the PAT username/password — and since Workload Identity is NOT properly set up (no federated credential, no managed identity configured for Azure DevOps access), the authentication FAILS with a 302 redirect.

#### Root Cause 2: Azure Workload Identity NOT configured

The design intent was to use Azure Workload Identity for repository authentication, but the `setup-workload-identity.sh` was never run. The managed identity `argocd-azure-devops-identity` likely doesn't exist, and no federated credential was created. The ArgoCD repo-server ServiceAccount doesn't have the required `azure.workload.identity/client-id` annotation.

**Evidence:**
- Base secret YAMLs all have `useAzureWorkloadIdentity: true` and NO username/password
- `workload-identity/argocd-repo-server-sa-patch.yaml` has placeholder value `7768f65f-6c75-4079-8c73-5b56ab3a6445` for client-id (from setup script substitution)
- The overlay (`overlays/hub/credentials/git-credentials-patch.yaml`) only patches `password: ${AZURE_DEVOPS_PAT}` without removing `useAzureWorkloadIdentity: true`

**Fix Strategy — Two Options:**

**Option A: Proper fix — Remove `useAzureWorkloadIdentity` field and use PAT**
Since Workload Identity isn't set up, patch the secrets to remove the `useAzureWorkloadIdentity` field and ensure username/password are the only auth mechanism. This is the fastest fix.

**Option B: Set up Workload Identity properly**
Run the setup script to create the Managed Identity, create federated credentials, annotate the ServiceAccount, and grant the MI access to Azure DevOps. This is the recommended production approach but requires more setup time.

**Decision: Option A first (immediate fix), Option B is follow-up work.**

### Azure Auth Session Expired

Azure CLI session expired (AADSTS50173 — grant revoked, possibly due to password change). TokensValidFrom changed to 2026-02-28T01:21:09Z. User must re-authenticate with:
```bash
az logout
az login --tenant "3f7a3df4-f85b-4ca8-98d0-08b1034e6567"
```

## Verification

### Auth blocker — 2026-02-28

Azure CLI and kubectl both blocked by AADSTS50173 (token revoked, likely password change). Cannot execute cluster operations. Fix scripts prepared at `/tmp/argocd-credential-fix/`. Pending user re-authentication.
