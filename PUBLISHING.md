# Publishing cloud-5 to gogins.github.io

The live site [gogins.github.io](https://gogins.github.io) is the **root** of
[gogins/gogins.github.io](https://github.com/gogins/gogins.github.io). Built assets come from
`strudel/website/dist/` in this repo.

## Three ways to publish

All three merge dist into the Pages repo with the same rules
(`scripts/publish-github-pages-from-dist.sh`). Only **how** the build runs and **who** pushes
to git differs.

| # | How | When to use |
|---|-----|-------------|
| **1** | **Push to `main`** on `gogins/cloud-5` | Default: every merge to `main` builds, updates the rolling [`cloud-5-bundle`](https://github.com/gogins/cloud-5/releases) release, then syncs gogins.github.io (Pages push runs only if the release job succeeded). |
| **2** | **Run workflow** in GitHub Actions | **Actions → Build, bundle release, publish Pages → Run workflow**. Rebuild and publish on demand (any branch/ref). Checkboxes control the bundle release and/or Pages sync. |
| **3** | **`./publish.sh`** locally | After `pnpm run build` in cloud-5; you confirm merge and commit/push to your gogins.github.io clone. No Actions; uses your git credentials. |

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

| Trigger | Build | Rolling release `cloud-5-bundle` | Push to gogins.github.io |
|--------|-------|----------------------------------|---------------------------|
| Push to any branch | Yes | Only on `main` (`gogins/cloud-5`) | Only after release succeeds on `main` |
| **Run workflow** (manual) | Yes | Optional (default on) | Optional (default on); after release unless release is turned off |

On manual runs you can disable **Publish to gogins.github.io** or **Upload rolling release**
independently. Pages sync on dispatch still expects a successful release job unless you turn
the release step off (then only the Pages job runs, using the build artifact).

## Local publish detail

`publish.sh` calls `scripts/publish-github-pages-from-dist.sh` (manifest-safe merge, not
whole-tree `rsync --delete`). It prompts before merging and before `git push`.
