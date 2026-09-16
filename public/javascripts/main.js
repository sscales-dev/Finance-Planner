import { calculatePaydays, addPaydayLists, buildPaydaysArray } from './dates.js'

//------------------------------------------------------------------------------ Toggle Views (onclicks)

/** Toggle Item Visibility
 * 
 * onclick function for the radio buttons/ icons in the itemised transaction lists.
 * Toggles visibility of an item/ transaction in list.
 * 
 * @param {Element} element
 * 
 */ 

function toggleItemVisibility(element) {
  const clickedElement = element;
  const classList = clickedElement.classList;

  let className;

  let i = 0;

  for (i = 0; i < classList.length; i++) {
    className = classList[i];
    if (className === "fa-circle-xmark") {
        clickedElement.classList.add("d-none");
        clickedElement.previousElementSibling.classList.remove("d-none");

        clickedElement.parentElement.classList.remove('unchecked');
        clickedElement.parentElement.classList.add('checked');

    } else if (className === "fa-circle") {
      clickedElement.classList.add("d-none");
      clickedElement.nextElementSibling.classList.remove("d-none");
 
      clickedElement.parentElement.classList.remove('checked');
      clickedElement.parentElement.classList.add('unchecked');

    } else if (className === "fa-square-plus") {
      clickedElement.classList.add("d-none");
      clickedElement.nextElementSibling.classList.remove("d-none");
 
      clickedElement.parentElement.classList.remove('closed');
      clickedElement.parentElement.classList.add('open');

    } else if (className === "fa-square-minus") {
      clickedElement.classList.add("d-none");
      clickedElement.previousElementSibling.classList.remove("d-none");
 
      clickedElement.parentElement.classList.remove('open');
      clickedElement.parentElement.classList.add('closed');

    } else {
      continue;
    }
  }

  return;
}

/** Toggle Dropdown Date
 * 
 * onclick function for the date dropdowns in the itemised transaction lists.
 * Toggles the checkmark against the selected date(s)
 * 
 * @param {Element} element
 * 
 */ 

function toggleDropdownDate(element) {
    const clickedElement = element;
    const checkIcon = clickedElement.querySelector("i");

    clickedElement.classList.toggle("active");
    checkIcon.classList.toggle("d-none");

    return;
}

/** Display Toast with message
 * 
 * @param {String} message
 * 
**/
function displayToast (message) {
  const toastLive = document.getElementById('liveToast');
  const toastTriggerTitle = document.getElementById('toastTriggerTitle');
  const toastTimeStamp = document.getElementById('toastTimeStamp');
  const toastBody = document.getElementById('toastBody');

  switch (message) {
    case 'form-validated':
      toastTriggerTitle.innerHTML = "Form Submitted";
      toastTimeStamp.innerHTML = "Just now";
      toastBody.innerHTML = "Your form has been successfully submitted. Processing form...";
      break;
    case 'form-processed':
      toastTriggerTitle.innerHTML = "Form Processed";
      toastTimeStamp.innerHTML = "Just now";
      toastBody.innerHTML = "Your form has been successfully processed.";
      break;
  }

  const toast = bootstrap.Toast.getOrCreateInstance(toastLive);

  return toast.show();

}

//------------------------------------------------------------------------------ Buttons

/** Unfocus Active Buttons
 * 
 * Blurs the active button to prevent it from being focused when the modal is closed.
 * 
 * @param {Element} btn
 * 
 */
function unfocusActiveButtons(btn) {
    const activeButton = btn;
    if (activeButton) {
        activeButton.blur();
    }
}

//------------------------------------------------------------------------------ Set Form Values

/** Last Updated Text Update
 * 
 * Updates budget settings modal footer to display last_updated.
 * Updates .modal-footer height to be auto.
 * 
 * @param {String} formName
 * @param {Object} lastUpdated
 * 
 */

