# Quality Scoring Protocol — Composite Design Evaluation

Design quality isn't a single number. But without structured evaluation, the verify step is a vibe check — fine for one design, useless for comparing five branches or tracking improvement over time.

This protocol provides a composite scoring system that combines measurable dimensions (extracted from Figma node data) with vision-evaluated dimensions (assessed via Claude vision on screenshots). The result is a 0-100 score with per-dimension breakdowns that enable tree search pruning, progress tracking, and calibrated design critique.

Inspired by autovoiceevals' approach to scoring subjective quality through structured composite metrics, and GEPA's evaluation mechanism for providing actionable diagnostic feedback rather than just pass/fail.

---

## When to Score

- **Tree search:** Score every branch to enable pruning and frontier selection
- **Build-verify loop:** Score after each major iteration to track improvement
- **Design review:** Score existing designs to establish baselines before revision
- **Cross-project calibration:** Score reference designs (gold standards) to calibrate expectations

Skip scoring for quick fixes, single-element adjustments, or early exploratory sketches where divergence matters more than quality.

---

## The Seven Dimensions

### Measurable Dimensions (from Figma node inspection)

These are scored by running `layout-audit.js` via `figma_execute` on the target frame. They produce exact numeric values.

**1. Spacing Consistency (weight: 0.20)**

Does spacing follow the defined system (base-8 by default)?

```
Score = spacing.compliance (0-100)
```

The `layout-audit.js` helper walks the node tree, extracts all gap and padding values from auto-layout frames, and checks each against the base-8 scale. The compliance percentage IS the score.

**Scoring:**
- 95-100: Excellent. System is disciplined.
- 85-94: Good. A few intentional or optical breaks.
- 70-84: Needs attention. Multiple violations suggest inconsistency.
- Below 70: The spacing system isn't being followed.

**2. Accessibility (weight: 0.10)**

Contrast ratios, hit target sizes, and structural accessibility.

```
Score = weighted average of:
  - contrast_pass_rate (0-100): % of text nodes meeting WCAG AA
  - target_pass_rate (0-100): % of interactive elements >= 32px min dimension
```

Both come from `layout-audit.js`. The contrast check calculates actual luminance ratios. The target check measures interactive element dimensions.

**Scoring:**
- 100: All text passes WCAG AA, all targets are appropriately sized
- 80-99: Minor issues (one low-contrast caption, one small icon button)
- Below 80: Accessibility problems need attention before this ships

### Vision-Evaluated Dimensions (from Claude vision on screenshots)

These are scored by taking a `figma_capture_screenshot` and evaluating the image with structured prompts. Each dimension gets its own focused evaluation.

**3. Hierarchy Clarity (weight: 0.25)**

Is there a clear visual hierarchy? Does the eye know where to look without thinking?

**Evaluation prompt:**
```
Look at this interface design screenshot. Evaluate the visual hierarchy on a scale of 0-10.

Consider:
- Is there a clear primary focal point?
- Can you identify primary, secondary, and tertiary information levels?
- Does the typographic scale create obvious importance levels?
- Do size, weight, color, and position work together to guide the eye?
- Would a new user know where to look first, second, third?

Score (0-10):
Evidence (cite specific elements):
Weakest aspect:
```

**Scoring:** The 0-10 response maps to 0-100.

**4. Visual Balance (weight: 0.15)**

Is the composition balanced? Does it feel stable and intentional?

**Evaluation prompt:**
```
Look at this interface design screenshot. Evaluate the visual balance on a scale of 0-10.

Consider:
- Does the layout feel stable or does it lean/tip?
- Is visual weight distributed intentionally across the viewport?
- Do heavy elements (dark colors, large type, dense content) have counterweights?
- Is there a clear spatial logic (grid, alignment axes, consistent margins)?
- Does whitespace feel intentional or accidental?

Score (0-10):
Evidence (cite specific elements):
Weakest aspect:
```

**5. Information Density (weight: 0.15)**

Right amount of content for the viewport? Neither sparse nor overwhelmed?

**Evaluation prompt:**
```
Look at this interface design screenshot. Evaluate the information density on a scale of 0-10.

Consider:
- Is the viewport used well? (Not too empty, not too cramped)
- Does the density match the use case? (Dashboard can be dense; landing page should breathe)
- Are there areas that feel wasted or overcrowded?
- Does progressive disclosure manage complexity appropriately?
- Would a user feel overwhelmed or underwhelmed?

Score (0-10):
Evidence (cite specific elements):
Weakest aspect:
```

**6. Brand Alignment (weight: 0.10)**

Does it feel like the brand? Do the visual choices reinforce brand personality?

**Evaluation prompt:**
```
Look at this interface design screenshot. Given the brand context below, evaluate brand alignment on a scale of 0-10.

Brand context: [INSERT FROM DESIGN-GOAL OR PROJECT CONTEXT]

Consider:
- Do the colors feel on-brand? (Check against defined palette)
- Does the typography convey the right personality?
- Does the overall mood match the brand's positioning?
- Are interactive elements styled consistently with brand language?
- Would someone familiar with the brand recognize this as belonging to it?

Score (0-10):
Evidence (cite specific elements):
Weakest aspect:
```

