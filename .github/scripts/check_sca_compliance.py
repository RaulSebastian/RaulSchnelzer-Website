#!/usr/bin/env python3
"""Validate the SCA exception registry and block release-significant alerts."""

from __future__ import annotations

import json
import os
import sys
import urllib.error
import urllib.parse
import urllib.request
from datetime import date
from pathlib import Path


REPO_ROOT = Path(__file__).resolve().parents[2]
EXCEPTIONS_FILE = REPO_ROOT / "docs" / "sca-exceptions.json"


def fail(message: str) -> None:
    print(f"ERROR: {message}")
    sys.exit(1)


def parse_next_link(link_header: str | None) -> str | None:
    if not link_header:
        return None

    for part in link_header.split(","):
        section = part.strip()
        if 'rel="next"' not in section:
            continue
        start = section.find("<")
        end = section.find(">", start + 1)
        if start != -1 and end != -1:
            return section[start + 1 : end]

    return None


def load_exceptions() -> list[dict]:
    if not EXCEPTIONS_FILE.exists():
        fail(f"Missing exception registry: {EXCEPTIONS_FILE}")

    try:
        data = json.loads(EXCEPTIONS_FILE.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        fail(f"Invalid JSON in {EXCEPTIONS_FILE}: {exc}")

    if not isinstance(data, list):
        fail(f"{EXCEPTIONS_FILE} must contain a JSON array")

    return data


def parse_iso_date(raw: str, field_name: str, index: int) -> date:
    try:
        return date.fromisoformat(raw)
    except ValueError:
        fail(f"Entry {index} has an invalid {field_name}: {raw!r}")


def validate_exceptions(entries: list[dict]) -> dict[str, dict]:
    today = date.today()
    active = {}

    for index, entry in enumerate(entries, start=1):
        if not isinstance(entry, dict):
            fail(f"Entry {index} must be a JSON object")

        entry_type = entry.get("type")
        if entry_type not in {"vulnerability", "license"}:
            fail(f"Entry {index} must set type to 'vulnerability' or 'license'")

        required = ["package", "reason", "approved_by", "approved_on", "expires_on"]
        if entry_type == "vulnerability":
            required.append("id")
        if entry_type == "license":
            required.append("license")

        missing = [field for field in required if not entry.get(field)]
        if missing:
            fail(f"Entry {index} is missing required field(s): {', '.join(missing)}")

        approved_on = parse_iso_date(str(entry["approved_on"]), "approved_on", index)
        expires_on = parse_iso_date(str(entry["expires_on"]), "expires_on", index)
        if expires_on < approved_on:
            fail(f"Entry {index} expires before it was approved")
        if expires_on < today:
            fail(f"Entry {index} has expired and must be removed or renewed")

        if entry_type == "vulnerability":
            active[str(entry["id"]).upper()] = entry

    print(f"Validated {len(entries)} SCA exception entr{'y' if len(entries) == 1 else 'ies'}.")
    return active


def fetch_dependabot_alerts() -> list[dict]:
    token = os.environ.get("GITHUB_TOKEN")
    repository = os.environ.get("GITHUB_REPOSITORY")
    event_name = os.environ.get("GITHUB_EVENT_NAME", "")
    if not token or not repository:
        print("Skipping Dependabot alert verification because GitHub context is unavailable.")
        return []

    alerts = []
    next_url = (
        f"https://api.github.com/repos/{repository}/dependabot/alerts?"
        f"{urllib.parse.urlencode({'state': 'open', 'per_page': 100})}"
    )

    while next_url:
        request = urllib.request.Request(
            next_url,
            headers={
                "Accept": "application/vnd.github+json",
                "Authorization": f"Bearer {token}",
                "X-GitHub-Api-Version": "2022-11-28",
            },
        )

        try:
            with urllib.request.urlopen(request) as response:
                batch = json.loads(response.read().decode("utf-8"))
                next_url = parse_next_link(response.headers.get("Link"))
        except urllib.error.HTTPError as exc:
            body = exc.read().decode("utf-8", errors="replace")
            if exc.code == 403 and event_name == "pull_request":
                print(
                    "Skipping Dependabot alert verification for pull_request because "
                    f"the workflow token cannot access repository alerts ({body})."
                )
                return []
            fail(f"Unable to query Dependabot alerts ({exc.code}): {body}")
        except urllib.error.URLError as exc:
            fail(f"Unable to query Dependabot alerts: {exc}")

        if not batch:
            break

        alerts.extend(batch)

    print(f"Fetched {len(alerts)} open Dependabot alert(s).")
    return alerts


def is_applicable(alert: dict) -> bool:
    advisory = alert.get("security_advisory", {})
    dependency = alert.get("dependency", {})
    severity = str(advisory.get("severity", "")).lower()
    scope = str(dependency.get("scope", "production")).lower()

    if severity == "critical":
        return True
    if severity == "high" and scope != "development":
        return True
    return False


def has_exception(alert: dict, active_exceptions: dict[str, dict]) -> bool:
    advisory = alert.get("security_advisory", {})
    identifiers = [str(advisory.get("ghsa_id", "")).upper()]
    identifiers.extend(
        str(identifier.get("value", "")).upper()
        for identifier in advisory.get("identifiers", [])
        if identifier.get("type") in {"GHSA", "CVE"}
    )

    for identifier in identifiers:
        if identifier and identifier in active_exceptions:
            return True
    return False


def main() -> None:
    active_exceptions = validate_exceptions(load_exceptions())
    alerts = fetch_dependabot_alerts()

    blocking_alerts = []
    for alert in alerts:
        if not is_applicable(alert):
            continue
        if has_exception(alert, active_exceptions):
            continue
        blocking_alerts.append(alert)

    if blocking_alerts:
        print("Found unresolved applicable SCA alerts that block release:")
        for alert in blocking_alerts:
            advisory = alert.get("security_advisory", {})
            dependency = alert.get("dependency", {})
            package_name = dependency.get("package", {}).get("name", "unknown-package")
            scope = dependency.get("scope", "production")
            severity = advisory.get("severity", "unknown")
            ghsa_id = advisory.get("ghsa_id", "unknown-id")
            summary = advisory.get("summary", "No summary provided.")
            print(f"- {ghsa_id} | {severity} | {package_name} | {scope} | {summary}")
        sys.exit(1)

    print("SCA policy compliance check passed.")


if __name__ == "__main__":
    main()
