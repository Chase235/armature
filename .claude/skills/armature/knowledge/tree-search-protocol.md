# Tree Search Protocol — Branching Design Exploration

The best designers explore before they commit. They sketch 5 thumbnails before picking one to develop. The problem with AI-assisted design is that it tends to go linear — one direction, iterate, hope. Tree search fixes this by making exploration systematic.

Inspired by AIDE's tree-search architecture (which wins 4x more than linear approaches) and AI-Scientist-v2's best-first tree search. Adapted for design, where branches are spatial strategies and the evaluation function is composite quality scoring.

---

## When to Use Tree Search

- **New screen design** — Always. The first direction you pick determines the ceiling.
- **Major layout revision** — When the current approach has hit a wall and iteration isn't improving it.
- **Multiple valid strategies** — When the brief could be solved multiple ways and you're not sure which.

Skip tree search for:
- Minor adjustments to existing layouts
- Component-level work (buttons, inputs, cards)
- Work where the layout is already established and you're filling it in

---

## The Tree Search Cycle

```
                         DESIGN-GOAL
                             │
                      ┌──────┼──────┐
                      ▼      ▼      ▼
                   Branch  Branch  Branch
                     A       B       C
                      │      │      │
                   Score   Score   Score
                      │      │      │
                      └──────┼──────┘
                             │
                        Frontier
                       Selection
                             │
                      ┌──────┴──────┐
                      ▼             ▼
                   Promote       Archive
                   (1-2)         (rest)
                      │
                 Full Fidelity
                   Execution
```

---

## Step 1: Define Branch Strategies

Before building anything, define 3-5 fundamentally different spatial strategies. "Different" means different spatial architecture, not different colors or typography.

### Strategy Dimensions

Each branch should vary on at least one of these axes:

| Axis | Variation examples |
|------|--------------------|
| **Composition** | Centered vs. asymmetric vs. edge-anchored vs. full-bleed |
| **Information flow** | Top-down scroll vs. hub-and-spoke vs. progressive reveal vs. spatial/map |
| **Chrome density** | Minimal (content-forward) vs. rich (tool-heavy) vs. adaptive (context-aware) |
| **Navigation model** | Sidebar vs. top bar vs. command palette vs. tab bar vs. no chrome |
| **Content priority** | Chat-first vs. data-first vs. nav-first vs. action-first |
| **Spatial logic** | Grid-based vs. organic/flowing vs. card-based vs. single-column |

### The Wild Card Branch

Always include one branch that breaks a convention intentionally. This is where industry-defining design comes from — not from executing conventions well, but from questioning whether the convention is right.

Examples:
- "What if there's no sidebar at all?"
- "What if the chat IS the navigation?"
- "What if the layout is asymmetric and the content isn't centered?"
- "What if the primary action is at the top, not the bottom?"

The wild card branch often scores lower on convention-based metrics but higher on innovation. Sometimes it reveals the direction nobody was considering.

### Branch Definition Format

```markdown
## Branch Strategies

### A: [Name] — [One-sentence spatial concept]
Layout: [composition approach]
Priority: [what the eye should see first]
Navigation: [how the user moves through the interface]
Reference: [gold standard or precedent this draws from]

### B: [Name] — [One-sentence spatial concept]
...

### C: [Name] — [One-sentence spatial concept]
...

### W: Wild Card — [What convention this breaks]
...
```

---

## Step 2: Build Lightweight Skeletons

Each branch gets built as a **layout skeleton** — not a wireframe, not full fidelity. A skeleton has:

**Included:**
- Real auto-layout structure (proper flexbox thinking)
- Real proportions (correct widths, heights, spacing)
- Real type sizes and weights (hierarchy is visible)
- Placeholder content at the right density (lorem ipsum is fine)
- Primary color blocking (background tones, not full palette)
- Key interactive elements at correct sizes

**Excluded:**
- Final content/copy
- Icons and illustrations
- Micro-interactions and hover states
- Border treatments and subtle shadows
- Full color palette application
- Responsive considerations

The goal is to see the **spatial architecture** clearly, without getting lost in surface treatment. A skeleton takes 2-3 minutes to build per branch vs. 15-20 for full fidelity.

### Figma Organization

Build all branches in a single Figma section:

```
Section: "Tree Search — [Task Name]"
  ├── Frame: "Branch-A_[name]"     (1440×900 or target viewport)
  ├── Frame: "Branch-B_[name]"
  ├── Frame: "Branch-C_[name]"
  └── Frame: "Branch-W_wild-card"
```

Position frames side by side with 100px gaps. Same viewport dimensions for all branches.

---

## Step 3: Score Each Branch

Run the quality scoring protocol on each branch:

1. **Layout audit** (`layout-audit.js`) for measurable dimensions
2. **Screenshot** each branch
3. **Vision evaluation** for each dimension
4. **Composite score** with per-dimension breakdown

### Frontier Analysis

After scoring all branches, present them as a Pareto frontier — not just ranked by total score, but showing which branches excel on different dimensions:

