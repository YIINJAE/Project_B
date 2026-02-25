# Automation Labels (MVP)

## Required Labels
- `round:active`: exactly one open round meta issue should have this.
- `round:meta`: marks the round meta issue.
- `round:task`: marks task issues generated for a round.
- `round:YYYY-MM-DD-XX`: per-round grouping label.
- `agent:1`, `agent:2`, `agent:3`, `agent:4`: worker ownership.

## Round Lifecycle
1. Coordinator finds active round meta issue (`round:meta` + `round:active`).
2. If no active round exists, coordinator creates a new round and 4 task issues.
3. Workers open PRs with `Closes #<task-issue>` in body.
4. On merge, task issue auto-closes.
5. When open task issues for that round become `0`, coordinator starts next round.

## Secrets
- `COORDINATOR_TOKEN` (recommended): GitHub App token or fine-grained PAT.
  - Needed for reliable workflow dispatch from coordinator to worker workflows.
