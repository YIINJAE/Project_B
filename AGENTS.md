# Multi-Agent Operating Rules (Project_B)

This file is authoritative for all worker agents in this repository.

## 1) Roles
- Main Agent: only assigns work, validates outputs, merges branches, and dispatches next tasks.
- Worker Agents: implement only assigned scope on their own branch/worktree.

## 2) Branch and Worktree Isolation
- Each worker must use a dedicated branch and dedicated git worktree.
- Never edit files outside your assigned scope unless explicitly instructed.
- Never run destructive git commands (`reset --hard`, `checkout --`, force-push) unless explicitly instructed.

## 3) Required Start Checklist (Worker)
1. Read this `AGENTS.md` before coding.
2. Confirm your branch/worktree and owned files.
3. Post a short start note in `docs/agent-status.md` under your agent section.

## 4) Communication and Feedback
- Every worker must update `docs/agent-status.md` at least twice:
  - STARTED: planned files + risks
  - DONE: commit hash + test/verification result + handoff notes
- If blocked, write `BLOCKED` with exact reason and what is needed.
- Workers should actively read latest status entries (from main relay) and avoid overlapping edits.

## 5) Scope Ownership (MVP round)
- Agent 1: `index.html` structure/content.
- Agent 2: `styles.css` visual system/responsive/motion.
- Agent 3: `app.js` interactions and progressive enhancement.
- Agent 4: `.github/workflows/*`, `docs/*` automation/process docs.
- Main Agent: integration checks and merge only.

## 6) Quality Gate (before handoff)
- Keep files ASCII by default.
- Ensure mobile + desktop behavior.
- No placeholder lorem text in final output.
- Add concise comments only when logic is non-obvious.
- Provide concrete validation notes in status.
- All git commit messages must be written in Korean.

## 7) Completion Contract
- Worker final message must include:
  - Branch name
  - Commit hash
  - Changed files
  - Verification summary
  - Any known limitations
