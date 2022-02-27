const themeSwitcherBtn = document.getElementById("theme-switcher");
const bodyTag = document.querySelector("body");
const themeImg = document.getElementById("themeImg");
const addBtn = document.getElementById("add-btn");
const todoInput = document.getElementById("addt");
const ul = document.querySelector(".todos");
const filter = document.querySelector(".filter");
const filterBtn = document.getElementById("clear-completed");

// Theme-Switcher
function lightMode() {
  bodyTag.classList.toggle("light");
  themeImg.setAttribute(
    "src",
    themeImg.getAttribute("src") === "assets/images/icon-sun.svg"
      ? "assets/images/icon-moon.svg"
      : "assets/images/icon-sun.svg"
  );
}

function main() {
  // Theme-Switcher
  themeSwitcherBtn.addEventListener("click", lightMode);

  makeTodoElement(JSON.parse(localStorage.getItem("todos")));

  ul.addEventListener("dragover", dragOver);

  //Add Todo In LocalStorage
  addBtn.addEventListener("click", addInput);

  todoInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      addInput();
    }
  });

  filter.addEventListener("click", (e) => {
    const id = e.target.id;
    if (id) {
      document.querySelector(".on").classList.remove("on");
      document.getElementById(id).classList.add("on");
      document.querySelector(".todos").className = `todos ${id}`;
    }
  });

  filterBtn.addEventListener("click", () => {
    var deleteIndexes = [];

    document.querySelectorAll(".card.checked").forEach((card) => {
      deleteIndexes.push(
        [...document.querySelectorAll(".todos .card")].indexOf(card)
      );
      card.classList.add("fall");
      card.addEventListener("animationend", () => {
        card.remove();
      });
    });
    removeMultipleTodos(deleteIndexes);
  });
}

//Add Todo In LocalStorage
function addInput() {
  const todoItem = todoInput.value.trim();

  if (todoItem) {
    todoInput.value = "";

    const todos = !localStorage.getItem("todos")
      ? []
      : JSON.parse(localStorage.getItem("todos"));

    const currentTodo = {
      item: todoItem,
      isCompleted: false,
    };

    todos.push(currentTodo);
    localStorage.setItem("todos", JSON.stringify(todos));
    makeTodoElement([currentTodo]);
  }
}

// Make todo elements

function makeTodoElement(todoArray) {
  if (!todoArray) {
    return null;
  }

  const ItemsLeft = document.querySelector("#items-left");

  todoArray.forEach((todoObject) => {
    //Create Html Elements Of Todo

    const card = document.createElement("li");
    const cbContainer = document.createElement("div");
    const cbInput = document.createElement("input");
    const checkSpan = document.createElement("span");
    const item = document.createElement("p");
    const clearBtn = document.createElement("button");
    const img = document.createElement("img");

    //Add Classes
    card.classList.add("card");
    cbContainer.classList.add("cb-container");
    cbInput.classList.add("cb-input");
    checkSpan.classList.add("check");
    item.classList.add("item");
    clearBtn.classList.add("clear");

    // Set Attributes

    card.setAttribute("draggable", true);
    cbInput.setAttribute("type", "checkbox");
    img.setAttribute("src", "assets/images/icon-cross.svg");
    img.setAttribute("alt", "Clear it");

    item.textContent = todoObject.item;

    if (todoObject.isComplete) {
      card.classList.add("checked");
      cbInput.setAttribute("checked", "checked");
    }

    //Add EventListener
    card.addEventListener("dragstart", () => {
      card.classList.add("dragging");
    });

    card.addEventListener("dragend", () => {
      card.classList.remove("dragging");
    });

    cbInput.addEventListener("click", () => {
      const currentCard = cbInput.parentElement.parentElement;
      const checked = cbInput.checked;
      const currentCardIndex = [
        ...document.querySelectorAll(".todos .card"),
      ].indexOf(currentCard);

      stateTodo(currentCardIndex, checked);

      checked
        ? currentCard.classList.add("checked")
        : currentCard.classList.remove("checked");

      ItemsLeft.textContent = document.querySelectorAll(
        ".todos .card:not(.checked)"
      ).length;
    });

    clearBtn.addEventListener("click", () => {
      const currentCard = clearBtn.parentElement;
      currentCard.classList.add("fall");
      const indexOfCurrentCard = [
        ...document.querySelectorAll(".todos .card"),
      ].indexOf(currentCard);
      removeTodo(indexOfCurrentCard);

      currentCard.addEventListener("animationend", () => {
        currentCard.remove();
        ItemsLeft.textContent = document.querySelectorAll(
          ".todos .card:not(.checked"
        ).length;
      });
    });

    //Set Element by Parent Child
    clearBtn.appendChild(img);
    cbContainer.appendChild(cbInput);
    cbContainer.appendChild(checkSpan);
    card.appendChild(cbContainer);
    card.appendChild(item);
    card.appendChild(clearBtn);

    ul.appendChild(card);
  });
  ItemsLeft.textContent = document.querySelectorAll(
    ".todos .card:not(.checked"
  ).length;
}

function dragOver(e) {
  e.preventDefault();

  if (
    e.target.classList.contains("card") &&
    !e.target.classList.contains("dragging")
  ) {
    const draggingCard = document.querySelector(".dragging");
    const Cards = [...ul.querySelectorAll(".card")];
    const currentPos = Cards.indexOf(draggingCard);
    const newPos = Cards.indexOf(e.target);

    if (currentPos > newPos) {
      ul.insertBefore(draggingCard, e.target);
    } else {
      ul.insertBefore(draggingCard, e.target.nextSibling);
    }

    const todos = JSON.parse(localStorage.getItem("todos"));
    const removed = todos.splice(currentPos, 1);
    todos.splice(newPos, 0, removed[0]);
    localStorage.setItem("todos", JSON.stringify(todos));
  }
}

function removeTodo(index) {
  const todos = JSON.parse(localStorage.getItem("todos"));
  todos.splice(index, 1);
  localStorage.setItem("todos", JSON.stringify(todos));
}

function removeMultipleTodos(indexes) {
  var todos = JSON.parse(localStorage.getItem("todos"));
  todos = todos.filter((todo, index) => {
    return !indexes.includes(index);
  });
  localStorage.setItem("todos", JSON.stringify(todos));
}

function stateTodo(index, isComplete) {
  const todos = JSON.parse(localStorage.getItem("todos"));
  todos[index].isCompleted = isComplete;
  localStorage.setItem("todos", JSON.stringify(todos));
}

document.addEventListener("DOMContentLoaded", main);
