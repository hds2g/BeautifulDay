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


function modifyTodo(event) {
  const btn = event.target;
  const li = btn.parentNode;
  const children = li.childNodes;
  
  const form = document.createElement("form");
  const editText = document.createElement("input");
  let oldText, oldDue;

  const todoID = li.getAttribute('id');
  console.log(todo[todoID].text, todo[todoID].due);

  if(li.hasChildNodes()) {
      for (let i = 0; i < children.length; i++) {
        if(children[i].className.includes("text")) {
          children[i].style.display='none';

          editText.setAttribute("type", "text");
          editText.setAttribute("name", "text");
          editText.value = children[i].innerText;
          oldText = children[i].innerText;
          form.appendChild(editText);
          li.appendChild(form);
        }

        if(children[i].className.includes("due")) {
          children[i].style.display='none';
          oldDue = children[i].innerText;
        }

        if(children[i].className.includes("delBtn")) {
          children[i].style.display='none';
        }

        if(children[i].className.includes("modifyBtn")) {
            children[i].style.display='none';
        }
      }
  }

  editText.setAttribute("placeholder", oldText+" "+oldDue);
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    console.log(editText.value);
    
    [todo[todoID].text, todo[todoID].due] = parseDue(editText.value);
    saveTodo();
    
    li.style.display = 'none';
    location.reload();
  });
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

function parseDue(text) {
  let due="";
  let newText=text;
  const reg_due1 = new RegExp("\\!\\d+/\\d+", "g"); //"test !08/03"

  // check duedate
  if (text.match(reg_due1) !== null) {
    due = text.match(reg_due1).join();
    newText = text.replace(due,"");
    due = due.replace("!", ""); //remove !
    return [newText, due];
  }
  return [text, due];
}



function parseTodoText(text, li, span_text, span_due, loaded_category) {
  
  let category;
  let currentDate;

  if(span_due.innerText === "") {
    [text, span_due.innerText] = parseDue(text);
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
  const modifyBtn = document.createElement("button");
  const span_text = document.createElement("span");
  const span_due = document.createElement("span");
  delBtn.innerText = "Done";
  delBtn.addEventListener("click", doneTodo);

  modifyBtn.innerText = "Modify";
  modifyBtn.addEventListener("click", modifyTodo);

  // set ClassName
  span_text.className = "text";
  span_due.className  = "due";
  delBtn.className = "delBtn";
  modifyBtn.className = "modifyBtn";

  //span.innerText = text;
  li.id = todo.length;
  li.appendChild(span_text);
  li.appendChild(span_due);
  li.appendChild(modifyBtn);
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

function highlightCategory() {
  time = new Date().getHours();
  
  if(time > WORK_START_TIME && time < WORK_END_TIME) {
    todoList_personal.style.opacity = DIM_CATEGORY_OPACITY;
    todoList_life.style.opacity = DIM_CATEGORY_OPACITY;
  }else{
    todoList_work.style.opacity = DIM_CATEGORY_OPACITY;
  }
}

function init() {
  loadTodo();
  todoForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const inputText = todoInput.value;
    registerTodo(inputText);
    todoInput.value = "";
  });
  
  highlightCategory();
}

init();