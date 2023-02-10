WL.registerComponent('human-tree', {
    _myType: { type: WL.Type.Int, default: 60 }
}, {
    init: function () {
        this._myPoints = null;
    },
    start: function () {
        this._myStarted = false;
        this._myHit = 0;

        this._myFruits = [];
    },
    update: function (dt) {
        if (!this._myStarted) {
            if (Global.myReady) {
                this._myStarted = true;
                if (this._myType == 90) {
                    this._myHit = Global.mySetup.myTreeSetup.myHumanTreeHit * 100;
                } else {
                    this._myHit = Global.mySetup.myTreeSetup.myHumanTreeHit;
                }
            }
        } else {

        }
    },
    pp_clone(targetObject) {
        let clonedComponent = targetObject.pp_addComponent(this.type);

        clonedComponent._myType = this._myType;

        return clonedComponent;
    },
    spawnFruits(fruitAmount) {
        if (this._myPoints == null) {
            this._myPoints = this.object.pp_getChildren();
            this._myPoints.pp_remove((object) => object.pp_getComponent("physx") != null);
        }
        if (fruitAmount == 8) {
            fruitAmount = Math.pp_randomInt(0, this._myPoints.length);
        } else if (fruitAmount == 9) {
            fruitAmount = Math.pp_randomInt(1, this._myPoints.length);
        } else if (fruitAmount == 7) {
            fruitAmount = Math.pp_randomInt(Global.mySetup.myTreeSetup.myMinHumanFruits, Global.mySetup.myTreeSetup.myMaxHumanFruits);
        }

        let points = this._myPoints.pp_clone();
        while (fruitAmount > 0 && points.length > 0) {
            fruitAmount--;
            let point = Math.pp_randomPick(points);
            points.pp_removeEqual(point);

            let fruit = Global.myFruits[this._myType].pp_clone();
            fruit.pp_setParent(this.object);
            fruit.pp_setTransformLocalQuat(point.pp_getTransformLocalQuat());
            fruit.pp_setActive(true);

            this._myFruits.push(fruit);
        }
    },
    hit() {
        let hitted = false;

        if (this._myHit > 0) {
            this._myHit--;
            hitted = true;
            // suono

            if (this._myHit == 0) {
                if (this._myType != 90) {
                    if (Global.myGoogleAnalytics) {
                        gtag("event", "defeat_human_tree", {
                            "value": 1
                        });
                    }
                } else {
                    if (Global.myGoogleAnalytics) {
                        gtag("event", "defeat_bride_tree", {
                            "value": 1
                        });
                    }

                    Global.myBigTreeDead = true;
                    Global.myStage = 0;
                }
            }
        }

        return hitted;
    },
    pp_clonePostProcess() {
        this.start();
    }
});