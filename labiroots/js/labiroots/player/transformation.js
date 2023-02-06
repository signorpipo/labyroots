WL.registerComponent('transformation', {
}, {
    init: function () {
        Global.myTransformation = this;
    },
    start: function () {
        this._myStarted = false;
        this._myTransformationTimersSetup = null;
        this._myTransformationTimer = new PP.Timer(0);
        Global.myStage = 0;

        this._myLastFreeCell = null;

        this._myLamenti = [];
        this._myLamenti[0] = PP.myAudioManager.createAudioPlayer(AudioID.LAMENTO_UMANO_1);
        this._myLamenti[1] = PP.myAudioManager.createAudioPlayer(AudioID.LAMENTO_UMANO_2);
        this._myLamenti[2] = PP.myAudioManager.createAudioPlayer(AudioID.LAMENTO_UMANO_3);

        this._myAudioHeal = PP.myAudioManager.createAudioPlayer(AudioID.HEAL);
        this._myAudioHeal2 = PP.myAudioManager.createAudioPlayer(AudioID.HEAL2);

        this._myObjectToIgnore = [];
    },
    update: function (dt) {
        Global.myCancelTeleport = Math.max(Global.myCancelTeleport - 1, 0)
        if (!this._myStarted) {
            if (Global.myReady) {
                this._start();
            }
        } else {

            let playerPosition = Global.myPlayer.getPosition();
            let currentCell = Global.myMaze.getCellByPosition(playerPosition);
            if (currentCell) {
                if (currentCell.myStaticMazeItemType == LR.MazeItemType.NONE) {
                    this._myLastFreeCell = currentCell;
                }
            }

            this._myTransformationTimer.update(dt);
            if (this._myTransformationTimer.isDone()) {
                if (Global.myStage + 1 >= this._myTransformationTimersSetup.length) {
                    Global.myCancelTeleport = 5;
                    if (Global.myPlayerLocomotion.canStop()) {
                        Global.myPlayerLocomotion.setIdle(true);
                        this._nextStage();
                        Global.myPlayerLocomotion.setIdle(false);
                    }
                } else {
                    this._nextStage();
                }
            }
        }

        if (this._myLastFreeCell != null) {
            //PP.myDebugVisualManager.drawPoint(0, this._myLastFreeCell.myCellPosition, [0, 0, 0, 1], 0.05);
        }

    },
    _start() {
        this._myStarted = true;
        this._myTransformationTimersSetup = Global.mySetup.myPlayerSetup.myTransformationTimers;
        this._resetTransformation();

        this._myObjectToIgnore.pp_copy(Global.myPlayer.getMovementCollisionCheckParams().myHorizontalObjectsToIgnore);

        let physXComponents = Global.myAxe.pp_getComponentsHierarchy("physx");
        for (let physXComponent of physXComponents) {
            Global.myPlayer.getMovementCollisionCheckParams().myHorizontalObjectsToIgnore.pp_pushUnique(physXComponent.object, (first, second) => first.pp_equals(second));
        }
        Global.myPlayer.getMovementCollisionCheckParams().myVerticalObjectsToIgnore.pp_copy(Global.myPlayer.getMovementCollisionCheckParams().myHorizontalObjectsToIgnore);

    },
    _resetTransformation() {
        Global.myStage = 0;
        this._myTransformationTimer.start(this._myTransformationTimersSetup[Global.myStage]);
    },
    _nextStage(noSound = false, eat = false) {
        Global.myStage = Math.max(Global.myStage + 1, 0);
        if (Global.myStage >= this._myTransformationTimersSetup.length) {
            this._death();
        } else {
            this._myTransformationTimer.start(this._myTransformationTimersSetup[Global.myStage]);

            if (!noSound && eat) {
                PP.myLeftGamepad.pulse(0.35, 0.25);
                PP.myRightGamepad.pulse(0.35, 0.25);
            }

            if (!noSound && !eat) {
                PP.myLeftGamepad.pulse(0.5, 0.5);
                PP.myRightGamepad.pulse(0.5, 0.5);
            }
        }

        if (!noSound) {
            let player = Math.pp_randomPick(this._myLamenti);
            player.setPitch(Math.pp_random(1 - 0.15, 1 + 0.05));
            player.play();
        }
    },
    _death() {
        this._spawnTree();
        // crea albero nella cella corrente
        // dici alle radici che sei morto

        let cell = Global.myMaze.getCellsByType(LR.MazeItemType.PLAYER_START);

        if (cell != null) {
            Global.myPlayer.teleportPosition(cell[0].myCellPosition, null, true);

            let rotationQuat = [0, 0, 0].vec3_degreesToQuat();
            Global.myPlayer.setRotationQuat(rotationQuat);

            Global.myPlayer.resetReal(true, false, false, true);
            Global.myPlayer.resetHeadToReal();
        }

        if (Global.myAxe != null) {
            Global.myAxe.pp_setActive(false);
            let gameplayItems = WL.scene.pp_getObjectByName("Gameplay Items");
            let axe = gameplayItems.pp_getObjectByName("Axe");
            let newAxe = axe.pp_clone();
            Global.myAxe = newAxe;
            Global.myAxe.pp_getComponent("axe").setStartTransforms(Global.myAxeCell.myCellPosition);
            Global.myAxe.pp_setActive(true);

            let physXComponents = Global.myAxe.pp_getComponentsHierarchy("physx");
            Global.myPlayer.getMovementCollisionCheckParams().myHorizontalObjectsToIgnore.pp_copy(this._myObjectToIgnore);
            for (let physXComponent of physXComponents) {
                Global.myPlayer.getMovementCollisionCheckParams().myHorizontalObjectsToIgnore.pp_pushUnique(physXComponent.object, (first, second) => first.pp_equals(second));
            }
            Global.myPlayer.getMovementCollisionCheckParams().myVerticalObjectsToIgnore.pp_copy(Global.myPlayer.getMovementCollisionCheckParams().myHorizontalObjectsToIgnore);
        }

        this._myLastFreeCell = null;

        this._resetTransformation();

        let grabbers = WL.scene.pp_getComponents("pp-grabber-hand");
        for (let grabber of grabbers) {
            grabber.throw();
        }

    },
    _spawnTree() {
        if (this._myLastFreeCell != null) {
            let positionTree = this._myLastFreeCell.getRandomPositionOnCell();
            let types = [];
            types.push(Global.myPerfectFruit);
            for (let i = 0; i < Global.mySetup.myTreeSetup.myPerfectTreeRatio; i++) {
                types.push(Global.myGoodFruit);
                types.push(Global.myBadFruit);
            }
            let randomType = Math.pp_randomPick(types);

            let tree = Global.myTrees[randomType].pp_clone();
            tree.pp_setPosition(positionTree);
            tree.pp_getComponent("human-tree").spawnFruits(Math.pp_randomInt(Global.mySetup.myTreeSetup.myMinHumanFruits, Global.mySetup.myTreeSetup.myMaxHumanFruits));
            tree.pp_setActive(true);
        }

    },
    addStage(full = false) {
        if (Global.myStage < this._myTransformationTimersSetup.length - 1) {
            if (full) {
                Global.myStage = Math.max(0, this._myTransformationTimersSetup.length - 2);
                this._nextStage(false, true);
            } else {
                this._nextStage(false, true);
            }
        }
    },
    removeStage(full = false) {
        if (Global.myStage >= 0) {
            if (full) {
                Global.myStage = -1;
                this._nextStage(true, true);

                let player = this._myAudioHeal2;
                player.setPitch(Math.pp_random(1.5 - 0.15, 1.5 + 0.05));
                player.play();

                PP.myLeftGamepad.pulse(0.35, 0.25);
                PP.myRightGamepad.pulse(0.35, 0.25);
            } else {
                Global.myStage = Math.max(-1, Global.myStage - 2);
                this._nextStage(true, true);

                let player = this._myAudioHeal;
                player.setPitch(Math.pp_random(1.15 - 0.15, 1.15 + 0.05));
                player.play();

                PP.myLeftGamepad.pulse(0.35, 0.25);
                PP.myRightGamepad.pulse(0.35, 0.25);
            }
        }
    }
});

Global.myTransformation = null;