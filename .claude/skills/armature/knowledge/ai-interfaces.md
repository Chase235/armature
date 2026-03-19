# AI Product Interfaces

The best AI products shipping today share a set of emerging patterns that are still being figured out. This document captures what's working, what's not, and the design tensions unique to AI interfaces.

---

## The Core Challenge

AI interfaces must handle what traditional interfaces don't:

- **Variable-length output** — A response might be 2 words or 2000. The layout must accommodate both gracefully.
- **Latency and streaming** — Users watch content appear in real-time. The loading state IS the experience.
- **Uncertainty** — The system might be wrong. The interface must signal confidence without overpromising.
- **Non-determinism** — The same input produces different outputs. Regeneration, branching, and comparison become first-class UI patterns.
- **Multi-modality** — Text, code, images, files, structured data, and tool results all need to live in the same flow.

---

## Conversational Interfaces

### What Claude, ChatGPT, and the Best Chat UIs Get Right

**Input patterns:**
- The input field is the primary UI element — it's where users spend most of their attention. Make it prominent, generous, comfortable.
- Multi-line input with auto-growing height. Never a single-line text field for AI chat.
- File/image attachment inline with the input — not a separate step.
- Clear affordance for what the model can do (context about capabilities without cluttering).
- Keyboard-first: Enter to send, Shift+Enter for newline. Immediate and frictionless.

**Message rendering:**
- Streaming text that appears progressively. Users read along as it generates — this is a feature, not a limitation.
- Code blocks with syntax highlighting and copy-to-clipboard.
- Markdown rendering that feels native to the interface, not like raw HTML.
- Clear visual distinction between user messages and AI responses. Subtle — not garish colored bubbles, but clear enough to scan.
- Proper paragraph spacing in long responses. Wall-of-text is the #1 readability failure.

**Conversation structure:**
- Messages flow vertically. One column. No complex layouts within the conversation stream.
- Scroll position management: auto-scroll during streaming, but stop when the user scrolls up.
- Clear conversation boundaries — new conversation, branch, or context shift.
- History accessible but not dominant — sidebar or drawer for past conversations.

### Emerging Chat Patterns

- **Artifacts / Canvas** — Separating the conversation from the output. Claude's Artifacts, ChatGPT's Canvas. The chat is the dialogue; the artifact is the work product. This split is becoming standard for creative and coding tasks.
- **Tool use visualization** — Showing what the AI is doing (searching, reading, analyzing) during processing. Transparency builds trust.
- **Suggested follow-ups** — Chips or buttons below a response suggesting next questions. Reduces friction for users who don't know what to ask next.
- **Inline citations** — Perplexity pioneered this: numbered references inline with the text, expandable sources. Trust through transparency.

---

## Generation and Creative Interfaces

### What Midjourney, v0, and Creative AI Tools Get Right

**The generation loop:**
1. Input (prompt, reference, constraints)
2. Processing (with progress/preview)
3. Results (grid of options, not single output)
4. Selection and refinement (iterate on the best option)

**Grid presentation:**
- Multiple outputs presented simultaneously for comparison. 2×2 grid for images, tabbed or stacked for code/text.
- Each option should be individually actionable (select, refine, regenerate, download).

**Iteration patterns:**
- Variation: "more like this" — start from a good output and explore nearby.
- Refinement: edit the prompt and regenerate with context carried forward.
- History: branching tree of generations, not a linear sequence.

**Quality signals:**
- Resolution and detail indicators.
- Time-to-generate as implicit quality signal (users learn that longer = more effort = potentially better).
- Clear "done" state — the generation is complete, here's your result.

---

## Command and Agent Interfaces

### What Linear, Raycast, and Notion Get Right

**Command palettes:**
- ⌘K as universal entry point. Fast, keyboard-native, searchable.
- Recent actions and contextual suggestions ranked above all results.
- Fuzzy search — users don't remember exact names.
- Categories and sections within results, but flat execution (select and it happens).

**Inline AI:**
- AI as an action within existing workflow, not a separate mode. Notion's "Ask AI" within any block. Linear's AI-generated summaries on issues.
- The interface doesn't scream "this is AI" — it's just a tool that works.
- Results appear in-place, in the same format as human-created content.

**Agent patterns (emerging):**
- Step-by-step progress for multi-step tasks. Show what's happening, what's next, what's done.
- Interruptible: user can stop, redirect, or modify mid-execution.
- Results surfaced incrementally — don't wait for everything to finish.
- Clear cost/resource signals when the agent is consuming resources.

