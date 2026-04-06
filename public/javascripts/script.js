function toggleVisibility(el) {
    const clickedElement = el
    const classList = clickedElement.classList

    let className

    let i = 0

    while (i < classList.length) {
        className = classList[i]
        if (className === 'fa-circle-xmark') {
            clickedElement.classList.add('d-none')
            //clickedElement.previousSibling.classList.remove('d-none')

        } else if (className === 'fa-circle') {
            clickedElement.classList.add('d-none')
            //clickedElement.nextSibling.classList.remove('d-none')

        } else {
            continue;
        }
        i++
    }

    return console.log(el)
}