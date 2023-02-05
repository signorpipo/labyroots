WL.registerComponent('fruit', {
    _myType: { type: WL.Type.Int, default: 60 }
}, {
    init: function () {
        if (Global.myFruitRandomPowers.length == 0) {
            let indexes = [0, 1, 2, 3];
            let firstIndex = LR.MazeItemType.HUMAN_TREE_1;
            while (indexes.length > 0) {
                let random = Math.pp_randomPick(indexes);
                indexes.pp_removeEqual(random);
                Global.myFruitRandomPowers[firstIndex] = Global.myFruitPowers[random];
                firstIndex += 10;

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
            }
        }
    },
    start: function () {
        this._myUsed = false;
        this._myGrabbable = this.object.pp_getComponent("pp-grabbable");
    },
    update: function (dt) {
    },
    pp_clone(targetObject) {
        let clonedComponent = targetObject.pp_addComponent(this.type);

        clonedComponent._myType = this._myType;

        return clonedComponent;
    },
    pp_clonePostProcess() {
        this.start();
    },
    activateEffect() {
        if (!this._myUsed && this._myGrabbable.isGrabbed()) {
            Global.myFruitRandomPowers[this._myType]();
            this._myUsed = true;
        }
    }
});

Global.myFruitRandomPowers = [];

decreaseStage = function (full = false) {
    Global.myTransformation.removeStage(full);
}

increaseStage = function (full = false) {
    Global.myTransformation.addStage(full);
}

Global.myFruitPowers = [];
Global.myFruitPowers[0] = decreaseStage;
Global.myFruitPowers[1] = increaseStage;
Global.myFruitPowers[2] = decreaseStage;
Global.myFruitPowers[3] = increaseStage;

Global.myGoodFruit = null;
Global.myBadFruit = null;
Global.myPerfectFruit = null;
Global.myEvilFruit = null;

