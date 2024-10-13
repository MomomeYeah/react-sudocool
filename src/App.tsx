import './App.css';
import React, { createContext, useContext, useState } from 'react';
import { BoardSolutionType, Board } from './solver/board';

type BoardContextProps = {
    boardSize: number,
    squares: Array<string>,
    solution: BoardSolutionType | null,
    updateSquare: Function
}
const BoardContext = createContext({} as BoardContextProps);

type SudoCoolSquareProps = {
    section: number,
    value: string,
    prefilled: boolean,
    invalid: boolean,
    squareIndex: number
}
function SudoCoolSquare({ section, value, prefilled, invalid, squareIndex } : SudoCoolSquareProps) {
    const context = useContext(BoardContext);
    const className = `sudocool-item ${invalid ? "invalid" : ""} ${prefilled ? "prefilled" : ""}`;
    return (
        <input
            className={className}
            readOnly={context.solution != null}
            value={value}
            onChange={(e) => context.updateSquare(section, squareIndex, e.target.value)} />
    )
}

type SudoCoolSectionProps = {
    sectionIndex: number
}
function SudoCoolSection({ sectionIndex }: SudoCoolSectionProps) {
    const context = useContext(BoardContext);
    const sectionSquares = [];
    for (let squareIndex = 0; squareIndex < context.boardSize; squareIndex++) {
        const valueIndex = sectionIndex * context.boardSize + squareIndex;
        const value = context.squares[valueIndex];
        const prefilled = context.solution != null && context.solution.prefilledSquares.includes(valueIndex);
        const invalid = context.solution != null && context.solution.invalidSquares.includes(valueIndex);

        const key = `${context.boardSize}-${squareIndex}`;
        sectionSquares.push(
            <SudoCoolSquare
                key={key}
                section={sectionIndex}
                value={value}
                prefilled={prefilled}
                invalid={invalid}
                squareIndex={squareIndex} />)
    }

    const className = `sudocool-section sudocool-section-${context.boardSize}`;
    return (
        <div className={className}>
            {sectionSquares}
        </div>
    )
}

function SudoCoolBoard() {
    const context = useContext(BoardContext);
    const sections = [];
    for (let sectionIndex = 0; sectionIndex < context.boardSize; sectionIndex++) {

        const key = `${context.boardSize}-${sectionIndex}`;
        sections.push(
            <SudoCoolSection
                key={key}
                sectionIndex={sectionIndex} />)
    }

    const className = `sudocool-table sudocool-table-${context.boardSize}`;
    return (
        <div className="sudocool-table-wrapper">
            <div className={className}>
                {sections}
            </div>
        </div>
    );
}

function SudoCoolNavBar({ solution }: {solution: BoardSolutionType | null}) {
    let className = "status status-warning";
    let message = "Unable to solve board";
    if ( solution ) {
        if ( solution.invalid ) {
            className = "status status-error";
            message = "Invalid board";
        } else if ( solution.solved ) {
            className = "status status-success";
            message = "Board solved!";   
        }
    }
    
    return (
        <>
            <nav className="title">
                <h1>SudoCool</h1>

                {/* status-container prevents flexbox aligned items in the navbar shifting when adding content */}
                <div className="status-container">
                    { solution && <div className={className}>{message}</div> }
                </div>

                <a href="https://github.com/MomomeYeah/react-sudocool">
                    <img src="github-mark-white.svg" alt="GitHub Profile"/>
                </a>
            </nav>
        </>
    );
}

