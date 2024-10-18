import { Square } from './square';

describe("Initially unsolved square", () => {
    // create square before each test
    const [row, col, section, value] = [1, 2, 3, ""];
    const possibilities = ["3", "4", "5", "6", "7"];
    let square: Square;

    beforeEach(() => {
        square = new Square(row, col, section, possibilities, value);
    });

    test("square is created with correct fields", () => {
        expect(square).not.toBeNull();
        expect(square.row).toEqual(row);
        expect(square.col).toEqual(col);
        expect(square.section).toEqual(section);
        expect(square.value).toBeNull();
        expect(square.solved).toEqual(false);
        expect(square.possibilities).toEqual(possibilities);
    });

    // removePossibility
    test("can remove possibility", () => {
        square.removePossibility("3");
        expect(square.solved).toEqual(false);
        expect(square.value).toEqual(null);
        expect(square.possibilities).toEqual(["4", "5", "6", "7"]);
    });

    // TODO: removePossibilityIfConflicting

    // removePossibilities
    test("can remove multiple possibilities", () => {
        square.removePossibilities(["4", "5"]);
        expect(square.solved).toEqual(false);
        expect(square.value).toEqual(null);
        expect(square.possibilities).toEqual(["3", "6", "7"]);
    });

    // solve
    test("can solve", () => {
        square.solve("7");
        expect(square.solved).toEqual(true);
        expect(square.value).toEqual("7");
        expect(square.possibilities).toHaveLength(0);
    });

    // hasPossibility
    test("has valid possibility", () => {
        expect(square.hasPossibility("3")).toEqual(true);
    });

    test("lacks invalid possibility", () => {
        expect(square.hasPossibility("2")).toEqual(false);
    });

    // TODO: shareAnyPossibilities

    // TODO: hasIdenticalPossibilities
});

describe("Initially solved square", () => {
    // create square before each test
    const [row, col, section, possibilities, value] = [1, 2, 3, [], "4"];
    let square: Square;

    beforeEach(() => {
        square = new Square(row, col, section, possibilities, value);
    });

    test("square is created with the correct fields", () => {
        expect(square).not.toBeNull();
        expect(square.row).toEqual(row);
        expect(square.col).toEqual(col);
        expect(square.section).toEqual(section);
        expect(square.value).toEqual("4");
        expect(square.solved).toEqual(true);
        expect(square.possibilities).toHaveLength(0);
    });
});