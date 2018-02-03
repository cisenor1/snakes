"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var GameBoard_1 = require("./models/GameBoard");
var DiceRoller_1 = require("./models/DiceRoller");
var Actions = /** @class */ (function () {
    function Actions() {
    }
    Actions.ROLL = "r";
    Actions.QUIT = "q";
    Actions.NOTHING = "n";
    return Actions;
}());
function initializeBoard() {
    var boardParams = {
        tileCount: 6 * 6,
        maxLadderLength: 6,
        maxSnakeLength: 5,
        numberOfLadders: 12,
        numberOfSnakes: 10
    };
    return new GameBoard_1.GameBoard(boardParams);
}
function initializeGameState(board, diceRoller) {
    return {
        board: board,
        lastCommandSent: "",
        firstPlayersTurn: true,
        xPosition: 0,
        oPosition: 0,
        turnEnded: false,
        diceRoller: diceRoller,
        currentAction: Actions.NOTHING,
        nextMessage: "",
        messages: [],
        stats: {
            o: {
                laddersHit: 0,
                snakesHit: 0,
                turns: 0
            },
            x: {
                laddersHit: 0,
                snakesHit: 0,
                turns: 0
            }
        }
    };
}
function initializeStdIn() {
    process.stdin.setEncoding('utf8');
    process.stdin.setRawMode(true);
}
function initializeDiceRoller() {
    var sides = 6;
    var count = 2;
    return new DiceRoller_1.DiceRoller(count, sides);
}
function main() {
    var board = initializeBoard();
    var diceRoller = initializeDiceRoller();
    var state = initializeGameState(board, diceRoller);
    // Set up keylistener
    process.stdin.on('data', function (chunk, key) {
        state.lastCommandSent = chunk;
        GameLoop(state);
    });
    // Kick off game loop.
    GameLoop(state);
}
/**
 * Choose whether the input means Roll or Quit or bunk key presses.
 * @param state
 */
function processInput(state) {
    var input = state.lastCommandSent;
    if (!input.length) {
        return Actions.NOTHING;
    }
    switch (input.charAt(0).toLowerCase()) {
        case Actions.ROLL:
            return Actions.ROLL;
        case Actions.QUIT:
            return Actions.QUIT;
        default:
            return Actions.NOTHING;
    }
}
/**
 * Returns whether or not the user has ended their turn.
 * @param action
 */
function handleInput(state, action) {
    var turnEnded = false;
    // Clear the messages array.
    switch (action) {
        case Actions.QUIT:
            console.log("Exiting...");
            process.exit(0);
            return true;
        case Actions.ROLL:
            // Essentially the starting point of a new turn.
            state.messages = [];
            // Do roll,
            var p = state.firstPlayersTurn ? "X" : "O";
            state.messages.push(p + ": Rolling...");
            var roll = state.diceRoller.roll();
            state.messages.push(p + ": Got: " + roll.toString());
            if (state.firstPlayersTurn) {
                state.xPosition += roll;
            }
            else {
                state.oPosition += roll;
            }
            // Move active player. 
            state.lastCommandSent = Actions.NOTHING;
            return true;
        default:
            return false;
    }
}
function handleOutputFromLastFrame(state) {
    // Get input from last cycle.
    var action = processInput(state);
    state.turnEnded = handleInput(state, action);
}
function getThisFramesInput(state) {
    var player = state.firstPlayersTurn ? "X" : "O";
    console.log(player + "'s turn.");
    console.log(player + ': Choose an action: R:Roll, Q:Quit:');
}
function draw(state) {
    console.clear();
    console.log(state.board.toString());
    for (var i = 0; i < state.messages.length; i++) {
        var element = state.messages[i];
        console.log(element);
    }
}
/**
 * Returns whether or not the player hit a special tile.
 * @param state
 */
