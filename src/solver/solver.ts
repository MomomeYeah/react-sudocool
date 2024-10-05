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
            found = 
                // the following alone are enough to solve easy and many medium puzzles
                this.singleCandidate()
                || this.singlePosition()
                // the following help for hard / tough puzzles
                || this.candidateLine()
                || this.nakedTuples()
            // found = this.doublePair()
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
            collection.forEach(collection_item => {
                // for each possibility remaining in the row / column / section
                collection_item.possibilities.forEach(possibility => {
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

    nakedTuples() {
        /* Remove possibilities based on naked tuples test.

        For each row / col / section, if any N squares have exactly the same N
        possibilities, then only those N squares in that row / col / section can
        contain those N possibilities.

        For example, if 2 squares in the same section each have only 2 possibilities
        and those possibilities are the same, no other squares in that section can
        have either possibility, so remove those 2 possibilities from all other
        squares in that section */

        let found = false;
        const collections = [
            this.board.rows,
            this.board.columns,
            this.board.sections
        ];
        collections.forEach(collection => {
            // for every row, column, or section
            collection.forEach(collection_item => {
                // for each unsolved square in the row, column, or section
                const unsolvedSquares = collection_item.squares.filter(square => ! square.solved);
                unsolvedSquares.forEach(unsolvedSquare => {
                    // get the list of squares in the same row, column, or section that have
                    // an identical set of possibilities
                    const squaresSharingPossibilities = collection_item.squares.filter(square => {
                        return ! square.solved && square.hasIdenticalPossibilities(unsolvedSquare);
                    });
                    // if the number of squares sharing the set of possibilities is the same as
                    // the number of possibilities, then remove all those possibilities from all
                    // other squares in the same row, column, or section
                    if ( squaresSharingPossibilities.length === unsolvedSquare.possibilities.length ) {
                        const removeSquares = collection_item.squares.filter(square => {
                            return ! squaresSharingPossibilities.includes(square)
                                && ! square.solved
                                && square.shareAnyPossibilities(unsolvedSquare);
                        });

                        if ( removeSquares.length > 0 ) {
                            found = true;
                            removeSquares.map(square => square.removePossibilities(unsolvedSquare.possibilities));
                        }
                    }
                });
            });
        });

        return found
    }
}