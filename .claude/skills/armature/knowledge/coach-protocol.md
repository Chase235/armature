# Coach Protocol — Self-Improving Knowledge

Armature's knowledge files should be living documents, not static references. The Coach protocol provides a structured way for the skill to propose updates to its own knowledge based on what it learns during design sessions.

This is borrowed from autocontext's multi-role architecture: separate the *doing* from the *learning about the doing*. The Coach phase happens after the work, not during it.

---

## When to Trigger

The Coach phase activates at the end of a significant design session. "Significant" means:

- A new screen or component was built from scratch
- A design pattern was discovered or adapted that isn't in the knowledge files
- The reflection log shows 3+ entries in the same category
- A DESIGN-GOAL criterion was changed because the knowledge was wrong or incomplete
- A novel solution was found that future sessions should know about

The Coach phase is **never automatic**. It always proposes changes and waits for approval.

---

## The Coach Cycle

### 1. Review

Read the session's artifacts:
- Reflection log entries from this session
- DESIGN-GOAL file (especially changed criteria and surprises)
- The Figma work itself (what was built, what patterns emerged)

### 2. Diagnose

Identify knowledge gaps or updates:
- **Missing knowledge** — A design challenge came up that the knowledge files don't address
- **Outdated knowledge** — A recommendation in the files didn't hold up in practice
- **New pattern** — A solution emerged that's reusable and worth codifying
- **Calibration shift** — The gold standards or reference anchors need updating

### 3. Propose

Write a clear, specific proposal. Format:

```markdown
## Coach Proposal: [Title]

**File:** knowledge/[filename].md
**Section:** [section name]
**Action:** add | update | remove

**Current state:**
[What the file currently says, or "not addressed"]

**Proposed change:**
[The specific text to add, modify, or remove]

**Evidence:**
[What happened in the session that supports this change. Reference specific reflection log entries or DESIGN-GOAL notes.]

**Impact:**
[How this change would affect future sessions]
```

### 4. Await Approval

Present the proposal to the user. Do not modify knowledge files without explicit approval. The user may:
- **Approve** — Make the change
- **Modify** — Adjust the proposal before applying
- **Defer** — Save the proposal for later consideration
- **Reject** — The observation was session-specific, not generalizable

### 5. Apply

If approved, make the edit to the knowledge file. Keep changes minimal and targeted — add a paragraph, update a recommendation, add an example. Don't restructure files during Coach phase.

---

## What Gets Updated

### Knowledge Files (most common)

| File | Typical updates |
|------|----------------|
| `foundations.md` | New spacing patterns, typography insights, color combinations that worked |
| `ai-interfaces.md` | New AI product patterns, interaction models, emerging conventions |
| `scalable-systems.md` | Token architecture learnings, component composition patterns |
| `figma-execution.md` | New Figma API techniques, auto-layout patterns, performance tricks |
| `figma-to-code.md` | Translation patterns, edge cases, code architecture insights |
| `code-to-figma.md` | Reconciliation learnings, drift patterns |
| `motion.md` | Animation patterns, timing insights, GSAP techniques |
| `mcp-orchestration.md` | MCP routing discoveries, new composite operations |

### Gold Standards

When exceptional design work is produced during a session, propose adding it to `references/gold-standards/` with a brief annotation explaining *why* it's exceptional and what it demonstrates.

### Reflection Patterns

When the reflection log reveals a recurring pattern across multiple sessions, propose distilling it into the relevant knowledge file. The specific log entries then become historical — the lesson has graduated into permanent knowledge.

---

## What Does NOT Get Updated

- **Doctrine** — The clerestory-workbench doctrine files are upstream of Armature. Coach never modifies them. If a doctrine principle seems wrong, flag it for the user — that's a conversation, not an edit.
- **Protocols** — The reflection, DESIGN-GOAL, and Coach protocols themselves. Changes to how the system works require deliberate restructuring, not incremental drift.
- **Data files** — CSVs are ingested from external sources. Coach doesn't add to them.

---

## Accumulation Over Time

The Coach protocol creates a feedback loop:

```
Build → Verify → Reflect → [session work] → Coach → Knowledge Update
                                                  ↓
                                         Next session starts with
                                         better knowledge
```

Each session makes the next session slightly better. Not through automation, but through structured observation and deliberate knowledge capture. The human stays in the loop as curator — nothing persists without approval.

This is the design equivalent of a practice journal. The work improves because the practitioner's understanding improves, not because an algorithm found a better parameter.
