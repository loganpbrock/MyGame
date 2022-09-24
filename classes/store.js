class Store {
    constructor(name, departments, item) {
        this.name = name;
        this.departments = departments;
        this.item = item;
    }

    printDepartments() {
        console.log(this.departments)
    }
}



try {
    module.exports = Store;
} catch {
    module.exports = null;
}