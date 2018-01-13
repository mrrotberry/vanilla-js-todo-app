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

  if (taskContainer.querySelectorAll('.task-item__edit').length >= 1) {
    Array.from(taskContainer.querySelectorAll('.task-item__edit')).map((itemEdit) => {
      if (itemEdit !== thisItem) {
        itemEdit.querySelector('.icon-edit').classList.add('icon-pencil');
        itemEdit.querySelector('.icon-edit').classList.remove('icon-edit');

        const editingText = itemEdit.querySelector('.task-item-input').value;

        itemEdit.querySelector('.task-item-input').remove();

        itemEdit.childNodes[0].nodeValue = editingText;

        taskStorage[itemEdit.getAttribute('data-id')].text = editingText;
        localStorage.setItem('todo', JSON.stringify(taskStorage, null, ' '));

        itemEdit.querySelector('.task-item_btn__done').removeAttribute('hidden');
        itemEdit.querySelector('.task-item_btn__delete').removeAttribute('hidden');

        if (itemEdit.querySelector('.task-item_btn__edit').classList.contains('show')) {
          itemEdit.querySelector('.task-item_btn__edit').classList.remove('show');
        }

        itemEdit.classList.remove('task-item__edit');
      }
    });
  }

  const btnDone = thisItem.querySelector('.task-item_btn__done');
  const btnDelete = thisItem.querySelector('.task-item_btn__delete');

  const btnEditIcon = this.querySelector('.icon');
  if (btnEditIcon.classList.contains('icon-pencil')) {
    thisItem.classList.add('task-item__edit');

    btnEditIcon.classList.remove('icon-pencil');
    btnEditIcon.classList.add('icon-edit');

    this.classList.add('show');

    window.text = thisItem.childNodes[0].nodeValue.trim();
    thisItem.childNodes[0].nodeValue = '';

    const itemInput = document.createElement('input');
    itemInput.classList.add('task-item-input');
    itemInput.value = window.text;

    itemInput.addEventListener('input', () => {
      window.text = itemInput.value.trim();
    });

    itemInput.addEventListener('keypress', (event) => {
      if (event.keyCode === 13) {
        const event = new Event("click", {bubbles: true, cancelable: true});
        this.dispatchEvent(event);
      }
    });

    thisItem.insertBefore(itemInput, thisItem.firstChild);

    itemInput.focus();

    btnDone.setAttribute('hidden', 'hidden');

    btnDelete.setAttribute('hidden', 'hidden');

    for (let i = 0; i < taskContainer.querySelectorAll('.task-item').length; i++) {
      if (!taskContainer.querySelectorAll('.task-item')[i].classList.contains('task-item__edit')) {
        let notEditingItem = taskContainer.querySelectorAll('.task-item')[i];
        notEditingItem.querySelector('.task-item_btn__edit').classList.add('hide');
      }
    }
  } else {
    if (window.text !== '') {
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


      if (thisItem.querySelector('.task-item-input')) {
        thisItem.querySelector('.task-item-input').remove();
      }

      thisItem.childNodes[0].nodeValue = window.text;

      taskStorage[thisItem.getAttribute('data-id')].text = window.text;
      localStorage.setItem('todo', JSON.stringify(taskStorage, null, ' '));

      btnDone.removeAttribute('hidden');
      btnDelete.removeAttribute('hidden');

      for (let i = 0; i < taskContainer.querySelectorAll('.task-item').length; i++) {
        if (!taskContainer.querySelectorAll('.task-item')[i].classList.contains('task-item__edit')) {
          let notEditingItem = taskContainer.querySelectorAll('.task-item')[i];
          notEditingItem.querySelector('.task-item_btn__edit').classList.remove('hide');
        }
      }
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
