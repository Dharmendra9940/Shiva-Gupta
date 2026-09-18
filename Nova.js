// Get HTML elements
const taskInput = document.getElementById("taskInput");
const addButton = document.getElementById("addButton");
const taskList = document.getElementById("taskList");

// Get tasks from Local Storage
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Display tasks when page loads
displayTasks();


// Add Task
addButton.addEventListener("click", addTask);


// Allow Enter key to add task
taskInput.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        addTask();
    }
});


function addTask() {

    const taskText = taskInput.value.trim();

    // Check empty task
    if (taskText === "") {
        alert("Please enter a task!");
        return;
    }

    // Create task object
    const task = {
        id: Date.now(),
        text: taskText,
        completed: false
    };

    // Add task to array
    tasks.push(task);

    // Save tasks
    saveTasks();

    // Display updated tasks
    displayTasks();

    // Clear input
    taskInput.value = "";
}


// Display Tasks
function displayTasks() {

    taskList.innerHTML = "";

    tasks.forEach(function(task) {

        const li = document.createElement("li");

        li.classList.add("task-item");

        // Add completed class
        if (task.completed) {
            li.classList.add("completed");
        }

        li.innerHTML = `
            <input 
                type="checkbox" 
                class="task-checkbox"
                ${task.completed ? "checked" : ""}
            >

            <span class="task-text">${task.text}</span>

            <button class="delete-button">
                Delete
            </button>
        `;


        // Complete / Uncomplete Task
        const checkbox = li.querySelector(".task-checkbox");

        checkbox.addEventListener("change", function() {

            task.completed = checkbox.checked;

            saveTasks();

            displayTasks();
        });


        // Delete Task
        const deleteButton = li.querySelector(".delete-button");

        deleteButton.addEventListener("click", function() {

            tasks = tasks.filter(function(item) {
                return item.id !== task.id;
            });

            saveTasks();

            displayTasks();
        });


        taskList.appendChild(li);
    });
}


// Save Tasks in Local Storage
function saveTasks() {

    localStorage.setItem("tasks", JSON.stringify(tasks));
}
