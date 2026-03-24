# MCP Orchestration — Composing the Figma Bridge

Two MCP servers are available for Figma work. They have different strengths and they complement each other. This file describes when to use which, how to compose them into multi-step operations, and how to chain the full design lifecycle together.

---

## Two Instruments, One Score

**Official Figma MCP** (`claude.ai Figma` / `mcp.figma.com`)

The analyst. Cloud-based, REST API. Strong at reading designs and extracting structured context. `get_design_context` returns a code scaffold, Code Connect mappings, design annotations, and token references in one call. `get_variable_defs` gives you the full token structure. Code Connect tools (`get_code_connect_map`, `add_code_connect_map`) link Figma components to codebase components. Works without Figma Desktop open.

Cannot make granular edits to the canvas. `use_figma` writes whole frames from rendered HTML, not surgical property changes. No arbitrary JS execution. No live canvas state.

**Figma Console MCP** (`figma-console` / Southleft)

The builder. Plugin API via WebSocket bridge to Figma Desktop. `figma_execute` runs arbitrary Plugin API JavaScript with full read/write access to every node, property, variable, and component in the file. Convenience tools for common operations. Live screenshots for visual verification. Design system auditing and linting.

Requires Figma Desktop open with the Bridge plugin. Node IDs are session-scoped (re-search components at the start of each session). No Code Connect.

**The typical flow uses both.** Official reads the design (context, tokens, Code Connect). Console builds and modifies (execute, verify, iterate). Most meaningful operations cross the boundary between them.

---

## Routing

**Reading a design for code translation?**
Start with Official. `get_design_context` gives you the code scaffold, Code Connect, tokens, and annotations in one structured call. `get_screenshot` for visual reference. If you need deeper structural data (auto-layout nesting details, exact property values the scaffold abstracted away), supplement with Console (`figma_execute` to walk the node tree, or `figma_get_file_data`).

**Building or modifying anything on canvas?**
Console. `figma_execute` for anything non-trivial. Convenience tools (`figma_set_fills`, `figma_set_text`) only for single-property tweaks on a known node ID. Never use Official's `use_figma` when Console is available and Figma Desktop is open.

**Working with tokens and variables?**
Console for creation and mutation (`figma_setup_design_tokens`, `figma_batch_create_variables`, `figma_batch_update_variables`). Official for reading token definitions as structured output (`get_variable_defs`). The read/write split follows the analyst/builder pattern.

**Working with components?**
Console for search, instantiation, and property overrides (`figma_search_components`, `figma_instantiate_component`, `figma_set_instance_properties`). Official for Code Connect mappings (`get_code_connect_map`, `add_code_connect_map`). Always re-search components at the start of each session because node IDs are ephemeral.

**Visual verification?**
Console. `figma_capture_screenshot` or `figma_take_screenshot` gives you the live canvas state, which is what you need for the build-verify loop. Official's `get_screenshot` is cloud-rendered and useful for reading designs, but it doesn't reflect changes you just made through Console.

**Design system auditing?**
Console exclusively. `figma_audit_design_system`, `figma_lint_design`, `figma_get_design_system_summary`. Official has no equivalent.

**FigJam?**
Either. Official for diagram generation from Mermaid syntax (`generate_diagram`). Console for granular FigJam operations (stickies, connectors, tables, auto-arrange).

**No Figma Desktop open?**
Official only. Console requires the Bridge plugin running in the desktop app.

---

## Composite Operations

These describe multi-step sequences as coherent operations. They are not rigid scripts. Adapt the sequence to the situation, skip steps that don't apply, and add steps when needed.

### Design-System-Aware Build

Build a UI element using the project's existing tokens and components instead of hardcoded values. This is the default for every build operation.

```
1. INVENTORY
   figma_get_design_system_summary (Console)
   — Or run the ds-inventory.js helper for deeper detail
   — Know what tokens, components, and styles already exist

2. SEARCH
   figma_search_components (Console)
   — Does a component for this already exist? If yes, instantiate it.
   — Don't rebuild what's already there.

3. BUILD
   figma_execute (Console)
   — Create the element with proper auto-layout, sizing, and structure
   — Bind to existing variables: use setBoundVariable() for spacing/radius,
     setBoundVariableForPaint() for colors
   — Reference token-bind.js helper for the binding pattern

4. VERIFY
   figma_capture_screenshot (Console)
   — Confirm visual output matches intent
   — Check: spacing consistent? Colors from tokens? Type scale correct?
   — Iterate if needed (max 3 passes before reassessing approach)
```

