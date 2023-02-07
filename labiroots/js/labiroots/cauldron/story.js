WL.registerComponent('story', {
    _myOnlyVR: { type: WL.Type.Bool, default: true }
}, {
    init: function () {
    },
    start: function () {
        this._myStarted = false;
        this._myResetPhysx = true;
        this._myTimer2 = new PP.Timer(4);
        this._myTimer = new PP.Timer(18);

        this._mySkip = false;
    },
    update: function (dt) {
        if (PP.myLeftGamepad.getButtonInfo(PP.GamepadButtonID.SELECT).isPressEnd(3) || PP.myLeftGamepad.getButtonInfo(PP.GamepadButtonID.SQUEEZE).isPressEnd(3) ||
            PP.myRightGamepad.getButtonInfo(PP.GamepadButtonID.SELECT).isPressEnd(3) || PP.myRightGamepad.getButtonInfo(PP.GamepadButtonID.SQUEEZE).isPressEnd(3)
        ) {
            this._mySkip = true;
        }


        if (!this._myStarted) {
            if (Global.myStoryReady) {
                if (PP.XRUtils.isSessionActive() || !this._myOnlyVR) {
                    this._myStarted = true;

                    Global.myMusicPlayer = PP.myAudioManager.createAudioPlayer(AudioID.MUSIC);
                }
            }
        } else {
            if (this._myResetActive) {
                this._myResetActive = false;
                let physxs = WL.scene.pp_getComponents("physx");
                for (let physx of physxs) {
                    physx.active = true;
                }
            }

            if (this._myResetPhysx) {
                this._myResetPhysx = false;
                this._myResetActive = true;

                let physxs = WL.scene.pp_getComponents("physx");
                for (let physx of physxs) {
                    if (physx.backupExtents != null) {
                        physx.extents = physx.backupExtents;
                        //physx.backupExtents.vec3_error();
                        physx.backupExtents = null;
                    }
                    physx.active = false;
                }
            }
            if (this._myTimer.isRunning()) {
                this._myTimer.update(dt);
                this._myTimer2.update(dt);
                if (this._myTimer.isDone() || (this._myTimer2.isDone() && this._mySkip)) {
                    this._myTimer.reset();
                    this._myTimer2.reset();
                    Global.myAxe.pp_setActive(true);
                    Global.myReady = true;
                    Global.myMusicPlayer.play();
                }
            }
        }
    }
});

Global.myMusicPlayer = null;