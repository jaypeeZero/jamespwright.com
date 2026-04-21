---
layout: layout.njk
title: Operations
---

# Operations

How to build, deploy, and run applications.

## Build, Release, Run

Strictly separate the stages. Never change code at runtime.

```
┌─────────┐    ┌─────────┐    ┌─────────┐
│  BUILD  │───▶│ RELEASE │───▶│   RUN   │
└─────────┘    └─────────┘    └─────────┘
 Compile       Code +          Execute
 + Assets      Config          Process
```

- **Build** - Transform code into an executable bundle (compile, bundle assets)
- **Release** - Combine build with config for a specific environment
- **Run** - Launch application processes

Releases are immutable and append-only. Every release has a unique ID.

## Stateless Processes

Execute the app as one or more stateless processes.

```
Request A ──▶ Process 1 ──┐
                          ├──▶ Database/Cache
Request B ──▶ Process 2 ──┘

Any process can handle any request
```

- **No sticky sessions** - Any process handles any request
- **No local file storage** - Persistent data belongs in backing services
- **Nothing in memory survives a restart** - Treat processes as disposable

**Where state belongs:**
- Session data → Redis/database
- File uploads → Object storage (S3)
- Cache → External cache service

## Port Binding

The app is completely self-contained. It exports services by binding to a port directly — it doesn't rely on a web server being injected at runtime.

```
# App binds to a port and serves HTTP directly
PORT=3000 python server.py

# Routing layer forwards requests
nginx:80 ──▶ app:3000
```

This means one app can be another app's backing service.

## Concurrency

Scale horizontally, not vertically. More processes, not bigger machines.

```
                    ┌─────────────────────────────────┐
                    │        PROCESS TYPES            │
                    ├─────────────────────────────────┤
Scale ▲             │ web    ████████████████         │
      │             │ worker ████████                 │
      │             │ clock  ██                       │
      │             └─────────────────────────────────┘
```

- **Different process types for different workloads** - `web` for HTTP, `worker` for background jobs, `clock` for scheduled tasks
- **Scale each type independently** - 4 web processes, 2 workers, 1 clock
- **Let the OS manage processes** - Don't daemonize or write PID files

## Disposability

Processes should start fast and stop gracefully.

```
START                          STOP
  │                              │
  ▼                              ▼
┌──────────┐                ┌──────────┐
│ < 10 sec │                │ Finish   │
│ startup  │                │ current  │
│          │                │ request  │
└──────────┘                │ Release  │
                            │ resources│
                            └──────────┘
```

- **Fast startup** - Enables elastic scaling and rapid deployment
- **Graceful shutdown** - Finish current work on SIGTERM, then exit
- **Crash resilience** - If a process can start fast, crash recovery is just a restart

```python
import signal

def handle_sigterm(signum, frame):
    server.shutdown()
    db.disconnect()
    sys.exit(0)

signal.signal(signal.SIGTERM, handle_sigterm)
```

## Dev/Prod Parity

Keep development, staging, and production as similar as possible.

| Gap | Wrong | Right |
|-----|-------|-------|
| **Time** | Weeks between deploys | Hours or minutes |
| **Personnel** | Devs write, ops deploy | Same people do both |
| **Tools** | SQLite dev, Postgres prod | Same everywhere |

Use the same database, queue system, cache, and search backend in every environment.

```yaml
# docker-compose.yml - same services everywhere
services:
  db:
    image: postgres:15
  redis:
    image: redis:7
  app:
    build: .
```

## Logs

Apps should **not** manage log files. Write to stdout, one event per line.

```
┌─────────────┐
│    App      │
│  (stdout)   │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────┐
│       Execution Environment      │
│  ┌──────────┐  ┌──────────────┐ │
│  │ Log file │  │ Log service  │ │
│  │          │  │ (Datadog,    │ │
│  │          │  │  Splunk)     │ │
│  └──────────┘  └──────────────┘ │
└─────────────────────────────────┘
```

**The app's only job:** Write events to stdout

**The environment's job:** Capture, route, store, analyze

## Admin Processes

Database migrations, console sessions, one-time scripts — run them as one-off processes in the same environment as the app.

```
┌─────────────────────────────────────┐
│           Same Release              │
├─────────────────────────────────────┤
│  web process   │   admin process    │
│  (long-lived)  │   (one-off)        │
│                │                    │
│  Serves HTTP   │  Runs migration    │
│                │  then exits        │
└─────────────────────────────────────┘
```

- **Ship admin code with application code** - Same repo, same release
- **Run against a release** - Same code + same config as production
- **Never run locally against production** - Use the same environment the app runs in
