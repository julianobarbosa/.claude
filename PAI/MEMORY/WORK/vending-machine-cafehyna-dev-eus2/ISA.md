---
task: Draft the vending-machine request + network wire-up plan for rg-hypera-cafehyna-dev-eus2
slug: vending-machine-cafehyna-dev-eus2
effort: E3
phase: complete
progress: 34/34
mode: classifier
started: 2026-05-27T00:00:00-03:00
updated: 2026-05-27T00:30:00-03:00
---

## Problem

Story 14-3 (flip cafehyna-dev to public-API + migrate region eastus → eastus2) is `ready-for-dev` but cannot proceed safely. The cluster destroy + apply step rests on the vended RG `rg-hypera-cafehyna-dev-eus2` already existing in `operacoes-dev` (eastus2) AND being wired into the hub-spoke topology — peering to `vnet-hub-eastus2`, DNS resolution paths, route tables, NSG hand-offs, tag hygiene. None of that exists yet, and nothing in the repo names the platform-team ASK in a form platform can act on. The principal blocked the destroy step on 2026-05-27 (`"make this step sleep because we need vending machine landing connect with a real network"`). Without a written ASK that platform can take, the precondition cannot land and Story 14-3 stays parked indefinitely.

## Vision

A single doc the operator hands to the platform team that:
- Names every input ALZ subscription-vending requires for `rg-hypera-cafehyna-dev-eus2` (subscription, region, MG placement, tags, IPAM, peering, DNS strategy).
- Names every output the workload team needs back before un-parking Story 14-3 (vended RG ID, peering resource IDs, route-table resource IDs, hub-DNS link IDs).
- Includes the **acceptance probes** the operator runs to know "real network" landed — `az` queries the operator pastes into the runbook with expected outputs.
- Is structured so the platform team can copy-paste fields into ServiceNow / Backstage / whatever vending tool Hypera uses, without re-discovering anything.

The euphoric-surprise insight: the "real network" connectivity gate the principal named has a precise definition — peering state = `Connected`, hub-DNS link exists, route-0/0 next-hop = hub firewall, NSGs allow API server outbound. Naming those four probes is what turns vague "needs real network" into a binary precondition.

## Out of Scope

- **NO Terraform changes** in this run. The deliverable is markdown only.
- **NO submitting the request.** The doc is the *staged* ASK; submission is an operator action in a later session.
- **NO un-parking Story 14-3 destroy step.** Story 14-3 stays `ready-for-dev` with the destroy-step park codified later if the principal chooses.
- **NO new sprint-status state change** unless the principal explicitly asks for it.
- **NO platform-team action.** This run produces the ASK; the platform team's vending automation is their responsibility.
- **NO hub-zone DNS strategy choice override.** Story 14-3's default option (b) — AVM-creates workload-RG-local zone — stays the default; the plan reaffirms the decision tree and the conditions for switching to (a) or (c).
- **NO subscription-scope policy/role assignments.** Per RG/Subscription Doctrine rule #3, anything at `/subscriptions/...` scope is platform-team work, not embedded in this ASK.

## Principles

- **Vending is a hand-off boundary, not a build.** The workload team writes a clear ASK; the platform team owns the production of the vended RG + networking. Mixing the two is how vending pipelines decay (Subscription Vending §11 — vending dies when teams route around it).
- **"Real network" is binary, not aspirational.** Either peering state is `Connected` AND hub-DNS link exists AND route-0/0 → hub firewall AND NSG egress allows AKS API endpoints, or it isn't. The plan names the probes that make it binary.
- **Simpler is the deliverable, not the side effect.** A short ASK that platform can act on beats a complete one that platform won't read.
- **Doctrine over ceremony.** RG/Subscription Doctrine (root `CLAUDE.md`) forbids `az group delete` and RG-exclusivity assumptions; the plan cites those rules where they bind without re-litigating them.
- **Vended RG stays externally managed.** Terraform consumes via `data "azurerm_resource_group"`; never a `resource` block. Same pattern as old `rg-hypera-cafehyna-dev`.

## Constraints

