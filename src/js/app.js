const taskText = document.getElementById('task-text'),
  taskAddBtn = document.getElementById('task-add-btn'),
  taskError = document.getElementById('task-error'),
  tastContainer = document.getElementById('task-container');

function addTask () {
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