function lastUpdatedTextUpdate (formName, lastUpdated) {
  const modalFooter = document.getElementById(`${formName}ModalFooter`);
  const updateInfoContainer = document.getElementById(`${formName}UpdatedInfo`);
  const updatedTimeEl = document.getElementById(`${formName}UpdatedTime`);

  updatedTimeEl.innerHTML = lastUpdated.localDate + " " + lastUpdated.localTime;
  modalFooter.style = "height: auto;";
  updateInfoContainer.classList.remove("visually-hidden");

  return;
}

/** Load Budget Settings Form Defaults
 * 
 * Loads the budget settings form default values from localStorage to the form elements.
 * Toggles the checkmark against the selected date(s)
 * 
 */

function loadBudgetSettingsToFormDefaults () {
  const budgetString = localStorage.getItem("budget")
  const budgetObject = JSON.parse(budgetString)

  // console.log(budgetObject);

  let firstPaydate
  let secondPaydate
  let budgetDuration
  let budgetUpdatedTimeObject
  let budgetUpdatedTime

  firstPaydate = budgetObject.paydate1;

  secondPaydate = budgetObject.paydate2;

  budgetDuration = budgetObject.duration;

  budgetUpdatedTimeObject = budgetObject.last_updated;

  budgetUpdatedTime = `${budgetUpdatedTimeObject.localDate} ${budgetUpdatedTimeObject.localTime}`

  document.getElementById('firstPaydate').defaultValue = firstPaydate.date
  document.getElementById('frequencyChoiceD1').defaultValue = firstPaydate.frequency

  document.getElementById('secondPaydate').defaultValue = secondPaydate.date
  document.getElementById('frequencyChoiceD2').defaultValue = secondPaydate.frequency

  document.getElementById('budgetDuration').defaultValue = budgetDuration

  lastUpdatedTextUpdate("budgetDates", budgetUpdatedTimeObject);

  console.log("Budget settings loaded!" /*, {
    firstPaydate,
    secondPaydate,
    budgetDuration,
    budgetUpdatedTime
  }*/);
}

//------------------------------------------------------------------------------ Date Functions



async function getPaydaysArray () { 
  const budgetString = localStorage.getItem("budget")
  const budgetObject = JSON.parse(budgetString)

  const paydate1 = budgetObject.paydate1.date
  const frequency1 = budgetObject.paydate1.frequency

  const paydate2 = budgetObject.paydate2.date
  const frequency2 = budgetObject.paydate2.frequency

  const dates1 = await calculatePaydays(paydate1, frequency1)
  const dates2 = await calculatePaydays(paydate2, frequency2)

  const orderedDatesArray = await buildPaydaysArray(dates1, dates2)

  return orderedDatesArray

}

//------------------------------------------------------------------------------ Update Interface

/** Add New Paydate Elements
 * 
 * Outputs new elements to the budget table according to the difference between the initial 
 * column count and the paydays array length
 * 
 * @param {Array} paydaysArray
 * 
 * @task add functionality to remove columns
 * @task add if to loops to check they are complete
 * 
 */

