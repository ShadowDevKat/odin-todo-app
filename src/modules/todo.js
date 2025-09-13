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

    add(title, description = "", dueDate = null, priority = levels.LOW) {
        this.items.push(new TodoItem(title, description, dueDate, priority));
    }

    remove(index) {
        this.items.splice(index, 1);
    }

    editList(name) {
        this.listName = sanitize(name);
    }

    editItem(index, title, description = "", dueDate = null, priority = levels.LOW) {
        this.items[index].update(title, description, dueDate, priority);
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
        this.addTodoList("Default");
    }

    addTodoList(name) {
        this.projects.push(new TodoList(name));
    }

    removeList(index) {
        this.projects.splice(index, 1);
    }

    getList(index = 0) {
        return this.projects[index] || null;
    }

    getAllLists() {
        return this.projects;
    }

    getAllItems() {
        return this.projects.flatMap(list => list.getAll());
    }
}