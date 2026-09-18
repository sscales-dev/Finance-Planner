# Financial Planner — Roadmap, Backlog and GitHub Projects Setup

Drop this in `docs/ROADMAP.md`. It replaces `docs/tasks.md` once the issues are created.
Anything marked **[decide]** needs an answer from you before the work is safe to start.

---

## 1. Milestones

Use GitHub **Milestones** for these (repo → Issues → Milestones). One milestone per release.

| Milestone | Means | Target |
|---|---|---|
| `v0.1 Usable locally` | Settings → transactions → a **correct** budget table. Data in localStorage. No server involved. | First |
| `v0.2 Persisted` | JSON API + database. localStorage becomes a cache, not the source of truth. | Second |
| `v0.3 Polished` | CSS/HTML refactor complete, responsive at all breakpoints, accessible, sorting + archive views. | Third |
| `v0.4 Networked` | Login, HTTPS, served beyond localhost. | Fourth |
| `Later` | Now-planner, charts, drag-sort, PWA/offline. | Unscheduled |

The single most important line above is v0.1. The app's whole purpose is "how much have I got
available on each payday", and that calculation does not exist yet — every cell in the budget
table is a hardcoded `£0.00`. Everything else is in service of that.

---

## 2. Epics

Create these as a single-select **Epic** field in the Project (not labels — see §4).

| ID | Epic | Covers |
|---|---|---|
| E0 | Foundations & hygiene | Decisions/ADRs, secrets, tooling, scripts, linting, docs, dead code |
| E1 | Domain & data model | Glossary, category taxonomy, canonical JSON shapes |
| E2 | Date engine | Payday generation, weekend shifting, duration, tests |
| E3 | Budget settings | Settings modal, forms, first-run flow, categories tab |
| E4 | Transactions | Income / recurring / one-off CRUD, data-driven tables |
| E5 | Budget computation | Category roll-ups, available balance, column rendering |
| E6 | UI system | CSS refactor, breakpoints, 1200px layout, accessibility |
| E7 | Server & persistence | API surface, validation, DB wiring, backup/export |
| E8 | Auth & deployment | Argon2 login, HTTPS, LAN/hosted serving |
| E9 | Future features | Now-planner, charts, drag-sort, multi-budget compare |

---

## 3. Recommended sequence

