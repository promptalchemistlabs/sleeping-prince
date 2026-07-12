# Build, sync and redeploy operations

These scripts make the checked-out repository on a workstation or Zo Computer
repeatable. They fail closed: a dirty tree, divergent branch, failed validation,
failed deployment hook, or failed health check stops the rollout.

## Commands

Run commands from the repository root.

### Build

```bash
./scripts/build.sh
```

This installs the exact root and website dependencies, runs the kingdom runtime
tests, formatting checks, linting, Astro type checks, and the static production
build. Use `--skip-install` only when the exact dependencies are already
installed.

### Sync

```bash
./scripts/sync.sh
```

Sync performs a fast-forward-only update of `origin/main`, synchronises
submodule URLs, and checks out every submodule at the revision pinned by the
parent repository. It never pulls the latest submodule branch independently.

The defaults can be overridden with `PAL_GIT_REMOTE`, `PAL_GIT_BRANCH`,
`--remote`, or `--branch`.

### Redeploy

```bash
./scripts/redeploy.sh
```

Redeploy acquires a lock, syncs, builds, copies the verified output into a
versioned `.deploy/releases/` directory, and atomically moves `.deploy/current`
to the new release. The previous release remains available for rollback.

For a provider that needs an explicit publish or restart command, configure it
as a trusted environment variable:

```bash
PAL_DEPLOY_COMMAND='your provider command' ./scripts/redeploy.sh
```

If the deployed site has a stable URL, enable verification and automatic
rollback:

```bash
PAL_HEALTHCHECK_URL='https://example.com/' ./scripts/redeploy.sh
```

For local testing of uncommitted script changes only:

```bash
./scripts/redeploy.sh --skip-sync --skip-install
```

## Zo Computer public-service deployment

The production landing page is registered in Zo as a public HTTP service:

- Service label: `kingdom-of-pal`
- Public URL: <https://kingdom-of-pal-sayyidkhan.zocomputer.io>
- Working directory: `/home/workspace/Start/pal/sleeping-prince`
- Entrypoint: `/home/workspace/Start/pal/sleeping-prince/scripts/serve.sh`
- Local port: `4321` (Zo also provides this to the process as `PORT`)
- Visibility: **Public**

From the repository on Zo, redeploy with:

```bash
./scripts/redeploy-zo.sh
```

Use `--skip-install` only when the checked-in lockfiles have not changed and the
exact dependencies are already installed. The wrapper syncs `main`, validates
the project, atomically switches `.deploy/current`, and checks the public URL.
If the anonymous public health check fails, it restores the previous release.

Public/private visibility is Zo service metadata, not a repository setting.
The wrapper deliberately does not alter visibility; confirm the service still
shows **Public** in Zo Hosting after any manual service edit. A Zo account that
allows the computer to sleep requires always-on hosting for the URL to remain
available while the computer is asleep.

Use the absolute entrypoint above. Zo's supervisor does not resolve a relative
entrypoint against the configured working directory and will otherwise fail
before `serve.sh` can write any logs.

Do not use `git submodule update --remote` in production. That bypasses the
reviewed parent-repository pins and can combine incompatible agent revisions.
