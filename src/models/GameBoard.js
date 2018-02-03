"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Tile_1 = require("./Tile");
var GameBoard = /** @class */ (function () {
    function GameBoard(config) {
        this._tiles = [];
        var tileCount = config.tileCount || 100;
        this._snakes = config.numberOfSnakes || 5;
        this._ladders = config.numberOfLadders || 5;
        this._maxSnakeLength = config.maxSnakeLength || 15;
        this._maxLadderLength = config.maxLadderLength || 15;
        this._boardWidth = Math.ceil(Math.sqrt(tileCount));
        var tileNumber = 1;
        while (this.boardLength() < tileCount) {
            this._tiles.push(new Tile_1.Tile(tileNumber));
            tileNumber++;
        }
        this._decorateBoard();
    }
    /** Return the current length of the board. */
    GameBoard.prototype.boardLength = function () {
        return this._tiles.length;
    };
    GameBoard.prototype.randomIntFromInterval = function (min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    };
    GameBoard.prototype._decorateBoard = function () {
        // Add snakes. Can't be any tile before 1 + maxSnakeLength and can't be the last tile.
        var snakeCeiling = this.boardLength() - 2;
        var snakeFloor = 1 + this._maxSnakeLength;
        for (var snake = 0; snake < this._snakes; snake++) {
            var headNumber = this.randomIntFromInterval(snakeFloor, snakeCeiling);
            var newSnakeHead = this.getTileByNumber(headNumber);
            if (newSnakeHead.isSnakeTop()) {
                headNumber = this.randomIntFromInterval(snakeFloor, snakeCeiling);
                newSnakeHead = this.getTileByNumber(headNumber);
            }
            var newSnakeTail = this.getTileByNumber(headNumber - this.randomIntFromInterval(2, this._maxSnakeLength));
            newSnakeHead.setSnakeTile(newSnakeTail);
        }
        // Add Ladders. Can't be any tile after tileLength - maxLadderLength 
        var ladderCeiling = this._tiles.length - this._maxLadderLength;
        var ladderFloor = 1;
        for (var ladder = 0; ladder < this._ladders; ladder++) {
            var bottomNumber = this.randomIntFromInterval(ladderFloor, ladderCeiling);
            var ladderBottom = this.getTileByNumber(bottomNumber);
            if (ladderBottom.isLadderBottom()) {
                bottomNumber = this.randomIntFromInterval(snakeFloor, snakeCeiling);
                ladderBottom = this.getTileByNumber(bottomNumber);
            }
            var ladderTop = this.getTileByNumber(bottomNumber + this.randomIntFromInterval(2, this._maxLadderLength));
            ladderBottom.setLadderTile(ladderTop);
        }
    };
    GameBoard.prototype.getTile = function (x, y) {
        return this._tiles[((y * this._boardWidth) + x)];
    };
    GameBoard.prototype.getTileByNumber = function (number) {
        if (number >= this._tiles.length - 1) {
            return this._tiles[this._tiles.length - 1];
        }
        return this._tiles[number];
    };
    GameBoard.prototype.clearResidents = function () {
        this._tiles.forEach(function (t) { return t.residents.length = 0; });
    };
    GameBoard.prototype.toString = function () {
        // Calculate the dimensions of the board.
        var tileCount = this._tiles.length;
        var totalRows = Math.ceil(Math.sqrt(tileCount));
        var totalColumns = Math.ceil(Math.sqrt(tileCount)); // Because each tile handles it's own width, we only care about the tile columns
        var output = "";
        for (var x = totalRows - 1; x >= 0; x--) {
            for (var subRow = 0; subRow < this._tiles[0].height; subRow++) {
                for (var y = 0; y < totalColumns; y++) {
                    var tile = this.getTile(y, x);
                    output += tile.getRow(subRow);
                }
                output += "\n";
            }
        }
        return output;
    };
    return GameBoard;
}());
exports.GameBoard = GameBoard;
