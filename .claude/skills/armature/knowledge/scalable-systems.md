# Scalable Design Systems

A design system should be a force multiplier, not a bureaucracy. The best systems make the right thing easy and the wrong thing hard — then get out of the way.

---

## Token Architecture

### Three Layers (When You Need Them)

```
Primitive    →  Raw values. The palette.
Semantic     →  Purpose-bound aliases. What the value means.
Component    →  Context-specific bindings. Where it's used.
```

**Example:**
```
Primitive:   blue-600 = #2563EB
Semantic:    color-primary = blue-600
Component:   button-bg = color-primary
```

### When Three Layers Is Overkill

For a single product with no multi-brand aspirations, two layers is often enough:

```
Primitive:   blue-600 = #2563EB
Semantic:    color-primary = blue-600  (used directly in components)
```

Add the component layer when:
- The same semantic token maps to different values in different components
- You're supporting multiple brands or themes beyond light/dark
- Component-level customization is a product requirement

Don't add it "because that's how design systems work." Add it when you need it.

### Token Categories

| Category | Examples | Notes |
|----------|----------|-------|
| Color | Neutrals, primary, semantic states | Light/dark mode as variable modes |
| Spacing | 4, 8, 12, 16, 20, 24, 32, 48, 64 | Base-8 system |
| Typography | Font family, size scale, weight scale, line heights | Constrained set |
| Radius | 4, 6, 8, 12, 16, 9999 (full) | Match to density |
| Shadow | Layered shadow definitions | 2–3 elevation levels |
| Border | Width (1px), color (from neutral scale) | Subtle by default |
| Motion | Duration (100, 200, 300ms), easing curves | Consistent feel |
| Z-index | Defined layers (dropdown, modal, toast) | Prevent z-index wars |

### Token Naming

Name tokens by purpose, not by value:

```
Good:   color-text-primary, color-bg-surface, spacing-page-gutter
Bad:    dark-gray, light-blue, space-24
```

Purpose-based names survive value changes. If you rename `space-24` to `28`, every usage is wrong. If you change the value of `spacing-page-gutter` from 24 to 28, every usage is still correct.

---

## Component Composition

### The Practical Hierarchy

Forget "atoms, molecules, organisms" as a religion. Use it as a mental model:

**Primitives** — The indivisible elements: Button, Input, Badge, Avatar, Icon.

**Compounds** — Primitives composed together: FormField (Label + Input + HelperText), UserRow (Avatar + Name + Role).

**Patterns** — Compounds arranged for a specific use case: SettingsPage (list of FormFields), ConversationThread (list of Messages).

**Pages** — Patterns composed into a full view.

The key insight: **each level should only know about the level below it.** A Page doesn't reach into a Button's internals. A FormField doesn't care what page it's on.

### Component API Design

A component's props are its API. Design them like you'd design a function signature:

**Required props:** The minimum needed for the component to work.
```
Button: label (string)
Input: placeholder (string), value (string)
Card: children (content)
```

**Variant props:** Change the component's visual treatment.
```
Button: variant (primary | secondary | ghost | destructive)
Input: state (default | error | disabled)
Card: elevation (flat | raised | floating)
```

**Modifier props:** Adjust behavior or appearance.
```
Button: size (sm | md | lg), fullWidth (boolean), loading (boolean)
Input: type (text | password | email), icon (optional)
```

**The Rule of Minimum Surface:** Every prop you add is a decision the consumer must make. Fewer props = faster adoption. Add props when you see a real need, not in anticipation of one.

### Figma Component Architecture

In Figma, component composition works through:

**Components:** The reusable building blocks. Created with `figma.createComponent()`.

**Component Sets:** Groups of variants. A Button component set might contain Primary/Default, Primary/Hover, Secondary/Default, Secondary/Hover. Created by combining components into a set.

**Instances:** Placed copies of components. Created with `figma_instantiate_component` or `component.createInstance()`. Override properties without breaking the link.

**Nested Instances:** A Card component can contain a Button instance. When the Button is updated, every Card updates too.

**Properties:** Text, Boolean (show/hide), Instance Swap (swap a child component), Variant (switch between states).

---

## Design System Governance

### What to Standardize

