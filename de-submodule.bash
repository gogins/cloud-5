#!/usr/bin/env bash
set -euo pipefail

# remove-submodule.sh
# Cleanly and completely remove a git submodule from the current repo.
#
# Usage:
#   ./remove-submodule.sh vendor/strudel
#   ./remove-submodule.sh --commit-msg "remove Strudel submodule" vendor/strudel
#
# Notes:
# - Run from the repo root.
# - The script is idempotent (safe to re-run).
# - Requires Git 2.13+ for `git submodule deinit`.

commit_msg="remove submodule"
if [[ "${1:-}" == "--commit-msg" ]]; then
  shift
  commit_msg="${1:-$commit_msg}"
  shift || true
fi

if [[ $# -lt 1 ]]; then
  echo "Usage: $0 [--commit-msg \"message\"] <submodule-path>"
  exit 64
fi

sub_path="${1%/}"  # strip trailing slash if present
repo_root="$(git rev-parse --show-toplevel 2>/dev/null || true)"
if [[ -z "$repo_root" ]]; then
  echo "Error: not inside a Git repository."
  exit 1
fi
cd "$repo_root"

# Check if path exists in working tree (optional).
if [[ ! -e "$sub_path" ]]; then
  echo "Warning: '$sub_path' does not exist in the working tree (continuing)."
fi

# Determine submodule name from .gitmodules (best-effort).
sub_name="$(git config -f .gitmodules --get-regexp '^submodule\..*\.path$' 2>/dev/null \
  | awk -v p="$sub_path" '$NF==p {print $1}' \
  | sed -E 's/^submodule\.([^ ]+)\.path$/\1/' || true)"

if [[ -z "$sub_name" ]]; then
  echo "Info: '$sub_path' not found in .gitmodules; proceeding with generic cleanup."
else
  echo "Found submodule name: $sub_name"
fi

echo "Step 1/6: Deinitialize submodule (if present)…"
# This cleans up .git/config entries and stage removal of submodule metadata.
git submodule deinit -f -- "$sub_path" 2>/dev/null || true

echo "Step 2/6: Remove the submodule from the index (and schedule worktree deletion)…"
# This removes the path from the index and working tree.
# If the path is already gone, 'git rm' will fail; ignore in that case.
git rm -f --cached -- "$sub_path" 2>/dev/null || git rm -f -- "$sub_path" 2>/dev/null || true

# Delete the working tree folder if still present (git rm --cached used).
if [[ -d "$sub_path" || -f "$sub_path" ]]; then
  echo "Step 3/6: Deleting working tree directory '$sub_path'…"
  rm -rf -- "$sub_path"
fi

echo "Step 4/6: Clean .gitmodules (if entry exists)…"
if [[ -f ".gitmodules" && -n "$sub_name" ]]; then
  # Remove the submodule stanza from .gitmodules.
  git config -f .gitmodules --remove-section "submodule.$sub_name" 2>/dev/null || true
  # If .gitmodules becomes empty, remove it; otherwise stage it.
  if [[ -z "$(grep -v '^\s*$' .gitmodules || true)" ]]; then
    rm -f .gitmodules
    git add -A :/ 2>/dev/null || true
  else
    git add .gitmodules 2>/dev/null || true
  fi
fi

echo "Step 5/6: Clean .git/config submodule entry (if any)…"
if [[ -n "$sub_name" ]]; then
  git config --remove-section "submodule.$sub_name" 2>/dev/null || true
fi

echo "Step 6/6: Remove .git/modules directory for the submodule (if exists)…"
modules_dir=".git/modules/$sub_path"
if [[ -d "$modules_dir" ]]; then
  rm -rf -- "$modules_dir"
fi

# Final sweep for empty directories that may remain in the path under .git/modules
# (e.g., nested submodule paths).
parent="$modules_dir"
while [[ "$parent" != ".git/modules" && "$parent" != "." ]]; do
  parent="$(dirname "$parent")"
  if [[ -d "$parent" && -z "$(ls -A "$parent" 2>/dev/null || true)" ]]; then
    rmdir "$parent" || true
  else
    break
  fi
done

# Stage removals if not already staged (e.g., .gitmodules deletions).
git add -A :/ 2>/dev/null || true

# Create a commit if there are changes.
if ! git diff --cached --quiet; then
  git commit -m "$commit_msg"
  echo "Done. Submodule '$sub_path' removed and changes committed."
else
  echo "No staged changes detected. Submodule may have already been removed."
fi
