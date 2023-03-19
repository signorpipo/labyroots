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

    let rooms = [[[1, 1], [maze.length - 2, maze[0].length - 2], Math.pp_randomInt(0, 1)]];
    while (rooms.length > 0) {
        let room = Math.pp_randomPick(rooms);
        rooms.pp_removeEqual(room);

        if (!Global.skipRoom(room, createWallsResults)) {
            let start = room[0];
            let end = room[1];
            let usedRow = room[1];

            let wall = null;
            let useRow = false;
            let maxAttempts = 100;

            while (wall == null && maxAttempts > 0) {
                maxAttempts--;

                let wallAttempt = [[], []];

                let rowColumnDiff = (start[1] - start[0]) - (end[1] - end[0])
                if (rowColumnDiff < 0) {
                    useRow = Math.pp_randomInt(0, Math.ceil(Math.abs(rowColumnDiff) / (usedRow ? 0.5 : 2))) == 0;
                } else if (rowColumnDiff > 0) {
                    useRow = Math.pp_randomInt(0, Math.ceil(rowColumnDiff / (usedRow ? 2 : 0.5))) != 0;
                } else {
                    if (usedRow) {
                        useRow = Math.pp_randomInt(0, 2) == 0;
                    } else {
                        useRow = Math.pp_randomInt(0, 2) != 0;
                    }
                }

                if (useRow) {
                    let difference = end[0] - start[0];
                    let extraDistance = Math.floor(difference / 4);
                    let extraDistanceMultiplier = Math.pp_randomPick(1, 1, 1, 1, 0.5, 0.5, 0);
                    extraDistance = Math.ceil(extraDistance * extraDistanceMultiplier);

                    let startFixed = start[0] + 1 + extraDistance;
                    let endFixed = end[0] - 1 - extraDistance;
                    if (endFixed - startFixed >= 0) {
                        wallAttempt[0][0] = Math.pp_randomInt(startFixed, endFixed);
                        wallAttempt[0][1] = start[1];
                        wallAttempt[1][0] = wallAttempt[0][0];
                        wallAttempt[1][1] = end[1];

                        if (maze[wallAttempt[0][0]][wallAttempt[0][1] - 1] == LR.MazeItemType.ROCK_WALL_HORIZONTAL &&
                            maze[wallAttempt[1][0]][wallAttempt[1][1] + 1] == LR.MazeItemType.ROCK_WALL_HORIZONTAL) {
                            wall = wallAttempt;
                        }
                    }
                } else {
                    let difference = end[1] - start[1];
                    let extraDistance = Math.floor(difference / 4);
                    let extraDistanceMultiplier = Math.pp_randomPick(1, 1, 1, 1, 0.5, 0.5, 0);
                    extraDistance = Math.round(extraDistance * extraDistanceMultiplier);

                    let startFixed = start[1] + 1 + extraDistance;
                    let endFixed = end[1] - 1 - extraDistance;
                    if (endFixed - startFixed >= 0) {
                        wallAttempt[0][1] = Math.pp_randomInt(startFixed, endFixed);
                        wallAttempt[0][0] = start[0];
                        wallAttempt[1][1] = wallAttempt[0][1];
                        wallAttempt[1][0] = end[0];

                        if (maze[wallAttempt[0][0] - 1][wallAttempt[0][1]] == LR.MazeItemType.ROCK_WALL_HORIZONTAL &&
                            maze[wallAttempt[1][0] + 1][wallAttempt[1][1]] == LR.MazeItemType.ROCK_WALL_HORIZONTAL) {
                            wall = wallAttempt;
                        }
                    }
                }

                if (wall != null) {
                    if (wall[1][0] - wall[0][0] < 1 && wall[1][1] - wall[0][1] < 1) {
                        wall = null;
                        console.error("IMPOSSIBLE");
                    }
                }
            }

            if (wall != null) {
                let wallCells = [];
                if (useRow) {
                    let rowStart = wall[0][0];
                    let columnStart = wall[0][1];
                    for (let i = 0; i <= wall[1][1] - wall[0][1]; i++) {
                        wallCells.push([rowStart, columnStart + i]);
                    }
                } else {
                    let rowStart = wall[0][0];
                    let columnStart = wall[0][1];
                    for (let i = 0; i <= wall[1][0] - wall[0][0]; i++) {
                        wallCells.push([rowStart + i, columnStart]);
                    }
                }

                for (let wallCell of wallCells) {
                    createWallsResults.myWallCells.pp_pushUnique(wallCell, Global.cellCoordinatesEqual);
                    createWallsResults.myFreeCells.pp_removeEqual(wallCell, Global.cellCoordinatesEqual);

                    maze[wallCell[0]][wallCell[1]] = LR.MazeItemType.ROCK_WALL_HORIZONTAL;
                }

                if (useRow) {
                    let upRoom = [[start[0], start[1]], [wall[0][0] - 1, end[1]], useRow];
                    let bottomRoom = [[wall[0][0] + 1, start[1]], [end[0], end[1]], useRow];

                    rooms.push(upRoom);
                    rooms.push(bottomRoom);
                } else {
                    let leftRoom = [[start[0], start[1]], [end[0], wall[0][1] - 1], useRow];
                    let rightRoom = [[start[0], wall[0][1] + 1], [end[0], end[1]], useRow];

                    rooms.push(leftRoom);
                    rooms.push(rightRoom);
                }

                Global.addDoorToWall(wallCells, useRow, maze, createWallsResults);
                // add doors
            } else {
                console.error("WALL NULL");
            }
        }
    }

    Global.adjustMazeWalls(maze);

    return createWallsResults;
};

