# Frontier AI Capabilities Research — Armature v4.0 Proposal

**Date:** 2026-03-24
**Context:** Deep research into the autonomous research agent ecosystem (awesome-autoresearch) and adjacent AI research to identify frontier capabilities that can compound Armature into an exponentially better design intelligence system for a solo/small-group practice.

**Core pain point:** Getting a strong first-pass layout that embodies industry-leading, sometimes industry-defining design. The current workflow is linear — one attempt, iterate, hope. The research below proposes making it branching, evaluative, memory-rich, and self-optimizing.

---

## Research Sources

Primary research drawn from:
- GEPA (gepa-ai/gepa) — Pareto frontier exploration, reflective prompt evolution
- AIDE (WecoAI/aideml) — Tree-search optimization, branching exploration
- AI-Scientist-v2 (SakanaAI) — Best-first tree search, parallel exploration
- Engram (tonitangpotato/autoresearch-engram) — Neuroscience-grounded persistent memory
- Autocontext (greyhaven-ai/autocontext) — Multi-role agents, frontier-to-local distillation
- ClawTeam (HKUDS/ClawTeam) — Swarm intelligence, parallel GPU exploration
- ADAS (ShengranHu/ADAS) — Meta-agent for automated system design
- Autovoiceevals (ArchishmanSengupta) — Composite scoring for subjective quality
- DSPy (dspy.ai) — Modular prompt optimization, GEPA integration
- LayoutGeneration (Microsoft) — AI-driven layout generation research
- autoresearch-mlx / autoresearch-macos — Apple Silicon native execution

---

## Capability 1: Design Tree Search

**Source:** AIDE's tree-search architecture + AI-Scientist-v2's best-first tree search
**Impact:** Highest. Directly addresses the first-pass layout problem.
**Difficulty:** Medium

### The Problem

The current workflow is linear: receive a design brief → build one layout → verify → iterate. This means the first direction you pick determines the ceiling. If the initial approach is wrong, iteration can polish it but can't save it. AIDE showed that tree-search wins 4x more than linear approaches on Kaggle — the same principle applies to design.

### The Approach

Instead of one linear attempt, **branch into 3-5 layout directions in Figma**, each exploring a fundamentally different spatial strategy:

```
Brief + DESIGN-GOAL
     │
     ├── Branch A: Centered composition, generous whitespace, focus on the prompt
     ├── Branch B: Asymmetric layout, sidebar as primary nav surface, dense
     ├── Branch C: Full-bleed immersive, minimal chrome, content-forward
     ├── Branch D: Card-based modular, dashboard-like information density
     └── Branch E: Unconventional — break a convention intentionally
```

