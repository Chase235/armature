# Figma Execution — The Bridge

This is the translation layer between design intent and Figma Console MCP. The challenge isn't knowing what good design looks like — it's expressing it precisely through Figma's object model and API.

## Mental Model

Everything in Figma is a **node tree**. Pages contain frames, frames contain frames, frames contain content. The key insight: **frames with auto-layout are the layout engine**. They're Figma's equivalent of flexbox. Master auto-layout and you can build anything.

The Figma Console MCP gives you two paths:
1. **Convenience tools** — `figma_create_child`, `figma_set_fills`, `figma_set_text`, `figma_resize_node` — for simple, direct operations
2. **`figma_execute`** — Run arbitrary Figma Plugin API JavaScript. This is where real design happens. Full access to auto-layout, components, variants, effects, typography control, and every property Figma exposes.

**Always prefer `figma_execute` for anything beyond trivial changes.** The convenience tools are limited. `figma_execute` is the full instrument.

## The Build–Verify Loop

This is the fundamental rhythm of execution:

1. **Screenshot first** — Before touching anything, capture the current state with `figma_capture_screenshot`. Know what's there.
2. **Build** — Execute your design code via `figma_execute`.
3. **Verify** — Screenshot the result with `figma_capture_screenshot`. Analyze spacing, alignment, proportions, visual balance.
4. **Iterate** — Fix issues. Re-verify. Maximum 3 iterations per element before reassessing approach.

This loop is non-negotiable. You cannot trust that code produced the intended visual result without seeing it.

## Placement Discipline

**Never create nodes on a bare page.** Always:
1. Check if a Section or Frame already exists on the target page
2. If not, create a Section first
3. Place all work inside that container
4. Position away from existing content — screenshot first to see what's there

```javascript
// Find or create a container
let section = figma.currentPage.findOne(n => n.type === 'SECTION' && n.name === 'Design');
if (!section) {
  section = figma.createSection();
  section.name = 'Design';
  section.x = 0;
  section.y = 0;
  section.resizeWithoutConstraints(1440, 900);
}
```

## Cleanup Discipline

On failure or retry, **always clean up partial artifacts** before trying again:
```javascript
// Remove a failed attempt
const orphan = figma.getNodeById('1:234');
if (orphan) orphan.remove();
```

Never leave empty frames, orphaned layers, or blank pages behind.

---

## Auto-Layout — The Layout Engine

Auto-layout is how you express spacing, alignment, padding, and flow. It's the single most important Figma concept for execution.

### Vertical Stack (Most Common)

Page sections, card contents, form fields — anything that flows top to bottom.

```javascript
const stack = figma.createFrame();
stack.name = 'Content Stack';
stack.layoutMode = 'VERTICAL';
stack.primaryAxisSizingMode = 'AUTO';    // Height: hug contents
stack.counterAxisSizingMode = 'FIXED';   // Width: fixed
stack.resize(400, 100); // Width matters, height will auto
stack.itemSpacing = 16;                   // Gap between children
stack.paddingTop = 24;
stack.paddingBottom = 24;
stack.paddingLeft = 24;
stack.paddingRight = 24;
stack.fills = []; // Transparent — let the content speak
```

### Horizontal Row

Navbars, button groups, icon + label pairs, metadata rows.

```javascript
const row = figma.createFrame();
row.name = 'Action Row';
row.layoutMode = 'HORIZONTAL';
row.primaryAxisSizingMode = 'AUTO';      // Width: hug
row.counterAxisSizingMode = 'AUTO';      // Height: hug
row.itemSpacing = 12;
row.counterAxisAlignItems = 'CENTER';    // Vertical center
row.paddingTop = 8;
row.paddingBottom = 8;
row.paddingLeft = 16;
row.paddingRight = 16;
```

### Key Auto-Layout Properties

