class DotState {
    constructor(initialState = {}, options = {}) {
      this.persist = options.persist || false;
      this.key = options.key || "dotjs-state";
      const saved = this.persist ? localStorage.getItem(this.key) : null;
      this.state = saved ? JSON.parse(saved) : initialState;
      this.subscribers = [];
    }
  
    get(key) {
      return this.state[key];
    }
  
    set(key, value) {
      this.state[key] = value;
      if (this.persist) {
        localStorage.setItem(this.key, JSON.stringify(this.state));
      }
      this.notifySubscribers();
    }
  
    update(newState) {
      this.state = { ...this.state, ...newState };
      if (this.persist) {
        localStorage.setItem(this.key, JSON.stringify(this.state));
      }
      this.notifySubscribers();
    }
  
    subscribe(callback) {
      this.subscribers.push(callback);
    }
  
    unsubscribe(callback) {
      this.subscribers = this.subscribers.filter(cb => cb !== callback);
    }
  
    notifySubscribers() {
      this.subscribers.forEach(cb => cb(this.state));
    }
  }
  
  export default DotState;
  