#!/usr/bin/env bash
# Install csound-wasm runtime files into the cloud-5 root.
#
# Source order:
#   1. $CSOUND_WASM_DIST if set and directory exists
#   2. ../csound-wasm/dist (sibling checkout)
#   3. ~/csound-wasm/dist
#   4. GitHub release zip (contents of csound-wasm/dist; dist/ is not in git)
#
# When a local dist directory is found, always rsync so edits propagate on
# pnpm install without CSOUND_WASM_FORCE. If csound-wasm/src/trichord_space.html
# is newer than dist/trichord_space.html, copy src → dist first (HTML-only dev).
#
# Skip (release zip only): set CSOUND_WASM_FORCE=1 to re-download.
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

install_from_dir() {
  local src="$1"
  echo "Installing csound-wasm dist from ${src}"
  rsync -a "${src}/" "${ROOT}/"
  printf '%s\nlocal:%s\n' "${VERSION}" "${src}" > "${MARKER}"
}

resolve_local_dist() {
  local candidate=""
  if [[ -n "${CSOUND_WASM_DIST:-}" && -d "${CSOUND_WASM_DIST}" ]]; then
    candidate="${CSOUND_WASM_DIST}"
  else
    for candidate in "../csound-wasm/dist" "${HOME}/csound-wasm/dist"; do
      if [[ -f "${candidate}/CsoundAudioProcessor.js" ]]; then
        break
      fi
      candidate=""
    done
  fi
  if [[ -n "${candidate}" && -f "${candidate}/CsoundAudioProcessor.js" ]]; then
    cd "${candidate}" && pwd
  fi
}

stage_trichord_from_src() {
  local dist_dir="$1"
  local src_html="../csound-wasm/src/trichord_space.html"
  local dist_html="${dist_dir}/trichord_space.html"
  if [[ -f "${src_html}" \
    && ( ! -f "${dist_html}" || "${src_html}" -nt "${dist_html}" ) ]]; then
    echo "Staging newer trichord_space.html from csound-wasm/src into dist..."
    cp -f "${src_html}" "${dist_html}"
  fi
}

LOCAL_DIST="$(resolve_local_dist || true)"
if [[ -n "${LOCAL_DIST}" ]]; then
  stage_trichord_from_src "${LOCAL_DIST}"
  install_from_dir "${LOCAL_DIST}"
  exit 0
fi

if [[ "${CSOUND_WASM_FORCE:-}" != "1" \
  && -f "${MARKER}" \
  && head -n1 "${MARKER}" | grep -qx "${VERSION}" \
  && -f "CsoundAudioProcessor.js" \
  && -f "CsoundAC.js" \
  && -f "trichord_space.html" ]]; then
  echo "csound-wasm dist ${VERSION} already present; skipping (CSOUND_WASM_FORCE=1 to refresh)."
  exit 0
fi

TMP="$(mktemp -d)"
trap 'rm -rf "${TMP}"' EXIT

ZIP="${TMP}/csound-wasm.zip"
URL="https://github.com/gogins/csound-wasm/releases/download/v${VERSION}/csound-wasm-${VERSION}.zip"

echo "Downloading csound-wasm dist v${VERSION} from GitHub releases..."
curl -fsSL "${URL}" -o "${ZIP}"
unzip -q "${ZIP}" -d "${TMP}/dist"
install_from_dir "${TMP}/dist"
printf '%s\nrelease\n' "${VERSION}" > "${MARKER}"
