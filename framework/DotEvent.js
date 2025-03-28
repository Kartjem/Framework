class DotEvent {
    constructor() {
      this.events = {};
    }
  
    on(parent, eventType, selector, callback, options = {}) {
      parent.addEventListener(eventType, function(e) {
        if (e.target.matches(selector)) {
          if (options.preventDefault) e.preventDefault();
          if (options.stopPropagation) e.stopPropagation();
          callback(e);
        }
      });
    }
  
    trigger(element, eventType, detail = {}) {
      const event = new CustomEvent(eventType, { detail });
      element.dispatchEvent(event);
    }
  }
  
  export default DotEvent;
  