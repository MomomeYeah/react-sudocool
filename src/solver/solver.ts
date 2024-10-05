import { Row, Column } from './squareSet';
import { Board } from './board';

export class Solver {
   
    public board: Board;

    constructor(board: Board) {
        this.board = board;
    }

    solve() {
        let found = true
        while (found) {
            found = false
            found = 
                // singleCandidate and singlePosition alone are enough to solve easy and 
                // many medium puzzles
                this.singleCandidate()
                || this.singlePosition()
                // candidateLine helps for hard / tough puzzles
                || this.candidateLine()
            // found = this.doublePair()
            // found = this.nakedTuples()
        }
    }

    singleCandidate() {
        // If a cell has only one possibility, solve that cell
        let found = false
        this.board.squares.forEach(square => {
            if ( ! square.solved && square.possibilities.length === 1 ) {
                found = true;
                this.board.solveSquare(square, square.possibilities[0]);
            }
        });

        return found
    }

    singlePosition() {
        /* Solve single-position squares.

        For each possibility in each row / column / section, if there is only
        one cell in that row / column / section containing that possibility, then
        that cell's value can only be that posibility */

        let found = false;
        const collections = [
            this.board.rows,
            this.board.columns,
            this.board.sections
        ];
        collections.forEach(collection => {
            // for each row, column, or section
            collection.forEach((collection_item, key) => {
                // for each possibility remaining in the row / column / section
                collection_item.possibilities.forEach((possibility: number) => {
                    // find all other squares in the same row, column, or section with that possibility also remaining
                    const squaresWithPossibility = collection_item.squares.filter(square => square.possibilities.includes(possibility));
                    // if there is only one such square. solve the square
                    if ( squaresWithPossibility.length === 1 ) {
                        found = true;
                        const square = squaresWithPossibility[0];
                        this.board.solveSquareByPosition(square.row, square.col, possibility);
                    }
                });
            });
        });

        return found;
    }

    candidateLine() {
        /* Remove possibilities based on candidate line test.

        For each possibility in each section, look at all cells in that section
        containing that possibility. If all such cells fall on a single row or
        column, that row or column in that section must contain that possibility.
        Therefore, we can remove that possibility from cells in the same row or
        column in other sections */

        let found = false
        this.board.sections.forEach((section, sectionIndex) => {
            section.possibilities.forEach(possibility => {
                // get all squares in this section containing this possibility
                const squaresWithPossibility = section.squares.filter(square => square.possibilities.includes(possibility));

                // if they all fall on a single row, then remove the possibility
                // from all other squares in the same row in different sections
                const rows = new Set(squaresWithPossibility.map(square => square.row));
                if ( rows.size === 1 ) {
                    const rowIndex = rows.values().next().value as number;
                    const row = this.board.rows.get(rowIndex) as Row;
                    const removeSquares = row.squares.filter(square => square.section !== sectionIndex && square.hasPossibility(possibility));
                    if ( removeSquares.length > 0 ) {
                        found = true;
                        removeSquares.map(square => square.removePossibility(possibility));
                    }
                }

                // if they all fall on a single column, then remove the possibility
                // from all other squares in the same column in different sections
                const cols = new Set(squaresWithPossibility.map(square => square.col));
                if ( cols.size === 1 ) {
                    const colIndex = cols.values().next().value as number;
                    const col = this.board.columns.get(colIndex) as Column;
                    const removeSquares = col.squares.filter(square => square.section !== sectionIndex && square.hasPossibility(possibility));
                    if ( removeSquares.length > 0 ) {
                        found = true;
                        removeSquares.map(square => square.removePossibility(possibility));
                    }
                }
            });
        });

        return found
    }
}