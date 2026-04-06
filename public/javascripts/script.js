function toggleVisibility(el) {
    const clickedElement = el
    const classList = clickedElement.classList

    let className

    let i = 0

    for (i = 0; i < classList.length; i++)  {
        className = classList[i]
        if (className === 'fa-circle-xmark') {
            clickedElement.previousElementSibling.classList.remove('d-none')
            clickedElement.classList.add('d-none')
            

        } else if (className === 'fa-circle') {
            clickedElement.nextElementSibling.classList.remove('d-none')
            clickedElement.classList.add('d-none')
            

        } else {
            continue;
        }
    }

    return console.log(el)
}