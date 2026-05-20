# {} strapi-plugin-json-schema-validation

Provide JSON Schema validation custom field and utilities

## Overview
This plugin provides a custom field for JSON Schema validation in Strapi.
It allows you to define a JSON Schema for a field and validates the content of that field against the defined schema.

Powered by [Monaco Editor](https://www.npmjs.com/package/@monaco-editor/react) and [AJV](https://www.npmjs.com/package/ajv), the plugin provides a user-friendly interface for defining JSON Schemas and validating JSON data.

## Installation

```bash
npm install strapi-plugin-json-schema-validation
```

## Set up
This plugin require whitelisting **strapi::security** as for *script-src* and *worker-src* as follows:

```ts
// <your-strapi-project>/config/middlewares.ts
import type { Core } from '@strapi/strapi';

const config: Core.Config.Middlewares = [
  'strapi::logger',
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'script-src': [
            'cdn.jsdelivr.net', // Allow monaco editor from jsdelivr CDN
          ],
          'worker-src': ["'self'", 'blob:'], // Allow workers from the same origin and eval for Web Workers for monaco editor
        },
      },
    },
  },
  'strapi::cors',
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];

export default config;
```

## Screenshots
### Options in content type builder
![JSON Schema validation field in content type builder](https://raw.githubusercontent.com/phuhh98/strapi-plugin-json-schema-validation/main/screenshots/content-type-edit.png)

### Editing monaco editor
![Monaco editor for JSON Schema validation field](https://raw.githubusercontent.com/phuhh98/strapi-plugin-json-schema-validation/main/screenshots/record-editing.png)

### Validation error display
![Validation error display in monaco editor](https://raw.githubusercontent.com/phuhh98/strapi-plugin-json-schema-validation/main/screenshots/validation-error.png)



## What's next!

### Editor & Usability
- [x] **Monaco Editor** with type hints for JSON Schema
  - [x] Base JSON Schema version: Draft 2020-12
  - [x] Validate or Beautify button with AJV against user defined field JSON Schema

### Basic Options
- [x] **Plain JSON Schema Input**
- [x] **Theme selector**

### Advanced Options
- [ ] **Schema URL**: allow users to provide a URL to fetch the JSON Schema from, in addition to the plain JSON Schema input


- [ ] **Validate on save - server side**: validate the content of the field against the defined JSON Schema when saving the entry, and display validation errors in the UI

### DX
- [ ] Expose plugin validation services

### UI
- [ ] Theme to match Strapi design system colors

-----
Buy me a coffee <img src="https://raw.githubusercontent.com/phuhh98/strapi-plugin-json-schema-validation/main/screenshots/coffee.png" alt="Buy me a coffee" width="20">

[<img src="https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif" alt="Donate with PayPal" width="100">](https://paypal.me/phuhh98)

