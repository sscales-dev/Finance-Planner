# Tasks

## Layout and styling

### Next

- [ ] Create tab content for categories tab in settings modal
- [ ] Add Nested Tables in Overview section with categories
- [ ] within forms - select option:hover color
- [ ] Amend unfocus active buttons to blur button and move to interface - put back on onclik in html
- [ ] Add 'edit' forms on itemised sections
- [ ] Add functionality for each new form to processFormValues
- [ ] Add 'loading' displays
- [ ] Add prompt to enter budget settings if not loaded from localStorage
- [ ] Add functionality to recurring payment add formn selects:
    > renewal date and month
    > if category === household bills
    > if category === subscriptions
        > renewal date +/ month should be required
- [ ] Add functionailty to factor in budget duration in calculate paydays etc
- [ ] Add onclick on navtabs to switch between last updated times depending on tab in budget settings
- [ ] Add login option/ modal etc

---

- [ ] Tidy HTML classes 
  - [ ] ids camelcase
  - [ ] classes kebab case
  - [ ] classes in unified order
- [ ] Refactor CSS

## Modals + Forms

- [ ] Rename all form element ids, classes and attributes to be specific and consistent
- [ ] Ensure all forms have all required attributes
- [ ] Ensure all form aspects have suitable names and ids and descriptions etc
- [ ] Add required to needed inputs

### Javascript

- [ ] Add functionailty to update year label at top left of budgets table in dates functions
- [ ] Move localStorage to sessionStorage once database module working
- [ ] Add other background parameters for items when storing
  - [ ] Add position (dates) and item sort (transactions)

  ---

  - [ ] Tidy existing functions
  - [ ] Comment properly throughout functions
  - [ ] Ensure error checking, end-of-statement semi-colons, console.logging etc

## Interface

- [] Finish Bootstrap + Javascript interface controls

## Server

- [ ] Setup server side routing properly (test)
- [ ] Add post functionality for collecting form data
- [ ] Add fetch functions on client-side JS to send data to server
- [ ] Add functionality to integrate with database

## Database

- [ ] !!create encryption process for credentials (Argon2id)
- [ ] Update classes for documents in MongoDb
- [ ] Finish adding CRUD operations for MongoDb
- [ ] Link database module to router
- [ ] When adding to database, feedback item uuid to localStorage

## Notes

- [ ] Fetch: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
- [ ] Review async js scripts??
// DB backup option: Install browserfy https://forum.freecodecamp.org/t/reference-error-require-is-not-defined/319190/13

## Future features

- [ ] Create drag feature on item rows on mobile to choose from delete or archive options
- [ ] Login/ security
- [ ] Serve on local network
- [ ] Sorting of itemised lists
- [ ] Add Toast functionality + style/ position toast elements


## COMPLETED

- [x] Add styling for tablet and desktop screens
- [x] Add hover for icons and clickable items
- [x] Add medium (768px) styling for layout
- [x] Add Income 'add-item' modal
- [x] Amend Recurring 'add-item' modal
- [x] Add date updated field to settings form
- [x] Add functionality to cancel buttons on forms (remove focus, clear form values and change hidden status)
- [x] !!Move credentials to cred folder and add to git.ignore
- [x] Change db password
- [x] Create smaller function to loop through elements and add values to array
- [x] move update last updated date on modal footer functionality from processFormValues to it's own function
- [x] Add date created to data store
- [x] Sort/ group functions logically
- [x] tr hover color on tables: parchment
- [x] Rename 'Overview' to 'Budgets'
- [x] Fix aria-hidden and blur() close-btn on modal headers
- [x] Adjust styling and colour palette for forms 
- [x] Complete One-off 'add-item' modal
- [x] Add small (576px) styling for layout
- [x] secondary btn hover color
- [x] Create tabs in Budget Settings for Dates and Categories
- [x] Add frequency display option (monthly vs 28d) to budget date columns
- [x] Add archive button functionality on itemised section forms
- [?] Complete element ids in loadBudgetDefaults function
- [x] Review 'dates' functions from gapps script functions used in spreadsheet
