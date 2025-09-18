import { contentDiv, projectsLi } from "..";
import listIcon from "../icons/list-icon.svg"
import editIcon from "../icons/edit-icon.svg"
import deleteIcon from "../icons/delete-icon.svg"

const itemViewModal = document.getElementById("item-view");
const itemEditModal = document.getElementById("item-edit");
const itemAddModal = document.getElementById("item-add");
const projectAddModal = document.getElementById("project-add");
const projectEditModal = document.getElementById("project-edit");
const viewCloseBtn = document.querySelectorAll("#close-btn");
const mainHeadingDiv = document.querySelector(".main-heading");

let activeModal = null;

viewCloseBtn.forEach((btn) => {
    btn.addEventListener("click", () => {
        hideModal();
    });
});

export function showItemView(item = null) {
    if (item === null) return;

    showModal(itemViewModal);

    const detailsDiv = activeModal.querySelector(".view-detail");
    detailsDiv.innerHTML = "";

    detailsDiv.innerHTML = `
        <div class="view-group">
            <h3>Title:</h3>
            <p>${item.title}</p>
        </div>
        <div class="view-group">
            <h3>Description:</h3>
            <p>${item.description}</p>
        </div>
        <div class="view-group">
            <h3>Due date:</h3>
            <p>${item.dueDate}</p>
        </div>
        <div class="view-group">
            <h3>Priority:</h3>
            <p>${item.priority}</p>
        </div>
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
    activeModal.classList.remove("hidden");
}

let onCloseCallbacks = [];

export function onModalClose(callback) {
    onCloseCallbacks.push(callback);
}

export function hideModal() {
    if (activeModal === null) return;
    activeModal.classList.add("hidden");
    activeModal = null;
    onCloseCallbacks.forEach(cb => cb());
}

function toggleElement(element, value = true) {
    if (value) {
        element.classList.add("hidden");
    }
    else {
        element.classList.remove("hidden");
    }
}

export function renderProjects(projects) {
    projectsLi.innerHTML = "";

    const allProjectsBtn = document.createElement("div");
    allProjectsBtn.innerHTML = `
        <div data-project-index="" id="project-btn">
            <img class="icon" src=${listIcon} alt="list-icon">
            <p>All</p>
        </div>
    `;
    projectsLi.appendChild(allProjectsBtn);

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
    contentDiv.scrollTop = 0;

    const reversedItems = todos.slice().reverse();
    reversedItems.forEach(({ item, projectIndex, itemIndex }) => {
        const todoDiv = document.createElement("div");
        todoDiv.classList.add("todo-item");
        if (item.completed) {
            todoDiv.classList.add("completed-item");
        }
        todoDiv.dataset.projectIndex = projectIndex;
        todoDiv.dataset.itemIndex = itemIndex;

        todoDiv.innerHTML = `
            <div class="priority-indicator priority-${item.priority.toLowerCase()}"></div>
            <div class="info-container">
                <input type="checkbox" name="item-checkbox" class="toggle-btn" id="item-${projectIndex}-${itemIndex}">
                <label for="item-${projectIndex}-${itemIndex}" class="item-title 
                ${item.completed ? "strike-through" : ""}">${item.title}</label>
                <p>Due by: ${item.dueDate}</p>
            </div>
            <div class="button-container">
                <img class="icon icon-btn view-btn" src=${listIcon} alt="view-icon">
                <img class="icon icon-btn edit-btn" src=${editIcon} alt="edit-icon">
                <img class="icon icon-btn delete-btn" src=${deleteIcon} alt="delete-icon">
        `;

        const checkBox = todoDiv.querySelector(".toggle-btn");
        checkBox.checked = item.completed;

        contentDiv.appendChild(todoDiv);
    });
}

export function renderHeading(projectName, displayAddBtn = false) {
    const heading = mainHeadingDiv.querySelector("h3");
    heading.textContent = projectName;

    const addBtn = mainHeadingDiv.querySelector("#add-item-btn");
    toggleElement(addBtn, !displayAddBtn);
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

let projectChangeEvent = null;
let previousSelection = null;

export function bindProjectEvents({ onProjectChange, onEdit, onDelete }) {
    projectChangeEvent = onProjectChange;

    projectsLi.addEventListener("click", (e) => {
        let projectIndex = null;
        const targetID = e.target.id;

        switch (targetID) {
            case "project-btn":
                projectIndex = e.target.dataset.projectIndex;
                selectProject(e.target, projectIndex);
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

function selectProject(target, projectIndex) {
    if (previousSelection) {
        previousSelection.classList.remove("selected-project");
    }
    target.classList.add("selected-project");
    previousSelection = target;

    if (projectChangeEvent) {
        projectChangeEvent(projectIndex);
    }
}

export function triggerProjectChange(projectIndex) {
    const btn = projectsLi.querySelector(
        `[data-project-index="${projectIndex}"][id="project-btn"]`
    );

    if (btn) {
        selectProject(btn, projectIndex);
    }
    else if (projectChangeEvent) {
        projectChangeEvent(projectIndex);
    }
}

export function bindTodoEvents({ onView, onDelete, onToggle, onEdit }) {
    contentDiv.addEventListener("click", (e) => {
        const clickedTodo = e.target.closest(".todo-item");
        if (!clickedTodo) return;
        const projectIndex = clickedTodo.dataset.projectIndex;
        const itemIndex = clickedTodo.dataset.itemIndex;
        const targetClasslist = e.target.classList;

        if (targetClasslist.contains("view-btn")) {
            onView(projectIndex, itemIndex);
        }
        else if (targetClasslist.contains("edit-btn")) {
            onEdit(projectIndex, itemIndex);
        }
        else if (targetClasslist.contains("delete-btn")) {
            onDelete(projectIndex, itemIndex);
        }
        else if (targetClasslist.contains("toggle-btn")) {
            onToggle(projectIndex, itemIndex);
        }
    });
}