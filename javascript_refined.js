class Book {
  constructor(id, title, author, pages, read) {
    this.id = id;
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
  }
}

class Library {
  constructor() {
    const stored = localStorage.getItem("myLibrary");
    this.books = stored ? JSON.parse(stored) : [];
    if (this.books.length === 0) {
      this.seedLibrary();
    }
  }

  seedLibrary() {
    this.books = [
      new Book(crypto.randomUUID(),"The Law Of Human Nature", "Robert Greene", 624,"yes"),
      new Book(crypto.randomUUID(),"Deep Work", "Cal Newport",296,"no"),
      new Book(crypto.randomUUID(),"Designing Data-Intensive Applications", "Martin Kleppmann",562,"no"),
      new Book(crypto.randomUUID(),"Pour Your Heart Into It","Howard Schultz",351,"yes")
    ];
    this.save();
  }

  addBook(book) {
    this.books.push(book);
    this.save();
  }

  removeBook(id) {
    this.books = this.books.filter(b => b.id !== id);
    this.save();
  }

  save() {
    localStorage.setItem("myLibrary", JSON.stringify(this.books));
  }

  getBooks() {
    return [...this.books]; // return copy
  }
}

const UI = (() => {
  const mainContent = document.querySelector(".main-content");

  function renderLibrary(library) {
    mainContent.innerHTML = ""; // clear
    library.getBooks().forEach(book => renderBook(book, library));
  }

  function renderBook(book, library) {
    const card = document.createElement("div");
    card.classList.add("card");

    ["title","author","pages","read"].forEach(prop => {
      const div = document.createElement("div");
      div.classList.add(prop);
      div.textContent = book[prop];
      card.append(div);
    });

    const removal = document.createElement("button");
    removal.textContent = "Delete";
    removal.addEventListener("click", () => {
      library.removeBook(book.id);
      renderLibrary(library);
    });
    card.append(removal);

    mainContent.append(card);
  }

  return { renderLibrary };
})();

class App {
  constructor() {
    this.library = new Library();
    UI.renderLibrary(this.library);
    this.bindEvents();
  }

  bindEvents() {
    const addButton = document.getElementById("addButton");
    addButton.addEventListener("click", () => this.openAddDialog());

    const removeButton = document.getElementById("removeButton");
    removeButton.addEventListener("click", () => this.openRemoveDialog());
  }

  openAddDialog() {
    const dialog = document.querySelector("dialog");
    dialog.showModal();

    const requestButton = document.getElementById("request");
    requestButton.onclick = (event) => {
      event.preventDefault();
      const title = document.getElementById("title").value;
      const author = document.getElementById("author").value;
      const pages = document.getElementById("pages").value;
      const read = document.getElementById("read").checked ? "yes" : "no";

      if (this.library.getBooks().some(b => b.title === title)) {
        alert("This book already exists!");
        return;
      }

      this.library.addBook(new Book(crypto.randomUUID(), title, author, pages, read));
      UI.renderLibrary(this.library);
      dialog.close();
    };
    const closeButton = document.getElementById("close");
    closeButton.addEventListener("click", () => {
    dialog.close();
    });
  }

  openRemoveDialog() {
    const deleteDialog = document.getElementById("deleteDialog");
  const deleteList = document.getElementById("deleteList");
  const deleteConfirm = document.getElementById("deleteConfirm");
  const deleteCancel = document.getElementById("deleteCancel");

  // Clear previous list
  deleteList.innerHTML = "";

  // Render checkboxes for each book
  this.library.getBooks().forEach(book => {
    const wrapper = document.createElement("div");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = book.id;
    checkbox.name = "bookToDelete";
    checkbox.value = book.id;

    const label = document.createElement("label");
    label.setAttribute("for", book.id);
    label.textContent = book.title;

    wrapper.append(checkbox, label);
    deleteList.append(wrapper);
  });

  // Show the dialog
  deleteDialog.showModal();

  // Cancel button
  deleteCancel.onclick = () => {
    deleteDialog.close();
  };

  // Confirm deletion
  deleteConfirm.onclick = (event) => {
    event.preventDefault();

    const selected = [...deleteList.querySelectorAll("input:checked")];
    selected.forEach(box => {
      this.library.removeBook(box.value); // remove by ID
    });

    UI.renderLibrary(this.library);
    deleteDialog.close();
  };
  }
}

document.addEventListener("DOMContentLoaded", () => new App());

