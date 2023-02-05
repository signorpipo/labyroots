WL.registerComponent('story', {
    _myOnlyVR: { type: WL.Type.Bool, default: true }
}, {
    init: function () {
    },
    start: function () {
        this._myStarted = false;
        this._myResetPhysx = true;
        this._myTimer = new PP.Timer(3);
    },
    update: function (dt) {
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
                if (this._myTimer.isDone()) {
                    Global.myAxe.pp_setActive(true);
                    Global.myReady = true;
                    Global.myMusicPlayer.play();
                }
            }
        }
    }
});

Global.myMusicPlayer = null;