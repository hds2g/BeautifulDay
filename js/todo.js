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

const WORK_START_TIME=9
const WORK_END_TIME=18

const DIM_CATEGORY_OPACITY=0.5


const WORK_PHRASES = ["@work", "@WORK", "@wo", "@WO", "@w", "@W"];
const PERSONAL_PHRASES = ["@personal", "@PERSONAL", "@pe", "@PE","@p", "@P"];
const LIFE_PHRASES = ["@life", "@LIFE", "@li", "@LI","@l", "@L"];

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
      parseTodo.forEach(function(todo) {
          registerTodo(todo);
      });
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

function checkCategory(text) {
  let result = [];

  result.push(WORK_PHRASES.reduce((acc, cur, i) => {
    return acc + text.includes(cur)
  }, 0));

  result.push(PERSONAL_PHRASES.reduce((acc, cur, i) => {
    return acc + text.includes(cur)
  }, 0));

  result.push(LIFE_PHRASES.reduce((acc, cur, i) => {
    return acc + text.includes(cur)
  }, 0));

  if( result[0] >= 1) {
    return WORK;
  }else if( result[1] >= 1){
    return PERSONAL;
  }else if( result[2] >= 2){
    return LIFE;
  }else{
    return 0;
  }
}



function parseTodoText(text, li, span_text, span_due, loaded_category) {
  const reg_due1 = new RegExp("\\!\\d+/\\d+", "g"); //"test !08/03"
  let category;
  let currentDate;


    // check duedate
    if (text.match(reg_due1) !== null) {
      due = text.match(reg_due1).join();
      text = text.replace(due,"");
      due = due.replace("!", ""); //remove !
      span_due.innerText = due;
    }

  // distingush categoty
  if (checkCategory(text) == WORK || loaded_category == WORK) {
    span_text.innerText = stringCut(text, WORK_PHRASES);
    todoList_work.appendChild(li);
    category = WORK;
  } else if (checkCategory(text) == PERSONAL || loaded_category == PERSONAL) {
    span_text.innerText = stringCut(text, PERSONAL_PHRASES);
    todoList_personal.appendChild(li);
    category = PERSONAL;
  } else {
    // default is life
    span_text.innerText = stringCut(text, LIFE_PHRASES);
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

function registerTodo(...todoArgs) {
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

  let text = todoArgs[0].text;
  const due = todoArgs[0].due;
  const category = todoArgs[0].category;

  if(text == undefined) {
    text = todoArgs[0];
  }

  if(due != undefined){
    span_due.innerText = due;
  }

  parseTodoText(text, li, span_text, span_due, category);

  if (category === undefined) {
    saveTodo();
  }
}

function handleSubmit(event) {
  event.preventDefault();
  const inputText = todoInput.value;
  registerTodo(inputText);
  todoInput.value = "";
}

function highlightCategory() {
  time = new Date().getHours();
  
  // highlight 
  if(time > WORK_START_TIME && time < WORK_END_TIME) {
    todoList_personal.style.opacity = DIM_CATEGORY_OPACITY;
    todoList_life.style.opacity = DIM_CATEGORY_OPACITY;
  }else{
    todoList_work.style.opacity = DIM_CATEGORY_OPACITY;
  }
}

function init() {
  loadTodo();
  todoForm.addEventListener("submit", handleSubmit);
  
  highlightCategory();
}

init();