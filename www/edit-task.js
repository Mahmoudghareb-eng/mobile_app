const params = new URLSearchParams(window.location.search);
const taskIdParam = params.get("id");

const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

if (taskIdParam !== null) {
    const taskId = Number(taskIdParam);

    const task = tasks.find(function (task) {
        return task.id === taskId;
    });

    if (task) {
        document.getElementById("title").value = task.title;
        document.getElementById("description").value =
            task.description || "";
        document.getElementById("due-date").value =
            task.dueDate || "";
        document.getElementById("status").value =
            task.completed ? "completed" : "active";
    } else {
        alert("Task not found!");
    }
}

const saveButton = document.getElementById("save-button");

saveButton.addEventListener("click", function () {
    const title = document.getElementById("title").value.trim();

    if (title === "") {
        alert("Please enter a task title.");
        return;
    }

    const taskData = {
        id: taskIdParam === null ? Date.now() : Number(taskIdParam),
        title: title,
        description: document.getElementById("description").value.trim(),
        dueDate: document.getElementById("due-date").value,
        completed: document.getElementById("status").value === "completed"
    };

    const taskIndex = tasks.findIndex(function (task) {
    return task.id === taskData.id;
});

if (taskIndex !== -1) {
    tasks[taskIndex].title = taskData.title;
    tasks[taskIndex].description = taskData.description;
    tasks[taskIndex].dueDate = taskData.dueDate;
    tasks[taskIndex].completed = taskData.completed;
} else {
    tasks.push(taskData);
}

localStorage.setItem("tasks", JSON.stringify(tasks));

window.location.href = "index.html";
});