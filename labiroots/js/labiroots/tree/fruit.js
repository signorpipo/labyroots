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
    },
    start: function () {
        this._myGathered = false;
        this._myUsed = false;
        this._myGrabbable = this.object.pp_getComponent("pp-grabbable");
        this._myIsGrabbed = false;

        this._myAudioPrendi = PP.myAudioManager.createAudioPlayer(AudioID.PRENDI_FRUTTO);
        this._myAudioMangia = PP.myAudioManager.createAudioPlayer(AudioID.MANGIA_FRUTTO);
    },
    update: function (dt) {
        if (this._myGrabbable != null) {
            if (this._myGrabbable.isGrabbed()) {
                if (!this._myIsGrabbed) {
                    this._myAudioPrendi.setPosition(this.object.pp_getPosition());
                    this._myAudioPrendi.setPitch(Math.pp_random(1 - 0.15, 1 + 0.05));
                    this._myAudioPrendi.play();
                }
                this._myGathered = true;
                this._myIsGrabbed = true;
            } else {
                this._myIsGrabbed = false;
            }
        } else {
            this._myGrabbable = this.object.pp_getComponent("pp-grabbable");
        }
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
        if (!this._myUsed && this._myGrabbable != null && this._myGrabbable.isGrabbed()) {
            Global.myFruitRandomPowers[this._myType]();
            this._myUsed = true;

            this._myAudioMangia.setPosition(this.object.pp_getPosition());
            this._myAudioMangia.setPitch(Math.pp_random(1 - 0.15, 1 + 0.05));
            this._myAudioMangia.play();
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
Global.myFruitPowers[2] = decreaseStage.bind(true);
Global.myFruitPowers[3] = increaseStage.bind(true);

Global.myGoodFruit = null;
Global.myBadFruit = null;
Global.myPerfectFruit = null;
Global.myEvilFruit = null;

