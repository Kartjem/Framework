class DotRouter {
    constructor() {
        this.routes = {};
        window.addEventListener("popstate", () => {
            const path = window.location.pathname;
            this.loadRoute(path);
        });
    }

    addRoute(path, component) {
        this.routes[path] = component;
    }

    navigate(path) {
        history.pushState(null, null, path);
        this.loadRoute(path);
    }

    loadRoute(path) {
        const component = this.routes[path];
        if (component) {
            component.render();
        } else {
            console.error(`Route not found: ${path}`);
        }
    }
}

export default DotRouter;
