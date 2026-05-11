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

