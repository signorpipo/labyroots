LR.Maze = class Maze {
    constructor(mazeSetup) {
        // carica il maze in una matrice fatta di cell

        this._myDefaultCellSize = 2;

        this._myCellSize = mazeSetup.myCellSize;
        this._myCells = [];
        this._myTopLeftPosition = PP.vec3_create();

        this.createCells(mazeSetup);
    }

    createCells(mazeSetup) {
        //compute top left position

        let grid = mazeSetup.myGrid;

        for (let i = 0; i < grid.length; i++) {
            let row = grid[i];
            this._myCells[i] = [];
            for (let j = 0; j < row.length; j++) {
                let value = row[j];
                let intValue = parseInt(value);
                let mazeItemType = intValue;
                let fruits = 0;
                if (intValue >= 50) {
                    mazeItemType = Math.floor(intValue / 10);
                    fruits = intValue % 10;
                }

                let cell = new LR.MazeCell();
                cell.myCellCoordinates.vec2_set(i, j);
                cell.myCellSize = this._myCellSize;
                cell.myStaticMazeItemType = mazeItemType;
                cell.myFruits = fruits;

                cell.myCellPosition.vec3_copy(this._myTopLeftPosition);
                cell.myCellPosition.vec3_add([-((this._myCellSize / 2) + i * this._myCellSize), 0, ((this._myCellSize / 2) + j * this._myCellSize)], cell.myCellPosition);

                this._myCells[i][j] = cell;
            }
        }
    }

    buildMaze() {
        // a inizio partita va a creare tutte le mesh e le physx del gioco
        // questo non viene più ricaricato
        // muri, radicione, radici muro, il cuore, l'alberone, alberi umani
    }

    getCellByPosition(position) {
        let cellCoordinates = this.convertCellPositionToCellCoordinates(position);

        let cell = null;

        let cellRow = this._myCells[cellCoordinates[0]];
        if (cellRow != null) {
            cell = cellRow[cellCoordinates[1]];
        }

        if (cell == null) {
            cell = this.createCell(cellCoordinates);
        }

        return cell;
    }

    convertCellPositionToCellCoordinates(position) {

    }

    convertCellCoordinatesToCellPosition(cellCoordinates) {

    }

    createCell(cellCoordinates) {
        let cell = new MazeCell();

        cell.myCellCoordinates.vec2_copy(cellCoordinates);
        cell.myCellPosition = this.convertCellCoordinatesToCellPosition(cellCoordinates);
        cell.myCellSize = this._myCellSize;

        return cell;
    }
}

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
        let randomDirection = this.myHorizontalDirection.vec3_rotateAxis(randomAngle, PP.vec3_create(0, 1, 0), randomDirection);
        randomDirection.vec3_scale(randomDistance, randomDirection);
        let randomPosition = this.myCellPosition.vec3_add(randomDirection, randomDirection);

        return randomPosition;
    }
}