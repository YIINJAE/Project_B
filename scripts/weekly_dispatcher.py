#!/usr/bin/env python3
"""Dispatch open weekly TODO issues to worker workflow by agent label."""

from __future__ import annotations

import json
import os
import re
import urllib.parse
import urllib.request
from typing import Dict, List

API_BASE = "https://api.github.com"
REPO = os.getenv("REPO", "").strip()
GH_TOKEN = os.getenv("GH_TOKEN", "").strip()
DEFAULT_BRANCH = os.getenv("DEFAULT_BRANCH", "main").strip() or "main"
WORKER_WORKFLOW = os.getenv("WORKER_WORKFLOW", "worker.yml").strip() or "worker.yml"
WEEK_RE = re.compile(r"^week:(\d+)$")


def req(method: str, path: str, payload: Dict | None = None):
    headers = {
        "Accept": "application/vnd.github+json",
        "Authorization": f"Bearer {GH_TOKEN}",
        "X-GitHub-Api-Version": "2022-11-28",
        "User-Agent": "weekly-dispatcher",
    }
    data = None
    if payload is not None:
        data = json.dumps(payload).encode("utf-8")
        headers["Content-Type"] = "application/json"
    r = urllib.request.Request(f"{API_BASE}{path}", data=data, headers=headers, method=method)
    with urllib.request.urlopen(r) as resp:
        body = resp.read().decode("utf-8")
        return json.loads(body) if body else {}


def list_open_todos() -> List[Dict]:
    params = urllib.parse.urlencode(
        {"state": "open", "labels": "todo:schedule,phase:mvp", "per_page": "100"}
    )
    data = req("GET", f"/repos/{REPO}/issues?{params}")
    return [i for i in data if "pull_request" not in i]


def label_names(issue: Dict) -> List[str]:
    return [x.get("name", "") for x in issue.get("labels", [])]


def get_agent_label(names: List[str]) -> str:
    for n in names:
        if n.startswith("agent:"):
            return n
    return "agent:4"


def get_week_label(names: List[str]) -> str:
    for n in names:
        if WEEK_RE.match(n):
            return n
    return "week:1"


def already_dispatched(issue: Dict) -> bool:
    return "dispatched" in label_names(issue)


def dispatch(issue: Dict, agent_label: str, week_label: str):
    req(
        "POST",
        f"/repos/{REPO}/actions/workflows/{WORKER_WORKFLOW}/dispatches",
        {
            "ref": DEFAULT_BRANCH,
            "inputs": {
                "round_label": week_label,
                "issue_number": str(issue["number"]),
                "agent_label": agent_label,
            },
        },
    )
    req(
        "POST",
        f"/repos/{REPO}/issues/{issue['number']}/labels",
        {"labels": ["dispatched"]},
    )
    req(
        "POST",
        f"/repos/{REPO}/issues/{issue['number']}/comments",
        {
            "body": (
                f"Auto-dispatched by weekly dispatcher.\n\n"
                f"- agent: `{agent_label}`\n"
                f"- week: `{week_label}`\n"
                f"- worker workflow: `{WORKER_WORKFLOW}`"
            )
        },
    )


def ensure_dispatched_label():
    encoded = urllib.parse.quote("dispatched", safe="")
    try:
        req("GET", f"/repos/{REPO}/labels/{encoded}")
    except Exception:
        req(
            "POST",
            f"/repos/{REPO}/labels",
            {"name": "dispatched", "color": "fbca04", "description": "already sent to worker workflow"},
        )


def main():
    if not REPO or not GH_TOKEN:
        print("Missing REPO or GH_TOKEN")
        return 1
    ensure_dispatched_label()
    issues = list_open_todos()
    count = 0
    for issue in issues:
        if already_dispatched(issue):
            continue
        names = label_names(issue)
        agent = get_agent_label(names)
        week = get_week_label(names)
        dispatch(issue, agent, week)
        count += 1
        print(f"Dispatched #{issue['number']} -> {agent} ({week})")
    print(f"Done, dispatched={count}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
