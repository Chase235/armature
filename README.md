# Armature

A design intelligence skill for Claude Code that explores, evaluates, learns, and bridges the gap between Figma and production code.

## Mission

The problem with AI-assisted design isn't intelligence. Claude is smart enough to design well. The problem is that it goes linear: one direction, iterate, hope for the best. Good design rarely goes down like that. Design is all about iteration. Armature brings that instinct to AI by treating design exploration as a search problem, not a linear generation.

When you start a new screen, Armature branches into multiple spatial strategies in Figma, scores each across measurable and vision-evaluated quality dimensions, and surfaces a Pareto frontier of candidates for you to choose from. You're picking from explored territory, not betting on a first instinct. The system always includes a wild card branch that breaks a convention, because design simply has to get weird sometimes.

Every session feeds back into the system. A reflection log captures what worked and what didn't, grounded in design principles rather than vibes. A composite scoring system (spacing consistency, hierarchy clarity, visual balance, accessibility, brand alignment, information density, innovation) tracks quality across iterations and gives the tree search something to prune against, and at the end of significant sessions, a critique/postmortem phase reviews what was learned and proposes targeted updates to Armature's own knowledge files, subject to your approval. The skill gets smarter with use. After fifty sessions it's not the same tool it was on day one.

Underneath all of that is a deep design education (spacing systems, typographic hierarchy, color theory, density, motion) and a bidirectional Figma-code bridge. Figma files and codebases stop agreeing with each other almost immediately. You vibe-code a few sessions, scope shifts, and the shipped product looks nothing like the design file. Armature closes that gap in both directions. Push designs into production-quality React and Tailwind. Pull drifted code back into Figma so the file reflects what actually shipped.

This is also a first-pass and feedback-round tool. It operates from precise creative direction and brief-oriented problem solving. Armature can help Claude Code and Cowork craft the architecture, the spatial logic, the information hierarchy, the component structure. A skilled designer comes in after and brings it to life. This system gives the designer a researched starting point worth refining rather than something they need to rebuild from scratch.

The name comes from sculpture and architecture. An armature is the internal skeleton, the wire framework you never see but without which nothing stands. The invisible framework behind design decisions.

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

### Design Tree Search

Don't start with one layout and iterate. Start with 3-5 fundamentally different spatial strategies — centered composition vs. asymmetric vs. content-forward vs. dense sidebar vs. a wild card that breaks a convention. Each branch gets built as a lightweight skeleton in Figma, scored across 7 quality dimensions, and the best 1-2 advance to full fidelity. AIDE showed tree-search wins 4x more than linear approaches. The same principle applies to design: the first direction you pick determines the ceiling. Tree search raises it.

### Quality Scoring

A composite 0-100 design evaluation system combining measurable dimensions (spacing system compliance, WCAG contrast ratios, hit target sizes — extracted via Figma node inspection) with vision-evaluated dimensions (hierarchy clarity, visual balance, information density, brand alignment, innovation — assessed via Claude vision on screenshots). Enables tree search pruning, iteration tracking, cross-project calibration, and structured design critique. Weights are adjustable per project type. Inspired by autovoiceevals' approach to scoring subjective quality.

### Figma Execution

The translation layer between design intent and Figma. Maps every major design concept to its Figma Console MCP equivalent with working code patterns.

