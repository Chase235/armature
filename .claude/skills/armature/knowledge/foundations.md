# Design Foundations

What separates professional interface design from amateur work isn't talent or taste — it's discipline around a small number of fundamentals. Master these and you can design anything.

---

## Space

Space is the most powerful and most underused element in interface design. It's not the absence of content — it's an active design material.

### Spacing System

Use a base-8 system. Every spacing value should be a multiple of 4 or 8:

```
4  — Tightest: between icon and label, within compact elements
8  — Tight: between related items in a group, small padding
12 — Comfortable: between list items, form field internal padding
16 — Standard: between sections within a card, paragraph spacing
20 — Roomy: card padding, input padding
24 — Open: between cards, between major content blocks
32 — Section: between distinct page sections
48 — Generous: major section separators
64 — Landmark: page-level section breaks
```

### When to Break the System

Optical alignment sometimes requires values outside the system. A centered icon in a button might need 11px instead of 12px to look centered. **Trust your eyes over the numbers**, but only after the system gets you close.

### Whitespace Principles

- **More space, not less.** When in doubt, add space. Dense interfaces should feel intentionally dense, not accidentally crowded.
- **Proximity implies relationship.** Things that are close together are perceived as related. Things far apart are perceived as separate. Use this.
- **Uneven distribution creates hierarchy.** More space above a heading than below it signals that the heading belongs to the content below.
- **Edge padding > internal spacing.** The outer padding of a container should feel at least as generous as the internal gaps. A card with 12px gaps needs at least 16-20px padding.

---

## Typography

Type carries 90% of the information in most interfaces. Getting it right is the highest-leverage design decision.

### Type Scale

Don't invent arbitrary sizes. Use a constrained scale:

```
12px  — Captions, labels, badges, metadata
13px  — Secondary body, helper text, descriptions
14px  — Default body text for product UI
16px  — Emphasized body, comfortable reading
18px  — Subheadings, card titles
20px  — Section headings
24px  — Page titles, major headings
32px  — Display headings
```

### Hierarchy Through Weight, Not Size

The mark of amateur design: making things bigger to make them "more important." Professional hierarchy uses weight and color first, size second:

```
Primary:   14px, Semi Bold, #111827
Secondary: 14px, Regular,   #6B7280
Tertiary:  13px, Regular,   #9CA3AF
```

Three levels of hierarchy at nearly the same size. The eye distinguishes them instantly.

### Line Height

