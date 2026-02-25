# Project_B

Initial repository setup.

## Round Coordinator MVP

This repository includes an MVP automation loop for 4 workers:
- `.github/workflows/coordinator.yml`
- `.github/workflows/worker.yml`
- `scripts/coordinator.py`
- `.github/pull_request_template.md`
- `docs/automation-labels.md`

## Required Setup

1. Create labels:
- `round:active`, `round:meta`, `round:task`
- `agent:1`, `agent:2`, `agent:3`, `agent:4`

2. Add secret:
- `COORDINATOR_TOKEN` (recommended: GitHub App token or fine-grained PAT)

3. Trigger coordinator:
- Run `Round Coordinator` workflow manually once (`workflow_dispatch`)

After that, merged PRs that include `Closes #<issue-number>` will close task issues,
and coordinator creates the next round automatically when all 4 tasks are closed.
