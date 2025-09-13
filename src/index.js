import "./styles.css";
import { levels, ProjectManager } from "./modules/todo";
import { renderTodos, bindEvents, renderProjects } from "./modules/display";

export const contentDiv = document.querySelector("#main-container");
export const projectsLi = document.querySelector(".projects-list")
const addBtn = document.querySelector("#add-btn");

// Create Project Manager
const projectManager = new ProjectManager();

// Create lists
projectManager.addTodoList("Home");
projectManager.addTodoList("Work");

// Add todos
projectManager.getList(0).add("Do laundry", "Wash and fold clothes");
projectManager.getList(1).add("Finish report", "Due tomorrow", "2025-09-15");

// Render
renderProjects(projectManager.getAllLists());
renderTodos(projectManager.getAllItems());

// const todoList = new TodoList();

// renderTodos(todoList.getAll());

// bindEvents({
//     onDelete: (index) => {
//         todoList.remove(index);
//         renderTodos(todoList.getAll());
//     },
//     onToggle: (index) => {
//         todoList.getAll()[index].toggleComplete();
//         renderTodos(todoList.getAll());
//     },
//     onEdit: (index) => {
//         const todo = todoList.getAll()[index];
//         const newTitle = prompt("Edit title:", todo.title);
//         const newDescription = prompt("Edit description:", todo.description);
//         const newDueDate = prompt("Edit due date:", todo.dueDate);

//         if (newTitle !== null) {
//             todoList.edit(index, newTitle, newDescription, newDueDate);
//             renderTodos(todoList.getAll());
//         }
//     }
// });

// addBtn.addEventListener("click", () => {
//     const title = prompt("Enter task title:");
//     if (!title) return;

//     const description = prompt("Enter task description:") || "";
//     const dueDate = prompt("Enter due date:") || "";

//     todoList.add(new TodoItem(title, description, dueDate));
//     renderTodos(todoList.getAll());
// });

// todoList.add(new TodoItem("Finish project", "Work on ToDo app", "2025-09-15", levels.HIGH));
// todoList.add(new TodoItem("Grocery shopping", "Buy eggs, milk, and bread", "2025-09-13", levels.LOW));
// todoList.add(new TodoItem("Gym", "Leg day workout", "2025-09-12", levels.MEDIUM));
// todoList.add(new TodoItem("Finish project", "Work on ToDo app", "2025-09-15", levels.HIGH));
// todoList.add(new TodoItem("Grocery shopping", "Buy eggs, milk, and bread", "2025-09-13", levels.LOW));
// todoList.add(new TodoItem("Gym", "Leg day workout", "2025-09-12", levels.MEDIUM));
// todoList.add(new TodoItem("Finish project", "Work on ToDo app", "2025-09-15", levels.HIGH));
// todoList.add(new TodoItem("Grocery shopping", "Buy eggs, milk, and bread", "2025-09-13", levels.LOW));
// todoList.add(new TodoItem("Gym", "Leg day workout", "2025-09-12", levels.MEDIUM));
// renderTodos(todoList.getAll());