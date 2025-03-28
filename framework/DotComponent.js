class DotComponent {
    constructor(props) {
        this.props = props || {};
        this.state = {};
        this._renderScheduled = false;
    }

    setState(newState) {
        this.state = { ...this.state, ...newState };
        this.scheduleRender();
    }

    scheduleRender() {
        if (!this._renderScheduled) {
            this._renderScheduled = true;
            requestAnimationFrame(() => {
                this.render();
                this._renderScheduled = false;
            });
        }
    }

    render() {
        throw new Error("Render method should be implemented in the component");
    }
}

export default DotComponent;
