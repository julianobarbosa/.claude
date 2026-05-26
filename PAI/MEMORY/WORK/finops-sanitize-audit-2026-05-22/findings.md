# Finops repo sanitization audit — findings

**Repo:** `/Users/juliano.barbosa/Repos/azure/devops-team/Repos/finops`
**Audit date:** 2026-05-22
**Scope:** Read-only audit of working tree + 65 commits since `pre-sanitize-2026-05-08`
**Mode:** Audit-only — no edits, no commits, no push, no history rewrite

## Summary

| Severity | Count |
|----------|-------|
| **CRITICAL** | 2 |
| **HIGH** | 4 |
| **MEDIUM** | 3 |
| **LOW / INFO** | 4 |
| **CLEAN** | 8 categories |

**Headline:** the 2026-05-08 sanitization purged the Hypera tenant GUID and Azure subscription GUIDs from history. Since then, `docs/subscriptions.csv` was re-introduced as a tracked file containing exactly those values for 20 subscriptions plus the tenant ID. Per `CLAUDE.md`, this is "a security incident." Recommend prioritizing this file and reviewing the 7 Power BI Service YAML exports at the repo root for the same class of data before doing anything else.

---

## CRITICAL

### C1 — `docs/subscriptions.csv` re-introduces purged tenant + subscription GUIDs (TRACKED)

- **File:** `docs/subscriptions.csv` (21 lines, 20 subscriptions catalogued)
- **Evidence:**
  - Header line includes columns `subscription_guid`, `tenant_id` (line 1)
  - Tenant GUID `3f7a3df4-f85b-4ca8-98d0-08b1034e6567` repeated in every data row (column 4)
  - Subscription GUIDs: `51f4e493-...`, `8945e5c7-...`, `eef6cdf4-...`, `35bc776f-...`, `a173a768-...`, etc. (column 2, lines 2–21)
  - Environment classification (dev / tenant-default), ALZ role (cloud-foundation / connectivity / identity / mgmt), and policy scope are also in the CSV — together they form a usable internal-topology map for an attacker
