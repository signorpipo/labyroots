LR.AddElemenstResults = class AddElemenstResults {
    constructor() {
        this.myRootsMustBeFar = false;
        this.myTreesMustBeFar = false;

        this.myRootsToAdd = 3;

        this.myAllElements = [];

        this.myElementsFar = [];

        this.myRootsFar = [];
        this.myTreesFar = [];

        this.myTreesFar = [];

        this.myZestiesFar = [];

        this.myPlayer = [0, 0];
        this.myFirstRoot = [0, 0];
    }
};


Global.addElementsToMaze = function (maze, createWallsResults) {
    let freeCells = createWallsResults.myFreeCells.pp_clone();
    let doors = createWallsResults.myDoors.pp_clone();

    let addElementsResults = new LR.AddElemenstResults();
    addElementsResults.myRootsMustBeFar = Math.pp_randomInt(0, 5) != 0;
    addElementsResults.myTreesMustBeFar = Math.pp_randomInt(0, 5) != 0;

    if (createWallsResults.myWoodsRoom != null) {
        Global.addWoods(maze, createWallsResults, freeCells, addElementsResults);
    }

    Global.addBigTree(maze, createWallsResults, freeCells, addElementsResults);
    let firstRootAdded = Global.addPlayer(maze, createWallsResults, freeCells, addElementsResults);

    if (!firstRootAdded) {
        Global.addFirstRoot(maze, createWallsResults, freeCells, addElementsResults);
    }

    if (Math.pp_randomInt(0, 10) != 0 && (!createWallsResults.myNoDoors || Math.pp_randomInt(0, 2) != 0)) {
        //console.error("roots");
        Global.addRootWalls(maze, createWallsResults, freeCells, doors, addElementsResults);
    }

    Global.addRoots(maze, createWallsResults, freeCells, addElementsResults);
    Global.addTrees(maze, createWallsResults, freeCells, addElementsResults);
    Global.addZesties(maze, createWallsResults, freeCells, addElementsResults);

    Global.addWondermelon(maze, createWallsResults, freeCells, addElementsResults);

    let everythingReachable = Global.isEverythingReachable(maze, addElementsResults);

    return everythingReachable;
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
        //console.error("NOT IN A FREE CELL NOT POSSIBLE");
    }

    freeCells.pp_removeEqual(bigTreePosition, Global.cellCoordinatesEqual);
    freeCells.pp_removeEqual([bigTreePosition[0] - 1, bigTreePosition[1]], Global.cellCoordinatesEqual);
    freeCells.pp_removeEqual([bigTreePosition[0] + 1, bigTreePosition[1]], Global.cellCoordinatesEqual);
    freeCells.pp_removeEqual([bigTreePosition[0], bigTreePosition[1] - 1], Global.cellCoordinatesEqual);
    freeCells.pp_removeEqual([bigTreePosition[0], bigTreePosition[1] + 1], Global.cellCoordinatesEqual);

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
            //console.error("NOT IN A FREE CELL NOT POSSIBLE");
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
    let farDistance = 3;
    while (far && !isFar && maxAttempts > 0) {
        maxAttempts--;

        firstRootPosition = Math.pp_randomPick(freeCells);
        isFar = Global.isFarFromAll(firstRootPosition, addElementsResults.myRootsFar, maze, farDistance);

        if (!isFar && maxAttempts == 0 && farDistance == 3) {
            farDistance = 4;
            maxAttempts = 50;
        }
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

            if (randomDoor.length < 5) {
                if (Global.isDoorFree(randomDoor, freeCells)) {
                    if (Global.isDoorLimited(randomDoor, maze)) {
                        if (!Global.isDoorBlockingPlayer(addElementsResults.myPlayer, addElementsResults.myFirstRoot, randomDoor, maze)) {
                            if (randomDoor.length == 2) {
                                //console.error("root door 2");
                                let doorCell = randomDoor[1];
                                maze[doorCell[0]][doorCell[1]] = randomDoor[0] ? LR.MazeItemType.BIG_TREE_WALL_HORIZONTAL : LR.MazeItemType.BIG_TREE_WALL_VERTICAL;
                                freeCells.pp_removeEqual(doorCell, Global.cellCoordinatesEqual);
                                addElementsResults.myAllElements.push(doorCell);

                            } else if (randomDoor.length == 3) {
                                //console.error("root door 3");
                                let doorCellIndex = Math.pp_randomInt(0, 1);
                                let doorCell = randomDoor[doorCellIndex + 1];
                                maze[doorCell[0]][doorCell[1]] = randomDoor[0] ? LR.MazeItemType.BIG_TREE_WALL_HORIZONTAL : LR.MazeItemType.BIG_TREE_WALL_VERTICAL;
                                freeCells.pp_removeEqual(doorCell, Global.cellCoordinatesEqual);
                                addElementsResults.myAllElements.push(doorCell);

                                let wallCellIndex = (doorCellIndex + 1) % 2;
                                let wallCell = randomDoor[wallCellIndex + 1];
                                maze[wallCell[0]][wallCell[1]] = LR.MazeItemType.ROCK_WALL_HORIZONTAL;
                                freeCells.pp_removeEqual(wallCell, Global.cellCoordinatesEqual);

                            } else if (randomDoor.length == 4) {
                                //console.error("root door 4");
                                let doorCellIndex = 1;
                                let doorCell = randomDoor[doorCellIndex];
                                maze[doorCell[0]][doorCell[1]] = randomDoor[0] ? LR.MazeItemType.BIG_TREE_WALL_HORIZONTAL : LR.MazeItemType.BIG_TREE_WALL_VERTICAL;
                                freeCells.pp_removeEqual(doorCell, Global.cellCoordinatesEqual);
                                addElementsResults.myAllElements.push(doorCell);

                                let wallCellIndex = 2;
                                let wallCell = randomDoor[wallCellIndex];
                                maze[wallCell[0]][wallCell[1]] = LR.MazeItemType.ROCK_WALL_HORIZONTAL;
                                freeCells.pp_removeEqual(wallCell, Global.cellCoordinatesEqual);

                                doorCellIndex = 3;
                                doorCell = randomDoor[doorCellIndex];
                                maze[doorCell[0]][doorCell[1]] = randomDoor[0] ? LR.MazeItemType.BIG_TREE_WALL_HORIZONTAL : LR.MazeItemType.BIG_TREE_WALL_VERTICAL;
                                freeCells.pp_removeEqual(doorCell, Global.cellCoordinatesEqual);
                                addElementsResults.myAllElements.push(doorCell);
                            } else {
                                //console.error("root door nope", randomDoor.length);
                            }

                            rootWallsAdded++;

                            break;
                        } else {
                            blockedDoors++;
                            if (blockedDoors > doorsLength - 4) {
                                //console.error("all doors are blocking?");
                            }

                            //console.error("door blocking player");
                        }
                    } else {
                        //console.error("door not limited");
                    }
                } else {
                    //console.error("door not free");
                }
            }
        }
    }

    //console.error("root walls:", rootWallsToAddOriginal, "- ", rootWallsAdded)
}

