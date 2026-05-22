---
name: commit-rules
description: >
  All commit messages must use the caveman-commit skill. See caveman-commit skill for details and format.
version: 2.0.0
author: GitHub Copilot
tags: [commit, caveman-commit, agent-instructions]
---

# Commit Rules

All commit messages must use the caveman-commit skill.
Refer to the caveman-commit skill documentation for message format and requirements.

## Commit Type Rules

- Use `fix()` only for changes to `package.json` and `package-lock.json` that resolve bugs or dependency issues.
- Use `chore()` for all other changes, including agent files, settings, documentation, and configuration updates.
