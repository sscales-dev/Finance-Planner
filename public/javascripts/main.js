// Toggles visibility of an item
// onclick function for the radio buttons in the overview table. 

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

    } else {
      continue;
    }
  }

  return;
}

// onclick function for the date dropdowns in the itemised lists. 
// Toggles visibility of the check icon and sets the item as active.

function toggleDropdownDate(element) {
    const clickedElement = element;
    const checkIcon = clickedElement.querySelector("i");

    clickedElement.classList.toggle("active");
    checkIcon.classList.toggle("d-none");

    return;
}

// Load budget settings form defaults from localStorage.
// These are used to populate the overview page and the settings modal when it is opened.

function loadBudgetSettingsFormDefaults () {
  const budgetString =localStorage.getItem("budget")
  const budgetObject = JSON.parse(budgetString)

  let firstPaydate
  let secondPaydate
  let budgetDuration
  let budgetUpdatedTime

  firstPaydate = budgetObject.paydate1;

  secondPaydate = budgetObject.paydate2;

  budgetDuration = budgetObject.duration;

  budgetUpdatedTime = budgetObject.last_updated;

  // document.getElementById(' ').defaultValue = firstPaydate.date
  // document.getElementById(' ').defaultValue = firstPaydate.frequency

  // document.getElementById(' ').defaultValue = secondPaydate.date
  // document.getElementById(' ').defaultValue = secondPaydate.frequency

  // document.getElementById(' ').defaultValue = budgetDuration

  lastUpdatedTextUpdate("budget-dates", budgetUpdatedTime)

  console.log("Budget settings loaded!", {
    firstPaydate,
    secondPaydate,
    budgetDuration,
    budgetUpdatedTime
  });
}

// Updates budget dates modal to display last_updated
// Updates .modal-footer height to be auto

function lastUpdatedTextUpdate (formName, lastUpdated) {
  const modalFooter = document.getElementById(`${formName}-modal-footer`);
  const updateInfoContainer = document.getElementById(`${formName}-updated-info`);
  const updatedTimeEl = document.getElementById(`${formName}-updated-time`);
  
  updatedTimeEl.innerHTML = lastUpdated;
  modalFooter.style = "height: auto;";
  updateInfoContainer.classList.remove("visually-hidden");

  return
}

/** const toastTrigger = document.getElementById('saveBudgetBtn')
const toastLiveExample = document.getElementById('liveToast')

if (toastTrigger) {
  const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample)
  toastTrigger.addEventListener('click', () => {
    toastBootstrap.show()
  })
}**/

// Loops through elementsArray and push id, values and defaultValues to array

async function elementValuesToArray (elementsArray) {
  const array = []

  let i = 0;

  for (i = 0; i < elementsArray.length; i++) {
      console.log("Pushing details to array", elementsArray[i].id);
      array.push({"id": elementsArray[i].id, "value": elementsArray[i].value, "defaultValue": elementsArray[i].defaultValue});
  };

  if (array.length === elementsArray.length) {
    return array
  }
}

// Pulls inputs, selects and checkboxes from provided form and passes them to elementValuesToArray
// Returns Object of inputs, selects and checkboxes (provided by elementValuesToArray)

async function getFormValues (form) {
    const inputs = form.getElementsByTagName("input");
    const selects = form.getElementsByTagName("select");
    const checkboxes = form.getElementsByTagName("checkboxes");

    const object = {}

    // console.log(inputs, selects, checkboxes);

    // Pulls form elements and element values object for each element in the given arrays

    const inputValues = await elementValuesToArray(inputs)
    const selectValues = await elementValuesToArray(selects)
    const checkboxValues = await elementValuesToArray(checkboxes)

    object.inputs = inputValues
    object.selects = selectValues
    object.checkboxes = checkboxValues

    return object
}

/** Process Form Values
 * 
 * Sends form to getFormValues, adds them to an object and stores them 
 * in localStorage. Depending on the form, it updates the defaultValues 
 * for the form and the last updated text on the forms modal footer.
 * 
 * @param {String} formId 
 * @returns 
 */

