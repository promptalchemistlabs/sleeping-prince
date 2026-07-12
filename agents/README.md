# Agent source mounts

This directory assembles the independently versioned agent repositories as Git
submodules for local development and reproducible demos.

The current layout is:

```text
agents/
├── orin/      # pal-agent-orin
├── scribe/    # pal-agent-scribe
├── rick/      # pal-agent-rick
└── bastion/   # pal-agent-bastion
```

The public repositories are:

- [pal-agent-orin](https://github.com/promptalchemistlabs/pal-agent-orin)
- [pal-agent-scribe](https://github.com/promptalchemistlabs/pal-agent-scribe)
- [pal-agent-rick](https://github.com/promptalchemistlabs/pal-agent-rick)
- [pal-agent-bastion](https://github.com/promptalchemistlabs/pal-agent-bastion)

Each repository currently contains its `0.1.0` manifest, role contract, README,
and contributor instructions. Runtime implementations remain deliberately marked
as planned.

The source is not vendored into the kingdom repository. Git records an exact
commit for each submodule, while `agent-registry.yaml` records the corresponding
agent version, manifest and operating contract.

Clone the complete kingdom with:

```bash
git clone --recurse-submodules \
  https://github.com/promptalchemistlabs/sleeping-prince.git
```

Initialise the agents after an ordinary clone with:

```bash
git submodule update --init --recursive
```

Runtime deployments may still be remote services, provided they satisfy the
registered contracts. Submodules are the development and demo assembly
mechanism, not the production communication mechanism.

Do not add a nested Git repository without registering it as a submodule or
explicitly ignoring it.
