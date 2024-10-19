import React from 'react'
import { render, screen } from '@testing-library/react';
import { App, SudoCoolSquare, BoardContext } from './App';

describe("App", () => {
    test("renders successfully", () => {
        render(<App />);
    });
});

describe("SudoCoolSquare", () => {
    function renderSquare(value: string, prefilled: boolean, invalid: boolean, solution: any = null) {
        // variables for BoardContext
        const boardSize = 9;
        const squares = [] as Array<string>;
        const updateSquare = () => {};

        // variables for square
        const section = 1;
        const squareIndex = 1;
        render(<BoardContext.Provider value={{ boardSize, squares, solution, updateSquare }}>
            <SudoCoolSquare
                section={section}
                value={value}
                prefilled={prefilled}
                invalid={invalid}
                squareIndex={squareIndex} />
            </BoardContext.Provider>);

        return screen.findByRole('textbox');
    };

    test("valid square with no value", async () => {
        const value = "";
        const prefilled = false;
        const invalid = false;
        const utils = await renderSquare(value, prefilled, invalid);
        
        expect(utils).toBeInTheDocument();
        expect(utils).not.toHaveAttribute("readonly");
        expect(utils.getAttribute("value")).toEqual("");
        expect(utils).not.toHaveClass("prefilled");
        expect(utils).not.toHaveClass("invalid");
    });

    test("valid square with value", async () => {
        const value = "2";
        const prefilled = false;
        const invalid = false;
        const utils = await renderSquare(value, prefilled, invalid);

        expect(utils).toBeInTheDocument();
        expect(utils).not.toHaveAttribute("readonly");
        expect(utils).toHaveValue(value);
        expect(utils).not.toHaveClass("prefilled");
        expect(utils).not.toHaveClass("invalid");
    });

    test("invalid prefilled square", async () => {
        const value = "A";
        const prefilled = true;
        const invalid = true;
        const utils = await renderSquare(value, prefilled, invalid);

        expect(utils).toBeInTheDocument();
        expect(utils).not.toHaveAttribute("readonly");
        expect(utils).toHaveValue("A");
        expect(utils).toHaveClass("prefilled");
        expect(utils).toHaveClass("invalid");
    });

    test("readonly square", async () => {
        const value = "1";
        const prefilled = false;
        const invalid = false;
        const solution = {solution: []};
        const utils = await renderSquare(value, prefilled, invalid, solution);

        expect(utils).toBeInTheDocument();
        expect(utils).toHaveAttribute("readonly");
        expect(utils).toHaveValue("1");
        expect(utils).not.toHaveClass("prefilled");
        expect(utils).not.toHaveClass("invalid");
    });
});
