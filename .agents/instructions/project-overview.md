---
name: project-overview
description: >
  Overview of strapi-plugin-json-schema-validation: features, status, usage, and implementation notes.
version: 1.0.0
author: GitHub Copilot
tags: [overview, strapi, json-schema, project]
---

# Project Overview: strapi-plugin-json-schema-validation

## Current Feature Status

### Editor & Usability

- Monaco Editor with type hints for JSON Schema (**done**)
  - Base JSON Schema version: Draft 2020-12 (**done**)
  - Validate or Beautify button with AJV against user defined field JSON Schema (**done**)

### Basic Options

- Plain JSON Schema Input (**done**)
- Theme selector (**done**)

### Advanced Options

- Schema URL: allow users to provide a URL to fetch the JSON Schema from, in addition to the plain JSON Schema input (**not done**)
- Validate on save - server side: validate the content of the field against the defined JSON Schema when saving the entry, and display validation errors in the UI (**not done**)

### DX

- Expose plugin validation services (**not done**)

### UI

- Theme to match Strapi design system colors (**not done**)

## Implementation Notes

- User-facing features (Monaco editor, type hints, theme selector, validation button) are implemented.
- Advanced options and deeper Strapi integration (schema URL, server-side validation, DX improvements, Strapi design system theme) are planned but not yet implemented.

## How to Use

- Install the plugin and follow the setup instructions in the plugin README.
- Use the custom field in Strapi content types to define and validate JSON Schema.

---

_Last updated: May 23, 2026_
