---
type: knowledge
topic: Azure DevOps PAT Lifecycle Management API
discovered: 2026-05-28
source: https://learn.microsoft.com/rest/api/azure/devops/tokens/pats
---

# ADO PAT Lifecycle Management API

Azure DevOps ships a programmatic PAT create/update/revoke API. Eliminates the browser UI flow for every PAT rotation. This is NOT widely known — easy to miss when triaging "bump the PAT" tasks.

## Endpoint

`https://vssps.dev.azure.com/{org}/_apis/tokens/pats?api-version=7.1-preview.1`

Verbs: GET (list), POST (create), PATCH (update — supports `regenerate=true` for new secret), DELETE (revoke by `authorizationId` query param).

## Auth

**Bearer Microsoft Entra token** — NOT a PAT (would be a chicken-and-egg bootstrap). Mint via:

```bash
az account get-access-token --resource 499b84ac-1321-427f-aa17-267ca6975798 --query accessToken -o tsv
```

The resource ID `499b84ac-1321-427f-aa17-267ca6975798` is the constant Azure DevOps Services REST API client ID. TTL ~60min.

## Constraints

- Only user-on-behalf-of flow works. Service principals + managed identities CANNOT mint PATs through this API.
- Recommended Entra delegated scope: `vso.pats` (newer) over the older `user_impersonation`.
- Org-admin policy "Restrict PAT creation" applies — if a user is restricted in the UI, the API refuses them too with 403.

## Scope string mapping (vso.* — canonical)

| UI label | API scope string |
|---|---|
| Build (Read, write, & execute) | `vso.build_execute` |
| Code (Read) | `vso.code` |
| Variable Groups (Read) | `vso.variablegroups_read` |
| Service Connections (Read & manage) | `vso.serviceendpoint_manage` |
| Project and Team (Read) | `vso.project` |
| Agent Pools (Read & manage) | `vso.agentpools_manage` |
| Release (Read, write, execute, & manage) | `vso.release_manage` |

Multiple scopes are SPACE-separated in the `scope` body field, NOT comma.

## Response shape (POST)

```json
{
  "patToken": {
    "displayName": "...",
    "validFrom": "2026-05-28T...",
    "validTo": "2026-08-26T...",
    "scope": "vso.code vso.build_execute ...",
    "targetAccounts": [...],
    "authorizationId": "uuid",
    "token": "ACTUAL-PAT-SECRET-shown-once"
  }
}
```

`.patToken.token` is shown ONCE. Capture immediately or revoke and re-create.

## Operator pattern (Hypera context)

Hypera's `scripts/operator-preflight.sh` already mints the AAD token for `dev.azure.com` git operations. The same token can drive PAT Lifecycle API calls — no separate auth flow needed. See `rg-hypera-packer-image` Task #721 (2026-05-28) for the canonical az-CLI procedure.

## Prior-art trap

Default assumption ("PATs are UI-only") is wrong. Always check this API before recommending a browser flow. See Microsoft Learn → "Use personal access tokens" → "PAT Lifecycle Management APIs" section, and the dedicated REST reference at the URL above.
