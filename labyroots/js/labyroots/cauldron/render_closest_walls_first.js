WL.registerComponent('render-closest-wall-first', {
}, {
    init() {
    },
    start() {
        this._myStarted = false;
        this._myWalls = [];

        this._myPlayerPosition = PP.vec3_create();
        this._myFirstPosition = PP.vec3_create();
        this._mySecondPosition = PP.vec3_create();

        this._myUpdateTimer = new PP.Timer(3);
    },
    update(dt) {
        if (Global.myReady) {
            if (!this._myStarted) {
                this._myStarted = true;
                this._myWalls = [];

                for (let i = 0; i < Global.myMaze._myCells.length; i++) {
                    let row = Global.myMaze._myCells[i];
                    for (let j = 0; j < row.length; j++) {
                        let currentCell = row[j];
                        if (currentCell.myStaticMazeItemType >= LR.MazeItemType.ROCK_WALL_HORIZONTAL && currentCell.myStaticMazeItemType <= LR.MazeItemType.ROCK_WALL_T_LEFT) {

                            let meshes = currentCell.myObject.pp_getComponents("mesh");
                            for (let mesh of meshes) {
                                this._myWalls.push([PP.vec3_create(), mesh.object]);
                            }
                        }
                    }
                }
            } else {
                this._myUpdateTimer.update(dt);
                if (this._myUpdateTimer.isDone()) {
                    this._myUpdateTimer.start();

                    for (let wall of this._myWalls) {
                        wall[1].pp_getPosition(wall[0]);
                    }

                    Global.myPlayer.getPosition(this._myPlayerPosition);
                    this._myWalls.sort(function (first, second) {
                        return first[0].vec3_distance(this._myPlayerPosition) - second[0].vec3_distance(this._myPlayerPosition);
                    }.bind(this));

                    for (let wall of this._myWalls) {
                        wall[1].pp_setActive(false);
                        wall[1].pp_setActive(true);
                    }
                }
            }
        }
    }
});