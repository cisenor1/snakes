"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var GameBoard_1 = require("../models/GameBoard");
var chai_1 = require("chai");
require("mocha");
var DiceRoller_1 = require("../models/DiceRoller");
describe("Test Board Creation", function () {
    it("Create a board and make sure it has the correct number of tiles.", function () {
        var defaultBoard = new GameBoard_1.GameBoard({});
        var largeBoard = new GameBoard_1.GameBoard({ tileCount: 1000 });
        chai_1.expect(defaultBoard.boardLength()).to.equal(100);
        chai_1.expect(largeBoard.boardLength()).to.equal(1000);
    });
    it("Test that we get the proper tiles.", function () {
        var defaultBoard = new GameBoard_1.GameBoard({});
        var tile = defaultBoard.getTile(9, 9);
        chai_1.expect(tile.tileNumber).to.equal("100");
        var tile1 = defaultBoard.getTile(0, 0);
        chai_1.expect(tile1.tileNumber).to.equal("001");
    });
    it("Ensure we've made the right number of snakes and ladders.", function () {
        var s = 12;
        var l = 10;
        var defaultBoard = new GameBoard_1.GameBoard({ numberOfLadders: l, numberOfSnakes: s });
        var snakes = defaultBoard._tiles.filter(function (t) { return t.isSnakeTop(); });
        var ladders = defaultBoard._tiles.filter(function (t) { return t.isLadderBottom(); });
        chai_1.expect(snakes.length).to.equal(s);
        chai_1.expect(ladders.length).to.equal(l);
    });
    it("Ensure the last tile isn't a snake", function () {
        var defaultBoard = new GameBoard_1.GameBoard({});
        var tile = defaultBoard.getTileByNumber(defaultBoard._tiles.length - 1);
        chai_1.expect(tile.isSnakeTop()).to.equal(false);
    });
});
describe("Test Dice Roller", function () {
    it("Ensure that with 2 dice we can never get 1", function () {
        var roller = new DiceRoller_1.DiceRoller(2);
        for (var index = 0; index < 3000; index++) {
            var output = roller.roll();
            chai_1.expect(output).is.not.lessThan(2);
            chai_1.expect(output).is.not.greaterThan(12);
        }
    });
});