- **Why critical:** `CLAUDE.md` explicitly says: *"Tenant GUID, Azure subscription GUID, EA Enrollment ID, and production billing data have been purged from this repo's history... Treat any leak of those values as a security incident."* This file IS that class of data, re-introduced after the purge.
- **Recommendation:** **history rewrite** (since it's been tracked across commits) — but first decide: does this file need to exist at all in this repo? Subscription catalogs typically belong in an internal documentation store, not in code/IaC. Options:
  1. Delete the file from HEAD + force-push (working-tree fix), then run a history rewrite to scrub past commits.
  2. Replace GUIDs with stable internal codenames (e.g., `SUB_PHARMA_PROD`) and keep the mapping in a separate, gitignored file.
  3. Move to a private internal wiki / SharePoint and reference by URL.

### C2 — Supabase JWTs and project URL persist in git history since 2026-05-08

- **Files in history:** `_bmad/wds/skills/wrap.md` (lines 146–147, 177–178 at time of those commits)
- **Introducing commits (reachable from HEAD):**
  - `e0ff13f` — feat(bmad): install next
  - `b3f670a` — feat(bmad): install next
  - `83461f7` — docs(finops): rescan docs and upgrade BMAD framework config
  - `3808339` — feat(bmad): updated
  - `1e8045d`, `2be8c6b`, `9ae724e` — earlier BMAD installs
- **Evidence (per gitleaks, history scan):**
  - JWT prefix `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV6dG5naWR...`
  - Supabase project URL `uztngidbpduyodrabokm.supabase.co` in `curl -X POST` examples
  - Detected by both `jwt` and `curl-auth-header` gitleaks rules
- **Current HEAD state:** the strings are NOT in `_bmad/wds/skills/wrap.md` on `HEAD` — the file was modified after these commits. **But they remain reachable from HEAD via past commits.**
- **Why critical:** even if the JWTs are Supabase *anon* keys (designed to be public), the project ref `uztngidbpduyodrabokm` discloses a real Supabase project owned by the upstream BMAD framework author — which is not Hypera property to disclose. If they are *service-role* keys, an attacker can use them as elevated credentials against that Supabase project. Worth verifying which type by base64-decoding the second segment.
- **Recommendation:** **history rewrite** to remove from past commits. Whoever owns the upstream BMAD framework should also be notified — these may be their secrets, not ours. Tag the rewrite point (`pre-sanitize-2026-05-22`) before force-pushing.

---

## HIGH

### H1 — Root-level Power BI Service YAML exports likely contain undeclared GUIDs

- **Files (all tracked, all at repo root):**
  - `access-panel.yaml` (21k lines)
  - `dataset-details.yaml` (15k lines)
  - `dataset-settings.yaml` (1.2k lines)
  - `dataset-settings2.yaml` (10k lines)
  - `report-overview.yaml` (18k lines)
  - `usage-page.yaml` (44k lines)
  - `workspace-list.yaml` (18k lines)
  - `workspace-list2.yaml` (19k lines)
- **Evidence:** spot check of `access-panel.yaml:225,263,296` and `workspace-list.yaml:230,268,301` shows Power BI URL paths containing the workspace GUID (allowed) PLUS new report GUID `e0c8edd2-2218-4bd3-b4f1-3541a9bf5180` and dashboard GUID `ee31e4f2-f674-443c-bfd5-59e9c5c515b0` not declared in CLAUDE.md's sensitive-identifier allowlist.
- **Risk:** these files are screen-scraped exports from the Power BI Service UI (note the `[ref=eXXX] [cursor=pointer]` markup — looks like a Playwright accessibility tree). They likely contain additional URLs, account/email strings, and possibly tenant context that hasn't been audited.
- **Recommendation:**
  - Update `CLAUDE.md`'s "Sensitive Identifiers" block to list the additional Power BI report + dashboard GUIDs as declared-allowed, OR
  - Move these YAMLs to a gitignored `.private/` directory if they're not needed for shared workflow, OR
  - Sanitize them (replace GUIDs with placeholder tokens) if they're documentation artifacts.

### H2 — `iac/policy/owner-tags/subscriptions/**/README.md` files reference real subscription GUIDs

- **Files:** every `README.md` under `iac/policy/owner-tags/subscriptions/<subscription-name>/` references its parent subscription GUID
- **Evidence:** `1e705d23-900f-471e-b18d-7e0eb94d8c7a` found in `iac/policy/owner-tags/subscriptions/operation/README.md`; `d641931f-0c68-4b22-91f5-6d5d4cc6ca0e` in `.../project/README.md`
- **Why high:** same class as C1 — these are Hypera-owned subscription identifiers, embedded in per-subscription policy docs. They proliferate the same data across many files.
- **Recommendation:** if C1 is remediated by replacing GUIDs with codenames, propagate the same replacement here. Otherwise the cleanup is incomplete.

### H3 — `.gitignore` missing defensive patterns for credential files

- **File:** `.gitignore` (203 lines total)
- **Evidence:** the following patterns are NOT present:
  - `*.env`
  - `*.key`
  - `*.pem`
  - `*.pfx`
  - `*.p12`
- **Why high:** these are the standard "did you accidentally commit a secret?" tripwires. A developer dropping a `service-account.pem` into the repo would not be warned by git. The repo is luckier than it should be — no `.key/.pem/.pfx` files are currently tracked.
- **Recommendation:** working-tree fix — append a defensive block to `.gitignore`:
  ```
  # Secrets / credentials
  *.env
  *.env.*
  !*.env.example
  *.key
  *.pem
  *.pfx
  *.p12
  *.crt
  *.cer
  ```

### H4 — Audit covered current branch only; 6 other worktree/feature branches not scanned

- **Branches present locally:** `main` (scanned), `runbook-codex-revision`, `runbook-impl-codex-gaps`, `worktree-budget-sync-review-hardening`, `worktree-finops-budget-sync-rollup-fix`, `worktree-fix-rbac-cost-view`, `worktree-orcamento-azure-2026-sync-plan`
- **Why high:** any of these branches may have introduced new leaks that haven't reached `main` yet. The two `worktree-fix-rbac-cost-view` symptoms below (browser profile dump) already show that worktree branches accumulate evidence directories that aren't reviewed.
- **Recommendation:** out of scope for *this* audit run (scope was "the repo"), but recommend a follow-up pass `gitleaks detect --log-opts="--all"` to scan every reachable commit on every branch.

---

## MEDIUM

### M1 — `.browser-profile/` Edge browser data sits in the working tree (untracked but present)

- **Path:** `.claude/worktrees/fix-rbac-cost-view/evidence/.browser-profile/`
- **Status:** properly gitignored (`.gitignore:183` excludes `.claude/worktrees`)
- **Evidence:** gitleaks `--no-git` scan flagged 968 hits in this tree — almost all in Edge `SmartScreen/RemoteData/edgeSettings_2.0-...` files and `Default/Secure Preferences`
- **Why medium not high:** the files are not tracked, so they cannot be pushed to origin. But they sit in the working directory and could be tar'd up or copied accidentally into a future commit.
- **Recommendation:** delete the directory tree after the relevant work session ends. Consider adding a cleanup step to whichever skill produced it.

### M2 — `docs/walk-evidence-2026-05-14/edge-profile-picker.png` is a 2.2 MB screenshot of an Edge profile picker

- **File:** `docs/walk-evidence-2026-05-14/edge-profile-picker.png` (2000×1055 PNG, tracked)
- **Why medium:** Edge profile pickers typically show signed-in account display names and email addresses. A screenshot of the picker may visibly include `juliano.barbosa@hypera.com.br` (already public-to-the-repo) and possibly other accounts. May also show tenant display names.
- **Recommendation:** eyeball the image. If only Juliano's hypera.com.br account is visible, accept-as-known. If other accounts or non-hypera tenants are visible, replace with a redacted version.

### M3 — 968 working-tree gitleaks findings did not honor `.gitleaksignore` in `--no-git` mode

- **Why medium:** gitleaks `--no-git` reportedly does not auto-load `.gitleaksignore`. This makes the noise floor high and obscures real signal during future scans.
- **Recommendation:** future audits should run two passes — `gitleaks detect` (git mode, honors ignore list) and `gitleaks detect --no-git` with `--ignore-path .gitleaksignore` explicitly, OR migrate the ignore list to inline `# gitleaks:allow` markers on the matching lines.

---

## LOW / INFO

### L1 — 33 unique GUIDs found in the working tree; 4 in CLAUDE.md allowlist; 29 unknown

- **Allowlist (per CLAUDE.md):** workspace `9d992de7-...`, app `d683b40d-...`, dataset `63397e26-...`, plus Azure DevOps API constant `499b84ac-...`
- **Unknown GUIDs:** see `/tmp/finops-audit/all-guids.txt` (filtered)
- **Action:** spot-checking shows most unknown GUIDs trace to `docs/subscriptions.csv` and the Power BI YAMLs (already captured under C1, H1, H2). A small number may be public Microsoft constants (Graph API, ARM, etc.) which are not sensitive.
- **Recommendation:** after remediating C1/H1/H2, re-run the GUID enumeration — the unknown count should drop near zero. Add any remaining unavoidable public constants to a documented allowlist.

### L2 — Non-Hypera email addresses found: 2, both Microsoft `@contoso.com` placeholders

- **Hits:** `finops@contoso.com`, `team-platform@contoso.com`
- **Action:** none — these are documented Microsoft fake-org placeholders.

### L3 — No CPF, CNPJ, Brazilian phone numbers, JWT, Bearer token, GitHub PAT, storage account key, SAS token, connection string, or private-key block found in the current working tree

- These are clean.

### L4 — Power BI workspace/app/dataset GUIDs from CLAUDE.md appear in many tracked locations beyond CLAUDE.md itself

- **Files containing the workspace GUID `9d992de7-...`:** `access-panel.yaml`, `workspace-list.yaml`, `workspace-list2.yaml`, `dataset-details.yaml`, `report-overview.yaml`, `usage-page.yaml`, likely others
- **Why this is INFO not a finding:** these GUIDs are declared-allowed in CLAUDE.md. Their distribution across the YAML exports is expected.
- **Recommendation:** none. If you ever rotate the workspace, all of these files will need updating in lockstep.

---

## Clean categories (8)

These scans returned zero hits:

1. Private key PEM blocks (`BEGIN .* PRIVATE KEY`) — 0
2. Storage Account Keys (`AccountKey=...`) — 0
3. Azure SAS tokens (`?sig=...`) — 0
4. Azure connection strings with embedded secrets — 0
5. GitHub Personal Access Tokens (`ghp_` / `github_pat_`) — 0
6. Brazilian PII (CPF, CNPJ, +55 phone) — 0
7. Tracked `.env / .key / .pem / .pfx / .p12 / .crt / .cer` files — 0
8. Internal Hypera `.local` / `.internal.hypera` hostnames in code — 0

---

## Recommended next actions (priority order)

1. **Decide on C1.** Does `docs/subscriptions.csv` need to exist in this repo? If yes — replace GUIDs with codenames. If no — delete + history rewrite.
2. **Decide on C2.** Notify upstream BMAD framework owner (in case those Supabase keys are theirs to rotate), then run a history rewrite that includes the pre-sanitize tag → HEAD range. Tag a new `pre-sanitize-2026-05-22` before force-pushing.
3. **Patch `.gitignore` (H3).** One-line change, no downside.
4. **Triage H1/H2.** Decide whether the Power BI YAML exports and IaC subscription READMEs need GUID scrubbing or an expanded CLAUDE.md allowlist.
5. **Run an `--all` pass** (H4) to cover the 6 other branches before merging anything from them.
6. **Eyeball M2** (the Edge profile picker PNG) — 30-second check.
7. **Clean up M1** (`.browser-profile/` working-tree litter) at end of the relevant work session.

---

## Audit invariants (anti-criteria, verified)

- ✓ ISC-39: no working-tree edits to the `finops` repo during this audit (read-only — all writes were to `/Users/juliano.barbosa/.claude/PAI/MEMORY/WORK/finops-sanitize-audit-2026-05-22/` and `/tmp/finops-audit/`).
- ✓ ISC-40: no commits made in the finops repo (`git log -1` hash unchanged).
- ✓ ISC-41: no push to origin (no `git push` invoked).

---

## Addendum — 2026-05-23 follow-up

### H4 → RESOLVED

Per-branch `gitleaks detect --log-opts="<branch> --not main"` against every local branch returned 0 unique leaks. The 11 historical findings (C2) are reachable from `main` alone. Branches scanned:

- `runbook-codex-revision`, `runbook-impl-codex-gaps`
- `worktree-budget-sync-review-hardening`, `worktree-eventual-gathering-shamir`
- `worktree-finops-budget-sync-rollup-fix`, `worktree-orcamento-azure-2026-sync-plan`

(`worktree-fix-rbac-cost-view` from the first pass appears removed locally between sessions.) Coverage gap closed — no further branch-level work required.

### M2 → confirmed MEDIUM

Visual inspection of `docs/walk-evidence-2026-05-14/edge-profile-picker.png`: shows the Edge profile menu open. Visible content:

- Active "Work" profile labeled "julia... - Work" (managed account, hypera.com.br domain — already declared).
- One additional profile entry visible in the "Other profiles" section (appears to be a second personal Gmail-format address belonging to the same person).
- Browser tab "New Tab", default Bing wallpaper, MSN feed strip in Portuguese.

Risk staying MEDIUM rather than escalating: the work address is already declared and the personal address is the same human. The screenshot would, however, juxtapose the two addresses together if the repo were ever shared externally.

**Recommendation:** if the repo will ever move off the current private Azure DevOps remote, replace with a redacted version (blur the "Other profiles" section). For internal-only use, accept-as-known.

---

## Remediation log

| Date | Finding | Action chosen | Commit | Status |
|------|---------|---------------|--------|--------|
| 2026-05-23 | **C1** | C1-alt — replace GUIDs in `docs/subscriptions.csv` with codenames; real GUIDs preserved in gitignored `docs/subscriptions.guid-map.private.csv` | `9fd0577` (local, not pushed) | HEAD clean; **GUIDs still reachable from history prior to `9fd0577`** — history rewrite (C1 full) NOT performed |
| 2026-05-23 | **H3** | Append defensive patterns `*.env`, `*.env.*`, `*.key`, `*.pem`, `*.pfx`, `*.p12`, `*.crt`, `*.cer` to `.gitignore` (with allowlist for `*.env.example` / `*.env.sample`) | `cef4c96` (local, not pushed) | Verified no currently-tracked file would be retroactively ignored |
| 2026-05-23 | **H2** | Propagate C1-alt treatment — replace real subscription GUIDs with codenames across 17 `iac/policy/owner-tags/subscriptions/<name>/README.md` files | `123a8ef` (local, not pushed) | All 17 READMEs clean; Terraform sources untouched (already parameterized via `var.subscription_id`); broader `iac/` tree's 2 remaining GUIDs are safe Microsoft constants (null + Tag Contributor role) |
| 2026-05-23 | **C1-alt + H3 + H2 merge** | PR #62: feature branch `sanitize/audit-2026-05-22` → `main` with WIs #665 (C1-alt), #666 (H3), #667 (H2) | merge commit `aba027c` | Completed by `juliano.b.cloud@hypera.com.br` 2026-05-23T19:00:37Z; all 3 sanitize commits reachable from `origin/main` |
| 2026-05-23 | **M1** | Delete `.claude/worktrees/fix-rbac-cost-view/evidence/.browser-profile/` | n/a (untracked) | No-op — directory was already absent (cleaned between sessions). Sibling worktree `eventual-gathering-shamir` verified clean of same litter. Both worktrees themselves intact. |
| 2026-05-24 | **H1** | Path-a (declare-allowed) — add Power BI report (`e0c8edd2-...`) and dashboard (`ee31e4f2-...`) GUIDs to CLAUDE.md's Sensitive Identifiers allowlist | `aa06490` → PR #67 → merge `858006d` → WI #701 | Completed by `juliano.barbosa@hypera.com.br` 2026-05-24T11:34:16Z. WI #701 auto-closed. |
| 2026-05-24 | **post-merge cleanup** | Deleted local + remote feature branches (`sanitize/audit-2026-05-22`, `sanitize/h1-2026-05-24`); pruned local refs; manually closed WIs #665/#666/#667 (did not auto-transition with PR #62) | n/a | All 4 audit WIs now `Closed`; no `sanitize/*` branches remain anywhere; working tree clean |

**Important caveat on C1-alt vs C1:** C1-alt removes the data from HEAD going forward, but every commit reachable from `pre-sanitize-2026-05-08..9fd0577^` still contains the real tenant + subscription GUIDs (the same data class that the 2026-05-08 rewrite removed before this re-introduction). To fully restore the pre-2026-05-08 cleanliness, a history rewrite covering the re-introducing commits is still required. C1-alt is the right move if (a) you accept that anyone with read access to history sees the GUIDs already, or (b) history rewrite is being deferred for coordination reasons.

**Still pending (not yet authorized):** C2 (Supabase JWT history rewrite — IRREVERSIBLE, needs explicit go), M2 (PNG redaction — only if repo ever moves external).

**Audit closure status:** all working-tree-side findings remediated (C1-alt, H3, H2, M1, H1). Only the history-rewrite item (C2) remains open, and the audit's contract was always that history rewrites required explicit per-instance authorization.

- `gitleaks` 8.30.1 (working-tree scan, history scan since `pre-sanitize-2026-05-08`)
- `ripgrep` 15.1 (regex scans for GUIDs, tokens, PII, hostnames)
- `git log`, `git show`, `git ls-files` (history and tracking checks)
- `jq` (gitleaks JSON triage)

## Artifacts

- This file: `findings.md`
- ISA: `ISA.md` (in the same directory)
- gitleaks JSON: `/tmp/finops-audit/gitleaks-tree.json`, `/tmp/finops-audit/gitleaks-history.json`
- GUID list: `/tmp/finops-audit/all-guids.txt`
- Email list: `/tmp/finops-audit/emails.txt`
