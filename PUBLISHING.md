# Publishing cloud-5 to gogins.github.io

The live site [gogins.github.io](https://gogins.github.io) is the **root** of
[gogins/gogins.github.io](https://github.com/gogins/gogins.github.io). Built assets come from
`strudel/website/dist/` in this repo.

## Production publish (CI)

**Pushing to `main` only runs a build** (CI verify). It does **not** update the live site or
the rolling [`cloud-5-bundle`](https://github.com/gogins/cloud-5/releases) release.

To ship:

```bash
git tag vX.Y.Z    # on the commit you want live
git push origin vX.Y.Z
```

That triggers CI to:

1. Build at the **tagged commit** (Strudel submodule pinned — no `update --remote` on tags).
2. Refresh the rolling **`cloud-5-bundle`** release zip.
3. Attach **`cloud-5.zip`** (built site only) and **`cloud-5-bundle.zip`** (full source + dist, same as the rolling bundle) to the **version tag** release (e.g. `v2.1.4`).
4. Merge `strudel/website/dist/` into **gogins.github.io** and push.

Use semver-style tags matching `v*` (e.g. `v1.0.0`, `v1.0.0-beta`).

## Three ways to publish

All paths that update the live site merge dist with the same rules
(`scripts/publish-github-pages-from-dist.sh`). Only **how** the build runs and **who** pushes
to git differs.

| # | How | When to use |
|---|-----|-------------|
| **1** | **Push tag `v*`** on `gogins/cloud-5` | **Production:** updates rolling `cloud-5-bundle` and gogins.github.io. |
| **2** | **Run workflow** in GitHub Actions | **Actions → Build, bundle release, publish Pages → Run workflow**. Rebuild and publish on demand (any branch/ref). Checkboxes control the bundle release and/or Pages sync. |
| **3** | **`./publish.sh`** locally | After `pnpm run build`; you confirm merge and commit/push to your gogins.github.io clone. Dev or emergency override — not the normal production path. |

**CI (1 and 2)** need repo secret `GOGINS_IO_DEPLOY_TOKEN` (PAT with `contents: write` on
gogins.github.io). Workflow:
[`.github/workflows/infrastructure-build-release-publish.yml`](.github/workflows/infrastructure-build-release-publish.yml).

**Local (3):**

```bash
pnpm run build
./publish.sh
# optional: GOGINS_GITHUB_IO=~/path/to/gogins.github.io ./publish.sh
```

There is no second `publish.sh` in gogins.github.io; do not publish with plain `rsync --delete`
on the Pages tree (that can remove files committed only on gogins.github.io).

## What gets updated

- Everything under `strudel/website/dist/` is copied to the **repository root** of
  `gogins.github.io` (overwriting matching paths).
- Retired Rollup/Astro chunk files from earlier cloud-5 builds are removed only when they
  were listed in `.cloud5-dist-manifest.txt` and no longer appear in the new dist.
- Files committed only on `gogins.github.io` (pieces, patches, extra assets) are **never**
  deleted by this process; they may be overwritten if the same path exists in a new dist.

## GitHub Actions detail

| Trigger | Build | Rolling release `cloud-5-bundle` | Version tag assets | Push to gogins.github.io |
|--------|-------|----------------------------------|--------------------|---------------------------|
| Push to any branch | Yes | No | No | No |
| Push tag `v*` | Yes | Yes | Yes (`cloud-5.zip`, `cloud-5-bundle.zip`) | Yes (after release job) |
| **Run workflow** (manual) | Yes | Optional (default on) | No | Optional (default on) |

On manual runs you can disable **Publish to gogins.github.io** or **Upload rolling release**
independently. Pages sync on dispatch still expects a successful release job unless you turn
the release step off (then only the Pages job runs, using the build artifact).

## Local publish detail

`publish.sh` calls `scripts/publish-github-pages-from-dist.sh` (manifest-safe merge, not
whole-tree `rsync --delete`). It resets to `origin/main` before merging (avoids rebase conflicts
on generated `jsdocs/`), prompts before merging, and before `git push`.

## Csound wasm dist (CI)

`pnpm install` runs `scripts/install-csound-wasm-dist.sh`. On GitHub Actions there is no
sibling `../csound-wasm/dist`, so the script used to **always download** the
`csound_wasm_version` release zip and **overwrite** the good `CsoundAC.js` / `CsoundAC.wasm`
committed in cloud-5. An older release zip lacked Wasm heap growth and broke pieces such as
Cloud Music No. 2 (`PITV.initialize` OOM).

Install order now: local dist (sibling or in-repo `csound-wasm/dist`) → keep already-verified
repo copy → download release. Every path runs `scripts/verify-csound-wasm-dist.sh`, which fails
the build if `CsoundAC.js` aborts on heap growth.
