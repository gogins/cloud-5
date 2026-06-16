#!/usr/bin/env bash
# Fail if CsoundAC.js cannot grow its Wasm heap (PITV.initialize needs this).
set -euo pipefail

ROOT="${1:-$(cd "$(dirname "$0")/.." && pwd)}"
JS="${ROOT}/CsoundAC.js"
WASM="${ROOT}/CsoundAC.wasm"

if [[ ! -f "${JS}" ]]; then
  echo "verify-csound-wasm-dist: missing ${JS}" >&2
  exit 1
fi

if [[ ! -s "${WASM}" ]]; then
  echo "verify-csound-wasm-dist: missing or empty ${WASM}" >&2
  exit 1
fi

if ! grep -q 'growMemory' "${JS}"; then
  echo "verify-csound-wasm-dist: ${JS} has no growMemory (heap cannot grow)" >&2
  exit 1
fi

if grep -q 'abortOnCannotGrowMemory' "${JS}"; then
  echo "verify-csound-wasm-dist: ${JS} aborts on heap growth (PITV will OOM)" >&2
  exit 1
fi

echo "verify-csound-wasm-dist: OK (${JS})"
