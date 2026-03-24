# Code to Figma — The Reconciliation Bridge

When production code drifts from the Figma source of truth — through vibe-coding, iterative dev, or scope shifts — this pipeline captures the code's actual rendered state and pushes it back into Figma. The goal: Figma always reflects what shipped.

This is a manually invoked workflow. It's not automatic sync — it's deliberate reconciliation.

---

## Mental Model

Code drifts from Figma for good reasons: development uncovers edge cases, interactions feel different in the browser, vibe-coding sessions produce better solutions than the original design. The drift isn't the problem — the problem is when the Figma file becomes a lie.

This pipeline closes the gap by:
1. Understanding what the code actually renders
2. Comparing that against the Figma source
3. Updating the Figma components and frames to match production reality

The Figma file is the *record of what shipped*, not just the *blueprint for what was planned*.

---

## The Mapping Manifest

Every project that uses bidirectional sync maintains a mapping manifest. This is the Rosetta Stone between Figma nodes and codebase locations.

### Manifest Format

Store at the project root as `armature-manifest.json`:

```json
{
  "project": "Project Name",
  "figmaFileKey": "abc123def456",
  "lastReconciled": "2026-03-24",
  "mappings": [
    {
      "id": "dashboard-overview",
      "figmaNodeId": "1:234",
      "figmaNodeName": "Dashboard / Overview",
      "codePath": "src/pages/Dashboard.tsx",
      "route": "/dashboard",
      "type": "page",
      "lastSynced": "2026-03-24",
      "syncDirection": "code-to-figma",
      "notes": "Added metric cards not in original design"
    },
    {
      "id": "metric-card",
      "figmaNodeId": "5:678",
      "figmaNodeName": "Components / MetricCard",
      "codePath": "src/components/MetricCard.tsx",
      "type": "component",
      "lastSynced": "2026-03-20",
      "syncDirection": "figma-to-code"
    }
  ]
}
```

### Mapping Types

| Type | What It Tracks |
|------|---------------|
| `page` | Full page/screen — a Figma frame mapped to a route or view |
| `component` | A reusable component — Figma component mapped to a React component file |
| `section` | A major page section — part of a page mapped to a specific component or region |

### Creating Mappings

Two paths:

**Manual mapping** — User provides Figma URLs and code paths. Parse the URL to extract `fileKey` and `nodeId`, associate with the code path, and write to the manifest.

**Crawl-and-map** — Point at a codebase directory. Walk the file tree to identify pages (route definitions) and components (exported React components). For each, generate a screenshot or description of what it renders. Then open the Figma file, list the pages/frames, and propose mappings based on naming similarity and visual comparison. User confirms.

---

## Reconciliation Workflows

### Workflow A: Targeted Screen Reconciliation

The user points at a specific screen that has drifted.

**Step 1 — Capture the code's rendered state**

Option A: User provides a URL to the running dev server. Use `get_screenshot` or a browser capture to see the current rendered output.

Option B: User provides a screenshot of the running app.

Option C: Read the code directly. For React/Tailwind, the rendered output is inferrable from the JSX + class names. Build a mental model of what it looks like: layout structure, colors (from Tailwind classes or CSS vars), typography, spacing, component composition.

**Step 2 — Capture the Figma state**

```
get_design_context({ fileKey, nodeId })
get_screenshot({ fileKey, nodeId })
```

Compare the two. Identify every point of drift:

- **Added elements** — Things in the code that don't exist in Figma
- **Removed elements** — Things in Figma that are no longer in the code
- **Changed properties** — Different colors, spacing, typography, border radius, shadows
- **Layout changes** — Different structure, reordered elements, changed responsive behavior
- **New states** — States the code handles that Figma doesn't show

**Step 3 — Report drift**

Before making changes, produce a drift report:

```markdown
## Drift Report: Dashboard Overview

**Figma:** [node link]
**Code:** src/pages/Dashboard.tsx
**Last synced:** 2026-03-10

### Changes detected:

1. **Added:** Metric cards row (4 cards) below the header — not in Figma
2. **Changed:** Sidebar width from 240px to 260px
3. **Changed:** Header now uses Inter Semi Bold 24px (was 28px in Figma)
4. **Changed:** Card border radius from 8px to 12px
5. **Removed:** "Quick actions" panel on right side — cut during dev
6. **Added:** Loading skeleton states for all data areas

### Recommended Figma updates:
- Add MetricCard component to component library
- Update Dashboard frame with new layout
- Update sidebar dimensions
- Remove Quick Actions panel
- Add skeleton state frames
```

