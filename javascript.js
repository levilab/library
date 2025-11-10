// 
const body = document.querySelector("body")
const header = document.createElement("div")
header.classList.add("header")
const mainContent = document.createElement("div");
mainContent.classList.add("main-content")


body.append(header)
body.append(mainContent)

// header 
const libraryName = document.createElement("h2");
libraryName.textContent = "Levi's Reading List"
header.append(libraryName)

// "Add Book" button
const dialog = document.querySelector("dialog")
header.append(dialog)


const headerButton = document.createElement("div")
headerButton.classList.add("headerButton")
header.append(headerButton)

const addButton = document.createElement  ("button")
addButton.textContent = "Add Book"
addButton.setAttribute("id","addButton")
headerButton.append(addButton)

// "Delete Book" button

const removeButton = document.createElement("button")
removeButton.textContent = "Delete Book"
removeButton.setAttribute("id","removeButton")
headerButton.append(removeButton)


let myLibrary = []; // original library

// at the first time open, the website check if any data in the current storage
let storedBooks = localStorage.getItem("myLibrary");
if (storedBooks) {
  myLibrary = JSON.parse(storedBooks)
} else {
  myLibrary = [
    new Book(crypto.randomUUID(),"The Law Of Human Nature", "Robert Greene", 624,"yes"),
    new Book(crypto.randomUUID(), "Deep Work", "Cal Newport",296, "no"),
    new Book(crypto.randomUUID(),"Designing Data-Intensive Applications", "Martin Kleppmann",562,"no"),
    new Book(crypto.randomUUID(),"Pour Your Heart Into It: How Starbucks Built a Company One Cup at a Time","Howard Schultz",351,"yes")
  ]
  localStorage.setItem("myLibrary", JSON.stringify(myLibrary))
  console.log("default books loaded.")
}

if (myLibrary.length == 0) {localStorage.clear()}


function Book(id, title, author, pages, read) {
  // the constructor...
  this.id = id,
  this.title = title,
  this.author = author,
  this.pages = pages,
  this.read = read
}

function dialogToLibrary(title, author, pages, read) {
  // take params, create a book then store it in the array
  const book = new Book(crypto.randomUUID(),title, author, pages, read)
  myLibrary.push(book)

  // localStorage needs to be refreshed for every new added book
  localStorage.setItem("myLibrary",JSON.stringify(myLibrary))
}


/** 
 * @function: create html element, attach remove event to each book 
 * @param: position of each book in the library
 * 
 * this function is put in a loop
 * 
*/

function display(num) {
  // fetch the current library
  let retrievedLibrary = JSON.parse(localStorage.getItem("myLibrary"))

  // each book is one card
  const card  = document.createElement("div")
  card.classList.add("card")
  mainContent.append(card)

  
  for (let property in retrievedLibrary[num]) {

    // create element for each book's attribute, retrieve attributes' names 
      if (property != "id") {
      const attribute = document.createElement("div")
      attribute.classList.add(property)
      card.append(attribute)
      attribute.textContent = retrievedLibrary[num][property]
      }
  }

  // append remove button
  const removal = document.createElement("button")
  removal.classList.add("remove")
  removal.textContent = "del"
  card.append(removal)

  // define removal event
  removal.addEventListener("click", () => {
    card.remove()
    myLibrary.splice(num,1)   // remove the current book from actual library
    localStorage.setItem("myLibrary",JSON.stringify(myLibrary))    // reload the library

  })
  
}

/**
 * @event removeButton: create features like checkbox & confirm button when click remove
 * 
 */


removeButton.addEventListener("click", () => {
  // set up dialog and form format
  const dialog = document.createElement("dialog")
  header.append(dialog)
  const form = document.createElement("form")
  dialog.append(form)
  const p = document.createElement("p")
  form.append(p)
  const label = document.createElement("label")
  label.textContent = "Current titles:"
  p.append(label)

  // list all the available books with checkbox format
  for (let bookObj in myLibrary) {
    const option = document.createElement("div")
    label.append(option)    
    const input = document.createElement("input")
    input.setAttribute("type","checkbox")
    input.setAttribute("id", myLibrary[bookObj]['id'])
    input.setAttribute("name", "attribute")
    input.setAttribute("value",myLibrary[bookObj]['title'])
    input.setAttribute("required",'')
    option.append(input)

    const value = document.createElement("label")
    value.setAttribute("for",myLibrary[bookObj]['id'])
    value.textContent = myLibrary[bookObj]['title']
    option.append(value)

  }
  dialog.showModal()

  // add cancel button
  const cancelButton = document.createElement("button")
  cancelButton.textContent = "cancel"
  dialog.append(cancelButton)

  // add confirm button
  const cfmButton = document.createElement("button")
  cfmButton.textContent = "confirm"
  dialog.append(cfmButton)
  
  // close dialog after cancel clicked
  cancelButton.addEventListener("click", () => {
    dialog.close()
  })

  /**
   * @event cfmButton:
   */
  cfmButton.addEventListener("click", (event) => {
    
    event.preventDefault() // prevent the default button behaviour, which is submission.

    // remove checked items
    const checkbox = document.getElementsByName("attribute")
    const titles = document.getElementsByClassName("title")
    

    for (let i =0; i < checkbox.length; i++) {
      if (checkbox[i].checked) {
        // Remove element in DOM
        for (let title of titles) {
          if (title.textContent == checkbox[i].value) {
            title.parentElement.remove()
          }
        }
        
        // Remove element in memory & localStorage
        for (let bookNum in myLibrary){
          if (myLibrary[bookNum]['title']==checkbox[i].value) {
            myLibrary.splice(bookNum,1)
            localStorage.setItem("myLibrary", JSON.stringify(myLibrary))
          }
        }
      }
    }
    dialog.close()
  })

})


// Open dialog
addButton.addEventListener("click", () => {
  const title = document.getElementById("title")
  const author = document.getElementById("author")
  const pages = document.getElementById("pages")
  const read = document.getElementById("read")
  author.value = ''
  title.value = ''
  pages.value = ''
  read.value = ''
  dialog.showModal()
}
)
// Close dialog
const closeButton = document.getElementById("close")
closeButton.addEventListener("click", () => {
  dialog.close()
})

// Request a new book
const requestButton = document.getElementById("request")
requestButton.addEventListener("click", (event) => {

  // as preventDefault is used below to nullify the 'submit' type, it also 
  const form = document.querySelector('form');
  if (!form.checkValidity()) {
    form.reportValidity();  // notify error if required field is blank
    return;
  }
  event.preventDefault()
  
  const title = document.getElementById("title")
  const author = document.getElementById("author")
  const pages = document.getElementById("pages")
  const read = document.getElementById("read")
  if (read.checked) {
    read.textContent = "yes"
  } else {read.textContent = "no"}
  
  const currentTitles = myLibrary.map(book => book.title)
  console.log(currentTitles)
  if (currentTitles.includes(title.value)) {
    alert("This book was already added")
  } else {
    dialogToLibrary(title.value, author.value, pages.value, read.textContent) // add the requested book to the library
    display(myLibrary.length-1)
    dialog.close()
  }



})

for (let i=0; i < myLibrary.length; i++) {
  display(i)
}

