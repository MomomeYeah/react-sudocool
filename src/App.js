import './App.css';
import { useState } from 'react';
import { Board } from './solver/board.js';

function SudoCoolSquare({ boardSize, rowIndex, colIndex, sectionIndex, squareIndex, squares, prefilledSquares, updateSquare, readOnly }) {
    const [isValid, setIsValid] = useState(true);

    const valueIndex = sectionIndex * boardSize + squareIndex;
    const value = squares[valueIndex];

    function handleBlur() {
        setIsValid(false);

        if( ! value ) {
            setIsValid(true);
        }

        var num = Number(value);
        if ( !isNaN(num) && num === Math.floor(num) && num > 0 && num <= boardSize ) {
            setIsValid(true);
        }
    }

    const className = `sudocool-item ${isValid ? "" : "invalid"} ${prefilledSquares.includes(valueIndex) ? "prefilled" : ""}`;
    return (
        <input
            className={className}
            readOnly={readOnly}
            data-row={rowIndex}
            data-col={colIndex}
            data-section={sectionIndex}
            value={value}
            onChange={(e) => updateSquare(sectionIndex, squareIndex, e.target.value)}
            onBlur={() => handleBlur()} />
    )
}

function SudoCoolSection({ boardSize, sectionIndex, squares, prefilledSquares, updateSquare, readOnly }) {
    const sectionSquares = [];
    for (let squareIndex = 0; squareIndex < boardSize; squareIndex++) {
        const row = 3 * Math.floor(sectionIndex / 3) + Math.floor(squareIndex / 3);
        const col = 3 * (sectionIndex % 3) + squareIndex % 3;

        sectionSquares.push(
            <SudoCoolSquare
                key={squareIndex}
                boardSize={boardSize}
                rowIndex={row}
                colIndex={col}
                sectionIndex={sectionIndex}
                squareIndex={squareIndex}
                squares={squares}
                prefilledSquares={prefilledSquares}
                updateSquare={updateSquare}
                readOnly={readOnly} />)
    }

    return (
        <div className="sudocool-section">
            {sectionSquares}
        </div>
    )
}

function SudoCoolBoard({ boardSize, squares, prefilledSquares, updateSquare, readOnly }) {
    const sections = [];
    for (let sectionIndex = 0; sectionIndex < boardSize; sectionIndex++) {
        sections.push(
            <SudoCoolSection
                key={sectionIndex}
                boardSize={boardSize}
                sectionIndex={sectionIndex}
                squares={squares}
                prefilledSquares={prefilledSquares}
                updateSquare={updateSquare}
                readOnly={readOnly} />)
    }

    return (
        <div className="sudocool-table-wrapper">
            <div className="sudocool-table">
                {sections}
            </div>
        </div>
    )
}

export default function App() {
    const boardSize = 9;
    const [history, setHistory] = useState([Array(boardSize ** 2).fill("")]);
    const [squares, setSquares] = useState(history[0]);
    const [prefilledSquares, setPrefilledSquares] = useState([]);
    const [readOnly, setReadOnly] = useState(false);

    function updateSquare(sectionIndex, squareIndex, value) {
        const newSquares = squares.slice();
        newSquares[(sectionIndex * boardSize) + squareIndex] = value;
        setHistory([newSquares]);
        setSquares(newSquares);
    }

    // submit the board for solving
    function handleClickSubmit() {
        const board = new Board();
        const solvedBoard = board.solve();;
        setHistory([...history, solvedBoard]);
        setSquares(solvedBoard);
        setReadOnly(true);

        // calculate the intersection of history[0] and history[1], resulting in the set of squares
        // that were pre-filled, as opposed to having been solved for
        const prefilled = [];
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

    return (
        <div className="sudocool-container">
            <SudoCoolBoard
                boardSize={boardSize}
                squares={squares}
                prefilledSquares={prefilledSquares}
                updateSquare={updateSquare}
                readOnly={readOnly} />
            <div>
                <input type="button" value="Solve" className="button" onClick={handleClickSubmit}/>
                <input type="button" value="Reset" className="button" onClick={handleClickReset}/>
            </div>
        </div>
    );
}