**Step 4 — Update Figma**

After user confirms the drift report, execute updates via `figma_execute`. Work element by element:

For **property changes** (colors, spacing, type, radius):
```javascript
const node = figma.getNodeById('1:234');
// Update properties to match code
node.cornerRadius = 12;
node.resize(260, node.height); // sidebar width change
```

For **added elements**, build them using the patterns in `figma-execution.md`. Place them in the correct position within the existing frame structure.

For **removed elements**:
```javascript
const removed = figma.currentPage.findOne(n => n.name === 'Quick Actions');
if (removed) removed.remove();
```

For **structural changes** (layout reflows, reordered children), it's often faster to rebuild the frame than to surgically rearrange it. Screenshot first, rebuild, screenshot again, compare.

**Step 5 — Verify**

Screenshot the updated Figma frame. Compare against the code's rendered state. Iterate until they match. Update the manifest with the new sync timestamp.

### Workflow B: Codebase Crawl and Full Reconciliation

The user points at a codebase directory and wants a comprehensive sync.

**Step 1 — Crawl the codebase**

Identify the application structure:

```
1. Find the router configuration (React Router, Next.js pages/app directory)
2. Map routes to page components
3. For each page component, identify:
   - The component file and its imports
   - Layout structure (what's the JSX tree)
   - Shared components used (from imports)
   - Tailwind classes → infer colors, spacing, typography
   - GSAP animations → note motion behaviors
4. Build a component dependency graph
```

**Step 2 — Build visual descriptions**

For each page/component, produce a structured visual description:

```markdown
## src/pages/Dashboard.tsx

**Layout:** Sidebar (260px, white, right border) + Content (fluid, #FAFAFA bg)
**Header:** "Dashboard" — Inter Semi Bold 24px, -0.5px tracking, #111827
**Content sections:**
  1. Metrics row — 4 cards, horizontal wrap, 16px gap
     - Card: white bg, 12px radius, layered shadow, 20px padding
     - Label: 13px Regular #6B7280
     - Value: 28px Semi Bold #111827, tight tracking
  2. Activity table — full width, 12px row padding, alternating subtle bg
**Sidebar nav:** 8 items, 8px vertical gap, 12px horizontal padding, 8px radius on active
```

**Step 3 — Map against Figma**

Open the Figma file and inventory existing frames:

```
get_metadata({ fileKey })
```

Walk the page structure. For each Figma frame, compare against the codebase inventory. Propose mappings:

```markdown
## Proposed Mappings

| Code | Figma Frame | Confidence | Notes |
|------|------------|------------|-------|
| src/pages/Dashboard.tsx | "Dashboard / Overview" (1:234) | High | Name match, structure similar |
| src/pages/Settings.tsx | "Settings / General" (2:345) | High | Name match |
| src/components/MetricCard.tsx | "Components / Metric Card" (5:678) | High | Direct match |
| src/pages/Analytics.tsx | — | None | New page, no Figma equivalent |
| — | "Dashboard / Notifications" (1:456) | None | Removed from code |
```

User confirms. Write confirmed mappings to manifest.

**Step 4 — Batch reconciliation**

For each confirmed mapping with detected drift, run the targeted reconciliation (Workflow A, steps 2-5). Prioritize:

1. Component-level updates first (they cascade to page frames)
2. Page-level layout updates second
3. New elements last (these may need new Figma components)

---

## Figma Update Patterns

### Updating Component Properties

When the code version of a component has changed (new props, different styling):

```javascript
// Find the component in the Figma file
const component = figma.currentPage.findOne(
  n => n.type === 'COMPONENT' && n.name === 'MetricCard'
);

if (component) {
  // Update styling to match code
  component.cornerRadius = 12;
  component.paddingTop = 20;
  component.paddingBottom = 20;
  component.paddingLeft = 20;
  component.paddingRight = 20;
  component.itemSpacing = 8;

  // Update fills, strokes, effects as needed
  component.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  component.strokes = [{ type: 'SOLID', color: hexToRgb('#F3F4F6') }];
  component.strokeWeight = 1;
  component.strokeAlign = 'INSIDE';
}
```

