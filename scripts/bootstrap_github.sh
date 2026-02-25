#!/usr/bin/env bash
set -euo pipefail

REPO="${REPO:-YIINJAE/Project_B}"
GH_TOKEN="${GH_TOKEN:-${COORDINATOR_TOKEN:-}}"
WORKFLOW_ID="${WORKFLOW_ID:-coordinator.yml}"
REF="${REF:-main}"

if [[ -z "$GH_TOKEN" ]]; then
  echo "ERROR: Set GH_TOKEN (or COORDINATOR_TOKEN) first."
  echo "Example: GH_TOKEN=xxxx REPO=YIINJAE/Project_B bash scripts/bootstrap_github.sh"
  exit 1
fi

api() {
  local method="$1"
  local path="$2"
  local body="${3:-}"
  if [[ -n "$body" ]]; then
    curl -sS -X "$method" "https://api.github.com$path" \
      -H "Accept: application/vnd.github+json" \
      -H "Authorization: Bearer $GH_TOKEN" \
      -H "X-GitHub-Api-Version: 2022-11-28" \
      -d "$body"
  else
    curl -sS -X "$method" "https://api.github.com$path" \
      -H "Accept: application/vnd.github+json" \
      -H "Authorization: Bearer $GH_TOKEN" \
      -H "X-GitHub-Api-Version: 2022-11-28"
  fi
}

urlencode() {
  python3 - "$1" <<'PY'
import sys, urllib.parse
print(urllib.parse.quote(sys.argv[1], safe=""))
PY
}

ensure_label() {
  local name="$1"
  local color="$2"
  local desc="$3"
  local encoded
  local check
  encoded="$(urlencode "$name")"
  check="$(api GET "/repos/$REPO/labels/$encoded" || true)"

  if echo "$check" | rg -q "\"name\"\\s*:\\s*\"$name\""; then
    echo "label exists: $name"
  else
    api POST "/repos/$REPO/labels" "{\"name\":\"$name\",\"color\":\"$color\",\"description\":\"$desc\"}" >/dev/null
    echo "label created: $name"
  fi
}

echo "== Creating required labels on $REPO =="
ensure_label "round:active" "d93f0b" "active round meta issue"
ensure_label "round:meta" "5319e7" "round metadata issue"
ensure_label "round:task" "0e8a16" "round task issue"
ensure_label "agent:1" "0052cc" "worker 1"
ensure_label "agent:2" "0052cc" "worker 2"
ensure_label "agent:3" "0052cc" "worker 3"
ensure_label "agent:4" "0052cc" "worker 4"

echo "== Triggering coordinator workflow =="
api POST "/repos/$REPO/actions/workflows/$WORKFLOW_ID/dispatches" "{\"ref\":\"$REF\"}" >/dev/null
echo "workflow dispatched: $WORKFLOW_ID (ref=$REF)"

echo "Done."
