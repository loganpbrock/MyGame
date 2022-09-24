const Character = require('./classes/character')
const Department = require('./classes/department')
const Store = require('./classes/store')
const Item = require('./classes/item')
const readlineSync = require('readline-sync');
const { Console } = require('console');
const { create } = require('domain');




// DECLARE GLOBAL VARIABLES
let char;
let gameMoves = Math.floor(Math.random() * (20 - 15 + 1) + 15);
gameMoves = 9999;
let startMove = gameMoves;
let points = gameMoves * 1000 + 1;
let currentDepartment;
let currentStore;
let gameRunning = true;
let defuseBomb = false;
let wires = ['Red', 'Green', 'Blue']
let hotWire = Math.floor(Math.random() * (2 - 0 + 1) + 0);


// "CLEAR" TERMINAL
const createSpace = (amt) => {
  if (amt === 1) {
    for (let i = 0; i < 20; i++) {
      console.log('');
    }
  } else {
    for (let i = 0; i < 10; i++) {
      console.log('');
    }
  }
}


// PAUSE SCRIPT FOR X MILLISECONDS
function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}


// CREATE THE ITEMS
const item1 = new Item('Wire Cutters', 'I-in Diagonal Pliers have a corrosion resistant chrome finish providing extra wear and tear coverage.' +
                                       ' Drop forged steel provides strength and durability for longer life.'
);

const item2 = new Item('Screw Driver', "Whether you are on the jobsite, or working around the house, this 6-in-1 screwdriver can handle lots of essential tasks." +
                                        " The most common bit sizes are covered: two Slotted (3/16in and 1/4in), two Phillips (PH1 and PH2) and two Nut Drivers" +
                                        " (1/4in and 5/16in). You'll reach for this handy tool again and again."
);

const item3 = new Item('User Manual', `In order to defuse a bomb you will need a screw driver to open the panel & wire cutters to cut the ${wires[hotWire]} wire.`);

const items = {wc: item1, sd: item2, um: item3};


// CREATE THE DEPARTMENTS AND STORES
const stores = {e: new Store('Electronics', departments = {c: new Department('Computer'), t: new Department('TV'), a: new Department('Car Audio')}, item1),
                h: new Store('Hardware', departments = {k: new Department('Kitchen'), c: new Department('Lawn Care'), l: new Department('Lighting')}, item2),
                b: new Store('Books', departments = {c: new Department('Cook Book'), h: new Department('Home Repair'), m: new Department('Misc. Books')}, item3)
}

let storeKeys = Object.keys(stores)


// GET USER INPUT
const input = (text = 'What will you choose? ') => {
  return readlineSync.question(text);
}


// CREATE CHOOSE A VALID RESPONSE MESSAGE
const validResponse = () => {
  createSpace(1);
  console.log('Please choose a valid response \n')
  sleep(2000)
}


// CREATE THE PLAYERS CHARACTER
const setPlayer = () => {
  let playerName = readlineSync.question('What is your name? ');
  char = new Character(playerName);
  createSpace(1)
  console.log(`Welcome to the bomb squad ${char.name}! Today is your first day out of the academy and surprise!`);
  console.log('You find yourself already on a case. There is a small shopping center near down town and someone has called in a bomb threat!')
  console.log('Apparently the robot is getting maintenance so you have been sent in to locate the bomb and disarm it. Best of luck, you will need it! \n')
  setItemLocations();
}


// SET ITEM LOCATIONS
const setItemLocations = () => {
  for(let i = 0; i < storeKeys.length; i++) {
    deptKeys = Object.keys(stores[storeKeys[i]].departments)
    randomIndex = Math.floor(Math.random() * (deptKeys.length - 1) + 1);
    stores[storeKeys[i]]['departments'][deptKeys[randomIndex]].hasItem = true;   
  }
  setBombLocation();
}


// SET BOMB LOCATION
const setBombLocation = () => {
  const storeKeys = Object.keys(stores);
  randomStoreIndex = Math.floor(Math.random() * (storeKeys.length - 1) + 1);
  deptKeys = Object.keys(stores[storeKeys[randomStoreIndex]].departments);
  randomDeptIndex = Math.floor(Math.random() * (deptKeys.length - 1) + 1);
  stores[storeKeys[randomStoreIndex]]['departments'][deptKeys[randomDeptIndex]].hasBomb = true;
  chooseStore()
}




// CHECK DEPARTMENT CHOICE
const deptChoiceCheck = (dept, deptKeys,) => {
  dept = dept.toLowerCase();
  if (!deptKeys.includes(dept)) {
    validResponse();
    chooseDepartment();
  } else {
    currentDepartment = currentStore['departments'][dept]
    createSpace(1);
  }
}