| Property | What It Controls | Common Values |
|----------|-----------------|---------------|
| `layoutMode` | Direction | `'VERTICAL'`, `'HORIZONTAL'` |
| `itemSpacing` | Gap between children | 4, 8, 12, 16, 24, 32, 48 |
| `paddingTop/Bottom/Left/Right` | Inner padding | Match spacing system |
| `primaryAxisSizingMode` | Size along flow direction | `'AUTO'` (hug), `'FIXED'` |
| `counterAxisSizingMode` | Size perpendicular to flow | `'AUTO'` (hug), `'FIXED'` |
| `primaryAxisAlignItems` | Align along main axis | `'MIN'`, `'CENTER'`, `'MAX'`, `'SPACE_BETWEEN'` |
| `counterAxisAlignItems` | Align along cross axis | `'MIN'`, `'CENTER'`, `'MAX'` |
| `layoutWrap` | Wrapping | `'WRAP'`, `'NO_WRAP'` |

### Child Sizing in Auto-Layout

This is where "fill container" vs "hug contents" lives:

```javascript
// Child fills parent width (like flex: 1 or width: 100%)
child.layoutSizingHorizontal = 'FILL';

// Child hugs its own content
child.layoutSizingHorizontal = 'HUG';

// Child has fixed size
child.layoutSizingHorizontal = 'FIXED';
```

**Common mistake:** Elements using "hug contents" when they should "fill container" causes lopsided layouts. When building content areas, inputs, or cards within a parent — default to `FILL` for the horizontal axis.

---

## Typography

### Loading and Setting Fonts

Fonts must be loaded before use. Always load asynchronously.

```javascript
// Load a Google Font (must be installed on the system or available to Figma)
await figma.loadFontAsync({ family: 'Inter', style: 'Regular' });
await figma.loadFontAsync({ family: 'Inter', style: 'Semi Bold' });
await figma.loadFontAsync({ family: 'Inter', style: 'Bold' });

const heading = figma.createText();
heading.fontName = { family: 'Inter', style: 'Semi Bold' };
heading.fontSize = 32;
heading.lineHeight = { value: 40, unit: 'PIXELS' };
heading.letterSpacing = { value: -0.5, unit: 'PIXELS' };
heading.characters = 'Dashboard';
heading.fills = [{ type: 'SOLID', color: { r: 0.07, g: 0.07, b: 0.07 } }];
```

### Type Scale for Interfaces

A practical scale for product UI (not marketing pages):

| Role | Size | Weight | Line Height | Letter Spacing |
|------|------|--------|-------------|----------------|
| Display | 36–48px | Semi Bold | 1.1–1.2× | -0.02em |
| Heading 1 | 28–32px | Semi Bold | 1.2× | -0.01em |
| Heading 2 | 22–24px | Semi Bold | 1.25× | -0.01em |
| Heading 3 | 18–20px | Medium | 1.3× | 0 |
| Body | 14–16px | Regular | 1.5× | 0 |
| Caption | 12–13px | Regular | 1.4× | 0.01em |
| Label | 11–12px | Medium | 1.3× | 0.02em |

**Key:** Negative letter-spacing on headings (tighter) creates visual density. Positive letter-spacing on labels (looser) aids legibility at small sizes.

### Text Auto-Resize Modes

```javascript
text.textAutoResize = 'WIDTH_AND_HEIGHT';  // Hug both — for labels, badges
text.textAutoResize = 'HEIGHT';            // Fixed width, height hugs — for paragraphs
text.textAutoResize = 'NONE';             // Fixed both — rarely what you want
text.textAutoResize = 'TRUNCATE';         // Fixed with ellipsis — for constrained UI
```

In auto-layout parents, combine with `layoutSizingHorizontal = 'FILL'` and `textAutoResize = 'HEIGHT'` for text that fills available width and grows vertically — the most common pattern for content areas.

---

## Color

### Setting Fills

Figma uses RGB values from 0–1, not 0–255.

```javascript
// Helper: hex to Figma RGB
function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  return { r, g, b };
}

// Solid fill
frame.fills = [{ type: 'SOLID', color: hexToRgb('#FFFFFF') }];

// With opacity
frame.fills = [{ type: 'SOLID', color: hexToRgb('#000000'), opacity: 0.05 }];

// No fill (transparent)
frame.fills = [];
```

### Gradients

```javascript
frame.fills = [{
  type: 'GRADIENT_LINEAR',
  gradientTransform: [[1, 0, 0], [0, 1, 0]], // Top to bottom
  gradientStops: [
    { position: 0, color: { r: 0.2, g: 0.4, b: 1, a: 1 } },
    { position: 1, color: { r: 0.6, g: 0.2, b: 0.9, a: 1 } }
  ]
}];
```

