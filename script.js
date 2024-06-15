document.addEventListener("DOMContentLoaded", function() {
    const taskInput = document.getElementById("taskInput");
    const addTaskBtn = document.getElementById("addTaskBtn");
    const taskList = document.getElementById("taskList");

    // Cargar tareas desde el almacenamiento local al cargar la página
    loadTasks();

    addTaskBtn.addEventListener("click", function() {
        const taskText = taskInput.value.trim();
        if (taskText !== "") {
            addTask(taskText);
            saveTasks();
            taskInput.value = "";
        }
    });

    function addTask(taskText) {
        const li = document.createElement("li");
        li.classList.add("task-item");
        li.innerHTML = `
           <span>${taskText}</span>
           <input type="checkbox">
           <button class="delete-btn">🗑</button>
        `;
        taskList.appendChild(li);

        // Agregar evento para marcar como completada
        const checkbox = li.querySelector("input[type='checkbox']");
        checkbox.addEventListener("change", function() {
            li.classList.toggle("completed");
            saveTasks();
        });

        // Agregar evento para eliminar tarea
        const deleteBtn = li.querySelector(".delete-btn");
        deleteBtn.addEventListener("click", function() {
            li.remove();
            saveTasks();
        });
    }

    function saveTasks() {
        const tasks = [];
        taskList.querySelectorAll(".task-item").forEach(function(taskItem) {
            const taskText = taskItem.querySelector("span").textContent;
            const isCompleted = taskItem.classList.contains("completed");
            tasks.push({ text: taskText, completed: isCompleted });
        });
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        tasks.forEach(function(task) {
            addTask(task.text);
            const li = taskList.lastElementChild;
            if (task.completed) {
                li.classList.add("completed");
                li.querySelector("input[type='checkbox']").checked = true;
            }
        });
    }
});
