import './App.css';
import React, { useState } from 'react';
import { Board } from './solver/board';

type SudoCoolSquareProps = {
    boardSize: number,
    row: number,
    col: number,
    section: number,
    value: string,
    prefilled: boolean,
    squareIndex: number,
    updateSquare: Function,
    readOnly: boolean
}
function SudoCoolSquare({ boardSize, row, col, section, value, prefilled, squareIndex, updateSquare, readOnly } : SudoCoolSquareProps) {
    const [isValid, setIsValid] = useState(true);

    function handleBlur() {
        setIsValid(true);

        const possibilities = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F", "G"].slice(0, boardSize);
        if ( value && ! possibilities.includes(value) ) {
            setIsValid(false);
        }
    }

    const className = `sudocool-item ${isValid ? "" : "invalid"} ${prefilled ? "prefilled" : ""}`;
    return (
        <input
            className={className}
            readOnly={readOnly}
            data-row={row}
            data-col={col}
            data-section={section}
            value={value}
            onChange={(e) => updateSquare(section, squareIndex, e.target.value)}
            onBlur={() => handleBlur()} />
    )
}

type SudoCoolSectionProps = {
    boardSize: number,
    sectionIndex: number,
    squares: Array<string>,
    prefilledSquares: Array<number>,
    updateSquare: Function,
    readOnly: boolean
}
function SudoCoolSection({ boardSize, sectionIndex, squares, prefilledSquares, updateSquare, readOnly }: SudoCoolSectionProps) {
    const sectionSquares = [];
    for (let squareIndex = 0; squareIndex < boardSize; squareIndex++) {
        const sectionsInBoard = Math.sqrt(boardSize);
        const row = sectionsInBoard * Math.floor(sectionIndex / sectionsInBoard) + Math.floor(squareIndex / sectionsInBoard);
        const col = sectionsInBoard * (sectionIndex % sectionsInBoard) + squareIndex % sectionsInBoard;

        const valueIndex = sectionIndex * boardSize + squareIndex;
        const value = squares[valueIndex];
        const prefilled = prefilledSquares.includes(valueIndex);

        const key = `${boardSize}-${squareIndex}`;
        sectionSquares.push(
            <SudoCoolSquare
                key={key}
                boardSize={boardSize}
                row={row}
                col={col}
                section={sectionIndex}
                value={value}
                prefilled={prefilled}
                squareIndex={squareIndex}
                updateSquare={updateSquare}
                readOnly={readOnly} />)
    }

    let tableClass = "";
    switch ( boardSize ) {
        case 4:
            tableClass = "sudocool-section-2x2";
            break;
        case 16:
            tableClass = "sudocool-section-4x4";
            break;
        case 9:
        default:
            tableClass = "sudocool-section-3x3";
            break;
    }

    const className = `sudocool-section ${tableClass}`;
    return (
        <div className={className}>
            {sectionSquares}
        </div>
    )
}

type SudoCoolBoardProps = {
    boardSize: number,
    squares: Array<string>,
    prefilledSquares: Array<number>,
    updateSquare: Function,
    readOnly: boolean
}
function SudoCoolBoard({ boardSize, squares, prefilledSquares, updateSquare, readOnly }: SudoCoolBoardProps) {
    const sections = [];
    for (let sectionIndex = 0; sectionIndex < boardSize; sectionIndex++) {

        const key = `${boardSize}-${sectionIndex}`;
        sections.push(
            <SudoCoolSection
                key={key}
                boardSize={boardSize}
                sectionIndex={sectionIndex}
                squares={squares}
                prefilledSquares={prefilledSquares}
                updateSquare={updateSquare}
                readOnly={readOnly} />)
    }

    let tableClass = "";
    switch ( boardSize ) {
        case 4:
            tableClass = "sudocool-table-2x2";
            break;
        case 16:
            tableClass = "sudocool-table-4x4";
            break;
        case 9:
        default:
            tableClass = "sudocool-table-3x3";
            break;
    }

    const className = `sudocool-table ${tableClass}`;
    return (
        <div className="sudocool-table-wrapper">
            <div className={className}>
                {sections}
            </div>
        </div>
    )
}

