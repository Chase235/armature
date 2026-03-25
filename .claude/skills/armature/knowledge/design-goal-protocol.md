# DESIGN-GOAL Protocol — Define "Better" Before Building

Inspired by the GOAL.md pattern: before optimizing anything, construct a definition of success. In code, that's a fitness function. In design, it's a set of verifiable criteria that make "done" concrete before work begins.

The point isn't to reduce design to a checklist. It's to prevent the verify step from being a vibe check. You need something to verify *against*.

---

## When to Write a DESIGN-GOAL

Before any non-trivial Figma build session. Skip it for quick fixes, one-off adjustments, or explorations where the goal is discovery rather than execution.

Write one when:
- Building a new screen or component from scratch
- Executing a design that needs to meet specific requirements (client feedback, brand spec, accessibility target)
- Working on a system-level pattern that will be reused

---

## The DESIGN-GOAL File

Lives at the project level, one per design task:

```
[project-root]/design-goals/[task-name].md
```

### Structure

```markdown
# DESIGN-GOAL: [Task Name]

## Target Criteria
Specific, verifiable statements. Each one should be checkable from a screenshot or node inspection.

- [ ] Sidebar width: 260px expanded, 56px collapsed
- [ ] All spacing follows base-8 system (4, 8, 12, 16, 20, 24, 32, 48, 64)
- [ ] Text contrast ratio >= 4.5:1 on all backgrounds
- [ ] Primary action is visually dominant — largest interactive element above the fold
- [ ] Nav items have consistent 37px hit targets

## Reference Anchors
What defines the quality bar. Point to specific examples.

- Gold standard: [reference name or path]
- Mobbin reference: [app name, screen type]
- Existing component: [Figma node or component name]
- Doctrine principle: [which principle this serves]

## Constraints
What cannot change. These are load-bearing walls.

- Brand tokens: [specific tokens that must be used]
- Existing components: [what must be reused, not rebuilt]
- Content requirements: [real copy, data ranges, edge cases]
- Accessibility: [WCAG level, specific requirements]
- Technical: [responsive breakpoints, animation budget, etc.]

## Operating Mode
- [ ] **Converge** — Stop when all criteria are met
- [ ] **Explore** — Criteria are guideposts, not gates. Divergence is allowed if it serves the design.
- [ ] **Supervised** — Pause for human review at each major milestone
```

---

## How to Use During Build-Verify

The DESIGN-GOAL integrates with the build-verify loop at the **verify** step:

1. **Screenshot** the result
2. **Check each criterion** against the screenshot or via node inspection
3. **Mark criteria** as met or unmet
4. If unmet criteria remain, they inform the next iteration's focus

This replaces the informal "does this look right?" with "does this meet the stated goals?"

### What the Criteria Are NOT

- They are not a comprehensive design spec. They're the acceptance criteria for *this build session*.
- They are not immutable. If you discover during building that a criterion is wrong, update it and note why.
- They are not a substitute for design judgment. They catch the measurable stuff so your eye can focus on the stuff that can't be measured.

---

## Criterion Types

Good criteria fall into a few categories:

**Dimensional** — Measurable from node properties
- Widths, heights, spacing values, padding, border radius
- Font sizes, line heights, letter spacing
- Hit target sizes (minimum 44px for touch, 32px for cursor)

**Relational** — Verifiable from visual inspection
- "Heading is visually dominant over body text"
- "Cards are evenly spaced with consistent gaps"
- "Primary action draws the eye before secondary actions"

**Systemic** — Checkable against the design system
- "All colors are from the token palette"
- "Spacing uses only values from the base-8 scale"
- "Typography uses only defined type styles"

**Accessible** — Testable with tools or inspection
- Contrast ratios
- Focus order
- Screen reader label presence
- Touch target sizes

---

## After the Session

When a DESIGN-GOAL's criteria are all met (or the session ends):
- Mark the file as complete with a date
- Note any criteria that were changed and why
- Note any surprises — things that worked differently than expected

These notes feed the Coach phase. If a criterion was wrong, the knowledge files might need updating.
