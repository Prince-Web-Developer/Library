// this logic handle data

const existingLibrary = JSON.parse(localStorage.getItem("myLibrary"))
let myLibrary = existingLibrary != null ? existingLibrary : []
console.log(myLibrary);

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
    this.img = "images/book.jpg"
}


function addBookToLibrary(book) {
    myLibrary.push(book)
    modifySavedArray()
}


function modifySavedArray() {
    try {
        localStorage.setItem("myLibrary", JSON.stringify(myLibrary))
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
    const stars = data["rating"]
    const readingExp = data["reading-experience"]

    if (title && author && pages && pages != NaN){
        const newBook = new Book(title, author, pages, read, readingExp)
        addBookToLibrary(newBook)
    }
    else{
        displayError("Fill Form Correctly")
    }


})











// these functions change ui

function displayError(message) {
    const errorContainer = document.querySelector(".error")
    errorContainer.innerText = message
    errorContainer.style.height = "100px"
}

function hideError(){
    const errorContainer = document.querySelector(".error")
    errorContainer.style.height = "0px"
}

// just disabled or enable reading experience section on the condition if user has check the read checkbox
document.querySelector("#read").addEventListener("change", () => {
    const fieldSet = document.querySelector("fieldset")
    fieldSet.disabled = !fieldSet.disabled
})