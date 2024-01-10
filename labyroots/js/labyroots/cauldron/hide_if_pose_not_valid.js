WL.registerComponent('hide-if-pose-not-valid', {
    _myHandedness: { type: WL.Type.Enum, values: ['left', 'right'], default: 'left' },
    _myHand: { type: WL.Type.Object }
}, {
    start() {
        this._myGamepad = PP.myGamepads[PP.InputUtils.getHandednessByIndex(this._myHandedness)];
        this._myGrabberHand = this._myHand.pp_getComponent("pp-grabber-hand");

        this.firstUpdate = true;
    },
    update(dt) {
        if (this.firstUpdate) {
            this.firstUpdate = false;
        } else {
            if (this._myGamepad.getHandPose() != null && this._myGamepad.getHandPose().isValid()) {
                //Do nothing
            } else {
                if (this._myGrabberHand != null) {
                    this._myGrabberHand.throw();
                }
            }
        }
    }
});