Each branch:
1. Gets built as a Figma frame (lightweight — layout skeleton, not full fidelity)
2. Gets screenshotted and evaluated against DESIGN-GOAL criteria
3. Gets a composite quality score (see Capability 3)
4. Top 2 candidates advance to full-fidelity execution
5. Losing branches are archived (not deleted — they're future reference)

### Why This Is Different

- **Breadth before depth.** Explore the solution space before committing. The best designers do this on paper — this does it in Figma at production fidelity.
- **Structured divergence.** Each branch isn't random — it's guided by a different spatial strategy. The variation is architectural, not cosmetic.
- **Pruning with evidence.** You see all 5 directions as screenshots before picking. The decision is visual and informed, not a guess.

### Implementation

- New knowledge file: `knowledge/tree-search-protocol.md`
- Build branches as lightweight Figma frames (auto-layout skeletons, real proportions, placeholder content)
- Screenshot-evaluate each against DESIGN-GOAL criteria
- Present all branches to the designer with scores and trade-off analysis
- Designer picks 1-2 to advance; others archive to `references/explored-directions/`

---

## Capability 2: Cognitive Design Memory (Engram-Inspired)

**Source:** Engram's neuroscience-grounded persistent memory system
**Impact:** High. Compounds over months, not sessions.
**Difficulty:** Medium

### The Problem

The v3.0 reflection log is append-only JSONL — flat, unsorted, unweighted. It captures observations but doesn't learn from them. You can read the last 10 entries, but you can't ask "what spacing approach works best for AI chat interfaces?" and get a frequency-weighted answer.

### The Approach

Replace the flat reflection log with a **cognitive design memory** using four neuroscience-based mechanisms:

1. **ACT-R Activation** — Successful design patterns get higher activation scores. Patterns that work repeatedly float to the top naturally. When starting a new chat interface layout, the system surfaces "sidebar at 260px with 16px body text and base-8 spacing has succeeded 7 times in AI product work."

2. **Hebbian Learning** — Co-occurring successful patterns form associative links. If "dark mode + high-contrast headings + generous whitespace" consistently appear together in successful designs, those three become linked. Activating one surfaces the others.

3. **Ebbinghaus Forgetting** — Failed approaches naturally decay over time. A spacing choice that didn't work 6 months ago fades in relevance rather than cluttering the memory forever. Recent failures remain salient; old ones don't.

4. **Memory Consolidation** — Raw session observations get periodically consolidated into stable, generalized patterns. "In session X, 12px spacing felt cramped between nav items" + "In session Y, 12px spacing felt cramped between sidebar sections" consolidates into "12px is below threshold for spacing between independent navigation elements."

### Why This Is Different

- **Weighted retrieval, not linear scan.** The memory surfaces what's most relevant, not what's most recent.
- **Associative links.** Design decisions don't exist in isolation — this captures which patterns work together.
- **Natural forgetting.** The system doesn't accumulate noise. Failed experiments decay.
- **Zero API cost.** Runs locally, ~90ms retrieval, ~48MB storage (per Engram's production numbers).

### Implementation

- Python module: `scripts/design-memory.py`
- SQLite database: `armature-memory.db` (portable, no dependencies)
- Operations: REMEMBER (after verify), RECALL (before build), CONSOLIDATE (Coach phase), FORGET (automatic decay)
- Replaces flat `armature-reflections.jsonl` with structured, queryable memory
- Hebbian links tracked as co-occurrence counts between pattern tags

---

## Capability 3: Design Quality Scoring

**Source:** Autovoiceevals' composite scoring for subjective quality + GEPA's evaluation mechanism
**Impact:** High. Enables tree search pruning and objective-ish progress tracking.
**Difficulty:** Medium-High

### The Problem

Design quality is subjective — but not entirely. There are measurable dimensions (spacing consistency, contrast ratios, hit targets) and semi-measurable dimensions (hierarchy clarity, visual balance, brand alignment). Right now, the verify step is "look at the screenshot and decide." This works when you're looking at one design, but it breaks down when you need to compare 5 branches or track improvement over iterations.

### The Approach

A **composite design quality score** combining measurable and vision-evaluated dimensions:

```
Quality Score = Σ (weight × dimension_score)

Dimensions:
  0.25 × hierarchy_clarity    — Is there a clear visual hierarchy? (vision-evaluated)
  0.20 × spacing_consistency  — Does spacing follow the system? (measurable from nodes)
  0.15 × visual_balance       — Is the composition balanced? (vision-evaluated)
  0.15 × information_density  — Right amount of content for the viewport? (vision-evaluated)
  0.10 × brand_alignment      — Does it feel like the brand? (vision-evaluated against tokens)
  0.10 × accessibility        — Contrast ratios, hit targets, label presence (measurable)
  0.05 × innovation           — Does it do something unexpected and good? (vision-evaluated)
```

### How Scoring Works

**Measurable dimensions** get scored via Figma node inspection:
- Walk the node tree, check spacing values against the base-8 system
- Calculate contrast ratios for all text-on-background pairs
- Measure hit target sizes
- These produce exact numeric scores

**Vision-evaluated dimensions** get scored via Claude vision on the screenshot:
- Structured prompt: "Rate the hierarchy clarity of this design from 0-10. Cite specific elements."
- Each dimension gets a separate, focused evaluation prompt
- Responses include evidence, not just numbers

**Composite score** is weighted sum, producing a 0-100 score that tracks progress across iterations and enables branch comparison during tree search.

### Why This Is Different

- **Not replacing human judgment** — augmenting it. The score is a structured conversation about quality, not a verdict.
- **Enables tree search pruning** — You can't visually compare 5 branches simultaneously. The score ranks them so you compare 2-3.
- **Tracks progress over time** — "This project's quality scores improved from 62 to 84 across 12 iterations" is actionable data.
- **Calibratable** — Weights are adjustable per project. A data dashboard might weight information density higher; a brand site might weight visual balance higher.

### Implementation

- New knowledge file: `knowledge/quality-scoring-protocol.md`
- Python module: `scripts/design-scorer.py`
- Measurable dimensions: Figma node inspection via `figma_execute`
- Vision dimensions: Claude vision on screenshots with structured prompts
- Scores stored in reflection memory with full dimension breakdowns
- Weights configurable per DESIGN-GOAL file

---

## Capability 4: Local MLX Design Validators

**Source:** Autocontext's frontier-to-local distillation + autoresearch-mlx
**Impact:** Medium-High. Speed and autonomy for routine tasks.
**Difficulty:** High (initial setup), Low (ongoing)

### The Problem

Claude is doing everything — creative generation, spatial reasoning, brand interpretation, AND routine validation (is the spacing consistent? are contrast ratios passing? are all tokens from the palette?). Routine validation consumes context window and latency that should go toward the hard creative work.

### The Approach

Run **small, fast local models on Apple Silicon via MLX** for routine design validation tasks:

1. **Token Compliance Checker** — Given a Figma node tree export, verify all colors, spacing values, font sizes, and border radii come from the defined token set. Instant, local, zero API cost.

2. **Spacing System Validator** — Walk a layout and flag any spacing value that's not in the base-8 system. Report violations with node IDs and current values.

3. **Contrast Ratio Calculator** — For every text node, calculate contrast against its background. Flag WCAG AA failures. Pure computation, no LLM needed.

4. **Component Consistency Auditor** — Compare instances of the same component across a file. Flag property drift (one button is 40px tall, another is 44px).

5. **Layout Symmetry Analyzer** — Detect alignment axes in a layout and flag elements that break them.

### Why This Is Different

- **Instant feedback.** These run in <100ms locally. No API round-trip.
- **Always available.** No rate limits, no token costs, no network dependency.
- **Frees Claude for creative work.** The context window and reasoning capacity go toward spatial strategy, brand interpretation, and design innovation — not counting pixels.
- **Runs as pre-flight checks.** Before Claude even sees the screenshot, the local validators have already caught mechanical issues.

### Implementation

- Python package: `scripts/local-validators/`
- Uses MLX for any ML-based validation (layout symmetry, component similarity)
- Pure Python for deterministic checks (spacing, contrast, token compliance)
- Integrates with build-verify loop as a pre-verify step
- Results feed into the composite quality score (measurable dimensions)
- Runs on any Apple Silicon Mac (M1+)

---

## Capability 5: Prompt Evolution for Design Generation

**Source:** GEPA's reflective prompt evolution + DSPy's modular optimization
**Impact:** Medium-High. The design prompts themselves get better over time.
**Difficulty:** Medium

### The Problem

The quality of design output is bounded by the quality of the design prompt. "Design a chat interface for an enterprise context intelligence product" will produce a generic chat interface. A great designer knows how to write a brief that produces a great first pass — but encoding that knowledge into a prompt is hard.

### The Approach

Use GEPA's reflective evolution to **optimize the design generation prompts themselves**:

1. **Seed prompt:** The current way you'd describe a design task to Armature
2. **Evaluate:** Build the design, score it with the quality scoring system
3. **Reflect:** Analyze the full trace — what was good, what was generic, what was missing
4. **Mutate:** Generate an improved prompt that addresses the diagnosed weaknesses
5. **Repeat:** Over sessions, the prompts that produce the best designs survive

### What Gets Optimized

Not the SKILL.md or knowledge files — those are the Coach phase's domain. This optimizes the **bridge between intent and execution:**

- How design briefs are structured
- What spatial strategies are suggested in which contexts
- How reference anchors are described
- What level of specificity produces the best first-pass layouts
- Which Figma execution patterns produce the cleanest results

### Why This Is Different

- **The tool gets better at understanding what you want.** Over time, the prompts that produce "Chase says this is great" designs evolve to dominate.
- **Domain-specific.** Not generic prompt optimization — specifically tuned to design generation quality.
- **Measurable.** Quality scores provide the fitness function. Reflection provides the diagnostic. Mutation provides the improvement.

### Implementation

- Prompt library: `references/evolved-prompts/`
- Each prompt variant tagged with quality scores from sessions where it was used
- GEPA-style Pareto frontier: maintain prompts that excel at different design types
- Periodically consolidate winning patterns into the knowledge files (Coach phase)
- DSPy-style module composition: different prompt modules for layout, typography, color, motion

---

## Capability 6: Parallel Design Exploration (Swarm)

**Source:** ClawTeam's swarm intelligence + agent parallelism
**Impact:** Medium. Force multiplier for exploration breadth.
**Difficulty:** Medium-High

### The Problem

Tree search (Capability 1) explores sequentially — build branch A, screenshot, build branch B, screenshot, etc. For 5 branches, that's 5 sequential build-verify cycles. On a complex layout, that's significant time.

### The Approach

Use Claude Code's **Agent tool to spawn parallel design exploration**:

- Leader agent writes the DESIGN-GOAL and defines 3-5 branch strategies
- Each branch gets assigned to a subagent
- Subagents build their branches simultaneously in separate Figma sections
- Leader collects screenshots, scores, and presents the frontier
- Best branches get promoted; others archive

### Why This Is Different

- **5 directions explored in the time of 1.** Parallelism turns tree search from "takes 5x longer" to "takes the same time but produces 5x more options."
- **Cross-pollination.** If Branch A's typography is great but Branch C's layout is better, the leader can spawn a new branch combining them.
- **Natural scaling.** More complex projects can spawn more branches.

### Implementation

- Orchestration protocol: `knowledge/swarm-exploration-protocol.md`
- Leader-worker pattern via Claude Code Agent tool
- Workers operate in separate Figma sections (prevent collision)
- Leader synthesizes results and presents to designer
- Cross-pollination as a merge step after initial exploration

---

## Capability 7: Self-Improving Workflow (Meta-Agent)

**Source:** ADAS's meta-programming for automated system design + SICA
**Impact:** Medium. Compounds over months.
**Difficulty:** High

### The Problem

Armature's workflow (what to load when, what order to build in, how to route between MCPs) was designed by a human once. It might not be optimal. As the skill grows, the workflow complexity grows, and manual optimization becomes impractical.

### The Approach

A **meta-layer** that periodically evaluates and proposes improvements to Armature's own workflow:

- Track which knowledge loading sequences produce the best quality scores
- Track which build orders produce fewer iterations
- Track which MCP routing patterns are fastest
- Propose workflow modifications (with approval gate)

### Why This Is Different

- **The tool optimizes how it works, not just what it knows.** Knowledge files capture design intelligence. The meta-layer optimizes the execution pipeline.
- **Data-driven.** Not guessing — measuring which sequences produce the best outcomes.

### Implementation

- Workflow telemetry: log which files were loaded, in what order, for what task type, and what quality score resulted
- Periodic analysis (monthly): identify patterns in high-scoring sessions
- Propose workflow updates to SKILL.md routing table
- Human-gated, like Coach phase

---

## Priority Ranking

For maximum compound impact on a solo/small-group practice wanting to push the edge of design innovation:

| Priority | Capability | Why First |
|----------|-----------|-----------|
| 1 | Design Tree Search | Directly solves the biggest pain point. Breadth before depth changes the quality ceiling. |
| 2 | Design Quality Scoring | Enables tree search pruning and provides the fitness function the whole system needs. |
| 3 | Cognitive Design Memory | Compounds over months. Every session makes the next one better. |
| 4 | Local MLX Validators | Speed and autonomy for routine tasks. Frees Claude for creative work. |
| 5 | Prompt Evolution | The tool gets better at understanding what you want. Requires quality scoring (Capability 2) to work. |
| 6 | Parallel Exploration | Force multiplier for tree search. Requires tree search (Capability 1) first. |
| 7 | Self-Improving Workflow | Long-term compound. Requires enough session data to analyze. |

### Dependency Graph

```
                    ┌─────────────────┐
                    │ Design Tree     │
                    │ Search (1)      │
                    └───────┬─────────┘
                            │ needs evaluation
                    ┌───────▼─────────┐
                    │ Quality         │
                    │ Scoring (2)     │◄──── Local MLX Validators (4)
                    └───────┬─────────┘      feed measurable dimensions
                            │ scores feed
               ┌────────────┼────────────┐
               ▼            ▼            ▼
        ┌──────────┐ ┌──────────┐ ┌──────────┐
        │ Cognitive │ │ Prompt   │ │ Parallel │
        │ Memory(3)│ │ Evol.(5) │ │ Swarm(6) │
        └──────────┘ └──────────┘ └──────────┘
                            │
                    ┌───────▼─────────┐
                    │ Self-Improving   │
                    │ Workflow (7)     │
                    └─────────────────┘
```

### Recommended Build Order

**Phase 1 (immediate):** Quality Scoring + Tree Search
These two enable each other and directly address the first-pass layout problem.

**Phase 2 (next):** Cognitive Design Memory + Local MLX Validators
Memory compounds over time — start early. Validators speed up the loop.

**Phase 3 (later):** Prompt Evolution + Parallel Exploration
These build on the infrastructure from Phase 1 and 2.

**Phase 4 (long-term):** Self-Improving Workflow
Needs months of session data to be meaningful.

---

## What This Makes Possible

A solo designer with Armature v4.0 would:

1. Write a design brief and DESIGN-GOAL
2. Armature generates 3-5 layout directions simultaneously (tree search + swarm)
3. Each direction is scored across 7 quality dimensions (quality scoring)
4. Local validators catch mechanical issues instantly (MLX)
5. The designer picks the best direction(s) from the Pareto frontier
6. Full-fidelity execution with reflection and cognitive memory
7. The design prompts that produced the best results evolve (prompt evolution)
8. The knowledge files update based on what was learned (Coach phase)
9. The workflow itself optimizes based on session data (meta-agent)

Every session makes the next one better. The compound effect means that after 50 sessions, Armature isn't the same tool it was on day one. It knows what works for your clients, your aesthetic, your constraints. It's not a generic design AI — it's *your* design intelligence, trained on your practice.

This is what makes a solo practitioner competitive with a team of 10. Not by working harder, but by accumulating intelligence that a team can't match because it's distributed across people rather than concentrated in a system.
