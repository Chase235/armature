# Motion — GSAP in React

GSAP is the professional animation library. It's what studios use when CSS transitions aren't enough — when you need precise timeline control, scroll-driven choreography, physics-based easing, or complex sequencing across multiple elements.

This is the execution reference for implementing motion in React with GSAP, Tailwind, and modern component architecture.

---

## Setup

### Installation

```bash
pnpm add gsap
```

GSAP's core is free. For ScrollTrigger, Flip, SplitText, and other plugins:

```bash
# These are included in gsap — just register them
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Flip } from 'gsap/Flip'

gsap.registerPlugin(ScrollTrigger, Flip)
```

### React Integration Pattern

GSAP operates on DOM nodes. In React, that means refs and cleanup.

```tsx
import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'

export function FadeIn({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(ref.current, {
        opacity: 0,
        y: 20,
        duration: 0.5,
        ease: 'power2.out',
      })
    }, ref)

    return () => ctx.revert() // cleanup on unmount
  }, [])

  return <div ref={ref}>{children}</div>
}
```

**Critical:** Always use `gsap.context()` and clean up with `ctx.revert()`. This prevents memory leaks and animation conflicts when components unmount and remount.

### The useGSAP Hook

For cleaner integration, use GSAP's official React hook:

```bash
pnpm add @gsap/react
```

```tsx
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'

export function AnimatedCard() {
  const container = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    gsap.from('.card-title', { opacity: 0, y: 10, duration: 0.4 })
    gsap.from('.card-body', { opacity: 0, y: 10, duration: 0.4, delay: 0.1 })
  }, { scope: container }) // scopes all selectors to this container

  return (
    <div ref={container}>
      <h2 className="card-title">Title</h2>
      <p className="card-body">Content</p>
    </div>
  )
}
```

`useGSAP` handles context creation and cleanup automatically. Scope ensures `.card-title` only matches within this component, not globally.

---

## Page Transitions

### Route-Level Enter/Exit

For page transitions in React Router or Next.js, animate the outgoing page out and the incoming page in.

```tsx
import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'

export function PageWrapper({ children }: { children: React.ReactNode }) {
  const pageRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    gsap.from(pageRef.current, {
      opacity: 0,
      y: 24,
      duration: 0.4,
      ease: 'power2.out',
    })
  }, { scope: pageRef })

  return (
    <div ref={pageRef} className="min-h-screen">
      {children}
    </div>
  )
}
```

### Cross-Fade Between Pages

For smoother transitions where both pages are briefly visible:

```tsx
export function usePageTransition() {
  const navigate = useNavigate()

  const transitionTo = (path: string) => {
    const page = document.querySelector('[data-page]')
    if (!page) { navigate(path); return }

    gsap.to(page, {
      opacity: 0,
      y: -12,
      duration: 0.25,
      ease: 'power2.in',
      onComplete: () => navigate(path),
    })
  }

  return { transitionTo }
}
```

### Staggered Page Content

The most polished entrance: elements stagger in sequentially.

```tsx
useGSAP(() => {
  const tl = gsap.timeline({ defaults: { ease: 'power2.out' } })

  tl.from('[data-animate="header"]', {
    opacity: 0, y: 16, duration: 0.4,
  })
  .from('[data-animate="metrics"]', {
    opacity: 0, y: 20, duration: 0.4,
  }, '-=0.2') // overlap by 200ms
  .from('[data-animate="card"]', {
    opacity: 0, y: 20, stagger: 0.08, duration: 0.4,
  }, '-=0.2')
  .from('[data-animate="table"]', {
    opacity: 0, y: 20, duration: 0.4,
  }, '-=0.15')
}, { scope: pageRef })
```

Use `data-animate` attributes in JSX to mark animated elements without coupling to CSS class names.

---

## Scroll-Triggered Animations

### Basic Scroll Reveal

Elements animate into view as the user scrolls to them.

```tsx
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)

useGSAP(() => {
  gsap.utils.toArray<HTMLElement>('[data-scroll-reveal]').forEach((el) => {
    gsap.from(el, {
      opacity: 0,
      y: 30,
      duration: 0.6,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',    // trigger when top of element hits 85% of viewport
        toggleActions: 'play none none none', // play once, don't reverse
      },
    })
  })
}, { scope: containerRef })
```

### Scroll-Linked Progress

Elements that animate *as* you scroll, tied to scroll position rather than triggered once.

```tsx
useGSAP(() => {
  gsap.to('.progress-bar', {
    scaleX: 1,
    ease: 'none',
    scrollTrigger: {
      trigger: '.content-section',
      start: 'top top',
      end: 'bottom bottom',
      scrub: true, // ties animation directly to scroll position
    },
  })
}, { scope: containerRef })
```

### Parallax

Subtle depth effect on scroll.

```tsx
useGSAP(() => {
  gsap.to('.hero-bg', {
    y: -100,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true,
    },
  })
}, { scope: containerRef })
```

### Pin and Sequence

