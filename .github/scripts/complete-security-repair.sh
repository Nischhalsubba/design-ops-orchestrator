#!/usr/bin/env bash
set -uo pipefail

lock=skipped
install=skipped
lint=skipped
build=skipped
todo=skipped
audit=skipped

mkdir -p /tmp/designops-final

rm -f package-lock.json
if timeout 300 env npm_config_fund=false npm_config_audit=false npm install --package-lock-only --ignore-scripts; then
  lock=success
else
  lock=failure
fi

if [ "$lock" = success ]; then
  if timeout 300 env PUPPETEER_SKIP_DOWNLOAD=true PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 npm ci --ignore-scripts --no-audit --no-fund; then
    install=success
  else
    install=failure
  fi
fi

if [ "$install" = success ]; then
  if timeout 180 npm run lint > .final-lint.log 2>&1; then
    lint=success
  else
    lint=failure
  fi

  if timeout 300 npm run build > .final-build.log 2>&1; then
    build=success
  else
    build=failure
  fi

  if timeout 120 npm run todo > .final-todo.log 2>&1; then
    todo=success
  else
    todo=failure
  fi

  timeout 180 npm audit --json > .final-audit.json || true
  if node --input-type=module <<'NODE'
import fs from 'node:fs';
const report = JSON.parse(fs.readFileSync('.final-audit.json', 'utf8'));
const counts = report.metadata?.vulnerabilities ?? {};
const findings = Object.entries(report.vulnerabilities ?? {})
  .filter(([, value]) => ['critical', 'high', 'moderate'].includes(value.severity))
  .map(([name, value]) => ({
    name,
    severity: value.severity,
    direct: Boolean(value.isDirect),
    range: value.range,
    via: (value.via ?? []).map(item => typeof item === 'string' ? item : item.title),
    fixAvailable: value.fixAvailable
  }));
fs.writeFileSync('.final-audit-summary.json', JSON.stringify({ counts, findings }, null, 2) + '\n');
const blocking = (counts.critical ?? 0) + (counts.high ?? 0) + (counts.moderate ?? 0);
if (blocking > 0) process.exit(1);
NODE
  then
    audit=success
  else
    audit=failure
  fi
fi

if [ -f package-lock.json ]; then cp package-lock.json /tmp/designops-final/package-lock.json; fi
for file in .final-lint.log .final-build.log .final-todo.log .final-audit-summary.json; do
  if [ -f "$file" ]; then cp "$file" "/tmp/designops-final/$file"; fi
done

restore_readme_workflow() {
  mkdir -p .github/workflows
  cat > .github/workflows/apply-interactive-readme.yml <<'YAML'
name: Apply designer README standard

on:
  workflow_dispatch:
  schedule:
    - cron: "17 4 * * 0"
  push:
    branches:
      - main
    paths-ignore:
      - README.md
      - .github/README_AUTOMATION_REPORT.md

permissions:
  contents: write

jobs:
  apply:
    permissions:
      contents: write
    uses: Nischhalsubba/Nischhalsubba/.github/workflows/reusable-interactive-readme.yml@main
YAML
}

clean_temporary_files() {
  git rm -f --ignore-unmatch \
    .github/workflows/final-designops-security.yml \
    .github/workflows/temporary-security-validation.yml \
    .final-designops-security-trigger \
    .security-validation-trigger || true
  git rm -f --ignore-unmatch .temporary-security-* .final-designops-* || true
}

git config user.name "github-actions[bot]"
git config user.email "41898282+github-actions[bot]@users.noreply.github.com"

if [ "$lock" = success ] && [ "$install" = success ] && [ "$lint" = success ] && [ "$build" = success ] && [ "$audit" = success ]; then
  git reset --hard
  git clean -fd
  git fetch origin main agent/security-install-repair
  git switch -C main origin/main
  restore_readme_workflow
  git checkout origin/agent/security-install-repair -- \
    .eslintrc.cjs \
    gulpfile.js \
    gulp/tasks/admin.js \
    gulp/tasks/assets.js \
    gulp/tasks/content.js \
    gulp/tasks/lint.js \
    gulp/tasks/markup.js \
    gulp/tasks/media.js \
    gulp/tasks/motion.js \
    gulp/tasks/scripts.js \
    gulp/tasks/server.js \
    gulp/tasks/styles.js \
    gulp/utils/ai-healer.js \
    package.json \
    src/styles/abstracts/_variables.scss \
    stylelint.config.js
  cp /tmp/designops-final/package-lock.json package-lock.json
  clean_temporary_files
  git add -A
  git commit -m "fix: complete DesignOps security repair"
  git push origin HEAD:main
  exit 0
fi

git reset --hard
git clean -fd
git fetch origin main
git switch -C main origin/main
restore_readme_workflow
clean_temporary_files
printf 'repair=agent/security-install-repair\nlock=%s\ninstall=%s\nlint=%s\nbuild=%s\ntodo=%s\naudit=%s\n' "$lock" "$install" "$lint" "$build" "$todo" "$audit" > .final-designops-validation-result.txt
for file in lint build todo; do
  source="/tmp/designops-final/.final-$file.log"
  if [ -f "$source" ]; then cp "$source" ".final-designops-$file.log"; fi
done
if [ -f /tmp/designops-final/.final-audit-summary.json ]; then
  cp /tmp/designops-final/.final-audit-summary.json .final-designops-audit-summary.json
fi
git add -A
git commit -m "Record final DesignOps validation diagnostics"
git push origin HEAD:main
exit 1