// PICK A DEPARTMENT TO GO TO
const chooseDepartment = () => {
  if (currentStore === undefined) {
    chooseStore();
  } else {
    console.log('Which department would like you investigate?');
    try {
      console.log(`Your Current Location: ${currentStore['name']} Store - ${currentDepartment['name']} Department \n`)      
    } catch {
      console.log('')
    }
    deptKeys = Object.keys(currentStore.departments)
    deptKeys.forEach(dept => {
      console.log(` - ${currentStore['departments'][dept].name} (${dept}) \n`)
    })
    let choice = input();
    deptChoiceCheck(choice, deptKeys);
  }
}


// CHECK STORE CHOICE
const storeChoiceCheck = (store) => {
  store = store.toLowerCase();
  if (!storeKeys.includes(store)) {
    validResponse();
    chooseStore();
  } else {
    currentStore = stores[store]
    createSpace(1);
    chooseDepartment()
  }
}



// PICK A STORE TO GO TO
const chooseStore = () => {
  console.log('Which store would you like to investigate?')
  try {
    console.log(`Your Current Location: ${currentStore['name']} Store - ${currentDepartment['name']} Department \n`)      
  } catch {
    console.log('')
  }
  storeKeys.forEach(store => {
    console.log(` - ${stores[store].name} (${store}) \n`)
  })
  let choice = input();
  storeChoiceCheck(choice);
}



 // SEARCH CURRENT AREA
 const searchArea = () => {
   if(currentDepartment.hasItem) {
    let item = currentStore['item'].name
    if(char.heldItems.includes(item)) {
      console.log('You already found an item here. Time to move on.')
    } else {
      console.log('/////////////////////////')
      console.log(`//  You found ${item}!`)
      console.log('///////////////////////// \n')
      if (item === 'User Manual') {
        console.log("The manual tells you how to defuse a bomb!! \n")
        console.log(currentStore['item'].description +  "\n")
      }

      char.addItem(item)
    }
  } else {
    console.log('You did not find any items here.')
  }

  if(currentDepartment.hasBomb) {
    console.log('/////////////////////////')
    console.log('// You have located the bomb!');
    console.log('///////////////////////// \n')
    defuseBomb = true;    

  } else {
    console.log('The bomb is not here.')
  }
  console.log('')
  input('Press enter key to continue')
 }






// SHOW WELCOME MESSAGE
const welcomeMessage = () => {
  console.log('░██╗░░░░░░░██╗███████╗██╗░░░░░░█████╗░░█████╗░███╗░░░███╗███████╗  ████████╗░█████╗░');
  console.log('░██║░░██╗░░██║██╔════╝██║░░░░░██╔══██╗██╔══██╗████╗░████║██╔════╝  ╚══██╔══╝██╔══██╗');
  console.log('░╚██╗████╗██╔╝█████╗░░██║░░░░░██║░░╚═╝██║░░██║██╔████╔██║█████╗░░  ░░░██║░░░██║░░██║');
  console.log('░░████╔═████║░██╔══╝░░██║░░░░░██║░░██╗██║░░██║██║╚██╔╝██║██╔══╝░░  ░░░██║░░░██║░░██║');
  console.log('░░╚██╔╝░╚██╔╝░███████╗███████╗╚█████╔╝╚█████╔╝██║░╚═╝░██║███████╗  ░░░██║░░░╚█████╔╝');
  console.log('░░░╚═╝░░░╚═╝░░╚══════╝╚══════╝░╚════╝░░╚════╝░╚═╝░░░░░╚═╝╚══════╝  ░░░╚═╝░░░░╚════╝░');
  console.log('██████╗░░█████╗░███╗░░░███╗██████╗░  ░██████╗░██████╗░██╗░░░██╗░█████╗░██████╗░');
  console.log('██╔══██╗██╔══██╗████╗░████║██╔══██╗  ██╔════╝██╔═══██╗██║░░░██║██╔══██╗██╔══██╗');
  console.log('██████╦╝██║░░██║██╔████╔██║██████╦╝  ╚█████╗░██║██╗██║██║░░░██║███████║██║░░██║');
  console.log('██╔══██╗██║░░██║██║╚██╔╝██║██╔══██╗  ░╚═══██╗╚██████╔╝██║░░░██║██╔══██║██║░░██║');
  console.log('██████╦╝╚█████╔╝██║░╚═╝░██║██████╦╝  ██████╔╝░╚═██╔═╝░╚██████╔╝██║░░██║██████╔╝');
  console.log('╚═════╝░░╚════╝░╚═╝░░░░░╚═╝╚═════╝░  ╚═════╝░░░░╚═╝░░░░╚═════╝░╚═╝░░╚═╝╚═════╝░');
  console.log('');
}


