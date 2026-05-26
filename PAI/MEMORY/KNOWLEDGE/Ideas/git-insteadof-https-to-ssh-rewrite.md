---
title: User's git config rewrites HTTPS GitHub URLs to SSH at clone time
type: gotcha
tags: [git, github, config, ssh, https, clone]
created: 2026-05-01
links: []
---

User has a global git `insteadOf` directive that rewrites `https://github.com/...` clone URLs to the SSH equivalent `git@github.com:...`. Effect: after `git clone https://github.com/owner/repo`, running `git remote get-url origin` returns the SSH form, not the HTTPS form.

Implication for ISCs: any ISC that asserts the literal HTTPS clone URL on `origin` will fail on this machine. Phrase ISCs in terms of substantive upstream identity (`owner/repo`) not URL notation, or explicitly account for the rewrite.

Verify with: `git config --get-all url.git@github.com:.insteadOf` — should return `https://github.com/`.

Functionally identical: SSH and HTTPS endpoints reach the same git server. Affects only string equality of remote URLs and authentication path (SSH key vs HTTPS token).
