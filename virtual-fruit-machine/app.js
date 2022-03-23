//Phorest Graduate Programme Technical Challenge
//Virtual Fruit Machine
//By Yohane Neumann

const output = document.querySelector('.myDiv');

const itemColors = ['<div style="background-color:black; color:black">b</div>', '<div style="background-color:white; color: white">w</div>', '<div style="background-color:green; color:green" >g</div>', '<div style="background-color:yellow; color:yellow" >y</div>'];

//Create the elements
const topMessage = makerElement(output, 'div', 'Virtual Fruit Machine', 'topMessage');
const message = makerElement(output, 'div', '', 'message');

const gameArea = makerElement(output, 'div', ' ', 'gameArea');
const btn = makerElement(output, 'button', 'SPIN', 'btn');

//Create elements to contain game content, information element, button for interaction and main content element
const game = {
    total: 4,//Adjustable number of wheels
    inPlay: false,//Start or stop the game
    coins: 50,//Initial amount of money the user has to play the game
    jackpot: 500,//Total amount of money in the machine
    speed: 5,//Speed of the spining
    totItems: itemColors.length,//4 colours
    main: [],
};

let spinner = 500; //How many rotations

//Create and launch game board makers when DOM is loaded
window.addEventListener('DOMContentLoaded', init);
//Add an event listener to make the button clickable and a function for spinning the slot machine wheels whenever the user clicks the button
btn.addEventListener('click', (e) => {
    if (btn.textContent == 'SPIN' && !game.inPlay) { 
        btn.textContent = 'STOP';
        btn.style.backgroundColor = 'red';
        spinner = 500;
        startSpin();
    } else {
        stopGamePlay();
        game.inPlay = false;
    }
})

//It is used to create and launch the gameboard 
function init() {
    btn.style.backgroundColor = 'green';
    gameArea.style.width = game.total * 102 + 'px';
    let leftPos = (document.body.clientWidth - (game.total * 100)) / 2;
    gameArea.style.left = leftPos + 'px';

    for (let i = 0; i < game.total; i++) {
        game.main[i] = makerElement(gameArea, 'div', '', 'wheel')
        for (let x = 0; x < game.totItems; x++) {
            const el = makerElement(game.main[i], 'div', itemColors[x], 'box');
            el.faceValue = x + 1;//Tracking numerically what the face value is
        }
        game.main[i].style.left = i * 100 + 'px'; //Moves the wheels over
    }
}

//Element maker function
function makerElement(parent, ele, html, myClass) {
    const el = document.createElement(ele);
    el.classList.add(myClass);
    el.innerHTML = html;
    parent.append(el);//Method puts a set of node objects or DOMString objects behind the last child of the element.
    return el;

}

//Updates the message shown to the player
function updateMessage(html) {
    message.innerHTML = html;
}

//It quicks off the spining
function startSpin() {
    game.coins--;//Takes 1 coin from the user everytime they play
    updateMessage(`You have ${game.coins} left`);//Used to add user message information
    game.inPlay = true;
    spinner = 500;
    for (let i = 0; i < game.total; i++) {
        game.main[i].mover = Math.floor(Math.random() * 150) + 10;
    }
    game.ani = requestAnimationFrame(spin);
    //Tells the browser that you wish to perform an animation and requests that the browser calls a specified function to update an animation before the next repaint
}

//Function for spinning the slot machine
function spin() {
    spinner--;
    if (spinner <= 0) {
        stopGamePlay();
    }
    let holder = [];//Holder array to add all the elements, helps controling count and check whether all the spining is complete 
    for (let i = 0; i < game.total; i++) {
        let el = game.main[i];
        let elY = el.offsetTop;
        if (el.mover > 0) {
            el.mover--;
            elY += game.speed;
            if (elY > -150) {
                elY -= 100;
                const last = el.lastElementChild;
                el.prepend(last);
            }
            if (el.mover == 0 && elY % 100 != 0) {
                el.mover++;
            }
            el.style.top = elY + 'px';
        } else {
            let viewEl = el.children[2];
            let outputVal = elY == -200 ? viewEl.faceValue : '-';
            let tempObj = {
                'txt': viewEl.faceValue,
                'elY': elY,
                'outputV': outputVal,
                'output': viewEl.textContent,
            }
            holder.push(tempObj);
        }
    }
    //If all the spining is complete
    if (holder.length >= game.total) {
        stopGamePlay();
        holder.sort();
        console.log(holder);
        const myObj = {};
        holder.forEach((val) => {
            if (val.outputV != '-') {
                if (myObj[val.outputV]) {
                    myObj[val.outputV]++;
                } else {
                    myObj[val.outputV] = 1;
                }
            }
        })
        payout(myObj);
    }
    if (game.inPlay) {
        game.ani = requestAnimationFrame(spin);
    }
}

//Create a function that can track the values and has conditions to adjust the payout value accordingly
function payout(score) {
    for (const prop in score) {
        let val = Number(score[prop]);//How many occurances
        console.log(prop + ' x ' + val);
        if (val == 4) {//How many times a color comes up
            let pay = game.coins + game.jackpot;
            console.log('You Won');
            let html = `You Won! Jackpot: ${game.jackpot} Coins ${game.coins}`;
            updateMessage(html);
            game.coins += game.jackpot;//Updates the total amount of money the user has after wining
        } else {
            console.log('You Lost');
            let html = `You Lost! You have ${game.coins} coins left`;
            updateMessage(html);
        }

    }
}
//Stop the game
function stopGamePlay() {
    game.inPlay = false;
    cancelAnimationFrame(game.ani);
    btn.textContent = 'SPIN'
    btn.style.backgroundColor = 'green';
}

