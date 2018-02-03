import { GameBoard } from "../models/GameBoard";
import { expect } from 'chai';
import 'mocha';
import { DiceRoller } from "../models/DiceRoller";

describe("Test Board Creation", () => {
    it("Create a board and make sure it has the correct number of tiles.", () => {
        const defaultBoard = new GameBoard({});
        const largeBoard = new GameBoard({ tileCount: 1000 });
        expect(defaultBoard.boardLength()).to.equal(100);
        expect(largeBoard.boardLength()).to.equal(1000);
    });
    it("Test that we get the proper tiles.", () => {
        const defaultBoard = new GameBoard({});
        const tile = defaultBoard.getTile(9,9);
        expect(tile.tileNumber).to.equal("100");
        const tile1 = defaultBoard.getTile(0,0);
        expect(tile1.tileNumber).to.equal("001");
    });
    it("Ensure we've made the right number of snakes and ladders.",()=>{
        let s = 12;
        let l = 10;
        const defaultBoard = new GameBoard({numberOfLadders:l, numberOfSnakes:s});
        let snakes = defaultBoard._tiles.filter((t)=>t.isSnakeTop());
        let ladders = defaultBoard._tiles.filter((t)=>t.isLadderBottom());
        expect (snakes.length).to.equal(s);
        expect(ladders.length).to.equal(l);
    });
    it("Ensure the last tile isn't a snake",()=>{
        const defaultBoard = new GameBoard({}); 
        const tile = defaultBoard.getTileByNumber(defaultBoard._tiles.length -1);
        expect(tile.isSnakeTop()).to.equal(false);
    });
});

describe("Test Dice Roller", () => {
    it("Ensure that with 2 dice we can never get 1", () => {
        const roller = new DiceRoller(2);
        for (let index = 0; index < 3000; index++) {
            let output = roller.roll();
            expect(output).is.not.lessThan(2);
            expect(output).is.not.greaterThan(12);
        }
    });
});