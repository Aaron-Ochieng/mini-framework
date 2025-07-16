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

// Event handlers
const handlers = {
  handleNewTodoInput: (event) => ({
    type: UPDATE_NEW_TODO,
    value: event.target.value
  }),

  handleNewTodoKeyDown: (event) => {
    if (event.key === "Enter") {
      return { type: ADD_TODO };
    }
  },

  handleToggleTodo: (event) => ({
    type: TOGGLE_TODO,
    id: parseFloat(event.target.dataset.id)
  }),

  handleDeleteTodo: (event) => ({
    type: DELETE_TODO,
    id: parseFloat(event.target.dataset.id)
  }),

  handleEditTodo: (event) => ({
    type: EDIT_TODO,
    id: parseFloat(event.target.dataset.id),
    text: event.target.dataset.text
  }),

  handleEditingInput: (event) => ({
    type: UPDATE_EDITING_TEXT,
    value: event.target.value
  }),

  handleEditingKeyDown: (event) => {
    if (event.key === "Enter") {
      return { type: UPDATE_TODO };
    } else if (event.key === "Escape") {
      return { type: CANCEL_EDIT };
    }
  },

  handleEditingBlur: () => ({ type: UPDATE_TODO }),

  handleFilterAll: () => ({ type: SET_FILTER, filter: "all" }),
  handleFilterActive: () => ({ type: SET_FILTER, filter: "active" }),
  handleFilterCompleted: () => ({ type: SET_FILTER, filter: "completed" }),

  handleToggleAll: () => ({ type: TOGGLE_ALL }),
  handleClearCompleted: () => ({ type: CLEAR_COMPLETED })
};

// View function - renders the current state
function view(state) {
  const filteredTodos = getFilteredTodos(state.todos, state.filter);
  const activeTodoCount = getActiveTodoCount(state.todos);
  const completedTodoCount = getCompletedTodoCount(state.todos);
  const allCompleted = state.todos.length > 0 && activeTodoCount === 0;

  // Generate todo items HTML
  const todoItemsHtml = filteredTodos.map(todo => {
    const isEditing = state.editingId === todo.id;
    
    if (isEditing) {
      return `
        <li class="editing">
          <div class="view">
            <input class="toggle" type="checkbox" ${todo.completed ? 'checked' : ''} data-id="${todo.id}" onchange="handleToggleTodo">
            <label data-id="${todo.id}" data-text="${todo.text}" ondblclick="handleEditTodo">${todo.text}</label>
            <button class="destroy" data-id="${todo.id}" onclick="handleDeleteTodo"></button>
          </div>
          <input class="edit" value="${state.editingText}" oninput="handleEditingInput" onkeydown="handleEditingKeyDown" onblur="handleEditingBlur">
        </li>
      `;
    } else {
      return `
        <li class="${todo.completed ? 'completed' : ''}">
          <div class="view">
            <input class="toggle" type="checkbox" ${todo.completed ? 'checked' : ''} data-id="${todo.id}" onchange="handleToggleTodo">
            <label data-id="${todo.id}" data-text="${todo.text}" ondblclick="handleEditTodo">${todo.text}</label>
            <button class="destroy" data-id="${todo.id}" onclick="handleDeleteTodo"></button>
          </div>
        </li>
      `;
    }
  }).join('');

  // Main app HTML
  const appHtml = `
    <div>
      <header class="header">
        <h1>todos</h1>
        <input class="new-todo" placeholder="What needs to be done?" value="${state.newTodo}" oninput="handleNewTodoInput" onkeydown="handleNewTodoKeyDown" autofocus>
      </header>
      
      ${state.todos.length > 0 ? `
        <section class="main">
          <input id="toggle-all" class="toggle-all" type="checkbox" ${allCompleted ? 'checked' : ''} onchange="handleToggleAll">
          <label for="toggle-all">Mark all as complete</label>
          <ul class="todo-list">
            ${todoItemsHtml}
          </ul>
        </section>
        
        <footer class="footer">
          <span class="todo-count">
            <strong>${activeTodoCount}</strong> ${activeTodoCount === 1 ? 'item' : 'items'} left
          </span>
          <ul class="filters">
            <li>
              <a class="${state.filter === 'all' ? 'selected' : ''}" onclick="handleFilterAll">All</a>
            </li>
            <li>
              <a class="${state.filter === 'active' ? 'selected' : ''}" onclick="handleFilterActive">Active</a>
            </li>
            <li>
              <a class="${state.filter === 'completed' ? 'selected' : ''}" onclick="handleFilterCompleted">Completed</a>
            </li>
          </ul>
          ${completedTodoCount > 0 ? `
            <button class="clear-completed" onclick="handleClearCompleted">Clear completed</button>
          ` : ''}
        </footer>
      ` : ''}
    </div>
  `;

  return [domParser(appHtml, handlers)];
}

