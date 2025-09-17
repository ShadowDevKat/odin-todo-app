import "./styles.css";
import { format, parse, parseISO } from "date-fns";
import { levels, ProjectManager } from "./modules/todo";
import {
    renderTodos,
    onModalClose,
    refreshDOM,
    showItemView,
    showItemEdit,
    showProjectAdd,
    showItemAdd,
    hideModal,
    bindProjectEvents,
    bindTodoEvents,
    showProjectEdit,
    triggerProjectChange
} from "./modules/display";

export const contentDiv = document.querySelector("#main-container");
export const projectsLi = document.querySelector(".projects-list")
const addProjectBtn = document.querySelector("#add-project-btn");
const addItemBtn = document.querySelector("#add-item-btn");

const addItemForm = document.querySelector("#add-item-form");
const addProjectForm = document.querySelector("#add-project-form");
const editItemForm = document.querySelector("#edit-item-form");
const editProjectForm = document.querySelector("#edit-project-form");

let currentProject = null;
let currentItem = null;

// Create Project Manager
const projectManager = new ProjectManager();
loadData();

// Bind events
onModalClose(() => {
    currentItem = null;
});

bindProjectEvents({
    onProjectChange: (projectIndex) => {
        if (!projectIndex) {
            currentProject = null;
            renderTodos(projectManager.getAllItems());
        }
        else {
            currentProject = projectIndex;
            renderTodos(projectManager.getItemsFromProject(projectIndex));
        }
    },
    onEdit: (projectIndex) => {
        currentProject = projectIndex;
        const currentTitle = projectManager.getProject(currentProject).listName;
        const formInput = editProjectForm.querySelector("#title");
        formInput.value = currentTitle;
        showProjectEdit();
    },
    onDelete: (projectIndex) => {
        projectManager.removeProject(projectIndex);
        projectManager.save();
        currentProject = null;
        refreshDOM(projectManager, currentProject);
    }
});

bindTodoEvents({
    onView: (projectIndex, itemIndex) => {
        showItemView(projectManager.getProjectItem(projectIndex, itemIndex));
    },
    onDelete: (projectIndex, itemIndex) => {
        projectManager.getProject(projectIndex).removeItem(itemIndex);
        projectManager.save();
        refreshDOM(projectManager, currentProject);
    },
    onToggle: (projectIndex, itemIndex) => {
        projectManager.getProjectItem(projectIndex, itemIndex).toggleComplete();
        // console.log(projectManager.getProjectItem(projectIndex, itemIndex));
        projectManager.save();
        refreshDOM(projectManager, currentProject);
    },
    onEdit: (projectIndex, itemIndex) => {
        const todo = projectManager.getProjectItem(projectIndex, itemIndex);
        if (!todo) return;
        currentItem = { projectIndex, itemIndex };
        setItemFormData(editItemForm, todo);
        showItemEdit();
    }
});

addProjectBtn.addEventListener("click", () => {
    addProjectForm.reset();
    showProjectAdd();
});

addItemBtn.addEventListener("click", () => {
    if (currentProject === null) return;
    addItemForm.reset();
    showItemAdd();
});

addItemForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const { title, description, dueDate, priority } = getItemFormData(addItemForm);
    projectManager.getProject(currentProject).addItem(title, description, dueDate, priority);
    projectManager.save();

    addItemForm.reset();
    hideModal();
    refreshDOM(projectManager, currentProject);
});

editItemForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!currentItem) return;

    const { title, description, dueDate, priority } = getItemFormData(editItemForm);

    projectManager
        .getProject(currentItem.projectIndex)
        .editItem(currentItem.itemIndex, {
            title,
            description,
            dueDate,
            priority
        });
    projectManager.save();

    editItemForm.reset();
    hideModal();
    refreshDOM(projectManager, currentProject);
});

addProjectForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(addProjectForm);
    const title = formData.get("title");
    projectManager.addProject(title);
    projectManager.save();

    addProjectForm.reset();
    hideModal();
    refreshDOM(projectManager, currentProject);
});

editProjectForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!currentProject) return;

    const formData = new FormData(editProjectForm);
    const title = formData.get("title");

    projectManager.getProject(currentProject).editList(title);
    projectManager.save();

    editProjectForm.reset();
    hideModal();
    refreshDOM(projectManager, currentProject);
});