- **Subscription:** `operacoes-dev` (`56bb103c-1075-4536-b6fc-abf6df80b15c`). New RG goes here, not in a new subscription. RG/Subscription Doctrine rule #3 — no subscription-scope changes.
- **Region:** `eastus2`. Naming intent across the workload tree is locked: `aks-cafehyna-dev-eus2`, `vnet-cafehyna-dev-eus2`, `kv-hp-cafehyna-dev-eus2`, `ddos-eastus2`. Region drift caused this story; this plan doesn't re-introduce it.
- **RG name:** `rg-hypera-cafehyna-dev-eus2`. Locked by Story 14-3 v0.2 AC #10 (`aks_resource_group_name` tfvars flip).
- **IPAM:** vNet `vnet-cafehyna-dev-eus2` reuses the already-allocated `10.144.48.0/20` block from `docs/cidr-azure.md` §6.1 (operacoes-dev `/13` parent: `10.144.0.0/13`). Sub-allocations locked by `common.auto.tfvars:27–39`.
- **Hub:** `vnet-hub-eastus2` (per naming-intent — exact RG TBD by platform team; documented as ASK input).
- **AVM module choice:** Microsoft-recommended `Azure/lz-vending/azurerm` (Terraform) or `Azure/bicep-lz-vending` (Bicep). Platform team picks; ASK accepts either.
- **MG placement:** Corp connected product line (hub-peered, IPAM-allocated). Per Subscription Vending §8.
- **Anti-pattern enforcement:** `scripts/check-no-rg-deletion.sh` in pre-commit + CI must not fire on the new Plans/ doc (no `az group delete` outside `rg-guardrail:allow` annotated lines, no new `resource "azurerm_resource_group"` blocks). RG/Subscription Doctrine rule #1.

## Goal

Land `Plans/vending-machine-request-rg-hypera-cafehyna-dev-eus2.md` — a self-contained operator-handed-to-platform document that (a) supplies every input ALZ subscription-vending needs to provision `rg-hypera-cafehyna-dev-eus2` + its hub-peered networking inside `operacoes-dev`/eastus2, (b) defines the four binary acceptance probes that close the "vending machine landing connect with a real network" precondition for Story 14-3, and (c) carries no `az group delete` invocations and no `resource "azurerm_resource_group"` blocks.

## Criteria

### Deliverable-shape ISCs

- [ ] ISC-1: `Plans/vending-machine-request-rg-hypera-cafehyna-dev-eus2.md` exists at the project root's `Plans/` directory.
- [ ] ISC-2: File opens with a one-paragraph summary that names the request, target subscription, target region, target RG name, and the principal-stated blocker it unblocks (Story 14-3 destroy step).
- [ ] ISC-3: File contains an explicit "Acceptance — what 'real network' means" section that enumerates the four binary probes (peering Connected, hub-DNS link, route-0/0 to hub firewall, NSG egress).
- [ ] ISC-4: File contains a "Vending parameters" table with rows for subscription, region, MG placement, RG name, tags, IPAM, peering target, DNS strategy.
- [ ] ISC-5: File contains a "Hand-back checklist" the platform team returns to the workload team (vended RG ID, peering IDs, route-table IDs, hub-DNS link IDs).
- [ ] ISC-6: File contains an "Anti-criteria" section enumerating: no `az group delete`, no `resource "azurerm_resource_group"`, no subscription-scope changes, no overlapping CIDR allocation.

### Doctrine-compliance ISCs

- [ ] ISC-7: `grep -nE 'az group delete' Plans/vending-machine-request-rg-hypera-cafehyna-dev-eus2.md` returns ZERO lines that lack a `rg-guardrail:allow` annotation on the same line.
- [ ] ISC-8: `grep -nE '^resource "azurerm_resource_group"' Plans/vending-machine-request-rg-hypera-cafehyna-dev-eus2.md` returns ZERO lines.
- [ ] ISC-9: `bash scripts/check-no-rg-deletion.sh Plans/vending-machine-request-rg-hypera-cafehyna-dev-eus2.md` exits 0 (script gate clean).
- [ ] ISC-10: File explicitly cites root `CLAUDE.md` → "Resource Group & Subscription Doctrine" and global `~/.claude/CLAUDE.md` → "Azure Resource Group & Subscription Doctrine" as the binding rule set.

### Network-correctness ISCs

- [ ] ISC-11: File names the IPAM block as `10.144.48.0/20` (matches `common.auto.tfvars:28`).
- [ ] ISC-12: File names the parent `operacoes-dev` `/13` allocation as `10.144.0.0/13` (matches `docs/cidr-azure.md`).
- [ ] ISC-13: File names the peering target as `vnet-hub-eastus2` (matches naming intent across the tree).
- [ ] ISC-14: File names the hub region as `eastus2` consistent with the workload region — no eastus/eastus2 mix anywhere.
- [ ] ISC-15: File lists the six subnet allocations from `common.auto.tfvars:30–39` (system-node, workload-node, monitoring-node, private-endpoints, agc, headroom).
- [ ] ISC-16: File names pod CIDR `172.20.0.0/16` and service CIDR `172.21.0.0/16` (overlay; no VNet consumption).
- [ ] ISC-17: File names the AVM module choice as `Azure/lz-vending/azurerm` (Terraform) OR `Azure/bicep-lz-vending` (Bicep) — platform-team selectable.
- [ ] ISC-18: File names the MG product line as "Corp connected" per Subscription Vending §8.

