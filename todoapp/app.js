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

// Update function - handles all state changes
function update(state, msg, enqueue) {
  switch (msg.type) {
    case ADD_TODO:
      if (state.newTodo.trim() === "") return state;
      return {
        ...state,
        todos: [
          ...state.todos,
          {
            id: generateId(),
            text: state.newTodo.trim(),
            completed: false
          }
        ],
        newTodo: ""
      };

    case TOGGLE_TODO:
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === msg.id
            ? { ...todo, completed: !todo.completed }
            : todo
        )
      };

    case DELETE_TODO:
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== msg.id)
      };

    case EDIT_TODO:
      return {
        ...state,
        editingId: msg.id,
        editingText: msg.text
      };

    case UPDATE_TODO:
      if (state.editingText.trim() === "") {
        // Delete todo if text is empty
        return {
          ...state,
          todos: state.todos.filter(todo => todo.id !== state.editingId),
          editingId: null,
          editingText: ""
        };
      }
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === state.editingId
            ? { ...todo, text: state.editingText.trim() }
            : todo
        ),
        editingId: null,
        editingText: ""
      };

    case CANCEL_EDIT:
      return {
        ...state,
        editingId: null,
        editingText: ""
      };

    case SET_FILTER:
      return {
        ...state,
        filter: msg.filter
      };

    case UPDATE_NEW_TODO:
      return {
        ...state,
        newTodo: msg.value
      };

    case UPDATE_EDITING_TEXT:
      return {
        ...state,
        editingText: msg.value
      };

    case TOGGLE_ALL:
      const allCompleted = state.todos.every(todo => todo.completed);
      return {
        ...state,
        todos: state.todos.map(todo => ({
          ...todo,
          completed: !allCompleted
        }))
      };

    case CLEAR_COMPLETED:
      return {
        ...state,
        todos: state.todos.filter(todo => !todo.completed)
      };

    default:
      return state;
  }
}