async function addNewPaydateElements (paydaysArray) {
  // console.log(paydaysArray)

  const paydateRow = document.getElementById('paydateRow')
  const paydateTableHeaders = paydateRow.children

  const rowNames = ['availableBalance', 'income', 'overheads', 'essentials', 'discretionary', 'loansAndDebt']

  // console.log(paydateTableHeaders.length - 1)

  const paydateSpans = document.getElementsByClassName('paydate')
  const frequencySpans = document.getElementsByClassName('paydate-frequency')

  if (paydateSpans.length !== frequencySpans.length) {
    return console.error('Error with table header dates and frequency cells: number of cells not equal')

  }

  if (paydateTableHeaders.length < paydaysArray.length) {
    const difference = paydaysArray.length - (paydateTableHeaders.length - 1)
    const numberOfHeaders = paydateTableHeaders.length
    
    //console.log(paydaysArray.length, paydateTableHeaders.length - 1)
    console.log(`Adding ${difference} columns to budget table`)

    // Loop the difference between paydaysArray length and paydateTableHeaders length (-1)
    // Create th and span elements and append the spans to as children to the th
    let i = 0;

    for (i = 0; i < difference; i++) {
      let th = document.createElement('th')
      let span1 = document.createElement('span')
      let span2 = document.createElement('span')
      let number = (numberOfHeaders + i)

      let thEl

      th.scope = 'col'
      th.classList.add('d-inline-flex')
      th.classList.add('flex-column')
      th.classList.add('align-items-center')
      th.classList.add('justify-content-center')
      th.classList.add('budget-col')
      th.id = `payDate${number}`

      paydateRow.appendChild(th)
      thEl = document.getElementById(`payDate${number}`)

      span1.classList.add('paydate')
      span1.id= `date${number}`

      span2.classList.add('paydate-frequency')

      thEl.appendChild(span1)
      thEl.appendChild(span2)

      //console.log(thEl)

    }

    // Loop through the length of the row names and create the rowId from the names combined with the index (no deduction needed
    // as the budgetYear is the first index (0)
    // For each row, loop through the difference and create td elements, adding id and innerHTML at the same time. 
    // Append the tds to the table row
    let j = 0;

    for (j = 0; j < rowNames.length; j++) {
      let rowId = `${rowNames[j]}Row`
      let tr = document.getElementById(rowId)

      let x = 0;

      for (x = 0; x < difference; x++) {
        let td = document.createElement('td')
        let number = (numberOfHeaders + x)

        td.classList.add('budget-col')
        td.id = rowNames[j] + number
        td.innerHTML = '£0.00'

        tr.appendChild(td)
      }

      if (tr.children.length === numberOfHeaders + difference) {
        //console.log(tr)
      }
    }

  } else if (paydateTableHeaders.length > paydaysArray.length) {
    return console.log('Add function to remove columns from table');

  }
}

/** Set Budget Dates and Frequencies
 * 
 * Outputs dates and frequencies to paydate and paydate frequency elements in budget table
 * 
 */

async function setBudgetDatesAndFrequencies () {
  // Get budget settings and parse to create paydays array
  const budgetSettingsString = localStorage.getItem('budget')
  const budgetSettingsObject = JSON.parse(budgetSettingsString)
  const paydaysArray = budgetSettingsObject.dates_array
  
  // get paydates and paydate frequency elements
  const paydateElements = document.getElementsByClassName('paydate')
  const frequencyElements = document.getElementsByClassName('paydate-frequency')

  let date
  let freq

  try {
    await addNewPaydateElements(paydaysArray);

  } catch (err) {
    console.error("Unable to build new paydate elements in table", err);

  }

  // Loop through paydays array and add dates and frequencies to innerHTML
  let i = 0;

  for (i = 0; i < paydaysArray.length; i++) {
    date = paydaysArray[i][0]
    freq = paydaysArray[i][1]

    paydateElements[i].innerHTML = date
    frequencyElements[i].innerHTML = freq

    if (i === paydaysArray.length - 1) {
      return;

    }
  }
}

//------------------------------------------------------------------------------ Form Processing

/** Form Element Values to Array
 * 
 * Loops through an array of elements and pushes id, values and defaultValues to a new array
 * 
 * @param {Array} elementsArray
 * 
 */

async function formElementValuesToArray (elementsArray) {
  const array = []

  let i = 0;

  for (i = 0; i < elementsArray.length; i++) {
      //console.log("Pushing details to array", elementsArray[i].id);
      array.push({"id": elementsArray[i].id, "value": elementsArray[i].value, "defaultValue": elementsArray[i].defaultValue});
  };

  if (array.length === elementsArray.length) {
    return array
  }
}

/** Get Form Elements Values Object
 * 
 * Pulls input, select and checkbox elements from provided form and passes them to formElementValuesToArray
 * Returns Object containing inputs, selects and checkboxes arrays (provided by formElementValuesToArray)
 * 
 */

