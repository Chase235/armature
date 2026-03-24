---
name: armature
description: "Design intelligence and bidirectional Figma-Code bridge. Deep knowledge of what makes great design — spacing, typography, color, hierarchy, density, motion — with execution layers for Figma Console MCP builds, Figma-to-Code translation (React, Tailwind, GSAP), and Code-to-Figma reconciliation when production UI drifts from design files. Draws on clerestory-workbench doctrine and domain knowledge as a contextual layer. Activate for any UI/UX design work, Figma builds, design system creation, interface critique, code-to-design sync, or when the user needs design thinking applied to a product problem."
argument-hint: "[design intent, Figma URL, code path, or reconciliation target]"
license: MIT
metadata:
  author: clerestory
  version: "2.0.0"
---

# Armature

The hidden framework that gives form to great design.

Armature is a design intelligence layer and a bidirectional bridge between Figma and code. It provides the knowledge, references, execution patterns, and translation pipelines needed to move design intent in both directions — from Figma to production code, and from drifted production code back into Figma.

It trusts your intelligence to synthesize, adapt, and find novel solutions rather than prescribing rigid workflows.

## What This Skill Provides

**Knowledge** — Deep understanding of what makes design work: spacing systems, typographic hierarchy, color theory in practice, information density, progressive disclosure, and the specific patterns emerging in AI product interfaces.

**Figma Execution** — The translation layer between design intent and Figma Console MCP. How to think in Figma's terms while maintaining design quality. Build, verify, iterate.

**Figma to Code** — Extract design intent from Figma files and produce production-quality React/Tailwind/GSAP code. Not screenshot-to-markup — intent-faithful implementation that produces the kind of code a senior engineer would write.

**Code to Figma** — When production code drifts from Figma (vibe-coding, iterative dev, scope shifts), crawl the codebase, visualize the rendered state, detect drift, and push updates back into Figma so the design file reflects what actually shipped.

**Motion** — Deep GSAP execution knowledge for React: page transitions, scroll-triggered animations, micro-interactions, layout animations, timeline choreography, and the reduced-motion practices that make it production-ready.

**Reference** — Searchable databases of styles, color palettes, typography pairings, UX guidelines, and chart types. A Mobbin ingestion pipeline for studying real-world interfaces. A gold standards directory for calibration.

**Clerestory Context** — Draws on the clerestory-workbench doctrine and domain knowledge layers to ground design decisions in established principles, cultural context, and domain-specific expertise.

## When to Activate

- Any UI/UX design work in Figma
- Building interfaces for AI products
- Creating or extending design systems
- Design critique or review
- Translating Figma designs into React/Tailwind/GSAP code
- Reconciling code drift back into Figma
- Studying or referencing real-world interface patterns
- When the user shares Mobbin exports or reference screenshots
- When motion design or GSAP implementation is needed

## Knowledge

Load these as needed — they're deep reference, not sequential steps.

| File | What It Contains |
|------|-----------------|
| `knowledge/foundations.md` | Spacing, typography, color, hierarchy, density, containers, motion — the fundamentals of great interface design |
| `knowledge/ai-interfaces.md` | Patterns from the best AI products shipping today — conversational UI, generation interfaces, command patterns, streaming, artifacts |
| `knowledge/scalable-systems.md` | Design systems that serve products — token architecture, component composition, multi-brand systems, governance |
| `knowledge/figma-execution.md` | **Figma builds.** Translating design intent into Figma Console MCP calls. Auto-layout, components, variables, the build-verify loop |
| `knowledge/figma-to-code.md` | **Design to code.** Extracting design intent from Figma and producing production React/Tailwind/GSAP. Code Connect integration, token translation, component extraction |
| `knowledge/code-to-figma.md` | **Reconciliation.** Detecting drift between code and Figma, mapping manifests, codebase crawling, pushing code reality back into Figma components and frames |
| `knowledge/motion.md` | **GSAP in React.** Page transitions, scroll-triggered animations, micro-interactions, Flip layout animations, timeline choreography, easing, reduced motion, performance |
| `knowledge/mcp-orchestration.md` | **MCP orchestration.** Routing rules for Official vs Console MCP, composite operations, lifecycle coordination, helper script index, anti-patterns |

### Knowledge Routing

| Task | Load These |
|------|-----------|
| Design a screen in Figma | `foundations` + `figma-execution` + `mcp-orchestration` (+ `ai-interfaces` if AI product) |
| Build a design system in Figma | `scalable-systems` + `figma-execution` + `mcp-orchestration` |
| Convert Figma design to code | `figma-to-code` + `motion` + `mcp-orchestration` |
| Reconcile code drift to Figma | `code-to-figma` + `figma-execution` + `mcp-orchestration` |
| Critique an interface | `foundations` + `ai-interfaces` |
| Add animations to a page | `motion` |
| Full pipeline (design → code → reconcile) | All files as needed, `mcp-orchestration` always loaded |

## Clerestory Context Layer

