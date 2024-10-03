class SquareSet {
    /* Class representing a row, column, or section on a Sudoku board */

    constructor() {
        this.possibilities = Array(9).fill().map((x, i) => i + 1);
    }

    solved() {
        return this.possibilities.length === 0
    }

    removePossibility(possibility) {
        this.possibilities = this.possibilities.filter(item => item !== possibility);
    }
}

export class Row extends SquareSet {};
export class Column extends SquareSet {};
export class Section extends SquareSet {};