// SHOW WELCOME MESSAGE
const failMessage = () => {
  createSpace(1);
  console.log(')     )    *     ');
  console.log('(  ( /(  ( /(  (  `    ');
  console.log('( )\ )\()) )\()) )\))(   ');
  console.log(')((_|(_)\ ((_)\ ((_)()\  ');
  console.log('((_)_  ((_)  ((_)(_()((_) ');
  console.log('| _ )/ _ \ / _ \|  \/  | ');
  console.log('| _ \ (_) | (_) | |\/| | ');
  console.log('|___/\___/ \___/|_|  |_| ');
  console.log('');
  console.log('The bomb blew up, you are dead...');
  gameRunning = false;
}



const winMessage = () => {
  console.log('__   __  _______  __   __    _______  _______  __   __  _______  ______     _______  __   __  _______    ______   _______  __   __ ');
  console.log('|  | |  ||       ||  | |  |  |       ||   _   ||  | |  ||       ||      |   |       ||  | |  ||       |  |      | |   _   ||  | |  |');
  console.log('|  |_|  ||   _   ||  | |  |  |  _____||  |_|  ||  |_|  ||    ___||  _    |  |_     _||  |_|  ||    ___|  |  _    ||  |_|  ||  |_|  |');
  console.log('|       ||  | |  ||  |_|  |  | |_____ |       ||       ||   |___ | | |   |    |   |  |       ||   |___   | | |   ||       ||       |');
  console.log('|_     _||  |_|  ||       |  |_____  ||       ||       ||    ___|| |_|   |    |   |  |       ||    ___|  | |_|   ||       ||_     _|');
  console.log('  |   |  |       ||       |   _____| ||   _   | |     | |   |___ |       |    |   |  |   _   ||   |___   |       ||   _   |  |   |  ');
  console.log('  |___|  |_______||_______|  |_______||__| |__|  |___|  |_______||______|     |___|  |__| |__||_______|  |______| |__| |__|  |___|  ');
  console.log('')
  console.log(`You earned ${points} points!!! Try to beat your best score! \n`)
  sleep(2000)
  gameRunning = false;
}











// HANDLE USERS CHOICE
const choiceSelection = (choice) => {
  if (choice === 'a') {
    searchArea();
  } else if (choice === 's') {
    chooseStore();
  } else if (choice === 'd') {
    chooseDepartment(currentStore);
  } else if (choice === 'i') {
    gameMoves++; // DON'T WANT TO TAKE A TURN JUST FOR CHECKING INVENTORY
    char.showInventory();
    input('Press enter key to continue.')
  } else if (choice === 'q') {
    gameRunning = false;
  } else if (choice === 'b') {
    defuser(); 
  } else {
    validResponse();
  }  
}


// DEFUSE THE BOMB, IF YOU CAN
const defuser = () => {
  if(char.heldItems.length === 3) {
    console.log('Which wire will you cut? \n');
    console.log('Red   (r) \n');
    console.log('Green (g) \n');
    console.log('Blue  (b) \n');
    choice = input();
    if(choice === 'r') {
      choice = 'Red';
    } else if(choice === 'g') {
      choice = 'Green'
    } else if(choice === 'b') {
      choice = 'Blue'
    } else {
      validResponse();
      defuser();
    }
    console.log(choice, wires[hotWire]);
    if (choice === wires[hotWire]) {
      winMessage();
    } else {
      failMessage();
    }
  } else {
    console.log("You don't have all the tools you need.")
    console.log("Keep searching! \n")
    input("Press enter key to continue")
  }
}



// MAIN GAME LOOP
while (gameRunning === true) {
  if (startMove === gameMoves) {
    welcomeMessage();
    setPlayer();
  } else if (gameMoves > 0) {
    createSpace();
    try {
      console.log(`Your Current Location: ${currentStore['name']} Store - ${currentDepartment['name']} Department`)
      console.log(`Time left: ${gameMoves}`)
    } catch {
      console.log(`Your Current Location: Store - Department`)
    }
    console.log('--- OPTIONS --- \n')
    console.log(' - Search current area (a) \n');
    console.log(' - Go To Store         (s) \n');
    console.log(' - Go To Department    (d) \n');
    console.log(' - Check Inventory     (i) \n');
    console.log(' - Quit                (q) \n');
    if (defuseBomb === true) {
      console.log(' - Defuse Bomb         (b) \n');
    }
  
    let choice = input();
    createSpace(1);
    choiceSelection(choice);
  } else {
    failMessage();
  }
  gameMoves--;
  points -= 25;
}