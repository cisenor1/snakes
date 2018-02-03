export class Tile {
    private _linkedTile?: Tile;
    private _ladderBottom = false;
    private _snakeTop = false;
    height: number;
    width: number;
    tileNumber: string;
    private numberSpacing = 3;
    residents: string[] = [];
    /**
     * Create a new tile object.
     */
    constructor(tileNumber: number) {
        this.height = 6;
        this.width = 8;
        this.tileNumber = this.groomNumber(tileNumber);
    }

    private groomNumber(n: number): string {
        let s = n.toString();
        let padding = "";
        for (let i = 0; i < this.numberSpacing - s.length; i++) {
            padding += "0";
        }
        return padding + s;
    }

    isSnakeTop(): boolean {
        return this._snakeTop;
    }
    isLadderBottom(): boolean {
        return this._ladderBottom;
    }

    landed(player: string) {
        this.residents.push(player);

    }

    getLinkedTile(): Tile {
        if (!this._linkedTile) {
            throw new Error("TileNotLinked");
        }
        return this._linkedTile;
    }
    setSnakeTile(tile:Tile):void{
        this._linkedTile = tile;
        this._snakeTop = true;
    }
    setLadderTile(tile:Tile):void{
        this._linkedTile = tile;
        this._ladderBottom = true;
    }

    left(player: string) {
        this.residents = this.residents.filter((p) => p != player);
    }
    getRow(rowNumber: number): string {
        // Top and bottom rows have corners.
        if (rowNumber == 0 || rowNumber == this.height - 1) {
            let output = "+";
            for (let i = 0; i < this.width - 2; i++) {
                output += "-";
            }
            output += "+";
            return output;
        }

        // return number row.
        if (rowNumber == 1) {
            let output = "|" + this.tileNumber;
            for (let i = 0; i < this.width - 2 - this.numberSpacing; i++) {
                output += " ";
            }
            output += "|";
            return output;
        }

        // Any Effects?
        if (rowNumber == 2 && this.isLadderBottom()){
            let output = "|L";
            for (let i = 0; i < this.width - 3; i++) {
                output += " ";
            }
            output += "|";
            return output;
        }else if (rowNumber == 2 && this.isSnakeTop()){
            let output = "|S";
            for (let i = 0; i < this.width - 3; i++) {
                output += " ";
            }
            output += "|";
            return output; 
        }

        // Any Residents
        if (rowNumber == 4) {
            let output = "|";
            for (let resident = 0; resident < this.residents.length; resident++) {
                const element = this.residents[resident];
                output += element;
            }
            for (let i = 0; i < this.width - 2 - this.residents.length; i++) {
                output += " ";
            }
            output += "|";
            return output;
        }

        // rest are bars or spaces.
        let output = "|";
        for (let i = 0; i < this.width - 2; i++) {
            output += " ";
        }
        output += "|";
        return output;
    }
}