# ---

name: beads-caveman
description: >
Enforce use of beads (persistent task memory) and caveman (token compression) skills for all agent work in this Strapi plugin project. Applies to all files and technologies. Hard rule.
version: 1.0.0
author: GitHub Copilot
tags: [beads, caveman, strapi, json-schema, agent-instructions]

# ---

# beads and caveman skills usage for strapi-plugin-json-schema-validation

## Caveman Skills Overview

This project supports the following caveman skills for token-efficient, compressed, and actionable agent output:

| Skill            | Purpose/Trigger                                                               |
| ---------------- | ----------------------------------------------------------------------------- |
| caveman          | Compressed agent responses. `/caveman`, `/caveman lite`, `/caveman ultra`     |
| cavecrew         | Delegate to caveman-style subagents for code search, small edits, or reviews. |
| caveman-commit   | Ultra-terse commit messages. `/caveman-commit`                                |
| caveman-compress | Compress memory files to caveman prose. `/caveman-compress <file>`            |
| caveman-help     | Show caveman quick-reference. `/caveman-help`                                 |
| caveman-review   | One-line actionable code review. `/caveman-review`                            |
| caveman-stats    | Show real token usage and savings. `/caveman-stats`                           |

**Always use the appropriate caveman skill for the task.**

## Purpose

This instruction enforces the use of the `beads` and `caveman` skills for all agent work in this project, which is a Strapi plugin for providing a JSON Schema Validation custom field.

## Rules

### beads (Persistent Task Memory)

- Use the `beads` skill to manage multi-session work, track dependencies, and recover context after conversation compaction.
- Always use `beads` for any task or context that may need to persist across sessions, especially for feature work, bug tracking, or anything with dependencies.
- Trigger `beads` with: "create task", "what's ready", "track this work", "resume after compaction".
- Prefer `beads` over ephemeral todo lists for anything that may be needed in the future ("Will I need this context in 2 weeks?" YES = beads).

### caveman (Token Compression & Related Skills)

- Use `caveman` mode for all agent responses unless the user explicitly requests normal mode.
- Default to `caveman full` intensity for maximum token savings, unless the user requests `lite` or `ultra`.
- Drop filler, pleasantries, and hedging. Use technical fragments and short synonyms. Code and error messages remain unchanged.
- If user requests "stop caveman" or "normal mode", revert to standard output.
- Use `cavecrew` subagents for compressed code search, 1-2 file edits, or terse reviews when context budget is a concern.
- Use `caveman-commit` for all commit messages: terse, Conventional Commits, ≤50 char subject, no fluff.
- Use `caveman-compress` to compress memory/markdown files and save tokens.
- Use `caveman-help` to display caveman quick-reference for modes, skills, and triggers.
- Use `caveman-review` for code review: one-line, actionable, location/problem/fix format.
- Use `caveman-stats` to show real token usage and savings for the session.

## Scope

- Applies to all agent interactions in this repository.
- Applies to all file types and technologies in the strapi-plugin-json-schema-validation project.
- These are hard rules for this project.

## Example Prompts

- "Track this work for JSON schema validation feature using beads."
- "Use caveman mode for all responses."
- "Resume after compaction with beads."

## Related Customizations to Consider Next

- Add project-specific coding style or linting rules.
- Enforce Strapi plugin conventions for file structure or naming.
- Add instructions for custom field UI/UX patterns.
