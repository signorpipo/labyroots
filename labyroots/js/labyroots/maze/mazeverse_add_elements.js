LR.AddElemenstResults = class AddElemenstResults {
    constructor() {
        this.myElementsFar = [];
        this.myPlayer = [0, 0];
        this.myFirstRoot = [0, 0];
    }
};


Global.addElementsToMaze = function (maze, createWallsResults) {
    let freeCells = createWallsResults.myFreeCells.pp_clone();

    let addElementsResults = new LR.AddElemenstResults();

    Global.addBigTree(maze, createWallsResults, freeCells, addElementsResults);
    let firstRootAdded = Global.addPlayer(maze, createWallsResults, freeCells, addElementsResults);

    if (!firstRootAdded) {
        Global.addFirstRoot(maze, createWallsResults, freeCells, addElementsResults);
    }

    let itemsToAdd = [
        LR.MazeItemType.BIG_TREE_ROOT, LR.MazeItemType.BIG_TREE_ROOT, LR.MazeItemType.BIG_TREE_ROOT,
        LR.MazeItemType.HUMAN_TREE_0, LR.MazeItemType.HUMAN_TREE_0, LR.MazeItemType.HUMAN_TREE_0,
    ];


    for (let itemToAdd of itemsToAdd) {
        let randomCell = Math.pp_randomPick(freeCells);
        freeCells.pp_removeEqual(randomCell, Global.cellCoordinatesEqual);

        maze[randomCell[0]][randomCell[1]] = itemToAdd;
    }

    return true;
}

Global.addBigTree = function (maze, createWallsResults, freeCells, addElementsResults) {
    let room = createWallsResults.myBigTreeRoom;

    let start = room[0];
    let end = room[1];

    let rowStart = start[0] + 1;
    let rowEnd = end[0] - 1;

    let columnStart = start[1] + 1;
    let columnEnd = end[1] - 1;

    let bigTreePosition = [Math.pp_randomInt(rowStart, rowEnd), Math.pp_randomInt(columnStart, columnEnd)];
    maze[bigTreePosition[0]][bigTreePosition[1]] = LR.MazeItemType.BIG_TREE;

    if (!freeCells.pp_hasEqual(bigTreePosition, Global.cellCoordinatesEqual)) {
        console.error("NOT IN A FREE CELL NOT POSSIBLE");
    }

    freeCells.pp_removeEqual(bigTreePosition, Global.cellCoordinatesEqual);

    addElementsResults.myElementsFar.push(bigTreePosition);
}

Global.addPlayer = function (maze, createWallsResults, freeCells, addElementsResults) {
    let firstRootAdded = false;

    if (createWallsResults.myPlayerRoom != null) {
        firstRootAdded = true;

        let room = createWallsResults.myPlayerRoom;

        let start = room[0];
        let end = room[1];

        let rowStart = start[0];
        let rowEnd = end[0];

        let columnStart = start[1];
        let columnEnd = end[1];

        let playerPosition = [Math.pp_randomInt(rowStart, rowEnd), Math.pp_randomInt(columnStart, columnEnd)];
        maze[playerPosition[0]][playerPosition[1]] = LR.MazeItemType.PLAYER_START;

        if (!freeCells.pp_hasEqual(playerPosition, Global.cellCoordinatesEqual)) {
            console.error("NOT IN A FREE CELL NOT POSSIBLE");
        }

        freeCells.pp_removeEqual(playerPosition, Global.cellCoordinatesEqual);

        addElementsResults.myElementsFar.push(playerPosition);
        addElementsResults.myPlayer.pp_copy(playerPosition);

        let firstRootPosition = [0, 0];
        let found = false;
        while (!found) {
            firstRootPosition = [Math.pp_randomInt(rowStart, rowEnd), Math.pp_randomInt(columnStart, columnEnd)];
            if (freeCells.pp_hasEqual(firstRootPosition, Global.cellCoordinatesEqual)) {
                found = true;
            }
        }

        maze[firstRootPosition[0]][firstRootPosition[1]] = LR.MazeItemType.BIG_TREE_FIRST_ROOT;

        freeCells.pp_removeEqual(firstRootPosition, Global.cellCoordinatesEqual);

        addElementsResults.myElementsFar.push(firstRootPosition);
        addElementsResults.myFirstRoot.pp_copy(firstRootPosition);
    } else {
        let randomCell = Math.pp_randomPick(freeCells);
        freeCells.pp_removeEqual(randomCell, Global.cellCoordinatesEqual);

        maze[randomCell[0]][randomCell[1]] = LR.MazeItemType.PLAYER_START;

        addElementsResults.myElementsFar.push(randomCell);
        addElementsResults.myPlayer.pp_copy(randomCell);
    }

    return firstRootAdded;
}

Global.addFirstRoot = function (maze, createWallsResults, freeCells, addElementsResults) {
    let far = Math.pp_randomInt(0, 1) != 0;

    let firstRootPosition = Math.pp_randomPick(freeCells);
    let isFar = Global.isFarFromAll(firstRootPosition, addElementsResults.myElementsFar, maze);

    let maxAttempts = 100;
    while (far && !isFar && maxAttempts > 0) {
        maxAttempts--;

        firstRootPosition = Math.pp_randomPick(freeCells);
        isFar = Global.isFarFromAll(firstRootPosition, addElementsResults.myElementsFar, maze);
    }

    maze[firstRootPosition[0]][firstRootPosition[1]] = LR.MazeItemType.BIG_TREE_FIRST_ROOT;

    freeCells.pp_removeEqual(firstRootPosition, Global.cellCoordinatesEqual);

    addElementsResults.myElementsFar.push(firstRootPosition);
    addElementsResults.myFirstRoot.pp_copy(firstRootPosition);
}

Global.isFarFromAll = function isFarFromAll(cell, otherCells, maze) {
    let farFromAll = true;

    for (let otherCell of otherCells) {
        if (!Global.isFar(cell, otherCell, maze, 4)) {
            farFromAll = false;
            break;
        }
    }

    return farFromAll;
}

Global.isFar = function isFar(first, second, maze, far = 3.5) {
    return Global.distanceBetweenCellPositions(first, second) > Math.max(maze.length, maze[0].length) / far;
}

Global.distanceBetweenCellPositions = function distanceBetweenCellPositions(first, second) {
    return Math.max(Math.abs(first[0] - second[0]), Math.abs(first[1] - second[1]))
}