Armature draws on the clerestory-workbench knowledge system as a contextual layer. This grounds design work in established doctrine, domain expertise, and project-specific constraints.

### Loading Protocol

**Always load (doctrine):**
These files define how to think about design. Load them as the foundation for any design task.

```
clerestory-workbench/doctrine/
  tenPrinciples.md              — The ten principles; governing standard
  coreDesignPhilosophyLayer.md  — Design OS, Rams checklist, quality gates
  coreOutputProtocol.md         — Deliverable format, modes, compression
  antiPatterns.md               — Failure taxonomy; final scan before output
```

**Load by domain (targeted):**
Select the domain that matches the active task medium.

```
clerestory-workbench/02-domains/
  experience-and-product-design/   — Human-AI collaboration, workspace UI, trust, flows
  visual-design/                   — Identity, type hierarchy, grid, color theory
  architecture/                    — Structure, circulation, thresholds, atmosphere
  writing/                         — Craft, voice registers, UX copy
  design-intelligence/             — Current trends, competitive context, tool landscape
```

Within each domain, load in order: `01_` (method) → `02_` (systems) → `03_` (calibration).

Design intelligence is a cross-cutting layer — load alongside any other domain when the work benefits from awareness of current industry thinking.

**Load on request (project/client context):**
When working on a specific client project, pull in the targeted context:

```
clerestory-workbench/01-projects/[client]/
  currentContext.md                           — Standing brand, voice, constraints
  projects/[project]/brief.md                 — Project scope and constraints
  projects/[project]/project-context.md       — Session whiteboard
  projects/[project]/inspiration/             — Design references (extract decisions, not style)
```

Only load these when the user names a client or project, or when the work is clearly scoped to a specific engagement.

### When to Load What

| Scenario | Doctrine | Domain | Project/Client |
|----------|----------|--------|---------------|
| General design work | Yes | By task medium | No |
| Client project work | Yes | By task medium | Yes — named project |
| Design critique | Yes | Match to medium | If critiquing client work |
| Code-to-Figma reconciliation | Yes (quality gates) | Product design | If client project |
| Figma-to-code translation | Yes (quality gates) | Product design | If client project |
| Design system creation | Yes | Visual + product | If for a client |

## Search Engine

Query the reference databases for specific design intelligence:

```bash
python3 skills/armature/scripts/search.py "<query>" --design-system -p "Project Name"
python3 skills/armature/scripts/search.py "<query>" --domain <domain>
```

Domains: `product`, `style`, `typography`, `color`, `landing`, `chart`, `ux`

## Reference Library

### Mobbin Pipeline

Ingest Mobbin Pro exports for deep reference analysis:

```bash
python3 skills/armature/scripts/ingest-mobbin.py <path-to-mobbin-zip> [--output references/mobbin/]
```

Creates a searchable index of screens, patterns, and metadata from real-world apps.

### Gold Standards

`references/gold-standards/` — Drop screenshots, exports, or annotated examples of exceptional design here. These serve as calibration for quality, not as templates to copy.

## Mapping Manifest

For bidirectional Figma-Code sync, maintain a mapping manifest at the project root:

`armature-manifest.json` — Links Figma nodes to codebase files. See `knowledge/code-to-figma.md` for the full manifest format and workflows.

## Design Gate

Every design decision passes through these principles. They are the orienting filter — if a choice doesn't serve at least one of these, question it.

### Rams' Foundation

Dieter Rams' 10 Principles of Good Design are the bedrock:

1. Good design is **innovative** — in service of the problem, not novelty for its own sake.
2. Good design makes a product **useful** — the interface is a machine for using the product.
3. Good design is **aesthetic** — quality of execution affects quality of experience.
4. Good design makes a product **understandable** — the structure explains itself.
5. Good design is **unobtrusive** — the user sees content, not chrome.
6. Good design is **honest** — no dark patterns, no deceptive affordances.
7. Good design is **long-lasting** — trends fade, clear structure endures.
8. Good design is **thorough down to the last detail** — precision signals care.
9. Good design is **environmentally friendly** — performant, lightweight, respectful of resources.
10. Good design is **as little design as possible** — subtract until it breaks, then add back one thing.

### Extending Rams for Interface Work

- **Good design solves the problem.** The actual problem. Not a hypothetical one.
- **Good design is a system.** Tokens, scales, patterns, and constraints create coherence.
- **Good design is an architecture.** Information hierarchy and spatial logic are the load-bearing walls.
- **Good design is an atmosphere.** Spacing, color, type, and motion create a feeling. Make it intentional.
- **Good design is inhabitable.** Comfortable for hours, not just impressive for seconds.
- **Good design works with constraints.** Screen size, content, accessibility, and tech boundaries shape better solutions than open fields.
- **Good design is a visual hierarchy.** The eye knows where to look without thinking.
- **Good design is honest.** Say what it does. Do what it says.
- **Good design is deeply iterative.** First drafts are hypotheses. Build, see, evaluate, refine.
- **Good design is as little design as possible.** If removing it doesn't hurt, it shouldn't be there.
