WL.registerComponent('story', {
    _myOnlyVR: { type: WL.Type.Bool, default: true }
}, {
    init: function () {
    },
    start: function () {
        this._myStarted = false;
        this._myTimer = new PP.Timer(1);
    },
    update: function (dt) {
        if (!this._myStarted) {
            if (Global.myStoryReady) {
                if (PP.XRUtils.isSessionActive() || !this._myOnlyVR) {
                    this._myStarted = true;
                }
            }
        } else {
            if (this._myTimer.isRunning()) {
                this._myTimer.update(dt);
                if (this._myTimer.isDone()) {
                    Global.myReady = true;
                }
            }
        }
    }
});