Global.skipRoom = function (room, createWallsResults) {
    let skipRoom = false;

    let start = room[0];
    let end = room[1];
    if ((end[0] - start[0]) <= 0 || (end[1] - start[1]) <= 0) {
        skipRoom = true;
    } else if ((end[0] - start[0]) <= 1 && (end[1] - start[1]) <= 1) {
        skipRoom = true;
    }

    return skipRoom;
};

Global.adjustMazeWalls = function (maze) {
    for (let i = 0; i < maze.length; i++) {
        let row = maze[i];
        for (let j = 0; j < row.length; j++) {
            let item = row[j];
            if (item >= LR.MazeItemType.ROCK_WALL_HORIZONTAL && item <= LR.MazeItemType.ROCK_WALL_CROSS) {
                let left = (j == 0) ? LR.MazeItemType.NONE : row[j - 1];
                let right = (j == row.length - 1) ? LR.MazeItemType.NONE : row[j + 1];
                let up = (i == 0) ? LR.MazeItemType.NONE : maze[i - 1][j];
                let bottom = (i == maze.length - 1) ? LR.MazeItemType.NONE : maze[i + 1][j];

                if (left && right && !up && !bottom) {
                    row[j] = LR.MazeItemType.ROCK_WALL_HORIZONTAL;
                } else if (!left && !right && up && bottom) {
                    row[j] = LR.MazeItemType.ROCK_WALL_VERTICAL;

                } else if (left && !right && up && bottom) {
                    row[j] = LR.MazeItemType.ROCK_WALL_T_LEFT;
                } else if (!left && right && up && bottom) {
                    row[j] = LR.MazeItemType.ROCK_WALL_T_RIGHT;
                } else if (left && right && !up && bottom) {
                    row[j] = LR.MazeItemType.ROCK_WALL_T_DOWN;
                } else if (left && right && up && !bottom) {
                    row[j] = LR.MazeItemType.ROCK_WALL_T_UP;

                } else if (left && !right && up && !bottom) {
                    row[j] = LR.MazeItemType.ROCK_WALL_BOTTOM_LEFT;
                } else if (left && !right && !up && bottom) {
                    row[j] = LR.MazeItemType.ROCK_WALL_TOP_LEFT;
                } else if (!left && right && !up && bottom) {
                    row[j] = LR.MazeItemType.ROCK_WALL_TOP_RIGHT;
                } else if (!left && right && up && !bottom) {
                    row[j] = LR.MazeItemType.ROCK_WALL_BOTTOM_RIGHT;

                } else if (!left && right && !up && !bottom) {
                    row[j] = LR.MazeItemType.ROCK_WALL_HORIZONTAL;
                } else if (left && !right && !up && !bottom) {
                    row[j] = LR.MazeItemType.ROCK_WALL_HORIZONTAL;

                } else if (!left && !right && up && !bottom) {
                    row[j] = LR.MazeItemType.ROCK_WALL_VERTICAL;
                } else if (!left && !right && !up && bottom) {
                    row[j] = LR.MazeItemType.ROCK_WALL_VERTICAL;

                } else {
                    row[j] = LR.MazeItemType.ROCK_WALL_CROSS;
                }
            }
        }
    }
};

Global.addDoorToWall = function (wallCells, useRow, maze, createWallsResults) {
    let doorCell = Math.pp_randomPick(wallCells);

    maze[doorCell[0]][doorCell[1]] = LR.MazeItemType.NONE;

    createWallsResults.myWallCells.pp_removeEqual(doorCell, Global.cellCoordinatesEqual);
    createWallsResults.myFreeCells.pp_pushUnique(doorCell, Global.cellCoordinatesEqual);
    createWallsResults.myDoors.pp_pushUnique([useRow, doorCell], Global.doorsEqual);
};