# Figma to Code — The Production Bridge

Translating Figma design into production React/Tailwind/GSAP code. Not a screenshot-to-markup converter — a design-intent extraction and implementation pipeline that produces the kind of code a senior engineer would write.

---

## Mental Model

The goal is never pixel-perfect transcription. It's **intent-faithful implementation** — understanding what the design is trying to achieve (hierarchy, rhythm, interaction, atmosphere) and expressing that in the most natural, efficient code for the stack.

Figma and code have different strengths. Figma is spatial and visual; code is structural and behavioral. The translation layer bridges that gap by extracting the design's *decisions* rather than its *pixels*.

---

## Extraction Pipeline

### Step 1 — Read the Design

Use the Figma MCP to extract design context:

```
get_design_context({ fileKey, nodeId })
```

This returns:
- Generated code scaffold (React + Tailwind — use as reference, not gospel)
- Screenshot of the design
- Code Connect mappings (if the project has them configured)
- Component documentation links
- Design annotations from the designer
- Design tokens as CSS variables

Also capture a screenshot for visual reference:

```
get_screenshot({ fileKey, nodeId, format: "png" })
```

### Step 2 — Inventory the Design Decisions

Before writing code, extract the decisions the design encodes:

**Layout architecture:**
- What's the page-level structure? (sidebar + content, single column, split view)
- What's the grid system? (fixed sidebar width, fluid content, max-width containers)
- How does it respond to viewport changes? (where do breakpoints live)

**Spacing system:**
- What's the base unit? (usually 4 or 8)
- What's the page-level gutter?
- What are the section gaps vs. element gaps vs. component internal padding?
- Is spacing consistent or does it vary by context?

**Typography map:**
- What fonts are in use? (family, weights loaded)
- What's the type scale? (map each text element to a role: heading, body, caption, label)
- Line height and letter spacing patterns

**Color system:**
- Are Figma variables in use? If so, extract the token structure
- Map colors to semantic roles (bg, text, border, interactive, state)
- Check for light/dark mode variable sets

**Component boundaries:**
- What are the reusable units? (cards, buttons, inputs, nav items)
- What are the composition patterns? (form fields = label + input + helper)
- What states exist? (default, hover, active, disabled, error, loading)

**Motion intent:**
- Are there prototype transitions defined?
- Are there annotations about animation behavior?
- What elements feel like they should animate? (entrances, state changes, scroll reactions)

### Step 3 — Map to the Stack

Translate Figma constructs to their code equivalents:

| Figma Construct | React/Tailwind Implementation |
|----------------|-------------------------------|
| Frame with auto-layout VERTICAL | `<div className="flex flex-col gap-{n}">` |
| Frame with auto-layout HORIZONTAL | `<div className="flex items-center gap-{n}">` |
| Auto-layout WRAP | `<div className="flex flex-wrap gap-{n}">` |
| Fill container (horizontal) | `className="w-full"` or `flex-1` |
| Hug contents | `className="w-fit"` (or just default inline behavior) |
| Fixed width frame | `className="w-[{n}px]"` or semantic width class |
| `primaryAxisAlignItems: SPACE_BETWEEN` | `className="justify-between"` |
| `counterAxisAlignItems: CENTER` | `className="items-center"` |
| Component with variants | React component with variant prop (use cva or manual) |
| Component instance | `<ComponentName {...overrides} />` |
| Figma variables (color) | Tailwind CSS custom properties or theme extension |
| Figma variables (spacing) | Tailwind spacing scale or CSS custom properties |
| Corner radius | `rounded-{size}` |
| Drop shadow | `shadow-{size}` or custom shadow in theme |
| Stroke (border) | `border border-{color}` |
| Text auto-resize HEIGHT + FILL width | `className="w-full"` (text wraps naturally) |
| Clip content | `className="overflow-hidden"` |

### Step 4 — Write the Code

**Component structure principles:**

```tsx
// One component per file. Named exports.
// Props interface at the top. Minimal surface area.
// Composition over configuration.

interface MetricCardProps {
  label: string
  value: string
  change?: string
}

export function MetricCard({ label, value, change }: MetricCardProps) {
  return (
    <div className="flex flex-col gap-2 rounded-xl bg-white p-5 border border-gray-100">
      <span className="text-[13px] text-gray-500">{label}</span>
      <span className="text-[28px] font-semibold tracking-tight text-gray-900">
        {value}
      </span>
      {change && (
        <span className="text-sm text-gray-500">{change}</span>
      )}
    </div>
  )
}
```

**Tailwind conventions:**

- Use the default Tailwind scale when it maps cleanly to the design's spacing
- Extend `tailwind.config` for project-specific tokens (colors, fonts, custom spacing) rather than using arbitrary values everywhere
- Arbitrary values (`w-[260px]`) are fine for one-off structural dimensions (sidebar width, max-content width). Don't extend the theme for values used once.
- Group related utilities: layout first, then spacing, then typography, then color, then effects
- Use `@apply` sparingly — only in global styles for truly repeated utility combinations

**React patterns:**

