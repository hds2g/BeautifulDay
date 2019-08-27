const todoForm = document.querySelector(".js-todoForm"),
  todoInput = todoForm.querySelector("input"),
  todoList_work = document.querySelector(".js-toDoList__work"),
  todoList_personal = document.querySelector(".js-toDoList__personal"),
  todoList_life = document.querySelector(".js-toDoList__life");

const TODOS_LS = "todo"; // local storage
let todo = {
  work: [
    //{id:1, text:"work todo 1", due:"2019/09/03"},
  ],
  personal: [
    //{id:1, text:"personal todo 1", due:"2019/09/03"},
  ],
  life: [
    //{id:1, text:"life todo 1", due:"2019/09/03"},
  ]
};

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
      parseTodo.work.forEach(function(todo) {
        registerTodo(todo.text, 0);
      });
    }

    if (parseTodo.personal !== null) {
      parseTodo.personal.forEach(function(todo) {
        registerTodo(todo.text, 1);
      });
    }

    if (parseTodo.life !== null) {
      parseTodo.life.forEach(function(todo) {
        registerTodo(todo.text, 2);
      });
    }
  }
}

function doneTodo(event) {
  const btn = event.target;
  const li = btn.parentNode;
  const div = li.parentNode;
  div.removeChild(li);
  if (div.className.includes("work")) {
    const updateTodo = todo.work.filter(function(todo) {
      return parseInt(todo.id) !== parseInt(li.id);
    });
    todo.work = updateTodo;
  }

  if (div.className.includes("personal")) {
    const updateTodo = todo.personal.filter(function(todo) {
      return todo.personal.id !== parseInt(li.id);
    });
    todo.personal = updateTodo;
  }

  if (div.className.includes("life")) {
    const updateTodo = todo.life.filter(function(todo) {
      return todo.life.id !== parseInt(li.id);
    });
    todo.life = updateTodo;
  }

  saveTodo();
}

function saveTodo() {
  //onsole.log(todo);
  localStorage.setItem(TODOS_LS, JSON.stringify(todo));
}

function parseTodoText(text, li, span_text, span_due, index) {
  const reg_due1 = new RegExp("\\!\\d+/\\d+", "g"); //"test !08/03"
  const reg_due2 = new RegExp("\\!\\d+(d|w)", "g"); //"test !12w"

  // distingush categoty
  if (text.includes("@w") || text.includes("@work") || index == 0) {
    //console.log("@work");
    li.id = todo.work.length + 1;

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
    todo.work.push({
      id: li.id,
      text: span_text.innerText,
      due: span_due.innerText
    });
  } else if (text.includes("@p") || text.includes("@personal") || index == 1) {
    //console.log("@personal");
    li.id = todo.personal.length + 1;
    span_text.innerText = stringCut(text, ["@personal", "@p"]);
    todoList_personal.appendChild(li);
    todo.personal.push({ id: li.id, text: span_text.innerText });
  } else {
    // default is life
    //if (text.includes("@l") || text.includes("@life")) {
    //console.log("@life");
    li.id = todo.life.length + 1;
    span_text.innerText = stringCut(text, ["@life", "@l"]);
    todoList_life.appendChild(li);
    todo.life.push({ id: li.id, text: span_text.innerText });
  }
}

function registerTodo(text, index) {
  const li = document.createElement("li");
  const delBtn = document.createElement("button");
  const span_text = document.createElement("span");
  const span_due = document.createElement("span");

  delBtn.innerText = "Done";
  delBtn.addEventListener("click", doneTodo);
  //span.innerText = text;

  li.appendChild(span_text);
  li.appendChild(span_due);
  li.appendChild(delBtn);

  parseTodoText(text, li, span_text, span_due, index);

  if (index === -1) {
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
