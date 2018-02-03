"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DiceRoller = /** @class */ (function () {
    function DiceRoller(numberOfDice, sides) {
        if (sides === void 0) { sides = 6; }
        this._numberOfDice = numberOfDice;
        this._sides = sides;
    }
    DiceRoller.prototype.roll = function () {
        var numbers = [];
        for (var i = 0; i < this._numberOfDice; i++) {
            numbers.push(Math.ceil(Math.random() * this._sides));
        }
        return numbers.reduce(function (prev, num) { return prev + num; });
    };
    return DiceRoller;
}());
exports.DiceRoller = DiceRoller;
