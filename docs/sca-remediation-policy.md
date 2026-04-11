# SCA Findings Remediation Policy

## Purpose

This policy defines how the project identifies, prioritizes, and remediates Software Composition Analysis (SCA) findings related to third-party dependency vulnerabilities and license compliance.

The goal is to reduce security and legal risk while keeping remediation work proportional to the impact on the project.

## Scope

This policy applies to:

* All direct and transitive third-party dependencies used by the project
* Open source packages, scripts, libraries, and other externally sourced components
* Findings produced by dependency scanners, license scanners, repository alerts, and CI-integrated SCA tooling

## Sources of Findings

SCA findings should be collected from the following sources when available:

* CI/CD-integrated dependency and license scans
* Repository security alerts such as Dependabot or equivalent tooling
* Build-time or pull request scan results
* Periodic manual reviews of dependency manifests and lockfiles

## Release Requirement

Applicable SCA results must be addressed before any release.

A release is blocked when any applicable finding remains unresolved without a current documented exception. In this policy, "applicable" means findings that meet the remediation thresholds below and affect this project's released artifact, dependency graph, or distribution obligations.

## Policy Thresholds

### Vulnerability Findings

The project uses the following default remediation thresholds for security findings:

| Severity | Threshold for action | Required remediation timeline |
| --- | --- | --- |
| Critical | Always remediate | Before release, or within 7 calendar days |
| High | Remediate unless a documented exception is approved | Before release, or within 30 calendar days |
| Medium | Remediate during normal maintenance when a fix is available | Within 90 calendar days |
| Low | Fix opportunistically | Backlog or next dependency maintenance cycle |

Additional rules:

* Any vulnerability with known exploitation, public proof-of-concept exploit code, or direct internet exposure should be treated one level higher when prioritizing.
* Findings in production dependencies take priority over findings limited to development-only dependencies.
* If no patch is available, the finding must still be tracked and mitigated through compensating controls, version pinning, package replacement, or documented risk acceptance.
* Before release, all applicable critical vulnerabilities and all applicable high vulnerabilities must be remediated or covered by an approved, time-bounded exception.

### License Findings

The project uses the following thresholds for license-related findings:

| License classification | Threshold for action | Required response |
| --- | --- | --- |
| Prohibited licenses | Must not be introduced or retained without explicit written approval | Remove, replace, or obtain approval before release |
| Restricted or unknown licenses | Requires review | Triage within 14 calendar days and resolve before release if impact is confirmed |
| Permissive approved licenses | Allowed | No remediation required beyond attribution and notice obligations |

License classification guidance:

* Prohibited licenses include strong copyleft or licenses with obligations that conflict with the project's intended distribution model, unless explicitly approved by the maintainer.
* Restricted or unknown licenses include custom, unclear, missing, or unscanned license metadata.
* Permissive approved licenses include commonly accepted licenses such as MIT, BSD, Apache-2.0, and ISC, subject to their notice requirements.
* Before release, prohibited licenses and unresolved restricted or unknown licenses must be remediated or explicitly approved as an exception.

## Identification Process

1. Run SCA tooling during pull requests, dependency updates, and scheduled maintenance reviews.
2. Record each finding with the affected package, version, dependency path, severity or license classification, and whether the package is runtime or development-only.
3. Deduplicate related findings so remediation can be managed as a single work item when appropriate.
4. Confirm the finding is applicable to this project and not a false positive.

## Prioritization Process

Each confirmed finding should be prioritized using the following factors:

* Severity or license classification
* Whether the dependency is used in production or only in development/test workflows
* Reachability or exploitability in the current application
* Availability of a safe upgrade, patch, or replacement
* Time sensitivity such as an upcoming release or evidence of active exploitation

Priority expectations:

* `P0`: Critical vulnerabilities, prohibited licenses, or findings that block a release
* `P1`: High severity vulnerabilities and restricted licenses that likely require change
* `P2`: Medium severity vulnerabilities and findings with moderate operational risk
* `P3`: Low severity findings and minor cleanup items

## Remediation Process

For each prioritized finding, the maintainer or contributor should:

1. Verify the affected component and identify the smallest safe remediation option.
2. Prefer upgrading to a non-vulnerable or policy-compliant version.
3. If upgrade is not possible, evaluate one of the following:
   * Replace the dependency with a maintained alternative
   * Remove the unused dependency
   * Apply a vendor patch or pin to a safe version
   * Add compensating controls and document temporary risk acceptance
4. Validate that the remediation does not introduce regressions by running the relevant checks for the project.
5. Close the finding only after the dependency graph and scan results confirm the issue is resolved, or after a documented exception is approved.

The release workflow must not proceed until the repository's SCA status checks are passing.

## Exceptions and Risk Acceptance

An exception may be used only when remediation is not currently feasible.

Each exception should document:

* The finding identifier and affected dependency
* Why immediate remediation is not feasible
* The compensating controls in place
* The accepted risk and business justification
* The owner and review date

Exceptions for critical vulnerabilities or prohibited licenses should be rare and require explicit maintainer approval before release.

Approved exceptions must be recorded in [docs/sca-exceptions.json](sca-exceptions.json). Each entry must include:

* `type`: `vulnerability` or `license`
* `id`: advisory identifier such as GHSA or CVE for vulnerabilities
* `license`: license identifier for license exceptions
* `package`: affected dependency
* `reason`: business or technical justification
* `approved_by`: maintainer approving the exception
* `approved_on`: approval date in `YYYY-MM-DD`
* `expires_on`: expiry date in `YYYY-MM-DD`

## Roles and Responsibilities

* Contributors should avoid introducing new findings and should remediate findings caused by their dependency changes.
* Maintainers are responsible for approving exceptions, prioritizing remediation work, and ensuring release-blocking findings are resolved.
* Reviewers should confirm that dependency changes do not introduce unresolved critical or high-risk findings.

## Release Gate

The project should not release when any of the following remain unresolved without an approved exception:

* Critical vulnerabilities
* High vulnerabilities affecting production dependencies
* Prohibited license findings
* Restricted or unknown license findings that have not completed review

The following status checks enforce this gate:

* `SCA Dependency Review` for pull requests, which blocks newly introduced high or critical vulnerabilities and prohibited licenses
* `SCA Release Readiness` for release and pull request workflows, which validates the exception registry and blocks releases when applicable unresolved Dependabot alerts remain open

## Review Cadence

This policy should be reviewed at least annually and whenever the project's dependency management or distribution model changes.
