---
layout: layout.njk
title: Modeling
---

# Modeling

## The Domain Is the Center of Gravity

Structure should be driven by the problem, not the framework. When the shape of your code mirrors the shape of your database or your HTTP layer rather than the shape of your domain, the framework is leading. The domain should lead.

## Domain Knowledge Is Built, Not Given

You don't get domain knowledge from a spec. You build it through iterative conversation with subject matter experts, product managers, and operations staff. Concepts split, merge, and rename as understanding deepens. This is the design work — not a prerequisite to it.

## Make Implicit Concepts Explicit

If the team keeps talking about something that isn't represented in the code, surface it. When a concept lives only in conversation, it has no home to evolve in. Naming it in the model is how it becomes real.

## Know What Has Identity and What Doesn't

An entity is a thing that persists and can change over time — you track it by who it is, not what it is. A value object is a thing defined entirely by its attributes — two value objects with the same attributes are interchangeable.

Default to the simpler option. Most things don't need identity.

## Model Refactoring Is Not Technical Refactoring

Clean code modeling the wrong thing is worse than messy code modeling the right thing. Renaming a class or splitting a concept is not a code cleanup task — it's a design decision. Treat it that way.
