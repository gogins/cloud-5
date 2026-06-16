#!/usr/bin/env bash
# Install csound-wasm runtime files into the cloud-5 root (always runs).
#
# Source order:
#   1. $CSOUND_WASM_DIST if set and directory exists
#   2. ../csound-wasm/dist (sibling checkout — local dev)
#   3. ./csound-wasm/dist (in-repo checkout — CI)
#   4. ~/csound-wasm/dist
#   5. Already-verified CsoundAC.js/wasm in the repo root (do not replace with
#      a stale GitHub release zip when CI has no local dist)
#   6. GitHub release zip for config.csound_wasm_version
#
# Every install path ends with scripts/verify-csound-wasm-dist.sh.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

read_config_version() {
  node -e "
    const fs = require('fs');
    for (const file of ['package.json', 'package-pnpm.json']) {
      if (!fs.existsSync(file)) continue;
      const version = JSON.parse(fs.readFileSync(file, 'utf8')).config?.csound_wasm_version;
      if (version) {
        process.stdout.write(String(version));
        process.exit(0);
      }
    }
    process.exit(1);
  " 2>/dev/null || true
}

VERSION="${CSOUND_WASM_VERSION:-$(read_config_version)}"
VERSION="${VERSION:-4.0.0-beta}"
MARKER=".csound-wasm-dist-version"
VERIFY="${ROOT}/scripts/verify-csound-wasm-dist.sh"

install_from_dir() {
  local src="$1"
  local source_kind="${2:-unknown}"
  echo "Installing csound-wasm dist from ${src}"
  rsync -a "${src}/" "${ROOT}/"
  printf '%s\n%s:%s\n' "${VERSION}" "${source_kind}" "${src}" > "${MARKER}"
  bash "${VERIFY}" "${ROOT}"
}

resolve_local_dist() {
  local candidate=""
  if [[ -n "${CSOUND_WASM_DIST:-}" && -d "${CSOUND_WASM_DIST}" ]]; then
    candidate="${CSOUND_WASM_DIST}"
  else
    for candidate in \
      "${ROOT}/../csound-wasm/dist" \
      "${ROOT}/csound-wasm/dist" \
      "${HOME}/csound-wasm/dist"; do
      if [[ -f "${candidate}/CsoundAudioProcessor.js" ]]; then
        echo "${candidate}"
        return 0
      fi
    done
    return 1
  fi
  if [[ -f "${candidate}/CsoundAudioProcessor.js" ]]; then
    echo "${candidate}"
  fi
}

stage_trichord_from_src() {
  local dist_dir="$1"
  local src_html="${ROOT}/../csound-wasm/src/trichord_space.html"
  if [[ ! -f "${src_html}" && -f "${ROOT}/csound-wasm/src/trichord_space.html" ]]; then
    src_html="${ROOT}/csound-wasm/src/trichord_space.html"
  fi
  local dist_html="${dist_dir}/trichord_space.html"
  if [[ -f "${src_html}" \
    && ( ! -f "${dist_html}" || "${src_html}" -nt "${dist_html}" ) ]]; then
    echo "Staging newer trichord_space.html from csound-wasm/src into dist..."
    cp -f "${src_html}" "${dist_html}"
  fi
}

dist_already_verified() {
  bash "${VERIFY}" "${ROOT}" >/dev/null 2>&1
}

LOCAL_DIST="$(resolve_local_dist || true)"
if [[ -n "${LOCAL_DIST}" ]]; then
  stage_trichord_from_src "${LOCAL_DIST}"
  install_from_dir "${LOCAL_DIST}" "local"
  exit 0
fi

if dist_already_verified; then
  echo "Csound wasm dist already present and verified; not downloading release zip."
  if [[ ! -f "${MARKER}" ]]; then
    printf '%s\nverified:%s\n' "${VERSION}" "${ROOT}" > "${MARKER}"
  fi
  bash "${VERIFY}" "${ROOT}"
  exit 0
fi

TMP="$(mktemp -d)"
trap 'rm -rf "${TMP}"' EXIT

ZIP="${TMP}/csound-wasm.zip"
URL="https://github.com/gogins/csound-wasm/releases/download/v${VERSION}/csound-wasm-${VERSION}.zip"

echo "No local csound-wasm dist; downloading v${VERSION} from GitHub releases..."
curl -fsSL "${URL}" -o "${ZIP}"
unzip -q "${ZIP}" -d "${TMP}/dist"
install_from_dir "${TMP}/dist" "release"
