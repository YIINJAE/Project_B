#!/usr/bin/env python3
"""GitHub round coordinator MVP.

Behavior:
- Keep exactly one active round meta issue open.
- A round is complete when open task issues for that round are zero.
- On completion (or cold start), create next round with 4 task issues.
- Dispatch worker workflow once per task issue.
"""

from __future__ import annotations

import json
import os
import re
import sys
import urllib.error
import urllib.parse
import urllib.request
from datetime import datetime, timezone
from typing import Dict, List, Optional

API_BASE = "https://api.github.com"


def require_env(name: str) -> str:
    value = os.getenv(name, "").strip()
    if not value:
        print(f"Missing required env: {name}", file=sys.stderr)
        sys.exit(1)
    return value


REPO = require_env("REPO")
GH_TOKEN = require_env("GH_TOKEN")
DEFAULT_BRANCH = os.getenv("DEFAULT_BRANCH", "main").strip() or "main"
WORKER_WORKFLOW = os.getenv("WORKER_WORKFLOW", "worker.yml").strip() or "worker.yml"
ROUND_SIZE = int(os.getenv("ROUND_SIZE", "4"))


class GitHubClient:
    def __init__(self, repo: str, token: str):
        self.repo = repo
        self.token = token

    def request(
        self,
        method: str,
        path: str,
        params: Optional[Dict[str, str]] = None,
        payload: Optional[Dict] = None,
    ):
        url = f"{API_BASE}{path}"
        if params:
            url += "?" + urllib.parse.urlencode(params)
        data = None
        headers = {
            "Accept": "application/vnd.github+json",
            "Authorization": f"Bearer {self.token}",
            "X-GitHub-Api-Version": "2022-11-28",
            "User-Agent": "round-coordinator-mvp",
        }
        if payload is not None:
            data = json.dumps(payload).encode("utf-8")
            headers["Content-Type"] = "application/json"

        req = urllib.request.Request(url, data=data, method=method, headers=headers)
        try:
            with urllib.request.urlopen(req) as resp:
                body = resp.read().decode("utf-8")
                if not body:
                    return {}
                return json.loads(body)
        except urllib.error.HTTPError as exc:
            details = exc.read().decode("utf-8", errors="ignore")
            print(
                f"GitHub API error {exc.code} {method} {path}: {details}",
                file=sys.stderr,
            )
            raise

    def list_issues(self, state: str = "open", labels: Optional[List[str]] = None) -> List[Dict]:
        params = {
            "state": state,
            "per_page": "100",
        }
        if labels:
            params["labels"] = ",".join(labels)
        return self.request("GET", f"/repos/{self.repo}/issues", params=params)

    def create_issue(self, title: str, body: str, labels: List[str]) -> Dict:
        return self.request(
            "POST",
            f"/repos/{self.repo}/issues",
            payload={"title": title, "body": body, "labels": labels},
        )

    def add_labels(self, issue_number: int, labels: List[str]) -> None:
        self.request(
            "POST",
            f"/repos/{self.repo}/issues/{issue_number}/labels",
            payload={"labels": labels},
        )

    def remove_label(self, issue_number: int, label: str) -> None:
        self.request("DELETE", f"/repos/{self.repo}/issues/{issue_number}/labels/{urllib.parse.quote(label)}")

    def dispatch_workflow(self, workflow_id: str, ref: str, inputs: Dict[str, str]) -> None:
        self.request(
            "POST",
            f"/repos/{self.repo}/actions/workflows/{workflow_id}/dispatches",
            payload={"ref": ref, "inputs": inputs},
        )


ROUND_LABEL_PATTERN = re.compile(r"^round:(\d{4}-\d{2}-\d{2})-(\d{2})$")


def only_real_issues(items: List[Dict]) -> List[Dict]:
    return [i for i in items if "pull_request" not in i]


def extract_round_label(labels: List[Dict]) -> Optional[str]:
    for l in labels:
        name = l.get("name", "")
        if ROUND_LABEL_PATTERN.match(name):
            return name
    return None


def get_active_round_meta(client: GitHubClient) -> Optional[Dict]:
    candidates = only_real_issues(
        client.list_issues(state="open", labels=["round:meta", "round:active"])
    )
    if not candidates:
        return None
    # Keep deterministic when multiple exist unexpectedly.
    candidates.sort(key=lambda x: x.get("number", 0))
    return candidates[0]