- **Body text:** 1.5× the font size (14px text → 21px line height)
- **Headings:** 1.2–1.3× (tighter — headings don't need reading rhythm)
- **UI labels:** 1.0–1.3× (compact, functional)

### Letter Spacing

- **Large headings (24px+):** Tighten. -0.01em to -0.02em. Large text has too much optical space.
- **Body text (14-16px):** Leave at default or 0.
- **Small labels (11-12px):** Loosen. +0.02em to +0.04em. Small text needs room to breathe.

### Font Selection for Interfaces

**Safe defaults:** Inter, SF Pro, system-ui. These are designed for screens and work at every size.

**Personality through restraint:** One sans-serif for the interface. Optionally one serif or mono for contrast — in pull quotes, code blocks, or data displays. Never three families.

---

## Color

### Functional Color System

Interface color isn't decorative. Every color should have a job:

```
Neutral scale:   Backgrounds, surfaces, borders, text
Primary:         Actions, links, focus states, key UI elements
Success/Green:   Positive states, confirmations, growth indicators
Warning/Amber:   Caution states, approaching limits
Error/Red:       Destructive actions, validation errors, failures
Info/Blue:       Informational states, help text, neutral callouts
```

### Neutral Scale (The Foundation)

A good neutral scale is the difference between a polished interface and a flat one:

```
50   — Page background (light mode), hover states
100  — Card backgrounds, secondary surfaces
200  — Borders, dividers, subtle backgrounds
300  — Disabled states, placeholder text backgrounds
400  — Placeholder text, disabled icons
500  — Secondary text, captions
600  — Body text (accessible on white)
700  — Primary text emphasis
800  — Headings, high-emphasis text
900  — Maximum contrast text, hero elements
950  — Near-black, used sparingly
```

### Color Application Rules

- **Text:** Never pure black (#000). Use #111827 or #18181B — they're easier on the eyes.
- **Backgrounds:** Never pure white (#FFF) for page backgrounds. Use #FAFAFA or #FAFBFC. Cards on top can be #FFFFFF.
- **Borders:** Keep subtle. #E5E7EB or lower opacity black. Borders should separate, not compete.
- **Interactive color:** Use your primary hue for clickable elements. Users learn "blue things are clickable" (or whatever your primary is).
- **Red means destructive.** Reserve red for errors and destructive actions. Using it decoratively trains users to ignore it.

### Contrast

WCAG AA minimums:
- **Body text:** 4.5:1 against its background
- **Large text (18px+ bold, 24px+ regular):** 3:1
- **UI elements (icons, borders, form fields):** 3:1

### Dark Mode

Dark mode isn't "invert everything." It's a separate design exercise:

- **Background:** #0A0A0A to #1A1A2E — not pure black, which is too harsh.
- **Surfaces:** Lighter than background (#1E1E1E, #262626). Elevation = lightness in dark mode.
- **Text:** #F9FAFB for primary, #A1A1AA for secondary. Not pure white.
- **Borders:** Lower opacity (white at 10-15%). Same structural role, different execution.
- **Shadows:** Nearly invisible in dark mode — use border or surface lightness for depth instead.

---

## Hierarchy

The eye should know where to look without thinking. If a user needs to scan the whole screen to find what matters, the hierarchy has failed.

### Tools for Hierarchy (In Order of Subtlety)

1. **Position** — Top-left gets read first (in LTR). Put the most important thing there.
2. **Size** — Larger elements draw the eye. Use sparingly — one large thing per viewport.
3. **Weight** — Bold vs. regular creates instant contrast without changing size.
4. **Color** — Darker = more important. Lighter gray = less important. Chromatic color = actionable.
5. **Space** — Isolated elements draw attention. Crowded elements recede.
6. **Depth** — Elevated elements (shadows) feel closer, more important.

### Information Hierarchy Patterns

**Z-Pattern:** For marketing pages, landing pages. Eye moves: top-left → top-right → bottom-left → bottom-right.

**F-Pattern:** For content-heavy pages, dashboards. Eye scans: across the top, then down the left edge, scanning right at each row.

**Single-Column:** For focused tasks — forms, articles, conversations. The simplest and most underused pattern.

---

## Density

### The Density Spectrum

| Use Case | Density | Spacing | Font Size |
|----------|---------|---------|-----------|
| Marketing / Landing | Low | 48–96px sections | 16–18px body |
| Documentation / Content | Medium-Low | 32–48px sections | 15–16px body |
| Product UI / Dashboard | Medium | 16–32px sections | 13–14px body |
| Data Tables / Admin | Medium-High | 8–16px rows | 12–13px body |
| IDE / Terminal / Pro Tools | High | 4–8px rows | 12–13px mono |

### Choosing Density

Match the density to **how often the user visits and how much information they need to compare**.

- First-time visitors need low density (breathing room to orient).
- Power users who visit daily need higher density (less scrolling, more information per viewport).
- Data comparison tasks need high density (patterns emerge when data points are close).

---

## Containers

### When to Use a Container

- To group related content (cards, panels, modals)
- To create surface elevation (card on background)
- To establish a bounded interaction zone (form, dialog)

### When NOT to Use a Container

- When content grouping is already clear from proximity and spacing
- When the container adds visual noise without adding clarity
- When nesting containers more than 2 levels deep — flatten instead

### Container Styling

```
Subtle:    1px border, no shadow, slight background tint
Standard:  No border, layered shadow (0.04-0.08 opacity), white fill
Elevated:  Larger shadow, white fill — for modals, popovers, floating UI
Inset:     Darker background than parent, no shadow — for code blocks, input fields
```

### Card Anatomy

A well-structured card has consistent internal spacing:
- **Padding:** 16–24px (all sides equal, or top/bottom slightly more than left/right)
- **Internal gaps:** 8–16px between content groups
- **Visual separator:** Optional — a 1px divider or just extra space
- **Corner radius:** 8–16px for cards, 4–8px for nested elements within cards

---

## Motion

### Purpose-Driven Animation

Every animation should serve a purpose:
- **Entrance:** Where did this element come from? (Slide in from source direction)
- **Exit:** Where is it going? (Fade out, slide toward destination)
- **State change:** What changed? (Color transition, size shift)
- **Feedback:** Was my action received? (Button press, loading state)

### Timing

```
Micro-interactions:  100–200ms  (button hover, toggle, color change)
Transitions:         200–350ms  (panel open, page transition, modal)
Complex animations:  350–500ms  (multi-step, choreographed sequences)
```

**Rule: Exits should be faster than entrances.** Enter at 250ms, exit at 150ms. Slow entrances feel deliberate. Slow exits feel sluggish.

### Easing

- **ease-out** for entrances (elements arriving — fast start, gentle stop)
- **ease-in** for exits (elements leaving — gentle start, fast end)
- **ease-in-out** for state changes (transforms, repositioning)
- **Never linear** for UI motion. Linear feels mechanical and unnatural.

### Reduced Motion

Always respect `prefers-reduced-motion`. Replace motion with instant state changes or opacity crossfades. This isn't optional — it's an accessibility requirement.
