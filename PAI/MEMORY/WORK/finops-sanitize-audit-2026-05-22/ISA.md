---
task: "Read-only sanitization audit on finops repo"
slug: 20260522-224500_finops-sanitize-audit
effort: E3
effort_source: classifier
phase: complete
progress: 38/41
mode: interactive
started: 2026-05-22T22:45:00-03:00
updated: 2026-05-22T22:45:00-03:00
---

## Problem

The finops repo (Azure DevOps private, `dev.azure.com-hypera:v3/hyperadevops/devops-team/finops`) had a history-rewrite sanitization pass on 2026-05-08 (tags `pre-sanitize-2026-05-08`, `pre-sanitize-housekeeping-2026-05-08`, `pre-sanitize-worktree-2026-05-08`). Since then, 65 commits have landed across `main` and 6 active worktree/feature branches. Routine hygiene says: scan the current tree and the post-tag history surface for any sensitive identifier, secret, credential, or PII that may have slipped back in. Nothing is known to be broken — this is preventative.

The repo contains 6,886 tracked files spanning IaC (Terraform/AKS), Power BI semantic models and report YAMLs, BMAD planning artifacts, Playwright test recordings, evidence/docs folders, and a `_bmad-output/` directory tree. The blast radius for a leak is wide; the surface area for a routine sweep needs explicit enumeration.

## Vision

A short, structured findings report that Juliano can read in under five minutes and act on with confidence. Each finding has a file path, line number, evidence snippet, severity rating, and a recommendation (working-tree edit, history rewrite, or accept-as-known). When the audit returns clean, the report says so unambiguously — no hedging, no "should probably check X too." The euphoric surprise is the moment when "I'd been meaning to check this" becomes "I now know exactly what's in there."

## Out of Scope

- File edits, deletions, or moves during this audit. Read-only.
- History rewrite via git-filter-repo / BFG. The user explicitly declined.
- `git push --force` or any push to origin.
- Removal or modification of `.gitignore`, `.gitleaksignore`, or other protective guards.
- Re-scanning history prior to the `pre-sanitize-2026-05-08` tag — that surface has already been rewritten and tagged.
- Vulnerability scanning of dependencies (separate concern; not "sanitization").
- License compliance review.
- Adversarial penetration testing or red-team exercises.
- Verifying that GUIDs in CLAUDE.md are still accurate — they're listed there as intentional, allowed exposure.

## Constraints

- Audit must be runnable from `/Users/juliano.barbosa/Repos/azure/devops-team/Repos/finops` without modifying any tracked file.
- All findings must include file path and line number; severity and recommendation are mandatory fields.
- Must respect the existing `.gitleaksignore` allowlist — entries there are pre-declared not-secrets.
- Cannot push to remote, cannot create commits, cannot rewrite history.
- The Power BI GUIDs in `CLAUDE.md` (workspace `9d992de7-...`, app `d683b40d-...`, dataset `63397e26-...`) are pre-declared allowed in this repo — surface them as INFO, not as findings.
- Tenant GUID, Azure subscription GUID, and EA Enrollment ID are purged from history per the 2026-05-08 tag — finding any of those in the current tree is CRITICAL.
- Must run inside the time budget for E3 (≤10 minutes).

## Goal

Produce a structured, evidence-backed sanitization report covering the current working tree and the 65 commits since `pre-sanitize-2026-05-08`, classifying every suspect string by severity (CRITICAL/HIGH/MEDIUM/LOW/INFO) with file:line evidence and a recommendation (working-tree fix / history rewrite / accept-as-known / false-positive). The report is the only deliverable; no repo state changes.

## Criteria

### Cloud identifiers (Azure)
- [ ] ISC-1: No raw Azure tenant GUID present in the working tree outside `CLAUDE.md` allowed list. *(rg + UUID regex, exclude known-allowed)*
- [ ] ISC-2: No Azure subscription GUID present in tracked files. *(rg + UUID regex; cross-check against allowlist)*
- [ ] ISC-3: No EA Enrollment ID literal present. *(rg for numeric enrollment ID patterns)*
- [ ] ISC-4: No Azure service-principal client-secret values (`appSecret`, `clientSecret`, raw values). *(rg for keys + non-placeholder values)*
- [ ] ISC-5: No storage-account access keys (`AccountKey=...` patterns). *(rg `AccountKey=`)*
- [ ] ISC-6: No Azure connection strings with embedded secrets. *(rg `DefaultEndpointsProtocol=.*AccountKey=`)*
- [ ] ISC-7: No SAS tokens (`?sv=...&sig=...`). *(rg `sig=[A-Za-z0-9%]{20,}`)*

