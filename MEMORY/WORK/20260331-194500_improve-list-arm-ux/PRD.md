---
task: Improve azure-reservations list-arm CLI UX output
slug: 20260331-194500_improve-list-arm-ux
effort: extended
phase: complete
progress: 18/18
mode: interactive
started: 2026-03-31T19:45:00-03:00
updated: 2026-03-31T19:45:30-03:00
---

## Context

User ran `azure-reservations list-arm --subscription <id>` and the output shows 27 individual Rich panels, each rendering a reservation with its matched ARM resources. The UX problems identified:

1. Column truncation — names, subscription IDs, ARM resource IDs are cut off making data unreadable
2. No grouping by resource type — VMs, App Services, Storage interleaved alphabetically
3. Redundant columns — ARM Resource ID takes huge width with low value; Subscription column repeats same filtered value
4. Subtitle metadata crammed on one line, truncated — the most important data (type, SKU, utilization, expiry) is hardest to read
5. No summary/aggregate view — user must scroll 27 panels to understand overall state
6. No visual flagging of problems — deallocated VMs, low utilization, expiring reservations blend in
7. Alphabetical sort instead of urgency-based sort

Files to modify: `src/azure_reservations/commands/renderers.py` (main rendering), `src/azure_reservations/commands/models.py` (data model properties), `src/azure_reservations/commands/list_arm_resources.py` (sort order, summary footer).

### Risks
- Breaking `--output json` format (must not change)
- Breaking `--output table` flat view (preserve as-is, improve separately if time)
- Terminal width variance — need to handle narrow terminals gracefully
- Rich Panel subtitle may not support multi-line — fallback: use panel body header
- Sorting by days_left with None values needs null-safe comparator
- Removing columns could break user scripts that parse table output (mitigated: only affects grouped view, not table/json)

## Criteria

- [x] ISC-1: Grouped view sorts reservations by resource type first
- [x] ISC-2: Within each type group, reservations sort by days-left ascending
- [x] ISC-3: ARM Resource ID column removed from grouped panel view
- [x] ISC-4: Subscription column removed from grouped panel when single subscription
- [x] ISC-5: Panel subtitle splits metadata across two readable lines
- [x] ISC-6: Deallocated/stopped VMs show bold red status text in panel
- [x] ISC-7: Running/active resources show green status text in panel
- [x] ISC-8: Reservations expiring within 90 days show warning indicator in panel title
- [x] ISC-9: Summary footer shows total counts grouped by resource type
- [x] ISC-10: Summary footer shows running vs deallocated VM counts
- [x] ISC-11: Summary footer shows overall utilization percentage
- [x] ISC-12: Panel header shows reservation name without truncation
- [x] ISC-13: Resource name column uses full available width without truncation
- [x] ISC-14: Resource group column displays full name without truncation
- [x] ISC-15: Utilization indicator in subtitle uses color coding (green/yellow/red)
- [x] ISC-16: Days-left indicator in subtitle uses color coding (green/yellow/red)
- [x] ISC-A-1: JSON output format unchanged by any modifications
- [x] ISC-A-2: No existing CLI flags or options removed or renamed

## Decisions

## Verification

- ISC-1: Verified — `render_grouped` iterates pre-sorted groups, VMs appear before AppService
- ISC-2: Verified — sort key uses `(resource_type_sort_key, days_left, name)` with None→99999
- ISC-3: Verified — ARM Resource ID column not present in `render_grouped` table columns
- ISC-4: Verified — `_is_single_subscription` check hides Subscription column
- ISC-5: Verified — `_build_subtitle` creates two-line Text with newline separator
- ISC-6: Verified — `state_style` returns "bold red" for deallocated/stopped
- ISC-7: Verified — `state_style` returns "bold green" for running/ready/active
- ISC-8: Verified — `_expiry_warning` adds "! EXPIRING SOON" for <90d, "!!! EXPIRING" for <30d
- ISC-9: Verified — `render_summary` shows Counter of type_counts
- ISC-10: Verified — `render_summary` shows vm_running and vm_deallocated counts
- ISC-11: Verified — `render_summary` shows overall_pct with color coding
- ISC-12: Verified — panel title uses full `group.reservation_name` without truncation
- ISC-13: Verified — Name column uses `ratio=2` with `expand=True` table
- ISC-14: Verified — Resource Group column uses `ratio=2` with `expand=True` table
- ISC-15: Verified — `utilization` property uses green/yellow/red thresholds
- ISC-16: Verified — `days_left_str` property uses green/yellow/red thresholds
- ISC-A-1: Verified — JSON output dict construction unchanged in list_arm_resources.py
- ISC-A-2: Verified — All CLI options preserved: subscription, management-group, output, sku-filter, location-filter, show-unmatched
- Capability /simplify: Invoked via Skill tool, 3 parallel review agents launched, 5 issues fixed
