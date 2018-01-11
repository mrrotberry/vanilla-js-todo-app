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
  if (!taskContainer.childNodes.length) {
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

    const btnDone = item.querySelector('.task-item_btn__done');
    btnDone.addEventListener('click', function () {
      this.parentNode.parentNode.classList.toggle('task-item__done');

      const btnDoneIcon = this.querySelector('.glyphicon');
      if (btnDoneIcon.classList.contains('glyphicon-ok')) {
        btnDoneIcon.classList.remove('glyphicon-ok');
        btnDoneIcon.classList.add('glyphicon-check');
      } else {
        btnDoneIcon.classList.remove('glyphicon-check');
        btnDoneIcon.classList.add('glyphicon-ok');
      }
    });

    taskContainer.appendChild(item);

    taskText.value = '';
  } else {
    taskError.classList.add('show');
  }
}

taskText.addEventListener('input', () => {
  if (taskError.classList.contains('show')) {
    taskError.classList.remove('show');
  }
});

taskAddBtn.addEventListener('click', addTask);
