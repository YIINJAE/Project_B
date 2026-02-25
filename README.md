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

1. Add secret:
- `COORDINATOR_TOKEN` (recommended: GitHub App token or fine-grained PAT)

2. Create labels:
- `round:active`, `round:meta`, `round:task`
- `agent:1`, `agent:2`, `agent:3`, `agent:4`

3. Trigger coordinator:
- Run `Round Coordinator` workflow manually once (`workflow_dispatch`)

## One-Command Bootstrap (Labels + Dispatch)

If you already have a token with repo/workflow permissions:

```bash
GH_TOKEN=<your_token> REPO=YIINJAE/Project_B bash scripts/bootstrap_github.sh
```

This script creates required labels (if missing) and triggers `coordinator.yml`.

After that, merged PRs that include `Closes #<issue-number>` will close task issues,
and coordinator creates the next round automatically when all 4 tasks are closed.

## Week1 Run (Brief)

- Static MVP preview:
```bash
python3 -m http.server 4173
```
  Open `http://localhost:4173` in your browser.

- `apps/web` (when present):
```bash
cd apps/web
npm ci
npm run lint
npm run typecheck
npm run build
```
