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
│   └── motion.md               # GSAP in React: transitions, scroll, micro-interactions
├── data/                        # Searchable CSV databases (BM25 search engine)
│   ├── styles.csv, colors.csv, typography.csv, ux-guidelines.csv
│   ├── charts.csv, products.csv, landing.csv, icons.csv
│   └── ui-reasoning.csv
├── scripts/
│   ├── search.py               # CLI search engine entry point
│   ├── core.py                 # BM25 + regex hybrid search
│   ├── design_system.py        # Design system generation
│   └── ingest-mobbin.py        # Mobbin Pro export ingestion pipeline
└── references/
    ├── mobbin/                  # Ingested Mobbin exports (searchable index)
    └── gold-standards/          # Drop exceptional design examples here
```

## Workflows

### Design in Figma
Load `foundations` + `figma-execution`. Use Figma Console MCP to build. Follow the build-verify loop.

### Figma to Code
Load `figma-to-code` + `motion`. Extract design intent via Figma MCP `get_design_context`, translate to React/Tailwind/GSAP. Establish Code Connect mappings.

### Code to Figma (Reconciliation)
Load `code-to-figma` + `figma-execution`. Manually invoked. Crawl codebase or receive screenshots of rendered UI. Compare against Figma source. Report drift. Update Figma components and frames after user confirms. Maintain `armature-manifest.json` for mappings.

### Clerestory Context
Always loads doctrine (tenPrinciples, coreDesignPhilosophyLayer, coreOutputProtocol, antiPatterns). Loads domain files targeted to the task medium. Loads project/client context only when a specific engagement is named.

Path: `../../clerestory-workbench/` (relative to workshop/builds/armature)

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
