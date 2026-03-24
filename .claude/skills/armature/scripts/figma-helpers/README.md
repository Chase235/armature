# Figma Helpers

Reusable JavaScript patterns for `figma_execute`. These are not a runtime library. Read the script, adapt variable names and node references to the current context, and pass the adapted version to `figma_execute`.

## Scripts

### ds-inventory.js
Walk the current file and return all variable collections, components, and styles as structured JSON. Run this at the start of any build operation to know what tokens and components already exist before creating anything.

### build-verified.js
Build pattern that returns a structural description of what was created (node IDs, layout properties, child structure). Use the returned description to verify against a subsequent screenshot. Wraps the build step of the build-verify loop.

### token-bind.js
Find variables by semantic name and bind them to node properties in one pass. Handles both color variables (via `setBoundVariableForPaint`) and float variables (via `setBoundVariable`). Replaces the manual 4-step sequence of: get collections, find collection, find variable, bind.

### component-place.js
Search for a component by name, instantiate it, apply property overrides, and position it in a parent frame. Combines 3-4 separate tool calls into one `figma_execute` operation.

### drift-compare.js
Normalize a Figma node tree into a flat, diffable structure. Returns layout mode, spacing, fills as hex, text content, and children recursively. Designed to produce output comparable against a code-derived description during reconciliation.

## Usage Pattern

```
1. Read the relevant helper script
2. Adapt it: replace node IDs, variable names, component queries with current values
3. Pass the adapted code to figma_execute
4. Use the returned data to inform your next step
```

These scripts assume Inter font is available. Adjust font loading calls if the project uses a different typeface.
