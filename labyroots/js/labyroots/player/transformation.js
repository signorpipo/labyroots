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

        this._myLamentoFinalePitch = 1.4;

        this._myObjectToIgnore = [];

        this._myWeddingDelay = 2;
        this._myWeddingTimer = new PP.Timer(this._myWeddingDelay);
        this._myMazeverseTimer = new PP.Timer(this._myWeddingDelay);

        this._myChange = 0;
        this._myEnd = 0;

        this._myTimeAlive = 0;
        this._myStageTotalTime = 0;

        this._myResetAxePosition = 0;

        this._myRepeatHealSound = 0;
        this._myRepeatHealSoundTimer = new PP.Timer(0.4);

        this._myPosition = [0, 0, 0];

        this._myIsWedding = false;
    },
    update: function (dt) {
        this._secretMazeCodeUpdate(dt);

        Global.myCancelTeleport = Math.max(Global.myCancelTeleport - 1, 0)
        if (!this._myStarted) {
            if (Global.myReady) {
                this._start();
            }
        } else {
            if (this._myRepeatHealSound > 0) {
                this._myRepeatHealSoundTimer.update(dt);
                if (this._myRepeatHealSoundTimer.isDone()) {
                    this._myRepeatHealSoundTimer.start();

                    this._myRepeatHealSound--;

                    PP.myLeftGamepad.pulse(0.35, 0.25);
                    PP.myRightGamepad.pulse(0.35, 0.25);

                    let player = this._myAudioHeal2;
                    player.setPitch(Math.pp_random(1.4 - 0.15, 1.4 + 0.05));
                    player.play();
                }
            }

            if (this._myResetAxePosition > 0) {
                this._myResetAxePosition--;

                let axeComponent = Global.myAxe.pp_getComponent("axe");
                if (axeComponent != null) {
                    axeComponent.setStartTransforms(Global.myAxeCell.myCellPosition);
                }
            }

            let playerPosition = Global.myPlayer.getPosition(this._myPosition);
            let currentCell = Global.myMaze.getCellByPosition(playerPosition);
            if (currentCell) {
                if (currentCell.myStaticMazeItemType == LR.MazeItemType.NONE ||
                    currentCell.myStaticMazeItemType == LR.MazeItemType.HUMAN_TREE_0 ||
                    currentCell.myStaticMazeItemType == LR.MazeItemType.HUMAN_TREE_1 ||
                    currentCell.myStaticMazeItemType == LR.MazeItemType.HUMAN_TREE_2 ||
                    currentCell.myStaticMazeItemType == LR.MazeItemType.HUMAN_TREE_3 ||
                    currentCell.myStaticMazeItemType == LR.MazeItemType.CREDITS ||
                    currentCell.myStaticMazeItemType == LR.MazeItemType.SECRET_CODES ||
                    currentCell.myStaticMazeItemType == LR.MazeItemType.ZESTY ||
                    currentCell.myStaticMazeItemType == LR.MazeItemType.SECRET_ZONE_CHECK ||
                    currentCell.myStaticMazeItemType == LR.MazeItemType.LEADERBOARD_TOP_10 ||
                    currentCell.myStaticMazeItemType == LR.MazeItemType.LEADERBOARD_AROUND_U ||
                    currentCell.myStaticMazeItemType == LR.MazeItemType.BUILD_CELL) {
                    this._myLastFreeCell = currentCell;
                }
            }

            this._myTimeAlive += dt;

            if (!Global.myBigTreeDead || Global.myStage >= this._myTransformationTimersSetup.length - 1) {
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
        }
    },
    _start() {
        this._myLamentiFinale = [];
        this._myLamentiFinale[0] = PP.myAudioManager.createAudioPlayer(AudioID.LAMENTO_1);
        this._myLamentiFinale[1] = PP.myAudioManager.createAudioPlayer(AudioID.LAMENTO_2);
        this._myLamentiFinale[2] = PP.myAudioManager.createAudioPlayer(AudioID.LAMENTO_3);

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

        this._myStarted = true;
        this._myTransformationTimersSetup = Global.mySetup.myPlayerSetup.myTransformationTimers;
        if (Global.myFromAbove) {
            this._myTransformationTimersSetup[0] = 1000000;
        }
        for (let timer of this._myTransformationTimersSetup) {
            this._myStageTotalTime += timer;
        }

        this._resetTransformation();

        this._myObjectToIgnore.pp_copy(Global.myPlayer.getMovementCollisionCheckParams().myHorizontalObjectsToIgnore);

        let physXComponents = Global.myAxe.pp_getComponentsHierarchy("physx");
        for (let physXComponent of physXComponents) {
            Global.myPlayer.getMovementCollisionCheckParams().myHorizontalObjectsToIgnore.pp_pushUnique(physXComponent.object, (first, second) => first.pp_equals(second));
        }
        Global.myPlayer.getMovementCollisionCheckParams().myVerticalObjectsToIgnore.pp_copy(Global.myPlayer.getMovementCollisionCheckParams().myHorizontalObjectsToIgnore);

        let rotationQuat = [0, 0, 0].vec3_degreesToQuat();
        Global.myPlayer.setRotationQuat(rotationQuat);

        if (Global.myMaze.getCellsByType(LR.MazeItemType.BIG_TREE) != null && Global.myMaze.getCellsByType(LR.MazeItemType.BIG_TREE).length > 0) {
            rotationQuat = Global.lookBigTreeAligned(Global.myPlayer.getPosition());
            Global.myPlayer.setRotationQuat(rotationQuat);
        }

        if (Global.myFromAbove) {
            Global.myPlayer.teleportPosition([0, 40, 0], null, true);
            Global.myPlayer.resetReal(true, false, false, true);
            Global.myPlayer.resetHeadToReal();
            Global.myPlayer.getPlayerHeadManager().setRotationHeadQuat(rotationQuat.quat_setForward([0, -1, 0]));
        }
    },
    _resetTransformation() {
        Global.myStage = 0;
        this._myTransformationTimer.start(this._myTransformationTimersSetup[Global.myStage]);
    },
    _nextStage(noSound = false, eat = false, full = false) {
        Global.myStage = Math.max(Global.myStage + 1, 0);
        let dead = false;
        if (Global.myStage >= this._myTransformationTimersSetup.length) {
            PP.myLeftGamepad.pulse(0.5, 0.5);
            PP.myRightGamepad.pulse(0.5, 0.5);

            this._death();
            dead = true;
        } else {
            this._myTransformationTimer.start(this._myTransformationTimersSetup[Global.myStage]);

            if (!noSound && (eat && !full)) {
                PP.myLeftGamepad.pulse(0.35, 0.25);
                PP.myRightGamepad.pulse(0.35, 0.25);
            }

            if (!noSound && (!eat || full)) {
                PP.myLeftGamepad.pulse(0.5, 0.5);
                PP.myRightGamepad.pulse(0.5, 0.5);
            }
        }

        if (!noSound) {
            let player = Math.pp_randomPick(this._myLamenti);
            player.setPitch(Math.pp_random(1 - 0.15, 1 + 0.05));

            if (full) {
                player = Math.pp_randomPick(this._myLamentiMorte);
                player.setPitch(Math.pp_random(0.75 - 0.15, 0.75 + 0.05));
            }

            if (dead) {
                player = Math.pp_randomPick(this._myLamentiFinale);
                player.setPitch(Math.pp_random(this._myLamentoFinalePitch - 0.15, this._myLamentoFinalePitch + 0.05));
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

        if (Global.myGoogleAnalytics) {
            gtag("event", "survive_for_seconds", {
                "value": Math.round(this._myTimeAlive)
            });

            if (this._myTimeAlive > this._myStageTotalTime * 3) {
                gtag("event", "survive_bear_grills", {
                    "value": 1
                });
            } else if (this._myTimeAlive > this._myStageTotalTime * 2) {
                gtag("event", "survive_a_lot", {
                    "value": 1
                });
            } else if (this._myTimeAlive > this._myStageTotalTime * 1.1) {
                gtag("event", "survive_more", {
                    "value": 1
                });
            }
        }
        this._myTimeAlive = 0;

        this._spawnTree();
        // crea albero nella cella corrente
        // dici alle radici che sei morto

        let cell = Global.myMaze.getCellsByType(LR.MazeItemType.PLAYER_START);

        if (cell != null && cell.length > 0) {
            Global.myPlayer.teleportPosition(cell[0].myCellPosition, null, true);

            let rotationQuat = [0, 0, 0].vec3_degreesToQuat();
            Global.myPlayer.setRotationQuat(rotationQuat);

            if (Global.myMaze.getCellsByType(LR.MazeItemType.BIG_TREE) != null && Global.myMaze.getCellsByType(LR.MazeItemType.BIG_TREE).length > 0) {
                rotationQuat = Global.lookBigTreeAligned(Global.myPlayer.getPosition());
                Global.myPlayer.setRotationQuat(rotationQuat);
            }

            PP.myPlayerObjects.myNonVRCamera.pp_setUp([0, 1, 0]);

            Global.myPlayer.resetReal(true, false, false, true);
            Global.myPlayer.resetHeadToReal();
        }

        if (Global.myAxe != null) {
            let physx = Global.myAxe.pp_getComponentSelf("physx");
            let grabbable = Global.myAxe.pp_getComponentSelf("pp-grabbable");
            grabbable.release();
            physx.kinematic = true;

            Global.myAxe.pp_setParent(Global.myAxeParent);

            this._myResetAxePosition = 2;

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
                player.setPitch(Math.pp_random(1.4 - 0.15, 1.4 + 0.05));
                player.play();

                PP.myLeftGamepad.pulse(0.35, 0.25);
                PP.myRightGamepad.pulse(0.35, 0.25);

                this._myRepeatHealSound = 2;
                this._myRepeatHealSoundTimer.start();
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
    _secretMazeCodeUpdate(dt) {
        if (Global.myUnmute && PP.XRUtils.isSessionActive()) {
            Global.myUnmute = false;
            Howler.mute(false);
        }

        if (this._myEnd > 0) {
            this._myEnd--;
            if (this._myEnd == 0) {
                this._myChange = 1;

                Global.myUnmute = true;
                Howler.mute(true);

                if (Global.myAxe != null && Global.myAxe._myGrabbable != null) {
                    Global.myAxe._myGrabbable.release();
                }
            }
        }

        if (this._myEnd == 0 && this._myChange > 0) {
            this._myChange--;
            if (this._myChange == 0) {
                if (WL.xrSession) {
                    WL.xrSession.end();
                }

                let url = window.location.origin;

                if (window.location != window.parent.location) {
                    url = "https://heyvr.io/game/labyroots";
                    if (window.location.ancestorOrigins != null && window.location.ancestorOrigins.length > 0) {
                        let ancestorOrigin = window.location.ancestorOrigins[0];

                        if (ancestorOrigin.includes("itch.io")) {
                            url = "https://signor-pipo.itch.io/labyroots";
                        } else if (ancestorOrigin.includes("heyvr.io")) {
                            url = "https://heyvr.io/game/labyroots";
                        }
                    }
                } else {
                    if (this._myIsWedding) {
                        url = url + "/?wedding=1";
                    } else {
                        if (!Global.myIsMazeverseTime) {
                            url = url + "/?mazeverse=1";
                        }
                    }
                }

                let onSuccess = function () {
                    if (WL.xrSession) {
                        WL.xrSession.end();
                    }

                    Global.myUnmute = true;
                    Howler.mute(true);
                    if (Global.myAxe != null && Global.myAxe._myGrabbable != null) {
                        Global.myAxe._myGrabbable.release();
                    }

                    if (Global.myGoogleAnalytics) {
                        if (this._myIsWedding) {
                            gtag("event", "secret_code_wedding_success", {
                                "value": 1
                            });
                        } else {
                            gtag("event", "secret_code_mazeverse_success", {
                                "value": 1
                            });
                        }
                    }
                }.bind(this);

                let onError = function () {
                    this._myChange = 10;
                }.bind(this);

                Global.windowOpen(url, onSuccess, onError);

                this._myIsWedding = false;
            }
        }

        if (this._myChange == 0 && PP.myRightGamepad.getButtonInfo(PP.GamepadButtonID.THUMBSTICK).isPressed()
            && PP.myLeftGamepad.getButtonInfo(PP.GamepadButtonID.THUMBSTICK).isPressed()) {
            if (this._myMazeverseTimer.isRunning()) {
                this._myMazeverseTimer.update(dt);
                if (this._myMazeverseTimer.isDone()) {
                    if (Global.myGoogleAnalytics) {
                        gtag("event", "secret_code_mazeverse", {
                            "value": 1
                        });
                    }

                    Global.mySaveManager.save("is_mazeverse", !Global.myIsMazeverseTime, false);

                    this._myEnd = 1;
                    this._myChange = 1;
                    this._myIsWedding = false;
                }
            }
        } else {
            this._myMazeverseTimer.start();
        }

        if (this._myChange == 0 && !PP.myRightGamepad.getButtonInfo(PP.GamepadButtonID.THUMBSTICK).isPressed() &&
            PP.myLeftGamepad.getButtonInfo(PP.GamepadButtonID.THUMBSTICK).isPressed() &&
            PP.myRightGamepad.getButtonInfo(PP.GamepadButtonID.SELECT).isPressed()) {
            if (this._myWeddingTimer.isRunning()) {
                this._myWeddingTimer.update(dt);
                if (this._myWeddingTimer.isDone()) {
                    if (Global.myGoogleAnalytics) {
                        gtag("event", "secret_code_wedding", {
                            "value": 1
                        });
                    }

                    Global.mySaveManager.save("is_wedding", true, false);

                    this._myEnd = 1;
                    this._myChange = 1;
                    this._myIsWedding = true;
                }
            }
        } else {
            this._myWeddingTimer.start();
        }
    }
});

Global.myUnmute = false;

Global.myExitSession = false;
Global.myDeadOnce = false;

Global.myWindowOpenResult = false;
Global.windowOpen = function (urlString, successCallback, errorCallback) {
    let result = true;

    let element = document.createElement("a");
    //element.href = urlString;
    //element.target = "_blank";
    element.style.display = "none";

    document.body.appendChild(element);

    element.addEventListener("click", function () {
        let result = window.open(urlString, "_blank");

        if (result != null) {
            if (successCallback != null) {
                successCallback();
            }
        } else {
            if (errorCallback != null) {
                errorCallback();
            }
        }
    });

    element.click();

    return result;
}