async function processFormValues(formId) {
    console.log("Processing form...");

    const form = document.getElementById(formId);

    const formValues = await getFormValues(form)

    switch (formId) {
        case "budgetDatesInputForm":
            // Arrays of objects containing id and value
            let dateValuesArray = formValues.inputs;
            let freqValuesArray = formValues.selects;

            let budget = {}

            let date = Date.now()
            let utcDate = new Date(date).toUTCString()

            if (dateValuesArray.length !== 2 || freqValuesArray.length !== 3) {
              console.error("Error with pulling all values from settings form")

            } else {
              try {
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

                budget.last_updated = utcDate;

                budget.date_created = budget.last_updated;

                // Store stringified budget object in local storage

                localStorage.setItem("budget", JSON.stringify(budget));

                // Update text on budget setting modal form with last_updated date and time

                lastUpdatedTextUpdate("budget-dates", budget.last_updated)

                // Load values into form elements' defaultValues attributes

                return loadBudgetSettingsFormDefaults()

              } catch (err) {
                console.error("Problem pulling values from budget settings form and storing...", err);

              };
            };

            break;
        // Add cases for other forms here.
        default:
            console.log("No processing function defined for this form.");
    }
}

function addEventListeners () {
  // Get modal elements
  const budgetDatesModal = document.getElementById("datesModal");
  const addIncomeModal = document.getElementById("addIncomeModal");
  const addRecurringModal = document.getElementById("addRecurringModal");

  // First input fields for each modal. Used to set focus when the modal is opened.
  const budgetDatesModalFirstInput = document.getElementById("firstPaydate");
  const addIncomeModalFirstInput = document.getElementById("incomeNameInput");
  const addRecurringModalFirstInput = document.getElementById("recurringNameInput");

  // Add event listener to each modal
  // Focuses on the first input field when the modal is opened.
  budgetDatesModal.addEventListener("shown.bs.modal", () => {
    budgetDatesModalFirstInput.focus();
    
  });

  budgetDatesModal.addEventListener('hidden.bs.modal', event => {
    const form = document.getElementById("budgetDatesInputForm")

    form.classList.remove('was-validated')
    form.classList.add('needs-validation')
  })

  addIncomeModal.addEventListener("shown.bs.modal", () => {
    addIncomeModalFirstInput.focus();
  });

  addRecurringModal.addEventListener("shown.bs.modal", () => {
    addRecurringModalFirstInput.focus();

  });
}

function addModalCloseToSaveBtns () {
  const modals = document.querySelectorAll('.modal');

  Array.from(modals).forEach(modal => {
    const saveBtns = document.querySelectorAll('.saveFormBtn')
    const newModal = new bootstrap.Modal(modal, {
      backdrop: 'static'
    })

    Array.from(saveBtns).forEach(btn => {
      btn.addEventListener("click", function () {
        newModal.hide();
      });
    })
  })
}

function addEventListenerToFormSubmitButtons () {
  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', async function (event) {
      if (!form.checkValidity()) {
        event.stopPropagation();
        event.preventDefault();

      }
      
      event.preventDefault();
      form.classList.add('was-validated');

      console.log("Form Validated. Processing form...");

      try {
        await processFormValues(form.id);

        // insert toast display here

        return

      } catch (err) {
        console.error("Error processing form", form.id, err);

      }
    }, false)
  })
}

(() => { // Run on page load
  'use strict'

  console.error("Page loaded. Running onload functions...");

  // Temporarily clear localStorage for testing purposes. Remove this in production.
  // localStorage.clear();

  try {
    loadFormDefaults("budget")

  } catch (error) {
    console.error("No budget settings stored in localStorage:", error);

    // prompt to enter settings
  }

  try {
    addEventListeners()

  } catch (error) {
    console.error("Error adding event listeners", error);
  }

  try {
    addModalCloseToSaveBtns()

  } catch (error) {
    console.error("Error adding event listener to form save buttons", error)
  }

  try {
    addEventListenerToFormSubmitButtons()

  } catch (error) {
    console.error("Error adding event listener to form submit buttons", error)
  }

})()