document.addEventListener("keydown", (e) => {
    if (e.key === 'Escape') {
        e.preventDefault();
        hideModal();
    }
});

// Initial Render
refreshDOM(projectManager, currentProject);
triggerProjectChange("");

function formatDateToDMY(rawDate) {
    if (!rawDate) return null;
    const dateObj = parseISO(rawDate);
    return format(dateObj, "dd-MM-yyyy");
}

function formatDateToYMD(rawDate) {
    if (!rawDate) return null;
    const dateObj = parse(rawDate, "dd-MM-yyyy", new Date());
    return format(dateObj, "yyyy-MM-dd");
}

function getItemFormData(form) {
    const formData = new FormData(form);
    return {
        title: formData.get("title"),
        description: formData.get("description"),
        dueDate: formatDateToDMY(formData.get("duedate")),
        priority: formData.get("priority")
    };
}

function setItemFormData(form, todo) {
    if (!form || !todo) return;

    const fields = {
        title: todo.title,
        description: todo.description,
        priority: todo.priority,
        duedate: formatDateToYMD(todo.dueDate)
    };

    for (const [key, value] of Object.entries(fields)) {
        const field = form.querySelector(`[name="${key}"]`);
        if (field) field.value = value;
    }
}

function loadData() {
    if (projectManager.isStorageEmpty()) {
        loadDummyData();
        projectManager.save();
    }
    else {
        projectManager.load();
    }
}

function loadDummyData() {
    projectManager.addProject("Work");
    projectManager.getProject(0).addItem("Finish report", "Due tomorrow", "15-09-2025", levels.HIGH);
    projectManager.getProject(0).addItem("Buy groceries", "Milk, eggs, bread", "17-09-2025", levels.LOW);
    projectManager.getProject(0).addItem("Gym workout", "Leg day", "18-09-2025", levels.MEDIUM);
    projectManager.getProject(0).addItem("Read book", "Finish 50 pages of current novel", "20-09-2025", levels.LOW);
    projectManager.getProject(0).addItem("Doctor appointment", "Annual checkup", "22-09-2025", levels.HIGH);
    projectManager.getProject(0).addItem("Team meeting", "Project status update", "19-09-2025", levels.MEDIUM);
    projectManager.getProject(0).addItem("Call parents", "Weekly catch-up call", "16-09-2025", levels.LOW);
    projectManager.getProject(0).addItem("Submit assignment", "Math homework", "21-09-2025", levels.HIGH);
    projectManager.getProject(0).addItem("Plan trip", "Book hotel for weekend getaway", "25-09-2025", levels.MEDIUM);
    projectManager.getProject(0).addItem("Clean house", "Vacuum and dust living room", "23-09-2025", levels.LOW);

    projectManager.getProject(1).addItem("Pay bills", "Electricity and internet", "24-09-2025", levels.HIGH);
    projectManager.getProject(1).addItem("Laundry", "Wash and fold clothes", "16-09-2025", levels.MEDIUM);
    projectManager.getProject(1).addItem("Prepare presentation", "Slides for client meeting", "19-09-2025", levels.HIGH);
    projectManager.getProject(1).addItem("Cook dinner", "Try new pasta recipe", "17-09-2025", levels.LOW);
    projectManager.getProject(1).addItem("Write blog post", "Topic: Web development trends", "26-09-2025", levels.MEDIUM);
    projectManager.getProject(1).addItem("Car maintenance", "Oil change and tire check", "27-09-2025", levels.HIGH);
    projectManager.getProject(1).addItem("Meditation", "15 minutes mindfulness", "18-09-2025", levels.LOW);
    projectManager.getProject(1).addItem("Send emails", "Reply to pending work emails", "20-09-2025", levels.MEDIUM);
    projectManager.getProject(1).addItem("Project deadline", "Submit final draft", "28-09-2025", levels.HIGH);
    projectManager.getProject(1).addItem("Buy gift", "For friend's birthday", "29-09-2025", levels.LOW);
}


// Storage test
window.clearData = clearData;

function clearData() {
    projectManager.clearStorage();
    loadData();
    refreshDOM(projectManager, currentProject);
}