# CONTEXT.md

Drop this in the repo root or `docs/`. Its job is to let anyone (or any AI) understand the
project in two minutes without guessing.

I've pre-filled what I could infer from the code and marked my guesses with **[check]**.
Lines marked **[you]** need you — I can't know the answer.

---

## 1. What this is

A personal finance planner for one user, replacing a Google Sheets workbook used for about
five years. It shows, for each payday across a 6–24 month span, how much money will be
available after planned income and expenditure.

**[you]** One paragraph on what makes this different from every other budgeting app, in your
own words. That paragraph is the thing that should settle future feature arguments.

---

## 2. How to run it

```bash
npm install
npm run dev          

# or: set DEBUG=finance-planner:* & npm start

# then open http://localhost:3000
```

**[check]** `GET /` is served by `express.static` from `public/index.html`, not by the Express
router, because `app.use(express.static(...))` is registered before `app.use('/', indexRouter)`
in `app.js`. That means `views/index.pug` is currently unreachable.

---

## 3. Status legend

Every file below is tagged. Please correct anything I've got wrong — this table is the single
most useful thing in this document, because from the outside I cannot tell a working feature
from a convincing placeholder.

- **REAL** — working, intended to stay
- **PARTIAL** — works but incomplete or known-buggy
- **PLACEHOLDER** — looks like a feature, is actually hardcoded sample data
- **DEAD** — not loaded, not called, or would crash if it were

| File | Status **[check]** | Note |
|---|---|---|
| `app.js` | REAL | Static middleware precedes the router — see §2 |
| `bin/www` | REAL | Standard generator output |
| `routes/index.js` | DEAD | Renders Pug that is never reached |
| `routes/users.js` | DEAD | Generator stub |
| `views/layout.pug`, `views/index.pug` | DEAD | See above |
| `views/error.pug` | REAL | Still used by the error handler |
| `public/index.html` | PARTIAL | The actual app. Contains placeholder data — see below |
| `public/stylesheets/style.css` | PARTIAL | Includes a verbatim copy of Bootstrap's default variables |
| `public/javascripts/main.js` | PARTIAL | Budget-settings form works; other forms have no processing |
| `public/javascripts/dates.js` | PARTIAL | 28-day branch works; monthly branch has a syntax bug |
| `public/javascripts/interface.js` | REAL | Loaded as a classic script, so its functions are global |
| `public/javascripts/fetch.js` | DEAD | Never loaded; wrong URL scheme |
| `modules/database.js` | DEAD | Not imported by any route; credentials blank |
| `modules/exampleMongoClient.js` | DEAD | Would throw on import |
| `modules/classes.js` | DEAD | Exports commented out; not imported |
| `docs/tasks.md` | REAL | To be superseded by GitHub Issues |

### Placeholder data inside `public/index.html` **[check]**
None of the following is real; all of it should eventually be rendered from data.

- The 12 paydate `<th>` columns (`mmm-dd` / `monthly`)
- All 72 budget cells (`£0.00` in six category rows × twelve columns)
- The income rows: Universal Credit, PIP, Advance 2026
- The recurring rows: Rent, Council Tax, Groceries
- The one-off rows: Debt repayment, Tattoo, Unpaid bill
- Every skip-date dropdown (twelve `<li>`s cycling the same three January/February/March dates)
- The one-off category select, whose options are dates rather than categories
- The toast body and its `<img src="...">`

---

## 4. Glossary **[you]**

Fill this in. Several of these terms are opaque from outside your spreadsheet, and getting
them wrong would make any help I give you subtly incorrect.

| Term | Means | Notes |
|---|---|---|
| Payday / paydate | | Are these the same thing in your head? |
| Budget span | | The 6/12/18/24-month window? |
| Available balance | Surplus for that one payday's window only. No carry-forward — confirmed 2026-09-17. | Each column stands alone: income minus outgoings due before the next payday of the same stream |
| Overheads | | vs Essential — dividing line is personal/visual sorting, not yet fixed; taxonomy will be user-editable later |
| Essential | | Real spreadsheet uses singular "Essential", not "Essentials" |
| Discretionary | | |
| Lending and Borrowing | Confirmed as the 5th parent category, replacing "Loans & Debt" | Children include "debt repayments" and "lent in (+)" (positive-direction: money owed back to Sam) |
| ~Unknown | Dropped — confirmed 2026-09-17 as a relic from when the sheet also tracked raw Monzo transactions directly | Final parent set: Income, Overheads, Essential, Discretionary, Lending and Borrowing |
| Pot allocation | A named Monzo pot (sub-account) money is deliberately moved into on payday — e.g. Transport, Subscriptions — confirmed 2026-09-17 | Child categories are being rebuilt around actual pots rather than the sheet's ~35 mostly-unused ones; full pot list still needed |
| Contracted payment | | vs "Monthly payment" — what distinguishes them? |
| Monthly payment | | |
| Advance repayment | | Income category with a negative amount — a deduction at source? |
| Skip date / Skip 1-6, 7-12 | Confirmed 2026-09-17: a checkbox per payday *position* (1-12) within an item's stream. Checked = excluded from that occurrence's SUMIF. Position number is hidden in day-to-day view, underneath the frequency label | Not a date at all — position-based, not calendar-based |
| "Deduct from" / "Display on Budget" | Which paydate stream (monthly or 28d) the item is charged against | "Deduct from" is the current app's wording; "Display on Budget" is the real spreadsheet's field name for the same thing |
| Display on ~now | A separate flag on recurring/one-off items: whether the item also surfaces in the real-time "Now" tracker | Now tracker is out of scope for the current 2-week goal |
| Renewal date / month | | Billing anniversary vs contract renewal? |
| Next review date | | |
| 28d / four-weekly | | Same thing, two names in the code |

