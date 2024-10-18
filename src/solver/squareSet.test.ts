import { Square } from './square';
import { Row } from './squareSet';

describe("Unsolved squareset", () => {
    // create row before each test
    const possibilities = ["3", "4"];
    let row: Row;
    let solvedSquare: Square;

    beforeEach(() => {
        row = new Row(possibilities);

        const [squareRow, squareCol, squareSection] = [1, 2, 3];
        solvedSquare = new Square(squareRow, squareCol, squareSection, [], "4");
    });

    test("set is created with correct fields", () => {
        expect(row).not.toBeNull();
        expect(row.possibilities).toEqual(possibilities);
        expect(row.squares).toHaveLength(0);
        expect(row.solved()).toEqual(false);
    });

    // removePossibility / solved
    test("set is unsolved when partial possibilities are removed", () => {
        row.removePossibility("3")
        expect(row.solved()).toEqual(false);
        expect(row.possibilities).toHaveLength(1);
        
    });

    test("set is solved when all possibilities are removed", () => {
        row.removePossibility("3")
        row.removePossibility("4")
        expect(row.solved()).toEqual(true);
        expect(row.possibilities).toHaveLength(0);
        
    });

    // TODO: containsClashesWith
    test("set clashes with solved related square", () => {
        const solvedSquareInRow = JSON.parse(JSON.stringify(solvedSquare));
        row.squares.push(solvedSquareInRow);
        row.squares.push(solvedSquare);
        expect(row.containsClashesWith(solvedSquare)).toEqual(true);
    });
});