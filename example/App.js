import DotComponent from "../framework/DotComponent.js";
import DotHttp from "../framework/DotHttp.js";
import DotDOM from "../framework/DotDOM.js";
import DotState from "../framework/DotState.js";
import DotEvent from "../framework/DotEvent.js";

class App extends DotComponent {
  constructor(props) {
    super(props);
    this.appState = new DotState({
      tasks: [],
      filter: "all",
      page: 1,
      isLoading: false,
      modalTask: null,
      defaultPreventModal: false
    }, { persist: true, key: "todo-app-state" });
    this.eventHandler = new DotEvent();
    this.liClickListenerAttached = false;
    this.appState.subscribe(() => this.render());
    const urlFilter = new URL(window.location).searchParams.get("filter") || "all";
    this.appState.update({ filter: urlFilter, page: 1 });
    this.loadTasks();
  }

  async loadTasks() {
    const { filter, page } = this.appState.state;
    const queryParam = `?filter=${filter}&page=${page}&limit=5`;
    const data = await DotHttp.get("http://localhost:3000/api/tasks" + queryParam);
    this.appState.update({ tasks: data.tasks });
  }

  async loadMoreTasks() {
    if (this.appState.state.isLoading) return;
    this.appState.update({ isLoading: true });
    const newPage = this.appState.state.page + 1;
    const { filter } = this.appState.state;
    const queryParam = `?filter=${filter}&page=${newPage}&limit=5`;
    const data = await DotHttp.get("http://localhost:3000/api/tasks" + queryParam);
    const combined = this.appState.state.tasks.concat(data.tasks);
    this.appState.update({ tasks: combined, page: newPage, isLoading: false });
  }

  setFilter(filter) {
    const newUrl = new URL(window.location);
    if (filter === "all") {
      newUrl.searchParams.delete("filter");
    } else {
      newUrl.searchParams.set("filter", filter);
    }
    history.pushState(null, "", newUrl);
    this.appState.update({ filter, page: 1 });
    this.loadTasks();
  }

  addTask() {
    const input = document.getElementById("task-input");
    const text = input.value.trim();
    if (!text) return;
    DotHttp.post("http://localhost:3000/api/tasks", { text }).then(() => {
      input.value = "";
      this.loadTasks();
    });
  }

  deleteTask(taskId) {
    DotHttp.delete(`http://localhost:3000/api/tasks/${taskId}`).then(() => {
      this.loadTasks();
    });
  }

  toggleTask(taskId, currentDone) {
    DotHttp.put(`http://localhost:3000/api/tasks/${taskId}`, {
      done: !currentDone
    }).then(() => {
      this.loadTasks();
    });
  }

  openModal(task) {
    this.appState.update({ modalTask: task });
  }

  closeModal() {
    this.appState.update({ modalTask: null });
  }

  openDefaultPreventModal() {
    this.appState.update({ defaultPreventModal: true });
  }

  closeDefaultPreventModal() {
    this.appState.update({ defaultPreventModal: false });
  }

  render() {
    requestAnimationFrame(() => {
      const container = document.getElementById("app");
      if (!container) return;
      DotDOM.clear(container);

      const header = DotDOM.create("h1", {}, "Task List");
      const allFilter = DotDOM.create("button", { onClick: () => this.setFilter("all") }, "All");
      const completedFilter = DotDOM.create("button", { onClick: () => this.setFilter("completed") }, "Completed");
      const pendingFilter = DotDOM.create("button", { onClick: () => this.setFilter("pending") }, "Pending");
      const filterContainer = DotDOM.create("div", { class: "filter-container" }, allFilter, completedFilter, pendingFilter);

      const inputField = DotDOM.create("input", { id: "task-input", placeholder: "Enter new task", type: "text" });
      const addButton = DotDOM.create("button", { onClick: () => this.addTask() }, "Add Task");
      const inputContainer = DotDOM.create("div", { class: "task-input" }, inputField, addButton);

      const ul = DotDOM.create("ul", { id: "task-list" });
      this.appState.state.tasks.forEach(task => {
        const li = DotDOM.create("li", { class: task.done ? "done" : "", "data-task-id": task.id });
        const taskText = DotDOM.create("span", { class: "task-text" }, task.text);
        const toggleButton = DotDOM.create("button", { onClick: () => this.toggleTask(task.id, task.done) }, task.done ? "Mark Incomplete" : "Mark Complete");
        const deleteButton = DotDOM.create("button", { onClick: () => this.deleteTask(task.id) }, "Delete");
        const buttonContainer = DotDOM.create("div", { class: "button-container" }, toggleButton, deleteButton);
        li.appendChild(taskText);
        li.appendChild(buttonContainer);
        ul.appendChild(li);
      });

      const loadMoreButton = DotDOM.create("button", { class: "load-more-button", onClick: () => this.loadMoreTasks() }, "Load More");

      // default behavior prevention
      const dummyLink = DotDOM.create("a", { href: "https://www.youtube.com/", class: "dummy-link" }, "Click me (Default behavior prevented)");

      container.appendChild(header);
      container.appendChild(filterContainer);
      container.appendChild(inputContainer);
      container.appendChild(ul);
      container.appendChild(loadMoreButton);
      container.appendChild(dummyLink);

      if (!this.liClickListenerAttached) {
        this.eventHandler.on(container, "click", "li[data-task-id]", (e) => {
          if (e.target.closest("button")) return;
          const liElem = e.target.closest("li[data-task-id]");
          if (liElem) {
            const taskId = liElem.getAttribute("data-task-id");
            const task = this.appState.state.tasks.find(t => t.id == taskId);
            if (task) this.openModal(task);
          }
        });
        this.liClickListenerAttached = true;
      }

      this.eventHandler.on(container, "click", ".dummy-link", (e) => {
        this.openDefaultPreventModal();
      }, { preventDefault: true, stopPropagation: true });

      const modalTask = this.appState.state.modalTask;
      if (modalTask) {
        const modalOverlay = DotDOM.create("div", { class: "modal-overlay" });
        const modalContent = DotDOM.create("div", { class: "modal-content" });
        const modalHeader = DotDOM.create("h2", {}, "Task Details");
        const modalText = DotDOM.create("p", {}, "Text: " + modalTask.text);
        const modalStatus = DotDOM.create("p", {}, "Status: " + (modalTask.done ? "Completed" : "Pending"));
        const closeButton = DotDOM.create("button", { onClick: () => this.closeModal() }, "Close");
        modalContent.appendChild(modalHeader);
        modalContent.appendChild(modalText);
        modalContent.appendChild(modalStatus);
        modalContent.appendChild(closeButton);
        modalOverlay.appendChild(modalContent);
        container.appendChild(modalOverlay);
      }

      if (this.appState.state.defaultPreventModal) {
        const preventOverlay = DotDOM.create("div", { class: "modal-overlay" });
        const preventContent = DotDOM.create("div", { class: "modal-content" });
        const preventHeader = DotDOM.create("h2", {}, "Default Behavior Intercepted");
        const preventText = DotDOM.create("p", {}, "Clicking this dummy link prevented the default browser action and stopped event propagation.");
        const okButton = DotDOM.create("button", { onClick: () => this.closeDefaultPreventModal() }, "OK");
        preventContent.appendChild(preventHeader);
        preventContent.appendChild(preventText);
        preventContent.appendChild(okButton);
        preventOverlay.appendChild(preventContent);
        container.appendChild(preventOverlay);
      }
    });
  }
}

export default App;
