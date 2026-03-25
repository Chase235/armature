# Reflection Protocol — Actionable Design Intelligence

Design iteration produces insight. Without capture, those insights evaporate between sessions. This protocol makes the build-verify loop accumulate knowledge over time.

The core idea comes from GEPA's "Actionable Side Information" — reading full traces (not just pass/fail) to diagnose why something failed and target fixes. In design, the trace is a screenshot critique, not an error log.

---

## The Reflection Log

Every Armature session that involves Figma execution maintains a reflection log. The log lives alongside the work:

```
[project-root]/armature-reflections.jsonl
```

Each entry is a single line of JSON, append-only:

```json
{"ts": "2026-03-24T22:15:00Z", "frame": "mockup-dark-mode", "iteration": 2, "observation": "Nav item spacing at 8px felt cramped — proximity implied the items were grouped when they're independent. Fixed to 12px.", "category": "spacing", "resolved": true}
```

### Fields

| Field | What it captures |
|-------|-----------------|
| `ts` | Timestamp |
| `frame` | Figma frame or component being worked on |
| `iteration` | Which build-verify iteration (1, 2, 3) |
| `observation` | One clear sentence: what was wrong, why it was wrong, what the fix was |
| `category` | One of: `spacing`, `typography`, `color`, `hierarchy`, `alignment`, `density`, `motion`, `component`, `layout`, `accessibility` |
| `resolved` | Whether the issue was fixed in this session |

### When to Write

After **every** verify screenshot where something needs adjustment. The observation should be specific and diagnostic — not "looks off" but "the card title at 14px was the same weight as the body text, breaking the hierarchy. Bumped to 16px semibold."

### When to Read

Before **every** build step in a session, read the last 10 entries from the reflection log. This prevents:
- Repeating the same spacing mistake across frames
- Forgetting a pattern that worked in an earlier iteration
- Losing institutional knowledge about a project's specific quirks

```bash
# Read last 10 reflections
tail -10 armature-reflections.jsonl
```

### When NOT to Write

- Don't log when the verify screenshot looks correct on first pass
- Don't log subjective preferences — only observations grounded in design principles
- Don't log things already documented in the knowledge files (that's what the Coach phase is for)

---

## Integration with Build-Verify Loop

The build-verify loop in `figma-execution.md` becomes:

1. **Screenshot first** — Capture current state
2. **Read reflections** — Load last 10 entries from the log. Note any patterns.
3. **Build** — Execute design code, informed by prior reflections
4. **Verify** — Screenshot the result. Analyze against DESIGN-GOAL criteria if one exists.
5. **Reflect** — If something is off, append a reflection entry before fixing
6. **Iterate** — Fix, re-verify, max 3 iterations per element

Step 2 and 5 are new. Everything else is unchanged.

---

## Session Patterns

Over time, the reflection log reveals recurring issues. Common patterns to watch for:

- **Same category appearing 3+ times** — The knowledge files may be missing guidance in this area. Trigger the Coach phase.
- **Same frame getting 3+ iterations repeatedly** — The design approach may need rethinking, not incremental fixes.
- **Unresolved entries accumulating** — Known issues that need dedicated attention, not drive-by fixes.

---

## Cross-Session Value

The log is project-scoped, not session-scoped. When returning to a project after days or weeks, the reflection log provides:

- A record of what was tricky about this project's design
- Decisions that were made and why
- Issues that were deferred
- Patterns that emerged during execution

This is the design equivalent of git log — not a replacement for the design itself, but the reasoning trail behind it.
