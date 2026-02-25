# Workflow Operating Guide (Main-Agent-Centric MVP)

## Purpose
This guide defines the Git automation flow for worker PR policy checks and main-agent coordination.

## Workflows
- `.github/workflows/coordinator.yml`: round lifecycle coordination.
- `.github/workflows/worker.yml`: worker task execution entrypoint.
- `.github/workflows/pr-policy.yml`: worker PR branch/scope policy and coordinator assignment trigger stub.
- `.github/workflows/schedule-issues.yml`: converts schedule TODO doc into GitHub issues.
- `.github/workflows/weekly-dispatcher.yml`: dispatches open weekly issues to worker workflow.

## Branch Naming Policy
Worker PR branches must follow:
- `agent1/<short-name>`
- `agent2/<short-name>`
- `agent3/<short-name>`
- `agent4/<short-name>`

PRs from non-matching branches fail policy checks.

## Ownership Scope Matrix
- `agent1/*`: may edit `index.html` and `docs/agent-status.md`.
- `agent2/*`: may edit `styles.css` and `docs/agent-status.md`.
- `agent3/*`: may edit `app.js` and `docs/agent-status.md`.
- `agent4/*`: may edit `.github/workflows/*` and `docs/*`.

Out-of-scope file changes fail `PR Policy`.

## Coordinator Assignment Trigger Stub
When a non-draft worker PR passes policy:
- Workflow posts a single marker comment on the PR:
  - `<!-- coordinator-assignment-stub -->`
- Comment signals main agent to assign reviewer/merge order.
- Comment is idempotent; repeated runs do not duplicate it.

## Operating Steps
1. Worker opens PR from `agentN/<short-name>` branch.
2. `PR Policy` validates branch and ownership scope.
3. Main agent checks stub comment and applies coordination actions.
4. Main agent validates output and merges when ready.

## Weekly Planning Automation
1. Update `docs/개발계획서-TODO-스케줄.md`.
2. Trigger `Schedule To Issues` workflow (or wait for weekly schedule).
3. Open schedule issues get labels: `todo:schedule`, `phase:mvp`, `week:n`, `agent:n`.
4. `Weekly Dispatcher` triggers worker workflow for non-dispatched tasks.
5. Worker PR closes issue via `Closes #<issue>`.

## Concrete Example: Agent 1 Completion Feedback
- Completed work: Agent 1 finished `index.html` on `agent1/mvp-v2`.
- Policy expectation: PR is valid only if changed files remain in Agent 1 scope (`index.html` plus `docs/agent-status.md`).
- Cross-agent feedback path:
  1. Agent 1 posts DONE entry in `docs/agent-status.md` with branch, commit hash, changed files, verification, limits.
  2. Main agent relays completion state so other agents avoid overlap.
  3. Agent 4 (automation owner) uses this signal to keep coordinator/docs aligned with real progress.
- Completion contract example payload:
  - Branch name: `agent1/mvp-v2`
  - Commit hash: `<sha>`
  - Changed files: `index.html`, `docs/agent-status.md`
  - Verification summary: status-board flow validated in PR checks
  - Known limitations: list any deferred polish or integration follow-up

## Notes and Limits
- Stub currently comments only; it does not auto-assign users or enforce labels.
- Optional label automation can be added later once org label conventions are finalized.
