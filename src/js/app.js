const taskText = document.getElementById('task-text'),
  taskAddBtn = document.getElementById('task-add-btn'),
  taskError = document.getElementById('task-error'),
  taskContainer = document.getElementById('task-container');

const emptyItem = `
  <li class="task-item task-item__empty">Empty list :( . Create your first task</li>
`;

function renderItem(text) {
  return `
    ${text}
    <div class="task-item_btns">
      <button class="task-item_btn task-item_btn__done"><span class="glyphicon glyphicon-ok"></span></button>
      <button class="task-item_btn task-item_btn__edit"><span class="glyphicon glyphicon-pencil"></span></button>
      <button class="task-item_btn task-item_btn__delete"><span class="glyphicon glyphicon-remove"></span></button>
    </div>
  `;
}

checkEmptyList();

function checkEmptyList() {
  if (taskContainer.querySelectorAll('.task-item').length < 1) {
    taskContainer.innerHTML = emptyItem;
  }
}

function addTask() {
  if (taskText.value !== '') {
    taskError.classList.remove('show');

    const item = document.createElement('li');
    item.classList.add('task-item');
    item.setAttribute('data-id', '0');
    item.innerHTML = renderItem(taskText.value);

    /* functional done button */
    const btnDone = item.querySelector('.task-item_btn__done');
    btnDone.addEventListener('click', function () {
      const thisItem = this.parentNode.parentNode;
      thisItem.classList.toggle('task-item__done');

      const btnDoneIcon = this.querySelector('.glyphicon');
      const btnEdit = thisItem.querySelector('.task-item_btn__edit');
      if (btnDoneIcon.classList.contains('glyphicon-ok')) {
        btnDoneIcon.classList.remove('glyphicon-ok');
        btnDoneIcon.classList.add('glyphicon-check');

        btnEdit.setAttribute('hidden', 'hidden');
      } else {
        btnDoneIcon.classList.remove('glyphicon-check');
        btnDoneIcon.classList.add('glyphicon-ok');

        btnEdit.removeAttribute('hidden');
      }
    });

    /* functional edit button */
    const btnEdit = item.querySelector('.task-item_btn__edit');
    btnEdit.addEventListener('click', function () {
      const thisItem = this.parentNode.parentNode;

      thisItem.classList.toggle('task-item__edit');

      const btnDone = thisItem.querySelector('.task-item_btn__done');
      const btnDelete = thisItem.querySelector('.task-item_btn__delete');

      const btnEditIcon = this.querySelector('.glyphicon');
      if (btnEditIcon.classList.contains('glyphicon-pencil')) {
        btnEditIcon.classList.remove('glyphicon-pencil');
        btnEditIcon.classList.add('glyphicon-edit');

        window.text = thisItem.childNodes[0].nodeValue.trim();
        thisItem.childNodes[0].nodeValue = '';

        const itemInput = document.createElement('input');
        itemInput.classList.add('task-item-input');
        itemInput.value = text;

        itemInput.addEventListener('change', function () {
          text = itemInput.value;
        });

        itemInput.addEventListener('keypress', (event) => {
          if (event.keyCode === 13) {
            const event = new Event("click", {bubbles : true, cancelable : true})
            btnEdit.dispatchEvent(event);
          }
        });

        thisItem.insertBefore(itemInput, thisItem.firstChild);

        btnDone.setAttribute('hidden', 'hidden');

        btnDelete.setAttribute('hidden', 'hidden');
      } else {
        btnEditIcon.classList.remove('glyphicon-edit');
        btnEditIcon.classList.add('glyphicon-pencil');

        thisItem.querySelector('.task-item-input').remove();

        thisItem.childNodes[0].nodeValue = window.text;

        btnDone.removeAttribute('hidden');
        btnDelete.removeAttribute('hidden');
      }
    });

    const btnDelete = item.querySelector('.task-item_btn__delete');
    btnDelete.addEventListener('click', function () {
      item.remove();
      checkEmptyList();
    });

    taskContainer.appendChild(item);

    taskText.value = '';

    if (taskContainer.querySelector('.task-item__empty')) {
      taskContainer.querySelector('.task-item__empty').remove();
    }
  } else {
    taskError.classList.add('show');
  }
}

taskText.addEventListener('input', () => {
  if (taskError.classList.contains('show')) {
    taskError.classList.remove('show');
  }
});

taskText.addEventListener('keypress', (event) => {
  if (event.keyCode === 13) {
    const event = new Event("click", {bubbles : true, cancelable : true})
    taskAddBtn.dispatchEvent(event);
  }
});

taskAddBtn.addEventListener('click', addTask);
