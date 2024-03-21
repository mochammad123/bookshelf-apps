const RENDER_EVENT = "render-book";
const SAVED_EVENT = "saved-book";
const MOVED_EVENT = "moved-book";
const FINISH_EVENT = "finish-book";
const DELETED_EVENT = "deleted-book";
const STORAGE_KEY = "BOOKSHELF_APPS";
const books = [];

const isStorageExist = () => {
    if (typeof (Storage) === undefined) {
        alert("Browser kamu tidak mendukung web storage!");
        return false;
    }
    return true;
};

const loadDataFromStorage = () => {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));

    if (data !== null) {
        for (const item of data) {
            books.push(item);
        }
    }
    document.dispatchEvent(new Event(RENDER_EVENT));
};

document.addEventListener("DOMContentLoaded", () => {
    if (isStorageExist()) {
        loadDataFromStorage();
    }

    const saveForm = document.getElementById("inputBook");
    saveForm.addEventListener("submit", (event) => {
        event.preventDefault();
        addBook();
    });

    const searchForm = document.getElementById("formSearch");
    searchForm.addEventListener("submit", (event) => {
        event.preventDefault();
        searchBook();
        console.log(searchBook());
    });

    const resetBtn = document.querySelector(".reset_btn");
    resetBtn.addEventListener("click", () => {
        document.getElementById("search").value = "";
        searchBook();
    });
});


document.addEventListener(RENDER_EVENT, () => {
    const unReadBook = document.getElementById("unRead");
    unReadBook.innerHTML = "";

    const alreadyReadBook = document.getElementById("alreadyRead");
    alreadyReadBook.innerHTML = "";

    for (const bookItem of books) {
        const bookElement = makeBookElement(bookItem);
        if (!bookItem.isComplete) {
            unReadBook.append(bookElement);
        } else {
            alreadyReadBook.append(bookElement);
        }
    }
});

document.addEventListener(SAVED_EVENT, function () {
    const elementCustomAlert = document.createElement("div");
    elementCustomAlert.classList.add("alert_done");
    elementCustomAlert.innerText = "Berhasil Disimpan!";

    document.body.insertBefore(elementCustomAlert, document.body.children[0]);
    setTimeout(() => {
        elementCustomAlert.remove();
    }, 1000);
});

document.addEventListener(MOVED_EVENT, () => {
    const elementCustomAlert = document.createElement("div");
    elementCustomAlert.classList.add("alert_move");
    elementCustomAlert.innerText = "Belum Dibaca!";

    document.body.insertBefore(elementCustomAlert, document.body.children[0]);
    setTimeout(() => {
        elementCustomAlert.remove();
    }, 1000);
});

document.addEventListener(FINISH_EVENT, () => {
    const elementCustomAlert = document.createElement("div");
    elementCustomAlert.classList.add("alert_finish");
    elementCustomAlert.innerText = "Selesai Dibaca!";

    document.body.insertBefore(elementCustomAlert, document.body.children[0]);
    setTimeout(() => {
        elementCustomAlert.remove();
    }, 1000);
})

document.addEventListener(DELETED_EVENT, () => {
    const elementCustomAlert = document.createElement("div");
    elementCustomAlert.classList.add("alert_delete");
    elementCustomAlert.innerText = "Berhasil Dihapus!";

    document.body.insertBefore(elementCustomAlert, document.body.children[0]);
    setTimeout(() => {
        elementCustomAlert.remove();
    }, 1000);
});

const addBook = () => {
    const bookTitle = document.getElementById("inputBookTitle");
    const bookAuthor = document.getElementById("inputBookAuthor");
    const bookYear = document.getElementById("inputBookYear");
    const bookIsComplete = document.getElementById("inputBookIsComplete");
    let bookStatus;

    if (bookIsComplete.checked) {
        bookStatus = true;
    } else {
        bookStatus = false;
    }

    books.push({
        id: +new Date(),
        title: bookTitle.value,
        author: bookAuthor.value,
        year: Number(bookYear.value),
        isComplete: bookStatus,
    });

    bookTitle.value = null;
    bookAuthor.value = null;
    bookYear.value = null;
    bookIsComplete.checked = false;

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
};


