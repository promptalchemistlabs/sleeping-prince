#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=common.sh
source "$SCRIPT_DIR/common.sh"

INSTALL_DEPENDENCIES=1

usage() {
  cat <<'EOF'
Usage: ./scripts/build.sh [--skip-install]

Install exact dependencies, validate the website, and create website/dist.

Options:
  --skip-install  Reuse the existing website/node_modules directory.
  -h, --help      Show this help.
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --skip-install) INSTALL_DEPENDENCIES=0 ;;
    -h | --help)
      usage
      exit 0
      ;;
    *) die "unknown build option: $1" ;;
  esac
  shift
done

require_command node
require_command npm
assert_repo_root

[[ -f "$WEBSITE_DIR/package-lock.json" ]] || die "website/package-lock.json is missing"
[[ -f "$REPO_ROOT/package-lock.json" ]] || die "root package-lock.json is missing"

if [[ "$INSTALL_DEPENDENCIES" -eq 1 ]]; then
  log "installing exact root dependencies"
  (cd "$REPO_ROOT" && npm ci)

  log "installing exact website dependencies"
  (cd "$WEBSITE_DIR" && npm ci)
else
  [[ -d "$WEBSITE_DIR/node_modules" ]] ||
    die "--skip-install requires website/node_modules; run without the flag first"
fi

log "testing the kingdom runtime"
(cd "$REPO_ROOT" && npm test)

log "checking formatting"
(cd "$WEBSITE_DIR" && npm run format:check)

log "linting"
(cd "$WEBSITE_DIR" && npm run lint)

log "type-checking"
(cd "$WEBSITE_DIR" && npm run typecheck)

log "building the static site"
(cd "$WEBSITE_DIR" && npm run build)

[[ -f "$WEBSITE_DIR/dist/index.html" ]] || die "build completed without website/dist/index.html"
log "build ready at $WEBSITE_DIR/dist"
