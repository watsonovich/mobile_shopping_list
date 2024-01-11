import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
  remove,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = {
  databaseURL: "https://realtime-database-2-f2202-default-rtdb.firebaseio.com/",
};

const app = initializeApp(appSettings);
const database = getDatabase(app);
const shoppingListInDB = ref(database, "shoppingList");

const inputFieldEl = document.getElementById("input-field");
const addButtonEl = document.getElementById("add-button");
const shoppingListEl = document.getElementById("shopping-list");

addButtonEl.addEventListener("click", function () {
  let inputValue = inputFieldEl.value;
  push(shoppingListInDB, inputValue);
  clearInput();
});

inputFieldEl.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    addButtonEl.click();
  }
});

onValue(shoppingListInDB, function (snapshot) {
  if (snapshot.exists()) {
    let dbList = Object.entries(snapshot.val());

    clearShoppingList();

    for (let i = 0; i < dbList.length; i++) {
      let currentItem = dbList[i];
      let currentItemID = currentItem[0];
      let currentItemValue = currentItem[1];

      addListitem(currentItem);
    }
  } else {
    shoppingListEl.innerHTML = "Nothing in here... yet";
  }
});

function clearInput() {
  inputFieldEl.value = "";
}

function clearShoppingList() {
  shoppingListEl.innerHTML = "";
}

function addListitem(item) {
  let itemID = item[0];
  let itemValue = item[1];

  let newEl = document.createElement("li");
  newEl.textContent = itemValue;

  let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`);

  newEl.addEventListener("click", function () {
    remove(exactLocationOfItemInDB);
  });

  shoppingListEl.append(newEl);
}
