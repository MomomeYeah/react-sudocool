import { Board } from './board';
import { Solver } from './solver';

describe("4x4 board solver", () => {
    // create solver before each test
    let smallBoardSolver: Solver;

    beforeEach(() => {
        const smallBoardSize = 4;
        const smallSquares = ['3','2','','1','','','2','3','2','3','','','1','','3','2'];
        const smallBoard = new Board(smallBoardSize, smallSquares);

        smallBoardSolver = new Solver(smallBoard);
    });

    test("solver is created with correct fields", () => {
        expect(smallBoardSolver).not.toBeNull();
        expect(smallBoardSolver.board).not.toBeNull();
    });

    // TODO: singleCandidate
    
    // TODO: singlePosition

    // TODO: candidateLine

    // TODO: nakedTuples
});