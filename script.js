// Obtener elementos del DOM
const newTaskInput = document.getElementById("new-task-input");
const addTaskButton = document.getElementById("add-task-button");
const taskList = document.getElementById("task-list");
const filters = document.querySelectorAll(".filter");

// Cargar tareas desde el localStorage
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Función para actualizar el almacenamiento local
function updateLocalStorage() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Función para renderizar las tareas
function renderTasks(filter = 'all') {
  taskList.innerHTML = '';
  
  // Filtrar tareas según el filtro seleccionado
  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
  });

  filteredTasks.forEach(task => {
    const taskItem = document.createElement("li");
    taskItem.classList.add("task");
    if (task.completed) taskItem.classList.add("completed");

    taskItem.innerHTML = `
      <span class="task-text">${task.text}</span>
      <div>
        <button class="toggle-btn">${task.completed ? "Desmarcar" : "Completar"}</button>
        <button class="delete-btn">Eliminar</button>
      </div>
    `;

    // Botón para marcar como completado
    taskItem.querySelector(".toggle-btn").addEventListener("click", () => toggleTaskCompletion(task.id));
    
    // Botón para eliminar tarea
    taskItem.querySelector(".delete-btn").addEventListener("click", () => deleteTask(task.id));
    
    taskList.appendChild(taskItem);
  });
}

// Función para agregar tarea
function addTask() {
  const taskText = newTaskInput.value.trim();
  if (!taskText) return;

  const newTask = {
    id: Date.now(),
    text: taskText,
    completed: false,
  };

  tasks.push(newTask);
  newTaskInput.value = ''; // Limpiar input
  updateLocalStorage();
  renderTasks();
}

// Función para cambiar el estado de completado de la tarea
function toggleTaskCompletion(taskId) {
  tasks = tasks.map(task =>
    task.id === taskId ? { ...task, completed: !task.completed } : task
  );
  updateLocalStorage();
  renderTasks();
}

// Función para eliminar tarea
function deleteTask(taskId) {
  tasks = tasks.filter(task => task.id !== taskId);
  updateLocalStorage();
  renderTasks();
}

// Agregar tarea al presionar el botón o la tecla Enter
addTaskButton.addEventListener("click", addTask);
newTaskInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") addTask();
});

// Filtros de tareas
filters.forEach(filterBtn => {
  filterBtn.addEventListener("click", () => {
    renderTasks(filterBtn.dataset.filter);
  });
});

// Inicializar la aplicación
renderTasks();
