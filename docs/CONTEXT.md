# CONTEXT.md 

Unlike other budgeting apps (i believe), this budgeting tool enables the user to create more than one budget at a time and to plan into the future (with a degree of forecasting). There is also more focus on entering planned expenses that are both recurring (bills) and one-time/ ad-hoc, meaning it is more representative of real spending.

---

## 2. How to run it

```bash
npm install
npm run dev
# or: set DEBUG=finance-planner:* & npm start
# then open http://localhost:3000
```

`GET /` is served by `express.static` from `public/index.html`. Per `001-templating.md`,
static HTML + JSON API is the decided direction — `views/*.pug` and `routes/index.js` are
deleted, and `pug` is uninstalled from `package.json`. Fully closed.

---

## 3. Status legend

- **REAL** — working, intended to stay
- **PARTIAL** — works but incomplete or known-buggy
- **PLACEHOLDER** — looks like a feature, is actually hardcoded sample data
- **DEAD** — not loaded, not called, or would crash if it were

| File | Status | Note |
|---|---|---|
| `app.js` | REAL | Working |
| `bin/www` | REAL | Standard generator output |
| `routes/users.js` | DEAD | Generator stub — safe to delete |
| `views/error.pug` | REAL | Still used by the error handler |
| `routes/index.js`, `views/layout.pug`, `views/index.pug` | DELETED | Removed per `001-templating.md`; `pug` uninstalled |
| `public/index.html` | PARTIAL | The actual app. Contains placeholder data — see below |
| `public/stylesheets/style.css` | PARTIAL | Includes a verbatim copy of Bootstrap's default variables |
| `public/javascripts/main.js` | PARTIAL | Budget-settings form works; other forms have no processing |
| `public/javascripts/dates.js` | PARTIAL | 28-day branch works; monthly branch has a syntax bug |
| `public/javascripts/interface.js` | REAL | Loaded as a classic script, so its functions are global |
| `public/javascripts/fetch.js` | PARTIAL | Never loaded yet; wrong URL scheme. Destined to become the real fetch layer (roadmap #54), not deleted |
| `modules/database.js` | PARTIAL | Reads `process.env.MONGODB_URI` with a startup guard — credentials work is done. Not yet imported by any route (roadmap #53) |
| `modules/exampleMongoClient.js` | PARTIAL | Also updated to read `process.env.MONGODB_URI`. Still due to be merged into `database.js`, then deleted |
| `modules/classes.js` | PARTIAL | **Not just a sketch** — its shape maps to real documents already in the live Atlas cluster (`BudgetSpan`, `Paydate`, `Transaction`). See §5 and §6 — this changes the "derived vs stored" question |
| `docs/tasks.md` | REAL | To be superseded by GitHub Issues. Reviewed 2026-09-18 — new items folded into `ROADMAP.md` (see chat) |

### Placeholder data inside `public/index.html` — confirmed accurate ✅
- The 12 paydate `<th>` columns (`mmm-dd` / `monthly`)
- All 72 budget cells (`£0.00` in six category rows × twelve columns)
- The income rows: Universal Credit, PIP, Advance 2026
- The recurring rows: Rent, Council Tax, Groceries
- The one-off rows: Debt repayment, Tattoo, Unpaid bill
- Every skip-date dropdown (twelve `<li>`s cycling the same three January/February/March dates)
- The one-off category select, whose options are dates rather than categories
- The toast body and its `<img src="...">`

---

## 4. Glossary

### General Terms
| Term | Means | Notes |
|---|---|---|
| Payday / paydate | Both refer to the date income/an occurrence lands | **[claude]** Recommend splitting by audience rather than picking one: keep `paydate` in code/schema (matches existing `calculatePaydays`, `paydays` array — no churn), use "payday" in UI copy and conversation, since that's the more natural word for a person reading the screen |
| Budget(s) / Budget span | The collection of budgets configured in settings (the 6/12/18/24-month window) | Wanting to keep old budgets as "relics" for historical data rather than overwriting them — **[claude]** added to roadmap as a Future item (E9); the `BudgetSpan.status` field already in `classes.js` (`"active"` vs presumably something else) was clearly built with exactly this in mind, so adopting that schema gets you most of the way there for free |
| Skip date(s) | A control to choose one or more paydays to miss a payment | UI preference: a multi-select of upcoming paydays rather than a row of individual checkboxes. Underlying data stays the same — position-indexed (1..N within the item's stream), selected = excluded from that occurrence's sum. **[claude]** updated roadmap #28 to build the multi-select instead of inline checkboxes |
| "Deduct from" / "Display on Budget" | Which paydate stream (monthly or 28d) the item is charged against | "Deduct from" — current app's shorter wording. "Display on Budget" — the spreadsheet's field name for the same thing |
| Display on ~now / "Add to now/current" | A separate flag on recurring/one-off items: whether it also surfaces in the real-time "Now" tracker | Now tracker stays out of scope for the current goal |
| Renewal date / month | Date = the day-of-month payment is taken. Month = which calendar month a longer, non-monthly contract renews in (not applicable to monthly items) | Resolved |
| Next review date | For DWP income specifically — assessments happen intermittently and can change the amount, worth tracking when the next one's due | Resolved |
| 28d / four-weekly | Same thing — "28d" is the term to standardise on, more compact | Resolved |

### Parent Categories
**Five, final:** Income, Overheads, Essential, Discretionary, Loans & Debt.

| Term | Means | Notes |
|---|---|---|
| Available balance | Surplus for that one payday's window only. No carry-forward. | Each column stands alone: income minus outgoings due before the next payday of the same stream |
| Overheads | Committed/fixed bills you owe regardless of income that period | vs Essential — dividing line below |
| Essential | Flexible-*amount* spend that's still critical (varies week to week, but not optional) | **[claude]** "Essential" vs "Essentials" — doesn't matter functionally, it's just a label. The spreadsheet uses singular, so I'd keep that for consistency, but either works |
| Discretionary | Ad-hoc, non-essential — the first thing put aside when funds are limited | Some categories conceptually feel Essential but get treated as Discretionary in practice, since they're what actually gets cut when money's tight — noted as a deliberate practical choice, not a modelling problem |
| Loans & Debt | Confirmed final label (not "Lending and Borrowing") | Children: "debt repayments", "returned loans" (renamed from "lent in (+)") |
| ~Unknown | Dropped — relic from when the sheet also tracked raw Monzo transactions directly | |

### Payment Types — emerging, separate from Category
**[claude]** This reads as a genuinely distinct dimension from Category, not a replacement for
it: Category answers *what the spend is for* (for the budget roll-up); Payment Type answers
*what your actual obligation is* (useful for exactly the "what can I cut if money's tight"
question raised above). Proposed: a `payment_type` field on the Transaction shape in
`classes.js`, alongside the existing `payment_direction` and `payment_frequency` fields.
Values captured so far:

| Term | Means | Notes |
|---|---|---|
| Allocation (was "Pot allocation") | Money moved into a named Monzo pot on payday | Renamed per your note. This is also effectively the Category-roll-up-equals-pot-transfer mechanism discussed earlier — may end up overlapping with Category rather than needing to be fully separate. Worth a closer look once the pot list is finalised |
| Contracted payment | A DD-style obligation tied to a contract with a fixed end date. Can be postponed but not skipped without it still being owed | |
| Monthly payment | Usually card, sometimes DD. No contract — can be cancelled any time, and skipping genuinely skips it (nothing owed retrospectively) | |
| Advance repayment | An interest-free DWP loan via Universal Credit, deducted at source | This is income-side (a deduction from an income item), not an outgoing payment type in the same sense as the three above — worth deciding later whether it's the same field or a separate one. Going to remove as it's deducted at source. I only tracked it so I knew the renewal date so if it goes anywhere it goes under transactions without being displayed on the budget |

---

## 5. Data model

Drafted below from `modules/classes.js`, since that's real code you've already written — not
guessed from scratch. Figures are invented; check the shapes, not the numbers.

```json
// BudgetSpan — a stored budget instance
{
  "status": "active",
  "label": "current",
  "start": { "$date": "2026-06-30" },
  "duration": { "$numberDecimal": "12" },
  "last_updated": { "$date": "2026-09-17T10:00:00Z" },
  "date_created": { "$date": "2026-06-01T10:00:00Z" }
}

// Paydate — one occurrence, linked to a BudgetSpan
{
  "parent": "<BudgetSpan uuid>",
  "position": 4,
  "value": { "$date": "2026-09-22" },
  "frequency": { "value": "28d", "day_count": 28 },
  "date_updated": { "$date": "2026-09-17T10:00:00Z" },
  "date_created": { "$date": "2026-06-01T10:00:00Z" }
}

// Transaction — recurring example
{
  "label": "Council Tax",
  "url": "",
  "amount": { "$numberDecimal": "-27.00" },
  "payment_direction": "out",
  "payment_frequency": "monthly",
  "payment_type": "contracted",
  "category": "household-bills",
  "date_info": {
    "start_date": "2026-01-13",
    "duration": null,
    "renewal_date": 18,
    "renewal_month": null,
    "next_review": null
  },
  "include": true,
  "last_updated": { "$date": "2026-09-17T10:00:00Z" },
  "date_created": { "$date": "2026-01-01T10:00:00Z" }
}

// Transaction — one-off example
{
  "label": "Dentist",
  "url": "",
  "amount": { "$numberDecimal": "-90.00" },
  "payment_direction": "out",
  "payment_frequency": "one-off",
  "category": "healthcare",
  "date_info": {
    "planned_date": null,
    "deadline": "2026-11-01",
    "deadline_required": false
  },
  "include": true,
  "last_updated": { "$date": "2026-09-17T10:00:00Z" },
  "date_created": { "$date": "2026-09-17T10:00:00Z" }
}
```

`tasks.md` separately notes wanting "position (dates) and item sort (transactions)" as stored
fields — the `Paydate.position` field above already covers the first, and the same idea
applied to transactions (a `sort_order` field) would cover manual drag-sort later (roadmap #61).

### Category taxonomy — decision (2026-09-17, labels corrected 2026-09-18)
**Five parents, final:** Income, Overheads, Essential, Discretionary, Loans & Debt. `~Unknown`
dropped — a Monzo-import relic.

**Children are being rebuilt around actual Monzo pots**, not ported verbatim from the sheet's
~35 mostly-unused ones — full pot list still needed (Transport and Subscriptions confirmed so
far). Once categories map 1:1 to pots, the roll-up already planned (roadmap #33) produces the
payday transfer amounts automatically.

Model as data (`{ id, label, parent, order, archived }`), not hardcoded `<select>` options,
since user-editable categories are a planned later feature if this goes public.

### Three separate tools
Not one table with filters — three genuinely different things, matching three spreadsheet tabs:
1. **Recurring** (`_out_repeat`) — ongoing payments, per-item stream assignment ("Display on
   Budget": monthly or 28d), position-indexed skip, first/last payment dates, billing day/month,
   notes.
2. **One-off** (`_out_once`) — single payments, grouped under free-text section headers
   ("Debt", "NEXT") separate from Category, each assigned a specific date in one stream.
3. **Now** — a real-time account-balance + "can I afford this today" tracker. Out of scope for
   the current budget-maths goal.

---

## 6. Open decisions

Keep as one-paragraph ADRs in `docs/decisions/`.

**Still open:**
1. Desktop strategy for the 26-column table: scroll all, or window with prev/next? — not urgent,
   this is CSS-refactor-stage work (E6)
2. **[you]** Will this ever be used on a second device, or from outside your home network? — not
   urgent, affects auth/deployment (E8) much later

**Resolved:**
- Templating: static HTML + JSON API (`001-templating.md`, 2026-09-18)
- Database: staying with Mongo Atlas (`002-database.md`, 2026-09-17)
- Credentials: moved to `cred/.env`, read via `process.env` (2026-09-18)
- Paydates: derived from settings for the active budget; stored only as a frozen snapshot when
  a budget is archived (2026-09-18)
- Skip semantics: excludes that specific occurrence entirely, not a defer/reschedule

---

## 7. Known broken (as of this document)

- Monthly payday generation throws — invalid template literal in `dates.js` **[fixed]**
- Every inline `onclick="unfocusActiveButtons()"` throws, because the function is module-scoped **[fixed]**
- The Categories tab in Budget Settings does nothing (`#categories` vs `id="categorySettings"`) **[fixed]**
- `console.errer` typo inside the onload error handler **[fixed]**
- `getElementsByTagName("checkboxes")` always returns empty (no such element) **[tempfix]**
- Choosing `N/A` (or `weekly`) for a paydate frequency throws **[fixed]**
- Table row hover colour never applies (`--bsTable-hover-bg` should be `--bs-table-hover-bg`) **[fixed]**
- Every `justify-content-space-between` class is a no-op (should be `justify-content-between`) **[fixed]**
- Duplicate element id `incomeAmountInput` across two modals **[fixed]** 
- No favicon links in `<head>`; `site.webmanifest` has empty `name` fields

---

## 8. Conventions

- IDs: `camelCase`
- Classes: `kebab-case`
- Files: **[you]**
- Commits: **[you]** — Conventional Commits (`fix:`, `feat:`, `refactor:`) works well with
  GitHub Projects automation
- Branches: `<issue-number>-short-description`
- Indentation, quotes, semicolons: let Prettier decide and stop thinking about it
