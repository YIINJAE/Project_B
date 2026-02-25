#!/usr/bin/env python3
"""Create GitHub issues from docs/개발계획서-TODO-스케줄.md.

Usage:
  GH_TOKEN=... REPO=owner/repo python3 scripts/schedule_to_issues.py
  GH_TOKEN=... REPO=owner/repo python3 scripts/schedule_to_issues.py --dry-run
"""

from __future__ import annotations

import argparse
import json
import os
import re
import sys
import urllib.error
import urllib.parse
import urllib.request
from dataclasses import dataclass
from pathlib import Path
from typing import List

API_BASE = "https://api.github.com"
DEFAULT_SCHEDULE_PATH = "docs/개발계획서-TODO-스케줄.md"


@dataclass
class Task:
    week: str
    week_label: str
    title: str
    agent_label: str


def guess_agent_label(task: str) -> str:
    t = task.lower()
    if any(k in t for k in ["ui", "디자인", "레이아웃", "반응형", "컴포넌트", "home", "shop"]):
        return "agent:1"
    if any(k in t for k in ["prisma", "db", "postgres", "api", "관리자", "주문", "재고"]):
        return "agent:2"
    if any(k in t for k in ["결제", "checkout", "cart", "로그인", "mypage", "auth"]):
        return "agent:3"
    return "agent:4"


def parse_schedule(path: Path) -> List[Task]:
    lines = path.read_text(encoding="utf-8").splitlines()
    tasks: List[Task] = []
    current_week = ""
    current_week_label = ""
    week_re = re.compile(r"^## Week\s+(\d+)\s+\(([^)]+)\)\s*-\s*(.+)$")
    todo_re = re.compile(r"^- \[ \] (.+)$")

    for line in lines:
        week_match = week_re.match(line.strip())
        if week_match:
            week_no = week_match.group(1)
            week_name = week_match.group(3).strip()
            current_week = f"Week {week_no} - {week_name}"
            current_week_label = f"week:{week_no}"
            continue
        if not current_week:
            continue
        todo_match = todo_re.match(line.strip())
        if not todo_match:
            continue
        title = todo_match.group(1).strip()
        if title.startswith("`") and title.endswith("`"):
            title = title.strip("`")
        tasks.append(
            Task(
                week=current_week,
                week_label=current_week_label,
                title=title,
                agent_label=guess_agent_label(title),
            )
        )
    return tasks


class GitHubClient:
    def __init__(self, repo: str, token: str):
        self.repo = repo
        self.token = token

    def request(self, method: str, path: str, payload: dict | None = None):
        headers = {
            "Accept": "application/vnd.github+json",
            "Authorization": f"Bearer {self.token}",
            "X-GitHub-Api-Version": "2022-11-28",
            "User-Agent": "schedule-to-issues",
        }
        data = None
        if payload is not None:
            data = json.dumps(payload).encode("utf-8")
            headers["Content-Type"] = "application/json"
        req = urllib.request.Request(f"{API_BASE}{path}", data=data, headers=headers, method=method)
        with urllib.request.urlopen(req) as resp:
            body = resp.read().decode("utf-8")
            return json.loads(body) if body else {}

    def ensure_label(self, name: str, color: str, description: str) -> None:
        path = f"/repos/{self.repo}/labels/{urllib.parse.quote(name, safe='')}"
        try:
            self.request("GET", path)
        except urllib.error.HTTPError as exc:
            if exc.code != 404:
                raise
            self.request(
                "POST",
                f"/repos/{self.repo}/labels",
                {"name": name, "color": color, "description": description},
            )

    def issue_exists(self, title: str) -> bool:
        q = urllib.parse.quote(f'repo:{self.repo} is:issue in:title "{title}"')
        data = self.request("GET", f"/search/issues?q={q}")
        return data.get("total_count", 0) > 0

    def create_issue(self, title: str, body: str, labels: List[str]) -> dict:
        return self.request(
            "POST",
            f"/repos/{self.repo}/issues",
            {"title": title, "body": body, "labels": labels},
        )


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--schedule", default=DEFAULT_SCHEDULE_PATH)
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    schedule_path = Path(args.schedule)
    if not schedule_path.exists():
        print(f"Schedule file not found: {schedule_path}", file=sys.stderr)
        return 1

    tasks = parse_schedule(schedule_path)
    if not tasks:
        print("No TODO tasks found.")
        return 0

    print(f"Parsed {len(tasks)} tasks from {schedule_path}")

    token = os.getenv("GH_TOKEN", "").strip() or os.getenv("COORDINATOR_TOKEN", "").strip()
    repo = os.getenv("REPO", "").strip()
    if args.dry_run:
        for t in tasks[:20]:
            print(f"[DRY] {t.week_label} {t.agent_label} :: {t.title}")
        return 0
    if not token or not repo:
        print("Set GH_TOKEN (or COORDINATOR_TOKEN) and REPO=owner/repo", file=sys.stderr)
        return 1

    client = GitHubClient(repo, token)

    base_labels = [
        ("todo:schedule", "1d76db", "created from schedule document"),
        ("phase:mvp", "0e8a16", "MVP scope"),
        ("week:1", "0052cc", "week 1"),
        ("week:2", "0052cc", "week 2"),
        ("week:3", "0052cc", "week 3"),
        ("week:4", "0052cc", "week 4"),
        ("week:5", "0052cc", "week 5"),
        ("week:6", "0052cc", "week 6"),
        ("agent:1", "5319e7", "worker 1"),
        ("agent:2", "5319e7", "worker 2"),
        ("agent:3", "5319e7", "worker 3"),
        ("agent:4", "5319e7", "worker 4"),
    ]
    for name, color, desc in base_labels:
        client.ensure_label(name, color, desc)

    created = 0
    skipped = 0
    for task in tasks:
        title = f"[{task.week}] {task.title}"
        if client.issue_exists(title):
            skipped += 1
            continue
        body = (
            f"Source: `{schedule_path}`\n\n"
            f"- Week: `{task.week}`\n"
            f"- Suggested owner: `{task.agent_label}`\n\n"
            "## Done Criteria\n"
            "- [ ] 구현 완료\n"
            "- [ ] 테스트/검증 기록\n"
            "- [ ] PR 생성 (`Closes #<issue>`)\n"
        )
        client.create_issue(
            title=title,
            body=body,
            labels=["todo:schedule", "phase:mvp", task.week_label, task.agent_label],
        )
        created += 1
        print(f"Created issue: {title}")

    print(f"Done. created={created}, skipped={skipped}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
