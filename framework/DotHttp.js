class DotHttp {
    static async get(url) {
        const response = await fetch(url);
        return await response.json();
    }

    static async post(url, data) {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        return await response.json();
    }

    static async put(url, data) {
        const response = await fetch(url, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        return await response.json();
    }

    static async delete(url) {
        const response = await fetch(url, {
            method: 'DELETE',
        });
        return await response.json();
    }
}

export default DotHttp;