---

## 5. Data model **[you]** (see also `docs/DATA-MODEL.md`)

Paste one real example of each. Invented examples are fine; realistic ones are better.

```json
// Budget settings as currently stored under localStorage key "budget"
{ }

// A recurring transaction
{ }

// A one-off transaction
{ }

// An income item
{ }
```

### Category taxonomy — decision (2026-09-17)
**Five parents, confirmed final:** Income, Overheads, Essential, Discretionary, Lending and
Borrowing. `~Unknown` is dropped — a relic from when the sheet also tracked raw Monzo
transactions, no longer relevant.

**Children are being rebuilt, not ported verbatim.** The sheet's ~35 child categories are more
than Sam actually uses. The better structure: children aligned to actual Monzo pots (confirmed
so far: Transport, Subscriptions — full list still needed), so that a category's roll-up total
*is* the pot transfer amount. Today this is done by hand every payday — selecting cells in
`_out_repeat` and reading Google Sheets' built-in selection-sum. Once categories map 1:1 to
pots, the roll-up already planned for item 33 in the roadmap produces this number automatically
— it's not new scope, just a reason to get the category list right before building it.

**[you]: still needed** — full list of current Monzo pots, and whether non-pot spending
(bought straight from main balance) should keep a handful of catch-all categories or be folded
into the pot list too.

Model as data (`{ id, label, parent, order, archived }`), not hardcoded `<select>` options,
since user-editable categories are a planned later feature if this goes public.

### Three separate tools (confirmed 2026-09-17)
Not one table with filters — three genuinely different things, matching three spreadsheet tabs:
1. **Recurring** (`_out_repeat`) — ongoing payments, per-item stream assignment ("Display on
   Budget": monthly or 28d), a skip mechanism **[open — see Glossary]**, first/last payment
   dates, billing day/month, notes.
2. **One-off** (`_out_once`) — single payments, grouped under free-text section headers
   ("Debt", "NEXT") separate from Category, each assigned a specific date in one stream.
3. **Now** — a real-time account-balance + "can I afford this today" tracker. This is the
   README's noted future feature and is explicitly **out of scope** for the current budget-maths
   goal.

---

## 6. Open decisions

Keep as one-paragraph ADRs in `docs/decisions/`. Currently open:

1. Static HTML + JSON API, or server-rendered Pug?
2. Mongo Atlas, SQLite, or no database yet?
3. Are paydates derived from settings, or stored as records?
4. Does "skip" mean cancel or defer?
5. Desktop strategy for the 26-column table: scroll all, or window with prev/next?
6. **[you]** Will this ever be used on a second device, or from outside your home network?

---

## 7. Known broken (as of this document)

- Monthly payday generation throws — invalid template literal in `dates.js`
- Every inline `onclick="unfocusActiveButtons()"` throws, because the function is module-scoped
- The Categories tab in Budget Settings does nothing (`#categories` vs `id="categorySettings"`)
- `console.errer` typo inside the onload error handler
- `getElementsByTagName("checkboxes")` always returns empty (no such element)
- Choosing `N/A` for the second paydate frequency throws
- Table row hover colour never applies (`--bsTable-hover-bg` should be `--bs-table-hover-bg`)
- Every `justify-content-space-between` class is a no-op (should be `justify-content-between`)
- Duplicate element id `incomeAmountInput` across two modals
- No favicon links in `<head>`; `site.webmanifest` has empty `name` fields

---

## 8. Conventions **[you]**

- IDs: `camelCase`
- Classes: `kebab-case`
- Files: `[you]`
- Commits: `[you]` — Conventional Commits (`fix:`, `feat:`, `refactor:`) works well with
  GitHub Projects automation
- Branches: `<issue-number>-short-description`
- Indentation, quotes, semicolons: let Prettier decide and stop thinking about it
