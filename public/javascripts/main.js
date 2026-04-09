(() => {
  'use strict'

  let firstPaydate
  let secondPaydateInput
  let budgetDuration

  // Load overview dates from localStorage.
  // These are used to populate the overview page and the settings modal when it is opened.
  try {
    firstPaydate = {
      date: localStorage.getItem("paydate1"),
      frequency: localStorage.getItem("frequency1")
    };

    secondPaydateInput = {
        date: localStorage.getItem("paydate2"),
        frequency: localStorage.getItem("frequency2")
    };

    budgetDuration = localStorage.getItem("duration");

  } catch (error) {
    console.error("Error loading overview dates from localStorage:", error);

  }

  // Get modal elements
  const settingsModal = document.getElementById("settingsModal");
  const addIncomeModal = document.getElementById("addIncomeModal");
  const addRecurringModal = document.getElementById("addRecurringModal");

  // First input fields for each modal. Used to set focus when the modal is opened.
  const settingsModalFirstInput = document.getElementById("frequencyChoiceD1");
  const addIncomeModalFirstInput = document.getElementById("incomeNameInput");
  const addRecurringModalFirstInput = document.getElementById("recurringNameInput");

  // Add event listener to each modal
  // Focuses on the first input field when the modal is opened.
  settingsModal.addEventListener("shown.bs.modal", () => {
    settingsModalFirstInput.focus();
  });

  addIncomeModal.addEventListener("shown.bs.modal", () => {
    addIncomeModalFirstInput.focus();
  });

  addRecurringModal.addEventListener("shown.bs.modal", () => {
    addRecurringModalFirstInput.focus();
  });

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})()

// onclick function for the checkbox icons in the overview table. 
// Toggles visibility of the item.
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

function processForm(formId) {
    console.log("Processing form...");

    const form = document.getElementById(formId);

    switch (formId) {
        case "paydateInputForm":
            const inputs = form.getElementsByTagName("input");
            const selects = form.getElementsByTagName("select");

            let dateValues = [];
            let freqValues = [];
            let duration;

            console.log(inputs, selects);

            let i = 0;

            for (i = 0; i < inputs.length; i++) {
                console.log(inputs[i].id, inputs[i].value);
                dateValues.push(inputs[i].value);
            }

            let j = 0;

            for (j = 0; j < 2; j++) {
                console.log(selects[j].id, selects[j].value);
                freqValues.push(selects[j].value);
            }

            duration = freqValues[2]

            localStorage.setItem("paydate1", dateValues[0]);
            localStorage.setItem("frequency1", freqValues[0]);

            localStorage.setItem("paydate2", dateValues[1]);
            localStorage.setItem("frequency2", freqValues[1]);
            
            localStorage.setItem("duration", duration);

            // Add error checking and validation here.

            break;
        // Add cases for other forms here.
        default:
            console.log("No processing function defined for this form.");
    }

    return

}

onload = function() {
    console.log("Page loaded. Running onload functions...");
    // Add any functions you want to run on page load here.

    const paydateInputForm = document.getElementById("paydateInputForm");

    paydateInputForm.addEventListener("submit", (event) => {
        event.preventDefault();
        console.log("Paydate form submitted.");
        // Add form processing functions here.
    });
    
    //firstPaydateInput.defaultValue = '2026-04-13';
    //secondPaydateInput.defaultValue = '2026-04-07';

}




