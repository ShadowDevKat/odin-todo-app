export const levels = {
    LOW: "Low",
    MEDIUM: "Medium",
    HIGH: "High"
}

export class TodoItem {
    #id;

    constructor(title, description = "", dueDate = null, priority = levels.LOW) {
        this.#setID(crypto.randomUUID());
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.completed = false;
    }

    toggleComplete() {
        this.completed = !this.completed;
    }

    update(title, description, dueDate) {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
    }

    get id() {
        return this.#id;
    }

    #setID(value) {
        this.#id = value;
    }
}

export class TodoList {
    constructor() {
        this.todos = [];
    }

    add(todo) {
        this.todos.push(todo);
    }

    remove(index) {
        this.todos.splice(index, 1);
    }

    edit(index, title, description, dueDate) {
        this.todos[index].update(title, description, dueDate);
    }

    getAll() {
        return this.todos;
    }
}