function checkXPositionForObstacles(state) {
    var xTile = state.board.getTileByNumber(state.xPosition);
    if (xTile.isLadderBottom()) {
        var linked = xTile.getLinkedTile();
        state.xPosition = +linked.tileNumber;
        state.stats.x.laddersHit++;
        state.messages.push("X hit a ladder!. Moving to tile " + ((+linked.tileNumber) + 1).toString() + "!");
        return true;
    }
    else if (xTile.isSnakeTop()) {
        var linked = xTile.getLinkedTile();
        state.xPosition = +linked.tileNumber;
        state.stats.x.snakesHit++;
        state.messages.push("X hit a snake!. Moving to tile " + ((+linked.tileNumber) + 1).toString() + "!");
        return true;
    }
    return false;
}
/**
 * Returns whether or not the player hit a special tile.
 * @param state
 */
function checkOPositionForObstacles(state) {
    var oTile = state.board.getTileByNumber(state.oPosition);
    if (oTile.isLadderBottom()) {
        var linked = oTile.getLinkedTile();
        state.oPosition = +linked.tileNumber;
        state.stats.o.laddersHit++;
        state.messages.push("O hit a ladder!. Moving to tile " + ((+linked.tileNumber) + 1).toString() + "!");
        return true;
    }
    else if (oTile.isSnakeTop()) {
        var linked = oTile.getLinkedTile();
        state.oPosition = +linked.tileNumber;
        state.stats.o.snakesHit++;
        state.messages.push("O hit a snake!. Moving to tile " + ((+linked.tileNumber) + 1).toString() + "!");
        return true;
    }
    return false;
}
/**
 * Determine where the players landed.
 * @param state
 */
function checkLanding(state) {
    var landedOnSomething = "";
    var xTile = state.board.getTileByNumber(state.xPosition);
    var oTile = state.board.getTileByNumber(state.oPosition);
    // Handle landings
    if (state.firstPlayersTurn) {
        state.messages.push("X moved to tile " + xTile.tileNumber);
        return checkXPositionForObstacles(state);
    }
    else {
        state.messages.push("O moved to tile " + oTile.tileNumber);
        return checkOPositionForObstacles(state);
    }
}
function updatePositionsAndRedraw(state) {
    var landedOnSomething = "";
    state.board.clearResidents();
    var xTile = state.board.getTileByNumber(state.xPosition);
    var oTile = state.board.getTileByNumber(state.oPosition);
    xTile.landed("X");
    oTile.landed("O");
    if (checkLanding(state)) {
        return updatePositionsAndRedraw(state);
    }
    draw(state);
}
/**
 * Did someone win yet?
 * @param state
 */
function checkWinConditions(state) {
    // Check win conditions
    if (state.xPosition >= state.board.boardLength()) {
        logStats(state);
        console.log("X Wins!");
        process.exit(0);
    }
    if (state.oPosition >= state.board.boardLength()) {
        logStats(state);
        console.log("O Wins!");
        process.exit(0);
    }
}
/**
 * Just for fun.
 * @param state
 */
function logStats(state) {
    console.log("Stats              x     0");
    console.log("---------------------------");
    console.log("Turns              " + state.stats.x.turns.toString() + "   " + state.stats.o.turns.toString());
    console.log("Ladders Climbed    " + state.stats.x.laddersHit.toString() + "   " + state.stats.o.laddersHit.toString());
    console.log("Snakes Hit         " + state.stats.x.snakesHit.toString() + "   " + state.stats.o.snakesHit.toString());
}
/**
 * If the turn's ended, make sure the state reflects that.
 * @param state
 */
function checkThatTurnHasEnded(state) {
    if (state.turnEnded) {
        // Handle stats
        if (state.firstPlayersTurn) {
            state.stats.x.turns++;
        }
        else {
            state.stats.o.turns++;
        }
        // Switch players
        state.firstPlayersTurn = !state.firstPlayersTurn;
        state.turnEnded = false;
    }
}
/**
 * Main game loop.
 * @param state
 */
function GameLoop(state) {
    handleOutputFromLastFrame(state);
    updatePositionsAndRedraw(state);
    checkWinConditions(state);
    checkThatTurnHasEnded(state);
    getThisFramesInput(state);
}
// Entry point
main();