### Updating Figma Variables to Match Code Tokens

When the code's CSS custom properties or Tailwind config has diverged from Figma variables:

```javascript
const collections = figma.variables.getLocalVariableCollections();
const semanticCollection = collections.find(c => c.name === 'Semantic');

if (semanticCollection) {
  const modeId = semanticCollection.modes[0].modeId; // Light mode
  const variables = semanticCollection.variableIds.map(
    id => figma.variables.getVariableById(id)
  );

  // Update a color variable to match code
  const bgPage = variables.find(v => v.name === 'color/bg/page');
  if (bgPage) {
    bgPage.setValueForMode(modeId, hexToRgb('#FAFBFC')); // was #FAFAFA in Figma
  }
}
```

### Adding New Elements to Existing Frames

When the code added a section or component that Figma doesn't have:

1. Screenshot the existing Figma frame to understand positioning
2. Identify where the new element should be inserted (within auto-layout order, or absolute position)
3. Build the element using patterns from `figma-execution.md`
4. Insert into the parent at the correct index:

```javascript
const parent = figma.getNodeById('1:234');
const newSection = figma.createFrame();
// ... configure the frame ...

// Insert at specific position (e.g., after the header, before the table)
parent.insertChild(2, newSection); // index 2 = third child
```

### Rebuilding a Frame

When drift is extensive (major restructuring), rebuild rather than patch:

1. Screenshot the code's rendered state for reference
2. Screenshot the current Figma frame
3. Note the Figma frame's position, name, and parent
4. Build a new frame alongside the old one
5. Verify the new frame matches the code
6. Replace: move the new frame to the old frame's position, rename it, delete the old one
7. Update any instances or references

```javascript
const oldFrame = figma.getNodeById('1:234');
const parent = oldFrame.parent;
const index = parent.children.indexOf(oldFrame);
const x = oldFrame.x;
const y = oldFrame.y;
const name = oldFrame.name;

// Build new frame (full construction here)
const newFrame = figma.createFrame();
newFrame.name = name;
// ... build contents ...

// Swap
parent.insertChild(index, newFrame);
newFrame.x = x;
newFrame.y = y;
oldFrame.remove();
```

---

## Drift Detection Heuristics

When comparing code against Figma, look for these common drift patterns:

| Drift Pattern | How to Detect | Common Cause |
|--------------|--------------|-------------|
| Spacing changes | Compare padding/gap values in Tailwind classes vs. Figma auto-layout | Dev tweaked spacing for feel |
| Color shifts | Compare Tailwind color classes or CSS vars vs. Figma fills | Dark mode adjustments, accessibility fixes |
| Typography changes | Compare text-* and font-* classes vs. Figma text properties | Readability adjustments at real content length |
| Added elements | JSX elements with no Figma equivalent | Feature additions during dev |
| Removed elements | Figma nodes with no code equivalent | Scope cuts, UX simplification |
| Layout restructuring | Different nesting or flow direction | Responsive behavior discoveries |
| New component variants | Code has states Figma doesn't show | Edge case handling |
| Animation additions | GSAP/CSS transitions with no Figma annotation | Motion added during implementation |
| Border radius changes | rounded-* classes vs. cornerRadius | Visual refinement |
| Shadow changes | shadow-* classes vs. effects array | Depth hierarchy adjustments |

---

## Best Practices

1. **Reconcile components before pages.** Component updates cascade to every instance. Update the MetricCard component first, then the Dashboard page that uses it.

2. **Don't reconcile mid-sprint.** Wait until a feature stabilizes. Reconciling while code is still in flux creates churn.

3. **Preserve Figma component architecture.** The goal is visual accuracy, not restructuring how the Figma file is organized. Update properties and contents, but keep component boundaries and naming conventions intact unless they no longer reflect reality.

4. **Document why things drifted.** Add the reason in the manifest's `notes` field. Future reconciliations benefit from knowing whether drift was intentional (design decision changed) or incidental (dev shortcut).

5. **Update Code Connect after reconciliation.** If component APIs changed, update the Code Connect mappings so the next Figma-to-code extraction uses the current implementation.

6. **Screenshot everything.** Before and after, every time. The build-verify loop from `figma-execution.md` applies here too.
