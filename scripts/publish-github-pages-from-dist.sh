#!/usr/bin/env bash
# Merge cloud-5 strudel/website/dist into a clone of gogins.github.io (GitHub Pages).
#
# Paths listed in .cloud5-dist-manifest.txt (one relative path per line) are
# "owned" by cloud-5. On each run:
#   - Any path in the previous manifest but not in the new dist is removed
#     from the index (so old Rollup chunk names disappear from the tree).
#   - The new dist is rsynced onto the repo root (overwrites cloud-5 paths).
#   - The manifest is rewritten to match the new dist.
#
# Anything never listed in the manifest is never removed by this script
# (e.g. pieces and assets committed only on gogins.github.io).
#
# Usage:
#   publish-github-pages-from-dist.sh <path-to-strudel-website-dist> <path-to-pages-repo-clone>

set -euo pipefail

DIST="${1:?path to strudel/website/dist required}"
PAGES="${2:?path to gogins.github.io clone required}"

MANIFEST_NAME=".cloud5-dist-manifest.txt"

if [[ ! -d "${DIST}" ]]
then
    echo "Not a directory: ${DIST}" >&2
    exit 1
fi

if [[ ! -d "${PAGES}/.git" ]]
then
    echo "Not a git repository: ${PAGES}" >&2
    exit 1
fi

abs_dist="$(cd "${DIST}" && pwd)"
tmp_new="$(mktemp)"
tmp_old_sorted="$(mktemp)"
trap 'rm -f "${tmp_new}" "${tmp_old_sorted}"' EXIT

( cd "${abs_dist}" && find . -type f ! -path './.git/*' | sed 's|^\./||' | LC_ALL=C sort -u ) > "${tmp_new}"

cd "${PAGES}"

if [[ -f "${MANIFEST_NAME}" ]]
then
    LC_ALL=C sort -u "${MANIFEST_NAME}" -o "${tmp_old_sorted}"
    comm -23 "${tmp_old_sorted}" "${tmp_new}" | while IFS= read -r rel
    do
        [[ -z "${rel}" ]] && continue
        if git ls-files --error-unmatch "${rel}" >/dev/null 2>&1
        then
            git rm -f -- "${rel}" 2>/dev/null || true
        else
            rm -f -- "${rel}" 2>/dev/null || true
        fi
    done
fi

rsync -a "${abs_dist}/" ./
cp -f "${tmp_new}" "${MANIFEST_NAME}"