- Functional components only. No class components.
- `useState` / `useRef` / `useEffect` for local state and DOM interaction
- Custom hooks to extract complex logic from components
- `React.forwardRef` when the component wraps an interactive element that external code might need to reference
- Lazy loading for route-level code splitting: `React.lazy(() => import('./DashboardPage'))`
- Prefer composition (`children`, render props) over deep prop drilling

---

## Code Connect Integration

When Code Connect mappings exist in the Figma file, they're the highest-signal translation available — they map Figma components directly to codebase components.

### Reading Code Connect

```
get_code_connect_map({ fileKey })
get_code_connect_suggestions({ fileKey, nodeId })
```

If mappings exist:
1. Use the mapped component directly — don't recreate it
2. Check the component's actual API in the codebase (props, variants, composition patterns)
3. Instantiate with the correct props to match the design's configuration

### Creating Code Connect Mappings

When building new components, establish the mapping:

```
add_code_connect_map({
  fileKey,
  mappings: [{
    figmaNodeId: "1:234",
    codeComponent: "MetricCard",
    importPath: "@/components/MetricCard",
    propMapping: {
      "label": { type: "TEXT", figmaProperty: "Label" },
      "value": { type: "TEXT", figmaProperty: "Value" },
      "variant": { type: "VARIANT", figmaProperty: "Type" }
    }
  }]
})
```

This closes the loop — future design-to-code extractions will reference the actual component.

---

## Token Translation

### Figma Variables to Tailwind Theme

When the Figma file uses a variable system, extract it and map to `tailwind.config`:

```ts
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        // Semantic tokens mapped from Figma variable collection
        surface: {
          page: 'var(--color-bg-page)',
          card: 'var(--color-bg-surface)',
          elevated: 'var(--color-bg-elevated)',
        },
        content: {
          primary: 'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
          tertiary: 'var(--color-text-tertiary)',
        },
        border: {
          default: 'var(--color-border-default)',
          strong: 'var(--color-border-strong)',
        },
        interactive: {
          DEFAULT: 'var(--color-interactive-default)',
          hover: 'var(--color-interactive-hover)',
        },
      },
      spacing: {
        // Map from Figma spacing variables if custom
      },
      borderRadius: {
        // Map from Figma radius variables
      },
    },
  },
}
```

CSS custom properties in `globals.css`:

```css
:root {
  --color-bg-page: #FAFAFA;
  --color-bg-surface: #FFFFFF;
  --color-text-primary: #111827;
  --color-text-secondary: #6B7280;
  --color-border-default: #E5E7EB;
  --color-interactive-default: #3B82F6;
  /* ... */
}

[data-theme="dark"] {
  --color-bg-page: #0A0A0A;
  --color-bg-surface: #1E1E1E;
  --color-text-primary: #F9FAFB;
  --color-text-secondary: #A1A1AA;
  --color-border-default: rgba(255, 255, 255, 0.12);
  --color-interactive-default: #60A5FA;
  /* ... */
}
```

### When There Are No Figma Variables

Extract colors manually from the design. Group by role, not by hex value. If you see `#6B7280` used on secondary text and caption text, that's `text-gray-500` in Tailwind — use the Tailwind default when it's close enough.

---

## Motion — Encoding Animation Intent

Figma designs are static. Motion intent comes from three sources:

1. **Prototype transitions** — Figma's prototyping connections describe page-level and overlay transitions
2. **Design annotations** — Notes from the designer about how things should animate
3. **Implied motion** — Elements that conventionally animate: page entrances, hover states, loading transitions, scroll reveals

See `knowledge/motion.md` for the full GSAP implementation reference. The key mapping:

| Design Intent | GSAP Pattern |
|--------------|-------------|
| Page enters from right | `gsap.from('.page', { x: 40, opacity: 0, duration: 0.4, ease: 'power2.out' })` |
| Cards stagger in | `gsap.from('.card', { y: 20, opacity: 0, stagger: 0.08, ease: 'power2.out' })` |
| Element reveals on scroll | ScrollTrigger with `start: 'top 85%'` |
| Hover lift | CSS transition (simpler) or GSAP for complex sequences |
| Loading skeleton to content | `gsap.to('.skeleton', { opacity: 0, onComplete: showContent })` |
| Number counting up | `gsap.to(ref, { innerText: targetValue, snap: { innerText: 1 }, duration: 1 })` |
| Smooth layout shift | `Flip.from(state, { duration: 0.4, ease: 'power2.inOut' })` |

---

## Quality Checks Before Shipping

After translating, verify:

- [ ] Semantic HTML (`nav`, `main`, `section`, `button` not `div` for everything)
- [ ] Keyboard navigation works (tab order, focus visible, escape to close)
- [ ] Color contrast meets WCAG AA (4.5:1 text, 3:1 UI)
- [ ] Responsive behavior is intentional (not just fluid — actually designed for breakpoints)
- [ ] No hardcoded pixel values that should be tokens
- [ ] Components are composable (can be used in contexts the design doesn't show)
- [ ] Loading and error states are handled (design often shows only the happy path)
- [ ] GSAP animations respect `prefers-reduced-motion`
- [ ] Images have alt text, icons have aria-labels where needed
- [ ] No layout shifts on load (dimensions reserved, fonts preloaded)