**Sprint 1 — clear the ground (issues #1–#9 below).**
Decisions, secrets, the one P0 date bug, a baseline of screenshots and validator output, and
the docs. Nothing here is glamorous and all of it makes the next two sprints cheaper.

**Sprint 2 — make the tables data-driven (E1, E4 partial).**
Delete the hardcoded rows and columns, render from data, add `name` attributes to every form
field. This is the real content of "refactor HTML/Bootstrap".

**Sprint 3 — the maths (E5).**
One vertical slice first: one income + one recurring expense producing a correct available
balance across three columns. Then generalise.

**Sprint 4 — CSS refactor + 1200px (E6).**
Deliberately last of the four. Refactoring CSS for markup you are about to delete is wasted
effort, and you cannot tell a layout regression from a layout improvement without the
Sprint 1 baseline screenshots.

---

## 4. GitHub Projects setup (step by step)

You've not used Projects before, so here's the shape that works for a solo repo.

### Create it
1. GitHub → your profile → **Projects** → **New project** → **Board**.
2. Name it `Financial Planner`. Settings → link it to the `Finance-Planner` repo.

### Custom fields (Project → ⚙ Settings → Fields → New field)
| Field | Type | Options |
|---|---|---|
| `Status` | Single select | `Backlog`, `Ready`, `In progress`, `Blocked`, `In review`, `Done` |
| `Epic` | Single select | `E0 Foundations` … `E9 Future` (from §2) |
| `Size` | Single select | `XS` (<30 min), `S` (<2 h), `M` (half day), `L` (needs splitting) |
| `Priority` | Single select | `P0` (broken/blocking), `P1` (this milestone), `P2` (someday) |
| `Iteration` | Iteration | 1 week, starting Monday |

### Views (tabs at the top of the Project)
- **Board** — grouped by `Status`. Your day-to-day view.
- **By epic** — Table layout, grouped by `Epic`. Your planning view.
- **This week** — Table, filtered `iteration:@current`. Your only-look-at-this view.
- **Quick wins** — Table, filtered `size:XS status:Ready`. For low-energy days.

### Labels vs fields
Labels live on the **issue** and are searchable across the whole repo and from the CLI.
Project fields live on the **board** only. So: use labels for things you'll want to search
and filter in Issues, use fields for workflow state.

Create these labels (repo → Issues → Labels):

```
type:bug        type:feature    type:refactor   type:docs
type:chore      type:spike      type:test
area:html       area:css        area:js         area:dates
area:forms      area:table      area:server     area:db
area:a11y       area:build
needs-decision  blocked         quick-win
```

Two labels do real work for you: `needs-decision` (so you never start something whose answer
you don't have) and `quick-win` (so a bad day still moves the project).

### Automation (Project → ⚙ → Workflows — turn these on)
- *Item added to project* → set `Status: Backlog`
- *Item closed* → set `Status: Done`
- *Auto-add to project* → any new issue in the repo

Then in commits/PRs write `Closes #12` and the issue closes and moves itself.

### Definition of Done (put this in `.github/ISSUE_TEMPLATE/task.md`)
```markdown
## Goal
<one sentence>

## Done when
- [ ]
- [ ]

## Out of scope
<what you are deliberately not doing here>

## Notes / links
```
The **Out of scope** box is the important one. It's the thing that ends a rabbit hole with a
new issue instead of a lost afternoon.

### Working rules
- WIP limit: **one** item in `In progress`. Two maximum.
- Anything sized `L` gets split before it's allowed into `Ready`.
- One branch per issue: `12-fix-monthly-paydate-bug`.
- If you discover something mid-task, open an issue, don't chase it.

---

## 5. Seeded backlog

Titles are written so you can paste them straight in. Labels in brackets.

### Sprint 1 — clear the ground

1. ~~**ADR: static HTML + JSON API, or server-rendered Pug?**~~ **DONE 2026-09-18** — decided
   static HTML + JSON API. `001-templating.md` gives good reasoning: avoids learning a new
   templating engine, practices vanilla JS/async, and matches Mongo's JSON-native shape.
   `views/*.pug` and `routes/index.js` deleted, `pug` uninstalled. Fully closed.

2. ~~**ADR: database choice (Mongo Atlas vs SQLite vs none yet)**~~ **DONE 2026-09-17** — Mongo
   Atlas confirmed, `002-database.md` written.

3. ~~**Move DB credentials to environment variables**~~ **DONE 2026-09-18** — `database.js` and
   `exampleMongoClient.js` both read `process.env.MONGODB_URI` with a startup guard if it's
   missing, `.env` lives at `cred/.env` and is gitignored. Exactly the pattern planned. Two
   small leftovers, no urgency: the unused hardcoded `docs` array inside
   `insertMultipleDocuments` (still item #10), and merging `exampleMongoClient.js` into
   `database.js` before deleting it (also #10).

4. **Fix invalid template literal in monthly payday calculation** `[type:bug, area:dates]` `XS` `P0`
   `public/javascripts/dates.js` builds `` new Date(`${year}-"${monthNum}-...`) `` with a stray
   double quote. Every monthly paydate after the first is an Invalid Date, so `.toISOString()`
   throws. Done when 12 valid monthly dates come back.

5. **Add jest tests for the date engine** `[type:test, area:dates]` `M` `P0`
   Done when `npm test` passes and covers: weekend shift back to Friday, month rollover,
   year rollover, 31st-of-month and Feb 29 inputs, BST/GMT boundary dates, and the 28-day cycle.
   *Write these before touching the date code again. Jest is already installed.*

6. **Fix package.json scripts and dependency placement** `[type:chore, area:build]` `XS` `P1`
   Move `jest` to `devDependencies`. Add `"test": "jest"` and `"dev": "node --watch ./bin/www"`.

7. **Capture visual baseline before refactoring** `[type:chore, area:css]` `S` `P1`
   Done when `docs/baseline/` holds screenshots of all four tabs and all three modals at
   360 px, 768 px and 1280 px. This is how you'll prove the CSS refactor didn't break anything.

8. **Run W3C HTML + CSS validators and log findings** `[type:test, area:html]` `S` `P1`
   Done when each distinct error class has its own issue. Known already: `</link>` closing tag,
   duplicate element IDs, `<hr>` inside `<select>`, stray backtick in an `aria-describedby`.

9. **Write the docs set** `[type:docs]` `M` `P1`
   Done when `docs/CONTEXT.md`, `docs/ARCHITECTURE.md`, `docs/DOMAIN.md` and
   `docs/DATA-MODEL.md` exist. Use the CONTEXT template provided alongside this file.

10. **Remove dead code** `[type:chore]` `S` `P1`
    `public/javascripts/fetch.js` (never loaded, wrong scheme, top-level await in a classic
    script). `modules/exampleMongoClient.js` (mixes `require` with `export`, references
    undefined `username`/`password`, runs on import — it would crash if ever required; move it
    to `docs/` as a snippet). Commented-out nav block in the settings modal. Unused
    `docs` array inside `insertMultipleDocuments`.

### E1 — Domain & data model

11. **Define the category taxonomy, aligned to Monzo pots** `[type:feature, area:forms]` `M` `P0`
    Confirmed: five parents — Income, Overheads, Essential, Discretionary, Loans & Debt
    (`~Unknown` dropped, a relic of when the sheet tracked raw Monzo transactions). Children are
    NOT a straight port of the spreadsheet's ~35 — most go unused. Rebuild them around actual
    Monzo pots (Transport and Subscriptions confirmed so far, full list pending) plus a handful
    of catch-all categories for non-pot spending. Needs-decision blocked on the pot list. Done
    when the mapping lives in one JS module and every `<select>` is generated from it.

12. **Define the canonical transaction shape** `[type:docs, area:db]` `S` `P0`
    Already sketched in `modules/classes.js`: one `Transaction` class with `payment_direction`,
    `payment_frequency`, `category`, and a polymorphic `date_info` (`RecurringDateInfo` or
    `OnetimeDateInfo`) rather than three separate shapes with a flat `type` field. Recommend
    adopting this directly — it's a sound design already done — plus adding a new `payment_type`
    field (Allocation / Contracted / Monthly, from the 2026-09-18 glossary discussion).

13. **Decide: are paydates derived or stored?** `[type:spike, needs-decision, area:dates]` `S` `P0`
    **RESOLVED 2026-09-18:** derive the active budget's paydates from settings via
    `calculatePaydays` (no sync problem, matches `dates.js` as built). Store a frozen snapshot
    only when a budget span is archived as a "relic" (E9, #66) — that's the one point where
    preserving exactly what was true at the time (including that payday's skips) genuinely
    needs storage rather than a live recalculation. `classes.js`'s `Paydate` class becomes the
    shape for that snapshot, not a live-synced parallel structure.

14. **Define skip-date semantics** `[type:docs, needs-decision]` `XS` `P1`
    Does "skip" mean *don't charge this instance* or *move it to the next payday*? The answer
    changes the data shape (array of skipped ISO dates vs array of date overrides).

### E2 — Date engine

15. **Drive payday count from budget duration** `[type:feature, area:dates]` `M` `P1`
    Currently hardcoded to 12 monthly + 14 fortnightly regardless of the 6/12/18/24 setting.
    Comments and the legacy `addDates` code also reference 17/19/36, so pick one truth.

16. **Add `N/A` and `weekly` handling to `calculatePaydays`** `[type:bug, area:dates]` `M` `P1`
    The settings form offers `N/A` for the second paydate and `weekly` for either paydate;
    `calculatePaydays` only implements `monthly` and `28d` and throws on anything else.

17. **Make all date arithmetic timezone-safe** `[type:refactor, area:dates]` `M` `P1`
    `ifDateWeekend` uses local-time `setDate` (which can roll a month) plus an "if it's 23:00
    add an hour" hack that is really a BST workaround. Done when dates are handled as
    `YYYY-MM-DD` strings with UTC-only arithmetic and the Sprint 1 tests still pass.

18. **Sort the combined paydays array explicitly** `[type:refactor, area:dates]` `XS` `P2`
    `.sort()` on an array of arrays stringifies; it happens to work for ISO dates. Sort on a
    parsed date instead.

### E3 — Budget settings

19. **Add `name` attributes to every form field** `[type:refactor, area:forms]` `S` `P0`
    Then read forms with `new FormData(form)` instead of `getElementsByTagName` plus
    positional indices like `freqValuesArray[2]`. This single change deletes
    `formElementValuesToArray`, `getFormInputValuesObject`, and most of the brittleness in
    `processFormValues` — and it's the same shape you'll POST to the server later.

20. **Fix the Categories tab** `[type:bug, area:html]` `XS` `P1`
    The nav link targets `#categories`; the section's id is `categorySettings`. The tab does
    nothing.

21. **Fix duplicate element IDs** `[type:bug, area:html]` `XS` `P1`
    `incomeAmountInput` appears in both the Add Income and Add Recurring modals.

22. **Fix inline `onclick` handler calling a module-scoped function** `[type:bug, area:js]` `S` `P0`
    `unfocusActiveButtons` is defined inside `main.js`, which loads as `type="module"`, so
    every `onclick="unfocusActiveButtons()"` in the HTML throws a ReferenceError. **Final call,
    2026-09-18:** consolidate into `main.js`, remove inline `onclick` from the HTML entirely,
    and build an `addEventListeners` function that wires everything up programmatically.
    `interface.js`'s functionality moves into `main.js` too — no separate home for it; other
    pieces may get split into their own modules later, decided as it becomes obvious rather
    than upfront.

23. **Fix the one-off category select** `[type:bug, area:forms]` `XS` `P1`
    Its options are dates (`2027-1-13`) rather than categories.

24. **Replace `<hr>` inside `<select>` with `<optgroup>`** `[type:refactor, area:forms]` `XS` `P2`
    `<hr>` in a select is newly permitted by the spec but support varies, and `<optgroup>`
    labels carry actual meaning for screen readers.

25. **Build the Categories settings tab content** `[type:feature, area:forms]` `M` `P2`

25b. **Conditional required fields on the recurring form** `[type:feature, area:forms]` `S` `P2`
    From `tasks.md`: when Category is Household Bills or Subscriptions, Renewal Date and
    Renewal Month should become required fields.

26. **First-run flow when localStorage is empty** `[type:feature, area:forms]` `S` `P1`
    Also fix `console.errer` in the onload catch block, which currently throws inside the
    error handler.

### E4 — Transactions

27. **Render the income/recurring/one-off tables from data** `[type:refactor, area:table]` `L` `P0`
    Split by table. The sample rows (Universal Credit, PIP, Rent, Council Tax, Groceries,
    Tattoo…) are hardcoded in `index.html`.

28. **Build a skip-payday multi-select from the real paydays array** `[type:refactor, area:table]` `M` `P1`
    Confirmed: not a per-position checkbox row (too wide for a web UI) — a multi-select of
    upcoming paydays for that item's stream. Underlying data is unchanged: position-indexed
    (1..N within the stream), selected = excluded from that occurrence's sum. Currently twelve
    hardcoded `<li>`s cycling the same three dates; replace with a multi-select built from
    N = paydays in that stream across the budget span.

29. **Add / edit / delete for each transaction type** `[type:feature, area:forms]` `L` `P1`
    Archive already works (`tasks.md` COMPLETED) — this is the remaining three.

30. **Make the row toggles accessible** `[type:refactor, area:a11y]` `M` `P1`
    The include/exclude and expand/collapse controls are `<i>` elements with `onclick` — not
    focusable, no accessible name, no keyboard operation. Done when they're `<button>`s with
    `aria-pressed` / `aria-expanded`.

31. **Wire the toast to real events, and style/position it** `[type:feature, area:js]` `S` `P2`
    Also remove the `<img src="...">` placeholder, which fires a 404 on every page load.

31b. **Add loading-state indicators for async actions** `[type:feature, area:js]` `S` `P2`
    From `tasks.md` — a small polish item, not urgent.

### E5 — Budget computation (the actual product)

32. **Render budget table columns from the paydays array** `[type:refactor, area:table]` `M` `P0`
    Removes 12 hardcoded `<th>`s and 72 hardcoded `<td>`s. `addNewPaydateElements` already
    does half of this; it just needs to own all of it, including removing columns.

33. **Category roll-up per payday column** `[type:feature, area:table]` `L` `P0`
    For each column and each parent category, sum the included transactions due in that period.
    Split into: monthly recurring, 28-day recurring, one-offs, income. Once categories map 1:1
    to Monzo pots (issue #11), this same roll-up *is* the "how much to move into each pot on
    payday" number Sam currently works out by hand in the spreadsheet — no extra feature needed,
    just the right category granularity.

34. **Available balance per window** `[type:feature, area:table]` `S` `P0`
    Confirmed 2026-09-17: each column stands alone — income minus outgoings due in that
    window only. No carry-forward between columns. Windows are half-open,
    `[thisPayday, nextPayday)`: a transaction due exactly on a payday belongs to the window
    starting there, not the one ending there. In comparison terms:
    `date >= windowStart && date < windowEnd`.

35. **Tests for the roll-up maths** `[type:test]` `M` `P0`
    Including the case that will bite you: a 28-day expense landing twice inside one monthly
    column.

36. **Expandable category rows showing contributing items** `[type:feature, area:table]` `M` `P2`
    The `fa-square-plus` toggles already exist and do nothing yet.

### E6 — UI system

37. **Delete the copied Bootstrap variable block from style.css** `[type:refactor, area:css]` `XS` `P1`
    ~130 lines re-declaring Bootstrap's own defaults at identical values. Pure noise. Override
    only what you actually change.

38. **Reduce the colour palette to semantic tokens** `[type:refactor, area:css]` `M` `P1`
    ~40 named colours, several labelled "unused - possible". Target around ten:
    `--surface`, `--surface-alt`, `--text`, `--text-muted`, `--border`, `--brand`, `--accent`,
    `--positive`, `--negative`, `--focus`. Then map Bootstrap's `--bs-primary` and friends onto
    them so components inherit your theme instead of being individually overridden.

39. **Stop flexing table rows** `[type:refactor, area:css]` `L` `P1`
    Every `<tr>` carries `d-flex`/`d-inline-flex` and cells carry `d-md-flex`, which throws
    away native table column alignment. That's why widths are in `vw` and why there are so many
    overrides. Done when rows are normal table rows and column widths come from `<colgroup>`
    with `table-layout: fixed`. This is the biggest single simplification available in the CSS.

40. **Replace `vw`/`vh` sizing with `rem` + `min-width`** `[type:refactor, area:css]` `M` `P1`
    `vw` widths ignore container padding and scrollbars; `vh` row heights shift with mobile
    browser chrome.

41. **Remove all `!important`** `[type:refactor, area:css]` `S` `P2`
    Mostly a symptom of #39 and #37. Should largely dissolve once those land.

42. **Replace `justify-content-space-between`** `[type:bug, area:css]` `XS` `P2`
    Not a Bootstrap class — the real one is `justify-content-between`. Every instance in the
    HTML is currently a no-op.

43. **Fix the `--bsTable-hover-bg` typo** `[type:bug, area:css]` `XS` `P2`
    Bootstrap's variable is `--bs-table-hover-bg`, so the parchment row hover never applies.

44. **Standardise on Bootstrap's breakpoints** `[type:refactor, area:css]` `S` `P1`
    Currently `max-width: 374px`, `min-width: 576px`, `min-width: 1200px`. Going straight from
    phone to xl leaves 768–1199 px unstyled. Make the phone layout fluid so the 374 px hack can
    go, then add `768` and `992` deliberately.

45. **Reorganise style.css into sections** `[type:refactor, area:css]` `S` `P2`
    `tokens → base → layout → components → utilities`, with each component's media queries
    sitting with the component rather than in one block at the bottom.

46. **1200px: sticky category column and sticky header row** `[type:feature, area:css]` `M` `P1`
    `position: sticky; left: 0` on `.category-column` and `top: 0` on the paydate row. On a
    26-column table this is the difference between usable and not.

47. **1200px: decide the desktop column strategy** `[type:spike, needs-decision, area:css]` `S` `P1`
    All 26 columns with horizontal scroll, or a window of N columns with prev/next? Answer this
    before writing any xl CSS — it determines all of it.

48. **Add favicon links** `[type:chore, area:html]` `XS` `P2`
    The files exist in `public/images/favicon/` but nothing in `<head>` references them, and
    the `site.webmanifest` has empty `name` fields.

49. **Fix heading structure** `[type:refactor, area:a11y]` `S` `P2`
    An `<h1>` nested inside the brand `<a>`, plus `<h1 class="modal-title">` in every modal.
    One `<h1>` per page.

50. **Accessibility pass** `[type:refactor, area:a11y]` `M` `P1`
    Real `<label>`s, visible focus rings, keyboard operation of every control, contrast check
    on the custom palette (`--glaucous` and `--parchment` on white are both worth measuring).

### E7 — Server & persistence

51. **Define the API surface** `[type:docs, area:server]` `S` `P1`
    e.g. `GET/PUT /api/settings`, `GET/POST /api/transactions`,
    `PATCH/DELETE /api/transactions/:id`. Write it down before coding it. This is also where
    budget settings and the category list move from localStorage/a config file into Mongo —
    `budgets` collection already exists in design (`BudgetSpan`), add a `categories`
    collection alongside it. **Future-proofing tip, low cost now:** give every document in
    every collection a `userId` field from day one, even hardcoded to one value while you're
    the only user. That single field is what actually saves a painful migration if this ever
    goes multi-user — far more valuable than getting the collection layout perfect upfront.

52. **Server-side validation of every payload** `[type:feature, area:server]` `M` `P1`
    Client-side `required` attributes are UX, not security.

53. **Wire the DB module to routes** `[type:feature, area:db]` `L` `P1`
    Also: `createCollection` ignores its own db argument and hardcodes `transactions`.

54. **Client fetch layer with error handling** `[type:feature, area:js]` `M` `P1`
    localStorage becomes a cache with a `lastSynced` marker rather than the source of truth.
    (This supersedes the `docs/tasks.md` note about moving to sessionStorage.) When a save
    succeeds, feed the Mongo-assigned `_id` back into the cached localStorage copy of that item
    — from `tasks.md` — so later edits reference the right document.

55. **Backup / export** `[type:feature, area:db]` `S` `P1`
    JSON or CSV download. For five years of personal finance data this matters more than most
    features on this list.

### E8 — Auth & deployment

56. **Login with Argon2** `[type:feature, area:server]` `L` `P2`
    Only needed before anything is exposed beyond localhost. Until then it's ceremony. Scope
    note: Argon2 is for *login password hashing* only. `tasks.md` also lists "encryption for
    credentials" under Database — that's a different concern (protecting the Mongo connection
    string, which you need to read back out, not just verify), already covered by issue #3's
    `.env` approach. Argon2 can't do that job; it's one-way.

57. **Decide HTTPS / LAN serving approach** `[type:spike, needs-decision, area:server]` `S` `P2`

58. **Update README deployment section** `[type:docs]` `S` `P2`
    It currently describes GitHub Pages, which cannot host an Express app. Replace with the
    real story for whatever you pick.

### E9 — Future

59. Now-planner (the `_now` sheet equivalent) `[type:feature]` `L`
60. Manual drag-and-drop sorting of itemised lists `[type:feature]` `L`
61. Column sorting on itemised tables `[type:feature]` `M`
62. Charts / trend view `[type:feature]` `M`
63. Multi-budget comparison (what-if scenarios) `[type:feature]` `L`
64. PWA / offline support `[type:feature]` `L`
65. Mobile drag gesture on item rows for delete/archive `[type:feature]` `M` — from `tasks.md`
66. Archive completed budgets as "relics" for historical data, rather than overwriting them —
    the `BudgetSpan.status` field in `classes.js` already anticipates this

---

## 6. Learning resources, matched to the above

Chosen to be short and directly applicable rather than comprehensive.

**Forms and data (issue #19)**
- MDN — [Sending form data](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms/Sending_and_retrieving_form_data)
- MDN — [FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData)

**Dates (issues #4, #5, #17)**
- MDN — [Date and time formats](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/parse)
- [date-fns](https://date-fns.org/docs/Getting-Started) if you decide to stop hand-rolling
- MDN — [Temporal](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal) for where this is all heading

**Testing (issues #5, #35)**
- [Jest — Getting Started](https://jestjs.io/docs/getting-started)
- Pure functions like `calculatePaydays` are the easiest possible place to learn testing:
  input in, value out, no DOM.

**CSS (issues #37–#45)**
- [web.dev — Learn CSS](https://web.dev/learn/css) — the Cascade and Specificity chapters are
  the antidote to `!important`
- [Bootstrap 5.3 — CSS variables](https://getbootstrap.com/docs/5.3/customize/css-variables/)
- [MDN — position: sticky](https://developer.mozilla.org/en-US/docs/Web/CSS/position#sticky)

**Async JS (your stated weak spot)**
- [javascript.info — Promises, async/await](https://javascript.info/async) — worked examples,
  runnable in the page

**Project management**
- [GitHub Docs — Planning and tracking with Projects](https://docs.github.com/en/issues/planning-and-tracking-with-projects)
- [ADRs explained](https://adr.github.io/) — keep yours to one paragraph each

---

## 7. Things deliberately NOT on this list

Saying no is half the plan.

- **A front-end framework** (React/Vue/Svelte). It would add a build step, a package
  ecosystem and a mental model, and buy you nothing this app needs. Revisit only if the
  budget table's interactivity genuinely outgrows vanilla DOM work.
- **TypeScript.** Would catch real bugs here, but it's a second language on top of the one
  you're still learning. Good candidate for the version after v0.2.
- **Docker / CI pipelines.** Not until something is deployed.
- **Sass.** Bootstrap 5.3's CSS custom properties cover your theming needs without a compile
  step.
- **Rewriting the Google Apps Script functions** (`addDates`, `addPaydayLists`). They're
  commented out and belong to the spreadsheet era. Move them to `docs/legacy/` as reference
  and delete them from `dates.js`.