def build_next_round_label(existing_open: List[Dict], existing_closed: List[Dict]) -> str:
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    max_seq = 0
    for issue in existing_open + existing_closed:
        for label in issue.get("labels", []):
            name = label.get("name", "")
            match = ROUND_LABEL_PATTERN.match(name)
            if not match:
                continue
            date_part, seq_part = match.groups()
            if date_part == today:
                max_seq = max(max_seq, int(seq_part))
    return f"round:{today}-{max_seq + 1:02d}"


def list_round_tasks_open(client: GitHubClient, round_label: str) -> List[Dict]:
    return only_real_issues(client.list_issues(state="open", labels=[round_label, "round:task"]))


def create_round(client: GitHubClient, round_label: str, round_size: int) -> Dict:
    meta_title = f"[{round_label}] Round Meta"
    meta_body = (
        "Coordinator-owned round metadata issue.\n\n"
        "- This issue represents one active round.\n"
        "- It is marked with `round:active` while in progress.\n"
        "- Round completes when all `round:task` issues in this round are closed."
    )
    meta_issue = client.create_issue(
        title=meta_title,
        body=meta_body,
        labels=["round:meta", "round:active", round_label],
    )

    for agent_id in range(1, round_size + 1):
        agent_label = f"agent:{agent_id}"
        task_title = f"[{round_label}][{agent_label}] Task {agent_id}"
        task_body = (
            f"Round task for `{agent_label}`.\n\n"
            "## Goal\n"
            "- Fill in scoped work for this task.\n\n"
            "## Done Criteria\n"
            "- Open PR from worker branch\n"
            "- Include `Closes #<this-issue-number>` in PR body\n"
            "- Merge after required checks pass\n"
        )
        created = client.create_issue(
            title=task_title,
            body=task_body,
            labels=[round_label, "round:task", agent_label],
        )

        try:
            client.dispatch_workflow(
                workflow_id=WORKER_WORKFLOW,
                ref=DEFAULT_BRANCH,
                inputs={
                    "round_label": round_label,
                    "issue_number": str(created["number"]),
                    "agent_label": agent_label,
                },
            )
            print(f"Dispatched worker for issue #{created['number']} ({agent_label})")
        except urllib.error.HTTPError:
            print(
                "Worker dispatch failed. Check COORDINATOR_TOKEN permissions "
                f"for workflow dispatch. Issue #{created['number']} is still created.",
                file=sys.stderr,
            )

    return meta_issue


def clear_extra_active_rounds(client: GitHubClient, keep_number: int) -> None:
    active = only_real_issues(client.list_issues(state="open", labels=["round:meta", "round:active"]))
    for issue in active:
        number = issue["number"]
        if number == keep_number:
            continue
        try:
            client.remove_label(number, "round:active")
            print(f"Removed duplicate round:active from meta issue #{number}")
        except urllib.error.HTTPError:
            print(f"Failed removing round:active from #{number}", file=sys.stderr)


def main() -> int:
    client = GitHubClient(REPO, GH_TOKEN)

    active_meta = get_active_round_meta(client)
    if active_meta:
        round_label = extract_round_label(active_meta.get("labels", []))
        if not round_label:
            print(
                f"Active meta issue #{active_meta['number']} missing round label pattern.",
                file=sys.stderr,
            )
            return 1

        open_tasks = list_round_tasks_open(client, round_label)
        print(f"Active round {round_label} has {len(open_tasks)} open tasks")
        if open_tasks:
            clear_extra_active_rounds(client, active_meta["number"])
            return 0

        # Round completed.
        try:
            client.remove_label(active_meta["number"], "round:active")
            print(f"Marked round {round_label} as inactive")
        except urllib.error.HTTPError:
            print("Could not remove round:active from completed round", file=sys.stderr)

    open_issues = only_real_issues(client.list_issues(state="open"))
    closed_issues = only_real_issues(client.list_issues(state="closed"))
    next_round = build_next_round_label(open_issues, closed_issues)
    create_round(client, next_round, ROUND_SIZE)
    print(f"Created next round: {next_round}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
