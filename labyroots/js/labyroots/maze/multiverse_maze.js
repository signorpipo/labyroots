LR.CreateWallsResults = class CreateWallsResults {
    constructor() {
        this.myFreeCells = [];
        this.myDoorCells = [];
        this.myWallCells = [];
        this.mySpecialRooms = [];
    }
};

Global.cellCoordinatesEqual = function (first, second) {
    return first[0] == second[0] && first[1] == second[1];
}

Global.createMultiverseMaze = function () {
    let maze = Global.initializeMaze();

    let createWallsResults = Global.createWalls(maze);

    Global.addElementsToMaze(maze, createWallsResults);

    //Global.convertMazeToString(maze);

    console.error(maze);

    return maze;
}

Global.initializeMaze = function () {
    let maze = [];

    let columns = Math.max(20, 25);
    let rows = Math.max(20, Math.pp_randomPick([35, 35, 25]));

    for (let i = 0; i < rows; i++) {
        maze[i] = [];
        for (let j = 0; j < columns; j++) {
            maze[i][j] = LR.MazeItemType.NONE;
        }
    }

    return maze;
}

Global.createWalls = function (maze) {
    let createWallsResults = new LR.CreateWallsResults();

    for (let i = 1; i < maze.length - 1; i++) {
        let row = maze[i];
        for (let j = 1; j < row.length - 1; j++) {
            createWallsResults.myFreeCells.pp_pushUnique([i, j], Global.cellCoordinatesEqual);
        }
    }

    for (let i = 0; i < maze.length; i++) {
        let row = maze[i];
        for (let j = 0; j < row.length; j++) {
            if (i < 1 || i > maze.length - 2 || j < 1 || j > row.length - 2) {
                maze[i][j] = LR.MazeItemType.ROCK_WALL_HORIZONTAL;
                createWallsResults.myWallCells.pp_pushUnique([i, j], Global.cellCoordinatesEqual);
            }
        }
    }

    return createWallsResults;
}

Global.addElementsToMaze = function (maze, createWallsResults) {
    let freeCells = createWallsResults.myFreeCells.pp_clone();

    let itemsToAdd = [
        LR.MazeItemType.PLAYER_START, LR.MazeItemType.BIG_TREE, LR.MazeItemType.BIG_TREE_FIRST_ROOT,
        LR.MazeItemType.BIG_TREE_ROOT, LR.MazeItemType.BIG_TREE_ROOT, LR.MazeItemType.BIG_TREE_ROOT,
        LR.MazeItemType.HUMAN_TREE_0, LR.MazeItemType.HUMAN_TREE_0, LR.MazeItemType.HUMAN_TREE_0,
    ];

    for (let itemToAdd of itemsToAdd) {
        let randomCell = Math.pp_randomPick(freeCells);
        freeCells.pp_removeEqual(randomCell, Global.cellCoordinatesEqual);

        maze[randomCell[0]][randomCell[1]] = itemToAdd;
    }
}

Global.convertMazeToString = function (maze) {
    for (let i = 0; i < maze.length; i++) {
        let row = maze[i];
        for (let j = 0; j < row.length; j++) {
            maze[i][j] = row[i].toString();
            if (maze[i][j].length < 2) {
                maze[i][j] = "0" + maze[i][j];
            }
        }
    }
}

Global.lookPlayerAligned = function (position) {
    let rotationQuat = PP.quat_create();

    let cell = Global.myMaze.getCellsByType(LR.MazeItemType.PLAYER_START);
    if (cell != null) {
        let cellPosition = cell[0].myCellPosition;
        let direction = cellPosition.vec3_sub(position).vec3_removeComponentAlongAxis([0, 1, 0]);
        if (!direction.vec3_isZero(0.00001)) {
            direction.vec3_normalize(direction);

            if (Math.abs(direction[0]) > Math.abs(direction[2])) {
                direction = [1 * Math.pp_sign(direction[0]), 0, 0];
            } else {
                direction = [0, 0, 1 * Math.pp_sign(direction[2])];
            }

            direction.vec3_normalize(direction);
        }

        rotationQuat.quat_setUp([0, 1, 0], direction);
    }

    return rotationQuat;
}


Global.lookBigTreeAligned = function (position) {
    let rotationQuat = PP.quat_create();

    let cell = Global.myMaze.getCellsByType(LR.MazeItemType.BIG_TREE);
    if (cell != null) {
        let cellPosition = cell[0].myCellPosition;
        let direction = cellPosition.vec3_sub(position).vec3_removeComponentAlongAxis([0, 1, 0]);
        if (!direction.vec3_isZero(0.00001)) {
            direction.vec3_normalize(direction);

            if (Math.abs(direction[0]) > Math.abs(direction[2])) {
                direction = [1 * Math.pp_sign(direction[0]), 0, 0];
            } else {
                direction = [0, 0, 1 * Math.pp_sign(direction[2])];
            }

            direction.vec3_normalize(direction);
        }

        rotationQuat.quat_setUp([0, 1, 0], direction);
    }

    return rotationQuat;
}