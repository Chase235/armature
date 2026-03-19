---
name: armature
description: "Design intelligence for crafting production-grade interfaces in Figma. Deep knowledge of what makes great design — spacing, typography, color, hierarchy, density, motion — and how to execute it through the Figma Console MCP. Specializes in AI product interfaces, scalable design systems, and the translation from design intent to Figma execution. Activate for any UI/UX design work, Figma builds, design system creation, interface critique, or when the user needs design thinking applied to a product problem."
argument-hint: "[design intent or context]"
license: MIT
metadata:
  author: clerestory
  version: "1.0.0"
---

# Armature

The hidden framework that gives form to great design.

Armature is a design intelligence layer — not a recipe book. It provides the knowledge, references, and execution patterns needed to craft interfaces at the level of the best studios shipping today. It trusts your intelligence to synthesize, adapt, and find novel solutions rather than prescribing rigid workflows.

## What This Skill Provides

**Knowledge** — Deep understanding of what makes design work: spacing systems, typographic hierarchy, color theory in practice, information density, progressive disclosure, and the specific patterns emerging in AI product interfaces.

**Execution** — The translation layer between design intent and Figma Console MCP. How to think in Figma's terms while maintaining design quality. The bridge from "this needs generous whitespace with a clear content hierarchy" to the actual `figma_execute` calls that build it.

**Reference** — Searchable databases of styles, color palettes, typography pairings, UX guidelines, and chart types. A Mobbin ingestion pipeline for studying real-world interfaces. A gold standards directory for calibration.

## When to Activate

- Any UI/UX design work in Figma
- Building interfaces for AI products
- Creating or extending design systems
- Design critique or review
- Translating design intent into Figma artifacts
- Studying or referencing real-world interface patterns
- When the user shares Mobbin exports or reference screenshots

## Knowledge

Load these as needed — they're deep reference, not sequential steps.

| File | What It Contains |
|------|-----------------|
| `knowledge/foundations.md` | Spacing, typography, color, hierarchy, density, containers, motion — the fundamentals of great interface design |
| `knowledge/ai-interfaces.md` | Patterns from the best AI products shipping today — conversational UI, generation interfaces, command patterns, streaming, artifacts |
| `knowledge/scalable-systems.md` | Design systems that serve products rather than constraining them — token architecture, component composition, multi-brand systems |
| `knowledge/figma-execution.md` | **The bridge.** Translating design intent into Figma Console MCP calls. Auto-layout, components, variables, the build→verify loop |

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
