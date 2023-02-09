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

        this._myLamentiMorte = [];
        this._myLamentiMorte[0] = PP.myAudioManager.createAudioPlayer(AudioID.LAMENTO_UMANO_1_MORTE);
        this._myLamentiMorte[1] = PP.myAudioManager.createAudioPlayer(AudioID.LAMENTO_UMANO_2_MORTE);
        this._myLamentiMorte[2] = PP.myAudioManager.createAudioPlayer(AudioID.LAMENTO_UMANO_3_MORTE);

        this._myAudioPrendi = PP.myAudioManager.createAudioPlayer(AudioID.TREE_UMANO_SPAWN);

        this._myAudioHeal = PP.myAudioManager.createAudioPlayer(AudioID.HEAL);
        this._myAudioHeal2 = PP.myAudioManager.createAudioPlayer(AudioID.HEAL2);

        this._myObjectToIgnore = [];

        this._myWeddingDelay = 3;
        this._myWeddingTimer = new PP.Timer(this._myWeddingDelay);

        this._myChange = 0;
        this._myEnd = 0;
        this._myCloseSession = 0;

        if (WL.xrSession) {
            this._onXRSessionStart(WL.xrSession);
        }
        WL.onXRSessionStart.push(this._onXRSessionStart.bind(this));
        WL.onXRSessionEnd.push(this._onXRSessionEnd.bind(this));

        Global.myTimerStopExit = new PP.Timer(1, false);
    },
    update: function (dt) {
        Global.myCancelTeleport = Math.max(Global.myCancelTeleport - 1, 0)
        if (!this._myStarted) {
            if (Global.myReady) {
                this._start();
            }
        } else {

            if (Global.myTimerStopExit.isRunning()) {
                Global.myTimerStopExit.update(dt);
                if (Global.myTimerStopExit.isDone()) {
                    this._myCloseSession = 0;
                    Global.myExitSession = false;
                }
            }
            if (this._myCloseSession > 0) {
                this._myCloseSession--;
                if (this._myCloseSession == 0) {
                    if (WL.xrSession) {
                        WL.xrSession.end();
                    }
                }
            }

            if (this._myEnd > 0) {
                this._myEnd--;
                if (this._myEnd == 0) {
                    if (WL.xrSession) {
                        WL.xrSession.end();
                    }
                }
            }

            if (this._myChange > 0) {
                this._myChange--;
                if (this._myChange == 0) {
                    let url = document.location.origin;

                    if (window.location != window.parent.location) {
                        url = "https://signor-pipo.itch.io/labyroots";
                    }

                    let result = false;
                    if (Global.myIsWeddingTime) {
                        result = Global.windowOpen(url);
                    } else {
                        result = Global.windowOpen(url + "/?wedding=1");
                    }

                    if (!result) {
                        this._myChange = 10;
                    } else {
                        if (Global.myGoogleAnalytics) {
                            gtag("event", "secret_code_wedding_success", {
                                "value": 1
                            });
                        }
                    }
                }
            }

            let playerPosition = Global.myPlayer.getPosition();
            let currentCell = Global.myMaze.getCellByPosition(playerPosition);
            if (currentCell) {
                if (currentCell.myStaticMazeItemType == LR.MazeItemType.NONE ||
                    currentCell.myStaticMazeItemType == LR.MazeItemType.HUMAN_TREE_0 ||
                    currentCell.myStaticMazeItemType == LR.MazeItemType.HUMAN_TREE_1 ||
                    currentCell.myStaticMazeItemType == LR.MazeItemType.HUMAN_TREE_2 ||
                    currentCell.myStaticMazeItemType == LR.MazeItemType.HUMAN_TREE_3) {
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

        if (PP.myRightGamepad.getButtonInfo(PP.GamepadButtonID.THUMBSTICK).isPressEnd()
            && PP.myRightGamepad.getButtonInfo(PP.GamepadButtonID.THUMBSTICK).myMultiplePressEndCount >= 3) {
            let oldLast = this._myLastFreeCell;
            this._myLastFreeCell = Math.pp_randomPick(Global.myMaze.getCellNextToPositionEmpty(Global.myPlayer.getPosition()));
            if (this._myLastFreeCell != null) {
                this._spawnTree();

                this._myAudioPrendi.setPosition(this._myLastFreeCell.myCellPosition.vec3_add([0, 1, 0]));
                this._myAudioPrendi.setPitch(Math.pp_random(1.25 - 0.15, 1.25 + 0.05));
                this._myAudioPrendi.play();

                if (Global.myGoogleAnalytics) {
                    gtag("event", "secret_code_human_tree_success", {
                        "value": 1
                    });
                }
            }
            this._myLastFreeCell = oldLast;

            if (Global.myGoogleAnalytics) {
                gtag("event", "secret_code_human_tree", {
                    "value": 1
                });
            }
        }

        if (PP.myRightGamepad.getButtonInfo(PP.GamepadButtonID.THUMBSTICK).isPressed() && PP.myLeftGamepad.getButtonInfo(PP.GamepadButtonID.THUMBSTICK).isPressed()) {
            if (this._myWeddingTimer.isRunning()) {
                this._myWeddingTimer.update(dt);
                if (this._myWeddingTimer.isDone()) {
                    if (Global.myGoogleAnalytics) {
                        gtag("event", "secret_code_wedding", {
                            "value": 1
                        });
                    }

                    this._myEnd = 30;
                    this._myChange = 180;
                }
            }
        } else {
            this._myWeddingTimer.start();
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

        let rotationQuat = [0, 0, 0].vec3_degreesToQuat();
        Global.myPlayer.setRotationQuat(rotationQuat);
    },
    _resetTransformation() {
        Global.myStage = 0;
        this._myTransformationTimer.start(this._myTransformationTimersSetup[Global.myStage]);
    },
    _nextStage(noSound = false, eat = false, full = false) {
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
            if (full) {
                player = Math.pp_randomPick(this._myLamentiMorte);
                player.setPitch(Math.pp_random(0.6 - 0.15, 0.6 + 0.05));
            }
            player.play();
        }
    },
    _death() {
        Global.myDeadOnce = true;

        if (Global.myGoogleAnalytics) {
            gtag("event", "death", {
                "value": 1
            });
        }

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
                this._nextStage(false, true, true);
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
                player.setPitch(Math.pp_random(1.35 - 0.15, 1.35 + 0.05));
                player.play();

                PP.myLeftGamepad.pulse(0.35, 0.25);
                PP.myRightGamepad.pulse(0.35, 0.25);
            } else {
                Global.myStage = Math.max(-1, Global.myStage - 2);
                this._nextStage(true, true);

                let player = this._myAudioHeal;
                player.setPitch(Math.pp_random(1 - 0.15, 1 + 0.05));
                player.play();

                PP.myLeftGamepad.pulse(0.35, 0.25);
                PP.myRightGamepad.pulse(0.35, 0.25);
            }
        }
    },
    _onXRSessionStart(session) {
        if (Global.myExitSession) {
            Global.myExitSession = false;
            this._myCloseSession = 2;
        }
    },
    _onXRSessionEnd() {
        if (this._myChange > 0) {
            this._myChange = 0;
            let url = document.location.origin;

            if (window.location != window.parent.location) {
                url = "https://signor-pipo.itch.io/labyroots";
            }

            let result = false;
            if (Global.myIsWeddingTime) {
                result = Global.windowOpen(url);
            } else {
                result = Global.windowOpen(url + "/?wedding=1");
            }

            if (!result) {
                this._myChange = 10;
            }
        }
    }
});

Global.myExitSession = false;
Global.myDeadOnce = false;

Global.myWindowOpenResult = false;
Global.windowOpen = function (url, callback) {
    let result = null;
    let maxAttempt = 1;
    while (result == null && maxAttempt > 0) {
        maxAttempt--;
        result = window.open(url, "_blank");
    }

    Global.myWindowOpenResult = result != null;

    if (callback != null) {
        callback(result != null);
    }

    if (result != null) {
        Global.myTimerStopExit = new PP.Timer(3);
        Global.myExitSession = true;
    }

    return result;
}