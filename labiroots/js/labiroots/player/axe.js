WL.registerComponent('axe', {
}, {
    init: function () {
        this._myFirstUpdate = true;
        this._myStartTransform = PP.quat2_create();
        this._myRespawnTransform = PP.quat2_create();
        this._myPrevPosition = [0, 0, 0];

        this._mySpeed = 0;
    },
    start: function () {
        this._myIsGrabbed = false;
        this._myAudioPrendi = PP.myAudioManager.createAudioPlayer(AudioID.PRENDI_FRUTTO);
        this._myAudioColpi = [];
        this._myAudioColpi[0] = PP.myAudioManager.createAudioPlayer(AudioID.COLPO_NORMALE_1);
        this._myAudioColpi[1] = PP.myAudioManager.createAudioPlayer(AudioID.COLPO_NORMALE_2);
        this._myAudioColpoFinale = PP.myAudioManager.createAudioPlayer(AudioID.COLPO_FINALE);

        this._myLamenti = [];
        this._myLamenti[0] = PP.myAudioManager.createAudioPlayer(AudioID.LAMENTO_1);
        this._myLamenti[1] = PP.myAudioManager.createAudioPlayer(AudioID.LAMENTO_2);
        this._myLamenti[2] = PP.myAudioManager.createAudioPlayer(AudioID.LAMENTO_3);
    },

    update: function (dt) {
        if (this._myFirstUpdate) {
            this._myFirstUpdate = false;

            this._myPhysX = this.object.pp_getComponentChildren('physx');
            this._myPhysX.onCollision(this._onCollision.bind(this));
            this._myToDestroy = [];
            this._myTimerDestroy = new PP.Timer(0, false);

            this._myGrabbable = this.object.pp_getComponent('pp-grabbable');
        }

        if (this._myTimerDestroy.isRunning()) {
            this._myTimerDestroy.update(dt)
            if (this._myTimerDestroy.isDone()) {
                for (let object of this._myToDestroy) {
                    //object.pp_destroy();
                    object.pp_setActive(false);
                }

                this._myToDestroy = [];
            }
        }

        if (this._myGrabbable != null) {
            if (this._myGrabbable.isGrabbed()) {
                if (!this._myIsGrabbed) {
                    this._myAudioPrendi.setPosition(this.object.pp_getPosition());
                    this._myAudioPrendi.setPitch(Math.pp_random(1 - 0.15, 1 + 0.05));
                    this._myAudioPrendi.play();
                }
                this._myIsGrabbed = true;
            } else {
                this._myIsGrabbed = false;
            }
        }

        let currentPosition = this.object.pp_getPosition();

        if (Global.myReady) {
            let distance = currentPosition.vec3_distance(this._myPrevPosition);
            if (distance < 1) {
                this._mySpeed = (this._mySpeed + (distance / Math.max(dt, 1))) / 2;
            }
        }

        this._myPrevPosition.vec3_copy(currentPosition);
    },
    setStartTransforms(cellPosition) {
        let axePosition = cellPosition.vec3_add([0, 1.4, -0.20]);
        axeRotation = [45, -55, -15];
        this._myStartTransform.quat2_setPositionRotationQuat(axePosition, axeRotation.vec3_degreesToQuat());
        this._myRespawnTransform = this._myStartTransform;

        this.object.pp_setTransformQuat(this._myStartTransform);
    },
    resetTransformRespawn() {
        this._myGrabbable.release();
        this._myResetPos = true;
        this.object.pp_setTransformQuat(this._myRespawnTransform);
    },
    _onCollision(type, physXComponent) {
        if (!Global.myReady) {
            return;
        }

        if (this._myGrabbable.isGrabbed() && this._mySpeed >= Global.mySetup.myPlayerSetup.myAxeSpeedToHit) {
            if (type == WL.CollisionEventType.Touch || type == WL.CollisionEventType.TriggerTouch) {
                let root = physXComponent.object.pp_getComponent("root");
                if (root) {
                    if (root._myHit > 0) {
                        if (root.hit()) {
                            this._myGrabbable.getGrabber().pp_getComponent("pp-grabber-hand")._myGamepad.pulse(0.5, 0.25);
                            let player = this._myAudioColpoFinale;
                            if (root._myHit > 0) {
                                player = Math.pp_randomPick(this._myAudioColpi);
                            }

                            player.setPosition(this.object.pp_getPosition());
                            player.setPitch(Math.pp_random(1 - 0.15, 1 + 0.05));
                            player.play();

                            if (root._myHit == 0) {
                                let player = Math.pp_randomPick(this._myLamenti);
                                player.setPosition(root.object.pp_getPosition().vec3_add([0, 1, 0]));
                                player.setPitch(Math.pp_random(1 - 0.15, 1 + 0.05));
                                player.play();
                            }
                        }
                    }
                }

                let rootWall = physXComponent.object.pp_getComponent("root-wall");
                if (rootWall) {
                    if (rootWall._myHit > 0) {
                        if (rootWall.hit()) {
                            this._myGrabbable.getGrabber().pp_getComponent("pp-grabber-hand")._myGamepad.pulse(0.5, 0.25);

                            let player = this._myAudioColpoFinale;
                            if (rootWall._myHit > 0) {
                                player = Math.pp_randomPick(this._myAudioColpi);
                            }

                            player.setPosition(this.object.pp_getPosition());
                            player.setPitch(Math.pp_random(1 - 0.15, 1 + 0.05));
                            player.play();

                            if (rootWall._myHit == 0) {
                                let player = Math.pp_randomPick(this._myLamenti);
                                player.setPosition(rootWall.object.pp_getPosition().vec3_add([0, 1, 0]));
                                player.setPitch(Math.pp_random(1 - 0.15, 1 + 0.05));
                                player.play();
                            }
                        }
                        if (rootWall._myHit == 0) {
                            //rootWall.object.pp_setActive(false);
                            this._myToDestroy.push(rootWall.object);
                            this._myTimerDestroy.start();
                        }
                    }
                }

                let bigTree = physXComponent.object.pp_getComponent("big-tree");
                if (bigTree) {
                    if (bigTree._myHit > 0) {
                        if (bigTree.hit()) {
                            this._myGrabbable.getGrabber().pp_getComponent("pp-grabber-hand")._myGamepad.pulse(0.5, 0.25);

                            let player = this._myAudioColpoFinale;
                            if (bigTree._myHit > 0) {
                                player = Math.pp_randomPick(this._myAudioColpi);
                            }

                            player.setPosition(this.object.pp_getPosition());
                            player.setPitch(Math.pp_random(1 - 0.15, 1 + 0.05));
                            player.play();

                            if (bigTree._myHit == 0) {
                                let player = Math.pp_randomPick(this._myLamenti);
                                player.setPosition(bigTree.object.pp_getPosition().vec3_add([0, 1, 0]));
                                player.setPitch(Math.pp_random(1 - 0.15, 1 + 0.05));
                                player.play();
                            }
                        }

                        if (bigTree._myHit == 0) {
                            //bigTree.object.pp_setActive(false);
                            //this._myToDestroy.push(bigTree.object);
                            //this._myTimerDestroy.start();
                            // suono vittoria
                            // vibrazione
                        }
                    }
                }

                let humanTree = physXComponent.object.pp_getComponent("human-tree");
                if (humanTree) {
                    if (humanTree._myHit > 0) {
                        if (humanTree.hit()) {
                            this._myGrabbable.getGrabber().pp_getComponent("pp-grabber-hand")._myGamepad.pulse(0.5, 0.25);

                            let player = this._myAudioColpoFinale;
                            if (humanTree._myHit > 0) {
                                player = Math.pp_randomPick(this._myAudioColpi);
                            }

                            player.setPosition(this.object.pp_getPosition());
                            player.setPitch(Math.pp_random(1 - 0.15, 1 + 0.05));
                            player.play();
                        }

                        if (humanTree._myHit == 0) {

                            let player = Math.pp_randomPick(this._myLamenti);
                            player.setPosition(humanTree.object.pp_getPosition().vec3_add([0, 1, 0]));
                            player.setPitch(Math.pp_random(1 - 0.15, 1 + 0.05));
                            player.play();

                            //humanTree.object.pp_setActive(false);
                            this._myToDestroy.push(humanTree.object);

                            let fruits = humanTree._myFruits;
                            for (let fruit of fruits) {
                                if (!fruit._myGathered) {
                                    let fruitFall = true;

                                    if (!fruitFall) {
                                        this._myToDestroy.push(fruit);
                                    } else {
                                        fruit.pp_setParent(null);
                                        fruit.pp_getComponent("physx").kinematic = false;
                                    }
                                    //fruit.pp_setActive(false);
                                }
                            }

                            this._myTimerDestroy.start();
                        }
                    }
                }
            }
        }
    },
    pp_clone(targetObject) {
        let clonedComponent = targetObject.pp_addComponent(this.type);

        clonedComponent._myStartTransform.quat2_copy(this._myStartTransform);

        return clonedComponent;
    }
});