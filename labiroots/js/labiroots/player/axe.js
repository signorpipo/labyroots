WL.registerComponent('axe', {
}, {
    init: function () {
    },
    start: function () {
        this._myFirstUpdate = true;
        this._myStartTransform = null;
        this._myRespawnTransform = null;
        this._myPrevPosition = [0, 0, 0];

        this._mySpeed = 0;
    },

    update: function (dt) {
        if (this._myFirstUpdate) {
            this._myFirstUpdate = false;

            this._myPhysX = this.object.pp_getComponent('physx');
            this._myPhysX.onCollision(this._onCollision.bind(this));
            this._myToDestroy = [];
            this._myTimerDestroy = new PP.Timer(0.5, false);

            this._myGrabbable = this.object.pp_getComponent('pp-grabbable');
        }

        if (this._myTimerDestroy.isRunning()) {
            if (this._myTimerDestroy.update(dt)) {
                if (this._myTimerDestroy.isDone()) {
                    for (let object of this._myToDestroy) {
                        object.pp_destroy();
                    }

                    this._myToDestroy = [];
                }
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
    setStartTransforms(startTransform, respawnTransform) {
        this._myStartTransform = startTransform;
        this._myRespawnTransform = respawnTransform;

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

        if (this._myGrabbable.isGrabbed() && this._mySpeed >= Global.mySetup.myPlayerSetup.myAxeSpeedToHit) {
            if (type == WL.CollisionEventType.Touch || type == WL.CollisionEventType.TriggerTouch) {
                let root = physXComponent.object.pp_getComponent("root");
                if (root) {
                    if (root._myHit > 0) {
                        root.hit();
                    }
                }

                let rootWall = physXComponent.object.pp_getComponent("root-wall");
                if (rootWall) {
                    if (rootWall._myHit > 0) {
                        rootWall.hit();
                        if (rootWall._myHit == 0) {
                            rootWall.object.pp_setActive(false);
                            this._myToDestroy.push(rootWall.object);
                            this._myTimerDestroy.start();
                        }
                    }
                }

                let bigTree = physXComponent.object.pp_getComponent("big-tree");
                if (bigTree) {
                    if (bigTree._myHit > 0) {
                        bigTree.hit();
                        if (bigTree._myHit == 0) {
                            bigTree.object.pp_setActive(false);
                            this._myToDestroy.push(bigTree.object);
                            this._myTimerDestroy.start();
                            // suono vittoria
                            // vibrazione
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