WL.registerComponent('transformation', {
}, {
    init: function () {
    },
    start: function () {
        this._myStarted = false;
        this._myTransformationTimersSetup = null;
        this._myTransformationTimer = new PP.Timer(0);
        Global.myStage = 0;
    },
    update: function (dt) {
        if (!this._myStarted) {
            if (Global.myReady) {
                this._start();
            }
        } else {
            this._myTransformationTimer.update(dt);
            if (this._myTransformationTimer.isDone()) {
                if (Global.myPlayerLocomotion.canStop()) {
                    Global.myPlayerLocomotion.setIdle(true);
                    this._nextStage();
                    Global.myPlayerLocomotion.setIdle(false);
                }
            }
        }
    },
    _start() {
        this._myStarted = true;
        this._myTransformationTimersSetup = Global.mySetup.myPlayerSetup.myTransformationTimers;
        this._resetTransformation();
    },
    _resetTransformation() {
        Global.myStage = 0;
        this._myTransformationTimer.start(this._myTransformationTimersSetup[Global.myStage]);
    },
    _nextStage() {
        Global.myStage++;
        if (Global.myStage >= this._myTransformationTimersSetup.length) {
            this._death();
        } else {
            this._myTransformationTimer.start(this._myTransformationTimersSetup[Global.myStage]);

            PP.myLeftGamepad.pulse(0.5, 0.5);
            PP.myRightGamepad.pulse(0.5, 0.5);
        }
    },
    _death() {
        // crea albero nella cella corrente
        // dici alle radici che sei morto

        let cell = Global.myMaze.getCellsByType(LR.MazeItemType.PLAYER_RESPAWN);

        if (cell != null) {
            Global.myPlayer.teleportPosition(cell[0].myCellPosition, null, true);
            Global.myPlayer.resetReal(true, false, false, true);
            Global.myPlayer.resetHeadToReal();
        }

        this._resetTransformation();
    }
});

Global