Global.addWoods = function (maze, createWallsResults, freeCells, addElementsResults) {
    let addRoot = Math.pp_randomInt(0, 2) != 0;

    let room = createWallsResults.myWoodsRoom;

    let start = room[0];
    let end = room[1];

    let roomCells = [];
    for (let row = start[0]; row <= end[0]; row++) {
        for (let column = start[1]; column <= end[1]; column++) {
            roomCells.push([row, column]);
        }
    }

    if (addRoot) {
        let rootPosition = Math.pp_randomPick(roomCells);
        roomCells.pp_removeEqual(rootPosition, Global.cellCoordinatesEqual);

        if (!freeCells.pp_hasEqual(rootPosition, Global.cellCoordinatesEqual)) {
            //console.error("NOT IN A FREE CELL NOT POSSIBLE");
        }
        freeCells.pp_removeEqual(rootPosition, Global.cellCoordinatesEqual);

        maze[rootPosition[0]][rootPosition[1]] = LR.MazeItemType.BIG_TREE_ROOT;

        addElementsResults.myAllElements.push(rootPosition);
        addElementsResults.myElementsFar.push(rootPosition);
        addElementsResults.myRootsFar.push(rootPosition);

        addElementsResults.myRootsToAdd--;
    }

    while (roomCells.length > 0) {
        let treePosition = Math.pp_randomPick(roomCells);
        roomCells.pp_removeEqual(treePosition, Global.cellCoordinatesEqual);

        if (!freeCells.pp_hasEqual(treePosition, Global.cellCoordinatesEqual)) {
            //console.error("NOT IN A FREE CELL NOT POSSIBLE");
        }
        freeCells.pp_removeEqual(treePosition, Global.cellCoordinatesEqual);

        maze[treePosition[0]][treePosition[1]] = LR.MazeItemType.HUMAN_TREE_0 + 7;

        addElementsResults.myAllElements.push(treePosition);
        addElementsResults.myElementsFar.push(treePosition);
    }
}

