---
layout: layout.njk
title: Codebase
---

# Codebase

How code, dependencies, and configuration are managed.

## One Codebase, Many Deploys

```
┌─────────────────────────────────────────────────┐
│                   CODEBASE                      │
│                  (Git repo)                     │
└────────┬─────────────┬─────────────┬───────────┘
         │             │             │
         ▼             ▼             ▼
    ┌─────────┐   ┌─────────┐   ┌─────────┐
    │   Dev   │   │ Staging │   │  Prod   │
    │ Deploy  │   │ Deploy  │   │ Deploy  │
    └─────────┘   └─────────┘   └─────────┘
```

- **One repo = one app** - Multiple repos = distributed system
- **Same codebase deploys to all environments** - Config is what changes, not code
- **Shared code becomes libraries** - If multiple apps need it, extract it

## Dependencies

Explicitly declare and isolate all dependencies.

- **Declaration** - Manifest file (package.json, requirements.txt, Gemfile)
- **Isolation** - Virtual environments (node_modules, venv, bundle)
- **Never rely on system-wide packages** - Nothing implicit

```bash
# Declaration + Isolation
pip install -r requirements.txt   # declare
source venv/bin/activate          # isolate

npm ci                            # both in one
```

**Litmus test:** A new developer should only need the language runtime and dependency manager to get started.

## Configuration

Config varies between deploys; code doesn't. Keep them separate.

- **Store config in environment variables** - Not in code, not in committed config files
- **One codebase, many deploys** - Same code runs in dev, staging, and prod
- **Never hardcode credentials** - API keys, database URLs, secrets belong in the environment

```bash
# Good: environment variables
DATABASE_URL=postgres://user:pass@host/db
API_KEY=sk-abc123

# Bad: hardcoded
API_KEY = "sk-abc123"  # NO
```

**Litmus test:** Could you open-source your code right now without exposing credentials?
