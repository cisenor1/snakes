export class DiceRoller {
    private _numberOfDice: number; 
    private _sides:number;
    constructor(numberOfDice: number, sides:number = 6) {
        this._numberOfDice = numberOfDice;
        this._sides = sides;
    }
    roll(): number {
        let numbers = [];
        for (let i = 0; i < this._numberOfDice; i++) {
            numbers.push(Math.ceil(Math.random() * this._sides));
        }
        return numbers.reduce((prev,num)=>prev+num);
    }
}