- **Color tokens** — Enforce via variables. No hardcoded hex in components.
- **Spacing scale** — Enforce via variables. Consistent padding and gaps.
- **Typography scale** — Fixed set of text styles. No arbitrary sizes.
- **Component patterns** — Standard compositions for common needs.
- **Icon style** — One family, one weight, consistent sizing.

### What to Leave Open

- **Layout** — Don't prescribe page layouts. Provide a grid system and spacing tokens, then trust the designer/builder.
- **Content** — Don't dictate copy length, tone, or structure within components. Build flexible containers.
- **Novel patterns** — New product features may need new components. The system should make creating new components easy, not bureaucratic.
- **Density** — Different product areas have different density needs. The system should support this, not fight it.

### The Tension

The system exists to create consistency and speed. But over-constraining kills innovation:

- Too rigid → Teams work around the system instead of with it. Every new feature is a battle.
- Too loose → The UI becomes inconsistent. Every screen looks like a different app.
- The sweet spot → Strong opinions on fundamentals (color, type, spacing), flexible on composition and layout.

---

## Multi-Brand and Multi-Theme

### Light/Dark Mode

The minimum multi-theme requirement. In Figma:

1. Create a variable collection with two modes: Light, Dark
2. Every color token gets a value per mode
3. Spacing, radius, and typography tokens are usually mode-independent
4. Components bind to variables — theme switching is automatic

### Multi-Brand

For platforms serving multiple brands:

1. **Primitive layer changes per brand.** Different color palettes, different type choices.
2. **Semantic layer stays consistent.** `color-primary` still means "primary action color" regardless of brand.
3. **Component structure is shared.** A Button is a Button. The tokens it consumes change.

In Figma, this maps to additional modes on variable collections, or separate collections per brand.

---

## Scaling Without Constraining Technology

The biggest design system failure: building a system so specific that it can't accommodate the product's evolution.

### Principles

1. **Build for the current product, not the hypothetical future product.** Premature abstraction is worse than repetition.

2. **Prefer composition over configuration.** A Button + Icon composed together beats a Button with 15 props for icon position, icon size, icon color, etc.

3. **Leave room for new patterns.** The system should make it easy to build a new component that feels consistent — through tokens and conventions — not by providing every possible component in advance.

4. **Design tokens are the contract.** Everything else is guidance. If a team follows the token system, their output will feel cohesive even if they build novel components.

5. **Don't version-lock to current technology.** The design system should describe what things look like and how they behave, not what framework they're built in. The Figma components, the React components, and the SwiftUI components should look the same but don't need to share implementation.

6. **Audit by output, not by process.** Does the result look and feel consistent? Does it meet accessibility standards? Does it serve the user? These matter more than whether the team followed the "correct" workflow.

---

## Design System in Figma — Practical Patterns

### Variable Collection Structure

```
Primitives
├── color/neutral/50 ... 950
├── color/blue/50 ... 950
├── color/red/50 ... 950
├── spacing/xs (4) ... 3xl (64)
├── radius/sm (4) ... full (9999)
└── shadow/sm, md, lg (as effect styles, not variables)

Semantic
├── color/bg/page
├── color/bg/surface
├── color/bg/elevated
├── color/text/primary
├── color/text/secondary
├── color/text/tertiary
├── color/border/default
├── color/border/strong
├── color/interactive/default
├── color/interactive/hover
├── color/state/error
├── color/state/success
├── color/state/warning
└── ...
```

### Component Checklist

Before shipping a component:

- [ ] Uses variables for all colors (no hardcoded hex)
- [ ] Uses spacing tokens for padding and gaps
- [ ] Has clear text styles (not arbitrary font sizing)
- [ ] Works at multiple widths (test at 320px and 1440px)
- [ ] Has all states: default, hover, active, focused, disabled, error
- [ ] Accessible: 4.5:1 text contrast, 3:1 UI contrast
- [ ] Properties are named clearly and minimal in number
- [ ] Documented: what it's for, when to use it, when not to

### When to Create a Component vs. Just Build It

**Create a component when:**
- It appears 3+ times in the product
- It has interactive states that need consistency
- Multiple people will build with it

**Just build it when:**
- It's a one-off layout or page-specific element
- It's still being figured out (prototype first, systematize later)
- The overhead of componentizing exceeds the benefit

A design system grows from the product. It doesn't precede it.
