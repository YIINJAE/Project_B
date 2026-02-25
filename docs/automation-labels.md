# Automation Labels (MVP)

## Required Labels
- `round:active`: exactly one open round meta issue should have this.
- `round:meta`: marks the round meta issue.
- `round:task`: marks task issues generated for a round.
- `round:YYYY-MM-DD-XX`: per-round grouping label.
- `agent:1`, `agent:2`, `agent:3`, `agent:4`: worker ownership.

## Recommended PR Labels
- `review:main-agent`: main-agent review queue for validated worker PRs.
- `policy:scope-passed`: optional signal that PR scope checks succeeded.
- `policy:scope-failed`: optional signal that PR scope checks failed.

## Round Lifecycle
1. Coordinator finds active round meta issue (`round:meta` + `round:active`).
2. If no active round exists, coordinator creates a new round and 4 task issues.
3. Workers open PRs with `Closes #<task-issue>` in body.
4. PR policy workflow validates branch naming and file ownership scope.
5. Coordinator assignment stub posts an idempotent PR comment to notify main agent.
6. On merge, task issue auto-closes.
7. When open task issues for that round become `0`, coordinator starts next round.

## Example Feedback Loop
- Example: Agent 1 completes `index.html` on `agent1/mvp-v2` and reports DONE in `docs/agent-status.md`.
- Main agent uses that DONE payload (branch/hash/files/verification/limits) to validate and merge.
- Other agents treat that status as source-of-truth and avoid editing Agent 1 scope files.

## Secrets
- `COORDINATOR_TOKEN` (recommended): GitHub App token or fine-grained PAT.
  - Needed for reliable workflow dispatch from coordinator to worker workflows.
