"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Tile = /** @class */ (function () {
    /**
     * Create a new tile object.
     */
    function Tile(tileNumber) {
        this._ladderBottom = false;
        this._snakeTop = false;
        this.numberSpacing = 3;
        this.residents = [];
        this.height = 6;
        this.width = 8;
        this.tileNumber = this.groomNumber(tileNumber);
    }
    Tile.prototype.groomNumber = function (n) {
        var s = n.toString();
        var padding = "";
        for (var i = 0; i < this.numberSpacing - s.length; i++) {
            padding += "0";
        }
        return padding + s;
    };
    Tile.prototype.isSnakeTop = function () {
        return this._snakeTop;
    };
    Tile.prototype.isLadderBottom = function () {
        return this._ladderBottom;
    };
    Tile.prototype.landed = function (player) {
        this.residents.push(player);
    };
    Tile.prototype.getLinkedTile = function () {
        if (!this._linkedTile) {
            throw new Error("TileNotLinked");
        }
        return this._linkedTile;
    };
    Tile.prototype.setSnakeTile = function (tile) {
        this._linkedTile = tile;
        this._snakeTop = true;
    };
    Tile.prototype.setLadderTile = function (tile) {
        this._linkedTile = tile;
        this._ladderBottom = true;
    };
    Tile.prototype.left = function (player) {
        this.residents = this.residents.filter(function (p) { return p != player; });
    };
    Tile.prototype.getRow = function (rowNumber) {
        // Top and bottom rows have corners.
        if (rowNumber == 0 || rowNumber == this.height - 1) {
            var output_1 = "+";
            for (var i = 0; i < this.width - 2; i++) {
                output_1 += "-";
            }
            output_1 += "+";
            return output_1;
        }
        // return number row.
        if (rowNumber == 1) {
            var output_2 = "|" + this.tileNumber;
            for (var i = 0; i < this.width - 2 - this.numberSpacing; i++) {
                output_2 += " ";
            }
            output_2 += "|";
            return output_2;
        }
        // Any Effects?
        if (rowNumber == 2 && this.isLadderBottom()) {
            var output_3 = "|L";
            for (var i = 0; i < this.width - 3; i++) {
                output_3 += " ";
            }
            output_3 += "|";
            return output_3;
        }
        else if (rowNumber == 2 && this.isSnakeTop()) {
            var output_4 = "|S";
            for (var i = 0; i < this.width - 3; i++) {
                output_4 += " ";
            }
            output_4 += "|";
            return output_4;
        }
        // Any Residents
        if (rowNumber == 4) {
            var output_5 = "|";
            for (var resident = 0; resident < this.residents.length; resident++) {
                var element = this.residents[resident];
                output_5 += element;
            }
            for (var i = 0; i < this.width - 2 - this.residents.length; i++) {
                output_5 += " ";
            }
            output_5 += "|";
            return output_5;
        }
        // rest are bars or spaces.
        var output = "|";
        for (var i = 0; i < this.width - 2; i++) {
            output += " ";
        }
        output += "|";
        return output;
    };
    return Tile;
}());
exports.Tile = Tile;
