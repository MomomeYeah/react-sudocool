export class Solver {
    
    constructor(board) {
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
            // found = this.candidateLine()
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
        const collections = {
            "row": this.board.rows,
            "col": this.board.columns,
            "section": this.board.sections
        };
        for (const [collection_key, collection] of Object.entries(collections)) {
            // for each row, column, or section
            collection.forEach((collection_item, key) => {
                // for each possibility remaining in the collection
                collection_item.possibilities.forEach(possibility => {
                    // find all other squares in the same row, column, or section with that possibility also remaining
                    const matchingSquares = this.board.squares.filter(
                        square => square[collection_key] === key && square.possibilities.includes(possibility));
    
                    // if there is only one such square. solve the square
                    if ( matchingSquares.length === 1 ) {
                        found = true;
                        const square = matchingSquares[0];
                        this.board.solveSquareByPosition(square.row, square.col, possibility);
                    }
                });
            });
        }

        return found;
    }
}