### Using Variables for Color (Preferred)

When a design token system exists, bind to variables instead of hardcoding:

```javascript
// Get existing variables
const collections = figma.variables.getLocalVariableCollections();
const collection = collections.find(c => c.name === 'Colors');
if (collection) {
  const variables = collection.variableIds.map(id => figma.variables.getVariableById(id));
  const primary = variables.find(v => v.name === 'color/primary');
  if (primary) {
    frame.fills = [figma.variables.setBoundVariableForPaint(
      { type: 'SOLID', color: { r: 0, g: 0, b: 0 } },
      'color',
      primary
    )];
  }
}
```

---

## Effects — Shadows, Blur, Radius

### Corner Radius

```javascript
// Uniform
frame.cornerRadius = 12;

// Per-corner (for cards with flat bottom, etc.)
frame.topLeftRadius = 12;
frame.topRightRadius = 12;
frame.bottomLeftRadius = 0;
frame.bottomRightRadius = 0;
```

### Shadows

```javascript
frame.effects = [{
  type: 'DROP_SHADOW',
  color: { r: 0, g: 0, b: 0, a: 0.08 },
  offset: { x: 0, y: 1 },
  radius: 3,        // Blur
  spread: 0,
  visible: true
}];

// Layered shadows for depth (more natural)
frame.effects = [
  { type: 'DROP_SHADOW', color: { r: 0, g: 0, b: 0, a: 0.04 }, offset: { x: 0, y: 1 }, radius: 2, spread: 0, visible: true },
  { type: 'DROP_SHADOW', color: { r: 0, g: 0, b: 0, a: 0.06 }, offset: { x: 0, y: 4 }, radius: 8, spread: 0, visible: true },
  { type: 'DROP_SHADOW', color: { r: 0, g: 0, b: 0, a: 0.04 }, offset: { x: 0, y: 12 }, radius: 24, spread: 0, visible: true }
];
```

### Blur

```javascript
// Background blur (for glass effects)
frame.effects = [{
  type: 'BACKGROUND_BLUR',
  radius: 16,
  visible: true
}];
// Combine with semi-transparent fill
frame.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 }, opacity: 0.7 }];
```

---

## Components and Instances

### Creating Components

```javascript
// Create a component
const button = figma.createComponent();
button.name = 'Button';
button.layoutMode = 'HORIZONTAL';
button.counterAxisAlignItems = 'CENTER';
button.primaryAxisSizingMode = 'AUTO';
button.counterAxisSizingMode = 'AUTO';
button.paddingLeft = 20;
button.paddingRight = 20;
button.paddingTop = 10;
button.paddingBottom = 10;
button.cornerRadius = 8;
button.fills = [{ type: 'SOLID', color: hexToRgb('#18181B') }];

await figma.loadFontAsync({ family: 'Inter', style: 'Medium' });
const label = figma.createText();
label.characters = 'Button';
label.fontName = { family: 'Inter', style: 'Medium' };
label.fontSize = 14;
label.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
button.appendChild(label);
```

### Component Properties (for flexibility)

```javascript
// Add a text property to a component
button.addComponentProperty('label', 'TEXT', 'Button');

// Add a boolean property (show/hide icon)
button.addComponentProperty('showIcon', 'BOOLEAN', true);

// Add a variant property
button.addComponentProperty('variant', 'VARIANT', 'primary');
```

### Instantiating Components

Use `figma_search_components` first to find what exists, then `figma_instantiate_component`:

```
1. figma_search_components → get componentKey + nodeId
2. figma_instantiate_component → create instance with overrides
```

**Critical:** Always re-search at the start of each session. Node IDs are session-specific.

### Instance Overrides

**Never directly edit text in instances.** Use `figma_set_instance_properties` instead — direct text edits on instances fail silently.

```javascript
// Check what properties an instance exposes
const instance = figma.getNodeById('1:234');
console.log(instance.componentProperties); // Shows available overrides
```

---

## Variables and Design Tokens

### Creating a Token System

Use `figma_setup_design_tokens` for atomic creation of a complete token structure:

