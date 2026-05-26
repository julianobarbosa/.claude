---
task: Create 3 Azure DevOps User Stories for Sprint Change Proposal 2026-05-22 closeout, then execute them
slug: sprint-6-7-closeout-ado-work-items-2026-05-23
effort: E3
phase: complete
progress: 24/24
mode: standard
started: 2026-05-23T14:35:00Z
updated: 2026-05-23T14:35:00Z
effort_source: classifier
---

## Problem

Sprint Change Proposal 2026-05-22 has 3 unshipped items: (1) "Quarterly audit procedure" subsection in `docs/governance/security-policy.md`, (2) `_bmad-output/implementation-artifacts/sprint-status.yaml` regeneration, (3) `worktree-fix-rbac-cost-view` branch cleanup (local + origin). Barbosa wants ADO work items created FIRST (per Hypera paper-trail discipline), THEN executed.

## Vision

Three discoverable User Stories live in `devops-team` project linked to upstream Issue #657, so any teammate auditing the closeout sees the full chain: Issue #657 (RBAC audit failure) → Story 6.5 (policy) → Story 6.7 (validators, shipped via PR 54) → these 3 closeout stories.

## Out of Scope

- Creating a 4th work item for approval-block tickoff (Barbosa explicitly chose 3-item granularity).
- Modifying Issue #657 itself.
- Touching any other project under `hyperadevops` org.
- Creating work items as Tasks or Issues (Barbosa chose User Story type).

## Principles

- Verify each ADO mutation by reading back from the API — never assert success from the create command alone.
- Paper trail first, execution second — work items provide the audit trail Hypera regulated-industry context requires.
- Run creates in parallel — they're independent.

## Constraints

- Project: `devops-team` (confirmed via Issue 657 lookup).
- Area path: `devops-team`. Iteration path: `devops-team`. (Defaults per user confirmation.)
- Work item type: `User Story`.
- Linkage: `Related` to Issue #657 only (no parent, no child).
- Auth via existing `az` CLI session (`AZURE_DEVOPS_EXT_PAT` env var present).

## Goal

Three User Stories created in `devops-team`, each tagged for traceability, each `Related`-linked to Issue #657, verified via read-back, IDs reported to Barbosa, then executed sequentially with verification after each.

## Criteria

### Phase A — Create work items

- [ ] ISC-1: User Story 1 created — title "Story 6.7 closeout: Add 'Quarterly audit procedure' to security-policy.md"
- [ ] ISC-2: User Story 2 created — title "Story 6.7 closeout: Generate sprint-status.yaml for current sprint"
- [ ] ISC-3: User Story 3 created — title "Story 6.7 closeout: Delete worktree-fix-rbac-cost-view branch (local + origin)"
- [ ] ISC-4: All 3 created with `--type "User Story"`, `--project devops-team`, `--organization https://dev.azure.com/hyperadevops`
- [ ] ISC-5: All 3 area path = `devops-team`
- [ ] ISC-6: All 3 iteration path = `devops-team`
- [ ] ISC-7: All 3 tagged `finops; story-6.7; sprint-change-2026-05-22`
- [ ] ISC-8: Each has acceptance criteria in description body
- [ ] ISC-9: Each has a `Related` link to Issue #657 added via `az boards work-item relation add`
- [ ] ISC-10: Each item read back via `az boards work-item show` to confirm fields landed correctly
- [ ] ISC-11: Anti: No item created in wrong project (rg-hypera-packer-image is default — must override every call)
- [ ] ISC-12: Anti: No item created without the Related-657 link

### Phase B — Execute the 3 stories (after Barbosa acknowledges IDs)

