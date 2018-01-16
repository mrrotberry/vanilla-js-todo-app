const taskText = document.getElementById('task-text'),
  taskAddBtn = document.getElementById('task-add-btn'),
  taskContainer = document.getElementById('task-container');

let taskStorage;
let taskID;

if (localStorage.getItem('todo')) {
  taskStorage = JSON.parse(localStorage.getItem('todo'));

  (function () {
    const taskIDs = [];
    for (let id in taskStorage) {
      taskIDs.push(id);
    }
    if (taskIDs.length === 0) {
      return taskID = 0;
    } else {
      taskID = Math.max.apply(null, taskIDs) + 1;
      return taskID;
    }
  })();

  for (let key in taskStorage) {
    const item = document.createElement('li');
    item.classList.add('task-item');
    item.setAttribute('data-id', '' + key);
    item.innerHTML = renderItem(taskStorage[key].text);

    const btnDone = item.querySelector('.task-item_btn__done');
    btnDone.addEventListener('click', actDone);

    const btnEdit = item.querySelector('.task-item_btn__edit');
    btnEdit.addEventListener('click', actEdit);

    const btnDelete = item.querySelector('.task-item_btn__delete');
    btnDelete.addEventListener('click', actDelete);

    if (taskStorage[key].done === 'true') {
      const doneEvent = new Event("click", {bubbles: true, cancelable: true});
      btnDone.dispatchEvent(doneEvent);
    }

    taskContainer.appendChild(item);
  }
} else {
  taskStorage = {};
  taskID = 0;
}

const errorMessage = `
  <span class="task-error_text">You must write the task text</span>
`;

const emptyItem = `
  <li class="task-item task-item__empty">Empty list :( . Create your first task</li>
`;

function renderError(parent, side) {
  const taskInputWp = parent;
  const error = document.createElement('div');
  error.classList.add('task-error');
  if (side === 'top') {
    error.classList.add('task-error_top');
  } else if (side === 'left') {
    error.classList.add('task-error_left')
  }
  error.innerHTML = errorMessage;
  taskInputWp.appendChild(error);
}

function renderItem(text) {
  return `
    ${text}
    <div class="task-item_btns">
      <button class="task-item_btn task-item_btn__done"><span class="icon icon-ok"></span></button>
      <button class="task-item_btn task-item_btn__edit"><span class="icon icon-pencil"></span></button>
      <button class="task-item_btn task-item_btn__delete"><span class="icon icon-remove"></span></button>
    </div>
  `;
}

checkEmptyList();

function checkEmptyList() {
  if (taskContainer.querySelectorAll('.task-item').length < 1) {
    taskContainer.innerHTML = emptyItem;
  }
}

function actDone() {
  const thisItem = this.parentNode.parentNode;
  thisItem.classList.toggle('task-item__done');

  const btnDoneIcon = this.querySelector('.icon');
  const btnEdit = thisItem.querySelector('.task-item_btn__edit');
  if (btnDoneIcon.classList.contains('icon-ok')) {
    btnDoneIcon.classList.remove('icon-ok');
    btnDoneIcon.classList.add('icon-check');

    btnEdit.setAttribute('hidden', 'hidden');

    thisItem.setAttribute('data-done', 'true');

    taskStorage[thisItem.getAttribute('data-id')].done = "true";
    localStorage.setItem('todo', JSON.stringify(taskStorage, null, ' '));
  } else {
    btnDoneIcon.classList.remove('icon-check');
    btnDoneIcon.classList.add('icon-ok');

    btnEdit.removeAttribute('hidden');

    thisItem.setAttribute('data-done', 'false');

    taskStorage[thisItem.getAttribute('data-id')].done = "false";
    localStorage.setItem('todo', JSON.stringify(taskStorage, null, ' '));
  }
}

