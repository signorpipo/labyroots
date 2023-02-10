Global.mySecretWall = null;
Global.myIsWeddingTime = false;

LR.Maze = class Maze {
    constructor(mazeSetup, parent) {
        this._myDefaultCellSize = 2;

        this._myCellSize = mazeSetup.myCellSize;
        this._myCells = [];
        this._myTopLeftPosition = PP.vec3_create();
        this._myMazeObjectsParent = parent.pp_addObject();

        this.createCells(mazeSetup);
    }

    createCells(mazeSetup) {
        let isWedding = Global.mySaveManager.loadBool("is_wedding", false);

        this._myGridToUse = mazeSetup.myGrid;
        Global.myIsWeddingTime = false;
        if (isWedding) {
            this._myGridToUse = mazeSetup.mySecretGrid;
            Global.myIsWeddingTime = true;

            if (Global.myGoogleAnalytics) {
                gtag("event", "is_wedding_maze", {
                    "value": 1
                });
            }
        } else {
            if (Global.myGoogleAnalytics) {
                gtag("event", "is_normal_maze", {
                    "value": 1
                });
            }
        }

        Global.mySaveManager.save("is_wedding", false);

        this._myTopLeftPosition = this.computeTopLeftPosition(mazeSetup);

        let grid = this._myGridToUse;

        for (let i = 0; i < grid.length; i++) {
            let row = grid[i];
            this._myCells[i] = [];
            for (let j = 0; j < row.length; j++) {
                let value = row[j];
                let intValue = parseInt(value);
                let mazeItemType = intValue;
                let fruits = 0;
                if (intValue >= 50) {
                    mazeItemType = Math.floor(intValue / 10) * 10;
                    fruits = intValue % 10;
                }

                let cell = new LR.MazeCell();
                cell.myCellCoordinates.vec2_set(i, j);
                cell.myCellSize = this._myCellSize;
                cell.myStaticMazeItemType = mazeItemType;
                cell.myFruits = fruits;

                cell.myCellPosition.vec3_copy(this._myTopLeftPosition);
                cell.myCellPosition.vec3_add([-((this._myCellSize / 2) + j * this._myCellSize), 0, -((this._myCellSize / 2) + i * this._myCellSize)], cell.myCellPosition);

                this._myCells[i][j] = cell;
            }
        }
    }

    computeTopLeftPosition(mazeSetup) {
        let row = this._myGridToUse.length;
        let column = this._myGridToUse[0].length;

        let width = column * this._myCellSize;
        let depth = row * this._myCellSize;

        let leftPosition = Math.floor(width / 2);
        leftPosition += leftPosition % 2;

        let topPosition = Math.floor(depth / 2);
        topPosition += topPosition % 2;

        return [leftPosition, 0, topPosition];
    }

    buildMaze() {
        this._myMazeItems = WL.scene.pp_getObjectByName("Maze Items");

        let cellCoordinatesList = [];
        for (let i = 0; i < this._myCells.length; i++) {
            let row = this._myCells[i];
            for (let j = 0; j < row.length; j++) {
                cellCoordinatesList.push([i, j]);
            }
        }

        while (cellCoordinatesList.length > 0) {
            let randomIndex = Math.pp_randomInt(0, cellCoordinatesList.length - 1);
            let cellCoordinates = cellCoordinatesList[randomIndex];
            cellCoordinatesList.pp_removeIndex(randomIndex);

            this.buildCell(this._myCells[cellCoordinates[0]][cellCoordinates[1]]);
        }

        /*
        for (let i = 0; i < this._myCells.length; i++) {
            let row = this._myCells[i];
            for (let j = 0; j < row.length; j++) {
                let cell = row[j];
                this.buildCell(cell);
            }
        }
        */

        // a inizio partita va a creare tutte le mesh e le physx del gioco
        // questo non viene più ricaricato
        // muri, radicione, radici muro, il cuore, l'alberone, alberi umani
    }

    getCellByPosition(position) {
        let cellCoordinates = this.convertCellPositionToCellCoordinates(position);
        let cell = null;
        if (this._myCells[cellCoordinates[0]] != null) {
            cell = this._myCells[cellCoordinates[0]][cellCoordinates[1]];
        }
        return cell;
    }

    getCellNextToPositionEmpty(position) {
        let cellCoordinates = this.convertCellPositionToCellCoordinates(position);
        let close = [];
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (!(i == 1 && j == 1)) {
                    let row = cellCoordinates[0] - 1 + i;
                    let column = cellCoordinates[1] - 1 + j;
                    if (row >= 0 && row < this._myCells.length) {
                        if (column >= 0 && column < this._myCells[row].length) {
                            let cell = this._myCells[row][column];
                            if (cell.myStaticMazeItemType == LR.MazeItemType.NONE) {
                                close.push(cell);
                            }
                        }
                    }
                }
            }
        }
        return close;
    }

    convertCellPositionToCellCoordinates(position) {
        let cellCoordinates = [0, 0];
        let positionTopLeft = position.vec3_sub(this._myTopLeftPosition);

        cellCoordinates[0] = Math.max(0, -(Math.floor(positionTopLeft[2] / this._myCellSize) + 1));
        cellCoordinates[1] = Math.max(0, -(Math.floor(positionTopLeft[0] / this._myCellSize) + 1));

        return cellCoordinates;
    }

    convertCellCoordinatesToCellPosition(cellCoordinates) {
        let position = [-((this._myCellSize / 2) + cellCoordinates[1] * this._myCellSize), 0, -((this._myCellSize / 2) + cellCoordinates[0] * this._myCellSize)];
        return position;
    }

    getCellsByType(itemType) {
        let cells = [];

        for (let i = 0; i < this._myCells.length; i++) {
            let row = this._myCells[i];
            for (let j = 0; j < row.length; j++) {
                if (row[j].myStaticMazeItemType == itemType) {
                    cells.push(row[j]);
                }
            }
        }

        return cells;
    }

    buildCell(cell) {
        if (cell.myStaticMazeItemType != LR.MazeItemType.NONE) {

            let cellType = cell.myStaticMazeItemType;
            if (cellType == LR.MazeItemType.HUMAN_TREE_0) {
                let types = [];
                types.push(Global.myPerfectFruit);
                for (let i = 0; i < Global.mySetup.myTreeSetup.myPerfectTreeRatio; i++) {
                    types.push(Global.myGoodFruit);
                    types.push(Global.myBadFruit);
                }
                cellType = Math.pp_randomPick(types);
            }

            let cellItems = this._myMazeItems.pp_getObjectByNameChildren("" + cellType);
            if (cellItems != null) {
                let randomChild = Math.pp_randomPick(cellItems.pp_getChildren());
                if (randomChild != null) {
                    let oldChildPosition = randomChild.pp_getPosition();
                    randomChild.pp_setPosition(cell.myCellPosition);

                    let objectToSpawn = randomChild.pp_clone();
                    objectToSpawn.pp_setActive(true);
                    objectToSpawn.pp_setParent(this._myMazeObjectsParent);
                    //objectToSpawn.pp_setPosition(cell.myCellPosition);

                    randomChild.pp_setPosition(oldChildPosition);
                    if (cell.myFruits > 0) {
                        let tree = objectToSpawn.pp_getComponent("human-tree");
                        if (tree != null) {
                            tree.spawnFruits(cell.myFruits);
                        }
                        // get tree component and set fruits
                    }

                    if (cell.myStaticMazeItemType == LR.MazeItemType.BIG_TREE_FIRST_ROOT) {
                        Global.myAxe.pp_getComponent("axe").setStartTransforms(cell.myCellPosition);
                        Global.myAxeCell = cell;
                    }

                    if (cellType == LR.MazeItemType.SECRET_WALL) {
                        Global.mySecretWall = objectToSpawn;
                    }
                }
            }
        }
    }
}

Global.myAxeCell = null;

LR.MazeCell = class MazeCell {
    constructor() {
        this.myCellCoordinates = PP.vec2_create();
        this.myCellPosition = PP.vec3_create();
        this.myCellSize = 0;

        this.myHorizontalDirection = PP.vec3_create(0, 0, 1);
        this.myUpDirection = PP.vec3_create(0, 0, 1);

        this.myStaticMazeItemType = LR.MazeItemType.NONE;
        this.myFruits = 0;
    }

    getRandomPositionOnCell() {
        let randomDistance = Math.pp_random(0, this.myCellSize / 2);
        let randomAngle = Math.pp_random(0, 360);
        let randomDirection = this.myHorizontalDirection.vec3_rotateAxis(randomAngle, PP.vec3_create(0, 1, 0));
        randomDirection.vec3_scale(randomDistance, randomDirection);
        let randomPosition = this.myCellPosition.vec3_add(randomDirection, randomDirection);

        return randomPosition;
    }
}