class Item {
    constructor(name, description) {
        this.name = name;
        this.description = description;
    };
}


try {
    module.exports = Item;
} catch {
    module.exports = null;
}