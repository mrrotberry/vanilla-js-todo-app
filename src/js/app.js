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
  if (taskText.value.trim() !== '') {
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

      if (taskContainer.querySelectorAll('.task-item__edit').length >= 1) {
        Array.from(taskContainer.querySelectorAll('.task-item__edit')).map((itemEdit)=> {
          if (itemEdit !== thisItem) {
            itemEdit.querySelector('.glyphicon').classList.remove('glyphicon-edit');
            itemEdit.querySelector('.glyphicon').classList.add('glyphicon-pencil');

            const editingText = itemEdit.querySelector('.task-item-input').value;

            itemEdit.querySelector('.task-item-input').remove();

            itemEdit.childNodes[0].nodeValue = editingText;

            itemEdit.querySelector('.task-item_btn__done').removeAttribute('hidden');
            itemEdit.querySelector('.task-item_btn__delete').removeAttribute('hidden');

            itemEdit.classList.remove('task-item__edit');
          }
        });
      }

      const btnDone = thisItem.querySelector('.task-item_btn__done');
      const btnDelete = thisItem.querySelector('.task-item_btn__delete');

      const btnEditIcon = this.querySelector('.glyphicon');
      if (btnEditIcon.classList.contains('glyphicon-pencil')) {
        thisItem.classList.add('task-item__edit');

        btnEditIcon.classList.remove('glyphicon-pencil');
        btnEditIcon.classList.add('glyphicon-edit');

        window.text = thisItem.childNodes[0].nodeValue.trim();
        thisItem.childNodes[0].nodeValue = '';

        const itemInput = document.createElement('input');
        itemInput.classList.add('task-item-input');
        itemInput.value = window.text;

        itemInput.addEventListener('change', function () {
          window.text = itemInput.value;
        });

        itemInput.addEventListener('keypress', (event) => {
          if (event.keyCode === 13) {
            const event = new Event("click", {bubbles : true, cancelable : true});
            btnEdit.dispatchEvent(event);
          }
        });

        thisItem.insertBefore(itemInput, thisItem.firstChild);

        itemInput.focus();

        btnDone.setAttribute('hidden', 'hidden');

        btnDelete.setAttribute('hidden', 'hidden');
      } else {
        thisItem.classList.remove('task-item__edit');

        btnEditIcon.classList.remove('glyphicon-edit');
        btnEditIcon.classList.add('glyphicon-pencil');

        if (thisItem.querySelector('.task-item-input')){
          thisItem.querySelector('.task-item-input').remove();
        }

        thisItem.childNodes[0].nodeValue = window.text;

        btnDone.removeAttribute('hidden');
        btnDelete.removeAttribute('hidden');
      }
    });

    /* functional delete button */
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
  if (taskText.value.trim() !== '') {
    taskError.classList.remove('show');
  }
});

taskText.addEventListener('keypress', (event) => {
  if (event.keyCode === 13) {
    const event = new Event("click", {bubbles : true, cancelable : true});
    taskAddBtn.dispatchEvent(event);
  }
});

taskAddBtn.addEventListener('click', addTask);
