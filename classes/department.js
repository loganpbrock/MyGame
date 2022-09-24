const readlineSync = require('readline-sync');

class Department {
    constructor(name) {
        this.name = name;
        this.hasItem = false;
        this.hasBomb = false;
    }


    foundItem() {
        console.log(`You come across an item: ${this.name}`)
        const choice = readlineSync.question("Will you take it? \n (y)es (n)o: ");
        if (choice.toLowerCase() !== 'y' && choice.toLowerCase() !== 'n') {
            console.log('Please choose a valid response.');
            this.search();
        } else if(choice.toLowerCase() === 'y'){
            this.hasItem = true;
        } else if(choice.toLowerCase() === 'n') {
            console.log(`You left the ${this.name} behind`)
        }
    }


    search(alreadyHasItem) {

        // SEARCH FOR ITEM
        if(this.hasItem === true && alreadyHasItem === false) {
            this.foundItem();
        } else {
            console.log("You didn't find anything useful in this department. \n")
        }

        // SEARCH FOR BOMB
        if(this.hasItem === true && alreadyHasItem === false) {
            this.foundBomb = true;
        }
    }


    reviewFoundItems() {
        console.log(this.itemLocations)
    }

    reviewFoundBomb() {
        console.log(this.bombLocation)
    }
}



try {
    module.exports = Department;
} catch {
    module.exports = null;
}