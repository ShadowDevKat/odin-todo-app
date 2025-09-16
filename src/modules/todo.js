export const levels = {
    LOW: "Low",
    MEDIUM: "Medium",
    HIGH: "High"
};

// Sanitizer that strips all HTML tags
function sanitize(input) {
    if (typeof input !== "string") return input;
    return input.replace(/<\/?[^>]+(>|$)/g, "");
}

class TodoItem {
    constructor(title, description, dueDate, priority) {
        this.title = sanitize(title);
        this.description = sanitize(description);
        this.dueDate = dueDate;
        this.priority = priority;
        this.completed = false;
    }

    toggleComplete() {
        this.completed = !this.completed;
    }

    update(title, description, dueDate, priority) {
        this.title = sanitize(title);
        this.description = sanitize(description);
        this.dueDate = dueDate;
        this.priority = priority;
    }
}

class TodoList {
    constructor(name) {
        this.listName = sanitize(name);
        this.items = [];
    }

    addItem({ title, description, dueDate, priority}) {
        this.items.push(new TodoItem(title, description, dueDate, priority));
    }

    addItem(title, description = "", dueDate = null, priority = levels.LOW) {
        this.items.push(new TodoItem(title, description, dueDate, priority));
    }

    editItem(index, { title, description, dueDate, priority}) {
        const item = this.getItem(index);
        if(!item) return;
        item.update(title, description, dueDate, priority);
    }

    removeItem(index) {
        this.items.splice(index, 1);
    }

    editList(name) {
        this.listName = sanitize(name);
    }

    getItem(index) {
        return this.items[index] || null;
    }

    getAll() {
        return this.items;
    }
}

export class ProjectManager {
    constructor() {
        this.projects = [];
        this.addProject("Home");
    }

    addProject(name) {
        this.projects.push(new TodoList(name));
    }

    removeProject(projectIndex) {
        this.projects.splice(projectIndex, 1);
    }

    getProject(projectIndex) {
        return this.projects[projectIndex] || null;
    }

    getAllProjects() {
        return this.projects;
    }

    getProjectItem(projectIndex, itemIndex) {
        return this.projects[projectIndex].getItem(itemIndex);
    }

    getItemsFromProject(projectIndex) {
        const project = this.getProject(projectIndex);
        if (!project) return [];
        return project.getAll().map((item, itemIndex) => ({
            item,
            projectIndex,
            itemIndex,
        }));
    }

    getAllItems() {
        return this.projects.flatMap((list, projectIndex) =>
            list.getAll().map((item, itemIndex) => ({
                item,
                projectIndex,
                itemIndex,
            }))
        );
    }

    save() {
        localStorage.setItem("todoData", JSON.stringify(this.projects));
    }

    load() {
        const data = JSON.parse(localStorage.getItem("todoData"));
        if (!data) return;

        this.projects = data.map((proj) => {
            const list = new TodoList(proj.listName);
            list.items = proj.items.map(
                (item) =>
                    new TodoItem(
                        item.title,
                        item.description,
                        item.dueDate,
                        item.priority
                    )
            );
            list.items.forEach((item, index) => (item.completed = proj.items[index].completed));
            return list;
        });
    }

    isStorageEmpty() {
        const data = JSON.parse(localStorage.getItem("todoData"));
        if (!data) return true;
        return false;
    }

    clearStorage() {
        localStorage.clear();
        this.projects = [];
        this.addProject("Home");
    }
}