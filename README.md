# Armature

The Claude Code skill that provides framework for good design.

---

## Mission

Armature is a design intelligence layer for Claude Code. It exists to solve a specific problem: Claude is smart enough to design well, but it needs the right knowledge, not over-explained abstractions or prescriptive step-by-step paths that constrain novel thinking.

This skill provides a **design education**, not a recipe book. It teaches Claude to understand key design philosophies about spacing, hierarchy, typography, color, density, and motion — then trusts Claude to synthesize that knowledge into solutions that fit the problem at hand.

**Armature is a first-pass and feedback-round tool.** It operates from precise creative direction and brief-oriented problem solving. The understanding is clear: Claude with Armature builds the bones — the architecture, the spatial logic, the information hierarchy, the component structure. A trained designer comes in after and brings it to life. The skill doesn't replace the designer. It gives the designer a time-saving starting point and researched position worth refining rather than rebuilding.

The name comes from sculpture and architecture: an armature is the internal skeleton — the wire framework you never see but without which nothing stands. That's what this skill is. The invisible framework behind design decisions.

---

## Principles of Good Design

These principles orient every decision Armature informs. They draw from Dieter Rams' 10 Principles of Good Design and extend them into the specific context of interface work.

### Rams' Foundation

1. **Good design is innovative.** Not novelty for its own sake — innovation in service of the problem.
2. **Good design makes a product useful.** The interface is a machine for using the product. Nothing more.
3. **Good design is aesthetic.** Quality of execution affects the quality of experience.
4. **Good design makes a product understandable.** The structure should explain itself.
5. **Good design is unobtrusive.** The best interfaces disappear. The user sees the content, not the chrome.
6. **Good design is honest.** No dark patterns. No deceptive affordances. The interface does what it appears to do.
7. **Good design is long-lasting.** Trends fade. Clear structure endures.
8. **Good design is thorough down to the last detail.** Precision in spacing, alignment, and hierarchy signals care.
9. **Good design is environmentally friendly.** In digital terms: performant, lightweight, respectful of resources.
10. **Good design is as little design as possible.** Subtract until it breaks. Then add back exactly one thing.

### Extending Rams for Interface, Web, and Slide Work

These principles build on Rams' foundation and address the specific challenges of designing digital interfaces:

- **Good design solves the problem.** Not a hypothetical problem. Not an adjacent problem. The actual problem as seen from strong qual research. Start there.
- **Good design is a system.** Consistency isn't decoration — it's how users build mental models. Tokens, scales, patterns, and constraints create coherence.
- **Good design is an architecture.** Before pixels, there is structure. Information hierarchy, spatial logic, and component relationships are the load-bearing walls.
- **Good design is an atmosphere.** The sum of spacing, color, type, and motion creates a feeling. That feeling is either intentional or accidental. Make it intentional.
- **Good design is inhabitable.** An interface isn't a painting to look at — it's a space to work in. It should feel comfortable for hours, not just impressive for seconds.
- **Good design works with constraints.** Constraints aren't limitations — they're the material. Screen size, content length, accessibility requirements, and technical boundaries shape better solutions than open fields.
- **Good design is a visual hierarchy.** The eye should know where to look without thinking. If users need labels to find what's important, the hierarchy has failed.
- **Good design is honest.** Say what the interface does. Do what the interface says. No misleading states, no hidden costs, no manufactured urgency.
- **Good design is deeply iterative.** First drafts are hypotheses. The work gets good through cycles of build, see, evaluate, refine. Armature is built for this loop.
- **Good design is as little design as possible.** Every element should justify its existence. If removing something doesn't hurt, it shouldn't be there.

---

## What Armature Provides

### Knowledge

Deep understanding of what makes design work — not as abstract theory, but as practical knowledge that translates to production interfaces.

- **Foundations** — Spacing systems, typographic hierarchy, color theory in practice, information density, containers, motion
- **AI Product Interfaces** — Patterns from Claude, Linear, Figma, Perplexity, Arc, Raycast, v0 — conversational UI, generation flows, command patterns, agent interfaces
- **Scalable Systems** — Token architecture, component composition, design system governance that serves the product rather than constraining it

### Execution

The translation layer between design intent and Figma. This is the hard part — Armature maps every major design concept to its Figma Console MCP equivalent with working code patterns.

- Auto-layout as the layout engine (flexbox thinking in Figma's terms)
- Typography, color, effects, components, variables
- Common patterns: cards, sidebars, dashboards, inputs, navigation
- The build-verify loop: execute, screenshot, analyze, iterate

### Reference

- **Searchable databases** — 50+ styles, color palettes, typography pairings, UX guidelines, chart types (BM25 search engine)
- **Mobbin pipeline** — Ingest Mobbin Pro exports for real-world interface reference
- **Gold standards** — A directory for exceptional design examples that calibrate quality

---

## Architecture

```
.claude/skills/armature/
├── SKILL.md                     # Entry point — philosophy and routing
├── knowledge/
│   ├── foundations.md           # Spacing, type, color, hierarchy, density, motion
│   ├── ai-interfaces.md        # Patterns from the best AI products today
│   ├── scalable-systems.md     # Token architecture, composition, governance
│   └── figma-execution.md      # The bridge: design intent → Figma Console MCP
├── data/                        # Searchable CSV databases
├── scripts/
│   ├── search.py               # BM25 search engine
│   ├── core.py                 # Search engine core
│   ├── design_system.py        # Design system generation
│   └── ingest-mobbin.py        # Mobbin export ingestion pipeline
└── references/
    ├── mobbin/                  # Ingested reference screens
    └── gold-standards/          # Exceptional design examples
```

## Usage

```bash
# Generate a design system recommendation
python3 .claude/skills/armature/scripts/search.py "fintech dashboard" --design-system -p "ProjectName"

# Search specific domains
python3 .claude/skills/armature/scripts/search.py "minimalist dark" --domain style
python3 .claude/skills/armature/scripts/search.py "modern elegant" --domain typography

# Ingest Mobbin exports
python3 .claude/skills/armature/scripts/ingest-mobbin.py ~/Downloads/mobbin-export.zip

# Search ingested references
python3 .claude/skills/armature/scripts/ingest-mobbin.py --search "onboarding flow"
```

## Prerequisites

- Python 3.x (no external dependencies)
- Figma Console MCP (for design execution)
- Figma Desktop with Bridge plugin (for live builds)

## Status

This is a living skill. The knowledge files, data, and execution patterns are designed to grow with the practice — updated as the landscape of what constitutes great design evolves.

---

## Credits

Search engine and CSV databases adapted from [UI UX Pro Max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) by nextlevelbuilder (MIT License). Knowledge layer (both the knowledge layer built into this skill and the layers that're part of the overarching Atelier scaffolding system), Figma execution bridge, Mobbin pipeline linkage, and core design philosophy by clerestory.

## License

MIT
