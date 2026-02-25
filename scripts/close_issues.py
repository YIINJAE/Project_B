#!/usr/bin/env python3
"""Close specified GitHub issues with an optional comment.

Usage:
  GH_TOKEN=... REPO=owner/repo python3 scripts/close_issues.py --issues 1,2,3
"""

from __future__ import annotations

import argparse
import json
import os
import urllib.request

API_BASE = "https://api.github.com"


def req(token: str, method: str, path: str, payload: dict | None = None):
    headers = {
        "Accept": "application/vnd.github+json",
        "Authorization": f"Bearer {token}",
        "X-GitHub-Api-Version": "2022-11-28",
        "User-Agent": "issue-closer",
    }
    data = None
    if payload is not None:
        data = json.dumps(payload).encode("utf-8")
        headers["Content-Type"] = "application/json"
    r = urllib.request.Request(f"{API_BASE}{path}", data=data, headers=headers, method=method)
    with urllib.request.urlopen(r) as resp:
        return resp.status


def main() -> int:
    p = argparse.ArgumentParser()
    p.add_argument("--issues", required=True, help="comma separated issue numbers")
    p.add_argument("--comment", default="완료 반영 커밋이 main에 머지되어 이슈를 종료합니다.")
    args = p.parse_args()

    token = os.getenv("GH_TOKEN", "").strip()
    repo = os.getenv("REPO", "").strip()
    if not token or not repo:
        raise SystemExit("Set GH_TOKEN and REPO")

    issue_numbers = [x.strip() for x in args.issues.split(",") if x.strip()]
    for issue in issue_numbers:
        req(token, "POST", f"/repos/{repo}/issues/{issue}/comments", {"body": args.comment})
        req(token, "PATCH", f"/repos/{repo}/issues/{issue}", {"state": "closed"})
        print(f"closed #{issue}")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
