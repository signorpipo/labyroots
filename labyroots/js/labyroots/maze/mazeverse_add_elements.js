LR.AddElemenstResults = class AddElemenstResults {
    constructor() {
        this.myRootsMustBeFar = false;

        this.myAllElements = [];

        this.myElementsFar = [];

        this.myRootsFar = [];

        this.myTreesFar = [];

        this.myZestyFar = [];

        this.myPlayer = [0, 0];
        this.myFirstRoot = [0, 0];
    }
};


Global.addElementsToMaze = function (maze, createWallsResults) {
    let freeCells = createWallsResults.myFreeCells.pp_clone();
    let doors = createWallsResults.myDoors.pp_clone();

    let addElementsResults = new LR.AddElemenstResults();
    addElementsResults.myRootsMustBeFar = Math.pp_randomInt(0, 5) != 0;

    Global.addBigTree(maze, createWallsResults, freeCells, addElementsResults);
    let firstRootAdded = Global.addPlayer(maze, createWallsResults, freeCells, addElementsResults);

    if (!firstRootAdded) {
        Global.addFirstRoot(maze, createWallsResults, freeCells, addElementsResults);
    }

    if (Math.pp_randomInt(0, 10) != 0 && (!createWallsResults.myNoDoors || Math.pp_randomInt(0, 2) != 0)) {
        Global.addRootWalls(maze, createWallsResults, freeCells, doors, addElementsResults);
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

    return Global.isEverythingReachable(maze, addElementsResults);
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

    addElementsResults.myAllElements.push(bigTreePosition);
    addElementsResults.myElementsFar.push(bigTreePosition);
    addElementsResults.myRootsFar.push(bigTreePosition);
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

        addElementsResults.myAllElements.push(playerPosition);
        addElementsResults.myElementsFar.push(playerPosition);
        addElementsResults.myPlayer.pp_copy(playerPosition);
        addElementsResults.myRootsFar.push(playerPosition);

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

        addElementsResults.myAllElements.push(firstRootPosition);
        addElementsResults.myElementsFar.push(firstRootPosition);
        addElementsResults.myFirstRoot.pp_copy(firstRootPosition);
        addElementsResults.myRootsFar.push(firstRootPosition);
    } else {
        let playerPosition = Math.pp_randomPick(freeCells);
        freeCells.pp_removeEqual(playerPosition, Global.cellCoordinatesEqual);

        maze[playerPosition[0]][playerPosition[1]] = LR.MazeItemType.PLAYER_START;

        addElementsResults.myAllElements.push(playerPosition);
        addElementsResults.myElementsFar.push(playerPosition);
        addElementsResults.myPlayer.pp_copy(playerPosition);
        addElementsResults.myRootsFar.push(playerPosition);
    }

    return firstRootAdded;
}

Global.addFirstRoot = function (maze, createWallsResults, freeCells, addElementsResults) {
    let far = addElementsResults.myRootsMustBeFar;

    let firstRootPosition = Math.pp_randomPick(freeCells);
    let isFar = Global.isFarFromAll(firstRootPosition, addElementsResults.myRootsFar, maze);

    let maxAttempts = 100;
    while (far && !isFar && maxAttempts > 0) {
        maxAttempts--;

        firstRootPosition = Math.pp_randomPick(freeCells);
        isFar = Global.isFarFromAll(firstRootPosition, addElementsResults.myRootsFar, maze);
    }

    maze[firstRootPosition[0]][firstRootPosition[1]] = LR.MazeItemType.BIG_TREE_FIRST_ROOT;

    freeCells.pp_removeEqual(firstRootPosition, Global.cellCoordinatesEqual);

    addElementsResults.myAllElements.push(firstRootPosition);
    addElementsResults.myElementsFar.push(firstRootPosition);
    addElementsResults.myFirstRoot.pp_copy(firstRootPosition);
    addElementsResults.myRootsFar.push(firstRootPosition);
}

Global.addRootWalls = function (maze, createWallsResults, freeCells, doors, addElementsResults) {
    let rootWallsToAdd = Math.round(createWallsResults.myDoors.length * (Math.pp_random(0.2, 0.4)));

    let rootWallsAdded = 0;
    let rootWallsToAddOriginal = rootWallsToAdd;

    let blockedDoors = 0;
    let doorsLength = doors.length;
    while (rootWallsToAdd > 0) {
        rootWallsToAdd--;

        let maxAttempts = 100;
        while (maxAttempts > 0 && doors.length > 0) {
            maxAttempts--;

            let randomDoorIndex = Math.pp_randomInt(0, doors.length - 1);
            let randomDoor = doors[randomDoorIndex];
            doors.pp_removeIndex(randomDoorIndex);

            if (Global.isDoorFree(randomDoor, freeCells)) {
                if (!Global.isDoorBlockingPlayer(addElementsResults.myPlayer, addElementsResults.myFirstRoot, randomDoor, maze)) {
                    for (let i = 1; i < randomDoor.length; i++) {
                        let doorCell = randomDoor[i];

                        maze[doorCell[0]][doorCell[1]] = randomDoor[0] ? LR.MazeItemType.BIG_TREE_WALL_HORIZONTAL : LR.MazeItemType.BIG_TREE_WALL_VERTICAL;

                        freeCells.pp_removeEqual(doorCell, Global.cellCoordinatesEqual);

                        addElementsResults.myAllElements.push(doorCell);
                    }

                    rootWallsAdded++;

                    break;
                } else {
                    blockedDoors++;
                    if (blockedDoors > doorsLength - 4) {
                        console.error("all doors are blocking?");
                    }

                    console.error("door blocking player");
                }
            } else {
                console.error("door not free");
            }
        }
    }

    console.error("root walls:", rootWallsToAddOriginal, "- ", rootWallsAdded)
}

Global.isDoorFree = function isDoorFree(door, freeCells) {
    let isDoorFree = true;

    for (let i = 1; i < door.length; i++) {
        let doorCell = door[i];

        if (!freeCells.pp_hasEqual(doorCell)) {
            isDoorFree = false;
            break;
        }
    }

    return isDoorFree;
}

Global.isDoorBlockingPlayer = function isDoorBlockingPlayer(player, firstRoot, randomDoor, maze) {
    let mazeClone = [];
    for (let i = 0; i < maze.length; i++) {
        mazeClone[i] = [];
        let row = maze[i];
        for (let j = 0; j < row.length; j++) {
            mazeClone[i][j] = maze[i][j];
        }
    }

    for (let i = 1; i < randomDoor.length; i++) {
        let doorCell = randomDoor[i];

        mazeClone[doorCell[0]][doorCell[1]] = randomDoor[0] ? LR.MazeItemType.BIG_TREE_WALL_HORIZONTAL : LR.MazeItemType.BIG_TREE_WALL_VERTICAL;
    }

    let reachableCells = Global.getReachableCells(player, mazeClone, true);

    return !reachableCells.pp_hasEqual(firstRoot, Global.cellCoordinatesEqual);
}

Global.isEverythingReachable = function isEverythingReachable(maze, addElementsResult) {
    let reachableCells = Global.getReachableCells(addElementsResult.myPlayer, maze, false);

    let allElements = addElementsResult.myAllElements.pp_clone();
    console.error("Elements Not Reachable:", allElements.length);

    for (let reachableCell of reachableCells) {
        allElements.pp_removeEqual(reachableCell, Global.cellCoordinatesEqual);
    }

    console.error("Elements Not Reachable:", allElements.length);

    return allElements.length == 0;
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