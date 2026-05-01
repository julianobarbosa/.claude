---
task: Fresh start from kickstart.nvim with custom re-additions
slug: 20260309-120000_kickstart-nvim-fresh-start
effort: advanced
phase: verify
progress: 21/24
mode: interactive
started: 2026-03-09T12:00:00-03:00
updated: 2026-03-09T12:01:00-03:00
---

## Context

Rewrite the Neovim config from scratch using kickstart.nvim patterns while preserving all 40+ plugins worth of functionality. User chose modular architecture, keep all extras, new branch.

### Risks
- LSP server configs are complex — any mistake breaks language support
- Duplicate gitsigns must be resolved without losing keymaps
- ChatGPT Azure credentials via pass must be preserved exactly
- DAP async cargo build for Rust is non-trivial

## Criteria

- [ ] ISC-1: Branch kickstart-fresh-start created from main
- [ ] ISC-2: lua/kickstart/ directory deleted
- [ ] ISC-3: lua/config/compat.lua deleted
- [ ] ISC-4: lua/config/quickref.lua deleted
- [ ] ISC-5: lua/config/constants.lua deleted
- [ ] ISC-6: lua/config/performance.lua deleted
- [ ] ISC-7: init.lua rewritten with clean kickstart patterns
- [ ] ISC-8: lua/config/options.lua has no deferred scheduling
- [ ] ISC-9: lua/config/keymaps.lua has no LSP keymaps (in lsp.lua)
- [ ] ISC-10: lua/config/autocmds.lua has no terraform filetype autocmd
- [ ] ISC-11: lua/config/init.lua loads all modules in correct order
- [ ] ISC-12: core.lua has no vim-fugitive (moved to git.lua)
- [ ] ISC-13: gitsigns defined only once across all spec files
- [ ] ISC-14: lsp.lua preserves all 20+ server configurations
- [ ] ISC-15: conform.nvim preserves all formatter configs
- [ ] ISC-16: nvim-lint preserves all linter configs
- [ ] ISC-17: git.lua contains single gitsigns with full on_attach
- [ ] ISC-18: ui.lua contains only tokyonight and vim-illuminate
- [ ] ISC-19: ai.lua has no disabled plugin entries
- [ ] ISC-20: debug.lua preserves Rust async cargo build
- [ ] ISC-21: treesitter.lua preserves all parsers and textobjects
- [ ] ISC-22: Lazy profile shows startup under 50ms
- [ ] ISC-23: LspInfo shows server attached for Lua files
- [ ] ISC-24: checkhealth shows no errors for configured servers

## Decisions

1. Keep modular architecture (user chose option 1)
2. Remove aggressive perf hacks — let lazy.nvim handle performance
3. Consolidate gitsigns into git.lua only
4. Move lazy.nvim bootstrap inline to init.lua
5. Delete lua/config/lazy.lua

## Verification

Evidence will be added as criteria are verified.