The inventory step is what makes this different from naive building. Without it, the AI defaults to hardcoding `#3B82F6` when `color/primary/500` already exists as a variable, or creating a new card frame when a Card component is already in the library.

### Extract and Translate (Figma to Code)

Read a Figma design and produce production React/Tailwind/GSAP code.

```
1. CONTEXT
   get_design_context (Official)
   — Code scaffold, Code Connect mappings, annotations, token references

2. SCREENSHOT
   get_screenshot (Official)
   — Visual reference for intent verification during translation

3. TOKENS
   get_variable_defs (Official)
   — Full variable structure for Tailwind theme mapping

4. CODE CONNECT
   get_code_connect_map (Official)
   — If components already have code mappings, use the mapped component directly
   — Don't recreate what's already connected

5. DEEP READ (when needed)
   figma_execute (Console)
   — Walk specific nodes for auto-layout nesting, exact property values,
     or structural details the Official MCP abstracted away

6. TRANSLATE
   — No MCP. Pure code generation.
   — Apply figma-to-code.md knowledge for React/Tailwind patterns
   — Apply motion.md knowledge for GSAP animation encoding
   — Apply clerestory doctrine as quality filter

7. MAP
   add_code_connect_map (Official)
   — Register new component-to-code mappings for future extractions
   — This closes the loop: next time this component is read, Code Connect
     will point to the actual implementation
```

### Reconcile Code to Figma

Detect drift between shipped code and Figma. Update Figma to match production reality. Manually invoked.

```
1. READ FIGMA
   get_design_context + get_screenshot (Official)
   — Current Figma state: structure, tokens, visual appearance

2. READ CODE
   File system reads (no MCP)
   — Parse JSX structure, Tailwind classes, GSAP animations
   — Build a mental model of what the code actually renders

3. COMPARE
   Pure reasoning (no MCP)
   — Produce a drift report: added, removed, changed elements
   — Use drift-compare.js helper if you need to normalize Figma
     node structure for comparison

4. PRESENT
   Drift report to user
   — User confirms which changes to apply
   — Never auto-apply. Reconciliation is a deliberate act.

5. SCREENSHOT BEFORE
   figma_capture_screenshot (Console)
   — Record the canvas state before any changes

6. UPDATE
   figma_execute (Console)
   — Apply confirmed changes
   — Components first, then pages (component updates cascade)
   — Use token-bind.js helper to rebind variables if token names changed

7. VERIFY
   figma_capture_screenshot (Console)
   — Confirm Figma now matches the code's rendered state
   — Iterate if needed

8. SYNC MAPPINGS
   add_code_connect_map (Official)
   — Update any Code Connect mappings that changed

9. UPDATE MANIFEST
   File system write (no MCP)
   — Update armature-manifest.json with new sync timestamps and notes
```

### Component Creation Pipeline

Create a new Figma component that's immediately usable and connected to code.

```
1. CHECK EXISTING
   figma_search_components (Console)
   — No duplicates. If it exists, update it instead.

2. INVENTORY TOKENS
   figma_get_variables (Console)
   — Know what tokens to bind to before building

3. BUILD
   figma_execute (Console)
   — Full component: auto-layout, variants if needed, component properties
   — Bind all fills, spacing, radius to variables (never hardcode)
   — Use token-bind.js helper for clean binding

4. VERIFY
   figma_capture_screenshot (Console)
   — Visual check across all variants/states

5. DOCUMENT
   figma_set_description (Console)
   — Add usage notes to the component description

6. CONNECT
   add_code_connect_map (Official)
   — Link to the React component that implements (or will implement) it
```

### Token System Bootstrap

Create a design token system in Figma from a Tailwind config, design spec, or from scratch.

