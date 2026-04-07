// onclick function for the eye icons in the overview table. Toggles visibility of the amount and the eye icons.

// Example starter JavaScript for disabling form submissions if there are invalid fields

(() => {
  'use strict'

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

// Modal focus function for the settings modal. Focuses on the first input field when the modal is opened.

const settingsModal = document.getElementById("settingsModalStaticBackdrop");
const settingsModalBtn = document.getElementById("settingsModalBtn");

settingsModal.addEventListener("shown.bs.modal", () => {
  settingsModalBtn.focus();
});

function toggleItemVisibility(el) {
  const clickedElement = el;
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
