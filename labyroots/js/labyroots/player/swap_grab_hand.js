WL.registerComponent('swap-grab-hand', {
    _myHandedness: { type: WL.Type.Enum, values: ['left', 'right'], default: 'left' },
    _myNormalHand: { type: WL.Type.Object },
    _myGrabHand: { type: WL.Type.Object },
}, {
    init: function () {
    },
    start: function () {
        if (this._myHandedness == PP.HandednessIndex.LEFT) {
            this._myGamepad = PP.myLeftGamepad;
        } else {
            this._myGamepad = PP.myRightGamepad;
        }
    },
    update: function (dt) {
        if (this._myGamepad.getHandPose() == null || !this._myGamepad.getHandPose().isValid()) {
            this._myNormalHand.pp_setActive(false);
            this._myGrabHand.pp_setActive(false);
        } else {
            if (this._myGamepad.getButtonInfo(PP.GamepadButtonID.SQUEEZE).isPressed()) {
                this._myNormalHand.pp_setActive(false);
                this._myGrabHand.pp_setActive(true);
            } else {
                this._myNormalHand.pp_setActive(true);
                this._myGrabHand.pp_setActive(false);
            }
        }
    }
});