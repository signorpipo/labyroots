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

Global.createMazeverseMaze = function () {
    let maxAttempts = 10;

    let maze = null;

    while (maxAttempts > 0 && maze == null) {
        try {
            maze = Global.initializeMaze();

            let createWallsResults = Global.createWalls(maze);

            Global.addElementsToMaze(maze, createWallsResults);
        } catch (error) {
            console.error("FAIL - Attempt:", maxAttempts, "- Error:", error);
            maze = null;
        }
    }

    //Global.convertMazeToString(maze);

    //console.error(maze);

    return maze;
}

Global.initializeMaze = function () {
    let maze = [];

    let columns = Math.pp_randomInt(20, 25);
    let rows = Math.pp_randomInt(20, Math.pp_randomPick([35, 35, 25]));

    for (let i = 0; i < rows; i++) {
        maze[i] = [];
        for (let j = 0; j < columns; j++) {
            maze[i][j] = LR.MazeItemType.NONE;
        }
    }

    return maze;
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
    if (cell != null && cell.length > 0) {
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
    if (cell != null && cell.length > 0) {
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