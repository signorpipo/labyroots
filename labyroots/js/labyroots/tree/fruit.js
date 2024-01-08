WL.registerComponent('fruit', {
    _myType: { type: WL.Type.Int, default: 60 }
}, {
    init: function () {
        if (Global.myFruitRandomPowers.length == 0) {
            let indexes = [0, 1, 2];
            let firstIndex = LR.MazeItemType.HUMAN_TREE_1;
            while (indexes.length > 0) {
                let random = Math.pp_randomPick(indexes);
                indexes.pp_removeEqual(random);
                Global.myFruitRandomPowers[firstIndex] = Global.myFruitPowers[random];

                if (random == 0) {
                    Global.myGoodFruit = firstIndex;
                }

                if (random == 1) {
                    Global.myBadFruit = firstIndex;
                }

                if (random == 2) {
                    Global.myPerfectFruit = firstIndex;
                }

                if (random == 3) {
                    Global.myEvilFruit = firstIndex;
                }

                firstIndex += 10;
            }
        }

        Global.myFruitRandomPowers[LR.MazeItemType.HUMAN_TREE_4] = Global.myFruitPowers[3];
    },
    start: function () {
        this._myGathered = false;
        this._myUsed = false;
        this._myGrabbable = this.object.pp_getComponent("pp-grabbable");
        this._myIsGrabbed = false;

        this._myTimeGrabbed = 0;
        this._myTimeGrabbedStep = [5, 10, 15, 30];
        this._myTimeGrabbedStepIndex = 0;

        this._myStarted = false;
    },
    update: function (dt) {
        if (!this._myStarted) {
            if (Global.myStoryReady) {
                this._myStarted = true;
            }
        }

        if (this._myGrabbable != null) {
            if (this._myGrabbable.isGrabbed()) {
                if (!this._myGathered) {
                    Global.sendAnalytics("event", "collect_fruit", {
                        "value": 1
                    });
                }

                this._myGathered = true;
                this._myIsGrabbed = true;

                this._myTimeGrabbed += dt;
                if (this._myTimeGrabbedStepIndex < this._myTimeGrabbedStep.length && this._myTimeGrabbed > this._myTimeGrabbedStep[this._myTimeGrabbedStepIndex]) {
                    Global.sendAnalytics("event", "fruit_grab_for_" + this._myTimeGrabbedStep[this._myTimeGrabbedStepIndex] + "_seconds", {
                        "value": 1
                    });

                    this._myTimeGrabbedStepIndex++;
                }
            } else {
                this._myIsGrabbed = false;
            }
        } else {
            this._myGrabbable = this.object.pp_getComponent("pp-grabbable");
        }
    },
    pp_clone(targetObject) {
        let clonedComponent = targetObject.pp_addComponent(this.type);
        clonedComponent.active = this.active;

        clonedComponent._myType = this._myType;

        return clonedComponent;
    },
    pp_clonePostProcess(clonedComponent) {
        clonedComponent.start();
    },
    activateEffect() {
        if (!this._myUsed && this._myGrabbable != null && this._myGrabbable.isGrabbed()) {

            Global.sendAnalytics("event", "eat_fruit", {
                "value": 1
            });

            Global.myFruitRandomPowers[this._myType]();
            this._myUsed = true;

            //Global.myAudioMangia.setPosition(this.object.pp_getPosition());
            Global.myAudioMangia.setPitch(Math.pp_random(1.25 - 0.15, 1.25 + 0.05));
            Global.myAudioMangia.play();
        }
    }
});

Global.myFruitRandomPowers = [];

decreaseStage = function (full) {
    if (full) {
        Global.sendAnalytics("event", "eat_fruit_perfect", {
            "value": 1
        });
    } else {
        Global.sendAnalytics("event", "eat_fruit_good", {
            "value": 1
        });
    }

    Global.myTransformation.removeStage(full);
};

increaseStage = function (full) {
    if (full) {
        Global.sendAnalytics("event", "eat_fruit_evil", {
            "value": 1
        });
    } else {
        Global.sendAnalytics("event", "eat_fruit_bad", {
            "value": 1
        });
    }

    Global.myTransformation.addStage(full);
};

Global.myFruitPowers = [];
Global.myFruitPowers[0] = decreaseStage.bind(null, false);
Global.myFruitPowers[1] = increaseStage.bind(null, false);
Global.myFruitPowers[2] = decreaseStage.bind(null, true);
Global.myFruitPowers[3] = increaseStage.bind(null, true);

Global.myGoodFruit = null;
Global.myBadFruit = null;
Global.myPerfectFruit = null;
Global.myEvilFruit = null;

