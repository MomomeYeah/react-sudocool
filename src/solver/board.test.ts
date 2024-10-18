import { Board } from './board';

describe("4x4 board", () => {
    // create board before each test
    const smallBoardSize = 4;
    const smallSquares = ['3','2','','1','','','2','3','2','3','','','1','','3','2'];
    const mediumBoardSize = 9;
    const mediumSquares = ['','','5','4','','','','1','','7','','9','1','','8','','','','1','','','','','3','','2','','','6','','','','7','','4','','9','1','2','','','','8','7','6','','4','','8','','','','9','','','5','','6','','','','','9','','','','3','','4','6','','1','','3','','','','7','2','',''];
    const largeBoardSize = 16;
    const largeSquares = ['','','','','','','','1','E','','2','','','4','F','5','','','','','','D','6','','F','','9','','','','8','','3','E','','2','','','7','','','','','','B','C','','','','','','','3','C','','2','','B','8','','','','A','','B','','','','D','E','','F','','','','','','','','','','A','','','C','2','','','E','','','','8','B','','','C','1','','','','A','','','','8','2','','5','','','','','','','','','','1','','G','','','3','','','','4','1','D','','E','','','G','C','','','','','9','','','','','','','6','','','','','','8','F','','2','','D','A','','','','','','','','','','','','','E','5','G','','C','','','','4','1','','','','','','','7','','','F','','','B','','','','','G','','9','6','3','2','','','4','','','','','5','9','','','','','','','','','','D','7','','A','5','F','2','4','','','','','B','','','E','C','F','9','2','','','8','','','','G','','A','','6','3',''];

    let smallBoard: Board;
    let mediumBoard: Board;
    let largeBoard: Board;

    beforeEach(() => {
        smallBoard = new Board(smallBoardSize, smallSquares);
        mediumBoard = new Board(mediumBoardSize, mediumSquares);
        largeBoard = new Board(largeBoardSize, largeSquares);
    });

    test("board is created correctly", () => {
        expect(smallBoard).not.toBeNull();
        expect(smallBoard.validPossibilities).toEqual(["1", "2", "3", "4"]);
        expect(smallBoard.rows.size).toEqual(4);
        expect(smallBoard.columns.size).toEqual(4);
        expect(smallBoard.sections.size).toEqual(4);
        expect(smallBoard.squares).toHaveLength(16);

        // TODO: check section / square possibilities, values, etc.
    });

    // TODO: solveSquare

    // solve / getIsSolved
    test("small board is solved correctly", () => {
        expect(smallBoard.getIsSolved()).toEqual(true);
        expect(smallBoard.solution.solution).toEqual(['3','2','4','1','4','1','2','3','2','3','1','4','1','4','3','2']);
    });

    test("medium board is solved correctly", () => {
        expect(mediumBoard.getIsSolved()).toEqual(true);
        expect(mediumBoard.solution.solution).toEqual(['2','3','5','4','9','6','7','1','8','7','4','9','1','2','8','5','6','3','1','8','6','5','7','3','4','2','9','8','6','3','9','2','7','5','4','1','9','1','2','4','3','5','8','7','6','7','4','5','8','6','1','3','9','2','1','5','4','6','8','2','3','7','9','2','9','7','3','5','4','6','8','1','6','3','8','9','1','7','2','5','4']);
    });

    test("large board is solved correctly", () => {
        expect(largeBoard.getIsSolved()).toEqual(true);
        expect(largeBoard.solution.solution).toEqual(['8','G','D','6','A','B','9','1','E','C','2','7','3','4','F','5','A','7','C','B','4','D','6','E','F','3','9','5','G','1','8','2','3','E','5','2','G','F','7','8','A','4','1','D','B','C','6','9','9','4','F','1','3','C','5','2','6','B','8','G','E','7','A','D','B','6','5','8','D','E','3','F','4','7','C','9','G','2','1','A','D','A','G','4','C','2','7','9','E','6','5','1','8','B','3','F','C','1','3','E','4','A','B','G','D','8','2','F','5','6','9','7','2','F','7','9','8','5','1','6','G','A','B','3','D','E','C','4','1','D','A','E','6','F','G','C','5','3','7','2','9','8','4','B','9','4','B','6','3','5','E','7','1','8','F','G','2','C','D','A','8','7','F','3','2','B','D','A','6','9','C','4','E','5','G','1','C','2','G','5','4','1','9','8','A','D','E','B','7','3','6','F','C','1','B','D','7','A','E','G','F','9','6','3','2','5','8','4','6','G','4','8','5','9','1','3','7','E','2','C','B','F','A','D','7','3','A','5','F','2','4','6','1','D','8','B','9','G','E','C','F','9','2','E','B','8','D','C','5','G','4','A','1','6','3','7']);
    });

    // TODO: getIsSolved

    // TODO: getInvalidSquares
});