Pin a section in place while content animates within it.

```tsx
useGSAP(() => {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: '.feature-section',
      start: 'top top',
      end: '+=300%',  // scroll distance for the full sequence
      pin: true,
      scrub: 1,       // smooth scrub with 1s catch-up
    },
  })

  tl.from('.feature-1', { opacity: 0, y: 40 })
    .to('.feature-1', { opacity: 0, y: -40 })
    .from('.feature-2', { opacity: 0, y: 40 })
    .to('.feature-2', { opacity: 0, y: -40 })
    .from('.feature-3', { opacity: 0, y: 40 })
}, { scope: containerRef })
```

---

## Micro-Interactions

### Hover Effects

For simple hover states, CSS transitions are usually better (no JS overhead). Use GSAP when the hover effect is complex or sequenced.

```tsx
// CSS transition (prefer for simple hovers)
<div className="transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5">

// GSAP for complex hover (multi-property sequence)
const cardRef = useRef<HTMLDivElement>(null)

const handleMouseEnter = () => {
  gsap.to(cardRef.current, {
    y: -4,
    boxShadow: '0 12px 24px rgba(0,0,0,0.08)',
    duration: 0.25,
    ease: 'power2.out',
  })
  gsap.to(cardRef.current.querySelector('.card-arrow'), {
    x: 4,
    opacity: 1,
    duration: 0.2,
    ease: 'power2.out',
  })
}

const handleMouseLeave = () => {
  gsap.to(cardRef.current, {
    y: 0,
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
    duration: 0.2,
    ease: 'power2.in',
  })
  gsap.to(cardRef.current.querySelector('.card-arrow'), {
    x: 0,
    opacity: 0.5,
    duration: 0.15,
    ease: 'power2.in',
  })
}
```

### Button Press

Micro-scale feedback on click.

```tsx
const handleClick = (e: React.MouseEvent) => {
  gsap.fromTo(e.currentTarget,
    { scale: 1 },
    { scale: 0.97, duration: 0.1, yoyo: true, repeat: 1, ease: 'power2.inOut' }
  )
}
```

### Toggle / Expand-Collapse

```tsx
const [isOpen, setIsOpen] = useState(false)
const contentRef = useRef<HTMLDivElement>(null)

const toggle = () => {
  if (isOpen) {
    gsap.to(contentRef.current, {
      height: 0,
      opacity: 0,
      duration: 0.3,
      ease: 'power2.inOut',
      onComplete: () => setIsOpen(false),
    })
  } else {
    setIsOpen(true)
    gsap.fromTo(contentRef.current,
      { height: 0, opacity: 0 },
      { height: 'auto', opacity: 1, duration: 0.35, ease: 'power2.out' }
    )
  }
}
```

### Number Counter

Animated metric values (dashboards, stats).

```tsx
export function AnimatedNumber({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null)

  useGSAP(() => {
    gsap.from(ref.current, {
      innerText: 0,
      duration: 1.2,
      ease: 'power2.out',
      snap: { innerText: 1 },
      // For formatted numbers, use onUpdate with a proxy object instead
    })
  }, [value])

  return <span ref={ref}>{value}</span>
}
```

---

## Layout Animations with Flip

GSAP's Flip plugin handles layout transitions — when elements change position, size, or parent in the DOM.

```tsx
import { Flip } from 'gsap/Flip'
gsap.registerPlugin(Flip)

const handleReorder = () => {
  // Capture current state
  const state = Flip.getState('.grid-item')

  // Make the DOM change (reorder, resize, reparent)
  setItems(newOrder)

  // Animate from old positions to new
  requestAnimationFrame(() => {
    Flip.from(state, {
      duration: 0.5,
      ease: 'power2.inOut',
      stagger: 0.03,
      absolute: true, // prevents layout shift during animation
    })
  })
}
```

Use Flip for:
- Filtering/sorting grid items
- Expanding cards to full-screen
- Moving elements between containers
- Any layout change that would otherwise "jump"

---

## Timelines — Choreographing Sequences

### Basic Timeline

```tsx
useGSAP(() => {
  const tl = gsap.timeline({
    defaults: {
      duration: 0.4,
      ease: 'power2.out',
    },
  })

  tl.from('.hero-title', { opacity: 0, y: 30 })
    .from('.hero-subtitle', { opacity: 0, y: 20 }, '-=0.2')
    .from('.hero-cta', { opacity: 0, y: 20 }, '-=0.15')
    .from('.hero-image', { opacity: 0, scale: 0.95 }, '-=0.2')
}, { scope: heroRef })
```

### Position Parameter

The position parameter controls timing within a timeline:

```
'-=0.2'     // 200ms before previous tween ends (overlap)
'+=0.1'     // 100ms after previous tween ends (gap)
'<'         // same start time as previous tween
'<+=0.1'    // 100ms after previous tween starts
2           // absolute time: 2 seconds into the timeline
```

### Labels

For complex sequences, use labels as anchors:

