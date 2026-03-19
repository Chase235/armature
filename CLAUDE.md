# Armature — Design Intelligence Skill

The hidden framework that gives form to great design. A design education, not a recipe book.

## What This Is

Armature is a Claude Code skill for crafting production-grade interfaces in Figma via the Figma Console MCP. It provides deep design knowledge — spacing, typography, color, hierarchy, density — and the execution patterns to translate that knowledge into precise Figma builds.

Specializes in AI product interfaces: conversational UI, generation flows, command patterns, agent interfaces, and the scalable design systems that support them.

## Architecture

```
.claude/skills/armature/
├── SKILL.md                     # Entry point — philosophy and routing
├── knowledge/
│   ├── foundations.md           # Spacing, type, color, hierarchy, density, motion
│   ├── ai-interfaces.md        # Patterns from the best AI products shipping today
│   ├── scalable-systems.md     # Token architecture, component composition, governance
│   └── figma-execution.md      # The bridge: design intent → Figma Console MCP calls
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
- Figma Console MCP (for execution)
- Figma Desktop with Bridge plugin (for live builds)

## Git Workflow

Branch-based. Never push directly to main.