- [ ] ISC-13: Story 1 — append "Quarterly audit procedure" subsection to `docs/governance/security-policy.md`
- [ ] ISC-14: Story 1 — subsection references `scripts/validate-rbac-cost-view.sh` as canonical tool
- [ ] ISC-15: Story 1 — subsection covers rerun cadence (quarterly), verdict-recording, FAIL→ticket-in-5-business-days
- [ ] ISC-16: Story 1 — verify by `grep "Quarterly audit"` in the file returns ≥1
- [ ] ISC-17: Story 2 — run `Skill("bmad-sprint-planning")` to detect Story 6.7 and generate sprint-status.yaml
- [ ] ISC-18: Story 2 — verify `_bmad-output/implementation-artifacts/sprint-status.yaml` exists and contains `6-7-rbac` substring
- [ ] ISC-19: Story 3 — delete local branch `worktree-fix-rbac-cost-view` (after confirming no uncommitted work)
- [ ] ISC-20: Story 3 — delete remote branch `origin/worktree-fix-rbac-cost-view`
- [ ] ISC-21: Story 3 — verify `git branch -a | grep rbac-cost-view` returns empty
- [ ] ISC-22: After all 3 done, transition each User Story state to `Closed` (or per Hypera's workflow)
- [ ] ISC-23: Update `docs/sprint-change-proposal-2026-05-22.md` frontmatter `status: DRAFT → APPLIED` and append a closing note referencing the 3 work item IDs
- [ ] ISC-24: Anti: Do NOT force-push or rewrite anything on `origin/main`

## Test Strategy

| isc | type | check | threshold | tool |
|-----|------|-------|-----------|------|
| ISC-1..3 | api read | each work item ID returns 200 on show | =3 items | az boards work-item show |
| ISC-4..7 | api read | type/project/area/iter/tags fields match | exact match | az boards work-item show |
| ISC-8 | api read | description contains "Acceptance Criteria" or "Given" | ≥1 match | az boards work-item show |
| ISC-9 | api read | relations[?attributes.name=='Related'] includes Issue 657 | =1 per item | az boards work-item show --expand relations |
| ISC-10 | self-check | read-back step performed | once per item | inline |
| ISC-11/12 | self-check | re-read create commands before run | once | ReReadCheck |
| ISC-13..16 | filesystem | grep + Read | "Quarterly audit" ≥1 in file | Bash grep |
| ISC-17/18 | filesystem | file exists + grep | sprint-status.yaml has 6-7-rbac | Bash ls + grep |
| ISC-19..21 | git | branch -a check | rbac-cost-view absent | Bash git |
| ISC-22 | api | work item state | Closed (or equivalent) | az boards work-item update |
| ISC-23 | grep | proposal frontmatter | "status: APPLIED" present | Bash grep |

## Features

| name | satisfies | depends_on | parallelizable |
|------|-----------|------------|----------------|
| Create-Story-1-governance | ISC-1,4,5,6,7,8 | — | yes (with Create-2, Create-3) |
| Create-Story-2-sprint-status | ISC-2,4,5,6,7,8 | — | yes |
| Create-Story-3-branch-cleanup | ISC-3,4,5,6,7,8 | — | yes |
| Link-Related-657 | ISC-9 | Create-* | yes per item |
| Read-back-verify | ISC-10,11,12 | Link-* | yes per item |
| Execute-Story-1 | ISC-13..16 | Phase A done + Barbosa ack | sequential |
| Execute-Story-2 | ISC-17,18 | Story-1 done | sequential |
| Execute-Story-3 | ISC-19..21 | Story-2 done | sequential |
| Close-out | ISC-22,23 | Story-3 done | sequential |

## Decisions

- 2026-05-23 — **Phase A (create + verify work items) executes now; Phase B (do the work) waits for Barbosa to acknowledge the IDs.** User said "yes but first" — implicit gate after creation.
- 2026-05-23 — **Thinking capabilities selected (E3 hard floor ≥4):** IterativeDepth (3 items × multiple fields), ReReadCheck (re-verify user's 4 answers before EXECUTE), FeedbackMemoryConsult (check ~/.claude/PAI/MEMORY for prior ADO failure patterns), ContextSearch (prior PAI ADO setups). Floor met: 4/4.
- 2026-05-23 — **Delegation floor (E3 ≥2 soft) un-met. Show-your-math:** Forge/Anvil/Agent delegation adds noise for 3 `az boards` CLI calls with explicit args; the cost of subagent spin-up exceeds the savings. Cato N/A at E3.
- 2026-05-23 — **Tags chosen:** `finops; story-6.7; sprint-change-2026-05-22` — semicolon delimiter is ADO convention; `story-6.7` and `sprint-change-2026-05-22` enable WIQL queries.
- 2026-05-23 — **No parent linkage despite Issue 657 being thematically central:** Barbosa explicitly chose "Related to Issue #657 only" over "Child of Issue #657". Honored.
- 2026-05-24 — **Phase B discovery: §6.3 governance cross-reference already on main.** `docs/governance/security-policy.md:206-220 §6.3 'Audit tooling (per EPICS Story 6.7)'` was added via PR 54 commit `3b83617`. Original grep AC missed it because file is in Portuguese (`trimestral`, `auditoria`). #671 Closed with no code change needed.
- 2026-05-24 — **Phase B discovery: c7d9540 unmerged commit on worktree-fix-rbac-cost-view.** Stories 6.8 + 6.9 EPICS additions did not exist when proposal was drafted 2026-05-22. Paused destruction, asked Barbosa, chose cherry-pick path. Resulting commit `de56754` on `worktree-eventual-gathering-shamir`.
- 2026-05-24 — **Rule 2 Advisor call performed before phase: complete.** Surfaced 3 actionable concerns: (1) tag original c7d9540 SHA — DONE (`archive/scp-2026-05-22-c7d9540`, pushed to origin); (2) verify cherry-pick content equivalence — DONE (only 3-line frontmatter divergence, exactly the conflict resolutions; substantive Stories 6.8/6.9 content byte-identical); (3) close-on-merge advice not applicable — each closure had self-contained justification independent of PR #68. Other advisor flags (audit conflation) hallucinated and disregarded.
