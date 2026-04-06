// onclick function for the eye icons in the overview table. Toggles visibility of the amount and the eye icons.

function toggleVisibility(el) {
  const clickedElement = el;
  const classList = clickedElement.classList;

  let className;

  let i = 0;

  for (i = 0; i < classList.length; i++) {
    className = classList[i];
    if (className === "fa-circle-xmark") {
      clickedElement.previousElementSibling.classList.remove("d-none");
      clickedElement.classList.add("d-none");
    } else if (className === "fa-circle") {
      clickedElement.nextElementSibling.classList.remove("d-none");
      clickedElement.classList.add("d-none");
    } else {
      continue;
    }
  }

  return;
}

// Modal focus function for the settings modal. Focuses on the first input field when the modal is opened.

const myModal = document.getElementById("staticBackdrop");
const myInput = document.getElementById("settings-modal-button");

myModal.addEventListener("shown.bs.modal", () => {
  myInput.focus();
});
