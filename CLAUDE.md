# Armature — Design Intelligence + Figma-Code Bridge

The hidden framework that gives form to great design. A design education, not a recipe book — plus the bidirectional bridge between Figma and production code.

## What This Is

Armature is a Claude Code skill with two core capabilities:

1. **Design intelligence** — Deep knowledge of spacing, typography, color, hierarchy, density, and motion, with execution patterns for Figma Console MCP builds and AI product interfaces.

2. **Bidirectional Figma-Code bridge** — Translate Figma designs into production React/Tailwind/GSAP code, and reconcile production code that has drifted back into Figma. Maintains explicit mappings between Figma nodes and codebase files.

Draws on clerestory-workbench doctrine and domain knowledge as a contextual layer.

## Architecture

```
.claude/skills/armature/
├── SKILL.md                     # Entry point — philosophy, routing, clerestory loading protocol
├── knowledge/
│   ├── foundations.md           # Spacing, type, color, hierarchy, density, containers
│   ├── ai-interfaces.md        # Patterns from the best AI products shipping today
│   ├── scalable-systems.md     # Token architecture, component composition, governance
│   ├── figma-execution.md      # Design intent → Figma Console MCP calls
│   ├── figma-to-code.md        # Figma → React/Tailwind/GSAP production code
│   ├── code-to-figma.md        # Code drift → Figma reconciliation pipeline
│   ├── motion.md               # GSAP in React: transitions, scroll, micro-interactions
│   ├── mcp-orchestration.md    # MCP routing, composite operations, lifecycle
│   ├── reflection-protocol.md  # Build-verify reflection log (JSONL, append-only)
│   ├── design-goal-protocol.md # Verifiable acceptance criteria before building
│   ├── coach-protocol.md       # End-of-session knowledge self-improvement
│   ├── quality-scoring-protocol.md  # Composite 7-dimension design evaluation
│   └── tree-search-protocol.md      # Branching design exploration (3-5 directions)
├── data/                        # Searchable CSV databases (BM25 search engine)
│   ├── styles.csv, colors.csv, typography.csv, ux-guidelines.csv
│   ├── charts.csv, products.csv, landing.csv, icons.csv
│   └── ui-reasoning.csv
├── scripts/
│   ├── search.py               # CLI search engine entry point
│   ├── core.py                 # BM25 + regex hybrid search
│   ├── design_system.py        # Design system generation
│   ├── ingest-mobbin.py        # Mobbin Pro export ingestion pipeline
│   └── figma-helpers/          # Reusable figma_execute JS patterns
│       ├── ds-inventory.js     # Design system inventory (tokens, components, styles)
│       ├── build-verified.js   # Build + structural description for verification
│       ├── token-bind.js       # Find and bind variables to node properties
│       ├── component-place.js  # Search, instantiate, override, position
│       ├── drift-compare.js    # Normalize node tree for reconciliation diffs
│       └── layout-audit.js    # Measurable design quality extraction (spacing, contrast, targets)
└── references/
    ├── mobbin/                  # Ingested Mobbin exports (searchable index)
    └── gold-standards/          # Drop exceptional design examples here
```

## Workflows

### Design in Figma
Load `foundations` + `figma-execution` + `mcp-orchestration` + `tree-search-protocol` + `quality-scoring-protocol` + `reflection-protocol` + `design-goal-protocol`. For new screens, start with tree search (3-5 branch exploration). Score branches with quality scoring. Promote best to full fidelity. Always inventory existing tokens and components first (ds-inventory.js helper). Follow the build-verify-reflect loop. Write a DESIGN-GOAL for non-trivial builds.

### Figma to Code
Load `figma-to-code` + `motion` + `mcp-orchestration`. Official MCP reads (get_design_context, Code Connect, variables). Console MCP supplements with deep reads when needed. Translate to React/Tailwind/GSAP. Register Code Connect mappings.

### Code to Figma (Reconciliation)
Load `code-to-figma` + `figma-execution` + `mcp-orchestration`. Manually invoked. Official MCP reads current Figma state. Compare against codebase (drift-compare.js helper). Report drift. Console MCP executes confirmed updates. Update manifest and Code Connect.

### MCP Orchestration
Load `mcp-orchestration` for any Figma work. Routes reads to Official MCP, writes to Console MCP. Composes multi-step operations. Helper scripts in `scripts/figma-helpers/` provide reusable `figma_execute` patterns.

### Clerestory Context
Always loads doctrine (tenPrinciples, coreDesignPhilosophyLayer, coreOutputProtocol, antiPatterns). Loads domain files targeted to the task medium. Loads project/client context only when a specific engagement is named.

Path: `../../clerestory-workbench/` (relative to workshop/builds/armature)

### Self-Improvement Loop
Armature accumulates design intelligence across sessions through three protocols:

1. **Tree Search** (explore first) — For new screens, branch into 3-5 fundamentally different spatial strategies. Build lightweight skeletons, score all branches, promote the best 1-2 to full fidelity. Breadth before depth. See `knowledge/tree-search-protocol.md`.

2. **Quality Scoring** (evaluate) — Composite 0-100 score across 7 dimensions: spacing consistency and accessibility (measurable via `layout-audit.js`), hierarchy clarity, visual balance, information density, brand alignment, and innovation (vision-evaluated). Enables tree search pruning and iteration tracking. See `knowledge/quality-scoring-protocol.md`.

3. **DESIGN-GOAL** (before building) — Write verifiable acceptance criteria in `design-goals/[task].md`. Gives the verify step concrete targets instead of vibes.

4. **Reflection Log** (during building) — After each verify screenshot that reveals issues, append a structured diagnosis to `armature-reflections.jsonl`. Read the last 10 entries before each build step. Prevents repeating mistakes.

5. **Coach Phase** (after building) — At session end, review reflections and DESIGN-GOAL notes. Propose updates to knowledge files. Nothing changes without explicit approval.

```
DESIGN-GOAL → Tree Search → Score → Select → Build → Verify → Reflect → Coach
     ↑              │                                                      |
     │         [3-5 branches                                               |
     │          scored and                                                  |
     │          pruned]                                                     |
     └──────────────── next session starts with better knowledge ──────────┘
```

## Search

```bash
# Design system generation
python3 .claude/skills/armature/scripts/search.py "<query>" --design-system -p "Project Name"

# Domain search
python3 .claude/skills/armature/scripts/search.py "<query>" --domain <domain>
```

Domains: `product`, `style`, `typography`, `color`, `landing`, `chart`, `ux`

## Mobbin Pipeline

```bash
# Ingest a Mobbin Pro ZIP export
python3 .claude/skills/armature/scripts/ingest-mobbin.py <path-to-zip>

# Ingest a directory of screenshots
python3 .claude/skills/armature/scripts/ingest-mobbin.py <directory>

# Search the index
python3 .claude/skills/armature/scripts/ingest-mobbin.py --search "onboarding"

# List indexed apps
python3 .claude/skills/armature/scripts/ingest-mobbin.py --list
```

## Prerequisites

- Python 3.x (no external dependencies)
- Figma Console MCP (for Figma execution)
- Figma Desktop with Bridge plugin (for live builds)
- Figma MCP (for design context extraction and Code Connect)
- Access to clerestory-workbench (for doctrine/domain context)

## Tech Stack (Code Output)

- React 19, TypeScript
- Tailwind CSS
- GSAP (with ScrollTrigger, Flip, useGSAP)
- Semantic HTML, WCAG AA accessibility

## Git Workflow

Branch-based. Never push directly to main.
