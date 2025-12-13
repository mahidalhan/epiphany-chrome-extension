# Figma MCP Tools - A Twitter Thread

---

**1/**
Figma MCP lets you pull designs directly into code. Four tools, each with a purpose. Here's the breakdown:

---

**2/**
First, understand **nodes**.

Everything in Figma is a node - frames, text, shapes, components.

URL: `?node-id=9-388`
API: `9:388`

Hyphen becomes colon. That's it.

---

**3/**
**Tool 1: `get_screenshot`**

Returns a visual image of the node.

Use it to: See what you're building before writing code.

Think of it as "show me the design."

---

**4/**
**Tool 2: `get_metadata`**

Returns XML structure of all child nodes.

```
<frame id="9:388">
  <frame id="9:389">
    <text id="9:390">
```

Use it to: Map out component hierarchy. Find node IDs of children.

---

**5/**
**Tool 3: `get_design_context`**

The heavy hitter. Returns actual implementable code/specs.

Use it to: Get CSS, dimensions, colors, typography - everything you need to build.

This is your main tool.

---

**6/**
**Tool 4: `get_variable_defs`**

Returns Figma Variables (design tokens).

```json
{
  "Light Blue": "#2E93FF",
  "Fills/Primary": "#78787833"
}
```

Catch: Only works if designer used Figma's variable system. Often returns empty.

---

**7/**
**Parent vs Child nodes**

Parent (full page) → Layout structure, grid gaps, overall spacing

Child (single component) → Clean, focused code for one piece

Best practice: Parent for layout, children for components.

---

**8/**
**My workflow:**

```
1. get_screenshot    → See the design
2. get_metadata      → Find child node IDs
3. get_design_context → Get code (call on each component)
4. get_variable_defs  → Extract tokens (optional)
```

---

**9/**
**Pro tip:**

Building a 3-column dashboard?

```
get_design_context(parent)  → Grid layout
get_design_context(col1)    → <LeftPanel />
get_design_context(col2)    → <MiddlePanel />
get_design_context(col3)    → <RightPanel />
```

Divide and conquer.

---

**10/**
**Quick reference:**

| Want | Tool |
|------|------|
| See the design | `get_screenshot` |
| Find node IDs | `get_metadata` |
| Get code | `get_design_context` |
| Get figma design variables(translates to CSS variables) | `get_variable_defs` |

---

**11/**
That's it. Four tools:
- Screenshot (see)
- Metadata (map)
- Design Context (build)
- Variable Defs (figma design variables(translates to CSS variables))

Start with screenshot, end with design context. Ship it.

---