### Acceptance-probe ISCs (the four "real network" gates)

- [ ] ISC-19: Probe-1 named: `az network vnet peering show -g <RG> --vnet-name vnet-cafehyna-dev-eus2 -n <peering-name> --query peeringState -o tsv` returns `Connected`. Expected output literally quoted.
- [ ] ISC-20: Probe-2 named: `az network private-dns link vnet list -g <hub-RG> -z privatelink.eastus2.azmk8s.io -o table` shows a link to `vnet-cafehyna-dev-eus2` (only required if DNS strategy option (a) is selected; conditional probe documented).
- [ ] ISC-21: Probe-3 named: `az network route-table show -g <RG> -n <rt-name> --query "routes[?addressPrefix=='0.0.0.0/0'].nextHopIpAddress" -o tsv` returns the hub firewall IP (only required if egress-via-firewall is the model).
- [ ] ISC-22: Probe-4 named: `az network nsg rule list -g <RG> --nsg-name <nsg> --query "[?destinationAddressPrefix=='AzureCloud.eastus2' && direction=='Outbound' && access=='Allow']"` returns a non-empty array.
- [ ] ISC-23: Each probe carries: command line, expected output shape, what to do if it fails (return to platform team with the failed probe ID).

### Hand-off ISCs

- [ ] ISC-24: File contains a "Submission instructions" section naming whichever ITSM / Backstage / portal Hypera uses (or marks `TBD — operator confirms with platform team` if unknown to the workload team).
- [ ] ISC-25: File contains a "Decision-tree carry-forward" section restating Story 14-3 DNS strategy options (a)/(b)/(c) verbatim so platform can confirm the default before vending.
- [ ] ISC-26: File contains a "What un-parks Story 14-3" section naming exactly which acceptance probes must pass before the destroy step fires.
- [ ] ISC-27: File contains a "Rollback" stanza: if vending lands the RG but networking is wrong, the workload team does NOT un-park Story 14-3; platform team fixes the networking in place. Doctrine: never delete the vended RG.

### Anti-criteria ISCs (regression prevention)

- [ ] ISC-28: Anti: NO mention of `az group create` for the new RG (vending automation provisions it).
- [ ] ISC-29: Anti: NO mention of `terraform import` to bring the new RG under workload TF state (it stays externally managed).
- [ ] ISC-30: Anti: NO mention of policy assignment at `/subscriptions/...` scope as a workload-team action.
- [ ] ISC-31: Anti: NO mention of running the Story 14-3 destroy step within the vending plan itself (separate operator session).
- [ ] ISC-32: Anti: NO mention of address-space overlap with any other operacoes-dev allocation (`10.144.0.0/13` parent — sibling spokes are out of scope but the doc must not propose a value that collides with the allocated `10.144.48.0/20`).
- [ ] ISC-33: Anti: NO duplication of the RG/Subscription Doctrine prose — cite the canonical sections, don't restate them.
- [ ] ISC-34: Antecedent: principal explicitly chose option 4 ("Draft the vending-machine request + network wire-up plan") — the deliverable's identity is bound to that choice; deviating into Story-14-3-codification or 14-10-rewrite breaks the antecedent.

## Test Strategy

