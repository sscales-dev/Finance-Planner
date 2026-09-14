//------------------------------------------------------------------------------ Toggle Views (onclicks)

/** Toggle Item Visibility
 * 
 * onclick function for the radio buttons/ icons in the itemised transaction lists.
 * Toggles visibility of an item/ transaction in list.
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
 */ 

function toggleDropdownDate(element) {
    const clickedElement = element;
    const checkIcon = clickedElement.querySelector("i");

    clickedElement.classList.toggle("active");
    checkIcon.classList.toggle("d-none");

    return;
}

//------------------------------------------------------------------------------ Buttons

function unfocusActiveButtons() {
    const activeButton = document.activeElement;
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
 */

function lastUpdatedTextUpdate (formName, lastUpdated) {
  const modalFooter = document.getElementById(`${formName}-modal-footer`);
  const updateInfoContainer = document.getElementById(`${formName}-updated-info`);
  const updatedTimeEl = document.getElementById(`${formName}-updated-time`);
  
  updatedTimeEl.innerHTML = lastUpdated;
  modalFooter.style = "height: auto;";
  updateInfoContainer.classList.remove("visually-hidden");

  return
}

/** Load Budget Settings Form Defaults
 * 
 * Loads the budget settings form default values from localStorage to the form elements.
 * Toggles the checkmark against the selected date(s)
 * 
 */

function loadBudgetSettingsFormDefaults () {
  const budgetString =localStorage.getItem("budget")
  const budgetObject = JSON.parse(budgetString)

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

  lastUpdatedTextUpdate("budget-dates", budgetUpdatedTime)

  console.log("Budget settings loaded!" /*, {
    firstPaydate,
    secondPaydate,
    budgetDuration,
    budgetUpdatedTime
  }*/);
}

/** Toast Usage Example
 * 
 * 

const toastTrigger = document.getElementById('saveBudgetBtn')
const toastLiveExample = document.getElementById('liveToast')

if (toastTrigger) {
  const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample)
  toastTrigger.addEventListener('click', () => {
    toastBootstrap.show()
  })
}
  
**/

//------------------------------------------------------------------------------ Form Processing

/** Form Element Values to Array
 * 
 * Loops through an array of elements and pushes id, values and defaultValues to a new array
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

async function getFormElementsValuesObject (form) {
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
 * Sends form to getFormElementsValuesObject, adds them to an object and stores them 
 * in localStorage. Depending on the form, it updates the defaultValues 
 * for the form and the last updated text on the forms modal footer.
 * 
 * @param {String} formId
 * 
 * @task insert function to display error and prompt to retry when form processing fails
 * 
 */

async function processFormValues(formId) {
    console.log("Processing form...");

    const form = document.getElementById(formId);

    const formValues = await getFormElementsValuesObject(form)

    switch (formId) {
        case "budgetDatesInputForm":
            const saveBtn = document.getElementById('saveBudgetBtn')

            // Arrays of objects containing id and value
            let dateValuesArray = formValues.inputs;
            let freqValuesArray = formValues.selects;

            let budget = {}

            let date = Date.now()
            let utcDate = new Date(date).toUTCString()
            let dateString = new Date(date).toDateString()
            let timeString = new Date(date).toLocaleTimeString()

            const timeObject = {
              utc: utcDate,
              localDate: dateString,
              localTime: timeString
            }

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

                budget.last_updated = timeObject;

                budget.date_created = timeObject;

                // Store stringified budget object in local storage

                localStorage.setItem("budget", JSON.stringify(budget));

                // Update text on budget setting modal form with last_updated date and time

                lastUpdatedTextUpdate("budget-dates", budget.last_updated)

                // Load values into form elements' defaultValues attributes

                loadBudgetSettingsFormDefaults()

                return saveBtn.blur()

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

/** Add Event Listener to Forms
 * 
 * Finds all forms that need validation and adds a 'submit' event listener.
 * Handles event by stopping submit if inputs aren't valid.
 * If inputs are valid, it marks the form as validated (for formatting purposes) and
 * passes the form ID to processFormValues
 * 
 * @task insert function to display toast when form is successfully processed
 * 
 */

function addEventListenerToForms () {
  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    const modal = form.parentElement.parentElement.parentElement.parentElement

    const newModal = new bootstrap.Modal(modal, {
      backdrop: 'static', keyboard: false
    })

    form.addEventListener('submit', async function (event) {
      if (!form.checkValidity()) {
        event.stopPropagation();
        event.preventDefault();

      }
      event.preventDefault();

      if (form.id === "budgetDatesInputForm") {
        form.classList.add('was-validated');
        newModal.hide();
        console.log("Form Validated. Processing form...");
        return;
      }

      form.reset()
      newModal.hide();
      
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

//------------------------------------------------------------------------------ Onload Function

(() => {
  'use strict'

  console.log("Page loaded. Running onload functions...");

  // Temporarily clear localStorage for testing purposes. Remove this in production.
  // localStorage.clear();

  try {
    loadBudgetSettingsFormDefaults("budget")

  } catch (error) {
    console.error("No budget settings stored in localStorage:", error);

  }

  try {
    addEventListenersToModals()

  } catch (error) {
    console.error("Error adding event listeners to modals", error);
  }

  try {
    //addModalCloseFunctionToSaveBtns()

  } catch (error) {
    console.error("Error adding event listener to form save buttons", error)
  }

  try {
    addEventListenerToForms()

  } catch (error) {
    console.error("Error adding event listener to form submit buttons", error)
  }

})()






