import { contentDiv, projectsLi } from "..";

const itemViewModal = document.getElementById("item-view");
const itemEditModal = document.getElementById("item-edit");
const itemAddModal = document.getElementById("item-add");
const projectAddModal = document.getElementById("project-add");
const viewCloseBtn = document.querySelectorAll(".close");

let activeModal = null;

viewCloseBtn.forEach((btn) => {
    btn.addEventListener("click", () => {
        activeModal.style.display = "none";
        activeModal = null;
    });
});

window.onclick = function (event) {
    if (event.target == activeModal) {
        activeModal.style.display = "none";
        activeModal = null;
    }
}

export function showItemView(item = null) {
    activeModal = itemViewModal;
    showModal(activeModal);

    if (item === null) return;

    const detailsDiv = activeModal.querySelector(".modal-detail");
    detailsDiv.innerHTML = "";

    detailsDiv.innerHTML = `
        <h2>Title: ${item.title}</h3>
        <p>Description: ${item.description}</p>
        <p>Due date: ${item.dueDate}</p>
        <p>Priority: ${item.priority}</p>
    `;
}
export function showItemEdit() {
    activeModal = itemEditModal;
    showModal(activeModal);
}
export function showItemAdd() {
    activeModal = itemAddModal;
    showModal(activeModal);
}
export function showProjectAdd() {
    activeModal = projectAddModal;
    showModal(activeModal);
}

function showModal(modal) {
    modal.style.display = "block";
}

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
            <button data-project-index="${projectIndex}" data-item-index="${itemIndex}" class="view-btn">View</button>
            <button data-project-index="${projectIndex}" data-item-index="${itemIndex}" class="delete-btn">Delete</button>
            <button data-project-index="${projectIndex}" data-item-index="${itemIndex}" class="toggle-btn">Toggle</button>
            <button data-project-index="${projectIndex}" data-item-index="${itemIndex}" class="edit-btn">Edit</button>
        `;

        contentDiv.appendChild(todoDiv);
    });
}


export function bindEvents({ onProjectChange, onView, onDelete, onToggle, onEdit }) {
    projectsLi.addEventListener("click", (e) => {
        const projectIndex = e.target.dataset.projectIndex;
        if (e.target.classList.contains("project-btn")) {
            onProjectChange(projectIndex);
        }
    });
    contentDiv.addEventListener("click", (e) => {
        const projectIndex = e.target.dataset.projectIndex;
        const itemIndex = e.target.dataset.itemIndex;
        if (e.target.classList.contains("view-btn")) {
            onView(projectIndex, itemIndex);
        }
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