- Auto-layout as the layout engine (flexbox thinking in Figma's terms)
- Typography, color, effects, components, variables
- Common patterns: cards, sidebars, dashboards, inputs, navigation
- The build-verify loop: execute, screenshot, analyze, iterate

### Figma to Code

Extract design intent from Figma files and produce production-quality code. Not screenshot-to-markup — intent-faithful implementation.

- Design context extraction via Figma MCP (`get_design_context`, `get_screenshot`)
- Decision inventory: layout, spacing, typography, color, components, motion intent
- Translation to **React, Tailwind CSS, GSAP** — the kind of code a senior engineer writes
- Code Connect integration for component mapping between Figma and codebase
- Token translation: Figma variables to Tailwind theme + CSS custom properties

### Code to Figma

When production UI drifts from Figma, reconcile backward. Manually invoked.

- **Targeted reconciliation** — Point at a specific screen that drifted, get a drift report, confirm, and update Figma
- **Codebase crawl** — Point at a codebase directory, walk routes and components, map against Figma frames, and batch-reconcile
- **Mapping manifest** (`armature-manifest.json`) — Explicit links between Figma nodes and code paths, maintained across syncs
- Component and frame updates via `figma_execute` — properties, added/removed elements, full rebuilds when drift is extensive

### Motion (GSAP)

Deep execution reference for animation in React with GSAP.

- **Page transitions** — Route-level enter/exit, cross-fade, staggered content reveals
- **Scroll-triggered animations** — Reveal on scroll, scroll-linked progress, parallax, pin-and-sequence
- **Micro-interactions** — Hover effects, button press feedback, expand/collapse, number counters
- **Layout animations** — Flip plugin for filtering, sorting, expanding, reparenting
- **Timeline choreography** — Sequencing, position parameters, labels, stagger
- **Reduced motion** — `prefers-reduced-motion` compliance (non-negotiable)

### Self-Improvement Loop

Armature doesn't just execute design — it learns from what it builds. Three protocols, inspired by the autonomous research agent ecosystem ([awesome-autoresearch](https://github.com/alvinunreal/awesome-autoresearch)), extend the build-verify loop into a system that accumulates design intelligence across sessions.

```
DESIGN-GOAL → Build → Verify → Reflect → [iterate] → Coach → Knowledge Update
     ↑                                                              |
     └──────────── next session starts with better knowledge ───────┘
```

**Reflection Log** — The centerpiece of the loop, adapted from [GEPA](https://github.com/gepa-ai/gepa)'s Actionable Side Information (ASI). GEPA's key insight is that reading full execution traces — not just pass/fail — produces 35x more efficient improvements than reinforcement learning. In autoresearch, the trace is an error log. In Armature, the trace is a *design critique*. After each verify screenshot where something needs adjustment, a structured JSONL entry captures what was wrong, why it was wrong (grounded in design principles), and what fixed it. Before each build step, the last 10 entries are read. This prevents repeating the same spacing mistake across frames, remembers patterns that worked in earlier iterations, and builds project-specific institutional memory. Over time, recurring patterns in the log signal knowledge gaps that trigger the Coach phase.

**DESIGN-GOAL** — Adapted from [goal-md](https://github.com/jmilinovich/goal-md)'s principle that agents must construct a measurable definition of success before optimizing. For code, that's a fitness function. For design, it's a set of verifiable acceptance criteria — dimensional (spacing, sizing), relational (hierarchy, visual weight), systemic (token compliance), and accessible (contrast, hit targets). Written before non-trivial builds, these give the verify step concrete targets instead of vibes.

**Coach Phase** — Adapted from [autocontext](https://github.com/greyhaven-ai/autocontext)'s multi-role architecture, which separates doing from learning-about-doing. At the end of significant sessions, the Coach reviews reflection entries and DESIGN-GOAL notes, then proposes targeted updates to Armature's own knowledge files. A new spacing pattern discovered during a Coraa build might become a permanent addition to `foundations.md`. A novel AI chat interaction might update `ai-interfaces.md`. Nothing changes without explicit human approval — the designer curates what persists.

### MCP Orchestration

Armature composes two Figma MCP servers into coherent workflows. The Official Figma MCP reads designs (structured context, Code Connect, token definitions). The Figma Console MCP builds and modifies (arbitrary Plugin API execution, visual verification, design system management). The orchestration layer routes operations to the right server and chains multi-step sequences into single logical operations.

- **MCP routing** — Clear rules for when to use which server, when to compose both
- **Design-system-aware builds** — Always inventory existing tokens and components before creating anything. Bind to variables, instantiate from libraries.
- **Composite operations** — Design-system-aware build, extract-and-translate, reconcile, component creation, token bootstrap
- **Helper scripts** — Reusable `figma_execute` JavaScript patterns for common multi-step operations (token binding, component placement, drift comparison, design system inventory)
- **Lifecycle coordination** — Design, code, and reconcile as a continuous pipeline sharing state through the mapping manifest and Code Connect

### Reference

- **Searchable databases** — 50+ styles, color palettes, typography pairings, UX guidelines, chart types (BM25 search engine)
- **Mobbin pipeline** — Ingest Mobbin Pro exports for real-world targeted interface reference
- **Gold standards** — A directory for exceptional design examples that calibrate quality

### Clerestory Context Layer

Armature draws on the clerestory-workbench knowledge system for deeper design grounding:

  - Doctrine (always loaded) — Rams' principles, personal design philosophy, output protocol, anti-patterns                                        
  - Domains (targeted by task) — Experience/product design, visual design, architecture, writing, design intelligence
  - Project/client context (on request) — Briefs, constraints, inspiration for specific engagements                                     
  - Design lineage — Rooted in modern architecture and Bauhaus sensibilities. Form follows function, legible tectonics, ornament is earned, structure is 
  Honest and visible in the hierarchy. Clean, minimal, spatially confident.
---

## Architecture

```
.claude/skills/armature/
├── SKILL.md                     # Entry point — philosophy, routing, context loading
├── knowledge/
│   ├── foundations.md           # Spacing, type, color, hierarchy, density, containers
│   ├── ai-interfaces.md        # Patterns from the best AI products today
│   ├── scalable-systems.md     # Token architecture, composition, governance
│   ├── figma-execution.md      # Design intent → Figma Console MCP calls
│   ├── figma-to-code.md        # Figma → React/Tailwind production code
│   ├── code-to-figma.md        # Code drift → Figma reconciliation pipeline
│   ├── motion.md               # GSAP in React: transitions, scroll, micro-interactions
│   ├── mcp-orchestration.md    # MCP routing, composite operations, lifecycle
│   ├── reflection-protocol.md  # GEPA-inspired build-verify reflection log
│   ├── design-goal-protocol.md # Verifiable acceptance criteria before building
│   ├── coach-protocol.md       # End-of-session knowledge self-improvement
│   ├── quality-scoring-protocol.md  # Composite 7-dimension design evaluation
│   └── tree-search-protocol.md      # Branching design exploration
├── data/                        # Searchable CSV databases
├── scripts/
│   ├── search.py               # BM25 search engine
│   ├── core.py                 # Search engine core
│   ├── design_system.py        # Design system generation
│   ├── ingest-mobbin.py        # Mobbin export ingestion pipeline
│   └── figma-helpers/          # Reusable figma_execute JS patterns
│       ├── ds-inventory.js     # Design system inventory
│       ├── build-verified.js   # Build + structural verification
│       ├── token-bind.js       # Variable binding
│       ├── component-place.js  # Component search + instantiation
│       ├── drift-compare.js    # Node tree normalization for diffs
│       └── layout-audit.js    # Measurable design quality extraction
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
- Figma Console MCP (for Figma execution)
- Figma Desktop with Bridge plugin (for live builds)
- Figma MCP (for design context extraction and Code Connect)
- Access to clerestory-workbench (for doctrine/domain context)

## Tech Stack (Code Output)

- React 19, TypeScript
- Tailwind CSS
- GSAP (ScrollTrigger, Flip, useGSAP)
- Semantic HTML, WCAG AA accessibility

## Status

v4.0. This is a living skill. The self-improvement loop means the knowledge files grow with the practice. Each design session can propose updates to the skill's own understanding, curated by the designer. The data, execution patterns, and design intelligence evolve as the landscape of what constitutes great design evolves.

---

## Credits

Search engine and CSV databases adapted from [UI UX Pro Max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) by nextlevelbuilder (MIT License). Knowledge layer (both the knowledge layer built into this skill and the layers that're part of the overarching Atelier scaffolding system), Figma execution bridge, Figma-Code bridge, motion layer, Mobbin pipeline linkage, and core design philosophy by clerestory group, LLC.

## License

MIT
