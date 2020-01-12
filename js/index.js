const URL_PREFIX='http://localhost:3000/';

const monsterFormContainer = document.querySelector('#create-monster')
const monsterContainer = document.querySelector('#monster-container');

const firstPageButton = document.querySelector('#first-page');
const backButton = document.querySelector('#back');
const showPageNumber = document.querySelector('#page-number');
const forwardButton = document.querySelector('#forward');
const lastPageButton = document.querySelector('#last-page')

let pageNumber = 1;
let numberOfMonstersPerPage = 5;
let totalNumberOfMonsters;
let lastPage;

////////////////////////////// LOAD PAGE

function loadPage(pageNumber){
  monsterContainer.textContent = '';

  fetch(`${URL_PREFIX}monsters/?_limit=${numberOfMonstersPerPage}&_page=${pageNumber}`)
  .then(r => r.json())
  .then(monsters => monsters.forEach(renderMonster));
  renderShowPageNumber(pageNumber);

  fetch(`${URL_PREFIX}monsters`)
  .then(r => r.json())
  .then((monsters) => {totalNumberOfMonsters = monsters.length})
};

loadPage(pageNumber);

function renderMonster(monster){
  const monsterDiv = document.createElement('div');
    monsterDiv.dataset.id = monster.id;
    const name = document.createElement('h2');
      name.innerText = monster.name;
    const age = document.createElement('h4');
      age.innerText = monster.age;
    const description = document.createElement('p');
      description.innerText = monster.description;
    const updateDiv = document.createElement("div");
    const updateButton = document.createElement('button');
      updateButton.innerText = "Update";
      updateButton.addEventListener('click', () => {
        toggleUpdateMonster(monster.name, monster.age, monster.description, updateDiv, monster.id)
      });
    const deleteButton = document.createElement('button');
      deleteButton.innerText = "Delete";
      deleteButton.addEventListener('click', () => {
        deleteMonster(monster)
      });
    monsterDiv.append(name,age,description,updateDiv,updateButton,deleteButton);
  monsterContainer.append(monsterDiv)
};

function deleteMonster(monster) {
  let monsterDiv = monsterContainer.querySelector(`[data-id="${monster.id}"]`)
  fetch(`${URL_PREFIX}monsters/${monster.id}`, {
    method: "DELETE",
  })
  .then((resp) => {
    if (resp.status === 200) {
      monsterDiv.remove()
    }
  })
};

/////////////////////////// FORM

function renderMonsterForm(name="name...", age="age...", description="description...", targetContainer=monsterFormContainer, id) {
  // debugger
  const form = document.createElement("form");
  const inputName = document.createElement("input");
  inputName.id = "name";
  inputName.placeholder = name;
  const inputAge = document.createElement("input");
  inputAge.id = "age";
  inputAge.placeholder = age;
  const inputDescription = document.createElement("input");
  inputDescription.id = "description";
  inputDescription.placeholder = description;
  const buttonCreate = document.createElement("button");
  buttonCreate.innerText = "Create";
  form.append(inputName,inputAge,inputDescription,buttonCreate);
  targetContainer.append(form);
  
  if (targetContainer === monsterFormContainer) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      submitForm(inputName, inputAge, inputDescription, form);
    })
  } else {
    // debugger
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (inputName.value === ''){inputName.value = name}
      if (inputAge.value === ''){inputAge.value = age}
      if (inputDescription.value === ''){inputDescription.value = description}
      updateMonster(inputName.value, inputAge.value, inputDescription.value, form, id)
    })
  }
};

renderMonsterForm();

let toggler = 2;
function toggleUpdateMonster(name, age, description, container, id) {
  if (toggler > 0) {
    container.append(renderMonsterForm(name, age, description, container, id));
    toggler = -2;
  } else if (toggler === 0) {
    container.innerHTML = "";
    toggler = 2;
  } else {
    container.innerHTML = "";
    toggler = 2
  }
};

//////////////////////////// FETCH

function submitForm(inputName, inputAge, inputDescription, form){
  fetch(`${URL_PREFIX}monsters`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({
      name: inputName.value,
      age: inputAge.value,
      description: inputDescription.value
    })
  })
  .then(r => r.json())
  .then(() => {
    setLastPage()
    pageNumber = lastPage
    loadPage(pageNumber)
  })
  form.reset()
};

function updateMonster(inputName, inputAge, inputDescription, form, id) {
  fetch(`${URL_PREFIX}monsters/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({
      name: inputName,
      age: inputAge,
      description: inputDescription
    })
  })
  .then(r => r.json())
  .then(() => {
    setLastPage()
    pageNumber = (setLastPage(id)) // why do i need -1 here ?
    loadPage(pageNumber)
  })
  form.reset()
};

////////////////////////////// NAVIGATION

firstPageButton.addEventListener('click', () => {
  pageNumber = 1
  loadPage(pageNumber)
});
backButton.addEventListener('click', () => {
  if (pageNumber >= 2) {
    pageNumber--
    loadPage(pageNumber)
  }
});
showPageNumber.addEventListener('click', () => {
  loadPage(pageNumber)
});
function renderShowPageNumber(){
  showPageNumber.innerText = pageNumber
};
forwardButton.addEventListener('click', () => {
  pageNumber++
  loadPage(pageNumber)
});
lastPageButton.addEventListener('click', () => {
  setLastPage()
  pageNumber = lastPage
  loadPage(pageNumber)
});

// const form = document.createElement("form");
// const inputNumber = document.createElement("input");
// inputNumber.id = "number";
// inputNumber.placeholder = pageNumber;
// const button = document.createElement("button");
// button.innerText = "Change Page";
// form.append(inputNumber,button);
// document.append(form);

function setLastPage(idOrTotal=totalNumberOfMonsters) {
  return lastPage = Math.ceil(idOrTotal / numberOfMonstersPerPage)
};

// -------------
//     NEXT
// -------------

// Update

// X Delete X

// X When user creates, show last page X

// X Make page navigation less wonky X

