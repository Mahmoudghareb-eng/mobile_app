const defaultTasks = [
    {
        id: 1,
        title: "Finish project report",
        description: "Complete the final report for the college project.",
        dueDate: "2026-10-30",
        completed: false
    },
    {
        id: 2,
        title: "Study JavaScript",
        description: "Practice arrays and objects.",
        dueDate: "2026-10-28",
        completed: true
    }
];

// Load saved tasks, or use default tasks the first time
let tasks = JSON.parse(localStorage.getItem("tasks"));

if (tasks === null) {
    tasks = defaultTasks;
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Save tasks to localStorage
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

const taskList = document.getElementById("task-list");
const searchInput = document.getElementById("search-input");
const filterButtons = document.querySelectorAll(".filter");

let currentFilter = "all";

// Render tasks on the page
function renderTasks(tasksToRender = tasks) {
    taskList.innerHTML = "";

    tasksToRender.forEach(function (task) {
        const taskCard = document.createElement("article");

        taskCard.className = task.completed
            ? "task-card completed"
            : "task-card";

        const status = task.completed ? "Completed" : "Active";

        const statusClass = task.completed
            ? "completed-status"
            : "active-status";

        taskCard.innerHTML = `
            <input
                type="checkbox"
                class="task-checkbox"
                aria-label="Complete task"
                ${task.completed ? "checked" : ""}
            >

            <div class="task-content">
                <h3></h3>
                <p></p>

                <div class="task-meta">
                    <span>▦ ${task.dueDate || "No due date"}</span>
                    <span class="status ${statusClass}">${status}</span>
                </div>
            </div>

            <div class="task-actions">
                <a
                    href="edit-task.html?id=${task.id}"
                    class="edit-button"
                    aria-label="Edit task"
                >✎</a>

                <button
                    class="delete-button"
                    aria-label="Delete task"
                    data-id="${task.id}"
                >×</button>
            </div>
        `;

        // Add task text safely
        taskCard.querySelector("h3").textContent = task.title;
        taskCard.querySelector(".task-content p").textContent =
            task.description;

        // Change task status
        const checkbox = taskCard.querySelector(".task-checkbox");

        checkbox.addEventListener("change", function () {
            task.completed = checkbox.checked;

            saveTasks();

            searchByTitle(searchInput.value);
        });

        // Delete task
        const deleteButton = taskCard.querySelector(".delete-button");

        deleteButton.addEventListener("click", function () {
            const taskIndex = tasks.findIndex(function (item) {
                return item.id === task.id;
            });

            if (taskIndex !== -1) {
                tasks.splice(taskIndex, 1);
                saveTasks();
            }

            searchByTitle(searchInput.value);
        });

        taskList.appendChild(taskCard);
    });
}

// Search by title and apply current filter
function searchByTitle(title) {
    const filteredTasks = tasks.filter(function (task) {
        const matchesTitle = task.title
            .toLowerCase()
            .includes(title.trim().toLowerCase());

        const matchesFilter =
            currentFilter === "all" ||
            (currentFilter === "active" && !task.completed) ||
            (currentFilter === "completed" && task.completed);

        return matchesTitle && matchesFilter;
    });

    renderTasks(filteredTasks);
}

// Filter buttons
filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        filterButtons.forEach(function (btn) {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        currentFilter = button.dataset.filter;

        searchByTitle(searchInput.value);
    });
});

// Search input
searchInput.addEventListener("input", function () {
    searchByTitle(searchInput.value);
});

// Initial display
renderTasks();
