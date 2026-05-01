---
task: Implement test framework for Neovim config project
slug: 20260319-120000_implement-nvim-config-tests
effort: extended
phase: complete
progress: 18/18
mode: interactive
started: 2026-03-19T12:00:00-03:00
updated: 2026-03-19T12:05:00-03:00
---

## Context

Barbosa's Neovim config has zero tests. The project has testable pure-logic modules (filetypes.lua path/content detection, utils/init.lua utilities, health.lua status logic) and structural validation (plugin specs return valid tables, keymaps don't conflict). Plenary.nvim is already a dependency, making plenary.busted the natural test runner — no new deps needed.

### Risks
- Plenary.busted requires a minimal_init.lua to bootstrap without full config
- Some modules depend on vim APIs that need careful mocking or headless setup
- Plugin spec tests can't load actual plugins — only validate table structure

## Criteria

- [x] ISC-1: tests/minimal_init.lua bootstraps plenary without full config
- [x] ISC-2: Makefile target `test` runs all tests via nvim headless
- [x] ISC-3: Makefile target `test-file` runs a single test file
- [x] ISC-4: filetypes test: .tf extension detected as terraform
- [x] ISC-5: filetypes test: .tfvars extension detected as terraform
- [x] ISC-6: filetypes test: Chart.yaml filename detected as helm
- [x] ISC-7: filetypes test: k8s path pattern detected as yaml.kubernetes
- [x] ISC-8: filetypes test: ansible path pattern detected as yaml.ansible
- [x] ISC-9: filetypes test: content with apiVersion+kind detected as kubernetes
- [x] ISC-10: filetypes test: content with hosts detected as ansible
- [x] ISC-11: utils test: is_executable returns true for existing command
- [x] ISC-12: utils test: is_executable returns false for missing command
- [x] ISC-13: utils test: safe_require returns module for valid require
- [x] ISC-14: utils test: safe_require returns nil for invalid module
- [x] ISC-15: health test: devops_servers table has expected server entries
- [x] ISC-16: plugin specs test: each spec file returns a non-empty table
- [x] ISC-17: plugin specs test: each plugin entry has a string [1] (repo)
- [x] ISC-18: all tests pass when run via `make test`

## Decisions

- Used plenary.busted over busted/mini.test since plenary.nvim is already installed
- Tests use `vim.filetype.match()` with scratch buffers for content-based detection
- Health tests mock `vim.health.*` functions to capture output without side effects
- Plugin spec tests validate structure only (repo string format) — no plugin loading
- Extracted `with_buf()` helper for buffer lifecycle in filetypes tests (post-simplify)

## Verification

All 37 tests pass across 4 test files:
- tests/utils/init_spec.lua: 4/4 pass
- tests/config/filetypes_spec.lua: 13/13 pass
- tests/config/health_spec.lua: 2/2 pass
- tests/plugins/specs_spec.lua: 18/18 pass