**7. Innovation (weight: 0.05)**

Does it do something unexpected and good? Does it push beyond convention?

**Evaluation prompt:**
```
Look at this interface design screenshot. Evaluate design innovation on a scale of 0-10.

Consider:
- Does anything here surprise you in a positive way?
- Are there novel solutions to common UI problems?
- Does it transcend the conventions of its category while remaining usable?
- Is there a design idea here that other products should steal?
- Does it feel like it's defining a direction rather than following one?

Note: Convention-following design that's well-executed should score 5-6. Reserve 8+ for genuinely novel approaches.

Score (0-10):
Evidence (cite specific elements):
What's novel:
```

---

## Composite Calculation

```
Quality Score = (
    spacing_consistency * 0.20 +
    accessibility * 0.10 +
    hierarchy_clarity * 0.25 +
    visual_balance * 0.15 +
    information_density * 0.15 +
    brand_alignment * 0.10 +
    innovation * 0.05
)

All dimensions normalized to 0-100 before weighting.
```

### Weight Customization

Default weights work for most product design. Adjust per DESIGN-GOAL when the project emphasis shifts:

| Project type | Raise | Lower |
|-------------|-------|-------|
| Data dashboard | information_density, accessibility | innovation |
| Brand marketing site | brand_alignment, innovation, visual_balance | information_density |
| AI product interface | hierarchy_clarity, innovation | brand_alignment |
| Design system component | spacing_consistency, accessibility | innovation, brand_alignment |
| Startup MVP | hierarchy_clarity, information_density | innovation, spacing_consistency |

Override weights in the DESIGN-GOAL file:

```markdown
## Scoring Weights
- hierarchy_clarity: 0.30
- spacing_consistency: 0.15
- visual_balance: 0.15
- information_density: 0.20
- brand_alignment: 0.10
- accessibility: 0.08
- innovation: 0.02
```

---

## Running a Score

### Step 1: Measurable Dimensions

Run `layout-audit.js` via `figma_execute` on the target frame. Replace `__NODE_ID__` with the actual frame ID.

```javascript
// In figma_execute — paste layout-audit.js with TARGET_ID replaced
const TARGET_ID = '94:3289';
// ... rest of layout-audit.js
```

Extract `spacing.compliance` for the spacing score. Calculate accessibility score from contrast and target data.

### Step 2: Vision Dimensions

Take a screenshot via `figma_capture_screenshot` on the target frame. Run each vision evaluation prompt against the screenshot image. Collect scores and evidence.

### Step 3: Composite

Calculate the weighted composite. Present as:

```
QUALITY SCORE: 78/100

  Hierarchy Clarity:    82  (×0.25 = 20.5)
  Spacing Consistency:  91  (×0.20 = 18.2)
  Visual Balance:       74  (×0.15 = 11.1)
  Information Density:  70  (×0.15 = 10.5)
  Brand Alignment:      65  (×0.10 =  6.5)
  Accessibility:        88  (×0.10 =  8.8)
  Innovation:           50  (×0.05 =  2.5)

  Strongest: Spacing Consistency (91)
  Weakest:   Innovation (50)

  Top issue: Visual balance — left sidebar creates heavy weight
  with no counterbalance on the right side of the canvas.
```

### Step 4: Diagnose

After presenting the score, write a **one-paragraph diagnosis** identifying the single highest-leverage improvement. This is the GEPA-inspired "Actionable Side Information" — not just the score, but the specific fix that would move the needle most.

---

## Score Interpretation

| Range | Interpretation |
|-------|---------------|
| 90-100 | Exceptional. Ship-ready. Competitive with the best in the industry. |
| 80-89 | Strong. Minor refinements needed. Would impress in a design review. |
| 70-79 | Good foundation. Clear areas for improvement. Worth iterating on. |
| 60-69 | Needs work. The structure is there but execution isn't sharp. |
| Below 60 | Rethink the approach. The fundamental layout strategy may need to change. |

### Calibration

Score a few gold standard designs first to calibrate expectations. A Revolut onboarding screen should score 85+. A well-executed Linear-style interface should score 80+. If your gold standards are scoring below 75, the scoring prompts may need refinement.

---

## Integration Points

- **Tree search:** Score each branch. Present the Pareto frontier (branches that score highest on different dimensions). Prune branches below 60.
- **Build-verify loop:** Score after iteration 1 and after iteration 3. Track the delta.
- **Reflection log:** Include the composite score and weakest dimension in each reflection entry.
- **Coach phase:** If a dimension consistently scores low across sessions, the knowledge files may need updating in that area.
- **DESIGN-GOAL:** Add a target score to acceptance criteria: "Composite score >= 80, no dimension below 65."
