document.addEventListener("DOMContentLoaded", function() {
    const submitForm = document.getElementById("inputTransaction");
    submitForm.addEventListener("submit", function(event) {
        event.preventDefault();
        addTransaction();
    });

    if (storageExist()) {
        localDataFromStorage();
    };
})

function addTransaction() {
    const transactionCategory = document.getElementById("inputTransactionCategory").value;
    const transactionNote = document.getElementById("inputTransactionNote").value;
    const transactionAmount = document.getElementById("inputTransactionAmount").value;

    const generateID = generateId();
    const transactionObject = generateObject(generateID, transactionCategory, transactionNote, transactionAmount);
    transactions.push(transactionObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function generateId() {
    return +new Date();
}

function generateObject(id, category, note, amount) {
    return {
        id,
        category,
        note,
        amount
    };
}

const transactions = [];
const RENDER_EVENT = "render-transaction";

document.addEventListener(RENDER_EVENT, function() {
    const transactionList = document.getElementById("TransactionsList");
    transactionList.innerHTML = "";

    for (const item of transactions) {
        const transactionElement = makeTransaction(item);
        transactionList.append(transactionElement)
    };
})

function makeTransaction(transactionObject) {
    const textCategory = document.createElement("h3");
    textCategory.innerText = transactionObject.category;

    const textNote = document.createElement("p");
    textNote.innerText = transactionObject.note;

    const textAmount = document.createElement("p");
    textAmount.innerText = transactionObject.amount
    
    const buttonEdit = document.createElement("button")
    buttonEdit.classList.add("green");
    buttonEdit.innerText = "Edit"

    const textContainer = document.createElement("div");
    textContainer.classList.add("action");
    textContainer.append(buttonEdit);
    
    const container = document.createElement("article");
    container.classList.add("transaction-item");
    container.classList.add("card");
    container.setAttribute("id",`trasaction-${transactionObject.id}`);
    container.append(textCategory,textNote,textAmount,textContainer);

    return container;
}

function findTrasaction(transactionId) {
    for (const Item of transactions) {
        if (Item.id === transactionId) {
            return Item;
        };
    };
    return null;
}

function findTransactionIndex(transactionId) {
    for (const index of transactions) {
        if (transactions[index].id === transactionId) {
            return index;
        };
    };

    return -1;
}


// Storage


const SAVED_EVENT = "saved-transaction";
const STORAGE_KEY = "FINANCIAL_APPS";

document.addEventListener(SAVED_EVENT, function() {
    console.log(localStorage.getItem(STORAGE_KEY));
    const transactionTarget = findTrasaction(transactions);

    if (transactionTarget == null) return;


})

function storageExist() {
    if (typeof(Storage) === undefined) {
        alert("Browsernya gak dukung local storage");
        return false;
    };
    return true;
}

function saveData() {
    if (storageExist()) {
        const parsed = JSON.stringify(transactions);
        localStorage.setItem(STORAGE_KEY,parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    };
}

function localDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);

    if (data !== null) {
        for (const transaction of data) {
            transactions.push(transaction)
        };
    };

    document.dispatchEvent(new Event(RENDER_EVENT));
}