export default function App() {
    const [boardSize, setBoardSize] = useState(9);
    const [history, setHistory] = useState([Array(boardSize ** 2).fill("")]);
    const [squares, setSquares] = useState(history[0]);
    const [prefilledSquares, setPrefilledSquares] = useState([] as Array<number>);
    const [readOnly, setReadOnly] = useState(false);

    function updateSquare(sectionIndex: number, squareIndex: number, value:string) {
        const newSquares = squares.slice();
        newSquares[(sectionIndex * boardSize) + squareIndex] = value;
        setHistory([newSquares]);
        setSquares(newSquares);
    }

    // submit the board for solving
    function handleClickSolve() {
        // if the board is already solved, don't attempt to re-solve
        if ( readOnly ) return;

        // otherwise, we're good to go
        const board = new Board(boardSize);
        const solvedBoard = board.solve();;
        setHistory([...history, solvedBoard]);
        setSquares(solvedBoard);
        setReadOnly(true);

        // calculate the intersection of history[0] and history[1], resulting in the set of squares
        // that were pre-filled, as opposed to having been solved for
        const prefilled: Array<number> = [];
        history[0].forEach((value, index) => {
            if ( value && solvedBoard[index] === value ) {
                prefilled.push(index);
            }
        });
        setPrefilledSquares(prefilled);
    }

    // remove the solved board, reverting back to edit mode
    function handleClickReset() {
        setHistory([history[0]]);
        setSquares(history[0]);
        setReadOnly(false);
        setPrefilledSquares([]);
    }

    // empty the board, returning it to a pristine state
    function handleClickClear(size: number) {
        setHistory([Array(size ** 2).fill("")]);
        setSquares(Array(size ** 2).fill(""));
        setReadOnly(false);
        setPrefilledSquares([] as Array<number>);
    }

    function handleBoardSizeInput(size: string) {
        if ( ! ["4", "9", "16"].includes(size) ) {
            size = "9";
        }

        setBoardSize(Number(size));
        handleClickClear(Number(size))
    }

    function populateBoard(squareArray: Array<string>) {
        setHistory([squareArray]);
        setSquares(squareArray);
        setReadOnly(false);
        setPrefilledSquares([] as Array<number>);
    }

    function populateEasy() {
        const squareArray2x2 = ['3', '2', '', '1', '', '', '2', '3', '2', '3', '', '', '1', '', '3', '2'];
        const squareArray3x3 = ['', '', '', '7', '', '5', '', '8', '2', '', '', '1', '6', '3', '', '', '9', '', '', '', '8', '2', '', '', '6', '3', '', '', '7', '', '', '1', '', '4', '6', '3', '', '', '4', '', '', '', '8', '', '', '5', '8', '3', '', '9', '', '', '7', '', '', '2', '7', '', '', '4', '6', '', '', '', '1', '', '', '8', '7', '5', '', '', '3', '4', '', '9', '', '1', '', '', ''];
        const squareArray4x4 = ['', '', '', '', '', '', '', '1', 'E', '', '2', '', '', '4', 'F', '5', '', '', '', '', '', 'D', '6', '', 'F', '', '9', '', '', '', '8', '', '3', 'E', '', '2', '', '', '7', '', '', '', '', '', 'B', 'C', '', '', '', '', '', '', '3', 'C', '', '2', '', 'B', '8', '', '', '', 'A', '', 'B', '', '', '', 'D', 'E', '', 'F', '', '', '', '', '', '', '', '', '', 'A', '', '', 'C', '2', '', '', 'E', '', '', '', '8', 'B', '', '', 'C', '1', '', '', '', 'A', '', '', '', '8', '2', '', '5', '', '', '', '', '', '', '', '', '', '1', '', 'G', '', '', '3', '', '', '', '4', '1', 'D', '', 'E', '', '', 'G', 'C', '', '', '', '', '9', '', '', '', '', '', '', '6', '', '', '', '', '', '8', 'F', '', '2', '', 'D', 'A', '', '', '', '', '', '', '', '', '', '', '', '', 'E', '5', 'G', '', 'C', '', '', '', '4', '1', '', '', '', '', '', '', '7', '', '', 'F', '', '', 'B', '', '', '', '', 'G', '', '9', '6', '3', '2', '', '', '4', '', '', '', '', '5', '9', '', '', '', '', '', '', '', '', '', 'D', '7', '', 'A', '5', 'F', '2', '4', '', '', '', '', 'B', '', '', 'E', 'C', 'F', '9', '2', '', '', '8', '', '', '', 'G', '', 'A', '', '6', '3', ''];

        switch (boardSize) {
            case 4:
                populateBoard(squareArray2x2);
                break;
            case 9:
                populateBoard(squareArray3x3);
                break;
            case 16:
                populateBoard(squareArray4x4);
                break;
            default:
                break;
        }
    }

    function populateMedium() {
        const squareArray2x2 = ['3', '2', '', '1', '', '', '2', '3', '2', '3', '', '', '1', '', '3', '2'];
        const squareArray3x3 = ['', '', '5', '4', '', '', '', '1', '', '7', '', '9', '1', '', '8', '', '', '', '1', '', '', '', '', '3', '', '2', '', '', '6', '', '', '', '7', '', '4', '', '9', '1', '2', '', '', '', '8', '7', '6', '', '4', '', '8', '', '', '', '9', '', '', '5', '', '6', '', '', '', '', '9', '', '', '', '3', '', '4', '6', '', '1', '', '3', '', '', '', '7', '2', '', ''];
        const squareArray4x4 = ['', '', '', '', '', '', '', '1', 'E', '', '2', '', '', '4', 'F', '5', '', '', '', '', '', 'D', '6', '', 'F', '', '9', '', '', '', '8', '', '3', 'E', '', '2', '', '', '7', '', '', '', '', '', 'B', 'C', '', '', '', '', '', '', '3', 'C', '', '2', '', 'B', '8', '', '', '', 'A', '', 'B', '', '', '', 'D', 'E', '', 'F', '', '', '', '', '', '', '', '', '', 'A', '', '', 'C', '2', '', '', 'E', '', '', '', '8', 'B', '', '', 'C', '1', '', '', '', 'A', '', '', '', '8', '2', '', '5', '', '', '', '', '', '', '', '', '', '1', '', 'G', '', '', '3', '', '', '', '4', '1', 'D', '', 'E', '', '', 'G', 'C', '', '', '', '', '9', '', '', '', '', '', '', '6', '', '', '', '', '', '8', 'F', '', '2', '', 'D', 'A', '', '', '', '', '', '', '', '', '', '', '', '', 'E', '5', 'G', '', 'C', '', '', '', '4', '1', '', '', '', '', '', '', '7', '', '', 'F', '', '', 'B', '', '', '', '', 'G', '', '9', '6', '3', '2', '', '', '4', '', '', '', '', '5', '9', '', '', '', '', '', '', '', '', '', 'D', '7', '', 'A', '5', 'F', '2', '4', '', '', '', '', 'B', '', '', 'E', 'C', 'F', '9', '2', '', '', '8', '', '', '', 'G', '', 'A', '', '6', '3', ''];
        
        switch (boardSize) {
            case 4:
                populateBoard(squareArray2x2);
                break;
            case 9:
                populateBoard(squareArray3x3);
                break;
            case 16:
                populateBoard(squareArray4x4);
                break;
            default:
                break;
        }
    }

    function populateHard() {
        const squareArray2x2 = ['', '3', '', '2', '', '2', '', '4', '3', '', '2', '', '2', '', '4', ''];
        const squareArray3x3 = ['4', '', '2', '', '', '', '', '5', '1', '', '', '', '2', '', '9', '', '', '', '', '', '', '', '7', '', '6', '', '', '', '', '', '', '6', '', '9', '', '', '', '9', '', '7', '', '1', '', '4', '', '', '', '4', '', '3', '', '', '', '', '', '', '3', '', '7', '', '', '', '', '', '', '', '6', '', '8', '', '', '', '2', '5', '', '', '', '', '1', '', '7'];
        const squareArray4x4 = ['', '', '', '', '', '', '', '1', 'E', '', '2', '', '', '4', 'F', '5', '', '', '', '', '', 'D', '6', '', 'F', '', '9', '', '', '', '8', '', '3', 'E', '', '2', '', '', '7', '', '', '', '', '', 'B', 'C', '', '', '', '', '', '', '3', 'C', '', '2', '', 'B', '8', '', '', '', 'A', '', 'B', '', '', '', 'D', 'E', '', 'F', '', '', '', '', '', '', '', '', '', 'A', '', '', 'C', '2', '', '', 'E', '', '', '', '8', 'B', '', '', 'C', '1', '', '', '', 'A', '', '', '', '8', '2', '', '5', '', '', '', '', '', '', '', '', '', '1', '', 'G', '', '', '3', '', '', '', '4', '1', 'D', '', 'E', '', '', 'G', 'C', '', '', '', '', '9', '', '', '', '', '', '', '6', '', '', '', '', '', '8', 'F', '', '2', '', 'D', 'A', '', '', '', '', '', '', '', '', '', '', '', '', 'E', '5', 'G', '', 'C', '', '', '', '4', '1', '', '', '', '', '', '', '7', '', '', 'F', '', '', 'B', '', '', '', '', 'G', '', '9', '6', '3', '2', '', '', '4', '', '', '', '', '5', '9', '', '', '', '', '', '', '', '', '', 'D', '7', '', 'A', '5', 'F', '2', '4', '', '', '', '', 'B', '', '', 'E', 'C', 'F', '9', '2', '', '', '8', '', '', '', 'G', '', 'A', '', '6', '3', ''];
        
        switch (boardSize) {
            case 4:
                populateBoard(squareArray2x2);
                break;
            case 9:
                populateBoard(squareArray3x3);
                break;
            case 16:
                populateBoard(squareArray4x4);
                break;
            default:
                break;
        }
    }

    return (
        <div className="sudocool-container">
            <SudoCoolBoard
                boardSize={boardSize}
                squares={squares}
                prefilledSquares={prefilledSquares}
                updateSquare={updateSquare}
                readOnly={readOnly} />
            <div className="buttonGroup">
                <select className="selector" defaultValue={boardSize} onChange={e => handleBoardSizeInput(e.target.value)}>
                    <option value="4">4x4</option>
                    <option value="9">9x9</option>
                    <option value="16">16x16</option>
                </select>
                { readOnly ?
                    <input type="button" value="Reset" className="button" onClick={handleClickReset}/> :
                    <input type="button" value="Solve" className="button" onClick={handleClickSolve}/>
                }
                <input type="button" value="Clear" className="button" onClick={e => handleClickClear(boardSize)}/>
            </div>
            <div className="buttonGroup">
                <input type="button" value="Easy" className="button" onClick={populateEasy}/>
                <input type="button" value="Medium" className="button" onClick={populateMedium}/>
                <input type="button" value="Hard" className="button" onClick={populateHard}/>
            </div>
        </div>
    );
}