```
figma_setup_design_tokens({
  collectionName: 'Primitives',
  modes: ['Light', 'Dark'],
  tokens: [
    { name: 'color/neutral/50', resolvedType: 'COLOR', values: { Light: '#FAFAFA', Dark: '#18181B' }},
    { name: 'color/neutral/900', resolvedType: 'COLOR', values: { Light: '#18181B', Dark: '#FAFAFA' }},
    { name: 'color/primary/500', resolvedType: 'COLOR', values: { Light: '#3B82F6', Dark: '#60A5FA' }},
    { name: 'spacing/xs', resolvedType: 'FLOAT', values: { Light: 4, Dark: 4 }},
    { name: 'spacing/sm', resolvedType: 'FLOAT', values: { Light: 8, Dark: 8 }},
    { name: 'spacing/md', resolvedType: 'FLOAT', values: { Light: 16, Dark: 16 }},
    { name: 'spacing/lg', resolvedType: 'FLOAT', values: { Light: 24, Dark: 24 }},
    { name: 'radius/sm', resolvedType: 'FLOAT', values: { Light: 6, Dark: 6 }},
    { name: 'radius/md', resolvedType: 'FLOAT', values: { Light: 8, Dark: 8 }},
    { name: 'radius/lg', resolvedType: 'FLOAT', values: { Light: 12, Dark: 12 }}
  ]
})
```

### Binding Variables to Properties

```javascript
// Bind a color variable to a fill
const variable = figma.variables.getVariableById('VariableID:1:23');
const paint = figma.variables.setBoundVariableForPaint(
  { type: 'SOLID', color: { r: 0, g: 0, b: 0 } },
  'color',
  variable
);
frame.fills = [paint];

// Bind a float variable to spacing
frame.setBoundVariable('itemSpacing', variable);
frame.setBoundVariable('paddingTop', variable);
```

---

## Common Patterns — Design Intent to Code

### Card

Design intent: A contained content unit with clear hierarchy and subtle depth.

```javascript
const card = figma.createFrame();
card.name = 'Card';
card.layoutMode = 'VERTICAL';
card.primaryAxisSizingMode = 'AUTO';
card.counterAxisSizingMode = 'FIXED';
card.resize(360, 100);
card.layoutSizingHorizontal = 'FILL'; // Fill parent if in auto-layout
card.itemSpacing = 12;
card.paddingTop = 20;
card.paddingBottom = 20;
card.paddingLeft = 20;
card.paddingRight = 20;
card.cornerRadius = 12;
card.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
card.effects = [
  { type: 'DROP_SHADOW', color: { r: 0, g: 0, b: 0, a: 0.04 }, offset: { x: 0, y: 1 }, radius: 2, spread: 0, visible: true },
  { type: 'DROP_SHADOW', color: { r: 0, g: 0, b: 0, a: 0.06 }, offset: { x: 0, y: 4 }, radius: 8, spread: -2, visible: true }
];
```

### Sidebar + Content Layout

Design intent: A persistent navigation panel alongside a scrollable content area.

```javascript
const layout = figma.createFrame();
layout.name = 'App Layout';
layout.layoutMode = 'HORIZONTAL';
layout.primaryAxisSizingMode = 'FIXED';
layout.counterAxisSizingMode = 'FIXED';
layout.resize(1440, 900);
layout.itemSpacing = 0;
layout.fills = [{ type: 'SOLID', color: hexToRgb('#FAFAFA') }];

// Sidebar
const sidebar = figma.createFrame();
sidebar.name = 'Sidebar';
sidebar.layoutMode = 'VERTICAL';
sidebar.layoutSizingVertical = 'FILL';
sidebar.layoutSizingHorizontal = 'FIXED';
sidebar.resize(260, 900);
sidebar.itemSpacing = 4;
sidebar.paddingTop = 16;
sidebar.paddingBottom = 16;
sidebar.paddingLeft = 12;
sidebar.paddingRight = 12;
sidebar.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
// Right border
sidebar.strokes = [{ type: 'SOLID', color: hexToRgb('#E5E7EB') }];
sidebar.strokeWeight = 1;
sidebar.strokeAlign = 'INSIDE';
// Only show right stroke
sidebar.strokeTopWeight = 0;
sidebar.strokeBottomWeight = 0;
sidebar.strokeLeftWeight = 0;
sidebar.strokeRightWeight = 1;
layout.appendChild(sidebar);

// Content area
const content = figma.createFrame();
content.name = 'Content';
content.layoutMode = 'VERTICAL';
content.layoutSizingHorizontal = 'FILL';
content.layoutSizingVertical = 'FILL';
content.itemSpacing = 24;
content.paddingTop = 32;
content.paddingBottom = 32;
content.paddingLeft = 40;
content.paddingRight = 40;
content.fills = [];
layout.appendChild(content);
```

