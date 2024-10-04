import { Square } from './square';

class SquareSet {
    /* Class representing a row, column, or section on a Sudoku board */

    public possibilities: Array<number>;
    public squares: Array<Square>;

    constructor() {
        this.possibilities = Array(9).fill(0).map((value, index) => index + 1);
        this.squares = [];
    }

    solved() {
        return this.possibilities.length === 0
    }

    removePossibility(possibility: number) {
        this.possibilities = this.possibilities.filter(item => item !== possibility);
    }
}

export class Row extends SquareSet {};
export class Column extends SquareSet {};
export class Section extends SquareSet {};