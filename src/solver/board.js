import { Square } from './square.js';
import { Row, Column, Section } from './squareSet.js';
import { Solver } from './solver.js';

export class Board {
    /* Class representing the Sudoku board */

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
            const row = Number(element.dataset.row);
            const col = Number(element.dataset.col);
            const section = Number(element.dataset.section);
            const value = Number(element.value);

            this.squares.push(new Square(row, col, value));

            // for each square, if it's value is set, remove that value from the list of possibilities 
            // associated with it's row, column, and section
            if ( element.value ) {
                this.rows.get(row).removePossibility(value);
                this.columns.get(col).removePossibility(value);
                this.sections.get(section).removePossibility(value);
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

    solveSquare(square, possibility) {
        // solve the square, setting it's value to this possibility
        square.solve(possibility);

        // remove the value from the list of possibilities for corresponding rows, columns, and sections
        this.rows.get(square.row).removePossibility(square.row, possibility)
        this.columns.get(square.col).removePossibility(square.col, possibility)
        this.sections.get(square.section).removePossibility(square.section, possibility)

        // remove the value from squares in the same row, col, section
        this.squares.filter(s => s.solved).forEach(solvedSquare => {
            this.squares.forEach(square => {
                square.removePossibilityIfConflicting(solvedSquare);
            });
        });
    }

    solveSquareByPosition(row, col, possibility) {
        const square = this.squares.find(element => element.row === row && element.col === col);
        this.solveSquare(square, possibility);
    }

    solve() {
        const solver = new Solver(this);
        solver.solve();
        return this.getSolution();
    }

    getSolution() {
        const solvedSquares = [];
        this.squares.forEach(square => {
            solvedSquares.push(square.value ? String(square.value) : "");
        });

        return solvedSquares;
    }

    solved() {
        // Has the board been solved?
        return this.rowList.solved() && this.colList.solved() && this.sectionList.solved();
    }

    inconsistent() {
        /* Is the board in an inconsistent state?

        The board is in an inconsistent state if there remain any squares that have
        no possibilities left but that haven't been marked as solved */

        const unsolved_squares = this.squares.filter(square => ! square.solved && square.possibilities.length === 0);
        return unsolved_squares.length > 0;
    }
}