```tsx
tl.addLabel('enter')
  .from('.nav', { opacity: 0, y: -20 }, 'enter')
  .from('.sidebar', { opacity: 0, x: -20 }, 'enter+=0.1')
  .from('.content', { opacity: 0 }, 'enter+=0.2')
  .addLabel('content-ready')
  .from('.card', { opacity: 0, y: 20, stagger: 0.06 }, 'content-ready')
```

---

## Easing Reference

### Common Eases

| Ease | Feel | Use For |
|------|------|---------|
| `power1.out` | Gentle deceleration | Subtle fades, color changes |
| `power2.out` | Natural deceleration | Most entrances, reveals |
| `power3.out` | Snappy arrival | Attention-grabbing entrances |
| `power2.inOut` | Smooth start and stop | Layout transitions, repositioning |
| `power2.in` | Acceleration | Exits (element leaving) |
| `back.out(1.4)` | Slight overshoot | Playful entrances, bouncy UI |
| `elastic.out(1, 0.5)` | Spring-like | Toggle switches, playful elements |
| `expo.out` | Sharp deceleration | Dramatic reveals |
| `none` | Linear (constant speed) | Scroll-linked animations only |

### Custom Easing

```tsx
gsap.to(el, {
  x: 100,
  ease: 'cubic-bezier(0.22, 1, 0.36, 1)', // CSS-style
})

// Or register a custom ease
gsap.registerEase('smooth', function(progress) {
  return progress * progress * (3 - 2 * progress) // smoothstep
})
```

---

## Reduced Motion

Non-negotiable. Always respect the user's motion preference.

```tsx
// Global check — set once at app root
const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches

if (prefersReducedMotion) {
  gsap.globalTimeline.timeScale(100) // effectively instant
  // Or disable ScrollTrigger animations
  ScrollTrigger.config({ limitCallbacks: true })
}
```

Per-animation check:

```tsx
useGSAP(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (reduced) {
    // Instant state — no animation, just set final values
    gsap.set('.card', { opacity: 1, y: 0 })
  } else {
    gsap.from('.card', { opacity: 0, y: 20, stagger: 0.08, ease: 'power2.out' })
  }
}, { scope: containerRef })
```

---

## Performance

### Rules

1. **Animate transforms and opacity only** when possible. These are GPU-composited. Animating `width`, `height`, `padding`, `margin` causes layout reflow — expensive.

2. **Use `will-change` sparingly.** Only on elements about to animate, and remove it after.

3. **Kill unused ScrollTriggers.** They add scroll listeners. Clean up when components unmount (handled automatically by `useGSAP` and `gsap.context`).

4. **Stagger instead of simultaneous.** 20 elements animating at once is heavier than 20 elements staggered over 500ms — and looks better.

5. **Use `gsap.ticker` for frame-synced updates** instead of `requestAnimationFrame` directly.

6. **Lazy-register plugins.** Only import and register ScrollTrigger, Flip, etc. in components that use them.

### Debugging

```tsx
// Slow down all animations globally
gsap.globalTimeline.timeScale(0.2)

// Inspect a specific animation
const tween = gsap.from(el, { x: 100 })
console.log(tween.duration(), tween.progress())

// ScrollTrigger markers (dev only)
ScrollTrigger.create({
  trigger: '.section',
  markers: true, // shows start/end markers on screen
})
```

---

## Figma to GSAP Translation

Figma's prototype transitions provide motion hints. Map them to GSAP:

| Figma Transition | GSAP Implementation |
|-----------------|---------------------|
| Dissolve | `gsap.from(el, { opacity: 0, duration: 0.3 })` |
| Move in (from right) | `gsap.from(el, { x: 40, opacity: 0, duration: 0.4, ease: 'power2.out' })` |
| Move in (from bottom) | `gsap.from(el, { y: 40, opacity: 0, duration: 0.4, ease: 'power2.out' })` |
| Push (replace) | Timeline: `tl.to(old, { x: -40, opacity: 0 }).from(new, { x: 40, opacity: 0 })` |
| Smart animate | Flip plugin — captures state before/after and animates the diff |
| Scale up | `gsap.from(el, { scale: 0.9, opacity: 0, duration: 0.35, ease: 'power2.out' })` |
| Spring | `gsap.from(el, { y: 30, ease: 'back.out(1.4)', duration: 0.5 })` |

When the design doesn't specify motion, use these defaults:

- **Page entrance:** `y: 20, opacity: 0, duration: 0.4, ease: 'power2.out'`
- **Card stagger:** `y: 16, opacity: 0, stagger: 0.06, ease: 'power2.out'`
- **Modal overlay:** `opacity: 0, duration: 0.25` (backdrop), `y: 20, scale: 0.98, opacity: 0, duration: 0.3` (modal)
- **Sidebar open:** `x: -fullWidth, duration: 0.35, ease: 'power2.inOut'`
- **Tooltip/popover:** `opacity: 0, y: 4, duration: 0.15, ease: 'power2.out'`
