import { Square } from './square';
import { Row, Column, Section } from './squareSet';
import { Solver } from './solver';

export type BoardSolutionType = {
    solved: boolean,
    solution: Array<string>,
    prefilledSquares: Array<number>,
    invalid: boolean,
    invalidSquares: Array<number>
}

export class Board {
    /* Class representing the Sudoku board */

    public boardSize: number;
    public validPossibilities: Array<string>;
    public rows: Map<number, Row>;
    public columns: Map<number, Column>;
    public sections: Map<number, Section>;
    public squares: Array<Square>;

    // return values
    public solution: BoardSolutionType;

    constructor(boardSize: number) {
        this.boardSize = boardSize;
        this.validPossibilities = "123456789ABCDEFG".split("").slice(0, this.boardSize);

        // initialise return values to their defaults
        this.solution = {
            solved: false,
            solution: [],
            prefilledSquares: [],
            invalid: true,
            invalidSquares: []
        }

        // initialise rows, columns, and sections
        this.rows = new Map();
        this.columns = new Map();
        this.sections = new Map();
        for (let i = 0; i < this.boardSize; i++) {
            this.rows.set(i, new Row(this.validPossibilities));
            this.columns.set(i, new Column(this.validPossibilities));
            this.sections.set(i, new Section(this.validPossibilities));
        }

        // initialise all board squares, and read their values
        this.squares = [];
        document.querySelectorAll(".sudocool-item").forEach(element => {
            // cast to HTMLInputElement so we can access the dataset
            const htmlElement = element as HTMLInputElement;

            // fetch data identifiers from the element
            const row = Number(htmlElement.dataset.row);
            const col = Number(htmlElement.dataset.col);
            const section = Number(htmlElement.dataset.section);
            const value = htmlElement.value;

            const newSquare = new Square(row, col, section, this.validPossibilities, value);
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

        // finally loop over all squares
        this.squares.forEach((square, index) => {
            // for each square, if it's solved
            if ( square.solved ) {
                // add it to the list of squares that were filled in before solving
                this.solution.prefilledSquares.push(index);

                // remove possibilities corresponding to solved squares in the same row, column, or section
                this.squares.forEach(unsolved_square => {
                    unsolved_square.removePossibilityIfConflicting(square);
                });    
            }
        });

        // attempt to solve the board
        this.solve();
    }

    solveSquare(square: Square, possibility: string) {
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

    solve() {
        // first check to see if the board is valid
        let invalidSquares = this.getInvalidSquares();
        if ( invalidSquares.length > 0 ) {
            this.solution.solution = this.squares.map(square => square.value ?? "");
            this.solution.solved = false;
            this.solution.invalid = true;
            this.solution.invalidSquares = invalidSquares;

            // return early without attempting to solve
            return;
        }

        // attempt to solve the board
        const solver = new Solver(this);
        solver.solve();

        // populate board solution, either partial or complete
        this.solution.solution = this.squares.map(square => square.value ?? "");

        // check again to make sure the results is valid and consistent
        invalidSquares = this.getInvalidSquares();
        if ( invalidSquares.length > 0 ) {
            this.solution.solved = false;
            this.solution.invalid = true;
            this.solution.invalidSquares = invalidSquares;
        } else {
            this.solution.solved = this.getIsSolved();
            this.solution.invalid = false;
        }
    }

    getIsSolved() {
        /** Has the board been solved?
         * 
         * The board has been solved if all squares have been solved
         */
        return this.squares.filter(square => ! square.solved).length === 0;
    }

    getInvalidSquares() {
        /** Is the board invalid? The board is invalid if:
         * 
         * - any squares have invalid characters
         * - any squares that are in the same row, col, or section as squares with the same value
         * - any squares remain unsolved but have no remaining possibilities
         */
        const invalidSquares = [] as Array<number>;
        this.squares.forEach((square, index) => {
            if (
                // invalid characters
                ( square.value && ! this.validPossibilities.includes(square.value) ) ||
                // multiple solved squares in the same row, column, or section have the same value    
                (
                    this.rows.get(square.row)?.containsClashesWith(square) ||
                    this.columns.get(square.col)?.containsClashesWith(square) ||
                    this.sections.get(square.section)?.containsClashesWith(square)
                ) ||
                // no remaining possibilities
                ( ! square.solved && square.possibilities.length === 0 )
            ) {
                invalidSquares.push(index);
            }
        });

        return invalidSquares;
    }
}