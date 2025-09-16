import { contentDiv, projectsLi } from "..";
import listIcon from "../icons/list-icon.svg"
import editIcon from "../icons/edit-icon.svg"
import deleteIcon from "../icons/delete-icon.svg"

const itemViewModal = document.getElementById("item-view");
const itemEditModal = document.getElementById("item-edit");
const itemAddModal = document.getElementById("item-add");
const projectAddModal = document.getElementById("project-add");
const projectEditModal = document.getElementById("project-edit");
const viewCloseBtn = document.querySelectorAll(".close-btn");

let activeModal = null;

viewCloseBtn.forEach((btn) => {
    btn.addEventListener("click", () => {
        hideModal();
    });
});

export function showItemView(item = null) {
    if (item === null) return;

    showModal(itemViewModal);

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
    showModal(itemEditModal);
}
export function showItemAdd() {
    showModal(itemAddModal);
}
export function showProjectAdd() {
    showModal(projectAddModal);
}
export function showProjectEdit() {
    showModal(projectEditModal);
}

function showModal(modal) {
    activeModal = modal;
    modal.style.display = "flex";
}

let onCloseCallbacks = [];

export function onModalClose(callback) {
    onCloseCallbacks.push(callback);
}

export function hideModal() {
    if (activeModal === null) return;
    activeModal.style.display = "none";
    activeModal = null;
    onCloseCallbacks.forEach(cb => cb());
}

export function renderProjects(projects) {
    projectsLi.innerHTML = "";

    projects.forEach((project, index) => {
        const projectBtn = document.createElement("div");
        projectBtn.innerHTML = `
            <div data-project-index=${index} id="project-btn">
                <img class="icon" src=${listIcon} alt="list-icon">
                <p>${project.listName}</p>
                <img class="icon icon-btn" id="project-edit-btn" src=${editIcon} alt="edit-icon">
                <img class="icon icon-btn" id="project-delete-btn" src=${deleteIcon} alt="delete-icon">
            </div>
        `;
        projectsLi.appendChild(projectBtn);
    });
}

export function renderTodos(todos) {
    contentDiv.innerHTML = "";

    [...todos].reverse().forEach(({ item, projectIndex, itemIndex }) => {
        const todoDiv = document.createElement("div");
        todoDiv.classList.add("todo-item");

        todoDiv.innerHTML = `
            <div class="priority-indicator priority-${item.priority.toLowerCase()}"></div>
            <div class="info-container">
                <h3>${item.title}</h3>
                <p>${item.description}</p>
                <p>Due: ${item.dueDate || "No date"}</p>
                <p>Completed: ${item.completed ? "Yes" : "No"}</p>
            </div>
            <div class="button-container">
                <button data-project-index="${projectIndex}" data-item-index="${itemIndex}" class="btn full-btn" id="view-btn">View</button>
                <button data-project-index="${projectIndex}" data-item-index="${itemIndex}" class="btn full-btn" id="delete-btn">Delete</button>
                <button data-project-index="${projectIndex}" data-item-index="${itemIndex}" class="btn full-btn" id="toggle-btn">Toggle</button>
                <button data-project-index="${projectIndex}" data-item-index="${itemIndex}" class="btn full-btn" id="edit-btn">Edit</button>
            </div>
        `;

        contentDiv.appendChild(todoDiv);
    });
}

export function refreshDOM(projectManager, currentProject) {
    renderProjects(projectManager.getAllProjects());
    if (currentProject === null) {
        renderTodos(projectManager.getAllItems());
    }
    else {
        renderTodos(projectManager.getItemsFromProject(currentProject));
    }
}

export function bindProjectEvents({ onProjectChange, onEdit, onDelete }) {
    projectsLi.addEventListener("click", (e) => {
        // if (e.target.id !== "project-btn") return;
        let projectIndex = null;
        const targetID = e.target.id;

        switch (targetID) {
            case "project-btn":
                projectIndex = e.target.dataset.projectIndex;
                onProjectChange(projectIndex);
                break;
            case "project-edit-btn":
                projectIndex = e.target.parentElement.dataset.projectIndex;
                onEdit(projectIndex);
                break;
            case "project-delete-btn":
                projectIndex = e.target.parentElement.dataset.projectIndex;
                onDelete(projectIndex);
                break;
            default:
                break;
        }
    });
}

export function bindTodoEvents({ onView, onDelete, onToggle, onEdit }) {
    contentDiv.addEventListener("click", (e) => {
        const projectIndex = e.target.dataset.projectIndex;
        const itemIndex = e.target.dataset.itemIndex;
        const targetID = e.target.id;

        switch (targetID) {
            case "view-btn":
                onView(projectIndex, itemIndex);
                break;
            case "delete-btn":
                onDelete(projectIndex, itemIndex);
                break;
            case "toggle-btn":
                onToggle(projectIndex, itemIndex);
                break;
            case "edit-btn":
                onEdit(projectIndex, itemIndex);
                break;
            default:
                break;
        }
    });
}