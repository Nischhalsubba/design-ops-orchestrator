# Security Policy

## Supported version

Security fixes are applied to the current `main` branch and its published GitHub Pages release.

## Reporting a vulnerability

Do not open a public issue for suspected vulnerabilities, exposed credentials, or privacy-sensitive findings.

Use GitHub's private vulnerability reporting feature when available. If private reporting is unavailable, contact the repository owner privately through the contact information on the GitHub profile.

Do not include real credentials, personal data, or destructive proof-of-concept material in reports.

## Repository security baseline

Maintained releases are expected to pass dependency auditing, CodeQL analysis, the project lint/build checks, least-privilege workflow permissions, immutable third-party Action pins, and a Node 24 LTS build environment. Credentials and deployment tokens must remain outside source control.

A passing scan is evidence against known issues, not proof that a system is risk-free. New findings are treated as defects and remediated through the normal branch, pull-request, validation, and release process.
