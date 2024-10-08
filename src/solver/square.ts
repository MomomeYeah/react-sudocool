export class Square {
    /* Class representing a single square on the Sudoku board.

    Each square knows what row, column, and section it is in, as well as the
    set of values that it could still possibly be set to. */

    public row: number;
    public col: number;
    public section: number;
    public value: string | null;
    public solved: boolean;
    public possibilities: Array<string>;

    constructor(row: number, col: number, section: number, defaultPossibilities: Array<string>, value: string) {
        this.row = row;
        this.col = col;
        this.section = section;

        if (value) {
            this.value = value;
            this.solved = true;
            this.possibilities = [];
        } else {
            this.value = null;
            this.solved = false;
            this.possibilities = defaultPossibilities.slice();
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

    removePossibility(possibility: string) {
        this.possibilities = this.possibilities.filter(item => item !== possibility);
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

    removePossibilities(possibilities: Array<string>) {
        this.possibilities = this.possibilities.filter(item => ! possibilities.includes(item));
    }

    solve(possibility: string) {
        this.solved = true;
        this.value = possibility;
        this.possibilities = [];
    }

    hasPossibility(possibility: string) {
        return ! this.solved && this.possibilities.includes(possibility);
    }

    shareAnyPossibilities(other: Square) {
        // if any of this square's possibilities exist in the other, return true
        const matchingInOther = this.possibilities.filter(possibility => other.possibilities.includes(possibility));
        if ( matchingInOther.length > 0 ) return true;

        // no overlap, return false
        return false
    }

    hasIdenticalPossibilities(other: Square) {
        // if any of this square's possibilities don't exist im the other, return false
        const missingFromOther = this.possibilities.filter(possibility => ! other.possibilities.includes(possibility));
        if ( missingFromOther.length > 0 ) return false;
        
        // if any of the other square's possibilities don't exist in this, return false
        const missingFromThis = other.possibilities.filter(possibility => ! this.possibilities.includes(possibility));
        if ( missingFromThis.length > 0 ) return false;

        // possibilities are the same, return true
        return true;
    }
}