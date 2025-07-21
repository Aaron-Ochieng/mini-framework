# Mini-Framework

A lightweight, functional frontend framework built using Virtual DOM. Mini-FrameWork provides a simple yet powerful way to build interactive web applications using unidirectional data flow, virtual DOM, and pure functions.

## Table of Contents

- [Overview](#overview)
- [Core Concepts](#core-concepts)
- [Getting Started](#getting-started)
- [API Reference](#api-reference)
- [Examples](#examples)
- [Best Practices](#best-practices)
- [Architecture](#architecture)

## Overview

MiniMvc is a minimal framework (~300 lines) that implements:

- **Unidirectional Data Flow**: State flows down, events flow up
- **Virtual DOM**: Efficient rendering with smart diffing
- **Pure Functions**: Predictable state updates
- **Message-Based Architecture**: Type-safe event handling
- **HTML Templates**: Declarative view syntax

## Core Concepts

### The MiniMvc Architecture

```
┌─────────────┐    ┌──────────────┐    ┌─────────────┐
│    View     │───▶│   Messages   │───▶│   Update    │
│             │    │              │    │             │
└─────────────┘    └──────────────┘    └─────────────┘
       ▲                                       │
       │                                       ▼
       └───────────────── State ◀──────────────┘
```

1. **State**: Single source of truth for your application
2. **View**: Pure function that renders state to virtual DOM
3. **Update**: Pure function that handles messages and returns new state
4. **Messages**: Events that describe what happened

## Getting Started

### Installation

Build  from the source and intsall dependencies:

1. **Clone the repository:**

    ```sh
❯ git clone ../
```
2. **Navigate to the project directory:**
```sh
❯ cd
```javascript
## API Reference

### `init(root, initialState, update, view)`

Initializes your MiniMvc application.

**Parameters:**
- `root` (HTMLElement): DOM element to render into
- `initialState` (Object): Initial application state
- `update` (Function): State update function `(state, msg) => newState`
- `view` (Function): View render function `(state) => VirtualNode[]`

**Returns:**
- `{ enqueue }`: Object with enqueue function for dispatching messages

### `domParser(htmlString, handlers)`

Converts HTML string to virtual DOM with event handlers.

**Parameters:**
- `htmlString` (String): HTML template string
- `handlers` (Object): Map of handler names to functions

**Returns:**
- Virtual DOM node

### Event Handlers

Event handlers are functions that return message objects:
```javascript
const handlers = {
  // Simple message
  handleClick: () => ({ type: "BUTTON_CLICKED" }),
  
  // Message with data
  handleInput: (event) => ({ 
    type: "INPUT_CHANGED", 
    value: event.target.value 
  }),
  
  // Conditional messages
  handleKeyDown: (event) => {
    if (event.key === "Enter") {
      return { type: "SUBMIT" };
    }
    // Return undefined to ignore event
  }
};
```
### HTML Template Syntax

Use standard HTML with event attributes:
```html
<!-- Event handlers -->
<button onclick="handleClick">Click me</button>
<input oninput="handleInput" onkeydown="handleKeyDown" />

<!-- Dynamic content -->
<h1>${state.title}</h1>
<p class="${state.isActive ? 'active' : 'inactive'}">Status</p>

<!-- Conditional rendering -->
${state.showMessage ? `<div>Hello!</div>` : ''}

<!-- Lists -->
<ul>
  ${state.items.map(item => `
    <li data-id="${item.id}" onclick="handleItemClick">
      ${item.name}
    </li>
  `).join('')}
</ul>
```
## Examples

### Counter App
```javascript
const initialState = { count: 0 };

const INCREMENT = "INCREMENT";
const DECREMENT = "DECREMENT";
const RESET = "RESET";

function update(state, msg) {
  switch (msg.type) {
    case INCREMENT:
      return { ...state, count: state.count + 1 };
    case DECREMENT:
      return { ...state, count: state.count - 1 };
    case RESET:
      return { ...state, count: 0 };
    default:
      return state;
  }
}

const handlers = {
  increment: () => ({ type: INCREMENT }),
  decrement: () => ({ type: DECREMENT }),
  reset: () => ({ type: RESET })
};

function view(state) {
  return [domParser(`
    <div>
      <h2>Counter: ${state.count}</h2>
      <button onclick="increment">+</button>
      <button onclick="decrement">-</button>
      <button onclick="reset">Reset</button>
    </div>
  `, handlers)];
}
```
### Form Handling
```javascript
const initialState = {
  name: "",
  email: "",
  errors: {}
};

const UPDATE_FIELD = "UPDATE_FIELD";
const SUBMIT_FORM = "SUBMIT_FORM";
const SET_ERRORS = "SET_ERRORS";

function update(state, msg) {
  switch (msg.type) {
    case UPDATE_FIELD:
      return {
        ...state,
        [msg.field]: msg.value,
        errors: { ...state.errors, [msg.field]: null }
      };
    
    case SUBMIT_FORM:
      const errors = validateForm(state);
      if (Object.keys(errors).length > 0) {
        return { ...state, errors };
      }
      // Handle successful submission
      console.log("Form submitted:", state);
      return state;
    
    default:
      return state;
  }
}

function validateForm(state) {
  const errors = {};
  if (!state.name.trim()) errors.name = "Name is required";
  if (!state.email.includes("@")) errors.email = "Invalid email";
  return errors;
}

const handlers = {
  updateName: (e) => ({ 
    type: UPDATE_FIELD, 
    field: "name", 
    value: e.target.value 
  }),
  updateEmail: (e) => ({ 
    type: UPDATE_FIELD, 
    field: "email", 
    value: e.target.value 
  }),
  submitForm: (e) => {
    e.preventDefault();
    return { type: SUBMIT_FORM };
  }
};

function view(state) {
  return [domParser(`
    <form onsubmit="submitForm">
      <div>
        <input 
          type="text" 
          placeholder="Name" 
          value="${state.name}"
          oninput="updateName"
        />
        ${state.errors.name ? `<span class="error">${state.errors.name}</span>` : ''}
      </div>
      
      <div>
        <input 
          type="email" 
          placeholder="Email" 
          value="${state.email}"
          oninput="updateEmail"
        />
        ${state.errors.email ? `<span class="error">${state.errors.email}</span>` : ''}
      </div>gi
      
      <button type="submit">Submit</button>
    </form>
  `, handlers)];
}
```
### List Management
```javascript
const initialState = {
  items: [],
  newItem: "",
  filter: "all"
};

const ADD_ITEM = "ADD_ITEM";
const REMOVE_ITEM = "REMOVE_ITEM";
const TOGGLE_ITEM = "TOGGLE_ITEM";
const UPDATE_INPUT = "UPDATE_INPUT";
const SET_FILTER = "SET_FILTER";

function update(state, msg) {
  switch (msg.type) {
    case ADD_ITEM:
      if (!state.newItem.trim()) return state;
      return {
        ...state,
        items: [
          ...state.items,
          {
            id: Date.now(),
            text: state.newItem.trim(),
            completed: false
          }
        ],
        newItem: ""
      };
    
    case REMOVE_ITEM:
      return {
        ...state,
        items: state.items.filter(item => item.id !== msg.id)
      };
    
    case TOGGLE_ITEM:
      return {
        ...state,
        items: state.items.map(item =>
          item.id === msg.id 
            ? { ...item, completed: !item.completed }
            : item
        )
      };
    
    case UPDATE_INPUT:
      return { ...state, newItem: msg.value };
    
    case SET_FILTER:
      return { ...state, filter: msg.filter };
    
    default:
      return state;
  }
}

const handlers = {
  addItem: () => ({ type: ADD_ITEM }),
  removeItem: (e) => ({ 
    type: REMOVE_ITEM, 
    id: parseInt(e.target.dataset.id) 
  }),
  toggleItem: (e) => ({ 
    type: TOGGLE_ITEM, 
    id: parseInt(e.target.dataset.id) 
  }),
  updateInput: (e) => ({ 
    type: UPDATE_INPUT, 
    value: e.target.value 
  }),
  setFilter: (e) => ({ 
    type: SET_FILTER, 
    filter: e.target.dataset.filter 
  }),
  handleKeyDown: (e) => {
    if (e.key === "Enter") {
      return { type: ADD_ITEM };
    }
  }
};

function view(state) {
  const filteredItems = state.items.filter(item => {
    if (state.filter === "active") return !item.completed;
    if (state.filter === "completed") return item.completed;
    return true;
  });

  return [domParser(`
    <div>
      <input 
        value="${state.newItem}"
        placeholder="Add new item..."
        oninput="updateInput"
        onkeydown="handleKeyDown"
      />
      <button onclick="addItem">Add</button>
      
      <div>
        <button data-filter="all" onclick="setFilter">All</button>
        <button data-filter="active" onclick="setFilter">Active</button>
        <button data-filter="completed" onclick="setFilter">Completed</button>
      </div>
      
      <ul>
        ${filteredItems.map(item => `
          <li class="${item.completed ? 'completed' : ''}">
            <input 
              type="checkbox" 
              ${item.completed ? 'checked' : ''}
              data-id="${item.id}"
              onchange="toggleItem"
            />
            <span>${item.text}</span>
            <button data-id="${item.id}" onclick="removeItem">×</button>
          </li>
        `).join('')}
      </ul>
    </div>
  `, handlers)];
}
```
## Best Practices

### State Management

1. **Keep state flat and normalized**
```javascript
// Good
   const state = {
     users: { 1: { id: 1, name: "John" } },
     selectedUserId: 1
   };
   
   // Avoid deep nesting
   const state = {
     ui: {
       users: {
         list: [{ id: 1, name: "John" }],
         selected: { id: 1, name: "John" }
       }
     }
   };
```
2. **Use immutable updates**
```javascript
// Good
   return { ...state, count: state.count + 1 };
   
   // Bad - mutates state
   state.count++;
   return state;
```
3. **Validate message types**
```javascript
function update(state, msg) {
     switch (msg.type) {
       case "KNOWN_MESSAGE":
         return handleKnownMessage(state, msg);
       default:
         console.warn("Unknown message type:", msg.type);
         return state;
     }
   }
```
### View Functions

1. **Keep views pure**
```javascript
// Good - pure function
   function view(state) {
     return [domParser(`<div>${state.message}</div>`, handlers)];
   }
   
   // Bad - side effects
   function view(state) {
     console.log("Rendering..."); // Side effect
     document.title = state.title; // DOM manipulation
     return [domParser(`<div>${state.message}</div>`, handlers)];
   }
```
2. **Extract complex rendering logic**
```javascript
function renderUserList(users) {
     return users.map(user => `
       <li data-id="${user.id}" onclick="selectUser">
         ${user.name}
       </li>
     `).join('');
   }
   
   function view(state) {
     return [domParser(`
       <div>
         <ul>${renderUserList(state.users)}</ul>
       </div>
     `, handlers)];
   }
```
3. **Use helper functions for conditional rendering**
```javascript
function renderIf(condition, html) {
     return condition ? html : '';
   }
   
   function view(state) {
     return [domParser(`
       <div>
         ${renderIf(state.showMessage, `<p>${state.message}</p>`)}
         ${renderIf(state.loading, `<div class="spinner">Loading...</div>`)}
       </div>
     `, handlers)];
   }
```
### Event Handlers

1. **Keep handlers simple**
```javascript
// Good
   const handlers = {
     increment: () => ({ type: "INCREMENT" }),
     updateName: (e) => ({ type: "UPDATE_NAME", value: e.target.value })
   };
   
   // Bad - complex logic in handler
   const handlers = {
     complexHandler: (e) => {
       const value = e.target.value;
       if (value.length > 10) {
         return { type: "LONG_INPUT", value: value.substring(0, 10) };
       } else if (value.includes("@")) {
         return { type: "EMAIL_INPUT", value };
       }
       return { type: "REGULAR_INPUT", value };
     }
   };
```
2. **Use data attributes for dynamic data**
```javascript
// In template
   `<button data-id="${item.id}" onclick="deleteItem">Delete</button>`
   
   // In handler
   const handlers = {
     deleteItem: (e) => ({ 
       type: "DELETE_ITEM", 
       id: parseInt(e.target.dataset.id) 
     })
   };
```
### Performance Tips

1. **Minimize virtual DOM node creation**
```javascript
// Good - reuse static parts
   const staticHeader = domParser(`<header><h1>My App</h1></header>`, {});
   
   function view(state) {
     return [
       staticHeader,
       domParser(`<main>${state.content}</main>`, handlers)
     ];
   }
```
2. **Use keys for list items** (when implementing custom list diffing)
```javascript
// Add unique identifiers to help with diffing
   `<li data-key="${item.id}">${item.name}</li>`
```
## Architecture

### Framework Components

1. **init.js**: Application lifecycle management
2. **diff.js**: Virtual DOM diffing algorithm
3. **Dom.js**: DOM manipulation and patching
4. **domParser.js**: HTML string to virtual DOM conversion
5. **createElement.js**: Virtual DOM node creation
6. **event.js**: Event handling system
7. **properties.js**: DOM property management

### Data Flow
```
User Interaction
       ↓
Event Handler (returns message)
       ↓
Message Queue
       ↓
Update Function (state + message → new state)
       ↓
View Function (state → virtual DOM)
       ↓
Diff Algorithm (old vdom vs new vdom → patches)
       ↓
DOM Patching (apply patches to real DOM)
       ↓
Updated UI
```
### Virtual DOM Structure
```javascript
{
  tag: "div",
  attr: {
    class: "container",
    onclick: handlerFunction
  },
  children: [
    { text: "Hello World" },
    {
      tag: "button",
      attr: { onclick: anotherHandler },
      children: [{ text: "Click me" }]
    }
  ]
}
```
This documentation should help you build applications with the MiniMvc framework. The framework is designed to be simple yet powerful, encouraging functional programming patterns and predictable state management.

- [MIT LICENCE](./LICENSE)

### Authors
- [aaochieng](https://learn.zone01kisumu.ke/git/aaochieng)
- [jmuchiri](https://learn.zone01kisumu.ke/git/jmuchiri)
- [josotieno](https://learn.zone01kisumu.ke/git/josotieno)
- [jkuya](https://learn.zone01kisumu.ke/git/jkuya)