# Frontend Framework

## Overview

dot-js is a lightweight framework with modules for common web development tasks: state management, routing, event handling, DOM manipulation, and HTTP requests. It's designed to be easy to learn and use.

## Architecture & Design Principles

dot-js is based on:

- **Modularity:** Code is divided into separate modules.
- **Separation of Concerns:** Each module has a specific job.
- **Reactivity:** UI updates automatically when data changes (using `DotState`).
- **Simplicity:** Easy-to-use API.
- **Performance:** Optimized for smooth UI.

---

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/)
- [SQLite3](https://www.sqlite.org/index.html)

1.**Clone the Repository**

```bash
   git clone https://github.com/Kartjem/Framework
   cd frontend-framework
```

2.**Install Dependencies**

Run the following command in the root directory:

```bash
npm install
```

3.**Set Up the Database**

Run the following SQL to create your database table:

```sql
CREATE TABLE tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  text TEXT NOT NULL,
  done INTEGER DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);
```

4.**Start the Server**

From the root directory, run:

```bash
npm start
```

5.**Open the Demo**

Open your browser and navigate to (<http://localhost:3000>)

---

## Getting Started

Here's a basic "Hello, World!" example:

```html
<!DOCTYPE html>
<html>
<head>
  <title>dot-js - Hello World</title>
</head>
<body>
  <div id="app"></div>
  <script type="module">
    import DotDOM from './framework/DotDOM.js';

    const appDiv = document.getElementById('app');
    const helloWorldElement = DotDOM.create('h1', {}, 'Hello, World!');
    DotDOM.append(appDiv, helloWorldElement);
  </script>
</body>
</html>
```

**Serve the HTML file using a local web server:** *Do not open the `index.html` file directly in your browser.* You need to serve it through a web server. Here is an easy option.

 `npx serve`: If you have Node.js installed, open a terminal in the root directory of your `frontend-framework` project and run `npx serve`.

---

## Detailed explanation

### State Management: `DotState`

Manages application data and persists it to `localStorage`.

```js
import DotState from "./framework/DotState.js";

const state = new DotState({ count: 0 }, { persist: true, key: 'my-app-state' });

state.subscribe(newState => {
  console.log("Count:", newState.count);
});

state.set("count", 1);
```

- DotState(initialState, options): Creates a new DotState instance.
   - initialState (object): The initial state.
   - options (object, optional):
      - persist (boolean): If true, the state will be saved to localStorage. Defaults to false.
      - key (string): The key used to store the state in localStorage. Defaults to 'dotjs-state'.
- state.get(key): Gets the value associated with the specified key.
- state.set(key, value): Updates a value in the state. key is the key to update, and value is the new value.
- state.subscribe(callback): Registers a function to be called when the state changes. callback is a function that receives the new state as an argument.

### Routing: `DotRouter`

Handles navigation between different parts of your application.

```js
import DotRouter from "./framework/DotRouter.js";
import App from "./App.js";

const router = new DotRouter();
router.addRoute("/", new App());
router.navigate("/");
```

- new DotRouter(): Creates a router.
- router.addRoute(path, component): Adds a route.
- router.navigate(path): Navigates to a route.

### Event Handling: `DotEvent`

Simplifies event handling using delegation.

```js
import DotEvent from "./framework/DotEvent.js";

const eventHandler = new DotEvent();

eventHandler.on(document.body, "click", ".my-button", (event) => {
  console.log("Button clicked!");
});
```

- new DotEvent(): Creates an event handler.
- eventHandler.on(parent, eventType, selector, callback): Adds an event listener.

### DOM Manipulation: `DotDOM`

Makes it easier to create and work with HTML elements.

```js
import DotDOM from "./framework/DotDOM.js";

const myDiv = DotDOM.create("div", { class: "my-div" }, "Hello!");
DotDOM.append(document.body, myDiv);
```

- DotDOM.create(tagName, attributes, ...children): Creates a new element.
- DotDOM.append(parent, ...children): Adds an element to the page.

### HTTP Requests: `DotHttp`

Simplifies making API calls.

```js
import DotHttp from "./framework/DotHttp.js";

DotHttp.get("/api/data")
  .then(data => console.log("Data:", data))
  .catch(error => console.error("Error:", error));
```

- DotHttp.get(url): Makes a GET request.
- DotHttp.post(url, data): Makes a POST request.

### Base Component: `DotComponent`

Base class for UI components.

```js
import DotComponent from "../framework/DotComponent.js";
import DotDOM from "../framework/DotDOM.js";

class MyComponent extends DotComponent {
  constructor(props) {
    super(props);
    this.state = { message: "Initial Message" };
  }

  render() {
    return DotDOM.create("div", {}, this.state.message);
  }
}

export default MyComponent;
```

## Performance Benchmarks

To validate our performance improvements, we ran some tests on updating a counter 1,000 times with and without the use of `requestAnimationFrame` in DotComponent. Here are some sample measurements:

**With requestAnimationFrame enabled:**
- increment1000: 0.407 ms
- increment1000: 0.261 ms
- increment1000: 0.308 ms

**With requestAnimationFrame disabled:**
- increment1000: 7.224 ms
- increment1000: 10.345 ms
- increment1000: 8.617 ms
- increment1000: 9.548 ms
- increment1000: 9.323 ms
- increment1000: 8.725 ms

These benchmarks clearly demonstrate that using `requestAnimationFrame` to debounce state updates significantly reduces the time per update, resulting in smoother UI performance during rapid state changes.

---

## Best Practices & Guidelines

- Use components.
- Manage state with DotState.
-   When using `DotState` with persistence, choose a unique `key` for your application to avoid conflicts with other applications.
- Use DotDOM for consistent DOM manipulation.
- Delegate events with DotEvent.
- Use DotHttp for API calls.
