LR.CreateWallsResults = class CreateWallsResults {
    constructor() {
        this.myFreeCells = [];
        this.myWallCells = [];

        this.myDoors = [];

        this.myNoDoors = false;

        this.myBigTreeRoom = null;
        this.myBigTreeRoomSize = null;

        this.myPlayerRoom = null;
        this.myPlayerRoomSize = null;

        this.myWoodsRoom = null;
        this.myWoodsRoomSize = null;
    }

    reset() {
        this.myNoDoors = false;

        this.myFreeCells = [];
        this.myWallCells = [];

        this.myDoors = [];

        this.myBigTreeRoom = null;
        this.myPlayerRoom = null;
        this.myWoodsRoom = null;
    }
};

/*
TODO

- trailer finale con tanti maze dall'alto e poi welcome to the mazeverse
- testare random maze e un po' di tune

*/

Global.cellCoordinatesEqual = function (first, second) {
    return first[0] == second[0] && first[1] == second[1];
}

Global.doorsEqual = function (first, second) {
    let equal = true;

    if (first.length != second.length) {
        equal = false;
    } else {
        for (let i = 0; i < first.length; i++) {
            if (first[i] != second[i]) {
                equal = false;
                break;
            }
        }
    }

    return equal;
}

Global.createMazeverseMaze = function () {
    let maxAttempts = 10;

    let maze = null;

    while (maxAttempts > 0 && maze == null) {
        maxAttempts--;

        try {
            maze = Global.initializeMaze();

            let createWallsResults = new LR.CreateWallsResults();
            let createWallsMaxAttempts = 100;
            let returnedCreateWallsResults = null;

            Global.chooseSpecialRoomSetups(createWallsResults);
            do {
                Global.emptyMaze(maze);

                createWallsMaxAttempts--;

                createWallsResults.reset();
                returnedCreateWallsResults = Global.createWalls(maze, createWallsResults);

                if (returnedCreateWallsResults == null) {
                    if (Global.myFromAbove) {
                        console.error("Create Walls Failed:", 100 - createWallsMaxAttempts);
                    }
                }
            } while (returnedCreateWallsResults == null && createWallsMaxAttempts > 0);

            createWallsResults = returnedCreateWallsResults;

            if (createWallsResults == null) {
                throw "Create Wall Failed";
            }

            let addElementsResult = false;
            let addElementsMaxAttempts = 100;

            let mazeClone = [];
            for (let i = 0; i < maze.length; i++) {
                mazeClone[i] = [];
                let row = maze[i];
                for (let j = 0; j < row.length; j++) {
                    mazeClone[i][j] = maze[i][j];
                }
            }

            do {
                for (let i = 0; i < mazeClone.length; i++) {
                    let row = mazeClone[i];
                    for (let j = 0; j < row.length; j++) {
                        maze[i][j] = mazeClone[i][j];
                    }
                }

                addElementsMaxAttempts--;

                addElementsResult = Global.addElementsToMaze(maze, createWallsResults);

                if (!addElementsResult) {
                    if (Global.myFromAbove) {
                        console.error("Add Elements Failed:", 100 - addElementsMaxAttempts);
                    }
                }
            } while (!addElementsResult && addElementsMaxAttempts > 0);

            if (!addElementsResult) {
                throw "Add Elements Failed";
            }

            Global.adjustMazeWalls(maze);

        } catch (error) {
            if (Global.myFromAbove) {
                console.error("FAIL - Attempt:", 10 - maxAttempts, "- Error:", error);
            }
            maze = null;
        }
    }

    //Global.convertMazeToString(maze);

    //console.error(maze);

    return maze;
}

Global.initializeMaze = function () {
    let maze = [];

    let rowMax = Math.pp_randomPick(25, 25, 25, 25, 30)
    let columnMax = Math.pp_randomPick(25, 25, 25, 25, 30)
    let rows = Math.pp_randomInt(20, rowMax);
    let columns = Math.pp_randomInt(20, columnMax);

    for (let i = 0; i < rows; i++) {
        maze[i] = [];
        for (let j = 0; j < columns; j++) {
            maze[i][j] = LR.MazeItemType.NONE;
        }
    }

    return maze;
}

Global.emptyMaze = function (maze) {
    for (let i = 0; i < maze.length; i++) {
        let row = maze[i];
        for (let j = 0; j < row.length; j++) {
            maze[i][j] = LR.MazeItemType.NONE;
        }
    }
}

Global.convertMazeToString = function (maze) {
    for (let i = 0; i < maze.length; i++) {
        let row = maze[i];
        for (let j = 0; j < row.length; j++) {
            maze[i][j] = row[j].toString();
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