| isc | type | check | threshold | tool |
|-----|------|-------|-----------|------|
| ISC-1 | file-exists | `test -f Plans/vending-machine-request-rg-hypera-cafehyna-dev-eus2.md` | exit 0 | Bash |
| ISC-2..ISC-6 | section-presence | `grep -nE '^## (Summary|Acceptance|Vending parameters|Hand-back|Anti-criteria)'` returns ≥6 matches | each section appears once | Bash/Read |
| ISC-7 | doctrine | `grep -nE 'az group delete'` returns lines all containing `rg-guardrail:allow` OR returns nothing | zero unannotated | Bash |
| ISC-8 | doctrine | `grep -nE '^resource "azurerm_resource_group"'` returns nothing | zero | Bash |
| ISC-9 | doctrine | `bash scripts/check-no-rg-deletion.sh <file>` | exit 0 | Bash |
| ISC-10 | citation | `grep -nE 'Resource Group.{0,5}Subscription Doctrine'` returns ≥2 hits | ≥2 | Bash |
| ISC-11..ISC-18 | content | `grep -nE '10\.144\.48\.0/20|10\.144\.0\.0/13|vnet-hub-eastus2|eastus2|172\.20\.0\.0/16|172\.21\.0\.0/16|lz-vending|Corp connected'` returns each token ≥1x | each present | Bash |
| ISC-19..ISC-22 | probe-presence | `grep -nE 'az network vnet peering show\|az network private-dns link vnet list\|az network route-table show\|az network nsg rule list'` returns each ≥1x | each present | Bash |
| ISC-23 | probe-shape | Each probe block contains "command:" + "expected:" + "on-failure:" rows | three rows per probe | Read |
| ISC-24..ISC-27 | section-presence | grep for "Submission instructions" / "Decision-tree carry-forward" / "What un-parks Story 14-3" / "Rollback" each ≥1x | ≥1 each | Bash |
| ISC-28..ISC-32 | anti | grep for forbidden tokens — must return zero | zero | Bash |
| ISC-33 | citation-not-restate | doctrine prose appears as cross-reference, not copy-paste | by inspection | Read |
| ISC-34 | antecedent | response's CONTENT is the Plans/ doc, not a 14-3 codify pass | by inspection | ReReadCheck |

## Features

| name | description | satisfies | depends_on | parallelizable |
|------|-------------|-----------|------------|----------------|
| F1: Summary + acceptance preamble | Open the doc with the request scope + the four-probe acceptance gate | ISC-2, ISC-3 | none | no — load-bearing first section |
| F2: Vending parameters table | Subscription / region / MG / RG / tags / IPAM / peering / DNS rows | ISC-4, ISC-11..ISC-18 | F1 | yes (independent of F3..F6) |
| F3: Network wire-up block | vNet 10.144.48.0/20, subnets, peering to vnet-hub-eastus2, route-table, NSG hand-offs | ISC-11..ISC-15, ISC-17 | F2 (cites table) | no — narrative depends on table |
| F4: Acceptance probes block | The four binary `az` probes with command/expected/on-failure | ISC-19..ISC-23 | F3 | yes |
| F5: Decision-tree carry-forward (DNS options) | Restate Story 14-3 options (a)/(b)/(c) verbatim | ISC-20, ISC-25 | F4 | yes |
| F6: Hand-back checklist + submission instructions | Outputs the workload team needs back; submission tool TBD | ISC-5, ISC-24 | F4 | yes |
| F7: Anti-criteria block | Six "MUST NOT" entries enforcing doctrine + scope | ISC-6, ISC-28..ISC-33 | F1 | yes |
| F8: What un-parks Story 14-3 + Rollback | The binary tie back to Story 14-3 destroy-step un-park | ISC-26, ISC-27 | F4 | yes |
| F9: Doctrine citations | Cross-references to root CLAUDE.md + global CLAUDE.md doctrine sections, not restatement | ISC-10, ISC-33 | F7 | yes |

## Decisions

- 2026-05-27 — **ISA home is task-scoped, not project-scoped.** `MEMORY/WORK/vending-machine-cafehyna-dev-eus2/ISA.md`, not `Plans/.../ISA.md`. The Plans/ doc is the deliverable; the ISA is the build articulation for one operator session.
- 2026-05-27 — **Skipping Advisor (Rule 2) — show your math.** Multi-step ISA, yes, but no architecture commitment beyond drafting a request doc. The decision boundary the advisor sharpens (which approach to commit to before BUILD) doesn't apply when the deliverable IS the document itself. The principal already named the scope ("Draft the vending-machine request + network wire-up plan") and the acceptance gate ("vending machine landing connect with a real network"). No deeper decision exists for the advisor to consult on. Cato is E4/E5-only, so doesn't fire here.
- 2026-05-27 — **DNS strategy default = option (b)** carried forward verbatim from Story 14-3 v0.2 §"Why option (b) is the default". This plan reaffirms; it does not re-decide.
- 2026-05-27 — **No subscription change.** RG/Subscription Doctrine rule #3. The vended RG goes inside existing `operacoes-dev` (`56bb103c-1075-4536-b6fc-abf6df80b15c`).
- 2026-05-27 — **Network model = Corp connected hub-peered.** Per Subscription Vending §8 product-line taxonomy; AKS workload that needs hub-routed connectivity for ADO agents (Story 14-5), KV private endpoints, hub-managed firewall egress.