async function getFormInputValuesObject (form) {
    const inputs = form.getElementsByTagName("input");
    const selects = form.getElementsByTagName("select");
    const checkboxes = form.getElementsByTagName("checkboxes");

    const object = {}

    // console.log(inputs, selects, checkboxes);

    // Pulls form elements and element values object for each element in the given arrays

    const inputValues = await formElementValuesToArray(inputs)
    const selectValues = await formElementValuesToArray(selects)
    const checkboxValues = await formElementValuesToArray(checkboxes)

    object.inputs = inputValues
    object.selects = selectValues
    object.checkboxes = checkboxValues

    return object
}

/** Process Form Values
 * 
 * Sends form to getFormInputValuesObject, adds them to an object and stores them 
 * in localStorage. Depending on the form, it updates the defaultValues 
 * for the form and the last updated text on the forms modal footer.
 * 
 * @param {String} formId
 * 
 * @task insert function to display error and prompt to retry when form processing fails
 * @task use class from classes.js to construct object
*  @task move timestamps to further down when storing in localStorage
 * 
 */

async function processFormValues(formId) {
    console.log("Processing form...");

    const form = document.getElementById(formId);

    const formValues = await getFormInputValuesObject(form)

    switch (formId) {
        case "budgetDatesInputForm":
          // Arrays of objects containing id and value
          let dateValuesArray = formValues.inputs;
          let freqValuesArray = formValues.selects;

          let budget = {}

          let date = Date.now()
          let utcDate = new Date(date).toUTCString()
          let dateString = new Date(date).toDateString()
          let timeString = new Date(date).toLocaleTimeString()

          let datesArray

          const timeObject = {
            utc: utcDate,
            localDate: dateString,
            localTime: timeString
          }

          // Add array values and date_created to budget object

          budget.paydate1 = {
            date: dateValuesArray[0].value,
            frequency: freqValuesArray[0].value
          };

          budget.paydate2 = {
            date: dateValuesArray[1].value,
            frequency: freqValuesArray[1].value
          };

          budget.duration = freqValuesArray[2].value;

          budget.last_updated = timeObject;

          budget.date_created = timeObject;

          try {
            datesArray = await getPaydaysArray()

          } catch (err) {
            console.error("Problen compiling dates array", err);

          }
          
          budget.dates_array = datesArray

          if (dateValuesArray.length !== 2 || freqValuesArray.length !== 3) {
            console.error("Error with pulling all values from settings form")

          }

          try {
            // Store stringified budget object in local storage
            localStorage.setItem("budget", JSON.stringify(budget));

          } catch (err) {
            console.error("Problem storaing local values...", err);

          };

          try {
            // Update text on budget setting modal form with last_updated date and time
            lastUpdatedTextUpdate("budgetDates", budget.last_updated);

          } catch (err) {
            console.error("Problem updating last updated text on budget settings modal...", err);

          }

          try {
            // Load values into form elements' defaultValues attributes
            loadBudgetSettingsToFormDefaults()

          } catch (err) {
            console.error("Problem loading values into form elements' defaultValues attributes...", err);

          }

          try {
            // Update dates and frequencies on budget table
            await setBudgetDatesAndFrequencies()

          } catch (err) {
            console.error();

          }

          break;
        // Add cases for other forms here.
        default:
            console.log("No processing function defined for this form.");
    }
}

//------------------------------------------------------------------------------ Add Event Listeners

/** Add Event Listeners to Modals
 * 
 * Finds all forms that need validation and adds a 'submit' event listener.
 * Handles event by stopping submit if inputs aren't valid.
 * If inputs are valid, it marks the form as validated (for formatting purposes) and
 * passes the form ID to processFormValues
 * 
 */

