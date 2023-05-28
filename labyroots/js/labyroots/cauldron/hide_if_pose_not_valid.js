WL.registerComponent('hide-if-pose-not-valid', {
    _myHandedness: { type: WL.Type.Enum, values: ['left', 'right'], default: 'left' },
    _myHand: { type: WL.Type.Object }
}, {
    start() {
        this._myGamepad = PP.myGamepads[PP.InputUtils.getHandednessByIndex(this._myHandedness)];
        this._myGrabberHand = this._myHand.pp_getComponent("pp-grabber-hand");
    },
    update(dt) {
        if (this._myGamepad.getHandPose() != null) {
            if (this._myGamepad.getHandPose().isValid()) {
                this._myHand.pp_setActive(true);
            } else {
                if (this._myGrabberHand != null) {
                    this._myGrabberHand.throw();
                }

                this._myHand.pp_setActive(false);
            }
        }
    }
});