---

## Search and Answer Interfaces

### What Perplexity, Google AI, and Semantic Search Get Right

**Progressive answer rendering:**
- The answer comes first, sources come second. Invert the traditional search results page.
- Stream the answer with inline citations as it generates.
- Source cards below or beside the answer — visual thumbnails, titles, brief excerpts.

**Follow-up flow:**
- Each answer enables a follow-up question. The interface maintains context.
- Related questions as suggestion chips — discover adjacent information.

**Mixed result types:**
- Text summaries, data tables, images, maps — all in one coherent answer layout.
- Each result type has its own optimal rendering, but they share a consistent container system.

---

## Design Tensions in AI Interfaces

### Control vs. Magic

Users want AI to "just work" but also want to understand and steer it. The best interfaces provide:
- **Default magic** — It works well out of the box with minimal input.
- **Progressive control** — Settings, parameters, system prompts available but not required.
- **Transparency** — Show what the AI considered, not just what it decided.

### Information Density vs. Readability

AI outputs tend to be long. The tension:
- Dense output respects the user's time (don't pad with fluff).
- But dense output is harder to scan and comprehend.
- Solution: Clear typographic hierarchy within responses. Headers, lists, code blocks, emphasis. The response should be scannable even when long.

### Speed vs. Quality

- Streaming gives perceived speed (users see output immediately).
- But streaming also means the user reads partial, potentially wrong content.
- Solution: Stream confidently. If the model needs to "think," show a thinking indicator, not partial garbage.

### Familiar vs. Novel

- Users have mental models from existing software. Respect them.
- But AI enables genuinely new interaction patterns. Don't force them into old paradigms.
- Solution: Familiar chrome (navigation, settings, layout) with novel interaction cores (the AI-specific parts).

---

## Anti-Patterns

Things the worst AI interfaces do:

- **Loading spinners with no progress.** Users don't know if it's 2 seconds or 2 minutes. Show streaming or progress.
- **Walls of text with no structure.** AI-generated content without formatting is hostile to scan.
- **Hiding the prompt.** Users can't iterate if they can't see/edit what they asked.
- **Destructive regeneration.** Replacing the previous output with no way to go back.
- **"AI-powered" badges everywhere.** If everything is labeled "AI," nothing is. Let the capability speak for itself.
- **Modal interruptions.** "Upgrade to use this AI feature" mid-workflow. Disruptive and hostile.
- **Overcomplicated settings.** Temperature, top-p, frequency penalty in the main UI. These belong in advanced settings, if anywhere.
- **No empty state guidance.** A blank chat with a blinking cursor tells users nothing about what's possible.

---

## Accessibility in AI Interfaces

AI interfaces often fail accessibility basics:

- **Streaming content must announce to screen readers** — Use ARIA live regions for streaming text.
- **Generated images need alt text** — The AI can generate this. No excuse for empty alt attributes.
- **Keyboard navigation through results** — Arrow keys through generated options, Enter to select.
- **Focus management after generation** — When new content appears, manage focus so keyboard users aren't lost.
- **Reduced motion for streaming** — Some users experience motion sickness from rapid text appearance. Offer instant-render mode.
- **High contrast for confidence indicators** — If you're using color to signal confidence, it must be distinguishable without color alone.

---

## What to Study

The current gold standard for AI product interfaces, worth studying closely:

| Product | What to Study | Why |
|---------|--------------|-----|
| Claude | Artifact system, conversation density, streaming rendering | Clean separation of dialogue and output |
| Linear | Information density, keyboard-first design, contextual AI | Professional tool that integrates AI without fanfare |
| Figma | Component architecture, collaboration presence, plugin ecosystem | The standard for design tool interfaces |
| Arc | Spatial organization, command bar, tab management | Novel navigation paradigm that works |
| Perplexity | Citation inline rendering, source cards, follow-up flow | Best-in-class search-to-answer interface |
| Raycast | Command palette, extension ecosystem, quick actions | Speed and keyboard-first AI integration |
| Vercel v0 | Generation preview, iteration flow, code-to-visual bridge | Creative AI interface for developers |
| Notion | Block editor, inline AI, database views | Content-first with AI woven in naturally |
| Superhuman | Email AI, keyboard shortcuts, speed optimization | AI that accelerates an existing workflow |
| Midjourney | Grid output, variation flow, community gallery | Generation interface at scale |
