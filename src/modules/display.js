import { contentDiv, projectsLi } from "..";

export function renderProjects(projects) {
    projectsLi.innerHTML = "";

    projects.forEach((project, index) => {
        const projectBtn = document.createElement("button");
        projectBtn.textContent = `${project.listName}`
        projectBtn.dataset.projectIndex = index;
        projectsLi.appendChild(projectBtn);
    });
}

export function renderTodos(todos) {
    contentDiv.innerHTML = "";

    todos.forEach((todo, index) => {
        const todoDiv = document.createElement("div");
        todoDiv.classList.add("todo-item");

        todoDiv.innerHTML = `
            <h3>${todo.title}</h3>
            <p>${todo.description}</p>
            <p>Due: ${todo.dueDate || "No date"}</p>
            <p>Priority: ${todo.priority}</p>
            <p>Completed: ${todo.completed ? "Yes" : "No"}</p>
            <button data-index="${index}" class="delete-btn">Delete</button>
            <button data-index="${index}" class="toggle-btn">Toggle</button>
            <button data-index="${index}" class="edit-btn">Edit</button>
        `;

        contentDiv.appendChild(todoDiv);
    });
}

export function bindEvents({ onDelete, onToggle, onEdit }) {
    contentDiv.addEventListener("click", (e) => {
        const index = e.target.dataset.index;
        if (e.target.classList.contains("delete-btn")) {
            onDelete(index);
        }
        if (e.target.classList.contains("toggle-btn")) {
            onToggle(index);
        }
        if (e.target.classList.contains("edit-btn")) {
            onEdit(index);
        }
    });
}
