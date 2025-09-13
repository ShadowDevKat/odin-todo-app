import "./styles.css";
import { levels, ProjectManager } from "./modules/todo";
import { renderTodos, bindEvents, renderProjects } from "./modules/display";

export const contentDiv = document.querySelector("#main-container");
export const projectsLi = document.querySelector(".projects-list")
const addProjectBtn = document.querySelector("#add-project-btn");
const addItemBtn = document.querySelector("#add-item-btn");
const allBtn = document.querySelector("#all-btn");

// Create Project Manager
const projectManager = new ProjectManager();

// Create lists
projectManager.addTodoList("Home");

// test todos
projectManager.getList(0).add("Do laundry", "Wash and fold clothes");
projectManager.getList(1).add("Finish report", "Due tomorrow", "2025-09-15");
projectManager.getList(0).add("Do laundry", "Wash and fold clothes");
projectManager.getList(1).add("Finish report", "Due tomorrow", "2025-09-15");
projectManager.getList(0).add("Do laundry", "Wash and fold clothes");
projectManager.getList(1).add("Finish report", "Due tomorrow", "2025-09-15");

// Render
renderProjects(projectManager.getAllLists());
renderTodos(projectManager.getAllItems());

let currentProjectIndex = null;

bindEvents({
    onProjectChange: (projectIndex) => {
        currentProjectIndex = projectIndex;
        renderTodos(projectManager.getItemsFromProject(projectIndex));
    },
    onDelete: (projectIndex, itemIndex) => {
        projectManager.getList(projectIndex).remove(itemIndex);
        refreshDOM();
    },
    onToggle: (projectIndex, itemIndex) => {
        projectManager.getListItem(projectIndex, itemIndex).toggleComplete();
        refreshDOM();
    },
    onEdit: (projectIndex, itemIndex) => {
        const todo = projectManager.getListItem(projectIndex, itemIndex);

        if (!todo) return;

        const newTitle = prompt("Edit title:", todo.title);
        if (newTitle === null) return;

        const newDescription = prompt("Edit description:", todo.description) || "";
        const newDueDate = prompt("Edit due date:", todo.dueDate) || null;
        const newPriority = prompt("Edit priority (Low, Medium, High):", todo.priority) || todo.priority;

        todo.update(newTitle, newDescription, newDueDate, newPriority);
        refreshDOM();
    }
});

function refreshDOM() {
    renderProjects(projectManager.getAllLists());
    if (currentProjectIndex === null) {
        renderTodos(projectManager.getAllItems());
    }
    else {
        renderTodos(projectManager.getItemsFromProject(currentProjectIndex));
    }
}


allBtn.addEventListener("click", () => {
    renderTodos(projectManager.getAllItems());
    currentProjectIndex = null;
});

addProjectBtn.addEventListener("click", () => {
    const projectName = prompt("Enter project name:");
    if (!projectName) return;

    projectManager.addTodoList(projectName);
    refreshDOM();
});

addItemBtn.addEventListener("click", () => {
    if(currentProjectIndex === null) return;
    const title = prompt("Enter task title:");
    if (!title) return;

    const description = prompt("Enter task description:") || "";
    const dueDate = prompt("Enter due date:") || "";
    const priority = prompt("Enter priority:") || "";

    projectManager.getList(currentProjectIndex).add(title, description, dueDate, priority);
    refreshDOM();
});