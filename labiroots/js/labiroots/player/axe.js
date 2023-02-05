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
        this.object.pp_setTransformQuat(this._myRespawnTransform);
    },
    _onCollision(type, physXComponent) {
        if (!Global.myReady) {
            return;
        }
        console.error(this._mySpeed);

        if (this._myGrabbable.isGrabbed() && this._mySpeed >= Global.mySetup.myPlayerSetup.myAxeSpeedToHit) {
            if (type == WL.CollisionEventType.Touch || type == WL.CollisionEventType.TriggerTouch) {
                let root = physXComponent.object.pp_getComponent("root");
                if (root) {
                    if (root._myHit > 0) {
                        if (root.hit()) {
                            this._myGrabbable._myGrabber._myGamepad.pulse(0.5, 0.25);
                        }
                    }
                }

                let rootWall = physXComponent.object.pp_getComponent("root-wall");
                if (rootWall) {
                    if (rootWall._myHit > 0) {
                        if (rootWall.hit()) {
                            this._myGrabbable._myGrabber._myGamepad.pulse(0.5, 0.25);
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
                            this._myGrabbable._myGrabber._myGamepad.pulse(0.5, 0.25);
                        }

                        if (bigTree._myHit == 0) {
                            //bigTree.object.pp_setActive(false);
                            this._myToDestroy.push(bigTree.object);
                            this._myTimerDestroy.start();
                            // suono vittoria
                            // vibrazione
                        }
                    }
                }

                let humanTree = physXComponent.object.pp_getComponent("human-tree");
                if (humanTree) {
                    if (humanTree._myHit > 0) {
                        if (humanTree.hit()) {
                            this._myGrabbable._myGrabber._myGamepad.pulse(0.5, 0.25);
                        }

                        if (humanTree._myHit == 0) {
                            //humanTree.object.pp_setActive(false);
                            this._myToDestroy.push(humanTree.object);

                            let fruits = humanTree._myFruits;
                            for (let fruit of fruits) {
                                if (!fruit._myGathered) {
                                    //fruit.pp_setActive(false);
                                    this._myToDestroy.push(fruit);
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

        return clonedComponent;
    }
});