export default function App() {
    const [boardSize, setBoardSize] = useState(9);
    const [history, setHistory] = useState([Array(boardSize ** 2).fill("")]);
    const [squares, setSquares] = useState(history[0]);

    const [solution, setSolution] = useState<BoardSolutionType | null>(null);

    function updateSquare(sectionIndex: number, squareIndex: number, value:string) {
        const newSquares = squares.slice();
        newSquares[(sectionIndex * boardSize) + squareIndex] = value;
        setHistory([newSquares]);
        setSquares(newSquares);
    }

    // submit the board for solving
    function handleClickSolve() {
        // if the board is already solved, don't attempt to re-solve
        if ( solution ) return;

        // otherwise, solve the board
        const board = new Board(boardSize, squares);
        setSolution(board.solution);

        // update history
        const solvedBoard = board.solution.solution;
        setHistory([...history, solvedBoard]);
        setSquares(solvedBoard);
    }

    function populateBoard(squares: Array<string>) {
        setSolution(null);
        setHistory([squares]);
        setSquares(squares);
    }

    // remove the solved board, reverting back to edit mode
    function handleClickReset() {
        populateBoard(history[0]);
    }

    // empty the board, returning it to a pristine state
    function handleClickClear(size: number) {
        populateBoard(Array(size ** 2).fill(""));
    }

    function handleBoardSizeInput(size: string) {
        if ( ! ["4", "9", "16"].includes(size) ) {
            size = "9";
        }

        setBoardSize(Number(size));
        handleClickClear(Number(size));
    }

    interface BoardType {
        [key: string]: any
    }
    const boards: BoardType = {
        "easy": {
            4: ['3', '2', '', '1', '', '', '2', '3', '2', '3', '', '', '1', '', '3', '2'],
            9: ['', '', '', '7', '', '5', '', '8', '2', '', '', '1', '6', '3', '', '', '9', '', '', '', '8', '2', '', '', '6', '3', '', '', '7', '', '', '1', '', '4', '6', '3', '', '', '4', '', '', '', '8', '', '', '5', '8', '3', '', '9', '', '', '7', '', '', '2', '7', '', '', '4', '6', '', '', '', '1', '', '', '8', '7', '5', '', '', '3', '4', '', '9', '', '1', '', '', ''],
            16:['', '', '', '', '', '', '', '1', 'E', '', '2', '', '', '4', 'F', '5', '', '', '', '', '', 'D', '6', '', 'F', '', '9', '', '', '', '8', '', '3', 'E', '', '2', '', '', '7', '', '', '', '', '', 'B', 'C', '', '', '', '', '', '', '3', 'C', '', '2', '', 'B', '8', '', '', '', 'A', '', 'B', '', '', '', 'D', 'E', '', 'F', '', '', '', '', '', '', '', '', '', 'A', '', '', 'C', '2', '', '', 'E', '', '', '', '8', 'B', '', '', 'C', '1', '', '', '', 'A', '', '', '', '8', '2', '', '5', '', '', '', '', '', '', '', '', '', '1', '', 'G', '', '', '3', '', '', '', '4', '1', 'D', '', 'E', '', '', 'G', 'C', '', '', '', '', '9', '', '', '', '', '', '', '6', '', '', '', '', '', '8', 'F', '', '2', '', 'D', 'A', '', '', '', '', '', '', '', '', '', '', '', '', 'E', '5', 'G', '', 'C', '', '', '', '4', '1', '', '', '', '', '', '', '7', '', '', 'F', '', '', 'B', '', '', '', '', 'G', '', '9', '6', '3', '2', '', '', '4', '', '', '', '', '5', '9', '', '', '', '', '', '', '', '', '', 'D', '7', '', 'A', '5', 'F', '2', '4', '', '', '', '', 'B', '', '', 'E', 'C', 'F', '9', '2', '', '', '8', '', '', '', 'G', '', 'A', '', '6', '3', '']
        },
        "medium": {
            4: ['3', '2', '', '1', '', '', '2', '3', '2', '3', '', '', '1', '', '3', '2'],
            9: ['', '', '5', '4', '', '', '', '1', '', '7', '', '9', '1', '', '8', '', '', '', '1', '', '', '', '', '3', '', '2', '', '', '6', '', '', '', '7', '', '4', '', '9', '1', '2', '', '', '', '8', '7', '6', '', '4', '', '8', '', '', '', '9', '', '', '5', '', '6', '', '', '', '', '9', '', '', '', '3', '', '4', '6', '', '1', '', '3', '', '', '', '7', '2', '', ''],
            16:['', '', '', '', '', '', '', '1', 'E', '', '2', '', '', '4', 'F', '5', '', '', '', '', '', 'D', '6', '', 'F', '', '9', '', '', '', '8', '', '3', 'E', '', '2', '', '', '7', '', '', '', '', '', 'B', 'C', '', '', '', '', '', '', '3', 'C', '', '2', '', 'B', '8', '', '', '', 'A', '', 'B', '', '', '', 'D', 'E', '', 'F', '', '', '', '', '', '', '', '', '', 'A', '', '', 'C', '2', '', '', 'E', '', '', '', '8', 'B', '', '', 'C', '1', '', '', '', 'A', '', '', '', '8', '2', '', '5', '', '', '', '', '', '', '', '', '', '1', '', 'G', '', '', '3', '', '', '', '4', '1', 'D', '', 'E', '', '', 'G', 'C', '', '', '', '', '9', '', '', '', '', '', '', '6', '', '', '', '', '', '8', 'F', '', '2', '', 'D', 'A', '', '', '', '', '', '', '', '', '', '', '', '', 'E', '5', 'G', '', 'C', '', '', '', '4', '1', '', '', '', '', '', '', '7', '', '', 'F', '', '', 'B', '', '', '', '', 'G', '', '9', '6', '3', '2', '', '', '4', '', '', '', '', '5', '9', '', '', '', '', '', '', '', '', '', 'D', '7', '', 'A', '5', 'F', '2', '4', '', '', '', '', 'B', '', '', 'E', 'C', 'F', '9', '2', '', '', '8', '', '', '', 'G', '', 'A', '', '6', '3', '']
        },
        "hard": {
            4: ['', '3', '', '2', '', '2', '', '4', '3', '', '2', '', '2', '', '4', ''],
            9: ['4', '', '2', '', '', '', '', '5', '1', '', '', '', '2', '', '9', '', '', '', '', '', '', '', '7', '', '6', '', '', '', '', '', '', '6', '', '9', '', '', '', '9', '', '7', '', '1', '', '4', '', '', '', '4', '', '3', '', '', '', '', '', '', '3', '', '7', '', '', '', '', '', '', '', '6', '', '8', '', '', '', '2', '5', '', '', '', '', '1', '', '7'],
            16:['', '', '', '', '', '', '', '1', 'E', '', '2', '', '', '4', 'F', '5', '', '', '', '', '', 'D', '6', '', 'F', '', '9', '', '', '', '8', '', '3', 'E', '', '2', '', '', '7', '', '', '', '', '', 'B', 'C', '', '', '', '', '', '', '3', 'C', '', '2', '', 'B', '8', '', '', '', 'A', '', 'B', '', '', '', 'D', 'E', '', 'F', '', '', '', '', '', '', '', '', '', 'A', '', '', 'C', '2', '', '', 'E', '', '', '', '8', 'B', '', '', 'C', '1', '', '', '', 'A', '', '', '', '8', '2', '', '5', '', '', '', '', '', '', '', '', '', '1', '', 'G', '', '', '3', '', '', '', '4', '1', 'D', '', 'E', '', '', 'G', 'C', '', '', '', '', '9', '', '', '', '', '', '', '6', '', '', '', '', '', '8', 'F', '', '2', '', 'D', 'A', '', '', '', '', '', '', '', '', '', '', '', '', 'E', '5', 'G', '', 'C', '', '', '', '4', '1', '', '', '', '', '', '', '7', '', '', 'F', '', '', 'B', '', '', '', '', 'G', '', '9', '6', '3', '2', '', '', '4', '', '', '', '', '5', '9', '', '', '', '', '', '', '', '', '', 'D', '7', '', 'A', '5', 'F', '2', '4', '', '', '', '', 'B', '', '', 'E', 'C', 'F', '9', '2', '', '', '8', '', '', '', 'G', '', 'A', '', '6', '3', '']
        }
    }

    function populatePresetBoard(size: string) {
        if ( ! ["easy", "medium", "hard"].includes(size) ) return;
        populateBoard(boards[size][boardSize]);
    }

    return (
        <>
            <SudoCoolNavBar solution={solution} />
            <div className="sudocool-container">
                <BoardContext.Provider value={{ boardSize, squares, solution, updateSquare }}>
                    <SudoCoolBoard />
                </BoardContext.Provider>
                <div className="buttonGroup">
                    <select className="selector" defaultValue={boardSize} onChange={e => handleBoardSizeInput(e.target.value)}>
                        <option value="4">4x4</option>
                        <option value="9">9x9</option>
                        <option value="16">16x16</option>
                    </select>
                    { solution ?
                        <input type="button" value="Reset" className="button" onClick={handleClickReset}/> :
                        <input type="button" value="Solve" className="button" onClick={handleClickSolve}/>
                    }
                    <input type="button" value="Clear" className="button" onClick={e => handleClickClear(boardSize)}/>
                </div>
                <div className="buttonGroup">
                    <input type="button" value="Easy" className="button" onClick={e => populatePresetBoard("easy")}/>
                    <input type="button" value="Medium" className="button" onClick={e => populatePresetBoard("medium")}/>
                    <input type="button" value="Hard" className="button" onClick={e => populatePresetBoard("hard")}/>
                </div>
            </div>
        </>
    );
}