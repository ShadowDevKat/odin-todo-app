import { contentDiv, projectsLi } from "..";

export function renderProjects(projects) {
    projectsLi.innerHTML = "";

    projects.forEach((project, index) => {
        const projectBtn = document.createElement("button");
        projectBtn.textContent = `${project.listName}`;
        projectBtn.dataset.projectIndex = `${index}`;
        projectBtn.classList.add("project-btn");
        projectsLi.appendChild(projectBtn);
    });
}

export function renderTodos(todos) {
    contentDiv.innerHTML = "";

    todos.forEach(({ item, projectIndex, itemIndex }) => {
        const todoDiv = document.createElement("div");
        todoDiv.classList.add("todo-item");

        todoDiv.innerHTML = `
            <h3>${item.title}</h3>
            <p>${item.description}</p>
            <p>Due: ${item.dueDate || "No date"}</p>
            <p>Priority: ${item.priority}</p>
            <p>Completed: ${item.completed ? "Yes" : "No"}</p>
            <p>Project: ${projectIndex}</p>
            <button data-project-index="${projectIndex}" data-item-index="${itemIndex}" class="delete-btn">Delete</button>
            <button data-project-index="${projectIndex}" data-item-index="${itemIndex}" class="toggle-btn">Toggle</button>
            <button data-project-index="${projectIndex}" data-item-index="${itemIndex}" class="edit-btn">Edit</button>
        `;

        contentDiv.appendChild(todoDiv);
    });
}


export function bindEvents({ onProjectChange, onDelete, onToggle, onEdit }) {
    projectsLi.addEventListener("click", (e) => {
        const projectIndex = e.target.dataset.projectIndex;
        if (e.target.classList.contains("project-btn")) {
            onProjectChange(projectIndex);
        }
    });
    contentDiv.addEventListener("click", (e) => {
        const projectIndex = e.target.dataset.projectIndex;
        const itemIndex = e.target.dataset.itemIndex;
        if (e.target.classList.contains("delete-btn")) {
            onDelete(projectIndex, itemIndex);
        }
        if (e.target.classList.contains("toggle-btn")) {
            onToggle(projectIndex, itemIndex);
        }
        if (e.target.classList.contains("edit-btn")) {
            onEdit(projectIndex, itemIndex);
        }
    });
}