Global.addRoots = function (maze, createWallsResults, freeCells, addElementsResults) {
    let far = addElementsResults.myRootsMustBeFar;

    let rootsToAdd = addElementsResults.myRootsToAdd
    for (let i = 0; i < rootsToAdd; i++) {
        let rootPosition = Math.pp_randomPick(freeCells);
        let isFar = Global.isFarFromAll(rootPosition, addElementsResults.myRootsFar, maze);

        let maxAttempts = 100;
        let farDistance = 3;
        while (far && !isFar && maxAttempts > 0) {
            maxAttempts--;

            rootPosition = Math.pp_randomPick(freeCells);
            isFar = Global.isFarFromAll(rootPosition, addElementsResults.myRootsFar, maze, farDistance);

            if (!isFar && maxAttempts == 0 && farDistance == 3) {
                farDistance = 4;
                maxAttempts = 50;
            }
        }

        maze[rootPosition[0]][rootPosition[1]] = LR.MazeItemType.BIG_TREE_ROOT;

        freeCells.pp_removeEqual(rootPosition, Global.cellCoordinatesEqual);

        addElementsResults.myAllElements.push(rootPosition);
        addElementsResults.myElementsFar.push(rootPosition);
        addElementsResults.myRootsFar.push(rootPosition);
    }
}

Global.addTrees = function (maze, createWallsResults, freeCells, addElementsResults) {
    let far = addElementsResults.myTreesFar;

    let extra = 0;
    if (maze.length * maze[0].length > 700) {
        extra = 2
    } else if (maze.length * maze[0].length > 550) {
        extra = 1
    }

    let treesToAdd = Math.pp_randomInt(4 + extra, 8 + extra);
    if (Math.pp_randomInt(0, 10) == 0) {
        treesToAdd = 0;
    }

    for (let i = 0; i < treesToAdd; i++) {
        let treePosition = Math.pp_randomPick(freeCells);
        let isFar = Global.isFarFromAll(treePosition, addElementsResults.myTreesFar, maze);

        let maxAttempts = 100;
        let farDistance = 3;
        while (far && !isFar && maxAttempts > 0) {
            maxAttempts--;

            treePosition = Math.pp_randomPick(freeCells);
            isFar = Global.isFarFromAll(treePosition, addElementsResults.myTreesFar, maze, farDistance);

            if (!isFar && maxAttempts == 0 && farDistance == 3) {
                farDistance = 4;
                maxAttempts = 50;
            }
        }

        maze[treePosition[0]][treePosition[1]] = LR.MazeItemType.HUMAN_TREE_0 + 7;

        freeCells.pp_removeEqual(treePosition, Global.cellCoordinatesEqual);

        addElementsResults.myAllElements.push(treePosition);
        addElementsResults.myElementsFar.push(treePosition);
        addElementsResults.myTreesFar.push(treePosition);
    }
}

