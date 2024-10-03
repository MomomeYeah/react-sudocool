export class Square {
    /* Class representing a single square on the Sudoku board.

    Each square knows what row, column, and section it is in, as well as the
    set of numbers that it could still possibly be set to. */

    constructor(row, col, value) {
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
            this.possibilities = Array(9).fill().map((x, i) => i + 1);
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

    removePossibility(possibility) {
        if (! this.solved ) {
            this.possibilities = this.possibilities.filter(item => item !== possibility);
        }
    }

    // given another square, if that other square is solved, and is in the same row, column, or section
    // as this square, then remove the other square's value from this square's list of possibilities
    removePossibilityIfConflicting(other) {
        if ( other.solved ) {
            if ( this.row === other.row || this.col === other.col || this.section === other.section ) {
                this.removePossibility(other.value);
            }
        }
    }

    removePossibilities(possibilities) {
        if (! this.solved) {
            this.possibilities = this.possibilities.filter(item => ! possibilities.includes(item));
        }
    }

    solve(possibility) {
        this.solved = true;
        this.value = possibility;
        this.possibilities = [];
    }

    hasPossibility(possibility) {
        return ! this.solved && this.possibilities.includes(possibility)
    }

    // given another square, return true if:
    // - the other square shares some or all of this square's possibilities
    // - the other square does not have exactly the same set of possibilities as this square
    hasPartialIntersect(square) {
        const this_set = new Set(this.possibilities);
        const other_set = new Set(square.possibilities);

        return this_set.difference(other_set).size > 0 && this_set.intersection(other_set).size > 0;
    }
}