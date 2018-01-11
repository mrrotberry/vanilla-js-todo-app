const taskText = document.getElementById('task-text'),
  taskAddBtn = document.getElementById('task-add-btn'),
  taskError = document.getElementById('task-error'),
  taskContainer = document.getElementById('task-container');

const emptyItem = `
  <li class="task-item task-item__empty">Empty list :( . Create your first task</li>
`;

function renderItem(text) {
  const item = `
    <li class="task-item" data-id="0">
      ${text}
      <div class="task-item_btns">
        <button class="task-item_btn task-item_btn__done"><span class="glyphicon glyphicon-ok"></span></button>
        <button class="task-item_btn task-item_btn__edit"><span class="glyphicon glyphicon-pencil"></span></button>
        <button class="task-item_btn task-item_btn__delete"><span class="glyphicon glyphicon-remove"></span></button>
      </div>
    </li>
  `;
  return item;
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

    taskContainer.innerHTML += renderItem(taskText.value);

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