### Credentials / tokens (generic)
- [ ] ISC-8: gitleaks scan against current HEAD reports zero findings beyond `.gitleaksignore` allowlist. *(gitleaks detect --no-git)*
- [ ] ISC-9: gitleaks scan from `pre-sanitize-2026-05-08..HEAD` reports zero unallowed findings. *(gitleaks detect --log-opts=...)*
- [ ] ISC-10: No `BEGIN PRIVATE KEY` / `BEGIN RSA PRIVATE KEY` blocks tracked. *(rg `BEGIN [A-Z ]*PRIVATE KEY`)*
- [ ] ISC-11: No `.pem`, `.key`, `.pfx`, `.p12` files tracked. *(git ls-files | grep)*
- [ ] ISC-12: No `.env`, `.env.local`, `.env.production` files tracked. *(git ls-files | grep)*
- [ ] ISC-13: No GitHub Personal Access Tokens (`ghp_`, `github_pat_` prefix). *(rg)*
- [ ] ISC-14: No Azure DevOps PATs in plaintext (52-char base64-like in `pat:`/`token:` keys). *(rg + heuristic)*
- [ ] ISC-15: No raw JWT tokens in tracked files (`eyJ` with three dot segments). *(rg `eyJ[A-Za-z0-9_-]{10,}\.eyJ`)*
- [ ] ISC-16: No `Bearer ` literal followed by a long token. *(rg `Bearer [A-Za-z0-9_.-]{20,}`)*
- [ ] ISC-17: No `password\s*[:=]\s*["']?[^"' \n]{6,}` patterns with non-placeholder values. *(rg + manual review)*

### PII (Brazilian context)
- [ ] ISC-18: No CPF numbers (`\d{3}\.\d{3}\.\d{3}-\d{2}`) in tracked files. *(rg)*
- [ ] ISC-19: No CNPJ numbers (`\d{2}\.\d{3}\.\d{3}/\d{4}-\d{2}`) in tracked files. *(rg)*
- [ ] ISC-20: No personal email addresses outside `@hypera.com.br` and generic placeholders. *(rg email regex + filter)*
- [ ] ISC-21: No phone numbers in `+55` Brazilian format in tracked files. *(rg `\+55[\d\s\-()]{8,}`)*

### Billing / financial data
- [ ] ISC-22: No raw production cost totals (R$ or BRL/USD followed by 5+ digit values) outside `docs/` known-context. *(rg + manual classification)*
- [ ] ISC-23: No EA contract / commitment values in tracked files. *(rg "commitment", "EA enroll")*
- [ ] ISC-24: No marketplace billing detail rows with subscription-identifying values. *(rg)*

### Internal network / infra
- [ ] ISC-25: No internal Hypera private DNS hostnames (`*.hypera.local`, `*.internal.hypera.com.br`). *(rg)*
- [ ] ISC-26: No RFC1918 IP addresses tied to specific internal hosts (`10.\d+\.\d+\.\d+` with hostname annotation). *(rg + classify)*
- [ ] ISC-27: No VPN / firewall config snippets (config blocks naming `vpn`, `firewall`, with peer IDs). *(rg)*
- [ ] ISC-28: No internal vault URLs with addressable secret paths. *(rg `vault.*\/v1\/secret`)*

### Power BI / data
- [ ] ISC-29: Power BI workspace/app/dataset GUIDs appear ONLY in `CLAUDE.md` (allowed location), not elsewhere. *(rg exact GUID)*
- [ ] ISC-30: No additional Power BI tenant references beyond the documented set. *(rg)*

### Git structural integrity
- [ ] ISC-31: No file >1MB added since `pre-sanitize-2026-05-08` containing potentially sensitive data. *(git log --diff-filter=A + stat)*
- [ ] ISC-32: `.gitignore` still excludes `*.env`, `*.key`, `*.pem`, `*.pfx`. *(grep .gitignore)*
- [ ] ISC-33: `.gitleaksignore` does not allowlist any commit that touches actual secrets. *(spot check 5 random entries)*
- [ ] ISC-34: All worktree branches scanned, not just `main`. *(git for-each-ref over scan loop)*

