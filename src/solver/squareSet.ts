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

    containsClashesWith(square: Square) {
        // if the given square isn't contained in this set, no clash exists
        if ( ! this.squares.includes(square) ) return false;

        // if the given square isn't solved, no clash exists
        if ( ! square.solved ) return false;

        // a clash exists if multiple solved squares exist in this set that have the same value
        return this.squares.filter(squareInSet => squareInSet.solved && squareInSet.value === square.value).length > 1;
    }
}

export class Row extends SquareSet {};
export class Column extends SquareSet {};
export class Section extends SquareSet {};