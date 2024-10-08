import { Square } from './square';

class SquareSet {
    /* Class representing a row, column, or section on a Sudoku board */

    public possibilities: Array<string>;
    public squares: Array<Square>;

    constructor(defaultPossibilities: Array<string>) {
        this.possibilities = defaultPossibilities.slice();
        this.squares = [];
    }

    solved() {
        return this.possibilities.length === 0
    }

    removePossibility(possibility: string) {
        this.possibilities = this.possibilities.filter(item => item !== possibility);
    }
}

export class Row extends SquareSet {};
export class Column extends SquareSet {};
export class Section extends SquareSet {};