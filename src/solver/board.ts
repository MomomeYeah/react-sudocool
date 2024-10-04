import { Square } from './square';
import { Row, Column, Section } from './squareSet';
import { Solver } from './solver';

export class Board {
    /* Class representing the Sudoku board */

    public rows: Map<number, Row>;
    public columns: Map<number, Column>;
    public sections: Map<number, Section>;
    public squares: Array<Square>;

    constructor() {
        this.rows = new Map();
        this.columns = new Map();
        this.sections = new Map();
        for (let i = 0; i < 9; i++) {
            this.rows.set(i, new Row());
            this.columns.set(i, new Column());
            this.sections.set(i, new Section());
        }

        this.squares = [];
        document.querySelectorAll(".sudocool-item").forEach(element => {
            // cast to HTMLInputElement so we can access the dataset
            const htmlElement = element as HTMLInputElement;

            // fetch data identifiers from the element
            const row = Number(htmlElement.dataset.row);
            const col = Number(htmlElement.dataset.col);
            const section = Number(htmlElement.dataset.section);
            const value = Number(htmlElement.value);

            const newSquare = new Square(row, col, value);
            this.squares.push(newSquare);
            this.rows.get(row)?.squares.push(newSquare);
            this.columns.get(col)?.squares.push(newSquare);
            this.sections.get(section)?.squares.push(newSquare);

            // for each square, if it's value is set, remove that value from the list of possibilities 
            // associated with it's row, column, and section
            if ( htmlElement.value ) {
                this.rows.get(row)?.removePossibility(value);
                this.columns.get(col)?.removePossibility(value);
                this.sections.get(section)?.removePossibility(value);
            }
        });

        // finally, loop over all squares, removing possibilities corresponding to solved squares in the 
        // same row, column, or section
        this.squares.filter(s => s.solved).forEach(solvedSquare => {
            this.squares.forEach(square => {
                square.removePossibilityIfConflicting(solvedSquare);
            });
        });
    }

    solveSquare(square: Square, possibility: number) {
        // solve the square, setting it's value to this possibility
        square.solve(possibility);

        // remove the value from the list of possibilities for corresponding rows, columns, and sections
        this.rows.get(square.row)?.removePossibility(possibility)
        this.columns.get(square.col)?.removePossibility(possibility)
        this.sections.get(square.section)?.removePossibility(possibility)

        // remove the value from squares in the same row, col, section
        this.squares.filter(s => s.solved).forEach(solvedSquare => {
            this.squares.forEach(square => {
                square.removePossibilityIfConflicting(solvedSquare);
            });
        });
    }

    solveSquareByPosition(row: number, col: number, possibility: number) {
        const square = this.squares.find(element => element.row === row && element.col === col);
        if ( square ) {
            this.solveSquare(square, possibility);
            return;
        }

        throw new Error(`Unable to solve square with row ${row}, column ${col}`);
    }

    solve() {
        const solver = new Solver(this);
        solver.solve();
        return this.getSolution();
    }

    getSolution() {
        const solvedSquares: Array<string> = [];
        this.squares.forEach(square => {
            solvedSquares.push(square.value ? String(square.value) : "");
        });

        return solvedSquares;
    }

    // solved() {
    //     // Has the board been solved?
    //     return this.rows.solved() && this.columns.solved() && this.sections.solved();
    // }

    inconsistent() {
        /* Is the board in an inconsistent state?

        The board is in an inconsistent state if there remain any squares that have
        no possibilities left but that haven't been marked as solved */

        const unsolved_squares = this.squares.filter(square => ! square.solved && square.possibilities.length === 0);
        return unsolved_squares.length > 0;
    }
}