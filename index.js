// this logic handle data

const existingLibrary = JSON.parse(localStorage.getItem("myLibrary"))
let myLibrary = existingLibrary != null ? existingLibrary : []


function Book(title, author, pages, isRead, rating, readExperience) {
    if (!new.target) {
        throw Error("new keyword must be used to Initialize book constructor")
    }

    this.id = crypto.randomUUID()
    this.title = title
    this.author = author
    this.pages = pages
    this.isRead = isRead
    this.rating = rating
    this.readExperience = readExperience
}


function addBookToLibrary(book) {
    myLibrary.push(book)
    modifySavedArray()
}


function modifySavedArray() {
    try {
        localStorage.setItem("myLibrary", JSON.stringify(myLibrary))
        changeDisplay("flex", "none")
        displayBooks()
    }
    catch (error) {
        if (error.name === 'QuotaExceededError' || error.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
            displayError("Storage is full. delete some books")
        }
        else {
            displayError("An error occur")
        }
    }
}

document.querySelector("#addBook").addEventListener("submit", (e) => {
    hideError()
    e.preventDefault()
    const formData = new FormData(e.target);


    const data = Object.fromEntries(formData);

    const title = data["title"]
    const author = data["author"]
    const pages = +data["pages"]
    const read = data["read"] == "on" ? true : false
    let stars = undefined
    let readingExp = undefined
    if (read) {
        stars = data["rating"]
        readingExp = data["reading-experience"]
    }

    const isWeNeedToEditBook = data["exisitingValue"]


    if (title && author && pages && pages != NaN) {

        if (isWeNeedToEditBook || isWeNeedToEditBook != "") {
            const index = FindElementWithId(isWeNeedToEditBook)
            myLibrary[index].title = title
            myLibrary[index].author = author
            myLibrary[index].pages = pages
            myLibrary[index].isRead = read
            myLibrary[index].rating = stars
            myLibrary[index].readExperience = readingExp
            modifySavedArray()
        }
        else {
            const newBook = new Book(title, author, pages, read, stars, readingExp)
            addBookToLibrary(newBook)
        }
        e.target.querySelector("fieldSet").disabled = true
        e.target.reset()
    }
    else {
        displayError("Fill Form Correctly")
    }
})

function FindElementWithId(id) {
    return myLibrary.findIndex(item => item.id == id)
}












// these functions change ui

function displayError(message) {
    const errorContainer = document.querySelector(".error")
    errorContainer.innerText = message
    errorContainer.style.height = "100px"
}

function hideError() {
    const errorContainer = document.querySelector(".error")
    errorContainer.style.height = "0px"
}

// just disabled or enable reading experience section on the condition if user has check the read checkbox
document.querySelector("#read").addEventListener("change", () => {
    const fieldSet = document.querySelector("fieldset")
    fieldSet.disabled = !fieldSet.disabled
})


function changeDisplay(libraryDisplay, formDisplay) {
    const library = document.querySelector(".library")
    const form = document.querySelector(".form")


    library.style.display = libraryDisplay
    form.style.display = formDisplay
}


function makeFormHavePreviousValue(e) {
    const bookId = e.target.id
    const element = myLibrary[FindElementWithId(bookId)]
    if (element) {
        fillForm(element)
        changeDisplay("none", "flex")
    }
    else {
        displayError("Item Not Found")
    }

}

function fillForm(ele) {
    const form = document.querySelector("form")

    const titleInputField = form.querySelector("#title")
    titleInputField.value = ele.title

    const authorInputField = form.querySelector("#author")
    authorInputField.value = ele.author

    const pagesInputField = form.querySelector("#pages")
    pagesInputField.value = ele.pages

    const isRead = ele.isRead
    const readCheckBox = form.querySelector("#read")
    readCheckBox.checked = isRead


    const fieldSet = form.querySelector("fieldset")
    fieldSet.disabled = !isRead

    const rateInputField = form.querySelector("#rate")
    const reviewInputField = form.querySelector("#desc")

    const rating = ele.rating
    if (rating) {
        rateInputField.value = rating
    }

    const review = ele.readExperience
    if (review) {
        reviewInputField.value = review
    }

    const bookId = form.querySelector("#exisitingValue")
    bookId.value = ele.id
}

function displayBooks() {
    const main = document.querySelector("main")
    if (myLibrary.length == 0) {
        const div = document.createElement("div")
        div.innerText = "No Books Added"
        div.classList.add("centerText")
        main.appendChild(div)
        return null
    }
    const template = cleanMain()
    main.appendChild(template)
    myLibrary.forEach((e, index) => {
        const templateClone = template.cloneNode(true)
        templateClone.style.display = "flex"

        const editButton = templateClone.querySelector(".editbtn")
        editButton.id = e.id

        const readIcon = templateClone.querySelector(".icon")
        const titleContainer = templateClone.firstElementChild
        const starContainer = templateClone.querySelector(".idk")
        const pageContainer = templateClone.querySelector(".pagecount")
        const readingExperienceContainer = templateClone.querySelector(".reading-experience")
        const authorContainer = templateClone.querySelector(".by")


        titleContainer.innerText = e.title
        pageContainer.innerText = `${e.pages} pages`
        authorContainer.innerText = `by ${e.author}`

        if (e.rating) {
            starContainer.textContent = e.rating
        }
        else {
            starContainer.innerText = 'N/A'
        }

        if (e.readExperience) {
            readingExperienceContainer.innerText = e.readExperience
        }
        else if (!e.isRead) {
            readingExperienceContainer.innerText = "Not read yet"
        }
        else {
            readingExperienceContainer.innerText = "N/A"
            readingExperienceContainer.classList.add("grey")
        }

        if (e.isRead) {
            readIcon.classList.add("icon-tick")
        }
        else {
            readIcon.classList.add("icon-cross")
        }
        main.appendChild(templateClone)
    });
}

function cleanMain() {
    const main = document.querySelector("main")
    const template = main.firstElementChild
    main.textContent = ""
    return template
}


document.querySelector("#add-button-on-main").addEventListener("click", () => {
    changeDisplay("none", "flex")
})

displayBooks()