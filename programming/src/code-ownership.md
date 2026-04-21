---
layout: layout.njk
title: Code Ownership
---

# Code Ownership

Everyone owns everything. There is no "your code" and "my code" — there is only the team's code.

```
    TRADITIONAL                         COLLECTIVE
    ───────────                         ──────────

    Author ──► PR ──► Reviewer          Author ──► PR ──► LLM Review
                        │                                     │
                        ▼                                     ▼
                "Please change X"                    Author addresses
                        │                            LLM feedback
                        ▼                                     │
                Author changes X                              ▼
                        │                            Human Reviewer
                        ▼                                     │
                   Re-review                                  ▼
                        │                            Reviewer makes changes
                        ▼                            or asks questions
                      Merge                                   │
                                                              ▼
                                                           Merge
```

## Principles

- **Reviewers make changes** - If you see something to fix, fix it yourself
- **Reviewers ask questions** - To understand intent, not to request changes
- **Validate non-trivial changes** - If the change isn't small, check with the author (before or after)
- **Defer large changes** - Ask the author only when the scope is genuinely too large
- **LLM review comes first** - Author addresses automated feedback before human review

## Why This Works

- Reduces round-trips and waiting
- Spreads knowledge of the codebase
- Builds shared ownership mentality
- Removes ego from code review

## The Review Flow

1. Author opens PR
2. LLM reviews automatically
3. Author addresses LLM feedback (fix or mark irrelevant)
4. Human reviewer picks up the PR
5. Reviewer makes fixes directly (small fixes need no discussion)
6. Reviewer validates non-trivial changes with author (before or after making them)
7. Reviewer asks questions for understanding
8. Reviewer escalates to author only for genuinely large scope changes
9. Merge
