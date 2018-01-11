const taskText = document.getElementById('task-text'),
  taskAddBtn = document.getElementById('task-add-btn'),
  taskError = document.getElementById('task-error'),
  taskContainer = document.getElementById('task-container');

const emptyItem = `
  <li class="task-item task-item__empty">Empty list :( . Create your first task</li>
`;

checkEmptyList();

function checkEmptyList() {
  console.log(taskContainer.childNodes);
  if (!taskContainer.childNodes.length) {
    taskContainer.innerHTML = emptyItem;
  }
}

function addTask() {
  if (taskText.value !== '') {
    taskError.classList.remove('show');
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