const addBookToFinished = (bookId) => {
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;
    bookTarget.isComplete = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    finishData();
};

const returnBookFromFinished = (bookId) => {
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;

    bookTarget.isComplete = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    moveData();
}

const deleteBook = (bookId) => {
    const bookTarget = findBookIndex(bookId);

    if (bookTarget === -1) return;

    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    deleteData();
}

const findBook = (bookId) => {
    for (const bookItem of books) {
        if (bookItem.id === bookId) {
            return bookItem;
        }
    }
    return null;
};

const findBookIndex = (bookId) => {
    for (const index in books) {
        if (books[index].id === bookId) {
            return index;
        }
    }

    return -1;
};

const saveData = () => {
    if (isStorageExist()) {
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
};

const finishData = () => {
    if (isStorageExist()) {
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(FINISH_EVENT));
    }
}

const moveData = () => {
    if (isStorageExist()) {
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(MOVED_EVENT));
    }
};

const deleteData = () => {
    if (isStorageExist()) {
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(DELETED_EVENT));
    }
};

const editData = () => {
    if (isStorageExist()) {
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event())
    }
}

const searchBook = () => {
    const searchInput = document.getElementById("search").value.toLowerCase();
    const bookItems = document.getElementsByClassName("item");

    for (let i = 0; i < bookItems.length; i++) {
        const itemTitle = bookItems[i].querySelector(".item-title");
        if (itemTitle.textContent.toLowerCase().includes(searchInput)) {
            bookItems[i].classList.remove("hidden");
        } else {
            bookItems[i].classList.add("hidden");
        }
    }
};

const makeBookElement = (bookObject) => {
    const elementBookTitle = document.createElement("p");
    elementBookTitle.classList.add("item-title");
    elementBookTitle.innerHTML = `${bookObject.title} <span>(${bookObject.year})</span>`;

    const elemetBookYear = document.createElement("p");
    elemetBookYear.classList.add("item-year");
    elemetBookYear.innerText = bookObject.year;

    const elementBookAuthor = document.createElement("p");
    elementBookAuthor.classList.add("item-writter");
    elementBookAuthor.innerText = bookObject.author;

    const descContainer = document.createElement("div");
    descContainer.classList.add("item-desc");
    descContainer.append(elementBookTitle, elementBookAuthor);

    const actionContainer = document.createElement("div");
    actionContainer.classList.add("item-action");

    const container = document.createElement("div");
    container.classList.add("item");
    container.append(descContainer);
    container.setAttribute("id", `book-${bookObject.id}`);

    if (bookObject.isComplete) {
        const returnBtn = document.createElement("button");
        returnBtn.classList.add("return_btn");
        returnBtn.innerHTML = `<i class='bx bx-undo bx-xs'></i>`;

        returnBtn.addEventListener("click", () => {
            returnBookFromFinished(bookObject.id);
        });

        const deleteBtn = document.createElement("button");
        deleteBtn.classList.add("delete_btn");
        deleteBtn.innerHTML = `<i class='bx bx-trash bx-xs'></i>`;

        deleteBtn.addEventListener("click", () => {
            if (confirm("Yakin akan dihapus ?")) {
                deleteBook(bookObject.id);
            } else {

            }
        });

        actionContainer.append(returnBtn, deleteBtn);
        container.append(actionContainer);
    } else {

        const finishBtn = document.createElement("button");
        finishBtn.classList.add("finish_btn");
        finishBtn.innerHTML = `<i class='bx bx-check bx-xs'></i>`;

        finishBtn.addEventListener("click", () => {
            addBookToFinished(bookObject.id);
        });

        const deleteBtn = document.createElement("button");
        deleteBtn.classList.add("delete_btn");
        deleteBtn.innerHTML = `<i class='bx bx-trash bx-xs'></i>`;

        deleteBtn.addEventListener("click", () => {
            if (confirm("Yakin akan dihapus ?")) {
                deleteBook(bookObject.id);
            } else {

            }
        });

        actionContainer.append(finishBtn, deleteBtn);
        container.append(actionContainer);
    }

    return container;
}