Global.addZesties = function (maze, createWallsResults, freeCells, addElementsResults) {
    let far = true;

    let extra = 0;
    if (maze.length * maze[0].length > 600) {
        extra = 1
    }

    let zestiesToAdd = Math.pp_randomInt(2, 3 + extra);
    if (Math.pp_randomInt(0, 10) == 0) {
        zestiesToAdd = 0;
    }

    for (let i = 0; i < zestiesToAdd; i++) {
        let zestyPosition = Math.pp_randomPick(freeCells);
        let isFar = Global.isFarFromAll(zestyPosition, addElementsResults.myZestiesFar, maze);

        let maxAttempts = 100;
        let farDistance = 3;
        while (far && !isFar && maxAttempts > 0) {
            maxAttempts--;

            zestyPosition = Math.pp_randomPick(freeCells);
            isFar = Global.isFarFromAll(zestyPosition, addElementsResults.myZestiesFar, maze, farDistance);

            if (!isFar && maxAttempts == 0 && farDistance == 3) {
                farDistance = 4;
                maxAttempts = 50;
            }
        }

        maze[zestyPosition[0]][zestyPosition[1]] = LR.MazeItemType.ZESTY;

        freeCells.pp_removeEqual(zestyPosition, Global.cellCoordinatesEqual);

        addElementsResults.myAllElements.push(zestyPosition);
        addElementsResults.myElementsFar.push(zestyPosition);
        addElementsResults.myZestiesFar.push(zestyPosition);
    }
}

Global.addWondermelon = function (maze, createWallsResults, freeCells, addElementsResults) {
    let wondermelonPosition = Math.pp_randomPick(freeCells);

    maze[wondermelonPosition[0]][wondermelonPosition[1]] = LR.MazeItemType.WONDERMELON;

    freeCells.pp_removeEqual(wondermelonPosition, Global.cellCoordinatesEqual);

    addElementsResults.myAllElements.push(wondermelonPosition);
    addElementsResults.myElementsFar.push(wondermelonPosition);
    addElementsResults.myZestiesFar.push(wondermelonPosition);
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

Global.isDoorLimited = function isDoorLimited(door, maze) {
    let isDoorLimited = true;

    if (door[0]) {
        let min = Number.MAX_VALUE;
        let max = -Number.MAX_VALUE;
        for (let i = 1; i < door.length; i++) {
            let doorCell = door[i];

            min = Math.min(min, doorCell[1]);
            max = Math.max(max, doorCell[1]);

            //console.error("row", doorCell[0]);
        }

        isDoorLimited = Global.isWallType(maze[door[1][0]][min - 1]) && Global.isWallType(maze[door[1][0]][max + 1]);
    } else {
        let min = Number.MAX_VALUE;
        let max = -Number.MAX_VALUE;
        for (let i = 1; i < door.length; i++) {
            let doorCell = door[i];

            min = Math.min(min, doorCell[0]);
            max = Math.max(max, doorCell[0]);

            //console.error("column", doorCell[1]);
        }

        isDoorLimited = Global.isWallType(maze[min - 1][door[1][1]]) && Global.isWallType(maze[max + 1][door[1][1]]);
    }

    return isDoorLimited;
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
    //console.error("Elements Not Reachable:", allElements.length);

    for (let reachableCell of reachableCells) {
        allElements.pp_removeEqual(reachableCell, Global.cellCoordinatesEqual);
    }

    //console.error("Elements Not Reachable:", allElements.length);

    return allElements.length == 0;
}

Global.isFarFromAll = function isFarFromAll(cell, otherCells, maze, far = 3) {
    let farFromAll = true;

    for (let otherCell of otherCells) {
        if (!Global.isFar(cell, otherCell, maze, far)) {
            farFromAll = false;
            break;
        }
    }

    return farFromAll;
}

Global.isFar = function isFar(first, second, maze, far = 3) {
    return Global.distanceBetweenCellPositions(first, second) > Math.max(maze.length, maze[0].length) / far;
}

Global.distanceBetweenCellPositions = function distanceBetweenCellPositions(first, second) {
    return Math.max(Math.abs(first[0] - second[0]), Math.abs(first[1] - second[1]))
}