### Navigation Item

Design intent: A subtle, interactive list item that signals clickability without shouting.

```javascript
const navItem = figma.createFrame();
navItem.name = 'Nav Item';
navItem.layoutMode = 'HORIZONTAL';
navItem.primaryAxisSizingMode = 'FILL';  // Error: can't set this directly
navItem.layoutSizingHorizontal = 'FILL'; // Correct: fill parent width
navItem.counterAxisSizingMode = 'AUTO';
navItem.itemSpacing = 10;
navItem.counterAxisAlignItems = 'CENTER';
navItem.paddingTop = 8;
navItem.paddingBottom = 8;
navItem.paddingLeft = 12;
navItem.paddingRight = 12;
navItem.cornerRadius = 8;
navItem.fills = []; // Transparent default — active state gets a subtle fill
```

### Input Field

Design intent: A clean, clearly bounded text entry with label.

```javascript
const field = figma.createFrame();
field.name = 'Input Field';
field.layoutMode = 'VERTICAL';
field.primaryAxisSizingMode = 'AUTO';
field.counterAxisSizingMode = 'FIXED';
field.resize(320, 100);
field.layoutSizingHorizontal = 'FILL';
field.itemSpacing = 6;
field.fills = [];

// Label
await figma.loadFontAsync({ family: 'Inter', style: 'Medium' });
const label = figma.createText();
label.characters = 'Email address';
label.fontName = { family: 'Inter', style: 'Medium' };
label.fontSize = 13;
label.fills = [{ type: 'SOLID', color: hexToRgb('#374151') }];
field.appendChild(label);

// Input container
const input = figma.createFrame();
input.name = 'Input';
input.layoutMode = 'HORIZONTAL';
input.layoutSizingHorizontal = 'FILL';
input.counterAxisSizingMode = 'AUTO';
input.counterAxisAlignItems = 'CENTER';
input.paddingTop = 10;
input.paddingBottom = 10;
input.paddingLeft = 14;
input.paddingRight = 14;
input.cornerRadius = 8;
input.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
input.strokes = [{ type: 'SOLID', color: hexToRgb('#D1D5DB') }];
input.strokeWeight = 1;
input.strokeAlign = 'INSIDE';

await figma.loadFontAsync({ family: 'Inter', style: 'Regular' });
const placeholder = figma.createText();
placeholder.characters = 'you@example.com';
placeholder.fontName = { family: 'Inter', style: 'Regular' };
placeholder.fontSize = 14;
placeholder.fills = [{ type: 'SOLID', color: hexToRgb('#9CA3AF') }];
placeholder.layoutSizingHorizontal = 'FILL';
placeholder.textAutoResize = 'HEIGHT';
input.appendChild(placeholder);
field.appendChild(input);
```

### Dashboard Grid

Design intent: A responsive-feeling grid of metric cards.

