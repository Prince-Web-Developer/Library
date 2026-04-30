const existingLibrary = localStorage.getItem("myLibrary")
const myLibrary = existingLibrary != null ? existingLibrary : []


function Book(title, author, pages, isRead, rating = undefined, readExperience = undefined) {
    if (!new.target) {
        throw Error("new keyword must be used to Initialize book constructor")
    }

    self.id = crypto.randomUUID()
    self.title = title
    self.author = author
    self.pages = pages
    self.isRead = isRead
    self.rating = rating
    self.readExperience = readExperience
    self.img = "images/book.jpg"
}


function addBookToLibrary(book) {
    myLibrary.push(book)
    modifySavedArray()
}


function modifySavedArray() {
    try {
        localStorage.setItem("myLibrary", myLibrary)
    } 
    catch (error) {
        if (error.name === 'QuotaExceededError' || error.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
            displayError("Storage is full. delete some books")
        }
        else{
            displayError("An error occur")
        }
    }
}


function displayError(message){
    const errorContainer = document.querySelector(".error")
    errorContainer.innerText = message
    errorContainer.style.height = "100px"
}








document.querySelector("#read").addEventListener("change",() => {
    const fieldSet = document.querySelector("fieldset")
    fieldSet.disabled = !fieldSet.disabled
})