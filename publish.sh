#!/usr/bin/env bash
# Sync strudel/website/dist into a local gogins.github.io clone (same rules as CI).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
SOURCE="${ROOT}/strudel/website/dist"
TARGET="${GOGINS_GITHUB_IO:-${HOME}/gogins.github.io}"
SCRIPT="${ROOT}/scripts/publish-github-pages-from-dist.sh"
COMMIT_MSG="Update site from cloud-5 strudel build"

pages_branch() {
    local branch

    cd "${TARGET}"
    branch="$(git symbolic-ref -q --short HEAD 2>/dev/null || true)"
    if [[ -z "${branch}" ]]
    then
        branch="main"
    fi
    printf '%s\n' "${branch}"
}

pages_upstream() {
    local branch="$1"

    if git rev-parse --verify "origin/${branch}" >/dev/null 2>&1
    then
        printf 'origin/%s\n' "${branch}"
        return 0
    fi

    printf 'origin/main\n'
}

# Start from the latest remote tree. Avoids rebase conflicts on generated dist/jsdocs.
reset_pages_repo_to_remote() {
    local branch upstream

    cd "${TARGET}"
    branch="$(pages_branch)"
    upstream="$(pages_upstream "${branch}")"

    git fetch origin
    git checkout -B "${branch}" "${upstream}"
    echo "Reset ${TARGET} to ${upstream}"
}

# If CI pushed while we were publishing, replay our staged tree onto remote (no line merge).
rebase_pages_commit_onto_remote() {
    local branch upstream

    cd "${TARGET}"
    branch="$(pages_branch)"
    upstream="$(pages_upstream "${branch}")"

    git fetch origin
    if git merge-base --is-ancestor "${upstream}" HEAD
    then
        return 0
    fi

    echo "Remote moved during publish; re-staging onto ${upstream}..."
    git reset --soft "${upstream}"
    if git diff --staged --quiet
    then
        echo "No changes to publish after syncing with remote."
        exit 0
    fi
    git commit -m "${COMMIT_MSG}"
}

echo "Source : ${SOURCE}"
echo "Target : ${TARGET}"
echo

if [[ ! -d "${SOURCE}" ]]
then
    echo "Build dist first: pnpm install && pnpm run build" >&2
    exit 1
fi

if [[ ! -d "${TARGET}/.git" ]]
then
    echo "Not a git clone: ${TARGET}" >&2
    exit 1
fi

read -r -p "Merge dist into ${TARGET}? [y/N] " reply
case "$reply" in
    [yY]|[yY][eE][sS]) ;;
    *) echo "Aborted."; exit 0 ;;
esac

reset_pages_repo_to_remote
bash "${SCRIPT}" "${SOURCE}" "${TARGET}"

cd "${TARGET}"
git status

echo
read -r -p "Commit and push changes? [y/N] " reply2
case "$reply2" in
    [yY]|[yY][eE][sS]) ;;
    *) echo "Sync complete, not pushed."; exit 0 ;;
esac

git add -A
if git diff --staged --quiet
then
    echo "No changes to commit on gogins.github.io."
    exit 0
fi

git commit -m "${COMMIT_MSG}"
rebase_pages_commit_onto_remote
git push
