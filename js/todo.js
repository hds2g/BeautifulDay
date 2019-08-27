const todoForm = document.querySelector(".js-todoForm"),
  todoInput = todoForm.querySelector("input"),
  todoList_work = document.querySelector(".js-toDoList__work"),
  todoList_personal = document.querySelector(".js-toDoList__personal"),
  todoList_life = document.querySelector(".js-toDoList__life");

const TODOS_LS = "todo"; // local storage
const WORK = "work";
const PERSONAL = "personal";
const LIFE = "life";
let todo = [];
/*
cut sub-string in text

a = "test aa test"
when you cut "aa" in a,
call stringCut(a, "aa");


*/
function stringCut(oriText, delText) {
  for (i = 0; i < delText.length; i++) {
    if ((n = oriText.search(delText[i])) > 0) {
      const sub1 = oriText.slice(0, n);
      const sub2 = oriText.slice(n + delText[i].length + 1, oriText.length);
      return sub1.concat(sub2).trim();
    }
  }
  return oriText;
}

function loadTodo() {
  const parseTodo = JSON.parse(localStorage.getItem(TODOS_LS));

  if (parseTodo !== null) {
    //console.log(parseTodo);
    if (parseTodo.work !== null) {
      parseTodo.forEach(function(todo) {
        if (todo.category == WORK) {
          registerTodo(todo.text, WORK);
        } else if (todo.category == PERSONAL) {
          registerTodo(todo.text, PERSONAL);
        } else if (todo.category == LIFE) {
          registerTodo(todo.text, LIFE);
        }
      });
    }
  }
}

function doneTodo(event) {
  const btn = event.target;
  const li = btn.parentNode;
  const div = li.parentNode;
  let updateTodo;

  div.removeChild(li);

  if (div.className.includes(WORK)) {
    updateTodo = todo.filter(function(todo) {
      return parseInt(todo.id) !== parseInt(li.id);
    });
    //todo = updateTodo;
  } else if (div.className.includes(PERSONAL)) {
    updateTodo = todo.filter(function(todo) {
      return parseInt(todo.id) !== parseInt(li.id);
    });
    //todo = updateTodo;
  } else if (div.className.includes(LIFE)) {
    updateTodo = todo.filter(function(todo) {
      return parseInt(todo.id) !== parseInt(li.id);
    });
    //todo = updateTodo;
  }

  todo = updateTodo;
  saveTodo();
}

function saveTodo() {
  //onsole.log(todo);
  localStorage.setItem(TODOS_LS, JSON.stringify(todo));
}

function parseTodoText(text, li, span_text, span_due, loaded_category) {
  const reg_due1 = new RegExp("\\!\\d+/\\d+", "g"); //"test !08/03"
  const reg_due2 = new RegExp("\\!\\d+(d|w)", "g"); //"test !12w"
  let category;
  // distingush categoty
  if (
    text.includes("@w") ||
    text.includes("@work") ||
    loaded_category == WORK
  ) {
    //console.log("@work");

    // check duedate
    if (text.match(reg_due1) !== null) {
      span_due.innerText = text.match(reg_due1);
      text = text.replace(reg_due1, "");
    } else if (text.match(reg_due2) !== null) {
      span_due.innerText = text.match(reg_due2);
      text = text.replace(reg_due2, "");
    }

    span_text.innerText = stringCut(text, ["@work", "@w"]);

    todoList_work.appendChild(li);
    category = WORK;
  } else if (
    text.includes("@p") ||
    text.includes("@personal") ||
    loaded_category == PERSONAL
  ) {
    //console.log("@personal");
    span_text.innerText = stringCut(text, ["@personal", "@p"]);
    todoList_personal.appendChild(li);
    category = PERSONAL;
  } else {
    // default is life
    span_text.innerText = stringCut(text, ["@life", "@l"]);
    todoList_life.appendChild(li);
    category = LIFE;
  }

  todo.push({
    id: li.id,
    text: span_text.innerText,
    due: span_due.innerText,
    category: category
  });
}

function registerTodo(text, category) {
  const li = document.createElement("li");
  const delBtn = document.createElement("button");
  const span_text = document.createElement("span");
  const span_due = document.createElement("span");

  delBtn.innerText = "Done";
  delBtn.addEventListener("click", doneTodo);
  //span.innerText = text;
  li.id = todo.length + 1;
  li.appendChild(span_text);
  li.appendChild(span_due);
  li.appendChild(delBtn);

  parseTodoText(text, li, span_text, span_due, category);

  if (category === -1) {
    saveTodo();
  }
}

function handleSubmit(event) {
  event.preventDefault();
  const inputText = todoInput.value;
  registerTodo(inputText, -1);
  todoInput.value = "";
}

function init() {
  loadTodo();
  todoForm.addEventListener("submit", handleSubmit);
}

init();
