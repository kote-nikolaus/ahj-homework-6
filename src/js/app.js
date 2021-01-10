/* eslint-disable no-use-before-define */

const addCardButtons = Array.from(document.getElementsByClassName('add-card-button'));
let currentTask;
let offsetX;
let offsetY;

function showTextarea(e) {
  e.preventDefault();
  const inputGroup = e.target.closest('.tasks').querySelector('.input-group');
  inputGroup.classList.add('active');
  e.target.classList.remove('active');

  const cancelButton = inputGroup.querySelector('.cancel-button');
  const addTaskButton = inputGroup.querySelector('.add-task-button');
  cancelButton.addEventListener('click', hideTextarea);
  addTaskButton.addEventListener('click', addTask);
}

function hideTextarea(e) {
  e.preventDefault();
  const addCardButton = e.target.closest('.tasks').querySelector('.add-card-button');
  addCardButton.classList.add('active');
  e.target.closest('.input-group').classList.remove('active');
}

for (let i = 0; i < addCardButtons.length; i += 1) {
  addCardButtons[i].onclick = showTextarea;
}

function dragTask(e) {
  e.preventDefault();
  currentTask = e.target.closest('.task');
  currentTask.classList.add('dragged');
  const coords = currentTask.getBoundingClientRect();
  offsetX = e.pageX - coords.x;
  offsetY = e.pageY - coords.y;
}

function placeTask(e) {
  e.preventDefault();

  let thisTask = document.elementFromPoint(e.clientX, e.clientY);
  let thisTasksList;

  if (!thisTask.classList.contains('task') && thisTask !== null) {
    thisTask = thisTask.querySelector('li');
  }

  if (thisTask === null) {
    thisTasksList = document.elementFromPoint(e.clientX, e.clientY);
    if (!thisTasksList.classList.contains('tasks-list')) {
      thisTasksList = thisTasksList.querySelector('.tasks-list');
    }
    thisTasksList.appendChild(currentTask);
  } else {
    thisTasksList = thisTask.closest('.tasks-list');
    const { top } = thisTask.getBoundingClientRect();
    if (e.pageY > window.scrollY + top + thisTask.offsetHeight / 2) {
      thisTasksList.insertBefore(currentTask, thisTask.nextElementSibling);
    } else {
      thisTasksList.insertBefore(currentTask, thisTask);
    }
  }

  currentTask.classList.remove('dragged');
  currentTask = null;
}

function startDragging(e) {
  e.preventDefault();
  if (!currentTask) return;

  currentTask.style.top = `${window.scrollY + e.pageY - offsetY}px`;
  currentTask.style.left = `${window.scrollX + e.pageX - offsetX}px`;
}

function endDragging(e) {
  e.preventDefault();
  if (!currentTask) return;

  placeTask(e);
}

function addTask(e) {
  e.preventDefault();
  const input = e.target.closest('.tasks').querySelector('.task-input');
  if (input.value.length > 0) {
    const tasksList = e.target.closest('.tasks').querySelector('.tasks-list');
    const task = document.createElement('li');
    task.className = 'task';
    task.innerHTML = `<div class='task-name'>${input.value}</div><button class='delete-task'>\u{00D7}</button>`;
    tasksList.appendChild(task);
    input.value = '';
    task.addEventListener('mousedown', dragTask);
    document.addEventListener('mousemove', startDragging);
    document.addEventListener('mouseup', endDragging);

    const deleteButton = task.querySelector('.delete-task');

    deleteButton.addEventListener('mousedown', () => {
      task.removeEventListener('mousedown', dragTask);
      const currentTasksList = task.closest('.tasks-list');
      currentTasksList.removeChild(task);
    });
  }
  hideTextarea(e);
}
