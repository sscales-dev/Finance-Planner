# 001 — Templating: Static HTML + JSON API or server-rendered Pug?

**Status:** Decided
**Date:** 2026-09-18

## Context
The exisiting HTML contains lots of duplication that should be handled by either the HTML element ```<template>``` and utilising JavaScript to fill in the content, or a templating engine on the server.

## Decision
I chose to go with HTML and JSON API as it means:

1. I don't have to learn a new framework/ templating engine.
2. I can practice more vanilla javascript.

## Alternatives considered
Pug was considered as it was installed in the setup that was followed from an online guide.

## Consequences
Some of the duplication code has already been written and will require minor adjustments.
With Pug I'd be converting JSON into HTML on the server, which is more work for less flexibility. Given I am using a MongoDb Atlas Cluster for my database it makes sense as my server already handles JSON well.
HTML + JSON API means I will be practicing/ learning more async await rather than something completely new (which is an area I need to strengthen). It also helps me understand the fundamentals better.

If after a week of writing render functions I find I hate it, the hybrid is legitimate. Pug renders the initial page, JS handles the toggling.