```
1. READ EXISTING
   get_variable_defs (Official)
   — Don't overwrite what's already there

2. PRIMITIVES
   figma_setup_design_tokens (Console)
   — Atomic creation: collection + modes + all primitive tokens in one call
   — Use batch tools for large token sets

3. SEMANTICS
   figma_setup_design_tokens (Console)
   — Semantic layer that aliases primitives (color/bg/page -> neutral/50)

4. VERIFY
   figma_get_variables (Console)
   — Confirm all variables created correctly, modes populated

5. EXPORT RULES
   create_design_system_rules (Official)
   — Generate a rules file for consistent future code generation
```

---

## Helper Scripts

Reusable JavaScript patterns in `scripts/figma-helpers/`. These are not a runtime library. Read the script, adapt variable names and structure to the current context, and pass the adapted version to `figma_execute`.

| Script | What It Does | When to Use |
|--------|-------------|-------------|
| `ds-inventory.js` | Walks the file and returns all variable collections, components, and styles as structured JSON | At the start of any build operation. The "know what you have" step. |
| `build-verified.js` | Build pattern that returns structural description of what was created | When you need to verify a build against a screenshot programmatically |
| `token-bind.js` | Finds variables by semantic name and binds them to node properties | Whenever binding colors, spacing, or radius to tokens. Replaces the 4-step manual sequence. |
| `component-place.js` | Searches for a component, instantiates it, applies overrides, positions it | When placing an existing library component into a frame |
| `drift-compare.js` | Normalizes a node tree into a diffable structure | During reconciliation. Produces a description comparable against code analysis. |

See `scripts/figma-helpers/README.md` for detailed usage.

---

## Lifecycle: Design to Code to Reconcile

The three phases share state through two artifacts:

**`armature-manifest.json`** at the project root. Maps Figma nodes to code files. Created during design, consumed during code translation, updated during reconciliation. See `code-to-figma.md` for the full format.

**Code Connect mappings** stored in Figma via the Official MCP. Created during design or code translation, consumed in both directions. The persistent link between a Figma component and its React implementation.

### Phase Transitions

Design produces Figma components, frames, variables, manifest entries, and Code Connect mappings.

Code translation consumes design context and Code Connect, produces production code, and updates the manifest with code paths and Code Connect with new mappings.

Reconciliation consumes both the code and the Figma file plus the manifest, produces updated Figma, updated manifest timestamps, and updated Code Connect. Loops back to code translation when Figma changes are significant.

### Lifecycle Rules

1. **Update the manifest at phase transitions.** When you finish designing a screen, add its mapping. When you finish coding it, update the code path. When you reconcile, update the timestamp.

2. **Check Code Connect before translating.** If a component already has a mapping, use the mapped component. Don't retranslate what's already connected.

3. **Reconciliation is manual.** The user invokes it. But if you read a Figma file and then read the corresponding code and notice they don't match, mention it.

4. **Components reconcile before pages.** Component updates cascade to every instance. Update the Button component before updating the Dashboard page that uses it. This ordering is not optional.

5. **The build-verify loop applies at every phase.** During design: screenshot, build, screenshot, compare. During reconciliation: screenshot before, update, screenshot after. During code translation: the "verify" is running the dev server.

---

## Anti-Patterns

**Don't use Official MCP for canvas writes when Console is available.**
Official's `use_figma` captures rendered HTML as flat layers. Console's `figma_execute` creates proper auto-layout frames, components, and variable bindings. If Figma Desktop is open, use Console.

**Don't hardcode values when tokens exist.**
Always run the inventory step. If `color/primary/500` exists as a variable, bind to it. Don't write `fills = [{ type: 'SOLID', color: { r: 0.23, g: 0.51, b: 0.93 } }]` when you could bind.

**Don't build components without checking the library first.**
`figma_search_components` before `figma.createComponent()`. Every time. Building a duplicate is worse than wasting a tool call on a search.

**Don't skip the verify screenshot.**
"The code looks right" is not verification. The build-verify loop exists because auto-layout behavior is not always intuitive and properties can fail silently. Screenshot after every meaningful change.

**Don't reconcile mid-sprint.**
Wait until a feature stabilizes. Reconciling while code is in active flux creates churn and outdated Figma states.

**Don't assume node IDs persist across sessions.**
Console's node IDs are session-scoped. Re-search components at the start of every session. Never hardcode a node ID from a previous conversation.

**Don't skip the manifest update.**
The manifest is what makes the lifecycle work as a continuous pipeline. If you design a screen and don't record the mapping, the reconciliation phase has nothing to compare against.
