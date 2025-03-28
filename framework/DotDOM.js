class DotDOM {
    static create(tag, props = {}, ...children) {
        const element = document.createElement(tag);
        for (let [key, value] of Object.entries(props)) {
            if (key.startsWith("on") && typeof value === "function") {
                element.addEventListener(key.substring(2).toLowerCase(), value);
            } else if (key === "style" && typeof value === "object") {
                Object.assign(element.style, value);
            } else {
                element.setAttribute(key, value);
            }
        }
        children.forEach(child => {
            if (typeof child === "string") {
                element.appendChild(document.createTextNode(child));
            } else if (child instanceof Node) {
                element.appendChild(child);
            }
        });
        return element;
    }

    static append(parent, child) {
        parent.appendChild(child);
    }

    static clear(element) {
        element.innerHTML = "";
    }
}

export default DotDOM;
