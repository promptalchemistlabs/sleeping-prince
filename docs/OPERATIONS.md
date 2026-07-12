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

## Zo Computer managed-service setup

Zo Sites publication is a Zo tool action rather than a repository CLI. The
portable option is to create one managed HTTP service in Zo with:

- Working directory: `/home/workspace/Start/pal/sleeping-prince`
- Entrypoint: `./scripts/serve.sh`
- Port: any port assigned by Zo through `PORT`
- Visibility: private while validating, public only when approved

Run `./scripts/redeploy.sh` before starting the service. Later redeploys switch
the `.deploy/current` symlink atomically, so the supervised server immediately
serves the new verified release. Configure the service URL as
`PAL_HEALTHCHECK_URL` once it exists.

Do not use `git submodule update --remote` in production. That bypasses the
reviewed parent-repository pins and can combine incompatible agent revisions.
