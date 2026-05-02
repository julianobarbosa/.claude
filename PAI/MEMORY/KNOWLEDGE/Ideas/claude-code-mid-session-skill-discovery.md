---
title: Claude Code rescans skills mid-session for third-party installs
type: idea
tags: [claude-code, skills, third-party, install]
created: 2026-05-01
links: []
---

When you `git clone` a third-party skill repo into `~/.claude/skills/<name>/`, Claude Code's skill loader picks it up in the **same session** that did the clone — not just on next session start. The README of `PleasePrompto/notebooklm-skill` (and many other third-party skills) tells users "Open Claude Code and say 'What are my skills?'", implying a restart is needed. It is not.

Mechanism: the loader rescans the skills directory when a `<system-reminder>` block listing available skills is regenerated (which happens regularly during a session, e.g., after a Skill tool invocation or specific tool calls). The newly-cloned skill's `SKILL.md` frontmatter (`name:`, `description:`) is what the loader matches, not the directory name.

Practical implication: install + immediate use in the same session is supported. No need to schedule a follow-up session purely for "first use after install."

