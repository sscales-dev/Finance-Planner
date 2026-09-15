# Tasks

## Layout and styling

### Next



### Later

- [ ] Tidy HTML classes 
  - [ ] ids camelcase
  - [ ] classes kebab case
  - [ ] classes in unified order

- [ ] Refactor CSS

- [ ] Create tabs in Budget Settings for Dates and Categories
- [ ] Add frequency display option (monthly vs 28d) to budget date columns
- [ ] Add 'edit' forms on itemised sections
- [ ] Add archive button functionality on itemised section forms
- [ ] recurring payment add form:
    > renewal date and month
    > if category === household bills
    > if category === subscriptions
        > renewal date +/ month should be required
- [ ] Add 'loading' displays
- [ ] Add login option/ modal etc
- [ ] Add Nested Tables in Overview section with categories
- [ ] within forms - select option:hover color

## Modals + Forms

- [ ] Rename all form element ids, classes and attributes to be specific and consistent
- [ ] Ensure all forms have all required attributes
- [ ] Ensure all form aspects have suitable names and ids and descriptions etc
- [ ] Add required to needed inputs

- [ ] Add Toast functionality + style/ position toast elements
- [ ] Complete element ids in loadBudgetDefaults function
- [ ] Move updateLastUpdatedText in processFormValues to underneath switch?
- [ ] Add functionality for each new form to processFormValues

- [ ] Move localStorage to sessionStorage once database module working

### Javascript

- [ ] Move 'unfocusActiveButtons() onclick to javascript main.js
- [ ] Tidy existing functions
  - [ ] Comment properly throughout functions
  - [ ] Ensure error checking, end-of-statement semi-colons, console.logging etc
- [ ] Add prompt to enter budget settings if not loaded from localStorage
- [ ] Add other background parameters for items when storing
  - [ ] Add position (dates) and item sort (transactions)
- [ ] Review 'dates' functions from gapps script functions used in spreadsheet
- [ ] Add functionality to calculate paydates, store and output to 'budgets'
  - [ ] Also update year label at top left of budgets table

- [ ] Create 'edit item' modals and forms

## Interface

- [ ] Finish Bootstrap + Javascript interface controls

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

- [ ] Login/ security
- [ ] Serve on local network
- [ ] Sorting of itemised lists

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
