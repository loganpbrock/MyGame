class Character {
    constructor(name) {
        this.name = name;
        this.heldItems = [];
    }

    addItem(item) {
        if (!this.heldItems.includes(item)) {
            this.heldItems.push(item)
        } else {
            console.log('Error you already have this item')
        }
    }

    showInventory() {
        console.log('Your Inventory \n')
        this.heldItems.forEach(item => {
            console.log(` - ${item} \n`)
        })

    }
}


try {
    module.exports = Character;
} catch {
    module.exports = null;
}