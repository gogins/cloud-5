#!/usr/bin/env bash
set -euo pipefail

# put-strudel-subtree.sh
# Add or update Strudel as a git subtree in the current repo.
# - No squash
# - No forks
# - Idempotent: add if missing, pull if present
#
# Usage (defaults shown):
#   ./put-strudel-subtree.sh
#   ./put-strudel-subtree.sh --ref v1.2.3
#   ./put-strudel-subtree.sh --prefix vendor/strudel --remote strudel --url https://codeberg.org/uzu/strudel.git --ref main
#
# Options:
#   --prefix <path>    Subtree directory (default: vendor/strudel)
#   --remote <name>    Remote name for upstream (default: strudel)
#   --url <url>        Upstream URL (default: https://codeberg.org/uzu/strudel.git)
#   --ref <ref>        Branch/tag/commit to track (default: main)
#   --dry-run          Show what would happen without making changes

PREFIX="strudel"
REMOTE_NAME="strudel"
REMOTE_URL="https://codeberg.org/uzu/strudel.git"
UPSTREAM_REF="main"
DRY_RUN=0

while [[ $# -gt 0 ]]; do
  case "$1" in
    --prefix)   PREFIX="$2"; shift 2 ;;
    --remote)   REMOTE_NAME="$2"; shift 2 ;;
    --url)      REMOTE_URL="$2"; shift 2 ;;
    --ref)      UPSTREAM_REF="$2"; shift 2 ;;
    --dry-run)  DRY_RUN=1; shift ;;
    *) echo "Unknown option: $1" >&2; exit 64 ;;
  esac
done

# Ensure we are in a git repo
REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || true)"
if [[ -z "$REPO_ROOT" ]]; then
  echo "Error: not inside a Git repository." >&2
  exit 1
fi
cd "$REPO_ROOT"

echo "==> Configuration"
echo "    prefix  : $PREFIX"
echo "    remote  : $REMOTE_NAME"
echo "    url     : $REMOTE_URL"
echo "    ref     : $UPSTREAM_REF"
echo "    dry-run : $DRY_RUN"

# Ensure remote exists and points to the desired URL
existing_url="$(git remote get-url "$REMOTE_NAME" 2>/dev/null || true)"
if [[ -z "$existing_url" ]]; then
  echo "==> Adding remote '$REMOTE_NAME' -> $REMOTE_URL"
  [[ $DRY_RUN -eq 1 ]] || git remote add "$REMOTE_NAME" "$REMOTE_URL"
else
  if [[ "$existing_url" != "$REMOTE_URL" ]]; then
    echo "Error: remote '$REMOTE_NAME' already exists but points to:"
    echo "  $existing_url"
    echo "Expected:"
    echo "  $REMOTE_URL"
    echo "Refusing to proceed. Use a different --remote or adjust your config."
    exit 1
  fi
fi

echo "==> Fetching upstream '$REMOTE_NAME' (incl. tags)…"
[[ $DRY_RUN -eq 1 ]] || git fetch --tags "$REMOTE_NAME"

# Determine whether the subtree is already present in HEAD
subtree_present=0
if git rev-parse -q --verify "HEAD^{commit}" >/dev/null 2>&1; then
  if git ls-tree -d --name-only HEAD -- "$PREFIX" >/dev/null 2>&1; then
    if [[ -n "$(git ls-tree -d --name-only HEAD -- "$PREFIX")" ]]; then
      subtree_present=1
    fi
  fi
fi

commit_msg_add="subtree: add Strudel ($UPSTREAM_REF) into $PREFIX"
commit_msg_pull="subtree: update Strudel to $UPSTREAM_REF under $PREFIX"

if [[ $subtree_present -eq 0 ]]; then
  echo "==> Subtree not present. Will ADD:"
  echo "    git subtree add --prefix=$PREFIX $REMOTE_NAME $UPSTREAM_REF -m \"$commit_msg_add\""
  if [[ $DRY_RUN -eq 0 ]]; then
    # Ensure parent dir exists in working tree so subtree add can place files cleanly
    mkdir -p "$(dirname "$PREFIX")"
    git subtree add --prefix="$PREFIX" "$REMOTE_NAME" "$UPSTREAM_REF" -m "$commit_msg_add"
  fi
else
  echo "==> Subtree detected at '$PREFIX'. Will PULL updates:"
  echo "    git subtree pull --prefix=$PREFIX $REMOTE_NAME $UPSTREAM_REF -m \"$commit_msg_pull\""
  if [[ $DRY_RUN -eq 0 ]]; then
    git subtree pull --prefix="$PREFIX" "$REMOTE_NAME" "$UPSTREAM_REF" -m "$commit_msg_pull"
  fi
fi

# Record what we used in VENDOR_VERSIONS.md (append/update a block)
if [[ $DRY_RUN -eq 0 ]]; then
  echo "==> Recording version info in VENDOR_VERSIONS.md"
  {
    echo ""
    echo "### Strudel subtree"
    echo "- Upstream: $REMOTE_URL"
    echo "- Remote:   $REMOTE_NAME"
    echo "- Ref:      $UPSTREAM_REF"
    echo "- Prefix:   $PREFIX"
    # Try to capture the fetched commit SHA for the ref
    sha="$(git rev-parse --verify "$REMOTE_NAME/$UPSTREAM_REF" 2>/dev/null || true)"
    [[ -n "$sha" ]] && echo "- Resolved: $sha"
    echo "- Date:     $(date -u +'%Y-%m-%dT%H:%M:%SZ')"
  } >> VENDOR_VERSIONS.md
  git add VENDOR_VERSIONS.md || true
  # Do not auto-commit this note; subtree commands above already made commits.
fi

echo "==> Done."
