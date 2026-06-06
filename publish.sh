#!/usr/bin/env bash
# Sync strudel/website/dist into a local gogins.github.io clone (same rules as CI).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
SOURCE="${ROOT}/strudel/website/dist"
TARGET="${GOGINS_GITHUB_IO:-${HOME}/gogins.github.io}"
SCRIPT="${ROOT}/scripts/publish-github-pages-from-dist.sh"

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
git commit -m "Update site from cloud-5 strudel build"
git push