function addEventListenersToModals () {
  // Get modal elements
  const budgetSettingsModal = document.getElementById("budgetSettingsModal");
  const addIncomeModal = document.getElementById("addIncomeModal");
  const addRecurringModal = document.getElementById("addRecurringModal");
  const addOneoffModal = document.getElementById("addOneoffModal");

  // Add event listeners to each modal
    // Always focus first input on shown and blur button on hidden

  // shown.bs.modal: Focuses on the first input field when the modal is opened.
  // hidden.bs.modal: Removes was-validated and adds needs validation on close.

  // Budget Settings Modal
  budgetSettingsModal.addEventListener("shown.bs.modal", () => {
    const budgetSettingsModalFirstInput = document.getElementById("firstPaydate");
    
    budgetSettingsModalFirstInput.focus();
    
  });

  budgetSettingsModal.addEventListener('hidden.bs.modal', async event => {
    // Get form, save button and create new modal instance
    const form = document.getElementById('budgetDatesInputForm')
    const saveBtn = document.getElementById('saveBudgetDatesBtn')
    const modal = new bootstrap.Modal(budgetSettingsModal)

    // If form is not valid, stop propagation and prevent default
    if (!form.checkValidity()) {
        event.stopPropagation();
        event.preventDefault();

        return;

      }
      event.preventDefault();

      // Add validated styling and display loading button (not seen unless processing is slow)
      form.classList.add('was-validated');
      
      saveBtn.innerHTML = `<div class="spinner-border spinner-border-sm" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>`;
      saveBtn.style = "background-color: var(--success-green); border-color: var(--success-green); color: #fff;";
      
      console.log("Form Validated. Processing form...");


      try {
        await processFormValues(form.id);

        form.classList.remove('was-validated')
        form.classList.add('needs-validation')

        unfocusActiveButtons(saveBtn)

        return modal.hide()

      } catch (err) {
        console.error("Error processing form", form.id, err);

      }
  })

  // Add Income Modal
  addIncomeModal.addEventListener("shown.bs.modal", () => {
    const addIncomeModalFirstInput = document.getElementById("incomeNameInput");

    addIncomeModalFirstInput.focus();

  });

  addIncomeModal.addEventListener('hidden.bs.modal', event => {
    const form = document.getElementById("addIncomeForm")

    form.classList.remove('was-validated')
    form.classList.add('needs-validation')

  })

  // Add Recurring Modal
  addRecurringModal.addEventListener("shown.bs.modal", () => {
    const addRecurringModalFirstInput = document.getElementById("recurringNameInput");

    addRecurringModalFirstInput.focus();

  });

  addRecurringModal.addEventListener('hidden.bs.modal', event => {
    const form = document.getElementById("addRecurringForm")

    form.classList.remove('was-validated')
    form.classList.add('needs-validation')

  })

  // Add Oneoff Modal
   addOneoffModal.addEventListener("shown.bs.modal", () => {
    const addOneoffModalFirstInput = document.getElementById("oneoffNameInput");

    addOneoffModalFirstInput.focus();

  });

  addOneoffModal.addEventListener('hidden.bs.modal', event => {
    const form = document.getElementById("addOneoffForm")

    form.classList.remove('was-validated')
    form.classList.add('needs-validation')

  })

  return;

}

//------------------------------------------------------------------------------ Onload Function

(() => {
  'use strict'

  console.log("Page loaded. Running onload functions...");

  // Add Event Listeners to Modals

  try {
    addEventListenersToModals()

  } catch (err) {
    console.error("Error adding event listeners to modals", err);
  }

  // Temporarily clear localStorage for testing purposes. Remove this in production.
  // localStorage.clear();

  // Load Budget Settings

  try {
    // Add 'if' to check for budget settings true/ false and prompt to configure if not present
    loadBudgetSettingsToFormDefaults("budget")

  } catch (err) {
    throw Error("No budget settings stored in localStorage:", err);
    // throw modal to prompt user to enter budget settings
  }

  // Load Budget Dates and Frequencies to Budget Table and Dropdown lists

  try {
    setBudgetDatesAndFrequencies()

  } catch (err) {
    console.error(err);
    
  }
})()






