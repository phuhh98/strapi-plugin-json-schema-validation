<!--
Sync Impact Report

Version change: 1.0.0 → 1.1.0
Modified principles:
  - Added "V. Task Tracking with beads"
Added sections:
  - None
Removed sections:
  - None
Templates requiring updates:
  - .specify/templates/plan-template.md ✅ updated
  - .specify/templates/spec-template.md ✅ updated
  - .specify/templates/tasks-template.md ✅ updated
  - README.md ✅ updated
Follow-up TODOs:
  - [SECTION_2_NAME], [SECTION_2_CONTENT], [SECTION_3_NAME], [SECTION_3_CONTENT] left as TODOs (no user input)
  - TODO(RATIFICATION_DATE): Original ratification date unknown
-->

# strapi-plugin-json-schema-validation Constitution

> This repository provides a Strapi plugin offering a custom JSON field with validation against a predefined JSON Schema. It uses TypeScript, ajv, and monaco editor react. Plugin source code is in the `plugin/` folder; development assets are in `dev/`.

## Core Principles

### I. Library-First
Every feature starts as a standalone library; Libraries must be self-contained, independently testable, documented; Clear purpose required - no organizational-only libraries.

### II. CLI Interface
Every library exposes functionality via CLI; Text in/out protocol: stdin/args → stdout, errors → stderr; Support JSON + human-readable formats.

### III. Test-First (NON-NEGOTIABLE)
TDD mandatory: Tests written → User approved → Tests fail → Then implement; Red-Green-Refactor cycle strictly enforced.

### IV. Integration Testing
Focus areas requiring integration tests: New library contract tests, Contract changes, Inter-service communication, Shared schemas.

### V. Task Tracking with beads
All tasks, issues, user stories, and epics MUST be created, tracked, and managed exclusively in beads. No other system or ad-hoc tracking is permitted.

**Rationale:** Ensures a single source of truth, enables dependency management, and supports reproducible, auditable workflows.

## [SECTION_2_NAME]
TODO(SECTION_2_NAME): No additional constraints specified.

[SECTION_2_CONTENT]
TODO(SECTION_2_CONTENT): No additional content specified.

## [SECTION_3_NAME]
TODO(SECTION_3_NAME): No development workflow specified.

[SECTION_3_CONTENT]
TODO(SECTION_3_CONTENT): No additional content specified.

## Governance

- This constitution supersedes all other practices.
- Amendments require documentation, approval, and a migration plan.
- All PRs/reviews must verify compliance with the constitution.
- All task, issue, user story, and epic tracking MUST be in beads; any work not tracked in beads is considered non-compliant and subject to rejection.
- Use README.md for runtime development guidance.

**Version**: 1.1.0 | **Ratified**: TODO(RATIFICATION_DATE): Original ratification date unknown | **Last Amended**: 2024-06-13