```javascript
const grid = figma.createFrame();
grid.name = 'Metrics Grid';
grid.layoutMode = 'HORIZONTAL';
grid.layoutWrap = 'WRAP';
grid.primaryAxisSizingMode = 'FIXED';
grid.counterAxisSizingMode = 'AUTO';
grid.resize(1100, 100);
grid.itemSpacing = 16;        // Horizontal gap
grid.counterAxisSpacing = 16; // Vertical gap (when wrapped)
grid.fills = [];

// Create metric cards
const metrics = [
  { label: 'Total Users', value: '24,521', change: '+12.5%' },
  { label: 'Revenue', value: '$84,230', change: '+8.2%' },
  { label: 'Conversion', value: '3.24%', change: '-0.4%' },
  { label: 'Avg. Session', value: '4m 32s', change: '+15.1%' }
];

for (const m of metrics) {
  const card = figma.createFrame();
  card.name = m.label;
  card.layoutMode = 'VERTICAL';
  card.layoutSizingHorizontal = 'FILL';
  card.minWidth = 240;
  card.primaryAxisSizingMode = 'AUTO';
  card.itemSpacing = 8;
  card.paddingTop = 20;
  card.paddingBottom = 20;
  card.paddingLeft = 20;
  card.paddingRight = 20;
  card.cornerRadius = 12;
  card.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  card.strokes = [{ type: 'SOLID', color: hexToRgb('#F3F4F6') }];
  card.strokeWeight = 1;
  card.strokeAlign = 'INSIDE';

  await figma.loadFontAsync({ family: 'Inter', style: 'Regular' });
  await figma.loadFontAsync({ family: 'Inter', style: 'Semi Bold' });

  const labelText = figma.createText();
  labelText.characters = m.label;
  labelText.fontSize = 13;
  labelText.fontName = { family: 'Inter', style: 'Regular' };
  labelText.fills = [{ type: 'SOLID', color: hexToRgb('#6B7280') }];
  card.appendChild(labelText);

  const valueText = figma.createText();
  valueText.characters = m.value;
  valueText.fontSize = 28;
  valueText.fontName = { family: 'Inter', style: 'Semi Bold' };
  valueText.letterSpacing = { value: -0.5, unit: 'PIXELS' };
  valueText.fills = [{ type: 'SOLID', color: hexToRgb('#111827') }];
  card.appendChild(valueText);

  grid.appendChild(card);
}
```

---

## Thinking in Figma's Terms

When translating design intent, map concepts like this:

| Design Concept | Figma Mechanism |
|---------------|-----------------|
| Flexbox / CSS Grid | Auto-layout (VERTICAL or HORIZONTAL + WRAP) |
| `gap` | `itemSpacing`, `counterAxisSpacing` |
| `padding` | `paddingTop/Bottom/Left/Right` |
| `width: 100%` / `flex: 1` | `layoutSizingHorizontal = 'FILL'` |
| `width: fit-content` | `layoutSizingHorizontal = 'HUG'` |
| `justify-content: space-between` | `primaryAxisAlignItems = 'SPACE_BETWEEN'` |
| `align-items: center` | `counterAxisAlignItems = 'CENTER'` |
| `flex-wrap: wrap` | `layoutWrap = 'WRAP'` |
| `min-width` | `minWidth` |
| `max-width` | `maxWidth` |
| `overflow: hidden` | `clipsContent = true` |
| `border` | `strokes` + `strokeWeight` + `strokeAlign` |
| `border-radius` | `cornerRadius` or individual corner properties |
| `box-shadow` | `effects` array with `DROP_SHADOW` type |
| CSS variables / tokens | Figma Variables bound via `setBoundVariable()` |
| Component / React component | Figma Component (`createComponent()`) |
| Props | Component Properties |
| Variants (primary/secondary) | Component Set with variant properties |
| Dark mode | Variable modes (Light/Dark on same collection) |
| Z-index / layering | `parent.insertChild(index, node)` — lower index = further back |

---

## Debugging Common Issues

| Symptom | Likely Cause | Fix |
|---------|-------------|-----|
| Layout looks compressed/collapsed | Auto-layout sizing mode wrong | Check `primaryAxisSizingMode` and child `layoutSizing*` |
| Text truncated or overlapping | Text auto-resize mode | Set `textAutoResize = 'HEIGHT'` with `layoutSizingHorizontal = 'FILL'` |
| Elements not visible | Fill is transparent or node is zero-size | Check `fills` array isn't empty, check dimensions |
| Font error | Font not loaded | `await figma.loadFontAsync(...)` before setting text |
| Children not filling width | Missing fill sizing on children | Set `child.layoutSizingHorizontal = 'FILL'` |
| Spacing between children wrong | `itemSpacing` not set | Set on the parent frame, not the children |
| Instance text won't change | Direct editing on instances | Use `figma_set_instance_properties` instead |
| Shadow looks harsh | Single shadow, too dark | Use layered shadows with low opacity (0.04–0.08) |
| Elements overlap on page | No container discipline | Always place inside a Section, screenshot first |
| Changes not reflected | Stale node references | Re-query nodes after modifications |
