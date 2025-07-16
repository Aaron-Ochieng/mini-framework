import { init } from "../MiniMvc/init.js";
import domParser from "../MiniMvc/domParser.js";

// Initial state for the TodoMVC app
const initialState = {
  todos: [],
  newTodo: "",
  filter: "all", // "all", "active", "completed"
  editingId: null,
  editingText: ""
};

// Message types
const ADD_TODO = "ADD_TODO";
const TOGGLE_TODO = "TOGGLE_TODO";
const DELETE_TODO = "DELETE_TODO";
const EDIT_TODO = "EDIT_TODO";
const UPDATE_TODO = "UPDATE_TODO";
const CANCEL_EDIT = "CANCEL_EDIT";
const SET_FILTER = "SET_FILTER";
const UPDATE_NEW_TODO = "UPDATE_NEW_TODO";
const UPDATE_EDITING_TEXT = "UPDATE_EDITING_TEXT";
const TOGGLE_ALL = "TOGGLE_ALL";
const CLEAR_COMPLETED = "CLEAR_COMPLETED";

// Helper functions
function generateId() {
  return Date.now() + Math.random();
}

function getFilteredTodos(todos, filter) {
  switch (filter) {
    case "active":
      return todos.filter(todo => !todo.completed);
    case "completed":
      return todos.filter(todo => todo.completed);
    default:
      return todos;
  }
}

function getActiveTodoCount(todos) {
  return todos.filter(todo => !todo.completed).length;
}

function getCompletedTodoCount(todos) {
  return todos.filter(todo => todo.completed).length;
}