```
TREE SEARCH RESULTS — Coraa Chat Screen

Branch A (Centered Composition):     76/100
  Best at: Visual Balance (88), Spacing (92)
  Weak at: Innovation (35), Information Density (60)

Branch B (Dense Sidebar):            72/100
  Best at: Information Density (85), Hierarchy (78)
  Weak at: Visual Balance (58), Innovation (40)

Branch C (Content-Forward):          80/100
  Best at: Hierarchy (90), Brand Alignment (82)
  Weak at: Information Density (65), Accessibility (72)

Branch W (No Sidebar):               68/100
  Best at: Innovation (85), Visual Balance (80)
  Weak at: Spacing (55), Brand Alignment (50)

FRONTIER: Branches A and C are non-dominated (neither is strictly
better than the other across all dimensions).

RECOMMENDATION: Promote Branch C (highest composite) and Branch W
(highest innovation — explore the unconventional direction).
```

### Pruning Threshold

- Branches below 55 composite: Drop unless they score 80+ on innovation.
- Branches below 45 composite: Always drop.
- Never prune the wild card branch on composite score alone — evaluate innovation separately.

---

## Step 4: Select and Promote

Present the frontier to the designer with:
- Side-by-side screenshots of all branches
- Per-dimension score breakdowns
- Frontier analysis (which branches are non-dominated)
- Trade-off summary (what you gain/lose with each choice)
- Recommendation (which 1-2 to promote)

The designer picks 1-2 branches to advance to full-fidelity execution.

### Promotion Paths

**Single promote:** One branch advances. Clear winner or strong designer preference.

**Hybrid promote:** Take the spatial strategy from one branch and a specific element from another. Example: "Branch C's overall layout with Branch W's navigation approach." Build a new frame combining both.

**Parallel promote:** Two branches advance independently to full fidelity. Compare again after full execution. More expensive but useful when the choice is genuinely close.

---

## Step 5: Archive

Branches that don't advance get moved (not deleted) to an archive section:

```
Section: "Tree Search — [Task Name]"
  ├── Frame: "Branch-C_content-forward" (PROMOTED)
  └── Section: "archived-branches"
       ├── Frame: "Branch-A_centered"
       ├── Frame: "Branch-B_dense-sidebar"
       └── Frame: "Branch-W_no-sidebar"
```

Archived branches are future reference. When the next screen in the same product needs a layout, the archived branches from this search inform the strategy options. The wild card branch is especially valuable — it may not have won this round, but it often seeds ideas for future work.

---

## Step 6: Full Fidelity

The promoted branch(es) enter the standard build-verify-reflect loop at full fidelity:

1. Write/update DESIGN-GOAL with refined criteria based on what the skeleton revealed
2. Build full-fidelity version with real content, full palette, icons, interactions
3. Score again — the full version should score higher than the skeleton
4. Iterate via the reflection log
5. Coach phase at session end

---

## Tree Search and the Self-Improvement Loop

Tree search integrates with all three v3.0 protocols:

**DESIGN-GOAL:** Written before branching. Branch strategies are defined to explore different paths toward the same goal.

**Reflection Log:** Each branch gets reflection entries. Cross-branch reflections are especially valuable: "Branch A's tight spacing at 8px made nav items feel crammed, while Branch C's 16px felt right — confirms 12px+ for independent nav elements."

**Coach Phase:** Tree search generates more design intelligence per session than linear work. The Coach phase after a tree search session often has proposals for updating the knowledge files.

**Quality Scoring:** The scoring system IS the evaluation function for tree search. Without scoring, tree search is just building multiple versions without a way to compare them.

---

## Iteration on the Tree Itself

Sometimes the first round of tree search doesn't produce a strong enough frontier. Options:

**Deepen:** Take the best branch and create 3 sub-branches that vary a specific aspect of it. This is depth-first search within a promising direction.

**Widen:** Add 2-3 new branches that explore strategies not yet considered. This is breadth-first expansion.

**Cross-pollinate:** Combine elements from different branches into new hybrids. This is the ClawTeam-inspired approach — take the best configuration from each branch and spawn new branches that start from the combined state.

**Restart:** If all branches score below 55, the DESIGN-GOAL criteria or the branch strategies may need rethinking. Step back to strategy definition.

---

## Practical Notes

- **3 branches is the minimum.** Fewer doesn't provide enough variation. Start with 3 for tight timelines, 5 for important work.
- **Time budget:** 3 skeleton branches take ~10-15 minutes. 5 take ~15-25. Full scoring adds ~5 minutes per branch. Total: ~30-50 minutes for a 5-branch search, versus potentially hours of linear iteration down a wrong path.
- **Don't polish skeletons.** The temptation is to keep refining. Resist. The skeleton's job is to show spatial architecture, not surface treatment. Polish happens after promotion.
- **Name branches descriptively.** "Branch A" is useless in the archive. "Centered-minimal" or "Dense-sidebar-nav-first" communicates the strategy at a glance.
- **The wild card matters.** It will often feel wrong or risky. Build it anyway. Some of the best designs in history came from questioning conventions that everyone assumed were correct.