function actEdit() {
  const thisItem = this.parentNode.parentNode;

  const btnDone = thisItem.querySelector('.task-item_btn__done');
  const btnDelete = thisItem.querySelector('.task-item_btn__delete');

  const btnEditIcon = this.querySelector('.icon');
  if (btnEditIcon.classList.contains('icon-pencil')) {
    thisItem.classList.add('task-item__edit');

    btnEditIcon.classList.remove('icon-pencil');
    btnEditIcon.classList.add('icon-edit');

    this.classList.add('show');

    const itemInput = document.createElement('input');
    itemInput.classList.add('task-item-input');
    itemInput.value = thisItem.childNodes[0].nodeValue.trim();

    itemInput.addEventListener('keypress', (event) => {
      if (event.keyCode === 13) {
        const event = new Event("click", {bubbles: true, cancelable: true});
        this.dispatchEvent(event);
      }
    });

    thisItem.childNodes[0].nodeValue = '';
    thisItem.insertBefore(itemInput, thisItem.firstChild);

    itemInput.focus();

    btnDone.setAttribute('hidden', 'hidden');

    btnDelete.setAttribute('hidden', 'hidden');
  } else {
    if (thisItem.querySelector('.task-item-input').value.trim() !== '') {
      if (document.querySelector('.task-error_left')) {
        document.querySelector('.task-error_left').remove();
      }

      if (thisItem.querySelector('.task-item-input').classList.contains('error')) {
        thisItem.querySelector('.task-item-input').classList.remove('error');
      }

      thisItem.classList.remove('task-item__edit');

      btnEditIcon.classList.remove('icon-edit');
      btnEditIcon.classList.add('icon-pencil');

      this.classList.remove('show');

      const editText = thisItem.querySelector('.task-item-input').value.trim();

      if (thisItem.querySelector('.task-item-input')) {
        thisItem.querySelector('.task-item-input').remove();
      }

      thisItem.childNodes[0].nodeValue = editText;

      taskStorage[thisItem.getAttribute('data-id')].text = editText;
      localStorage.setItem('todo', JSON.stringify(taskStorage, null, ' '));

      btnDone.removeAttribute('hidden');
      btnDelete.removeAttribute('hidden');
    } else {
      thisItem.querySelector('.task-item-input').classList.add('error');
      if (!document.querySelector('.task-error_left')) {
        renderError(thisItem, 'left');
      }
    }
  }
}

function actDelete() {
  const thisItem = this.parentNode.parentNode;
  thisItem.remove();
  checkEmptyList();

  delete taskStorage[thisItem.getAttribute('data-id')];
  localStorage.setItem('todo', JSON.stringify(taskStorage, null, ' '));
}

function addTask() {
  if (taskText.value.trim() !== '') {
    if (taskText.classList.contains('error')) {
      taskText.classList.remove('error');
    }

    const item = document.createElement('li');
    item.classList.add('task-item');
    item.setAttribute('data-id', '' + taskID);
    item.setAttribute('data-done', 'false');
    item.innerHTML = renderItem(taskText.value);

    taskStorage[taskID] = {
      "text": taskText.value,
      "done": false
    };
    ++taskID;

    localStorage.setItem('todo', JSON.stringify(taskStorage, null, ' '));

    /* functional done button */
    const btnDone = item.querySelector('.task-item_btn__done');
    btnDone.addEventListener('click', actDone);

    /* functional edit button */
    const btnEdit = item.querySelector('.task-item_btn__edit');
    btnEdit.addEventListener('click', actEdit);

    /* functional delete button */
    const btnDelete = item.querySelector('.task-item_btn__delete');
    btnDelete.addEventListener('click', actDelete);

    taskContainer.appendChild(item);

    taskText.value = '';

    if (taskContainer.querySelector('.task-item__empty')) {
      taskContainer.querySelector('.task-item__empty').remove();
    }
  } else {
    if (!document.querySelector('.task-error_top')) {
      renderError(document.getElementById('task-input-wp'), 'top');
    }
    taskText.classList.add('error');
    taskText.focus();
  }
}

taskText.addEventListener('input', () => {
  if (taskText.classList.contains('error')) {
    taskText.classList.remove('error');
  }
  if (taskText.value.trim() !== '') {
    if (document.querySelector('.task-error_top')) {
      document.querySelector('.task-error_top').remove();
    }
  }
});

taskText.addEventListener('keypress', (event) => {
  if (event.keyCode === 13) {
    const event = new Event("click", {bubbles: true, cancelable: true});
    taskAddBtn.dispatchEvent(event);
  }
});

taskText.addEventListener('blur', () => {
  if (taskText.classList.contains('error')) {
    taskText.classList.remove('error');
  }
  if (document.querySelector('.task-error_top')) {
    document.querySelector('.task-error_top').remove();
  }
});

taskAddBtn.addEventListener('click', addTask);