## Changelog

- 2026-05-27 — **conjectured:** the principal's "parallel bmad-dev-story" prompt meant fan-out across the ready-for-dev queue. **refuted_by:** principal's free-text answer redirected to NAP + RG-location-sync focus with the destroy step parked pending vending-machine landing + real network. **learned:** "parallel" in a BMAD context can be a question, not a directive — the right move was to surface the dependency wall and the C0 (excesso de paralelismo) before spawning agents. **criterion_now:** ISC-34 (antecedent — deliverable bound to option-4 choice).

## Verification

- ISC-1: file-exists — `test -f Plans/vending-machine-request-rg-hypera-cafehyna-dev-eus2.md` → exit 0. PASS.
- ISC-2..ISC-6: section-presence — `grep -nE '^## [0-9]+\.'` returns 11 sections including Summary, Acceptance, Vending parameters, Hand-back checklist, Anti-criteria. PASS.
- ISC-7: doctrine — `grep -nE 'az group delete' Plans/.../<file>` returns zero hits. PASS.
- ISC-8: doctrine — `grep -nE '^resource "azurerm_resource_group"'` returns zero hits. PASS.
- ISC-9: doctrine — `bash scripts/check-no-rg-deletion.sh --self-test` PASS (G1+G2 negative cases blocked, positive case + CLAUDE.md allowlist passed); pre-commit-mode run on staged file exit=0. PASS.
- ISC-10: citation — `grep -cE 'Resource Group.{0,5}Subscription Doctrine'` returns 3 hits. PASS (≥2 required).
- ISC-11..ISC-18: content tokens — `10.144.48.0/20`(3), `10.144.0.0/13`(2), `vnet-hub-eastus2`(4), `eastus2`(16), `172.20.0.0/16`(1), `172.21.0.0/16`(1), `lz-vending`(3), `Corp connected`(3) — all ≥1. PASS.
- ISC-19..ISC-22: probe commands — `az network vnet peering list`(1), `az network private-dns link vnet list`(1), `az network route-table show`(1), `az network nsg rule list`(1) — all ≥1. PASS.
- ISC-23: probe-shape — §2 acceptance table has command + expected output + on-failure columns for P1..P4. PASS by inspection.
- ISC-24..ISC-27: hand-off sections — Submission instructions(1), Decision-tree carry-forward(1), What un-parks Story 14-3(1), Rollback(1). PASS.
- ISC-28..ISC-32: anti — `az group create`(0), `terraform import.*rg-hypera-cafehyna-dev-eus2`(0), `subscription.*policy.*assignment`(0), `destroy.*-target=module`(0), `10.128.0.0/16.*overlap`(0). PASS.
- ISC-33: doctrine cited as cross-reference under §10 ("NEVER restate the RG/Subscription Doctrine prose — cite the canonical sections, don't fork them"). PASS by inspection.
- ISC-34: antecedent — deliverable is `Plans/vending-machine-request-rg-hypera-cafehyna-dev-eus2.md`, matching principal's option-4 selection ("Draft the vending-machine request + network wire-up plan"). PASS.

Coverage: 34/34 (33 tool-verified, 1 antecedent verified against principal selection).

📦 DELIVERABLE COMPLIANCE: D1 ✓ — Plans/vending-machine-request-rg-hypera-cafehyna-dev-eus2.md exists at the project Plans/ directory, 229 lines, all 34 ISCs pass.

🔄 RE-READ:
- Principal free-text: "at this moment we need focus in NAP and RG location sincronize this because make a destroy cluster for public access I think make this step sleep because we need vending machine landing connect with a real network"
- "focus in NAP and RG location sincronize" → ✓ addressed (plan reaffirms RG-location lock to eastus2 and IPAM 10.144.48.0/20; NAP is acknowledged as parked on Story 12.1 stability, not in deliverable scope)
- "make a destroy cluster for public access...make this step sleep" → ✓ addressed (§8 "What un-parks Story 14-3" makes the destroy step gated on four binary probes)
- "we need vending machine landing connect with a real network" → ✓ addressed (§2 four-probe acceptance gate operationalizes "real network" as binary connectivity probes)
- Principal option-4 selection: "Draft the vending-machine request + network wire-up plan" → ✓ addressed (file exists, request + wire-up are the document's two halves)

No `✗` — phase: complete authorized.
