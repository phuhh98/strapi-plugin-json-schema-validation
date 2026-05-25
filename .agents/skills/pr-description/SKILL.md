---
name: pr-description
description: "Use when: you need to generate a clear, technical pull request description with summary, issue, solution, changes, callouts, and optional testing sections. Triggers on PR, diff, or beads context."
---

# PR Description Agent Skill

## Purpose

Generate a clear, technical pull request description for code changes. Use when you want a standardized PR template with summary, issue, solution, changes, callouts, and optional testing. Omits empty sections for brevity. Compatible with beads workflow.

## Usage

- Use when: opening a pull request, summarizing a diff, or documenting changes for review
- Agent collects context from:
  - Diff (or staged changes)
  - beads tasks/issues
  - User-supplied summary (if provided)
- Generates PR description with relevant sections in fixed order
- Omits sections with no info
- Uses markdown and minimal emoji for clarity

## Sections

- **Summary**: High-level overview
- **Issue**: Problem or motivation
- **Solution**: Approach taken
- **Changes**: Key code/logic changes
- **Callouts**: Special notes, breaking changes, migration, etc.
- **Testing**: (Optional) Test coverage, manual/automated checks

## Example Output

```
# 🚀 Summary
<summary>

# 🐞 Issue
<issue>

# 🛠️ Solution
<solution>

# 🔄 Changes
<changes>

# ⚠️ Callouts
<callouts>

# ✅ Testing
<testing>
```

## Implementation Notes

- Section order fixed as above
- If section empty, omit from output
- Use clear, technical language
- Avoid excessive emoji or formatting
- Compatible with beads workflow

## Common Pitfalls

- If `description` does not mention "pull request", "PR", or "diff", agent may not trigger.
- YAML frontmatter: quote all colons, use spaces not tabs, ensure `name` matches folder.
- Do not use for general documentation or non-PR summaries.