### Output / process
- [ ] ISC-35: Findings written to `/Users/juliano.barbosa/.claude/PAI/MEMORY/WORK/finops-sanitize-audit-2026-05-22/findings.md` with severity column. *(Read)*
- [ ] ISC-36: Every finding has `file:line` evidence. *(grep `:` in findings table)*
- [ ] ISC-37: Every finding has a recommendation field with one of: `working-tree edit`, `history rewrite`, `accept-as-known`, `false-positive`. *(grep)*
- [ ] ISC-38: Summary block at top: counts per severity. *(Read)*

### Anti-criteria (regression prevention)
- [ ] ISC-39: Anti: No file edits in `/Users/juliano.barbosa/Repos/azure/devops-team/Repos/finops` during this audit. *(git status -s shows no working-tree changes attributable to this run)*
- [ ] ISC-40: Anti: No commits created in the finops repo during this audit. *(git log -1 hash unchanged from start to end)*
- [ ] ISC-41: Anti: No push to origin during this audit. *(git reflog show origin/main has no new entries)*

## Test Strategy

| isc | type | check | threshold | tool |
|-----|------|-------|-----------|------|
| ISC-1..7 | regex scan | rg patterns against working tree | zero matches outside allowlist | rg |
| ISC-8..9 | external tool | gitleaks detect | zero findings beyond .gitleaksignore | gitleaks |
| ISC-10..12 | file enumeration | git ls-files + grep extensions | zero matches | git, grep |
| ISC-13..17 | regex scan | rg with token patterns | zero non-placeholder matches | rg |
| ISC-18..21 | regex scan | rg PII patterns | zero matches | rg |
| ISC-22..24 | regex + manual | rg + classification | each match triaged | rg, eye |
| ISC-25..28 | regex scan | rg internal patterns | zero matches | rg |
| ISC-29..30 | regex scan | rg exact GUIDs + filter | only in CLAUDE.md | rg |
| ISC-31 | git scan | git log --diff-filter=A --stat | zero suspicious large adds | git |
| ISC-32 | file content | grep .gitignore | all 4 patterns present | grep |
| ISC-33 | sample review | head -20 + classify | no leaked secrets | rg, eye |
| ISC-34 | branch enumeration | git for-each-ref + per-branch rg | all scanned | git, rg |
| ISC-35..38 | output structure | Read findings.md | all fields present | Read |
| ISC-39 | working-tree state | git status -s | empty | git |
| ISC-40 | commit count | git rev-parse HEAD before/after | unchanged | git |
| ISC-41 | reflog | git reflog show | no new origin entries | git |

## Features

| name | description | satisfies | depends_on | parallelizable |
|------|-------------|-----------|------------|----------------|
| cloud-id-scan | Scan tree for Azure tenant/subscription/EA/SP/storage/SAS identifiers | ISC-1..7 | — | yes |
| gitleaks-pass | Run gitleaks on working tree and post-tag history | ISC-8..9 | — | yes |
| key-file-scan | Find tracked key/cert/env files by extension | ISC-10..12 | — | yes |
| token-scan | Regex for generic tokens (JWT, Bearer, GH PAT, ADO PAT, passwords) | ISC-13..17 | — | yes |
| pii-scan | Brazilian PII patterns (CPF, CNPJ, emails, phone) | ISC-18..21 | — | yes |
| billing-scan | Cost/contract/marketplace data heuristics | ISC-22..24 | — | yes |
| network-scan | Internal hostnames / private IPs / VPN configs / vault URLs | ISC-25..28 | — | yes |
| powerbi-scope | Confirm Power BI GUIDs appear only in CLAUDE.md | ISC-29..30 | — | yes |
| git-structural | Large-file adds, .gitignore coverage, .gitleaksignore spot check | ISC-31..33 | — | yes |
| branch-coverage | Enumerate and scan all branches/worktrees | ISC-34 | cloud-id-scan, token-scan | no (uses prior probes) |
| report-emit | Write structured findings.md with severity + recommendation | ISC-35..38 | all scans complete | no |
| audit-readonly-invariants | Verify no edits/commits/pushes occurred | ISC-39..41 | report-emit | no |
