WL.registerComponent('stage-switch', {
    _myHandedness: { type: WL.Type.Enum, values: ['left', 'right'], default: 'left' },
    _myOnlyVR: { type: WL.Type.Bool, default: false },
    _myStage1: { type: WL.Type.Object },
    _myStage2: { type: WL.Type.Object },
    _myStage3: { type: WL.Type.Object },
    _myStage4: { type: WL.Type.Object },
    _myStage5: { type: WL.Type.Object },
    _myStage6: { type: WL.Type.Object }
}, {
    init: function () {
    },
    start: function () {
        if (this._myHandedness == PP.HandednessIndex.LEFT) {
            this._myGamepad = PP.myLeftGamepad;
        } else {
            this._myGamepad = PP.myRightGamepad;
        }

        this._myStages = [];
        this._myStages[0] = this._myStage1;
        this._myStages[1] = this._myStage2;
        this._myStages[2] = this._myStage3;
        this._myStages[3] = this._myStage4;
        this._myStages[4] = this._myStage5;
        this._myStages[5] = this._myStage6;

        for (let stage of this._myStages) {
            if (stage != null) {
                stage.pp_setActive(false);
            }
        }

        this._myCurrentStage = -1;
    },
    update: function (dt) {
        if (!this._myOnlyVR || (PP.XRUtils.isSessionActive() && this._myGamepad.getHandPose() != null && this._myGamepad.getHandPose().isValid())) {
            if (Global.myReady) {
                if (Global.myStage != this._myCurrentStage) {
                    this.setStageActive(Global.myStage);
                }
            } else {
                this._myCurrentStage = -1;

                for (let stage of this._myStages) {
                    if (stage != null) {
                        stage.pp_setActive(false);
                    }
                }
            }
        } else {
            this._myCurrentStage = -1;

            for (let stage of this._myStages) {
                if (stage != null) {
                    stage.pp_setActive(false);
                }
            }
        }
    },
    setStageActive(index) {
        for (let stage of this._myStages) {
            if (stage != null) {
                stage.pp_setActive(false);
            }
        }

        if (this._myStages[index] != null) {
            this._myStages[index].pp_setActive(true);
        }

        this._myCurrentStage = index;
    }
});