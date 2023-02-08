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
        this._myAudioColpi = [];
        this._myAudioColpi[0] = PP.myAudioManager.createAudioPlayer(AudioID.COLPO_NORMALE_1);
        this._myAudioColpi[1] = PP.myAudioManager.createAudioPlayer(AudioID.COLPO_NORMALE_2);
        this._myAudioColpoFinale = PP.myAudioManager.createAudioPlayer(AudioID.COLPO_FINALE);

        this._myLamenti = [];
        this._myLamenti[0] = PP.myAudioManager.createAudioPlayer(AudioID.LAMENTO_1);
        this._myLamenti[1] = PP.myAudioManager.createAudioPlayer(AudioID.LAMENTO_2);
        this._myLamenti[2] = PP.myAudioManager.createAudioPlayer(AudioID.LAMENTO_3);

        this._myLamentoPitch = 1.4;
        this._myColpoFinalePitch = 1.25;
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
                    if (object[1]) {
                        let fruits = object[0].pp_getComponent("human-tree")._myFruits;
                        for (let fruit of fruits) {
                            if (!fruit._myGathered) {
                                let fruitFall = true;

                                if (!fruitFall) {
                                    //this._myToDestroy.push([fruit, false]);
                                } else {
                                    fruit.pp_setParent(null);
                                    fruit.pp_getComponent("physx").kinematic = false;
                                }
                                //fruit.pp_setActive(false);
                            }
                        }
                    }
                    object[0].pp_setActive(false);
                }

                this._myToDestroy = [];
            }
        }

        if (this._myGrabbable != null) {
            if (this._myGrabbable.isGrabbed()) {
                if (!this._myIsGrabbed) {
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

                            if (root._myHit == 0) {
                                PP.myLeftGamepad.pulse(0.5, 0.5);
                                PP.myRightGamepad.pulse(0.5, 0.5);
                            } else {
                                this._myGrabbable.getGrabber().pp_getComponent("pp-grabber-hand")._myGamepad.pulse(0.5, 0.25);
                            }
                            let player = this._myAudioColpoFinale;
                            let pitch = 1;
                            if (root._myHit > 0) {
                                if (root._myHit > 1) {
                                    player = this._myAudioColpi[1];
                                } else {
                                    player = this._myAudioColpi[0];
                                }
                            } else {
                                pitch = this._myColpoFinalePitch;
                            }

                            player.setPosition(this.object.pp_getPosition());
                            player.setPitch(Math.pp_random(pitch - 0.15, pitch + 0.05));
                            player.play();

                            if (root._myHit == 0) {
                                let player = Math.pp_randomPick(this._myLamenti);
                                player.setPosition(root.object.pp_getPosition().vec3_add([0, 2, 0]));
                                player.setPitch(Math.pp_random(this._myLamentoPitch - 0.15, this._myLamentoPitch + 0.05));
                                player.play();
                            }
                        }
                    }
                }

                let rootWall = physXComponent.object.pp_getComponent("root-wall");
                if (rootWall) {
                    if (rootWall._myHit > 0) {
                        if (rootWall.hit()) {

                            if (rootWall._myHit == 0) {
                                PP.myLeftGamepad.pulse(0.5, 0.5);
                                PP.myRightGamepad.pulse(0.5, 0.5);
                            } else {
                                this._myGrabbable.getGrabber().pp_getComponent("pp-grabber-hand")._myGamepad.pulse(0.5, 0.25);
                            }

                            let player = this._myAudioColpoFinale;
                            let pitch = 1;
                            if (rootWall._myHit > 0) {
                                if (rootWall._myHit > 1) {
                                    player = this._myAudioColpi[1];
                                } else {
                                    player = this._myAudioColpi[0];
                                }
                            } else {
                                pitch = this._myColpoFinalePitch;
                            }

                            player.setPosition(this.object.pp_getPosition());
                            player.setPitch(Math.pp_random(pitch - 0.15, pitch + 0.05));
                            player.play();

                            if (rootWall._myHit == 0) {
                                let player = Math.pp_randomPick(this._myLamenti);
                                player.setPosition(rootWall.object.pp_getPosition().vec3_add([0, 2, 0]));
                                player.setPitch(Math.pp_random(this._myLamentoPitch - 0.15, this._myLamentoPitch + 0.05));
                                player.play();
                            }
                        }
                        if (rootWall._myHit == 0) {
                            //rootWall.object.pp_setActive(false);
                            this._myToDestroy.push([rootWall.object, false]);
                            this._myTimerDestroy.start();
                        }
                    }
                }

                let bigTree = physXComponent.object.pp_getComponent("big-tree");
                if (bigTree) {
                    if (bigTree._myHit > 0) {
                        if (bigTree.hit()) {
                            if (bigTree._myHit != 0) {
                                this._myGrabbable.getGrabber().pp_getComponent("pp-grabber-hand")._myGamepad.pulse(0.5, 0.25);
                            }

                            let player = this._myAudioColpoFinale;
                            let pitch = 1;
                            if (bigTree._myHit > 0) {
                                if (bigTree._myHit % 2 == 0) {
                                    player = this._myAudioColpi[1];
                                } else {
                                    player = this._myAudioColpi[0];
                                }
                            } else {
                                pitch = this._myColpoFinalePitch;
                            }

                            player.setPosition(this.object.pp_getPosition());
                            player.setPitch(Math.pp_random(pitch - 0.15, pitch + 0.05));
                            player.play();

                            if (bigTree._myHit == 0) {
                                let player = Math.pp_randomPick(this._myLamenti);
                                player.setPosition(bigTree.object.pp_getPosition().vec3_add([0, 2, 0]));
                                player.setPitch(Math.pp_random(this._myLamentoPitch - 0.15, this._myLamentoPitch + 0.05));
                                //player.play();
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

                            if (humanTree._myHit == 0) {
                                PP.myLeftGamepad.pulse(0.5, 0.5);
                                PP.myRightGamepad.pulse(0.5, 0.5);
                            } else {
                                this._myGrabbable.getGrabber().pp_getComponent("pp-grabber-hand")._myGamepad.pulse(0.5, 0.25);
                            }
                            let player = this._myAudioColpoFinale;
                            let pitch = 1;
                            if (humanTree._myHit > 0) {
                                if (humanTree._myHit > 1) {
                                    player = this._myAudioColpi[1];
                                } else {
                                    player = this._myAudioColpi[0];
                                }
                            } else {
                                pitch = this._myColpoFinalePitch;
                            }

                            player.setPosition(this.object.pp_getPosition());
                            player.setPitch(Math.pp_random(pitch - 0.15, pitch + 0.05));
                            player.play();
                        }

                        if (humanTree._myHit == 0) {

                            let player = Math.pp_randomPick(this._myLamenti);
                            player.setPosition(humanTree.object.pp_getPosition().vec3_add([0, 2, 0]));
                            player.setPitch(Math.pp_random(this._myLamentoPitch - 0.15, this._myLamentoPitch + 0.05));
                            player.play();

                            //humanTree.object.pp_setActive(false);
                            this._myToDestroy.push([humanTree.object, true]);

                            if (false) {
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
                            }

                            this._myTimerDestroy.start();
                        }
                    }
                }

                let openComponents = ["open-ggj", "open-zesty", "open-github"];
                for (let component of openComponents) {
                    let openComponent = physXComponent.object.pp_getComponent(component);
                    if (openComponent) {
                        if (openComponent.hit()) {

                            if (openComponent._myHit == 0) {
                                PP.myLeftGamepad.pulse(0.5, 0.5);
                                PP.myRightGamepad.pulse(0.5, 0.5);
                            } else {
                                this._myGrabbable.getGrabber().pp_getComponent("pp-grabber-hand")._myGamepad.pulse(0.5, 0.25);
                            }

                            let player = this._myAudioColpoFinale;
                            let pitch = 1;
                            if (openComponent._myHit > 0) {
                                if (openComponent._myHit > 1) {
                                    player = this._myAudioColpi[1];
                                } else {
                                    player = this._myAudioColpi[0];
                                }
                            } else {
                                pitch = this._myColpoFinalePitch;
                            }

                            player.setPosition(this.object.pp_getPosition());
                            player.setPitch(Math.pp_random(pitch - 0.15, pitch + 0.05));
                            player.play();

                            if (openComponent._myHit == 0) {
                                let player = Math.pp_randomPick(this._myLamenti);
                                player.setPosition(openComponent.object.pp_getPosition().vec3_add([0, 2, 0]));
                                player.setPitch(Math.pp_random(this._myLamentoPitch - 0.15, this._myLamentoPitch + 0.05));
                                player.play();

                                openComponent.open();
                            }
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