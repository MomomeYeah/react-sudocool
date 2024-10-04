export class Square {
    /* Class representing a single square on the Sudoku board.

    Each square knows what row, column, and section it is in, as well as the
    set of numbers that it could still possibly be set to. */

    public row: number;
    public col: number;
    public section: number;
    public value: number | null;
    public solved: boolean;
    public possibilities: Array<number>;

    constructor(row: number, col: number, value: number) {
        this.row = row;
        this.col = col;
        this.section = Math.floor(col / 3) + 3 * Math.floor(row / 3);

        if (value) {
            this.value = value;
            this.solved = true;
            this.possibilities = [];
        } else {
            this.value = null;
            this.solved = false;
            this.possibilities = Array(9).fill(0).map((value, index) => index + 1);
        }
    }

    toString() {
        return `
            Row: ${this.row}
            Column: ${this.col}
            Section: ${this.section}
            Value: ${this.value}
            Solved: ${this.solved}
            Possibilities: ${this.possibilities.toString()}`;
    }

    removePossibility(possibility: number) {
        if (! this.solved ) {
            this.possibilities = this.possibilities.filter(item => item !== possibility);
        }
    }

    // given another square, if that other square is solved, and is in the same row, column, or section
    // as this square, then remove the other square's value from this square's list of possibilities
    removePossibilityIfConflicting(other: Square) {
        if ( other.solved && other.value ) {
            if ( this.row === other.row || this.col === other.col || this.section === other.section ) {
                this.removePossibility(other.value);
            }
        }
    }

    removePossibilities(possibilities: Array<number>) {
        if (! this.solved) {
            this.possibilities = this.possibilities.filter(item => ! possibilities.includes(item));
        }
    }

    solve(possibility: number) {
        this.solved = true;
        this.value = possibility;
        this.possibilities = [];
    }

    hasPossibility(possibility: number) {
        return ! this.solved && this.possibilities.includes(possibility)
    }
}