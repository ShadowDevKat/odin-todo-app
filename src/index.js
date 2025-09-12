import "./styles.css";
import { levels, TodoItem, TodoList } from "./modules/todo";
import { renderTodos, bindEvents } from "./modules/display";

export const contentDiv = document.querySelector("#main-container");
const addBtn = document.querySelector("#add-btn");

const todoList = new TodoList();

renderTodos(todoList.getAll());

bindEvents({
    onDelete: (index) => {
        todoList.remove(index);
        renderTodos(todoList.getAll());
    },
    onToggle: (index) => {
        todoList.getAll()[index].toggleComplete();
        renderTodos(todoList.getAll());
    },
    onEdit: (index) => {
        const todo = todoList.getAll()[index];
        const newTitle = prompt("Edit title:", todo.title);
        const newDescription = prompt("Edit description:", todo.description);
        const newDueDate = prompt("Edit due date:", todo.dueDate);

        if (newTitle !== null) {
            todoList.edit(index, newTitle, newDescription, newDueDate);
            renderTodos(todoList.getAll());
        }
    }
});

addBtn.addEventListener("click", () => {
    const title = prompt("Enter task title:");
    if (!title) return;

    const description = prompt("Enter task description:") || "";
    const dueDate = prompt("Enter due date:") || "";

    todoList.add(new TodoItem(title, description, dueDate));
    renderTodos(todoList.getAll());
});

todoList.add(new TodoItem("Finish project", "Work on ToDo app", "2025-09-15", levels.HIGH));
todoList.add(new TodoItem("Grocery shopping", "Buy eggs, milk, and bread", "2025-09-13", levels.LOW));
todoList.add(new TodoItem("Gym", "Leg day workout", "2025-09-12", levels.MEDIUM));
todoList.add(new TodoItem("Finish project", "Work on ToDo app", "2025-09-15", levels.HIGH));
todoList.add(new TodoItem("Grocery shopping", "Buy eggs, milk, and bread", "2025-09-13", levels.LOW));
todoList.add(new TodoItem("Gym", "Leg day workout", "2025-09-12", levels.MEDIUM));
todoList.add(new TodoItem("Finish project", "Work on ToDo app", "2025-09-15", levels.HIGH));
todoList.add(new TodoItem("Grocery shopping", "Buy eggs, milk, and bread", "2025-09-13", levels.LOW));
todoList.add(new TodoItem("Gym", "Leg day workout", "2025-09-12", levels.MEDIUM));
renderTodos(todoList.getAll());