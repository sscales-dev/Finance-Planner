# 002 — Database: MongoDB Atlas

**Status:** Decided
**Date:** 2026-09-17

## Context
The app needs somewhere to persist transactions and settings beyond localStorage. `modules/database.js`
already has partial MongoDB Atlas wiring (blank credentials, unfinished), and `modules/classes.js`
sketches document shapes (`BudgetSpan`, `Paydate`, `Transaction`) aimed at Mongo specifically.
Server-side database experience is limited, so the choice needs to weigh learning cost as
heavily as technical merit.

## Decision
Stick with MongoDB Atlas.

## Alternatives considered
- **SQLite** — a local file, no network credentials to manage at all, which would remove the
  whole credentials/exposure concern in one move. Rejected: means learning SQL from scratch,
  and discards the Atlas wiring and document shapes already written.
- **No database yet, stay client-side** — cheapest short-term option. Rejected: the two-week
  goal is the budget maths working end to end against real data, which needs somewhere for
  that data to live beyond a browser tab.

## Consequences
Credentials currently sit blank in `database.js` and need moving to environment variables
before any real connection string goes in (see issue #3) — rotating the DB password was
already done independently, but the `.env` pattern is still worth adopting. Mongo's flexible
JSON-shaped documents match `classes.js`'s existing class designs closely, and match a
JSON-over-fetch API well, which fits the static-HTML-plus-API direction under discussion in
001. `modules/exampleMongoClient.js` and the unfinished CRUD functions in `database.js` are
the actual next work, not a false start to throw away.
