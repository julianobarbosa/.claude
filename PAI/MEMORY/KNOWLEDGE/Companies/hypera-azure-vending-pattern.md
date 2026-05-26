# Hypera — ALZ Subscription-Vending Pattern (RG-inside-existing-sub)

> Captured 2026-05-27 during draft of `Plans/vending-machine-request-rg-hypera-cafehyna-dev-eus2.md`.
> Cross-refs: [[rg-subscription-doctrine]], [[hypera-cidr-allocations]] (slugs for future memos).

## The pattern in one sentence

Hypera's ALZ subscription-vending operates at **sub-scope** (vend a new RG inside an existing subscription), not just at subscription-scope — the workload team writes a structured ASK that names every input the platform-team vending automation needs, and platform returns a wired-up RG (Corp connected product line: hub-peered + IPAM-allocated + tag-shaped + MG-policy-bound).

## When this pattern applies

- Workload needs a new RG inside an existing multi-tenant subscription (e.g., `operacoes-dev` hosts cafehyna-dev workload AND other tenants).
- Region migration: vended-new-RG path replaces the forbidden "delete old RG + create new" anti-pattern (RG/Subscription Doctrine rule #1).
- New workload in an existing subscription needs hub-peered networking + standard tag/policy inheritance.
- NOT for: net-new subscription requests (different doctrine, subscription-scope), or for one-off resources that fit in an existing RG.

## What the ASK names (workload team's responsibility)

1. **Subscription** + **region** + **RG name** (locked by naming intent in workload Terraform).
2. **MG placement** — Corp connected for hub-routed AKS; Online for isolated PaaS; Sandbox for PoC.
3. **Tags** — cost-center, owner, environment, workload, data-classification (Hypera org-required).
4. **IPAM** — vNet CIDR from `docs/cidr-azure.md` allocation table (don't propose new allocations; reuse the workload's reserved block).
5. **Peering target** — hub vNet name + RG. Hub-region naming intent must match workload region (eastus2 ↔ `vnet-hub-eastus2`).
6. **DNS strategy** — three options: hub-managed re-import / AVM-creates-in-workload-RG / platform-provisions-in-hub. Default for non-prod = option (b).
7. **Route table** — only if egress-via-firewall is the model. Platform confirms.
8. **NSGs** — workload-team-owned at subnet level; vending does NOT pre-create.

## What "real network" landing means (the binary acceptance gate)

Four `az` probes, each returning yes/no, all required before the workload team trusts the vending complete:

- **P1:** `az network vnet peering list` shows spoke→hub peering in state `Connected`.
- **P2** *(conditional on DNS option (a) or (c))*: `az network private-dns link vnet list` shows hub-managed zone linked to spoke vNet.
- **P3** *(conditional on egress-via-firewall model)*: route 0.0.0.0/0 next-hop = `VirtualAppliance` at hub firewall private IP.
- **P4:** spoke NSG has at least one Outbound `Allow` rule for `AzureCloud.eastus2` (or broader `AzureCloud`).

If P1..P4 don't all pass, workload destroy/apply stays parked — platform team fixes networking in place, never by re-vending.

## What the hand-back package contains (platform team's responsibility)

Vended RG resource ID + creation timestamp + vending ticket ID + spoke peering ID + hub-reverse peering ID + route-table ID (conditional) + hub firewall IP (conditional) + hub-DNS link ID (conditional) + written acks: no subscription-scope policy/role changes, vended RG stays externally managed (no `resource "azurerm_resource_group"` in workload tree).

## Doctrine binds

- RG/Subscription Doctrine — three NEVERs (root `CLAUDE.md` ▸ *Resource Group & Subscription Doctrine*, global `~/.claude/CLAUDE.md` ▸ *Azure Resource Group & Subscription Doctrine*).
- Vended RG = `data "azurerm_resource_group"` consumption in Terraform, never `resource`.
- Failure mode is forward-fix, never RG deletion + re-vend.
- Subscription-scope policy/role assignments are platform-team coordination, not workload ASK.

## AVM tooling Hypera accepts

- Bicep: `Azure/bicep-lz-vending`
- Terraform: `Azure/lz-vending/azurerm`

Platform team picks. Workload ASK is tool-agnostic.

## Reusable artifact

The drafted ASK template lives at `Plans/vending-machine-request-rg-hypera-cafehyna-dev-eus2.md` (Hypera repo `rg-hypera-packer-image`). For next workload vending (Story 14-5 self-hosted ADO agent RG if it needs its own, or any subsequent CaféHyna prod/staging RG), copy that file as the template and re-fill §3 (Vending parameters) + §4 (Network wire-up) for the new workload. The four-probe §2 acceptance gate is reusable verbatim.
