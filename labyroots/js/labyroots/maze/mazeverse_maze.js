LR.CreateWallsResults = class CreateWallsResults {
    constructor() {
        this.myFreeCells = [];
        this.myWallCells = [];

        this.myDoors = [];
        this.mySpecialRooms = [];
    }
};

/*
TODO

- fare che le porte possono anche essere di 2-3 celle
- metti le porte radici
- metti il player e poi la radice ascia (poi gestire se c'è la stanza speciale)
    - controllare che si possa raggiungere considerando le radici muro come muro altrimenti rimetterle
- mettere le altre radici, con una certa probabilità stanno distanti sia dal player che dalle altre radici
- mettere alberi, anche qua con un certa probabilità controllano (singolarmente) che siano distanti
    - magari anche un controllo globale ceh se è true allora per forza sono tutti distanti
- mettere da 2 a 4 zesty

Chiarimenti
- essere dsitante significa essere a più di 1/3 del lato piu corto

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

            let createWallsResults = null;
            let createWallsMaxAttempts = 100;
            do {
                createWallsMaxAttempts--;

                createWallsResults = Global.createWalls(maze);
            } while (createWallsResults == null && createWallsMaxAttempts > 0);

            if (createWallsResults == null) {
                throw "Create Wall Failed";
            }

            let addElementsResult = false;
            let addElementsMaxAttempts = 100;
            do {
                addElementsMaxAttempts--;

                addElementsResult = Global.addElementsToMaze(maze, createWallsResults);
            } while (!addElementsResult && addElementsMaxAttempts > 0);

            if (!addElementsResult) {
                throw "Add Elements Failed";
            }
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