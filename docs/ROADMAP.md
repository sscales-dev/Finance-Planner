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

1. **ADR: static HTML + JSON API, or server-rendered Pug?** `[type:spike, needs-decision, area:html]` `S` `P0`
   Done when `docs/decisions/001-templating.md` exists and the losing option's files are deleted.
   *Context: `express.static` is registered before the router, so `GET /` already serves
   `public/index.html` and `views/index.pug` is unreachable. Right now Pug is dead code.*

2. **ADR: database choice (Mongo Atlas vs SQLite vs none yet)** `[type:spike, needs-decision, area:db]` `S` `P0`
   Done when `docs/decisions/002-database.md` exists with the tradeoffs you actually care about.

3. **Move DB credentials to environment variables** `[type:chore, area:server]` `S` `P0`
   Done when `modules/database.js` reads `process.env`, a `.env.example` is committed, `.env`
   is gitignored, and no credential exists in any tracked or untracked source file.
   *Node 20.6+ can load it natively: `node --env-file=.env ./bin/www`.*

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
    Confirmed 2026-09-17: five parents — Income, Overheads, Essential, Discretionary, Lending
    and Borrowing (`~Unknown` dropped, a relic of when the sheet tracked raw Monzo transactions).
    Children are NOT a straight port of the spreadsheet's ~35 — most go unused. Rebuild them
    around actual Monzo pots (Transport and Subscriptions confirmed so far, full list pending)
    plus a handful of catch-all categories for non-pot spending. Needs-decision blocked on the
    pot list. Done when the mapping lives in one JS module and every `<select>` is generated
    from it.

12. **Define the canonical transaction shape** `[type:docs, area:db]` `S` `P0`
    One shape with a `type` discriminator (`income` | `recurring` | `oneoff`) rather than three.

13. **Decide: are paydates derived or stored?** `[type:spike, needs-decision, area:dates]` `S` `P0`
    They're fully derivable from (start date, frequency, duration). Storing them as a separate
    collection, as `modules/classes.js` sketches, creates a sync problem you don't need.

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

22. **Fix inline `onclick` handlers calling module-scoped functions** `[type:bug, area:js]` `S` `P0`
    `unfocusActiveButtons` is defined inside `main.js`, which loads as `type="module"`, so
    every `onclick="unfocusActiveButtons()"` in the HTML throws a ReferenceError. Done when
    handlers are attached with `addEventListener` and no inline `onclick` remains.

23. **Fix the one-off category select** `[type:bug, area:forms]` `XS` `P1`
    Its options are dates (`2027-1-13`) rather than categories.

24. **Replace `<hr>` inside `<select>` with `<optgroup>`** `[type:refactor, area:forms]` `XS` `P2`
    `<hr>` in a select is newly permitted by the spec but support varies, and `<optgroup>`
    labels carry actual meaning for screen readers.

25. **Build the Categories settings tab content** `[type:feature, area:forms]` `M` `P2`

26. **First-run flow when localStorage is empty** `[type:feature, area:forms]` `S` `P1`
    Also fix `console.errer` in the onload catch block, which currently throws inside the
    error handler.

### E4 — Transactions

27. **Render the income/recurring/one-off tables from data** `[type:refactor, area:table]` `L` `P0`
    Split by table. The sample rows (Universal Credit, PIP, Rent, Council Tax, Groceries,
    Tattoo…) are hardcoded in `index.html`.

28. **Build per-position skip checkboxes from the real paydays array** `[type:refactor, area:table]` `M` `P1`
    Confirmed 2026-09-17: not a date dropdown — one checkbox per payday *position* within the
    item's stream (1..N, matching that stream's SUMIF-excludable columns in the spreadsheet).
    Checked means excluded from that occurrence. Currently twelve hardcoded `<li>`s cycling the
    same three dates; replace with N checkboxes, N = paydays in that stream across the budget
    span, each tagged with its position rather than a specific date.

29. **Add / edit / archive / delete for each transaction type** `[type:feature, area:forms]` `L` `P1`

30. **Make the row toggles accessible** `[type:refactor, area:a11y]` `M` `P1`
    The include/exclude and expand/collapse controls are `<i>` elements with `onclick` — not
    focusable, no accessible name, no keyboard operation. Done when they're `<button>`s with
    `aria-pressed` / `aria-expanded`.

31. **Wire the toast to real events** `[type:feature, area:js]` `S` `P2`
    Also remove the `<img src="...">` placeholder, which fires a 404 on every page load.

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
    `PATCH/DELETE /api/transactions/:id`. Write it down before coding it.

52. **Server-side validation of every payload** `[type:feature, area:server]` `M` `P1`
    Client-side `required` attributes are UX, not security.

53. **Wire the DB module to routes** `[type:feature, area:db]` `L` `P1`
    Also: `createCollection` ignores its own db argument and hardcodes `transactions`.

54. **Client fetch layer with error handling** `[type:feature, area:js]` `M` `P1`
    localStorage becomes a cache with a `lastSynced` marker rather than the source of truth.
    (This supersedes the `docs/tasks.md` note about moving to sessionStorage.)

55. **Backup / export** `[type:feature, area:db]` `S` `P1`
    JSON or CSV download. For five years of personal finance data this matters more than most
    features on this list.

### E8 — Auth & deployment

56. **Login with Argon2** `[type:feature, area:server]` `L` `P2`
    Only needed before anything is exposed beyond localhost. Until then it's ceremony.

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
