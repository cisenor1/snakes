import { Tile } from "./Tile";

export interface GameBoardParameters {
    /** Total number of tiles on the board. Defaults to 100. */
    tileCount?: number;
    /** Total number of snakes on the board. Defaults to 5. */
    numberOfSnakes?: number;
    /** Total number of ladders on the board. Defaults to 5. */
    numberOfLadders?: number;
    /** Total number of spaces a snake is allowed to send the player back. Defaults to 20. */
    maxSnakeLength?: number;
    /** Total number of spaces a ladder is allowed to send the player forward. Defaults to 20 */
    maxLadderLength?: number;
}

export class GameBoard {
     _tiles: Tile[] = [];
    private _snakes: number;
    private _ladders: number;
    private _boardWidth: number;
    private _maxSnakeLength: number;
    private _maxLadderLength: number;

    constructor(config: GameBoardParameters) {
        const tileCount = config.tileCount || 100;
        this._snakes = config.numberOfSnakes || 5;
        this._ladders = config.numberOfLadders || 5;
        this._maxSnakeLength = config.maxSnakeLength || 15;
        this._maxLadderLength = config.maxLadderLength || 15;
        this._boardWidth = Math.ceil(Math.sqrt(tileCount));
        let tileNumber = 1;
        while (this.boardLength() < tileCount) {
            this._tiles.push(new Tile(tileNumber));
            tileNumber++;
        }
        this._decorateBoard();
    }

    /** Return the current length of the board. */
    boardLength(): number {
        return this._tiles.length;
    }

    private randomIntFromInterval(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    private _decorateBoard() {
        // Add snakes. Can't be any tile before 1 + maxSnakeLength and can't be the last tile.
        let snakeCeiling = this.boardLength() -2;
        let snakeFloor = 1 + this._maxSnakeLength;
        for (let snake = 0; snake < this._snakes; snake++) {
            let headNumber = this.randomIntFromInterval(snakeFloor, snakeCeiling);
            let newSnakeHead = this.getTileByNumber(headNumber); 
            if (newSnakeHead.isSnakeTop()){
                headNumber = this.randomIntFromInterval(snakeFloor, snakeCeiling);
                newSnakeHead = this.getTileByNumber(headNumber); 
            }
            let newSnakeTail = this.getTileByNumber(headNumber - this.randomIntFromInterval(2, this._maxSnakeLength));
            newSnakeHead.setSnakeTile(newSnakeTail);
        }
        // Add Ladders. Can't be any tile after tileLength - maxLadderLength 
        let ladderCeiling = this._tiles.length - this._maxLadderLength;
        let ladderFloor = 1;
        for (let ladder = 0; ladder < this._ladders; ladder++) {
            let bottomNumber = this.randomIntFromInterval(ladderFloor, ladderCeiling);
            let ladderBottom = this.getTileByNumber(bottomNumber); 
            if (ladderBottom.isLadderBottom()){
                bottomNumber = this.randomIntFromInterval(snakeFloor, snakeCeiling);
                ladderBottom = this.getTileByNumber(bottomNumber); 
            }
            let ladderTop = this.getTileByNumber(bottomNumber + this.randomIntFromInterval(2, this._maxLadderLength));
            ladderBottom.setLadderTile(ladderTop);
        }
    }

    getTile(x: number, y: number): Tile {
        return this._tiles[((y * this._boardWidth) + x)];
    }
    getTileByNumber(number: number) {
        if (number >= this._tiles.length - 1) {
            return this._tiles[this._tiles.length - 1];
        }
        return this._tiles[number];
    }

    clearResidents() {
        this._tiles.forEach((t) => t.residents.length = 0)
    }

    toString(): string {
        // Calculate the dimensions of the board.
        const tileCount = this._tiles.length;
        const totalRows = Math.ceil(Math.sqrt(tileCount));
        const totalColumns = Math.ceil(Math.sqrt(tileCount)); // Because each tile handles it's own width, we only care about the tile columns
        let output = "";
        for (let x = totalRows - 1; x >= 0; x--) {// Draw each sub row.
            for (let subRow = 0; subRow < this._tiles[0].height; subRow++) {
                for (let y = 0; y < totalColumns; y++) {
                    const tile = this.getTile(y, x);
                    output += tile.getRow(subRow);
                }
                output += "\n";
            }
        }

        return output;
    }
}