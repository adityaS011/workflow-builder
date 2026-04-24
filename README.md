# FlowAI — LLM Workflow Builder

A visual, no-code pipeline builder for composing AI-powered automations. Drag nodes onto a canvas, configure them, connect them, and watch your workflow execute step-by-step with live visual feedback.

> Think Zapier + Make.com, but AI-native.

---

## Screenshots

- **Home** — dashboard of workflows with stats, search, and status tabs
- **Editor** — three-pane canvas (node library · DAG canvas · properties panel)
- **Run** — animated per-node execution with success/error toasts

---

## What it does

Users compose multi-step AI workflows visually:

```
[Trigger] → [LLM Call] → [Transform] → [Condition] ─┬─→ [HTTP] → [Output]
                                                    └─→ [Output]
```

Each node is individually configured (model, prompt, operator, URL, etc.), validated before execution, and runs are animated node-by-node. Workflows persist to `localStorage` and can be exported as JSON.

### Use cases
- Auto-triage inbound support tickets with GPT-4 and escalate urgent ones to Slack
- Summarize meeting recordings / Slack threads into Notion
- Score inbound leads with an LLM and route based on sentiment
- Chain multi-step AI agents with branching logic

---

## Features

| | |
|---|---|
| **Visual DAG editor** | Drag nodes, connect handles, auto-layout |
| **6 LLM-focused node types** | `Trigger`, `LLM Call`, `Transform`, `Condition`, `HTTP`, `Output` |
| **Schema-driven config forms** | Each node type has typed fields validated via Zod |
| **Run simulation** | Topological-sort execution with animated state transitions |
| **Pre-run validation** | Blocks invalid workflows (no trigger, disconnected nodes, etc.) |
| **Inline name editing** | Click the workflow name to rename |
| **Duplicate / Delete / Export** | Full CRUD + JSON export |
| **Status filters** | Draft / Published / Archived tabs |
| **Load sample** | One-click demo workflow (AI Support Ticket Triage) |
| **Toasts & error boundary** | Sonner for feedback, route-level error recovery |
| **Persistent state** | Zustand + localStorage with Zod-validated reads |
| **Dark theme** | Professional indigo-on-graphite palette |

---

## Tech stack

- **Framework:** Next.js 16 (App Router) · React 19 · TypeScript (strict, zero `any`)
- **Canvas:** @xyflow/react (ReactFlow v12)
- **Styling:** Tailwind CSS v4 + custom dark design tokens
- **State:** Zustand (with `persist` + `devtools` middleware)
- **Forms:** react-hook-form + @hookform/resolvers
- **Validation:** Zod
- **Toasts:** Sonner
- **Icons:** Lucide
- **UI primitives:** Radix UI, class-variance-authority

---

## Getting started

### Prerequisites
- Node.js ≥ 20
- npm (or pnpm / bun)

### Install & run

```bash
git clone <your-repo-url>
cd llm-workflow-builder
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build

```bash
npm run build   # production build
npm start       # run production server
npm run lint    # lint the codebase
```

### Try it quickly
1. Click **"Load Sample"** on the home page (violet button, top right)
2. You get a pre-configured 6-node pipeline: *AI Support Ticket Triage*
3. Click **Edit** to open the canvas
4. Click any node to see its config in the right panel
5. Hit the green **Run** button — watch nodes pulse, turn green, and toast on completion

---

## Project structure

Flat, pragmatic, single-domain. No premature feature-slicing.

```
src/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout + Sonner toaster
│   ├── page.tsx                  # Home (workflows list)
│   ├── error.tsx                 # Route-level error boundary
│   ├── not-found.tsx             # 404 page
│   ├── globals.css               # Dark theme + ReactFlow overrides
│   └── workflow/[id]/page.tsx    # Editor route
├── components/
│   ├── home/                     # Home-only components
│   │   ├── stats-bar.tsx
│   │   └── workflow-card.tsx
│   ├── workflow/                 # Editor components
│   │   ├── workflow-editor.tsx   # Thin assembler (~80 lines)
│   │   ├── workflow-header.tsx   # Run / Export / Rename
│   │   ├── workflow-canvas.tsx   # ReactFlow wrapper
│   │   ├── workflow-sidebar.tsx  # Node library
│   │   ├── custom-node.tsx       # Node renderer
│   │   ├── node-properties-panel.tsx  # RHF + Zod config form
│   │   ├── node-field.tsx        # Single form field
│   │   ├── node-meta.ts          # Pure: node visual metadata
│   │   ├── node-fields.ts        # Pure: field definitions per type
│   │   └── node-templates.ts     # Pure: sidebar catalog
│   └── ui/                       # Design-system primitives (shadcn-style)
│       ├── button.tsx
│       ├── card.tsx
│       └── input.tsx
├── hooks/
│   └── use-run-workflow.ts       # Topological-sort runtime
├── lib/
│   ├── utils.ts                  # cn(), generateId(), formatDate()
│   ├── schemas.ts                # Zod schemas (workflow + per-node configs)
│   └── sample-workflow.ts        # Demo workflow factory
├── store/
│   ├── workflow-store.ts         # Workflow CRUD (persisted)
│   └── run-store.ts              # Execution state (not persisted)
└── types/
    └── workflow.ts               # TypeScript contracts
```

**File-size rule:** every file ≤ 120 lines. Forces decomposition.

---

## Architecture

### State management — two stores, by lifecycle
- **`workflow-store`** — persistent domain data (workflows, filters). Saved to localStorage with Zod-validated reads.
- **`run-store`** — ephemeral execution state (active node, completed IDs, errors). Not persisted.

Splitting prevents run-state from polluting saved data and keeps canvas re-renders cheap.

### Data model — DAG as single source of truth
A `Workflow` is a serializable object containing `nodes` + `edges`. The same JSON shape powers:
- UI rendering
- localStorage persistence
- JSON export
- Execution (today simulated, tomorrow server-side)

### Execution runtime
`useRunWorkflow` does:
1. Validates the workflow (trigger exists, output exists, no orphans)
2. Topologically sorts the DAG
3. Iterates node-by-node with simulated latency and a small random-failure rate on LLM/HTTP nodes
4. Emits toasts on start, success, and failure

### Schema-driven nodes
Adding a new node type means touching three **pure data files**:
- `node-meta.ts` — icon, colors, label
- `node-fields.ts` — form field definitions
- `node-templates.ts` — sidebar entry
- `lib/schemas.ts` — Zod validation

Zero component changes required.

### Validation at boundaries
- **Forms:** Zod via `zodResolver`, errors shown inline
- **localStorage reads:** `PersistedStateSchema.safeParse` on hydrate — corrupted data auto-resets

---

## Deployment

### Vercel (recommended)
```bash
npx vercel
```
Or push to GitHub and import on [vercel.com](https://vercel.com). Auto-deploys on push.

### Self-host
```bash
npm run build
npm start   # serves on port 3000
```

---

## Roadmap

This is currently a **frontend-only, client-side** app. Workflows live in each user's browser.

To ship as a SaaS, layers you'd add:
- Real execution runtime (Node.js worker calling actual LLM APIs)
- Database (Postgres via Drizzle or Supabase)
- Auth (Clerk or NextAuth)
- Secrets vault (encrypted API keys)
- Run history + logs
- Dynamic webhook endpoints
- Billing (Stripe)

See architectural notes in the code comments for extension points.

---

## License

MIT (or whatever you choose)
