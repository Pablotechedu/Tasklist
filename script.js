class ListNode {
  constructor(value) {
    this.value = value;
    this.next = null;
    this.prev = null;
  }
}

class DoublyLinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
  }

  append(value) {
    const newNode = new ListNode(value);
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      this.tail.next = newNode;
      newNode.prev = this.tail;
      this.tail = newNode;
    }
  }

  remove(node) {
    if (node.prev) {
      node.prev.next = node.next;
    } else {
      this.head = node.next;
    }
    if (node.next) {
      node.next.prev = node.prev;
    } else {
      this.tail = node.prev;
    }
  }

  toArray() {
    const tasks = [];
    let current = this.head;
    while (current) {
      tasks.push(current.value);
      current = current.next;
    }
    return tasks;
  }
}

const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");

const taskListDoublyLinkedList = new DoublyLinkedList();

document.addEventListener("DOMContentLoaded", loadTasks);

addTaskBtn.addEventListener("click", function () {
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

  taskListDoublyLinkedList.append({
    text: taskText,
    completed: false,
    node: li,
  });

  const checkbox = li.querySelector("input[type='checkbox']");
  checkbox.addEventListener("change", function () {
    li.classList.toggle("completed");
    const task = taskListDoublyLinkedList.head;
    while (task) {
      if (task.value.node === li) {
        task.value.completed = checkbox.checked;
        break;
      }
      task = task.next;
    }
    saveTasks();
  });

  const deleteBtn = li.querySelector(".delete-btn");
  deleteBtn.addEventListener("click", function () {
    li.remove();
    const task = taskListDoublyLinkedList.head;
    while (task) {
      if (task.value.node === li) {
        taskListDoublyLinkedList.remove(task);
        break;
      }
      task = task.next;
    }
    saveTasks();
  });
}

function saveTasks() {
  const tasks = taskListDoublyLinkedList.toArray().map((task) => ({
    text: task.text,
    completed: task.completed,
  }));
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach((task) => {
    addTask(task.text);
    const li = taskList.lastElementChild;
    if (task.completed) {
      li.classList.add("completed");
      li.querySelector("input[type='checkbox']").checked = true;
    }
  });
}
