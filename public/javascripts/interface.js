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